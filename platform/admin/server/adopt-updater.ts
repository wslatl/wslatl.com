import 'server-only'
import { randomBytes } from 'node:crypto'
import fs from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'
import { parseVersion } from '../version.mjs'
import { isBusy, updaterDir, updaterStatus } from './updater'

/**
 * The button on the Updates page's "The updater itself changed" notice.
 *
 * The supervisor runs from the uploaded folder, and no release replaces it
 * by itself, because it is what rolls a bad release back. So a release that
 * changes it needs its files copied over by someone who has seen that
 * release working. This does the copying when the admin asks:
 * scripts/serve.mjs and every file in scripts/updater/, at any depth, from
 * the live release to the uploaded folder. It runs in the site rather than
 * the supervisor, so a release can bring it to a server whose supervisor is
 * older. The new files are used from the next restart.
 *
 * Each path below carries the turbopackIgnore hint: every one is a folder
 * known only once the supervisor runs, and Turbopack would otherwise trace
 * the whole project for it. The calls go through the fs/promises object, so
 * a test can make one of them fail.
 */

export type AdoptResult = { ok: true; tag: string } | { ok: false; status: 409 | 500 | 503; error: string }

/** The updater's files in a scripts folder, relative to it. A Dirent says what the entry itself is, so a link is never followed. */
async function updaterFiles(scripts: string): Promise<string[]> {
  const entries = await fs.readdir(/* turbopackIgnore: true */ join(scripts, 'updater'), { withFileTypes: true, recursive: true })
  return ['serve.mjs', ...entries.filter((entry) => entry.isFile()).map((entry) => relative(scripts, join(entry.parentPath, entry.name)))]
}

/** Stops the copy when one of these is a link: through it, the files would come from, or land, somewhere else entirely. */
async function refuseLinks(paths: string[]) {
  for (const path of paths) {
    const stats = await fs.lstat(/* turbopackIgnore: true */ path).catch(() => null)
    if (stats?.isSymbolicLink()) throw new Error(`${path} is a link, and the updater is never copied through one`)
  }
}

async function sameFile(first: string, second: string): Promise<boolean> {
  const [a, b] = await Promise.all([
    fs.readFile(/* turbopackIgnore: true */ first),
    fs.readFile(/* turbopackIgnore: true */ second).catch(() => null),
  ])
  return b !== null && a.equals(b)
}

/** Copies a file, making its folder first: a release can bring a folder the uploaded copy does not have. */
async function copyInto(source: string, target: string) {
  await fs.mkdir(/* turbopackIgnore: true */ dirname(target), { recursive: true })
  await fs.copyFile(/* turbopackIgnore: true */ source, /* turbopackIgnore: true */ target)
}

const built = (dir: string) =>
  fs.stat(/* turbopackIgnore: true */ join(dir, '.next', 'BUILD_ID')).then(
    (stats) => stats.isFile(),
    () => false,
  )

// On globalThis, because Next may load this module more than once in one
// server, and two copies at once must still be impossible.
const copyingKey = Symbol.for('wslatl.admin.copyingUpdater')
const store = globalThis as typeof globalThis & { [copyingKey]?: boolean }

/**
 * One copy at a time: a press while another is copying is told so, since
 * two copies at once could each back up the other's half-written files.
 */
export async function adoptUpdater(dir = updaterDir()): Promise<AdoptResult> {
  if (store[copyingKey]) return { ok: false, status: 409, error: 'The updater is being copied already. Try again in a moment.' }
  store[copyingKey] = true
  try {
    return await copyUpdater(dir)
  } finally {
    store[copyingKey] = false
  }
}

async function copyUpdater(dir: string | null): Promise<AdoptResult> {
  // The supervisor always names <uploaded folder>/.updater. Anywhere else is
  // not a folder to go writing beside.
  if (!dir || basename(dir) !== '.updater') {
    return { ok: false, status: 503, error: 'This only works when the site is started with npm run serve.' }
  }
  const { pending, state } = await updaterStatus(dir)
  if (pending || isBusy(state)) {
    return { ok: false, status: 409, error: 'An update is running. Try again when it is done.' }
  }
  // Checked as a version, because the tag becomes part of a path.
  const tag = state?.current?.tag
  if (!tag || !parseVersion(tag)) {
    return { ok: false, status: 409, error: 'No release is installed, so there is no new updater to copy.' }
  }
  const live = join(dir, 'releases', tag)
  if (!(await built(live))) {
    return { ok: false, status: 409, error: `The build of ${tag} is not there any more, so there is no updater to copy from it.` }
  }

  const from = join(live, 'scripts')
  const to = join(dirname(dir), 'scripts')
  const backup = join(dir, 'updater-backup')
  const suffix = `.${randomBytes(6).toString('hex')}.tmp`
  const staged: string[] = []
  try {
    await refuseLinks([live, from, join(from, 'updater'), to, join(to, 'updater'), join(to, 'serve.mjs')])
    if (!(await fs.lstat(/* turbopackIgnore: true */ join(from, 'serve.mjs'))).isFile()) throw new Error(`${join(from, 'serve.mjs')} is not a file`)
    const wanted = await updaterFiles(from)
    const present = await updaterFiles(to).catch(() => ['serve.mjs'])
    const leftover = present.filter((file) => !wanted.includes(file))

    // Already copied: a second press must not put the new files in the backup.
    const same = await Promise.all(wanted.map((file) => present.includes(file) && sameFile(join(from, file), join(to, file))))
    if (leftover.length === 0 && same.every(Boolean)) return { ok: true, tag }

    await fs.rm(/* turbopackIgnore: true */ backup, { recursive: true, force: true })
    await Promise.all(
      present.map((file) =>
        copyInto(join(to, file), join(backup, file)).catch((error: NodeJS.ErrnoException) => {
          if (error.code !== 'ENOENT') throw error
        }),
      ),
    )

    // Every new file is written beside its place before any is moved in, so
    // a failure on the way leaves the folder as it was.
    for (const file of wanted) {
      const temporary = `${join(to, file)}${suffix}`
      staged.push(temporary)
      await copyInto(join(from, file), temporary)
    }
    try {
      for (const [index, file] of wanted.entries()) {
        await fs.rename(/* turbopackIgnore: true */ staged[index], /* turbopackIgnore: true */ join(to, file))
      }
      await Promise.all(leftover.map((file) => fs.rm(/* turbopackIgnore: true */ join(to, file), { force: true })))
    } catch (error) {
      // Moving in can fail part of the way, and half a new updater is worse
      // than the old one, so what was there goes back from the backup just
      // made, and a file the folder did not have is removed. If that fails
      // too there is nothing better to do, and the first failure is the one
      // to report.
      await Promise.all([
        ...present.map((file) =>
          fs.copyFile(/* turbopackIgnore: true */ join(backup, file), /* turbopackIgnore: true */ join(to, file)).catch(() => {}),
        ),
        ...wanted
          .filter((file) => !present.includes(file))
          .map((file) => fs.rm(/* turbopackIgnore: true */ join(to, file), { force: true }).catch(() => {})),
      ])
      throw error
    }
    return { ok: true, tag }
  } catch (error) {
    await Promise.all(staged.map((temporary) => fs.rm(/* turbopackIgnore: true */ temporary, { force: true })))
    return { ok: false, status: 500, error: `Could not copy the updater: ${error instanceof Error ? error.message : String(error)}` }
  }
}

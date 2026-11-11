import 'server-only'
import { randomBytes } from 'node:crypto'
import { copyFile, lstat, mkdir, readFile, readdir, rename, rm } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { busyStatuses, updaterDir, updaterStatus } from '@/lib/admin/updater'
import { parseVersion } from '@/scripts/updater/release.mjs'

/**
 * The button on the dashboard's "The updater itself changed" notice.
 *
 * The supervisor runs from the uploaded folder, and no release replaces it
 * by itself, because it is what rolls a bad release back. So a release that
 * changes it needs its files copied over by someone who has seen that release
 * working. This does the copying when the admin asks: scripts/serve.mjs and
 * the files directly in scripts/updater/, the list the supervisor compares
 * (supervisorChanged in scripts/updater/lib.mjs), from the live release to
 * the uploaded folder. It runs in this server rather than the supervisor, so
 * a release can bring it to a server whose supervisor is older. The new files
 * are used from the next restart.
 */

export type AdoptResult = { ok: true; tag: string } | { ok: false; status: 409 | 500 | 503; error: string }

/** The updater's files in a scripts folder, relative to it. A Dirent says what the entry itself is, so a link is never followed. */
async function updaterFiles(scripts: string): Promise<string[]> {
  const entries = await readdir(join(scripts, 'updater'), { withFileTypes: true })
  return ['serve.mjs', ...entries.filter((entry) => entry.isFile()).map((entry) => `updater/${entry.name}`)]
}

async function sameFile(first: string, second: string): Promise<boolean> {
  const [a, b] = await Promise.all([readFile(first), readFile(second).catch(() => null)])
  return b !== null && a.equals(b)
}

// On globalThis, because Next may load this module more than once in one server.
const copying = Symbol.for('wslatl.admin.copyingUpdater')
const store = globalThis as typeof globalThis & { [copying]?: boolean }

/**
 * One copy at a time: two presses at once would each back up the folder
 * while the other writes into it, and the backup could end up holding the
 * new files rather than the old ones.
 */
export async function adoptUpdater(dir = updaterDir()): Promise<AdoptResult> {
  if (store[copying]) return { ok: false, status: 409, error: 'The updater is being copied already.' }
  store[copying] = true
  try {
    return await adopt(dir)
  } finally {
    store[copying] = false
  }
}

async function adopt(dir: string | null): Promise<AdoptResult> {
  // The supervisor always names <uploaded folder>/.updater. Anywhere else is
  // not a folder to go writing beside.
  if (!dir || basename(dir) !== '.updater') {
    return { ok: false, status: 503, error: 'This only works when the site is started with npm run serve.' }
  }
  const { pending, state } = await updaterStatus(dir)
  if (pending || (state && busyStatuses.includes(state.status))) {
    return { ok: false, status: 409, error: 'An update is running. Try again when it is done.' }
  }
  // Only a version tag, the rule in scripts/updater/release.mjs: the tag
  // becomes part of a path, and nothing else can name one outside releases/.
  const tag = state?.current?.tag
  if (typeof tag !== 'string' || !parseVersion(tag)) {
    return { ok: false, status: 409, error: 'No release is installed, so there is no new updater to copy.' }
  }

  const from = join(dir, 'releases', tag, 'scripts')
  const to = join(dirname(dir), 'scripts')
  const backup = join(dir, 'updater-backup')
  const suffix = `.${randomBytes(6).toString('hex')}.tmp`
  const staged: string[] = []
  try {
    if (!(await lstat(join(from, 'serve.mjs'))).isFile()) throw new Error(`${join(from, 'serve.mjs')} is not a file`)
    const wanted = await updaterFiles(from)
    const present = await updaterFiles(to).catch(() => ['serve.mjs'])
    const leftover = present.filter((file) => !wanted.includes(file))

    // Already copied: a second press must not put the new files in the backup.
    const same = await Promise.all(wanted.map((file) => sameFile(join(from, file), join(to, file))))
    if (leftover.length === 0 && same.every(Boolean)) return { ok: true, tag }

    await rm(backup, { recursive: true, force: true })
    await mkdir(join(backup, 'updater'), { recursive: true })
    await Promise.all(
      present.map((file) =>
        copyFile(join(to, file), join(backup, file)).catch((error: NodeJS.ErrnoException) => {
          if (error.code !== 'ENOENT') throw error
        }),
      ),
    )

    // Every new file is written beside its place before any is moved in, so
    // a failure on the way leaves the folder as it was.
    await mkdir(join(to, 'updater'), { recursive: true })
    for (const file of wanted) {
      const temporary = `${join(to, file)}${suffix}`
      staged.push(temporary)
      await copyFile(join(from, file), temporary)
    }
    for (const [index, file] of wanted.entries()) await rename(staged[index], join(to, file))
    await Promise.all(leftover.map((file) => rm(join(to, file), { force: true })))
    return { ok: true, tag }
  } catch (error) {
    await Promise.all(staged.map((temporary) => rm(temporary, { force: true })))
    return { ok: false, status: 500, error: `Could not copy the updater: ${error instanceof Error ? error.message : error}` }
  }
}

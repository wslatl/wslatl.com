/**
 * Keeps the files of earlier builds in .next/static for 30 days.
 *
 * `next build` empties .next/static, and every stylesheet and script in it
 * has a hashed name that changes when its content does. Google fetches a
 * page's HTML on one day and renders it later, sometimes weeks later, with
 * the files that HTML names. If a rebuild has deleted them by then, Google
 * renders the page without its stylesheet: an unstyled list of links, which
 * is what URL Inspection showed in October 2026. Browsers that loaded a page
 * just before a rebuild hit the same 404s.
 *
 * So `npm run build` runs this twice (package.json):
 *   save     before the build: drops anything in .next-static-history/ that
 *            has not been live for 30 days, then copies in the files the
 *            last build made, stamped with today's date. The date says when
 *            a file was last live, not when it was built: a file built 40
 *            days ago that the site still serves today must survive this
 *            build.
 *   restore  after the build: copies those files back into .next/static,
 *            never over a file the new build wrote, and lists the ones it
 *            put back in .next/restored-assets.json (outside .next/static,
 *            so it is never served).
 *
 * The list is what lets old files go. After a restore, .next/static holds
 * the old files beside the build's own; stamped as live along with them at
 * the next save, they would never reach 30 days, and the history would grow
 * with every build. The updater leaves them out for the same reason when it
 * hands the live build's files to a new release (scripts/updater/lib.mjs).
 *
 * Old files are only ever served to a page that asks for them by name, so
 * keeping them changes nothing for anyone on the current build.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

// The project folder; tests pass a temporary one as the second argument.
const root = process.argv[3] ?? join(import.meta.dirname, '..')
const live = join(root, '.next', 'static')
const restoredList = join(root, '.next', 'restored-assets.json')
// The updater (scripts/serve.mjs) builds every release in a folder of its
// own and points them all at the one history beside .env.
const history = process.env.STATIC_HISTORY_DIR ? resolve(process.env.STATIC_HISTORY_DIR) : join(root, '.next-static-history')
const keepFor = 30 * 24 * 60 * 60 * 1000

/** Every file under dir, as a path relative to it with forward slashes. */
function filesIn(dir, prefix = '') {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) files.push(...filesIn(join(dir, entry.name), name))
    else files.push(name)
  }
  return files
}

function prune(dir, cutoff) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      prune(path, cutoff)
      if (readdirSync(path).length === 0) rmSync(path, { recursive: true })
    } else if (statSync(path).mtimeMs < cutoff) {
      rmSync(path)
    }
  }
}

/** The files the last restore put back; none if it left no list (a build from before the list). */
function putBack() {
  try {
    const list = JSON.parse(readFileSync(restoredList, 'utf8'))
    return new Set(Array.isArray(list) ? list : [])
  } catch {
    return new Set()
  }
}

const mode = process.argv[2]

if (mode === 'save') {
  if (existsSync(history)) prune(history, Date.now() - keepFor)
  if (existsSync(live)) {
    const old = putBack()
    const now = new Date()
    for (const name of filesIn(live)) {
      if (old.has(name)) continue
      const to = join(history, name)
      mkdirSync(dirname(to), { recursive: true })
      copyFileSync(join(live, name), to)
      // Today's date, set here: a copy keeps the original's on Windows.
      utimesSync(to, now, now)
    }
  }
} else if (mode === 'restore') {
  if (existsSync(live)) {
    const added = []
    if (existsSync(history)) {
      for (const name of filesIn(history)) {
        const to = join(live, name)
        // The new build wrote it: its own file, live again.
        if (existsSync(to)) continue
        const from = join(history, name)
        mkdirSync(dirname(to), { recursive: true })
        copyFileSync(from, to)
        const { atime, mtime } = statSync(from)
        utimesSync(to, atime, mtime)
        added.push(name)
      }
    }
    writeFileSync(restoredList, `${JSON.stringify(added)}\n`)
  }
} else {
  console.error('Usage: node scripts/keep-old-assets.mjs save|restore')
  process.exit(1)
}

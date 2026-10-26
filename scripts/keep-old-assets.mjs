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
 *            has not been live for 30 days, then copies .next/static in,
 *            stamped with today's date. The date says when a file was last
 *            live, not when it was built: a file built 40 days ago that the
 *            site still serves today must survive this build.
 *   restore  after the build: copies those files back into .next/static,
 *            never over a file the new build wrote.
 *
 * Old files are only ever served to a page that asks for them by name, so
 * keeping them changes nothing for anyone on the current build.
 */
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

// The project folder; tests pass a temporary one as the second argument.
const root = process.argv[3] ?? join(import.meta.dirname, '..')
const live = join(root, '.next', 'static')
const history = join(root, '.next-static-history')
const keepFor = 30 * 24 * 60 * 60 * 1000

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

const mode = process.argv[2]

if (mode === 'save') {
  if (existsSync(history)) prune(history, Date.now() - keepFor)
  if (existsSync(live)) cpSync(live, history, { recursive: true })
} else if (mode === 'restore') {
  if (existsSync(history) && existsSync(live)) {
    cpSync(history, live, { recursive: true, force: false, errorOnExist: false, preserveTimestamps: true })
  }
} else {
  console.error('Usage: node scripts/keep-old-assets.mjs save|restore')
  process.exit(1)
}

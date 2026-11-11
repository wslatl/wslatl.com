// The files and folders production never uses: the tests, CI and editor
// settings, the test and lint configs, reports and build caches. The updater
// deletes them from each release once it is built, before its trial start,
// so the trial proves the release still starts without them
// (scripts/updater/lib.mjs, runUpdate), and from the uploaded folder at
// every start-up (cleanUpAtStart), apart from what its own build and the
// live site use. Kept apart so the tests can check the list and drive the
// deleting (tests/updater-prune.test.ts).
import { lstat, rm, unlink } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Relative to the folder, with forward slashes. Fixed names only, never a
 * pattern: vitest.config is spelled out in each form Vitest reads.
 */
export const devOnlyPaths = Object.freeze([
  'tests',
  '.github',
  '.vscode',
  'coverage',
  'lighthouse-reports',
  'vitest.config.ts',
  'vitest.config.mts',
  'vitest.config.cts',
  'vitest.config.js',
  'vitest.config.mjs',
  'vitest.config.cjs',
  'eslint.config.mjs',
  '.oxlintrc.json',
  '.gitleaks.toml',
  '.gitleaksignore',
  'lighthouserc.json',
  'lychee.toml',
  'tsconfig.tsbuildinfo',
  '.next/cache',
])

/**
 * Never touched in the uploaded folder, with all they hold: its packages and
 * build (the build at start-up and the live site use them), the settings,
 * the shared asset history, the supervisor's own scripts and the releases.
 */
export const uploadedFolderKeeps = Object.freeze(['node_modules', '.next', '.env', '.next-static-history', 'scripts', '.updater'])

/**
 * True for names joined by forward slashes, none of them made of dots alone:
 * nothing absolute, no way up and out, no pattern.
 * @param {string} path
 */
export const plainPath = (path) => path.split('/').every((name) => /^[\w.-]+$/.test(name) && !/^\.+$/.test(name))

const within = (/** @type {string} */ path, /** @type {string} */ folder) => path === folder || path.startsWith(`${folder}/`)

/**
 * The first folder on the way to a path that is a link, or '' when there is
 * none. lstat never follows a link.
 * @param {string} dir
 * @param {string[]} names
 */
async function linkOnTheWay(dir, names) {
  for (let end = 1; end < names.length; end++) {
    if ((await lstat(join(dir, ...names.slice(0, end)))).isSymbolicLink()) return names.slice(0, end).join('/')
  }
  return ''
}

/**
 * Deletes each path in devOnlyPaths that dir holds, except those in keep.
 * Links are never followed, so nothing outside dir is ever deleted: a link
 * in a listed path's place is deleted itself, never what it points at, and a
 * path inside a link (.next/cache when .next is one) is left alone. A path
 * that cannot be deleted is logged and left. It never throws, so it can stop
 * neither an update nor the start-up.
 * @param {string} dir
 * @param {(line: string) => void} print
 * @param {readonly string[]} [keep] paths in dir never touched, with all they hold
 * @returns {Promise<string[]>} the paths deleted
 */
export async function removeDevFiles(dir, print, keep = []) {
  const say = (/** @type {string} */ line) => {
    try {
      print(line)
    } catch {
      // A closed stdout is no reason to stop.
    }
  }
  /** @type {string[]} */
  const removed = []
  for (const path of devOnlyPaths) {
    if (!plainPath(path) || keep.some((kept) => within(path, kept))) continue
    const names = path.split('/')
    const target = join(dir, ...names)
    try {
      const link = await linkOnTheWay(dir, names)
      if (link) {
        say(`Left ${path} alone: ${link} is a link, and links are never followed.`)
        continue
      }
      if ((await lstat(target)).isSymbolicLink()) await unlink(target)
      else await rm(target, { recursive: true, force: true, maxRetries: 3 })
      removed.push(path)
    } catch (error) {
      // Not there, or a folder on the way is a file: nothing to delete.
      const code = /** @type {any} */ (error)?.code
      if (code !== 'ENOENT' && code !== 'ENOTDIR') say(`Could not delete ${path}: ${error instanceof Error ? error.message : error}`)
    }
  }
  return removed
}

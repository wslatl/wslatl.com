// The updater's logic, kept apart from scripts/serve.mjs so the tests can
// drive it with fake GitHub, npm and servers.
//
// It installs GitHub releases, never a branch: the latest release (GitHub
// skips drafts and pre-releases there), tagged vMAJOR.MINOR.PATCH, and only
// when it is newer than the installed one (scripts/updater/release.mjs). The
// tag is resolved to its commit once, as a tag, when the update starts, and
// that exact commit is downloaded, so a tag moved meanwhile cannot swap in
// other code. Every file of the download is checked against GitHub's own
// record of that commit before anything is built (scripts/updater/github.mjs).
//
// Layout, all inside the folder the site was uploaded to:
//
//   .env                     settings; never touched
//   .next-static-history/    earlier builds' assets; shared by every build
//   .updater/state.json      what the updater is doing (read by /admin)
//   .updater/request.json    written by /admin to ask for an update
//   .updater/npm-cache/      npm's download cache, only while an update runs
//   .updater/releases/<tag>  one folder per installed release: its files,
//                            node_modules and .next, built where it runs,
//                            then pruned of what production never uses.
//                            Named by tag, not commit: two releases may tag
//                            the same commit, and an installed tag is never
//                            installed again, so a new folder never lands on
//                            the live one or the one before it.
//
// An app with a database keeps it in updater.dataDir, outside all of these,
// and the database step's backups go in <dataDir>/backups/.
//
// Until the first update, the site runs from the uploaded folder itself.
// After that it runs from the current release, and the previous one is kept
// for one more update. An update builds the new release beside the live
// one, prunes it, changes the database if the release asks for that
// (backup first), starts it once on a spare local port as a trial, and only
// then stops the live server and starts the new one on the real port. If
// that fails, the old release starts again.
//
// What the app's platform.config.mjs asks for beyond that (its `updater`
// settings, scripts/updater/config.mjs) comes from the release being
// installed. With no such file, an update runs exactly as the main
// website's always has.
//
// The site's own server code may import this file (an admin reading
// state.json), so it never reads platform.config.mjs itself: serve.mjs does,
// through deps.settings.
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { dataDirProblem, defaultSettings } from './config.mjs'
import { removeDevFiles, uploadedFolderKeeps } from './dev-files.mjs'
import { buildSettings, kitSecrets, withoutSecrets } from './env.mjs'
import { formatDuration, messageOf } from './process.mjs'
import { isNewer, parseVersion, tagRule } from './release.mjs'

export { loadEnvFile, withoutSecrets } from './env.mjs'

/**
 * @typedef {'pending' | 'running' | 'done' | 'failed' | 'skipped'} StepState
 * @typedef {'download' | 'install' | 'build' | 'prune' | 'migrate' | 'check' | 'switch'} StepId
 * @typedef {{ tag: string, name: string, publishedAt: string, draft: boolean, prerelease: boolean }} LatestRelease
 * @typedef {{ tag: string, sha: string, name: string, publishedAt: string }} Release
 * @typedef {Release & { deployedAt: string }} Installed
 * @typedef {{
 *   status: string,
 *   current: Installed | null,
 *   previous: Installed | null,
 *   target: Release | null,
 *   steps: Partial<Record<StepId, StepState>>,
 *   startedAt: string | null,
 *   finishedAt: string | null,
 *   message: string,
 *   log: string[],
 *   updaterChanged?: boolean,
 *   withdrawn?: string[],
 *   watchSince?: string | null,
 *   backup?: string | null,
 * }} State
 * @typedef {State} UpdateState the same, by the name the knowledge base's admin imports
 * @typedef {Installed} InstalledRelease
 * @typedef {ReturnType<typeof updaterPaths>} Paths
 * @typedef {import('./env.mjs').Env} Env
 * @typedef {(line: string) => void} OnLine
 * @typedef {import('./config.mjs').UpdaterSettings} UpdaterSettings
 * @typedef {{
 *   latest: () => Promise<LatestRelease | null>,
 *   resolve: (tag: string) => Promise<string>,
 *   download: (sha: string, dest: string) => Promise<void>,
 *   npm: (args: string[], options: { cwd: string, env: Env, onLine: OnLine }) => Promise<void>,
 *   trial: (dir: string, onLine: OnLine) => Promise<boolean>,
 *   switchTo: (dir: string, onLine: OnLine) => Promise<boolean>,
 *   print: OnLine,
 *   settings?: (dir: string) => Promise<Readonly<UpdaterSettings>>,
 *   watch?: () => void,
 * }} Deps
 */

/** The statuses while an update runs. Every admin knows these five, so no other is ever written. */
export const busyStatuses = ['downloading', 'installing', 'building', 'checking', 'swapping']

/** The steps of every update, in order. An app with updater.migrate also gets 'migrate', between prune and check. */
export const stepIds = /** @type {StepId[]} */ (['download', 'install', 'build', 'prune', 'check', 'switch'])

const logLines = 200

/** How many of the database step's backups are kept, newest first. Older ones the updater made are deleted. */
export const backupsKept = 5

/**
 * @param {string} root the folder the site was uploaded to
 * @param {string} [dir] where the updater keeps its files: .updater/ there, unless told otherwise
 */
export function updaterPaths(root, dir = join(root, '.updater')) {
  return {
    root,
    dir,
    state: join(dir, 'state.json'),
    request: join(dir, 'request.json'),
    releases: join(dir, 'releases'),
    npmCache: join(dir, 'npm-cache'),
    history: join(root, '.next-static-history'),
  }
}

/**
 * A release's folder, named by its tag. Throws for anything that is not a
 * version tag, so no tag, from GitHub or from a state file edited by hand,
 * can name a path outside the releases.
 * @param {Paths} paths
 * @param {string} tag
 */
export function releaseDir(paths, tag) {
  if (!parseVersion(tag)) throw new Error(`"${String(tag).slice(0, 60)}" is not a release tag (${tagRule}).`)
  return join(paths.releases, tag)
}

/** @param {string} sha */
const short = (sha) => sha.slice(0, 7)

/** @returns {Record<StepId, StepState>} */
const pendingSteps = () => /** @type {Record<StepId, StepState>} */ (Object.fromEntries(stepIds.map((id) => [id, 'pending'])))

/** @returns {State} */
export function emptyState() {
  return {
    status: 'idle',
    current: null,
    previous: null,
    target: null,
    steps: pendingSteps(),
    startedAt: null,
    finishedAt: null,
    message: '',
    log: [],
  }
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * The state on disk. A missing or broken file reads as a fresh one, and
 * steps or a log that are not what the updater writes read as none, so a
 * file edited by hand cannot stop the supervisor.
 * @param {Paths} paths
 * @returns {State}
 */
export function readState(paths) {
  try {
    const saved = JSON.parse(readFileSync(paths.state, 'utf8'))
    if (!isObject(saved)) return emptyState()
    const state = { ...emptyState(), ...saved }
    if (!isObject(state.steps)) state.steps = pendingSteps()
    if (!Array.isArray(state.log)) state.log = []
    return /** @type {State} */ (state)
  } catch {
    return emptyState()
  }
}

/** @param {State} state */
export const isBusy = (state) => busyStatuses.includes(state.status)

/**
 * The releases a crash took back out, which are never installed again.
 * Read with care: state.json can be edited by hand, and the admin reads it too.
 * @param {State} state
 * @returns {string[]}
 */
export function withdrawnTags(state) {
  return Array.isArray(state.withdrawn) ? state.withdrawn.filter((tag) => typeof tag === 'string') : []
}

/** @param {number} ms */
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)

/** @param {() => void} action */
const quietly = (action) => {
  try {
    action()
  } catch {
    // Best effort: only ever cleaning up.
  }
}

/**
 * Written whole and renamed into place, so /admin never reads half a file.
 * Windows refuses the rename while /admin happens to be reading the file, so
 * it is tried a few times, and only then written in place (/admin reads a
 * broken file as no state, once). When even the whole new file cannot be
 * written (a full disk), state.json is left exactly as it was. It never
 * throws: a state file that cannot be written must not stop the supervisor,
 * and with it the site. False when nothing was written.
 * @param {Paths} paths
 * @param {State} state
 * @returns {boolean}
 */
export function writeState(paths, state) {
  const text = JSON.stringify(state, null, 2)
  const temporary = `${paths.state}.${process.pid}.tmp`
  const failed = (/** @type {unknown} */ error) => {
    quietly(() => rmSync(temporary, { force: true }))
    console.error(`Could not write ${paths.state}: ${messageOf(error)}`)
    return false
  }
  try {
    mkdirSync(paths.dir, { recursive: true })
    writeFileSync(temporary, text)
  } catch (error) {
    return failed(error)
  }
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      renameSync(temporary, paths.state)
      return true
    } catch (error) {
      if (!['EPERM', 'EACCES', 'EBUSY'].includes(/** @type {NodeJS.ErrnoException} */ (error).code ?? '')) return failed(error)
      pause(20 * attempt)
    }
  }
  try {
    writeFileSync(paths.state, text)
    quietly(() => rmSync(temporary, { force: true }))
    return true
  } catch (error) {
    return failed(error)
  }
}

/**
 * True when state.json is there but cannot be read: it no longer says which
 * release is live.
 * @param {Paths} paths
 */
export function stateIsDamaged(paths) {
  if (!existsSync(paths.state)) return false
  try {
    return !isObject(JSON.parse(readFileSync(paths.state, 'utf8')))
  } catch {
    return true
  }
}

/**
 * Asks the supervisor for an update, as /admin's Install button and the
 * console's update command do: request.json, which it looks for every two
 * seconds. Created only when none is waiting, in one step, so two requests
 * at once cannot both get through. The supervisor never reads what is in it.
 * @param {Paths} paths
 * @param {string} by who asked, for the record
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export function requestUpdate(paths, by) {
  if (isBusy(readState(paths))) return { ok: false, reason: 'An update is already running.' }
  try {
    mkdirSync(paths.dir, { recursive: true })
    writeFileSync(paths.request, JSON.stringify({ requestedAt: new Date().toISOString(), by: String(by).slice(0, 200) }), { flag: 'wx' })
    return { ok: true }
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'EEXIST') return { ok: false, reason: 'An update is already waiting to start.' }
    return { ok: false, reason: `Could not ask for an update: ${messageOf(error)}` }
  }
}

/**
 * The folder the site runs from: the current release when it is built, else the uploaded folder.
 * @param {Paths} paths
 * @param {State} state
 */
export function liveDir(paths, state) {
  const tag = state.current?.tag
  if (tag && parseVersion(tag)) {
    const dir = releaseDir(paths, tag)
    if (existsSync(join(dir, '.next', 'BUILD_ID'))) return dir
  }
  return paths.root
}

/** A name that can only be a folder directly inside releases/: no slash, no way up. @param {string} name */
const releaseFolderName = (name) => /^[\w.-]+$/.test(name) && !/^\.+$/.test(name)

/**
 * Deleted without blocking: a release holds hundreds of megabytes of
 * node_modules, and the supervisor has a site to keep running meanwhile.
 * Never the installed release, the one before it, or a folder in spare (the
 * one actually served, which a stale state.json may not name), and never
 * anything but a folder directly inside releases/.
 * @param {Paths} paths
 * @param {State} state
 * @param {string | undefined} name a folder name in releases/, which is a tag
 * @param {string[]} [spare]
 */
async function removeRelease(paths, state, name, spare = []) {
  if (!name || !releaseFolderName(name)) return
  const kept = [state.current?.tag, state.previous?.tag]
  const dir = join(paths.releases, name)
  if (!kept.includes(name) && !spare.includes(dir)) await rm(dir, { recursive: true, force: true, maxRetries: 3 })
}

/**
 * Removes every release but the current one, the previous one, and any
 * folder in spare.
 * @param {Paths} paths
 * @param {State} state
 * @param {string[]} [spare]
 */
export async function pruneReleases(paths, state, spare = []) {
  if (!existsSync(paths.releases)) return
  for (const name of readdirSync(paths.releases)) await removeRelease(paths, state, name, spare)
}

/**
 * Run at start-up once the site is starting: deletes from the uploaded
 * folder what production never uses, and removes half-built and old
 * releases. No release is removed when state.json is damaged, since an
 * empty state would have every release deleted, the live one included.
 * @param {Paths} paths
 * @param {State} state
 * @param {OnLine} print
 */
export async function cleanUpAtStart(paths, state, print) {
  // Left by an update the server was stopped in the middle of.
  await rm(paths.npmCache, { recursive: true, force: true, maxRetries: 3 }).catch(() => {})
  // Never its node_modules or .next: the build at start-up needs the
  // devDependencies, and the uploaded folder may be what is serving. Never
  // in a git checkout (.git is a folder, or a file in a worktree): that is a
  // working copy npm run serve is tried out in, and it needs its tests.
  if (existsSync(join(paths.root, '.git'))) {
    print('The uploaded folder is a git checkout, so its tests and dev configs were left alone. Releases are still pruned.')
  } else {
    const removed = await removeDevFiles(paths.root, print, uploadedFolderKeeps)
    if (removed.length) print(`Deleted from the uploaded folder what production never uses: ${removed.join(', ')}`)
  }
  if (stateIsDamaged(paths)) {
    print('.updater/state.json is damaged, so no release was removed. The site runs from the uploaded folder until the next update writes the file again.')
    return
  }
  await pruneReleases(paths, state)
}

/**
 * scripts/serve.mjs and every file directly in scripts/updater/, as paths
 * relative to base. The folder stays flat: "Copy the new updater" copies
 * just these.
 * @param {string} base
 */
const updaterFiles = (base) => {
  const updater = join(base, 'scripts', 'updater')
  const names = existsSync(updater) ? readdirSync(updater).filter((name) => statSync(join(updater, name)).isFile()) : []
  return ['scripts/serve.mjs', ...names.map((name) => `scripts/updater/${name}`)]
}

/** A file's text with Windows line endings made plain, or null when it is not there. @param {string} path */
const plainText = (path) => (existsSync(path) ? readFileSync(path, 'utf8').replaceAll('\r\n', '\n') : null)

/** @param {string} dir */
const built = (dir) => existsSync(join(dir, '.next', 'BUILD_ID'))

/**
 * True when the release carries a different updater than the one running,
 * which always runs from the uploaded folder: scripts/serve.mjs or any file
 * in scripts/updater/. Line endings aside: a copy uploaded from Windows has
 * CRLF, GitHub's LF.
 * @param {string} root the uploaded folder
 * @param {string} dir the live folder
 */
export function supervisorChanged(root, dir) {
  if (dir === root) return false
  return [...new Set([...updaterFiles(root), ...updaterFiles(dir)])].some((file) => plainText(join(root, file)) !== plainText(join(dir, file)))
}

/**
 * Writes the live release's version into the uploaded folder's package.json,
 * the one people see when they open the server's files. Releases install into
 * folders of their own, so it would otherwise go on saying whichever version
 * was uploaded by hand. Only the top-level version value changes. It never
 * throws: a number in a file is no reason to stop the site.
 * @param {string} root the uploaded folder
 * @param {string} dir the live folder
 * @param {OnLine} print
 */
export function syncUploadedVersion(root, dir, print) {
  if (dir === root) return
  const say = (/** @type {string} */ line) => {
    try {
      print(line)
    } catch {
      // A closed stdout is no reason to stop.
    }
  }
  const file = join(root, 'package.json')
  const temporary = `${file}.${process.pid}.tmp`
  try {
    const { version } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    if (!parseVersion(`v${version}`)) throw new Error(`the release says its version is ${JSON.stringify(version)}`)
    const text = readFileSync(file, 'utf8')
    const uploaded = JSON.parse(text)
    if (uploaded.version === version) return
    // The first "version" in the file may be a nested one, so each is tried
    // until the only thing that differs is the top-level value.
    const wanted = JSON.stringify({ ...uploaded, version })
    for (const match of text.matchAll(/("version"\s*:\s*")[^"]*"/g)) {
      const start = match.index + match[1].length
      const updated = `${text.slice(0, start)}${version}${text.slice(match.index + match[0].length - 1)}`
      if (JSON.stringify(JSON.parse(updated)) === wanted) {
        writeFileSync(temporary, updated)
        renameSync(temporary, file)
        say(`The uploaded folder's package.json now says version ${version}.`)
        return
      }
    }
    throw new Error('it has no version to change')
  } catch (error) {
    say(`Could not update the version in the uploaded folder's package.json: ${messageOf(error)}`)
  } finally {
    quietly(() => rmSync(temporary, { force: true }))
  }
}

/**
 * When the crash watch for the live release started, if it still runs: only
 * for a release an update installed (watchSince, which a rollback clears),
 * only while it is what dir serves, and only within windowMs of its install.
 * Null otherwise. Used at start-up, so a restart keeps the watch.
 * @param {Paths} paths
 * @param {State} state
 * @param {string} dir the folder served
 * @param {number} windowMs
 * @param {number} [now]
 * @returns {number | null}
 */
export function crashWatchSince(paths, state, dir, windowMs, now = Date.now()) {
  const since = Date.parse(state.watchSince ?? '')
  if (!state.current || !parseVersion(state.current.tag) || dir !== releaseDir(paths, state.current.tag)) return null
  return Number.isFinite(since) && since <= now && now - since < windowMs ? since : null
}

/**
 * An update the server was restarted in the middle of, marked as failed. A
 * database step it cut short is named, with its backup.
 * @param {State} state
 * @returns {State}
 */
function cutShort(state) {
  const steps = { ...state.steps }
  const migrating = steps.migrate === 'running'
  for (const id of /** @type {StepId[]} */ (Object.keys(steps))) {
    if (steps[id] === 'running') steps[id] = 'failed'
    else if (steps[id] === 'pending') steps[id] = 'skipped'
  }
  const database = !migrating
    ? ''
    : state.backup
      ? ` It was changing the database, which may be half changed: the backup from just before is in ${state.backup}.`
      : ' It was backing up the database, which it had not changed yet.'
  return {
    ...state,
    status: 'failed',
    steps,
    finishedAt: new Date().toISOString(),
    message: `The server restarted in the middle of an update, so the update stopped. The site is on the version it had before.${database}`,
  }
}

/**
 * Run at start-up, before the site starts. An update the server was
 * restarted in the middle of is over: the site starts on the release it had.
 * The half-built release is left to pruneReleases, once the site is up.
 * @param {Paths} paths
 * @returns {State}
 */
export function recoverState(paths) {
  // Half-written files from a process that stopped between write and rename.
  if (existsSync(paths.dir)) {
    for (const name of readdirSync(paths.dir)) if (name.endsWith('.tmp')) rmSync(join(paths.dir, name), { force: true })
  }
  const state = readState(paths)
  if (!isBusy(state)) return state
  const recovered = cutShort(state)
  writeState(paths, recovered)
  return recovered
}

/**
 * Writes recoverState's verdict again while state.json still says an update
 * runs: the write at start-up did not get through (a full disk, say), and
 * until it does, /admin shows an update running and refuses Install, and no
 * update can start. The supervisor tries once its start-up clean-up has made
 * room, then every minute. Half-written files are left alone here: by now
 * /admin may be in the middle of writing one.
 * @param {Paths} paths
 * @returns {boolean} true once state.json no longer says an update runs
 */
export function retryRecoverState(paths) {
  const state = readState(paths)
  return !isBusy(state) || writeState(paths, cutShort(state))
}

/**
 * The old assets a build's history step put back into its .next/static
 * after the build (scripts/keep-old-assets.mjs lists them in
 * .next/restored-assets.json), as paths relative to .next/static with
 * forward slashes. None when the build left no list.
 * @param {string} dir
 * @returns {Set<string>}
 */
export function restoredAssets(dir) {
  try {
    const list = JSON.parse(readFileSync(join(dir, '.next', 'restored-assets.json'), 'utf8'))
    return new Set(Array.isArray(list) ? list.filter((name) => typeof name === 'string') : [])
  } catch {
    return new Set()
  }
}

/**
 * A package.json's name and its scripts. Empty when it cannot be read.
 * @param {string} dir
 * @returns {{ name: string | null, scripts: Record<string, unknown> }}
 */
function packageOf(dir) {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    return { name: typeof pkg?.name === 'string' ? pkg.name : null, scripts: isObject(pkg?.scripts) ? pkg.scripts : {} }
  } catch {
    return { name: null, scripts: {} }
  }
}

/** A folder name for a backup: the release it was made for and when, such as v1.2.0-20261110T231500Z. */
const backupFolder = /^v\d+\.\d+\.\d+-(\d{8}T\d{6}Z)$/

/**
 * Deletes all but the newest backupsKept backups in folder, and only those
 * the updater made: folders named like backupFolder, never a link and never
 * anything else.
 * @param {string} folder
 * @param {OnLine} print
 */
async function pruneBackups(folder, print) {
  try {
    const made = readdirSync(folder)
      .filter((name) => backupFolder.test(name) && lstatSync(join(folder, name)).isDirectory())
      .toSorted((a, b) => (/** @type {RegExpExecArray} */ (backupFolder.exec(b)))[1].localeCompare(/** @type {RegExpExecArray} */ (backupFolder.exec(a))[1]))
    for (const name of made.slice(backupsKept)) await rm(join(folder, name), { recursive: true, force: true, maxRetries: 3 })
  } catch (error) {
    print(`Could not remove an old backup: ${messageOf(error)}`)
  }
}

/**
 * One update, start to finish. Every outside effect comes in `deps`:
 *   latest()                      GitHub's latest release, or null when none
 *   resolve(tag)                  the commit the tag points at, now
 *   download(sha, dest)           that commit's files into dest, each one
 *                                 checked against GitHub's record of it
 *   settings(dir)                 the updater settings in dest's platform.config.mjs
 *   npm(args, { cwd, env, onLine })
 *   trial(dir, onLine)            start dir on a spare port: did it answer?
 *   switchTo(dir, onLine)         make dir the live server: did it answer?
 *   watch()                       watch what was just switched to for crashes
 *   print(line)                   the server log
 * baseEnv is the panel's variables, which npm runs with less secretNames.
 * fileEnv is .env: with baseEnv over it, it is where updater.buildEnv,
 * BUILD_WORKERS and the database step's settings come from. serving is the
 * folder the supervisor actually serves from: a failed switch goes back to
 * it, nothing deletes it, and a release counts as installed only when its
 * folder is the one served, so a lost or stale state.json is never taken for
 * the truth about what runs. inUse are the folders the processes beside the
 * website run from, which nothing deletes either. redact hides the token in
 * what is logged. Returns the final state, which is also on disk.
 * @param {{ paths: Paths, deps: Deps, baseEnv: Env, secretNames: string[], fileEnv?: Env, serving?: string | null, inUse?: string[], redact?: (line: string) => string }} options
 * @returns {Promise<State>}
 */
export async function runUpdate({ paths, deps, baseEnv, secretNames, fileEnv = {}, serving = null, inUse = [], redact = (line) => line }) {
  let state = readState(paths)
  if (isBusy(state)) return state

  // The folder is known only at run time. The hint stops an app that bundles
  // this file from tracing the whole project for it, as the admin's own
  // paths do (platform/admin/server/adopt-updater.ts).
  const live = serving && existsSync(/* turbopackIgnore: true */ serving) ? serving : liveDir(paths, state)
  const spare = [live, ...inUse]
  // The release running now: the state's current one, or the one before when
  // a rollback could not be recorded, but only if its folder is the one
  // served. A folder the state does not describe (uploaded by hand, or a
  // lost state.json) is none.
  const runningRelease =
    [state.current, state.previous].find((release) => release && parseVersion(release.tag) && releaseDir(paths, release.tag) === live) ?? null
  let finished = false
  // Neither the log nor the state file may stop an update.
  const print = (/** @type {string} */ line) => {
    try {
      deps.print(redact(line))
    } catch {
      // A closed stdout is no reason to give up.
    }
  }
  let saved = true
  const save = (/** @type {Partial<State>} */ patch) => {
    state = { ...state, ...patch }
    saved = writeState(paths, state)
  }
  const log = (/** @type {string} */ line) => {
    const safe = redact(line)
    print(safe)
    // A line from a process that outlived its update (a build stopped too
    // late) is printed only: the state now belongs to what runs after it.
    if (!finished) save({ log: [...state.log, safe.slice(0, 500)].slice(-logLines) })
  }
  const step = (/** @type {StepId} */ id, /** @type {StepState} */ value, /** @type {string} */ status = '') =>
    save({ steps: { ...state.steps, [id]: value }, ...(status && { status }) })

  save({
    status: 'downloading',
    target: null,
    steps: pendingSteps(),
    startedAt: new Date().toISOString(),
    finishedAt: null,
    message: '',
    log: [],
    backup: null,
    // A release whose build is gone is no longer installed: the site runs
    // from the uploaded folder, and a failed build of the same tag must not
    // be taken for it at the next start.
    ...(live === paths.root && { current: null }),
  })
  // Taken only now, so /admin never sees the request gone and the state idle.
  rmSync(paths.request, { force: true })

  const finish = (/** @type {string} */ status, /** @type {string} */ message) => {
    const steps = { ...state.steps }
    for (const id of /** @type {StepId[]} */ (Object.keys(steps))) if (steps[id] === 'pending') steps[id] = 'skipped'
    save({ status, message: redact(message), steps, finishedAt: new Date().toISOString() })
    print(message)
    return state
  }
  const discard = (/** @type {string | undefined} */ tag) =>
    removeRelease(paths, state, tag, spare).catch((error) => print(`Could not remove a release: ${messageOf(error)}`))
  // A switch that throws is a switch that failed: the rollback still runs.
  const switchTo = async (/** @type {string} */ dir) => {
    try {
      return await deps.switchTo(dir, log)
    } catch (error) {
      log(`The switch failed: ${messageOf(error)}`)
      return false
    }
  }
  /**
   * An npm step, with how long it took in the log: how close a build comes
   * to its limit (UPDATE_STEP_MINUTES) is what says the limit needs raising.
   * @param {string} name
   * @param {string[]} args
   * @param {{ cwd: string, env: Env }} options
   */
  const timed = async (name, args, { cwd, env }) => {
    const started = Date.now()
    try {
      await deps.npm(args, { cwd, env, onLine: log })
    } catch (error) {
      log(`${name} stopped after ${formatDuration(Date.now() - started)}.`)
      throw error
    }
    log(`${name} took ${formatDuration(Date.now() - started)}.`)
  }

  async function attempt() {
    /** @type {string | null} */
    let release = null
    /** @type {StepId} */
    let stage = 'download'
    const installed = runningRelease
    const before = installed ? installed.tag : 'the version it had'
    try {
      step('download', 'running')
      const latest = await deps.latest()
      if (!latest) {
        step('download', 'skipped')
        return finish('idle', 'No releases published yet, so there is nothing to install.')
      }
      if (latest.draft || latest.prerelease) {
        throw new Error(`${latest.tag} is a draft or a pre-release, and those are never installed.`)
      }
      if (!parseVersion(latest.tag)) {
        throw new Error(`The latest release is tagged "${latest.tag.slice(0, 60)}", not ${tagRule}, so it was not installed.`)
      }
      if (withdrawnTags(state).includes(latest.tag)) {
        step('download', 'skipped')
        return finish('idle', `${latest.tag} was taken back out after it kept stopping, so it is not installed again. Publish the fix as a newer release.`)
      }
      if (installed && !isNewer(latest.tag, installed.tag)) {
        step('download', 'skipped')
        return finish(
          'idle',
          latest.tag === installed.tag
            ? `Already on ${installed.tag}, the latest release.`
            : `The latest release, ${latest.tag}, is older than ${installed.tag}, so nothing was installed.`,
        )
      }
      // Never build into the folder being served, which a lost or stale
      // state.json could make look like a release still to install.
      if (releaseDir(paths, latest.tag) === live) {
        step('download', 'skipped')
        return finish('idle', `${latest.tag} is the release already running, so nothing was installed.`)
      }
      // Pinned here, once: from now on only this commit is used, wherever the
      // tag points later.
      const sha = await deps.resolve(latest.tag)
      if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`GitHub gave no commit for ${latest.tag}.`)
      const head = { tag: latest.tag, sha, name: latest.name, publishedAt: latest.publishedAt }
      save({ target: head })
      log(`Installing ${head.tag} (commit ${short(sha)})${head.name && head.name !== head.tag ? `: ${head.name}` : ''}`)
      // Room first. While this one builds, only it, the live release and the
      // uploaded folder are on the disk: a server over its disk limit is
      // stopped by Pterodactyl. Rollback goes to the live release, never to
      // the one before it, which goes now, along with any other folder (one
      // taken back out after it kept stopping, say).
      if (state.previous) save({ previous: null })
      await pruneReleases(paths, state, spare).catch((error) => print(`Could not remove an old release: ${messageOf(error)}`))
      release = releaseDir(paths, head.tag)
      await rm(release, { recursive: true, force: true, maxRetries: 3 })
      mkdirSync(release, { recursive: true })
      await deps.download(head.sha, release)
      if (!existsSync(join(release, 'package.json'))) throw new Error('The download has no package.json.')
      // A release names its app in package.json. One with another name is
      // another app, from a GITHUB_REPO that points at the wrong repository.
      const site = packageOf(paths.root)
      const incoming = packageOf(release)
      if (site.name && incoming.name !== site.name) {
        throw new Error(
          `The release's package.json names the app ${JSON.stringify(incoming.name ?? '')}, and this site is ${JSON.stringify(site.name)}, so it was not installed. Check GITHUB_REPO in .env.`,
        )
      }
      /** @type {Readonly<UpdaterSettings>} */
      let settings = defaultSettings
      if (deps.settings) {
        try {
          settings = await deps.settings(release)
        } catch (error) {
          throw new Error(`The release's platform.config.mjs cannot be used, so it was not installed. ${messageOf(error)}`, { cause: error })
        }
      }
      const placement = dataDirProblem(paths.root, settings.dataDir)
      if (placement) throw new Error(`${placement} Nothing was installed.`)
      // Every npm script the settings name, before anything is run.
      for (const name of [...settings.afterInstall, ...(settings.migrate ? [settings.migrate.backup, settings.migrate.apply] : [])]) {
        if (!Object.hasOwn(incoming.scripts, name)) {
          throw new Error(`platform.config.mjs names the npm script ${name}, which the release's package.json does not have, so nothing was installed.`)
        }
      }
      if (settings.migrate) {
        const { check, switch: last, ...rest } = state.steps
        save({ steps: { ...rest, migrate: 'pending', check, switch: last } })
      }
      // The live build's own assets, so the build's history step stamps them
      // as still live (scripts/keep-old-assets.mjs). Not the old ones put
      // back beside them: stamped as live, those would never reach their 30
      // days, and the history would grow with every release.
      const liveStatic = join(live, '.next', 'static')
      if (existsSync(liveStatic)) {
        const putBack = restoredAssets(live)
        cpSync(liveStatic, join(release, '.next', 'static'), {
          recursive: true,
          filter: (from) => !putBack.has(relative(liveStatic, from).split(sep).join('/')),
        })
      }
      step('download', 'done')

      // No install scripts: they are where a compromised package strikes.
      // Only the packages updater.installScripts names run theirs, after
      // npm ci, and with npm ci's environment. npm's cache lives under
      // .updater/ and goes after the update, so it never grows into the
      // server's disk limit.
      const env = { ...withoutSecrets(baseEnv, secretNames), npm_config_cache: paths.npmCache }
      const buildEnv = { ...env, ...buildSettings(fileEnv, baseEnv, settings.buildEnv) }
      stage = 'install'
      step('install', 'running', 'installing')
      await timed('npm ci', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: release, env })
      if (settings.installScripts.length > 0) {
        for (const name of settings.installScripts) {
          if (!existsSync(join(release, 'node_modules', ...name.split('/'), 'package.json'))) {
            throw new Error(`updater.installScripts names ${name}, which the release does not install.`)
          }
        }
        log(`Running the install scripts of ${settings.installScripts.join(', ')}, which updater.installScripts allows.`)
        await timed('npm rebuild', ['rebuild', ...settings.installScripts, '--foreground-scripts'], { cwd: release, env })
      }
      // Each with what the build gets: none of .env but what updater.buildEnv lists.
      for (const name of settings.afterInstall) await timed(`npm run ${name}`, ['run', name], { cwd: release, env: buildEnv })
      step('install', 'done')

      stage = 'build'
      step('build', 'running', 'building')
      await timed('npm run build', ['run', 'build'], {
        cwd: release,
        env: { ...buildEnv, SITE_COMMIT: head.sha, SITE_RELEASE: head.tag, STATIC_HISTORY_DIR: paths.history },
      })
      step('build', 'done')

      // Before the trial start, so the trial proves the release starts
      // without them: the files production never uses
      // (scripts/updater/dev-files.mjs), then the devDependencies, which
      // only the build and the checks need. npm prune gets npm ci's
      // environment and time limit. Its status is 'installing', one of the
      // busy statuses every admin knows.
      stage = 'prune'
      step('prune', 'running', 'installing')
      const removed = await removeDevFiles(release, log)
      if (removed.length) log(`Deleted what production never uses: ${removed.join(', ')}`)
      await timed('npm prune', ['prune', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: release, env })
      step('prune', 'done')

      // The database step, before the trial, so the trial runs the new code
      // on the database it will have. The version running now goes on
      // serving meanwhile, so every change must be one it still works with:
      // add, never drop or rename. That is also what lets a rollback go back
      // to it. A backup comes first, into a folder of its own in
      // <dataDir>/backups, and must not be empty.
      if (settings.migrate) {
        const { backup, apply } = settings.migrate
        stage = 'migrate'
        step('migrate', 'running', 'swapping')
        const backups = join(/** @type {string} */ (settings.dataDir), 'backups')
        const folder = join(backups, `${head.tag}-${new Date().toISOString().replaceAll(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}`)
        mkdirSync(folder, { recursive: true })
        const databaseEnv = {
          ...withoutSecrets({ ...fileEnv, ...baseEnv }, [...kitSecrets, 'UPDATER_DIR']),
          npm_config_cache: paths.npmCache,
          PLATFORM_BACKUP_DIR: folder,
        }
        log(`Backing up the database into ${folder}.`)
        try {
          await timed(`npm run ${backup}`, ['run', backup], { cwd: release, env: databaseEnv })
        } catch (error) {
          throw new Error(`The database backup failed, so the database was not changed. ${messageOf(error)}`, { cause: error })
        }
        if (readdirSync(folder).length === 0) throw new Error(`npm run ${backup} wrote nothing into ${folder}, so the database was not changed.`)
        save({ backup: folder })
        try {
          await timed(`npm run ${apply}`, ['run', apply], { cwd: release, env: databaseEnv })
        } catch (error) {
          throw new Error(`Changing the database failed, so the site stays on ${before}. The backup from just before is in ${folder}. ${messageOf(error)}`, {
            cause: error,
          })
        }
        step('migrate', 'done')
        await pruneBackups(backups, print)
      }

      stage = 'check'
      step('check', 'running', 'checking')
      if (!(await deps.trial(release, log))) {
        throw new Error(`The new build did not start on its trial run, so the site stays on ${before}.`)
      }
      step('check', 'done')

      stage = 'switch'
      step('switch', 'running', 'swapping')
      if (!(await switchTo(release))) {
        step('switch', 'failed')
        const back = await switchTo(live)
        // Kept when the release before did not come back: something may
        // still run from the new one until the restart the message asks
        // for, and the start-up clean-up removes it then.
        if (back) await discard(head.tag)
        return finish(
          'rolled-back',
          back
            ? `The new build stopped answering after the switch, so the site went back to ${before}.`
            : `The new build stopped answering after the switch, and ${before} did not come back either. Restart the server.`,
        )
      }
    } catch (error) {
      step(stage, 'failed')
      if (release) await discard(state.target?.tag)
      return finish('failed', messageOf(error))
    }

    // Switched. Recorded in one write, before anything else can go wrong, so a
    // crash from here on still leaves the state matching what runs.
    const target = /** @type {Release} */ (state.target)
    const now = new Date().toISOString()
    const message = `Installed ${target.tag} (commit ${short(target.sha)}).`
    save({
      status: 'idle',
      message,
      finishedAt: now,
      steps: { ...state.steps, switch: 'done' },
      previous: runningRelease,
      current: { ...target, deployedAt: now },
      target: null,
      // Watched for crashes from now, across a restart of the server too.
      watchSince: now,
      // A withdrawn release older than this one can no longer be offered.
      withdrawn: withdrawnTags(state).filter((tag) => isNewer(tag, target.tag)),
    })
    finished = true
    // Watched from here, not once the update returns: the release is live
    // already, and the clean-up below can take a while. A stop meanwhile
    // counts, within the ten minutes the switch started.
    try {
      deps.watch?.()
    } catch (error) {
      print(`Could not watch the new release for crashes: ${messageOf(error)}`)
    }
    print(message)
    await pruneReleases(paths, state).catch((error) => print(`Could not remove an old release: ${messageOf(error)}`))
    return state
  }

  try {
    return await attempt()
  } finally {
    finished = true
    await rm(paths.npmCache, { recursive: true, force: true, maxRetries: 3 }).catch(() => {})
    // The last state could not be written (a full disk, most likely); the
    // npm cache just freed some room, so it is tried once more. Left as it
    // is, the file would still say the update runs: the dashboard would
    // wait on it and refuse another, and a restart would take it for
    // interrupted and serve the release from before.
    if (!saved && !writeState(paths, state)) {
      print(`Could not save the updater's state to ${paths.state} (is the disk full?). Free some space and restart the server: until it is saved, the dashboard and the next start see the state from before this update.`)
    }
  }
}

/**
 * Goes back to the release before the live one, or to the uploaded folder
 * when the live release was the first: after a new release stopped three
 * times within ten minutes of its switch (crashed: true), or from the
 * console's rollback command. serving is the folder actually served (what
 * runs, crashing or not). The rollback is recorded only once the older
 * release answers; if it does not, the folder that was served starts again
 * and the state stays as it was. A crash rollback also remembers the tag it
 * left, which is then never installed again (publish the fix as a newer
 * release). Each update removes the release before the live one to make
 * room, so after one the only earlier build may be the uploaded folder,
 * which can be months old: that is used only with allowUpload (the
 * console's "rollback upload", and a crash rollback, which says so). The
 * database is never put back: the release gone back to works with it as it
 * is, since every change is one the version before still works with.
 * deps: switchTo and print, as for runUpdate.
 * @param {{ paths: Paths, deps: Pick<Deps, 'switchTo' | 'print'>, reason: string, crashed?: boolean, serving?: string | null, allowUpload?: boolean }} options
 * @returns {Promise<{ ok: boolean, message: string }>}
 */
export async function rollBack({ paths, deps, reason, crashed = false, serving = null, allowUpload = false }) {
  const state = readState(paths)
  if (isBusy(state)) return { ok: false, message: 'An update is running, so nothing was rolled back.' }
  // Known only at run time, as in runUpdate.
  const from = serving && existsSync(/* turbopackIgnore: true */ serving) ? serving : liveDir(paths, state)
  const leaving = state.current && parseVersion(state.current.tag) && releaseDir(paths, state.current.tag) === from ? state.current : null
  if (!leaving) return { ok: false, message: 'The site does not run an installed release, so there is nothing to go back to.' }
  const previous = state.previous && parseVersion(state.previous.tag) ? releaseDir(paths, state.previous.tag) : null
  const target = previous && built(previous) ? previous : built(paths.root) ? paths.root : null
  if (!target) return { ok: false, message: 'There is no earlier build to go back to.' }
  if (target === paths.root && !allowUpload) {
    return {
      ok: false,
      message:
        'The release before this one is gone (each update removes it to make room), so the only earlier build is the uploaded folder, which may be much older. Type "rollback upload" to go back to it anyway.',
    }
  }

  const say = (/** @type {string} */ line) => {
    try {
      deps.print(line)
    } catch {
      // A closed stdout is no reason to give up.
    }
  }
  const switchTo = async (/** @type {string} */ dir) => {
    try {
      return await deps.switchTo(dir, say)
    } catch (error) {
      say(`The switch failed: ${messageOf(error)}`)
      return false
    }
  }
  const back = target === paths.root ? null : state.previous
  const name = back ? back.tag : 'the uploaded folder'
  if (!(await switchTo(target))) {
    const restored = await switchTo(from)
    const message = restored
      ? `${reason} ${name} did not answer, so ${leaving.tag} is still live.`
      : `${reason} ${name} did not answer, and ${leaving.tag} did not come back either. Restart the server.`
    say(message)
    return { ok: false, message }
  }
  const now = new Date().toISOString()
  const message = back
    ? `${reason} The site went back to ${name}.`
    : `${reason} With no release before it left, the site went back to the uploaded folder, which may be older than the last release.`
  writeState(paths, {
    ...state,
    status: 'rolled-back',
    message,
    current: back ? { ...back, deployedAt: now } : null,
    // Only a release an update installed is watched for crashes: what a
    // rollback goes back to is not, so a restart cannot arm the watch for it.
    previous: null,
    target: null,
    watchSince: null,
    // Every release a crash took back out, not only the last one.
    withdrawn: crashed ? [...new Set([...withdrawnTags(state), leaving.tag])] : withdrawnTags(state),
    // The steps and log were the update that installed what was left: not this.
    steps: pendingSteps(),
    startedAt: null,
    log: [],
    finishedAt: now,
  })
  say(message)
  return { ok: true, message }
}

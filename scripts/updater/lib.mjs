// The updater's logic, kept apart from scripts/serve.mjs so the tests can
// drive it with fake GitHub, npm and servers (tests/updater.test.ts).
//
// It installs GitHub releases, never a branch: the latest release (GitHub
// skips drafts and pre-releases there), tagged vMAJOR.MINOR.PATCH, and only
// when it is newer than the installed one (scripts/updater/release.mjs). The
// tag is resolved to its commit once, when the update starts, and that exact
// commit is downloaded, so a tag moved meanwhile cannot swap in other code.
//
// Layout, all inside the folder the site was uploaded to:
//
//   .env                     settings; never touched
//   .next-static-history/    earlier builds' assets; shared by every build
//   .updater/state.json      what the updater is doing (read by /admin)
//   .updater/request.json    written by /admin to ask for an update
//   .updater/npm-cache/      npm's download cache, only while an update runs
//   .updater/releases/<tag>  one folder per installed release: its files,
//                            node_modules and .next, built where it runs.
//                            Named by tag, not commit: two releases may tag
//                            the same commit, and an installed tag is never
//                            installed again, so a new folder never lands on
//                            the live one or the one before it.
//
// Until the first update, the site runs from the uploaded folder itself.
// After that it runs from the current release, and the previous one is kept
// for one more update. An update builds the new release beside the live
// one, starts it once on a spare local port as a trial, and only then stops
// the live server and starts the new one on the real port. If that fails,
// the old release starts again.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { isNewer, parseVersion, tagRule } from './release.mjs'

/**
 * @typedef {'pending' | 'running' | 'done' | 'failed' | 'skipped'} StepState
 * @typedef {{ tag: string, name: string, publishedAt: string, draft: boolean, prerelease: boolean }} LatestRelease
 * @typedef {{ tag: string, sha: string, name: string, publishedAt: string }} Release
 * @typedef {Release & { deployedAt: string }} Installed
 * @typedef {{
 *   status: string,
 *   current: Installed | null,
 *   previous: Installed | null,
 *   target: Release | null,
 *   steps: Record<string, StepState>,
 *   startedAt: string | null,
 *   finishedAt: string | null,
 *   message: string,
 *   log: string[],
 *   updaterChanged?: boolean,
 * }} State
 * @typedef {ReturnType<typeof updaterPaths>} Paths
 * @typedef {Record<string, string | undefined>} Env
 * @typedef {(line: string) => void} OnLine
 * @typedef {{
 *   latest: () => Promise<LatestRelease | null>,
 *   resolve: (tag: string) => Promise<string>,
 *   download: (sha: string, dest: string) => Promise<void>,
 *   npm: (args: string[], options: { cwd: string, env: Env, onLine: OnLine }) => Promise<void>,
 *   trial: (dir: string, onLine: OnLine) => Promise<boolean>,
 *   switchTo: (dir: string, onLine: OnLine) => Promise<boolean>,
 *   print: OnLine,
 * }} Deps
 */

export const busyStatuses = ['downloading', 'installing', 'building', 'checking', 'swapping']
export const stepIds = ['download', 'install', 'build', 'check', 'switch']

const logLines = 200

/** @param {string} root */
export function updaterPaths(root) {
  const dir = join(root, '.updater')
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
 * A release's folder, named by its tag. Only ever called with a tag that
 * parseVersion accepted, so it cannot name a path outside the folder.
 * @param {Paths} paths
 * @param {string} tag
 */
export function releaseDir(paths, tag) {
  return join(paths.releases, tag)
}

const short = (/** @type {string} */ sha) => sha.slice(0, 7)

/** @returns {State} */
export function emptyState() {
  return {
    status: 'idle',
    current: null,
    previous: null,
    target: null,
    steps: Object.fromEntries(stepIds.map((id) => [id, 'pending'])),
    startedAt: null,
    finishedAt: null,
    message: '',
    log: [],
  }
}

/**
 * @param {Paths} paths
 * @returns {State}
 */
export function readState(paths) {
  try {
    return { ...emptyState(), ...JSON.parse(readFileSync(paths.state, 'utf8')) }
  } catch {
    return emptyState()
  }
}

const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)

const quietly = (/** @type {() => void} */ action) => {
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
  const failed = (/** @type {any} */ error) => {
    quietly(() => rmSync(temporary, { force: true }))
    console.error(`Could not write ${paths.state}: ${error.message}`)
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
      if (!['EPERM', 'EACCES', 'EBUSY'].includes(/** @type {any} */ (error).code)) return failed(error)
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
    const state = JSON.parse(readFileSync(paths.state, 'utf8'))
    return state === null || typeof state !== 'object' || Array.isArray(state)
  } catch {
    return true
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

/**
 * Deleted without blocking: a release holds hundreds of megabytes of
 * node_modules, and the supervisor has a site to keep running meanwhile.
 * Never the installed release or the one before it.
 * @param {Paths} paths
 * @param {State} state
 * @param {string | undefined} name a folder name in releases/, which is a tag
 */
async function removeRelease(paths, state, name) {
  if (!name) return
  const kept = [state.current?.tag, state.previous?.tag]
  if (!kept.includes(name)) await rm(join(paths.releases, name), { recursive: true, force: true, maxRetries: 3 })
}

/**
 * Removes every release but the current and the previous one.
 * @param {Paths} paths
 * @param {State} state
 */
export async function pruneReleases(paths, state) {
  if (!existsSync(paths.releases)) return
  for (const name of readdirSync(paths.releases)) await removeRelease(paths, state, name)
}

/**
 * Run at start-up once the site is starting: removes half-built and old
 * releases. Not when state.json is damaged, since an empty state would have
 * every release deleted, the live one included.
 * @param {Paths} paths
 * @param {State} state
 * @param {OnLine} print
 */
export async function cleanUpAtStart(paths, state, print) {
  if (stateIsDamaged(paths)) {
    print('.updater/state.json is damaged, so no release was removed. The site runs from the uploaded folder until the next update writes the file again.')
    return
  }
  await pruneReleases(paths, state)
}

/** scripts/serve.mjs and every file in scripts/updater/, as paths relative to base. */
const updaterFiles = (/** @type {string} */ base) => {
  const updater = join(base, 'scripts', 'updater')
  const names = existsSync(updater) ? readdirSync(updater).filter((name) => statSync(join(updater, name)).isFile()) : []
  return ['scripts/serve.mjs', ...names.map((name) => `scripts/updater/${name}`)]
}

/** A file's text with Windows line endings made plain, or null when it is not there. */
const plainText = (/** @type {string} */ path) => (existsSync(path) ? readFileSync(path, 'utf8').replaceAll('\r\n', '\n') : null)

const built = (/** @type {string} */ dir) => existsSync(join(dir, '.next', 'BUILD_ID'))

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
  return [...new Set([...updaterFiles(root), ...updaterFiles(dir)])].some(
    (file) => plainText(join(root, file)) !== plainText(join(dir, file)),
  )
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
  if (!busyStatuses.includes(state.status)) return state
  for (const id of stepIds) {
    if (state.steps[id] === 'running') state.steps[id] = 'failed'
    else if (state.steps[id] === 'pending') state.steps[id] = 'skipped'
  }
  const recovered = {
    ...state,
    status: 'failed',
    finishedAt: new Date().toISOString(),
    message: 'The server restarted in the middle of an update, so the update stopped. The site is on the version it had before.',
  }
  writeState(paths, recovered)
  return recovered
}

/**
 * Settings from .env never reach npm: any package's install script can read the environment.
 * @param {Env} env
 * @param {string[]} secretNames
 * @returns {Env}
 */
export function withoutSecrets(env, secretNames) {
  return Object.fromEntries(Object.entries(env).filter(([name]) => !secretNames.includes(name)))
}

/**
 * One update, start to finish. Every outside effect comes in `deps`:
 *   latest()                      GitHub's latest release, or null when none
 *   resolve(tag)                  the commit the tag points at, now
 *   download(sha, dest)           that commit's files into dest
 *   npm(args, { cwd, env, onLine })
 *   trial(dir, onLine)            start dir on a spare port: did it answer?
 *   switchTo(dir, onLine)         make dir the live server: did it answer?
 *   print(line)                   the server log
 * Returns the final state, which is also on disk.
 * @param {{ paths: Paths, deps: Deps, baseEnv: Env, secretNames: string[] }} options
 * @returns {Promise<State>}
 */
export async function runUpdate({ paths, deps, baseEnv, secretNames }) {
  let state = readState(paths)
  if (busyStatuses.includes(state.status)) return state

  const live = liveDir(paths, state)
  let finished = false
  // Neither the log nor the state file may stop an update.
  const print = (/** @type {string} */ line) => {
    try {
      deps.print(line)
    } catch {
      // A closed stdout is no reason to give up.
    }
  }
  const save = (/** @type {Partial<State>} */ patch) => {
    state = { ...state, ...patch }
    writeState(paths, state)
  }
  const log = (/** @type {string} */ line) => {
    print(line)
    // A line from a process that outlived its update (a build stopped too
    // late) is printed only: the state now belongs to what runs after it.
    if (!finished) save({ log: [...state.log, line.slice(0, 500)].slice(-logLines) })
  }
  const step = (/** @type {string} */ id, /** @type {StepState} */ value, /** @type {string} */ status = '') =>
    save({ steps: { ...state.steps, [id]: value }, ...(status && { status }) })

  save({
    status: 'downloading',
    target: null,
    steps: emptyState().steps,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    message: '',
    log: [],
    // A release whose build is gone is no longer installed: the site runs
    // from the uploaded folder, and a failed build of the same tag must not
    // be taken for it at the next start.
    ...(live === paths.root && { current: null }),
  })
  // Taken only now, so /admin never sees the request gone and the state idle.
  rmSync(paths.request, { force: true })

  const finish = (/** @type {string} */ status, /** @type {string} */ message) => {
    const steps = { ...state.steps }
    for (const id of stepIds) if (steps[id] === 'pending') steps[id] = 'skipped'
    save({ status, message, steps, finishedAt: new Date().toISOString() })
    print(message)
    return state
  }
  const discard = (/** @type {string | undefined} */ tag) =>
    removeRelease(paths, state, tag).catch((error) => print(`Could not remove a release: ${error.message}`))
  // A switch that throws is a switch that failed: the rollback still runs.
  const switchTo = async (/** @type {string} */ dir) => {
    try {
      return await deps.switchTo(dir, log)
    } catch (error) {
      log(`The switch failed: ${error instanceof Error ? error.message : error}`)
      return false
    }
  }

  async function attempt() {
    /** @type {string | null} */
    let release = null
    let running = 'download'
    /** @type {Installed | null} */
    let installed = null
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
      // What runs now, as a release; a folder uploaded by hand is none.
      installed = live !== paths.root && state.current && parseVersion(state.current.tag ?? '') ? state.current : null
      if (installed && !isNewer(latest.tag, installed.tag)) {
        step('download', 'skipped')
        return finish(
          'idle',
          latest.tag === installed.tag
            ? `Already on ${installed.tag}, the latest release.`
            : `The latest release, ${latest.tag}, is older than ${installed.tag}, so nothing was installed.`,
        )
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
      // the previous one.
      if (state.previous) {
        const previous = state.previous.tag
        save({ previous: null })
        await discard(previous)
      }
      release = releaseDir(paths, head.tag)
      await rm(release, { recursive: true, force: true, maxRetries: 3 })
      mkdirSync(release, { recursive: true })
      await deps.download(head.sha, release)
      // The live build's assets, so the build's history step stamps them as
      // still live (scripts/keep-old-assets.mjs).
      const liveStatic = join(live, '.next', 'static')
      if (existsSync(liveStatic)) cpSync(liveStatic, join(release, '.next', 'static'), { recursive: true })
      step('download', 'done')

      // No install scripts: they are where a compromised package strikes, and
      // the site needs none (sharp and the compilers ship prebuilt binaries).
      // npm's cache lives under .updater/ and goes after the update, so it
      // never grows into the server's disk limit.
      const env = { ...withoutSecrets(baseEnv, secretNames), npm_config_cache: paths.npmCache }
      running = 'install'
      step('install', 'running', 'installing')
      await deps.npm(['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: release, env, onLine: log })
      step('install', 'done')

      running = 'build'
      step('build', 'running', 'building')
      await deps.npm(['run', 'build'], {
        cwd: release,
        env: { ...env, SITE_COMMIT: head.sha, SITE_RELEASE: head.tag, STATIC_HISTORY_DIR: paths.history },
        onLine: log,
      })
      step('build', 'done')

      running = 'check'
      step('check', 'running', 'checking')
      if (!(await deps.trial(release, log))) {
        throw new Error(`The new build did not start on its trial run, so the site stays on ${installed ? installed.tag : 'the version it had'}.`)
      }
      step('check', 'done')

      running = 'switch'
      step('switch', 'running', 'swapping')
      if (!(await switchTo(release))) {
        step('switch', 'failed')
        const back = await switchTo(live)
        await discard(head.tag)
        const before = installed ? installed.tag : 'the version it had'
        return finish(
          'rolled-back',
          back
            ? `The new build stopped answering after the switch, so the site went back to ${before}.`
            : `The new build stopped answering after the switch, and ${before} did not come back either. Restart the server.`,
        )
      }
    } catch (error) {
      step(running, 'failed')
      if (release) await discard(state.target?.tag)
      return finish('failed', error instanceof Error ? error.message : String(error))
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
      previous: state.current,
      current: { ...target, deployedAt: now },
      target: null,
    })
    print(message)
    await pruneReleases(paths, state).catch((error) => print(`Could not remove an old release: ${error.message}`))
    return state
  }

  try {
    return await attempt()
  } finally {
    finished = true
    await rm(paths.npmCache, { recursive: true, force: true, maxRetries: 3 }).catch(() => {})
  }
}

/**
 * Goes back to the release before the live one, or to the uploaded folder
 * when the live release was the first: after a new release stopped three
 * times within ten minutes of its switch (scripts/updater/live.mjs), or from
 * the console's rollback command. deps: switchTo and print, as for runUpdate.
 * @param {{ paths: Paths, deps: Pick<Deps, 'switchTo' | 'print'>, reason: string }} options
 * @returns {Promise<{ ok: boolean, message: string }>}
 */
export async function rollBack({ paths, deps, reason }) {
  const state = readState(paths)
  if (busyStatuses.includes(state.status)) return { ok: false, message: 'An update is running, so nothing was rolled back.' }
  const live = liveDir(paths, state)
  if (live === paths.root || !state.current) {
    return { ok: false, message: 'The site runs the uploaded folder, so there is nothing to go back to.' }
  }
  const previous = state.previous && parseVersion(state.previous.tag) ? releaseDir(paths, state.previous.tag) : null
  const target = previous && built(previous) ? previous : built(paths.root) ? paths.root : null
  if (!target) return { ok: false, message: 'There is no earlier build to go back to.' }

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
      say(`The switch failed: ${error instanceof Error ? error.message : error}`)
      return false
    }
  }
  const from = state.current.tag
  const back = target === paths.root ? null : state.previous
  const name = back ? back.tag : 'the uploaded folder'
  const finishedAt = new Date().toISOString()
  if (!(await switchTo(target))) {
    const restored = await switchTo(live)
    const message = restored
      ? `${reason} Going back to ${name} failed, so ${from} is still live.`
      : `${reason} Going back to ${name} failed, and ${from} did not come back either. Restart the server.`
    writeState(paths, { ...state, message, finishedAt })
    say(message)
    return { ok: false, message }
  }
  const message = `${reason} The site went back to ${name}.`
  writeState(paths, { ...state, status: 'rolled-back', current: back, previous: null, message, finishedAt })
  say(message)
  return { ok: true, message }
}

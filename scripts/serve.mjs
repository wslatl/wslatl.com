// The production entry point: `npm run serve`, the server's startup command.
//
// It runs `next start` and keeps it running, and it is what lets /admin
// update the site from GitHub: the admin writes .updater/request.json, and
// this process downloads the latest GitHub release (only a newer one, and
// only one tagged vMAJOR.MINOR.PATCH), installs and builds it in a folder of
// its own, deletes from it what production never uses, starts it once on a
// spare local port to be sure it answers, and only then restarts the site
// on it. A failure at any step leaves the site as it was, and a new release
// that stops three times within ten minutes of its switch is replaced by the
// one before. The steps and the folders are in scripts/updater/lib.mjs; the
// setup is in the README, "Admin and updates" and "Releasing".
//
// The server console takes commands: status, update, rollback, restart,
// stop and help.
//
// Settings come from .env beside this repository (the same file Next
// reads). Only `next start` is given them; npm never is.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { parseEnv } from 'node:util'
import { busyFlag } from './updater/busy.mjs'
import {
  busyStatuses,
  cleanUpAtStart,
  crashWatchSince,
  liveDir,
  readState,
  recoverState,
  rollBack,
  runUpdate,
  supervisorChanged,
  updaterPaths,
  writeState,
} from './updater/lib.mjs'
import { crashWindowMs, liveServer } from './updater/live.mjs'
import { answers, eachLine, freePort, run, stopProcess, waitForFreePort } from './updater/process.mjs'

const root = join(import.meta.dirname, '..')
const paths = updaterPaths(root)
const envFile = join(root, '.env')
const dotenv = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {}
// The panel's own variables win over .env, as they do for Next.
const setting = (name, fallback = '') => (process.env[name] ?? dotenv[name] ?? fallback).trim()

const port = Number(setting('SERVER_PORT') || setting('PORT') || 3000)
const github = {
  token: setting('GITHUB_TOKEN'),
  repo: setting('GITHUB_REPO', 'wslatl/wslatl.com'),
  api: setting('GITHUB_API_URL', 'https://api.github.com').replace(/\/+$/, ''),
}
const secretNames = [...new Set(['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN', ...Object.keys(dotenv)])]
const updatesOn = Boolean(github.token)

function print(line) {
  console.log(`${new Date().toISOString()} [updater] ${line}`)
}

// ----- Child processes -----

const children = new Set()

function track(child) {
  children.add(child)
  const forget = () => children.delete(child)
  child.once('exit', forget)
  child.once('error', forget)
  return child
}

// `npm run serve` names npm's own script, which runs on this same Node.
// Started some other way, fall back to npm on the PATH (a shell on Windows,
// where npm is a .cmd). Each run is stopped with everything it started after
// 15 minutes (scripts/updater/process.mjs), unless it says otherwise.
function npm(args, options) {
  const cli = process.env.npm_execpath
  if (cli && /\.c?js$/.test(cli)) return run(process.execPath, [cli, ...args], { ...options, onSpawn: track })
  return run('npm', args, { ...options, onSpawn: track, shell: process.platform === 'win32' })
}

// Started exactly like the live server: no -H. Bound to 127.0.0.1, Next
// takes the proxy's rewrite for one to another host and answers / with a
// redirect to itself, which failed every trial start.
function startNext(dir, { port: listen, env, onLine }) {
  const args = [join(dir, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(listen)]
  const child = track(
    spawn(process.execPath, args, { cwd: dir, env, stdio: ['ignore', onLine ? 'pipe' : 'inherit', onLine ? 'pipe' : 'inherit'] }),
  )
  eachLine(child.stdout, onLine)
  eachLine(child.stderr, onLine)
  return child
}

// ----- The live server -----

// The panel's variables win over .env here too, as they do in Next.
const serverEnv = { ...dotenv, ...process.env, ...(updatesOn && { UPDATER_DIR: paths.dir }) }
let shuttingDown = false

const live = liveServer({
  start: (dir) => startNext(dir, { port, env: serverEnv }),
  stop: (child) => stopProcess(child),
  print,
  onCrashLoop: (dir) => void crashLoop(dir),
})

// Held by start-up (until its build and clean-up are done), updates,
// rollbacks and restarts: whatever holds it owns the live server
// (scripts/updater/busy.mjs).
const busy = busyFlag({
  // A release that kept stopping while the site was busy goes back now, if
  // it is still what runs: an update may have replaced it.
  onCrashLoopDue: (dir) => {
    if (!shuttingDown && live.current?.dir === dir) void crashLoop(dir)
  },
  ensureServing,
})

/**
 * Starts the live server again when nothing serves: after an update or a
 * rollback that ended that way. Never while the busy flag is held, since its
 * holder owns the live server and may be stopping it on purpose.
 */
function ensureServing() {
  if (shuttingDown || busy.held) return
  if (live.ensure(liveDir(paths, readState(paths)))) print('Nothing was serving, so the site was started again.')
}

/**
 * Makes dir the live server, and says whether it answers. A restart of the
 * same folder keeps its crash watch (keepWatch).
 */
async function switchTo(dir, onLine, { keepWatch = false } = {}) {
  onLine(`Starting the site from ${dir === root ? 'the uploaded folder' : dir}`)
  await live.stop()
  // Something outside this supervisor on the port would answer for the new
  // server and be taken for it.
  if (!(await waitForFreePort(port))) {
    onLine(`Port ${port} is still taken by another process, so the site cannot start on it.`)
    return false
  }
  const entry = await live.start(dir, { keepWatch })
  const ok = await answers(port, () => entry.ended || live.current !== entry)
  onLine(ok ? 'The site answers.' : 'The site did not answer.')
  return ok
}

/**
 * A new release stopped three times within ten minutes of its switch: back
 * to the one before. While the site is busy (start-up clean-up, an update, a
 * rollback) it is started again for the moment, and goes back as soon as the
 * busy flag comes free.
 */
async function crashLoop(dir) {
  if (!busy.take()) {
    print('The site is busy, so the release that keeps stopping was started again; it goes back once the busy work is done.')
    busy.deferCrash(dir)
    await live.start(dir)
    return
  }
  try {
    const result = await rollBack({
      paths,
      deps: { switchTo, print },
      reason: 'The new release stopped three times within ten minutes of being installed.',
      crashed: true,
      serving: dir,
      // Better an older build than none: the message says it may be old.
      allowUpload: true,
    })
    if (!result.ok) print(result.message)
    noteSupervisorChanges()
  } finally {
    busy.release()
  }
}

// ----- GitHub -----

const githubHeaders = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${github.token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'wslatl-updater',
}

function githubProblem(status) {
  if (status === 401) return 'GitHub refused the token (401). Check GITHUB_TOKEN in .env.'
  if (status === 403 || status === 429) return `GitHub refused the request (${status}): the token may lack Contents read access, or the rate limit was reached.`
  if (status === 404) return `GitHub could not find ${github.repo} (404). Check GITHUB_REPO and that the token can read it.`
  return `GitHub answered ${status}.`
}

function githubGet(path) {
  return fetch(`${github.api}/repos/${github.repo}${path}`, { headers: githubHeaders, signal: AbortSignal.timeout(30_000) })
}

/** GitHub's latest release (never a draft or a pre-release), or null when there is none. */
async function latest() {
  const response = await githubGet('/releases/latest')
  if (response.status === 404) {
    // No release yet, or no repository at all: only the second is an error.
    const repo = await githubGet('')
    if (repo.ok) return null
    throw new Error(githubProblem(repo.status))
  }
  if (!response.ok) throw new Error(githubProblem(response.status))
  const body = await response.json()
  return {
    tag: String(body.tag_name ?? ''),
    name: String(body.name || body.tag_name || ''),
    publishedAt: String(body.published_at ?? ''),
    draft: Boolean(body.draft),
    prerelease: Boolean(body.prerelease),
  }
}

/** The commit a tag points at, right now. */
async function resolveTag(tag) {
  const response = await githubGet(`/commits/${encodeURIComponent(tag)}`)
  if (!response.ok) throw new Error(response.status === 404 ? `GitHub could not find the commit of ${tag} (404).` : githubProblem(response.status))
  return String((await response.json()).sha ?? '')
}

const maxDownloadBytes = 500 * 1024 * 1024

/** The commit's files into dest, through the system tar reading from stdin. */
async function download(sha, dest) {
  const response = await fetch(`${github.api}/repos/${github.repo}/tarball/${sha}`, {
    headers: githubHeaders,
    signal: AbortSignal.timeout(300_000),
  })
  if (!response.ok || !response.body) throw new Error(githubProblem(response.status))
  mkdirSync(dest, { recursive: true })
  const tar = track(spawn('tar', ['-xzf', '-', '--strip-components=1'], { cwd: dest, stdio: ['pipe', 'ignore', 'pipe'] }))
  let errors = ''
  tar.stderr.on('data', (chunk) => (errors += chunk))
  const exited = new Promise((resolve, reject) => {
    tar.once('error', (error) => reject(new Error(`Could not run tar (${error.message}).`)))
    tar.once('exit', (code) => (code === 0 ? resolve() : reject(new Error(`tar failed: ${errors.trim() || `exit code ${code}`}`))))
  })
  let size = 0
  const limit = new Transform({
    transform(chunk, _encoding, done) {
      size += chunk.length
      done(size > maxDownloadBytes ? new Error('The download is larger than 500 MB.') : null, chunk)
    },
  })
  await Promise.all([pipeline(Readable.fromWeb(response.body), limit, tar.stdin), exited])
  if (!existsSync(join(dest, 'package.json'))) throw new Error('The download has no package.json.')
}

// ----- Updates -----

async function trial(dir, onLine) {
  const listen = await freePort()
  onLine(`Trial start on port ${listen}`)
  const child = startNext(dir, { port: listen, env: serverEnv, onLine })
  let failed = false
  child.once('error', (error) => {
    failed = true
    onLine(`The trial could not start: ${error.message}`)
  })
  try {
    return await answers(listen, () => failed || child.exitCode !== null || child.signalCode !== null)
  } finally {
    await stopProcess(child)
  }
}

/**
 * This supervisor always runs from the uploaded folder, never from a
 * release, so a release that changes it (scripts/serve.mjs or anything in
 * scripts/updater/) changes nothing until its files are copied over by hand.
 * The dashboard says so when that is the case.
 */
function noteSupervisorChanges() {
  const state = readState(paths)
  const dir = liveDir(paths, state)
  const changed = supervisorChanged(root, dir)
  if (changed) print(`The updater itself changed in this release. Copy scripts/serve.mjs and scripts/updater/ from ${dir} over the ones in the uploaded folder, then restart.`)
  if (Boolean(state.updaterChanged) !== changed) writeState(paths, { ...state, updaterChanged: changed })
}

async function checkForRequest() {
  if (shuttingDown || !existsSync(paths.request) || !busy.take()) return
  print('Update requested')
  const before = readState(paths).current?.tag
  try {
    const result = await runUpdate({
      paths,
      deps: { latest, resolve: resolveTag, download, npm, trial, switchTo, print },
      baseEnv: process.env,
      secretNames,
      // What actually runs, which a lost or stale state.json may not name.
      serving: live.current?.dir ?? null,
    })
    // A new release is watched for ten minutes (scripts/updater/live.mjs).
    if (result.status === 'idle' && result.current && result.current.tag !== before) live.watchCrashes()
    noteSupervisorChanges()
  } catch (error) {
    print(`The update stopped: ${error.message}`)
  } finally {
    busy.release()
  }
}

// ----- The console -----

function describe() {
  const state = readState(paths)
  const dir = liveDir(paths, state)
  const serving = dir === root ? 'the uploaded folder' : state.current?.tag
  return `Serving ${serving}. Updater: ${state.status}${state.message ? `. ${state.message}` : '.'}`
}

function requestUpdate() {
  if (!updatesOn) return print('Updates are off: GITHUB_TOKEN is not set in .env.')
  if (busy.held || busyStatuses.includes(readState(paths).status)) {
    return print('The site is starting, or an update or a rollback is running; try again when it is done.')
  }
  try {
    // Created only if no request is waiting, in one step (wx), so two
    // requests at once cannot both get through.
    writeFileSync(paths.request, JSON.stringify({ requestedAt: new Date().toISOString(), by: 'console' }), { flag: 'wx' })
  } catch (error) {
    return print(error.code === 'EEXIST' ? 'An update is already waiting to start.' : `Could not ask for an update: ${error.message}`)
  }
  print('Update requested; it starts within two seconds.')
}

/** The folder actually served, or the state's idea of it before anything started. */
const servedDir = () => live.current?.dir ?? liveDir(paths, readState(paths))

// One at a time: updates, rollbacks and restarts all move the live site, and
// two at once could start two servers on one port.
async function exclusively(action) {
  if (!busy.take()) return print('The site is starting, or an update or a rollback is running; try again when it is done.')
  try {
    await action()
  } finally {
    busy.release()
  }
}

function rollBackFromConsole(allowUpload) {
  return exclusively(async () => {
    const result = await rollBack({ paths, deps: { switchTo, print }, reason: 'Rolled back from the console.', serving: servedDir(), allowUpload })
    if (!result.ok) print(result.message)
    noteSupervisorChanges()
  })
}

const commands = {
  help: () =>
    print(
      'Commands: status, update (install the latest release), rollback (back to the release before), rollback upload (back to the uploaded folder), restart, stop.',
    ),
  status: () => print(describe()),
  update: requestUpdate,
  rollback: () => rollBackFromConsole(false),
  'rollback upload': () => rollBackFromConsole(true),
  restart: () => exclusively(() => switchTo(servedDir(), print, { keepWatch: true })),
  stop: () => shutDown('stop'),
}

function command(line) {
  const name = line.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!name) return
  const action = commands[name]
  if (action) void action()
  else print(`Unknown command "${name.slice(0, 40)}". Try help.`)
}

// ----- Start -----

let poller = null

async function shutDown(reason) {
  if (shuttingDown) return
  shuttingDown = true
  print(`${reason}: stopping`)
  clearInterval(poller)
  await live.stop()
  // Builds and installs too, with everything they started.
  await Promise.all([...children].map((child) => stopProcess(child)))
  process.exit(0)
}

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => shutDown(signal))

// Whatever goes wrong in here, the site keeps running: an error the code
// above did not expect is logged, never allowed to end this process (and
// with it `next start`).
process.on('uncaughtException', (error) => print(`Unexpected error, carrying on: ${error.stack ?? error}`))
process.on('unhandledRejection', (error) => print(`Unexpected error, carrying on: ${error?.stack ?? error}`))

// The same checks as lib/admin/settings.ts, so the message matches what
// /admin does. The details of a malformed setting are logged there.
function reportSettings() {
  const problems = []
  if (!/^scrypt:\d+:\d+:\d+:[\w-]{16,}:[\w-]{43,}$/.test(setting('ADMIN_PASSWORD_HASH'))) problems.push('ADMIN_PASSWORD_HASH')
  if (setting('ADMIN_SESSION_SECRET').length < 32) problems.push('ADMIN_SESSION_SECRET')
  if (!github.token) problems.push('GITHUB_TOKEN')
  if (problems.length) print(`The admin is off (/admin answers 404): ${problems.join(', ')} missing or not valid in .env.`)
  else print('The admin is on at /admin.')
  if (updatesOn) print(`Updates install the latest release of ${github.repo}.`)
}

mkdirSync(paths.dir, { recursive: true })
reportSettings()
const state = recoverState(paths)
const dir = liveDir(paths, state)
noteSupervisorChanges()
createInterface({ input: process.stdin }).on('line', command)

// The uploaded folder is built at every start, as the old startup command
// did: a build left over from an earlier upload would otherwise be served
// in place of the files just uploaded. Releases are built once, by the
// updater, and start at once.
if (dir === root) {
  print('Serving the uploaded folder: running npm run build first.')
  try {
    await npm(['run', 'build'], {
      cwd: root,
      env: { ...process.env, STATIC_HISTORY_DIR: paths.history },
      onLine: (line) => console.log(line),
      // No limit, as before the supervisor: a build stopped here ends this
      // process, and the restart that follows would only start it over.
      timeoutMs: Infinity,
    })
  } catch (error) {
    print(`The build failed, so the site cannot start: ${error.message}`)
    process.exit(1)
  }
}

print(`Starting the site on port ${port} from ${dir === root ? 'the uploaded folder' : dir}`)
await live.start(dir)
// A release an update installed less than ten minutes ago is still watched,
// across a restart of the supervisor. One a rollback went back to is not.
const watchSince = crashWatchSince(paths, state, dir, crashWindowMs)
if (watchSince !== null) live.watchCrashes(watchSince)
// Only now, with the site starting: a half-built or old release can take a
// while to delete. Everything else waits until it is done (the busy flag is
// held from the top, so the console cannot move the site during the build).
cleanUpAtStart(paths, state, print)
  .catch((error) => print(`Could not remove an old release: ${error.message}`))
  .finally(() => {
    busy.release()
  })
if (updatesOn) poller = setInterval(checkForRequest, 2000)

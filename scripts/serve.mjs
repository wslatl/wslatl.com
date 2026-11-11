// The production entry point: `npm run serve`, the server's startup command.
//
// It runs `next start` and keeps it running, and it is what lets /admin
// update the site from GitHub: the admin writes .updater/request.json, and
// this process downloads the latest GitHub release (only a newer one, and
// only one tagged vMAJOR.MINOR.PATCH), checks every file of it against
// GitHub's own record of the commit (scripts/updater/github.mjs), installs
// and builds it in a folder of its own, deletes from it what production
// never uses, changes the database if the release asks for that (backup
// first), starts it once on a spare local port to be sure it answers, and
// only then restarts the site on it. A failure at any step leaves the site
// as it was, and a new release that stops three times within ten minutes of
// its switch is replaced by the one before. The steps and the folders are in
// scripts/updater/lib.mjs.
//
// What an app asks for beyond that is in its platform.config.mjs, under
// `updater` (scripts/updater/config.mjs): steps after npm ci, packages whose
// install scripts may run, settings its build may see, a database step,
// where its data lives, the page a trial must answer, and processes that run
// beside the website, such as a mail server. Those are kept running the way
// the website is (scripts/updater/processes.mjs), tried on spare ports, and
// moved after the website with a drain. With no platform.config.mjs it does
// exactly what the main website's updater always has.
//
// The server console takes commands: status, update, rollback, rollback
// upload, restart, stop and help.
//
// Settings come from .env beside this repository (the same file Next
// reads), with the panel's variables over it. Only `next start` is given all
// of them, and only it is given the GitHub token. npm and the builds get
// nothing from .env, and the processes beside the website, every trial and
// the database step never get the token (scripts/updater/env.mjs says what
// that does and does not stop).
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { busyFlag } from './updater/busy.mjs'
import { dataDirProblem, defaultSettings, readSettings } from './updater/config.mjs'
import { buildSettings, kitSecrets, loadEnvFile, redactor, supervisorOnly, withoutSecrets } from './updater/env.mjs'
import { apiAddressProblem, gitHub, repoPattern } from './updater/github.mjs'
import {
  busyStatuses,
  cleanUpAtStart,
  crashWatchSince,
  isBusy,
  liveDir,
  readState,
  recoverState,
  requestUpdate,
  retryRecoverState,
  rollBack,
  runUpdate,
  supervisorChanged,
  syncUploadedVersion,
  updaterPaths,
  writeState,
} from './updater/lib.mjs'
import { crashWindowMs, liveServer } from './updater/live.mjs'
import {
  answers,
  eachLine,
  formatDuration,
  freePort,
  gone,
  listens,
  messageOf,
  run,
  stepLimit,
  stepTimeoutMs,
  stopProcess,
  waitForFreePort,
} from './updater/process.mjs'
import { processSet } from './updater/processes.mjs'

/**
 * @typedef {import('node:child_process').ChildProcess} ChildProcess
 * @typedef {import('./updater/env.mjs').Env} Env
 * @typedef {import('./updater/config.mjs').UpdaterSettings} UpdaterSettings
 * @typedef {import('./updater/config.mjs').ProcessSettings} ProcessSettings
 * @typedef {import('./updater/config.mjs').FolderSettings} FolderSettings
 */

const root = join(import.meta.dirname, '..')
const paths = updaterPaths(root)
const dotenv = loadEnvFile(join(root, '.env'))
// The panel's own variables win over .env, as they do for Next.
const setting = (/** @type {string} */ name, fallback = '') => (process.env[name] ?? dotenv[name] ?? fallback).trim()

const port = Number(setting('SERVER_PORT') || setting('PORT') || 3000)
const token = setting('GITHUB_TOKEN')
const api = setting('GITHUB_API_URL', 'https://api.github.com').replace(/\/+$/, '')
// The kit's own secrets and everything in .env, whatever it is called:
// never given to npm, which runs other people's install scripts.
const secretNames = [...new Set([...kitSecrets, ...Object.keys(dotenv)])]
const redact = redactor([token])
const stepLimitSet = stepLimit(setting('UPDATE_STEP_MINUTES'))

/** @param {string} line */
function print(line) {
  console.log(`${new Date().toISOString()} [updater] ${redact(line)}`)
}

// ----- Child processes -----

/** @type {Set<ChildProcess>} */
const children = new Set()

/** @param {ChildProcess} child */
function track(child) {
  children.add(child)
  const forget = () => children.delete(child)
  child.once('exit', forget)
  child.once('error', forget)
  return child
}

// `npm run serve` names npm's own script, which runs on this same Node.
// Started some other way, fall back to npm on the PATH (a shell on Windows,
// where npm is a .cmd; the arguments are names the settings check allows).
// Each run is stopped with everything it started after 15 minutes
// (scripts/updater/process.mjs), unless it says otherwise.
/**
 * @param {string[]} args
 * @param {import('./updater/process.mjs').RunOptions} options
 */
function npm(args, options) {
  const cli = process.env.npm_execpath
  if (cli && /\.c?js$/.test(cli)) return run(process.execPath, [cli, ...args], { ...options, onSpawn: track })
  return run('npm', args, { ...options, onSpawn: track, shell: process.platform === 'win32' })
}

/**
 * npm for an update: each step stops after UPDATE_STEP_MINUTES, and the
 * message then says how to give it longer.
 * @param {string[]} args
 * @param {import('./updater/process.mjs').RunOptions} options
 */
const updateNpm = (args, options) =>
  npm(args, { ...options, timeoutMs: stepLimitSet.ms, timeoutHint: 'Raise UPDATE_STEP_MINUTES in .env, restart the server, and install again.' })

// Started exactly like the live server: no -H. Bound to 127.0.0.1, Next
// takes the proxy's rewrite for one to another host and answers / with a
// redirect to itself, which failed every trial start.
/**
 * @param {string} dir
 * @param {{ port: number, env: Env, onLine?: (line: string) => void }} options
 */
function startNext(dir, { port: listen, env, onLine }) {
  const args = [join(dir, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(listen)]
  const child = track(spawn(process.execPath, args, { cwd: dir, env: /** @type {NodeJS.ProcessEnv} */ (env), stdio: ['ignore', onLine ? 'pipe' : 'inherit', onLine ? 'pipe' : 'inherit'] }))
  eachLine(child.stdout, onLine)
  eachLine(child.stderr, onLine)
  return child
}

/**
 * A process beside the website: its JavaScript file in dir, on this Node,
 * never through a shell. What it prints goes to the console, or to onLine
 * for a trial, under its name.
 * @param {string} dir
 * @param {ProcessSettings} settings
 * @param {Env} env
 * @param {(line: string) => void} [onLine]
 */
function startProcess(dir, settings, env, onLine = (line) => console.log(line)) {
  const file = join(dir, ...settings.command.split('/'))
  const child = track(spawn(process.execPath, [file, ...settings.args], { cwd: dir, env: /** @type {NodeJS.ProcessEnv} */ (env), stdio: ['ignore', 'pipe', 'pipe'] }))
  const named = (/** @type {string} */ line) => onLine(`[${settings.name}] ${line}`)
  eachLine(child.stdout, named)
  eachLine(child.stderr, named)
  return child
}

// ----- Settings of each folder -----

/** What the child that reads platform.config.mjs runs with: as npm does, nothing from .env and no token. */
const configEnv = withoutSecrets(process.env, secretNames)

/** @type {Map<string, Promise<FolderSettings>>} */
const settingsRead = new Map()
/** The settings of each folder once read, for what cannot wait. @type {Map<string, Readonly<UpdaterSettings>>} */
const settingsKnown = new Map()

/**
 * dir's settings, read once. fresh reads them again: a release folder is
 * downloaded anew when its install is tried again.
 * @param {string} dir
 * @param {{ fresh?: boolean }} [options]
 */
function settingsOf(dir, { fresh = false } = {}) {
  let read = fresh ? undefined : settingsRead.get(dir)
  if (!read) {
    read = readSettings(dir, { env: configEnv })
    settingsRead.set(dir, read)
    read.then(
      (found) => settingsKnown.set(dir, found.settings),
      () => settingsRead.delete(dir),
    )
  }
  return read
}

/**
 * The settings to run dir with: its own, or the defaults when they cannot
 * be read, which is said. The website starts from dir either way.
 * @param {string} dir
 * @param {(line: string) => void} onLine
 * @returns {Promise<Readonly<UpdaterSettings>>}
 */
async function runSettings(dir, onLine) {
  try {
    return (await settingsOf(dir)).settings
  } catch (error) {
    onLine(`The platform.config.mjs of ${described(dir)} cannot be used, so only the website starts from it. ${messageOf(error)}`)
    return defaultSettings
  }
}

/** @param {string} dir */
const described = (dir) => (dir === root ? 'the uploaded folder' : dir)

// ----- The live server -----

const state = recoverState(paths)
const dir = liveDir(paths, state)
mkdirSync(paths.dir, { recursive: true })
/** The served folder's settings, and whether they could be read. */
const served = await settingsOf(dir).then(
  (found) => ({ found, problem: /** @type {string | null} */ (null) }),
  (/** @type {unknown} */ error) => ({ found: null, problem: messageOf(error) }),
)
const servedSettings = served.found?.settings ?? defaultSettings

const repo = setting('GITHUB_REPO') || served.found?.repo || 'wslatl/wslatl.com'
/** Why updates are off, or null when they are on. The token goes to GitHub over HTTPS or nowhere. */
const updatesOff = !token
  ? 'GITHUB_TOKEN is not set in .env.'
  : !repoPattern.test(repo)
    ? `GITHUB_REPO is "${repo.slice(0, 60)}", not owner/name.`
    : apiAddressProblem(api) || null
const updatesOn = updatesOff === null
// The latest release, its tag's commit, and that commit's files, checked
// against GitHub's own record of the commit (scripts/updater/github.mjs).
const releases = gitHub({ token, repo, api })

// The panel's variables win over .env here too, as they do in Next.
const serverEnv = { ...dotenv, ...process.env, ...(updatesOn && { UPDATER_DIR: paths.dir }) }
/** What a trial, a process beside the website and the database step run with: all the website gets but the token and the updater's folder. */
const besideEnv = withoutSecrets(serverEnv, supervisorOnly)
/** @param {Readonly<UpdaterSettings>} settings */
const trialEnvOf = (settings) => ({ ...besideEnv, ...settings.trialEnv, PLATFORM_TRIAL: '1' })

let shuttingDown = false

const live = liveServer({
  start: (folder) => startNext(folder, { port, env: serverEnv }),
  stop: (child) => stopProcess(child),
  print,
  onCrashLoop: (folder) => void crashLoop(folder, () => live.start(folder)),
  ports: () => [port],
})

/**
 * A process's live ports, from the settings its `ports` names.
 * @param {ProcessSettings} settings
 */
function livePorts(settings) {
  return settings.ports.map((name) => Number(besideEnv[name])).filter((value) => Number.isInteger(value) && value > 0 && value < 65_536)
}

const processes = processSet({
  start: (folder, settings) => startProcess(folder, settings, besideEnv),
  stop: (child, settings) => stopProcess(child, settings.drainSeconds * 1000),
  ports: livePorts,
  waitForPorts: async (list) => {
    for (const value of list) if (!(await waitForFreePort(value))) return value
    return null
  },
  check: (list, isGone, started) => listens(list, isGone, { started }),
  print,
  onCrashLoop: (folder, restartForNow) => void crashLoop(folder, restartForNow),
})

// Held by start-up (until its build and clean-up are done), updates,
// rollbacks and restarts: whatever holds it owns the live server and the
// processes beside it (scripts/updater/busy.mjs).
const busy = busyFlag({
  // A release that kept stopping while the site was busy goes back now, if
  // it is still what runs: an update may have replaced it.
  onCrashLoopDue: (folder) => {
    if (!shuttingDown && live.current?.dir === folder) void crashLoop(folder, () => live.start(folder))
  },
  ensureServing,
})

/**
 * Starts the live server again when nothing serves, and each process beside
 * it: after an update or a rollback that ended that way. Never while the
 * busy flag is held, since its holder owns the live server and may be
 * stopping it on purpose.
 */
function ensureServing() {
  if (shuttingDown || busy.held) return
  const folder = liveDir(paths, readState(paths))
  if (live.ensure(folder)) print('Nothing was serving, so the site was started again.')
  processes.ensure(folder, settingsKnown.get(folder)?.processes ?? [])
}

/**
 * Makes dir the live server, then moves the processes beside it to dir, and
 * says whether all of them answer. A restart of the same folder keeps its
 * crash watch (keepWatch), and restarts every process too (restart).
 * @param {string} folder
 * @param {(line: string) => void} onLine
 * @param {{ keepWatch?: boolean, restart?: boolean }} [options]
 */
async function switchTo(folder, onLine, { keepWatch = false, restart = false } = {}) {
  const settings = await runSettings(folder, onLine)
  onLine(`Starting the site from ${described(folder)}`)
  await live.stop()
  // Something outside this supervisor on the port would answer for the new
  // server and be taken for it.
  if (!(await waitForFreePort(port))) {
    onLine(`Port ${port} is still taken by another process, so the site cannot start on it.`)
    return false
  }
  const entry = await live.start(folder, { keepWatch })
  const ok = await answers(port, () => entry.ended || live.current !== entry, 120_000, { path: settings.checkPath, started: () => entry.child !== null })
  onLine(ok ? 'The site answers.' : 'The site did not answer.')
  if (!ok) return false
  return processes.switchTo(folder, settings.processes, onLine, { keepWatch, restart })
}

/**
 * A new release stopped three times within ten minutes of its switch: back
 * to the one before. While the site is busy (start-up clean-up, an update, a
 * rollback) it is started again for the moment, and goes back as soon as the
 * busy flag comes free.
 * @param {string} folder
 * @param {() => Promise<unknown>} restartForNow starts again what kept stopping
 */
async function crashLoop(folder, restartForNow) {
  if (!busy.take()) {
    print('The site is busy, so the release that keeps stopping was started again; it goes back once the busy work is done.')
    busy.deferCrash(folder)
    await restartForNow()
    return
  }
  try {
    const result = await rollBack({
      paths,
      deps: { switchTo, print },
      reason: 'The new release stopped three times within ten minutes of being installed.',
      crashed: true,
      serving: folder,
      // Better an older build than none: the message says it may be old.
      allowUpload: true,
    })
    if (!result.ok) print(result.message)
    noteSupervisorChanges()
  } finally {
    busy.release()
  }
}

// ----- Updates -----

/**
 * Starts dir once on spare ports, with its trial settings, to be sure it
 * answers: the website first, then each process beside it in turn. Each is
 * stopped again before the next. A trial runs with updater.trialEnv over
 * the live settings and PLATFORM_TRIAL=1, so it can leave out migrations,
 * schedulers and alerts, and with neither the token nor the updater's folder.
 * @param {string} folder
 * @param {(line: string) => void} onLine
 */
async function trial(folder, onLine) {
  const settings = await runSettings(folder, onLine)
  const env = trialEnvOf(settings)
  const listen = await freePort()
  onLine(`Trial start on port ${listen}`)
  const child = startNext(folder, { port: listen, env, onLine })
  let failed = false
  child.once('error', (error) => {
    failed = true
    onLine(`The trial could not start: ${error.message}`)
  })
  try {
    if (!(await answers(listen, () => failed || gone(child), 120_000, { path: settings.checkPath }))) return false
  } finally {
    await stopProcess(child)
  }
  for (const each of settings.processes) if (!(await trialProcess(folder, each, env, onLine))) return false
  return true
}

/**
 * One process beside the website, on spare ports of its own: each setting
 * its `ports` names gets one.
 * @param {string} folder
 * @param {ProcessSettings} settings
 * @param {Env} env
 * @param {(line: string) => void} onLine
 */
async function trialProcess(folder, settings, env, onLine) {
  /** @type {Record<string, string>} */
  const spare = {}
  for (const name of settings.ports) {
    let value = await freePort()
    while (Object.values(spare).includes(String(value))) value = await freePort()
    spare[name] = String(value)
  }
  const where = Object.entries(spare).map(([name, value]) => `${name}=${value}`)
  onLine(`Trial start of ${settings.name}${where.length ? ` on ${where.join(', ')}` : ''}`)
  const child = startProcess(folder, settings, { ...env, ...spare }, onLine)
  let failed = false
  child.once('error', (error) => {
    failed = true
    onLine(`The trial of ${settings.name} could not start: ${error.message}`)
  })
  try {
    const ok = await listens(Object.values(spare).map(Number), () => failed || gone(child))
    onLine(ok ? `${settings.name} answers.` : `${settings.name} did not answer on its trial start.`)
    return ok
  } finally {
    await stopProcess(child, settings.drainSeconds * 1000)
  }
}

/**
 * This supervisor always runs from the uploaded folder, never from a
 * release, so a release that changes it (scripts/serve.mjs or anything in
 * scripts/updater/) changes nothing until its files are copied over, which
 * the button on the dashboard does. The dashboard says so when that is the
 * case. Run at every start and after every update and rollback, so this is
 * also where the uploaded folder's package.json follows the live version.
 */
function noteSupervisorChanges() {
  const now = readState(paths)
  const folder = liveDir(paths, now)
  syncUploadedVersion(root, folder, print)
  const changed = supervisorChanged(root, folder)
  if (changed) print(`The updater itself changed in this release. Press Copy the new updater in /admin, or copy scripts/serve.mjs and scripts/updater/ from ${folder} over the ones in the uploaded folder, then restart.`)
  if (Boolean(now.updaterChanged) !== changed) writeState(paths, { ...now, updaterChanged: changed })
}

/**
 * state.json still says an update runs: the server restarted in the middle
 * of one, and recoverState could not write that it ended (a full disk,
 * say). Until it is written, the dashboard shows an update running and
 * refuses Install, and no update starts. It is tried again once the start-up
 * clean-up has made room, then every minute.
 */
let startStateStale = false
/** @type {ReturnType<typeof setInterval> | undefined} */
let startStateTimer

function settleStartState() {
  if (!startStateStale) return
  if (retryRecoverState(paths)) {
    startStateStale = false
    clearInterval(startStateTimer)
    print(`${paths.state} is written again: the update the restart cut short shows as failed, and Install works again.`)
    return
  }
  if (!startStateTimer) {
    print(`${paths.state} still says an update is running: the restart cut it short, and that could not be written since. The disk may be full. Until it is written, Install is refused. Free some disk space; it is tried again every minute.`)
    startStateTimer = setInterval(settleStartState, 60_000)
  }
}

async function checkForRequest() {
  if (shuttingDown || startStateStale || !existsSync(paths.request) || !busy.take()) return
  print('Update requested')
  try {
    await runUpdate({
      paths,
      deps: {
        latest: releases.latest,
        resolve: releases.resolve,
        download: releases.download,
        settings: async (folder) => (await settingsOf(folder, { fresh: true })).settings,
        npm: updateNpm,
        trial,
        switchTo,
        // A new release is watched for ten minutes (scripts/updater/live.mjs),
        // from the moment its switch is recorded.
        watch: () => {
          live.watchCrashes()
          processes.watchCrashes()
        },
        print,
      },
      baseEnv: process.env,
      secretNames,
      fileEnv: dotenv,
      // What actually runs, which a lost or stale state.json may not name.
      serving: live.current?.dir ?? null,
      inUse: processes.folders,
      redact,
    })
    noteSupervisorChanges()
  } catch (error) {
    print(`The update stopped: ${messageOf(error)}`)
  } finally {
    busy.release()
  }
}

// ----- The console -----

function describe() {
  const now = readState(paths)
  const folder = liveDir(paths, now)
  const serving = folder === root ? 'the uploaded folder' : now.current?.tag
  const beside = processes.names.length ? ` Running beside it: ${processes.names.join(', ')}.` : ''
  return `Serving ${serving}. Updater: ${now.status}${now.message ? `. ${now.message}` : '.'}${beside}`
}

function requestUpdateFromConsole() {
  if (!updatesOn) return print(`Updates are off: ${updatesOff}`)
  if (busy.held || busyStatuses.includes(readState(paths).status)) {
    return print('The site is starting, or an update or a rollback is running; try again when it is done.')
  }
  const result = requestUpdate(paths, 'console')
  print(result.ok ? 'Update requested; it starts within two seconds.' : result.reason)
}

/** The folder actually served, or the state's idea of it before anything started. */
const servedDir = () => live.current?.dir ?? liveDir(paths, readState(paths))

// One at a time: updates, rollbacks and restarts all move the live site, and
// two at once could start two servers on one port.
/** @param {() => Promise<unknown>} action */
async function exclusively(action) {
  if (!busy.take()) return print('The site is starting, or an update or a rollback is running; try again when it is done.')
  try {
    await action()
  } finally {
    busy.release()
  }
}

/** @param {boolean} allowUpload */
function rollBackFromConsole(allowUpload) {
  return exclusively(async () => {
    const result = await rollBack({ paths, deps: { switchTo, print }, reason: 'Rolled back from the console.', serving: servedDir(), allowUpload })
    if (!result.ok) print(result.message)
    noteSupervisorChanges()
  })
}

/** @type {Record<string, () => unknown>} */
const commands = {
  help: () =>
    print('Commands: status, update (install the latest release), rollback (back to the release before), rollback upload (back to the uploaded folder), restart, stop.'),
  status: () => print(describe()),
  update: requestUpdateFromConsole,
  rollback: () => rollBackFromConsole(false),
  'rollback upload': () => rollBackFromConsole(true),
  restart: () => exclusively(() => switchTo(servedDir(), print, { keepWatch: true, restart: true })),
  stop: () => shutDown('stop'),
}

/** @param {string} line */
function command(line) {
  const name = line.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!name) return
  const action = commands[name]
  if (action) void action()
  else print(`Unknown command "${name.slice(0, 40)}". Try help.`)
}

// ----- Start -----

/** @type {ReturnType<typeof setInterval> | undefined} */
let poller

/** @param {string} reason */
async function shutDown(reason) {
  if (shuttingDown) return
  shuttingDown = true
  print(`${reason}: stopping`)
  clearInterval(poller)
  clearInterval(startStateTimer)
  // The website at once, and each process beside it with its drain.
  await Promise.all([live.stop(), processes.stopAll()])
  // Builds and installs too, with everything they started.
  await Promise.all([...children].map((child) => stopProcess(child)))
  process.exit(0)
}

// SIGHUP too: closing the terminal of a plain Linux host would otherwise end
// this process without stopping the commands it started.
for (const signal of /** @type {const} */ (['SIGINT', 'SIGTERM', 'SIGHUP'])) process.on(signal, () => void shutDown(signal))

// Whatever goes wrong in here, the site keeps running: an error the code
// above did not expect is logged, never allowed to end this process (and
// with it `next start`).
process.on('uncaughtException', (error) => print(`Unexpected error, carrying on: ${error.stack ?? error}`))
process.on('unhandledRejection', (error) => print(`Unexpected error, carrying on: ${error instanceof Error ? (error.stack ?? error.message) : error}`))

// The same checks as the admin's settings, so the message matches what
// /admin does: only what signing in needs turns the admin off, and the
// GitHub settings turn off updates alone. An app whose admin checks people
// its own way has no password to check here.
function reportSettings() {
  const problems = []
  if (served.found?.adminAuth !== 'custom') {
    if (!/^scrypt:\d+:\d+:\d+:[\w-]{16,}:[\w-]{43,}$/.test(setting('ADMIN_PASSWORD_HASH'))) problems.push('ADMIN_PASSWORD_HASH')
    if (setting('ADMIN_SESSION_SECRET').length < 32) problems.push('ADMIN_SESSION_SECRET')
  }
  if (problems.length) print(`The admin is off (/admin answers 404): ${problems.join(', ')} missing or not valid in .env.`)
  else print('The admin is on at /admin.')
  if (updatesOn) print(`Updates install the latest release of ${repo}.`)
  else print(`Updates are off: ${updatesOff}`)
  if (stepLimitSet.problem) print(stepLimitSet.problem)
  else if (updatesOn && stepLimitSet.ms !== stepTimeoutMs) print(`An update gives each of its steps ${formatDuration(stepLimitSet.ms)} (UPDATE_STEP_MINUTES).`)
  if (served.problem) print(`The platform.config.mjs of ${described(dir)} cannot be used, so only the website starts from it. ${served.problem}`)
  for (const each of servedSettings.processes) {
    for (const name of each.ports) {
      if (!(Number(besideEnv[name]) > 0)) print(`${each.name} names the port setting ${name}, which is not set, so that port is not checked.`)
    }
  }
}

reportSettings()
// Read as a fresh start, a state file that is there but cannot be read
// would make every release look unwanted; cleanUpAtStart keeps them.
startStateStale = isBusy(readState(paths))
noteSupervisorChanges()
// Data that would sit where the updater deletes things stops the clean-up,
// so it can never be deleted: the site still starts.
const dataProblem = dataDirProblem(root, servedSettings.dataDir)
if (dataProblem) print(`${dataProblem} Until then nothing is cleaned up at start.`)
else if (servedSettings.dataDir) {
  try {
    mkdirSync(servedSettings.dataDir, { recursive: true })
  } catch (error) {
    print(`Could not make ${servedSettings.dataDir}, where updater.dataDir says the data lives: ${messageOf(error)}`)
  }
}
createInterface({ input: process.stdin }).on('line', command)

// The uploaded folder is built at every start, as the old startup command
// did: a build left over from an earlier upload would otherwise be served
// in place of the files just uploaded. Releases are built once, by the
// updater, and start at once. It sees what a release's build sees, and no
// more: every name in .env is given empty, which keeps Next from reading it
// from .env, unless updater.buildEnv lists it.
if (dir === root) {
  print('Serving the uploaded folder: running npm run build first.')
  const started = Date.now()
  try {
    await npm(['run', 'build'], {
      cwd: root,
      env: {
        ...withoutSecrets(process.env, secretNames),
        ...Object.fromEntries(secretNames.map((name) => [name, ''])),
        ...buildSettings(dotenv, process.env, servedSettings.buildEnv),
        STATIC_HISTORY_DIR: paths.history,
      },
      onLine: (line) => console.log(line),
      // No limit, as before the supervisor: a build stopped here ends this
      // process, and the restart that follows would only start it over.
      timeoutMs: Infinity,
    })
    print(`Built the uploaded folder in ${formatDuration(Date.now() - started)}.`)
  } catch (error) {
    print(`The build failed, so the site cannot start: ${messageOf(error)}`)
    process.exit(1)
  }
}

print(`Starting the site on port ${port} from ${described(dir)}`)
await live.start(dir)
processes.ensure(dir, servedSettings.processes)
// A release an update installed less than ten minutes ago is still watched,
// across a restart of the supervisor. One a rollback went back to is not.
const watchSince = crashWatchSince(paths, state, dir, crashWindowMs)
if (watchSince !== null) {
  live.watchCrashes(watchSince)
  processes.watchCrashes(watchSince)
}
// Only now, with the site starting: a half-built or old release can take a
// while to delete. Everything else waits until it is done (the busy flag is
// held from the top, so the console cannot move the site during the build).
;(dataProblem ? Promise.resolve() : cleanUpAtStart(paths, state, print))
  .catch((error) => print(`Could not remove an old release: ${messageOf(error)}`))
  .finally(() => {
    // The clean-up may have made the room a stale start-up state needed.
    settleStartState()
    busy.release()
  })
if (updatesOn) poller = setInterval(() => void checkForRequest(), 2000)

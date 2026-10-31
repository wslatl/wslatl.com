// The production entry point: `npm run serve`, the server's startup command.
//
// It runs `next start` and keeps it running, and it is what lets /admin
// update the site from GitHub: the admin writes .updater/request.json, and
// this process downloads the latest GitHub release (only a newer one, and
// only one tagged vMAJOR.MINOR.PATCH), installs and builds it in a folder of
// its own, starts it once on a spare local port to be sure it answers, and
// only then restarts the site on it. A failure at any step leaves the site
// as it was. The steps and the folders are in scripts/updater/lib.mjs; the
// setup is in the README, "Admin and updates" and "Releasing".
//
// Settings come from .env beside this repository (the same file Next
// reads). Only `next start` is given them; npm never is.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { parseEnv } from 'node:util'
import { liveDir, pruneReleases, readState, recoverState, runUpdate, updaterPaths, writeState } from './updater/lib.mjs'

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
const healthTimeoutMs = 120_000

function print(line) {
  console.log(`${new Date().toISOString()} [updater] ${line}`)
}

// ----- Child processes -----

const children = new Set()

function track(child) {
  children.add(child)
  child.once('exit', () => children.delete(child))
  return child
}

function eachLine(stream, onLine) {
  // oxlint-disable-next-line no-control-regex -- the colour codes npm and Next print on Windows
  if (stream) createInterface({ input: stream }).on('line', (line) => onLine(line.replace(/\u001b\[[0-9;]*m/g, '')))
}

const stepTimeoutMs = 15 * 60 * 1000

/** Runs a command to the end; rejects with its exit code, or after 15 minutes. */
function run(command, args, { cwd, env, shell = false, onLine }) {
  // Run through npm's own script on this Node, npm is named as npm.
  const label = command === process.execPath ? ['npm', ...args.slice(1)].join(' ') : [command, ...args].join(' ')
  return new Promise((resolve, reject) => {
    const child = track(spawn(command, args, { cwd, env, shell, stdio: ['ignore', 'pipe', 'pipe'] }))
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, stepTimeoutMs)
    eachLine(child.stdout, onLine)
    eachLine(child.stderr, onLine)
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.once('exit', (code, signal) => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else if (timedOut) reject(new Error(`${label} took longer than ${stepTimeoutMs / 60_000} minutes and was stopped.`))
      else reject(new Error(`${label} failed (${signal ?? `exit code ${code}`}).`))
    })
  })
}

// `npm run serve` names npm's own script, which runs on this same Node.
// Started some other way, fall back to npm on the PATH (a shell on Windows,
// where npm is a .cmd).
function npm(args, options) {
  const cli = process.env.npm_execpath
  if (cli && /\.c?js$/.test(cli)) return run(process.execPath, [cli, ...args], options)
  return run('npm', args, { ...options, shell: process.platform === 'win32' })
}

// Started exactly like the live server: no -H. Bound to 127.0.0.1, Next
// takes the proxy's rewrite for one to another host and answers / with a
// redirect to itself, which failed every trial start.
function startNext(dir, { port: listen, env, onLine }) {
  const args = [join(dir, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(listen)]
  const child = track(
    spawn(process.execPath, args, { cwd: dir, env, stdio: ['ignore', onLine ? 'pipe' : 'inherit', onLine ? 'pipe' : 'inherit'] }),
  )
  if (onLine) {
    eachLine(child.stdout, onLine)
    eachLine(child.stderr, onLine)
  }
  return child
}

function stop(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return Promise.resolve()
  return new Promise((resolve) => {
    const force = setTimeout(() => child.kill('SIGKILL'), 10_000)
    child.once('exit', () => {
      clearTimeout(force)
      resolve()
    })
    child.kill('SIGTERM')
  })
}

/** True once GET / answers 200; false if the server exits or the time runs out. */
async function answers(listen, child, timeoutMs = healthTimeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) return false
    try {
      const response = await fetch(`http://127.0.0.1:${listen}/`, { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
      await response.body?.cancel()
      if (response.status === 200) return true
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port: free } = server.address()
      server.close(() => resolve(free))
    })
  })
}

// ----- The live server -----

// The panel's variables win over .env here too, as they do in Next.
const serverEnv = { ...dotenv, ...process.env, ...(updatesOn && { UPDATER_DIR: paths.dir }) }
let live = null
let backoff = 1000

/** Starts the live server from dir, and starts it again if it exits on its own. */
function startLive(dir) {
  const entry = { dir, child: startNext(dir, { port, env: serverEnv }), wanted: true, startedAt: Date.now(), timer: null }
  entry.child.once('exit', (code, signal) => {
    if (live !== entry || !entry.wanted) return
    backoff = Date.now() - entry.startedAt < 60_000 ? Math.min(backoff * 2, 30_000) : 1000
    print(`next start stopped (${signal ?? `exit code ${code}`}); starting it again in ${backoff / 1000} s`)
    entry.timer = setTimeout(() => {
      if (live === entry && entry.wanted) startLive(entry.dir)
    }, backoff)
  })
  live = entry
  return entry
}

async function stopLive() {
  const entry = live
  if (!entry) return
  entry.wanted = false
  clearTimeout(entry.timer)
  await stop(entry.child)
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
  try {
    return await answers(listen, child)
  } finally {
    await stop(child)
  }
}

async function switchTo(dir, onLine) {
  onLine(`Starting the site from ${dir === root ? 'the uploaded folder' : dir}`)
  await stopLive()
  const entry = startLive(dir)
  const ok = await answers(port, entry.child)
  onLine(ok ? 'The site answers.' : 'The site did not answer.')
  return ok
}

/**
 * This supervisor always runs from the uploaded folder, never from a
 * release, so a release that changes it changes nothing until its files are
 * copied over by hand. The dashboard says so when that is the case.
 */
const supervisorFiles = ['scripts/serve.mjs', 'scripts/updater/lib.mjs']
// Line endings aside: a copy uploaded from Windows has CRLF, GitHub's has LF.
const contents = (file) => readFileSync(file, 'utf8').replaceAll('\r\n', '\n')

function noteSupervisorChanges() {
  const state = readState(paths)
  const dir = liveDir(paths, state)
  const changed =
    dir !== root &&
    supervisorFiles.some((file) => {
      const release = join(dir, file)
      return !existsSync(release) || contents(release) !== contents(join(root, file))
    })
  if (changed) print(`The updater itself changed in this release. Copy ${supervisorFiles.join(' and ')} from ${dir} over the ones in the uploaded folder, then restart.`)
  if (Boolean(state.updaterChanged) !== changed) writeState(paths, { ...state, updaterChanged: changed })
}

let updating = false
let shuttingDown = false

async function checkForRequest() {
  if (updating || shuttingDown || !existsSync(paths.request)) return
  updating = true
  print('Update requested')
  try {
    await runUpdate({
      paths,
      deps: { latest, resolve: resolveTag, download, npm, trial, switchTo, print },
      baseEnv: process.env,
      secretNames,
    })
    noteSupervisorChanges()
  } catch (error) {
    print(`The update stopped: ${error.message}`)
  } finally {
    updating = false
  }
}

// ----- Start -----

let poller = null

async function shutDown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  print(`${signal}: stopping`)
  clearInterval(poller)
  await stopLive()
  await Promise.all([...children].map(stop))
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
    })
  } catch (error) {
    print(`The build failed, so the site cannot start: ${error.message}`)
    process.exit(1)
  }
}

print(`Starting the site on port ${port} from ${dir === root ? 'the uploaded folder' : dir}`)
startLive(dir)
// Only now, with the site starting: a half-built or old release can take a
// while to delete. Updates wait until it is done.
updating = true
pruneReleases(paths, state)
  .catch((error) => print(`Could not remove an old release: ${error.message}`))
  .finally(() => {
    updating = false
  })
if (updatesOn) poller = setInterval(checkForRequest, 2000)

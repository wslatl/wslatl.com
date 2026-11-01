// Child processes for the supervisor (scripts/serve.mjs): running a command
// to the end, stopping one together with everything it started, and waiting
// for a server to answer. Kept apart so the tests can drive them
// (tests/updater-process.test.ts).
import { spawn, spawnSync } from 'node:child_process'
import { createServer } from 'node:net'
import { createInterface } from 'node:readline'

const windows = process.platform === 'win32'

/**
 * Calls onLine for each line of a stream, without the colour codes npm and Next print on Windows.
 * @param {import('node:stream').Readable | null | undefined} stream
 * @param {((line: string) => void) | undefined} onLine
 */
export function eachLine(stream, onLine) {
  // oxlint-disable-next-line no-control-regex -- the colour codes npm and Next print on Windows
  if (stream && onLine) createInterface({ input: stream }).on('line', (line) => onLine(line.replace(/\u001b\[[0-9;]*m/g, '')))
}

const gone = (child) => child.exitCode !== null || child.signalCode !== null

/**
 * Sends a signal to a child and everything it started. Commands from run()
 * lead a process group of their own on Linux, so the group is signalled:
 * killing npm alone leaves `next build` and its workers running. Windows
 * has no groups; taskkill /T ends the whole tree.
 */
export function killTree(child, signal = 'SIGKILL') {
  if (!child?.pid || gone(child)) return
  if (windows) {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    return
  }
  try {
    process.kill(-child.pid, signal)
  } catch {
    // Not a group leader (a server from startServer): just the process.
    try {
      child.kill(signal)
    } catch {
      // Already gone.
    }
  }
}

/** Asks a child and everything it started to stop, then makes sure after ten seconds. */
export function stopProcess(child, graceMs = 10_000) {
  if (!child || gone(child)) return Promise.resolve()
  return new Promise((resolve) => {
    const force = setTimeout(() => killTree(child, 'SIGKILL'), graceMs)
    child.once('exit', () => {
      clearTimeout(force)
      resolve()
    })
    killTree(child, 'SIGTERM')
  })
}

const minutes = (ms) => (ms >= 60_000 ? `${ms / 60_000} minutes` : `${ms / 1000} seconds`)

/**
 * @typedef {{
 *   cwd?: string,
 *   env?: Record<string, string | undefined>,
 *   shell?: boolean,
 *   onLine?: (line: string) => void,
 *   onSpawn?: (child: import('node:child_process').ChildProcess) => void,
 *   timeoutMs?: number,
 * }} RunOptions
 */

/**
 * Runs a command to the end. Rejects with its exit code, or once timeoutMs
 * has passed, after stopping it and everything it started.
 * @param {string} command
 * @param {string[]} args
 * @param {RunOptions} [options]
 * @returns {Promise<void>}
 */
export function run(command, args, { cwd, env, shell = false, onLine, onSpawn, timeoutMs = 15 * 60_000 } = {}) {
  // Run through npm's own script on this Node, npm is named as npm.
  const label = command === process.execPath ? ['npm', ...args.slice(1)].join(' ') : [command, ...args].join(' ')
  return new Promise((resolve, reject) => {
    let child
    try {
      child = spawn(command, args, { cwd, env, shell, detached: !windows, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (error) {
      reject(error)
      return
    }
    onSpawn?.(child)
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      killTree(child, 'SIGKILL')
    }, timeoutMs)
    eachLine(child.stdout, onLine)
    eachLine(child.stderr, onLine)
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.once('exit', (code, signal) => {
      clearTimeout(timer)
      if (code === 0 && !timedOut) resolve()
      else if (timedOut) reject(new Error(`${label} took longer than ${minutes(timeoutMs)} and was stopped.`))
      else reject(new Error(`${label} failed (${signal ?? `exit code ${code}`}).`))
    })
  })
}

/** A port nothing listens on, on every interface, as the trial server will listen. */
export function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

/**
 * True once GET / answers 200; false if isGone() says the server ended, or the time runs out.
 * @param {number} port
 * @param {() => boolean} isGone
 * @param {number} [timeoutMs]
 * @returns {Promise<boolean>}
 */
export async function answers(port, isGone, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (isGone()) return false
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
      await response.body?.cancel()
      if (response.status === 200) return true
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

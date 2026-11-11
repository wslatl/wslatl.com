// Child processes for the supervisor (scripts/serve.mjs): running a command
// to the end, stopping one together with everything it started, and waiting
// for a server to answer. Kept apart so the tests can drive them.
import { spawn } from 'node:child_process'
import { createConnection, createServer } from 'node:net'
import { createInterface } from 'node:readline'
import { kitSecrets, withoutSecrets } from './env.mjs'

/**
 * @typedef {import('node:child_process').ChildProcess} ChildProcess
 * @typedef {import('./env.mjs').Env} Env
 * @typedef {{ pid?: number, exitCode: number | null, signalCode: string | null }} ChildLike
 */

const windows = process.platform === 'win32'

/** @param {unknown} error */
export const messageOf = (error) => (error instanceof Error ? error.message : String(error))

/**
 * Calls onLine for each line of a stream, without the colour codes npm and Next print on Windows.
 * @param {import('node:stream').Readable | null | undefined} stream
 * @param {((line: string) => void) | undefined} onLine
 */
export function eachLine(stream, onLine) {
  // oxlint-disable-next-line no-control-regex -- the colour codes npm and Next print on Windows
  if (stream && onLine) createInterface({ input: stream }).on('line', (line) => onLine(line.replace(/\u001b\[[0-9;]*m/g, '')))
}

/**
 * True once a child has gone, or never started: a spawn that failed has no pid.
 * @param {ChildLike | null | undefined} child
 */
export const gone = (child) => !child || child.pid === undefined || child.exitCode !== null || child.signalCode !== null

/**
 * Sends a signal to a child and everything it started. Commands from run()
 * lead a process group of their own on Linux, so the group is signalled:
 * killing npm alone leaves `next build` and its workers running. Windows has
 * no groups, and no signals to send: taskkill /T /F ends the whole tree at
 * once. It can take several seconds on a busy machine, so it runs without
 * holding up the supervisor, and with none of the kit's secrets.
 * @param {ChildProcess} child
 * @param {NodeJS.Signals} [signal]
 */
export function killTree(child, signal = 'SIGKILL') {
  if (!child?.pid || gone(child)) return
  if (windows) {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true, env: /** @type {NodeJS.ProcessEnv} */ (withoutSecrets(process.env, kitSecrets)) }).once(
      'error',
      () => {
        // No taskkill: the child itself, at least.
        try {
          child.kill('SIGKILL')
        } catch {
          // Already gone.
        }
      },
    )
    return
  }
  try {
    process.kill(-child.pid, signal)
  } catch {
    // Not a group leader (a server the supervisor starts): just the process.
    try {
      child.kill(signal)
    } catch {
      // Already gone.
    }
  }
}

/**
 * Kills what is left of a process group once its leader has gone: workers
 * whose own parent died first. Linux only; Windows has no groups.
 * @param {number | undefined} pid
 */
function killGroupLeftovers(pid) {
  if (windows || !pid) return
  try {
    process.kill(-pid, 'SIGKILL')
  } catch {
    // Nothing left: the usual case.
  }
}

/**
 * Asks a child and everything it started to stop, then makes it after graceMs.
 * A child that never started is already stopped.
 * @param {ChildProcess | null | undefined} child
 * @param {number} [graceMs]
 * @returns {Promise<void>}
 */
export function stopProcess(child, graceMs = 10_000) {
  if (!child || gone(child)) return Promise.resolve()
  return new Promise((resolve) => {
    const force = setTimeout(() => killTree(child, 'SIGKILL'), graceMs)
    const done = () => {
      clearTimeout(force)
      resolve()
    }
    child.once('exit', done)
    child.once('error', done)
    killTree(child, 'SIGTERM')
  })
}

/** "1 second", "5 seconds". @param {number} count @param {string} word */
const unit = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

/**
 * How long something took, in words: "2.5 seconds", "12 minutes 5 seconds",
 * "1 hour 3 minutes". The log says how long each install and build took,
 * which is what tells the owner whether a slow server needs a longer limit
 * (UPDATE_STEP_MINUTES).
 * @param {number} ms
 */
export function formatDuration(ms) {
  if (ms < 60_000) return unit(Math.max(0, Math.round(ms / 100) / 10), 'second')
  const seconds = Math.round(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return seconds % 60 ? `${unit(minutes, 'minute')} ${unit(seconds % 60, 'second')}` : unit(minutes, 'minute')
  const hours = Math.floor(minutes / 60)
  return minutes % 60 ? `${unit(hours, 'hour')} ${unit(minutes % 60, 'minute')}` : unit(hours, 'hour')
}

/** How long each step of an update may take, unless UPDATE_STEP_MINUTES says otherwise. */
export const stepTimeoutMs = 15 * 60_000

/**
 * How long an update's install, build and database step may each take:
 * UPDATE_STEP_MINUTES from .env, in whole minutes, or 15 minutes when it is
 * not set. A server with one or two CPU cores can need longer to build. A
 * setting that is not a whole number above zero keeps the default, and
 * problem says so for the console.
 * @param {string} text the setting as written, "" when it is not set
 * @returns {{ ms: number, problem: string | null }}
 */
export function stepLimit(text) {
  if (text === '') return { ms: stepTimeoutMs, problem: null }
  const minutes = /^\d+$/.test(text) ? Number(text) : Number.NaN
  if (Number.isSafeInteger(minutes) && minutes > 0) return { ms: minutes * 60_000, problem: null }
  return {
    ms: stepTimeoutMs,
    problem: `UPDATE_STEP_MINUTES is "${text.slice(0, 40)}", not a whole number of minutes above zero, so an update gives each step ${formatDuration(stepTimeoutMs)}.`,
  }
}

/** How a shell reports a child that was killed outright: 128 and signal 9. */
const killedExitCode = 137

/**
 * What to say about a command that ended badly. A command the updater stops
 * for taking too long has its own message, so one killed outright was stopped
 * from outside, and on a server with a memory limit that nearly always means
 * it ran out. The bare exit code told the owner nothing.
 * @param {string} label
 * @param {number | null} code
 * @param {string | null} signal
 */
export function failureMessage(label, code, signal) {
  const failed = `${label} failed (${signal ?? `exit code ${code}`}).`
  if (signal !== 'SIGKILL' && code !== killedExitCode) return failed
  return `${failed} The server stopped it, which nearly always means it ran out of memory. Give the server more memory, or set BUILD_WORKERS in .env to fewer workers.`
}

/** The longest wait setTimeout keeps: it takes anything longer, Infinity included, for one millisecond. */
const longestTimerMs = 2 ** 31 - 1

/**
 * How a command is named in what the updater says. Run through npm's own
 * script on this Node, npm is still called npm.
 * @param {string} command
 * @param {string[]} args
 */
const labelFor = (command, args) => (command === process.execPath ? ['npm', ...args.slice(1)] : [command, ...args]).join(' ')

/**
 * @typedef {{
 *   cwd?: string,
 *   env?: Env,
 *   shell?: boolean,
 *   onLine?: (line: string) => void,
 *   onSpawn?: (child: ChildProcess) => void,
 *   timeoutMs?: number,
 *   timeoutHint?: string,
 *   label?: string,
 * }} RunOptions
 */

/**
 * Runs a command to the end. Rejects with how it ended, or once timeoutMs
 * has passed (Infinity, or anything longer than a timer can wait: never),
 * after stopping it and everything it started. timeoutHint follows the
 * message of a command stopped for taking too long: what to do about it.
 * @param {string} command
 * @param {string[]} args
 * @param {RunOptions} [options]
 * @returns {Promise<void>}
 */
export function run(command, args, { cwd, env, shell = false, onLine, onSpawn, timeoutMs = stepTimeoutMs, timeoutHint = '', label = labelFor(command, args) } = {}) {
  return new Promise((resolve, reject) => {
    /** @type {ChildProcess} */
    let child
    try {
      // A group of its own on Linux, which killTree stops as a whole. On
      // Windows it would mean another console, and taskkill does the job.
      child = spawn(command, args, { cwd, env: /** @type {NodeJS.ProcessEnv | undefined} */ (env), shell, detached: !windows, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (error) {
      reject(new Error(`${label} could not start: ${messageOf(error)}`))
      return
    }
    onSpawn?.(child)
    let timedOut = false
    const timer =
      timeoutMs > 0 && timeoutMs <= longestTimerMs
        ? setTimeout(() => {
            timedOut = true
            killTree(child, 'SIGKILL')
          }, timeoutMs)
        : undefined
    eachLine(child.stdout, onLine)
    eachLine(child.stderr, onLine)
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(new Error(`${label} could not start: ${error.message}`))
    })
    child.once('exit', (code, signal) => {
      clearTimeout(timer)
      killGroupLeftovers(child.pid)
      if (code === 0 && !timedOut) resolve()
      else if (timedOut) reject(new Error(`${label} took longer than ${formatDuration(timeoutMs)} and was stopped.${timeoutHint ? ` ${timeoutHint}` : ''}`))
      else reject(new Error(failureMessage(label, code, signal)))
    })
  })
}

/**
 * A port nothing listens on, on every interface, as a trial server will listen.
 * @returns {Promise<number>}
 */
export function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0
      server.close(() => resolve(port))
    })
  })
}

const pause = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * True when nothing listens on port, on every interface, as `next start`
 * will. False only while the port is in use (EADDRINUSE), which is worth
 * waiting for. Any other error, such as EACCES for a port nothing here may
 * listen on, is thrown as it is: no wait would ever end it.
 * @param {number} port
 * @returns {Promise<boolean>}
 */
export function portFree(port) {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', (/** @type {NodeJS.ErrnoException} */ error) => (error.code === 'EADDRINUSE' ? resolve(false) : reject(error)))
    server.listen(port, () => server.close(() => resolve(true)))
  })
}

/**
 * Waits up to timeoutMs for port to come free: a server that was just
 * stopped can hold it for a moment. Throws at once, as portFree does, when
 * the port cannot be listened on at all.
 * @param {number} port
 * @param {number} [timeoutMs]
 */
export async function waitForFreePort(port, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    if (await portFree(port)) return true
    if (Date.now() >= deadline) return false
    await pause(250)
  }
}

/**
 * @typedef {{ path?: string, started?: () => boolean }} AnswerOptions path is
 *   updater.checkPath, "/" unless the app says otherwise. started says
 *   whether the server has been spawned yet: one that waits for its port has
 *   not, and nothing that answers meanwhile is it.
 */

/**
 * True once GET path answers 200 and the server started for it is still
 * running a moment later; false if isGone() says it ended, or the time runs
 * out. A server that failed to bind leaves whatever else holds the port
 * answering, so only a 200 from a live child counts.
 * @param {number} port
 * @param {() => boolean} isGone
 * @param {number} [timeoutMs]
 * @param {AnswerOptions} [options]
 * @returns {Promise<boolean>}
 */
export async function answers(port, isGone, timeoutMs = 120_000, { path = '/', started = () => true } = {}) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (isGone()) return false
    if (!started()) {
      await pause(250)
      continue
    }
    try {
      // Each try gets its own limit: one that hangs must not use up the time.
      const response = await fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
      await response.body?.cancel()
      if (response.status === 200) {
        await pause(1000)
        return !isGone()
      }
    } catch {
      // Not listening yet.
    }
    await pause(1000)
  }
  return false
}

/**
 * True when something accepts a connection on port at 127.0.0.1. The
 * connection is then closed the polite way, after reading whatever the
 * server says first (a mail server's greeting), so the server sees a client
 * that left rather than one that was cut off.
 * @param {number} port
 * @returns {Promise<boolean>}
 */
export function accepts(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: '127.0.0.1' })
    socket.setTimeout(5000, () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('connect', () => {
      resolve(true)
      socket.setTimeout(2000, () => socket.destroy())
      socket.resume()
      socket.end()
    })
    socket.on('error', () => resolve(false))
    socket.once('close', () => socket.setTimeout(0))
  })
}

/**
 * The check for a process beside the website: true once every one of its
 * ports accepts a connection and the process is still running a moment
 * later. With no ports to try, true when it is still running after
 * settleMs. False as soon as isGone() says it ended, or when the time runs
 * out.
 * @param {number[]} ports
 * @param {() => boolean} isGone
 * @param {{ timeoutMs?: number, settleMs?: number, started?: () => boolean }} [options] started as for answers
 * @returns {Promise<boolean>}
 */
export async function listens(ports, isGone, { timeoutMs = 120_000, settleMs = 5000, started = () => true } = {}) {
  const deadline = Date.now() + timeoutMs
  while (!started()) {
    if (isGone() || Date.now() >= deadline) return false
    await pause(250)
  }
  if (ports.length === 0) {
    const until = Date.now() + settleMs
    while (Date.now() < until) {
      if (isGone()) return false
      await pause(Math.min(250, Math.max(0, until - Date.now())))
    }
    return !isGone()
  }
  while (Date.now() < deadline) {
    if (isGone()) return false
    if ((await Promise.all(ports.map(accepts))).every(Boolean)) {
      await pause(1000)
      return !isGone()
    }
    await pause(500)
  }
  return false
}

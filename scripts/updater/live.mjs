// A server the supervisor keeps running (scripts/serve.mjs): the live
// `next start`, and each process beside it. Started from a folder, and
// started again whenever it stops or fails to start. After a switch to a new
// release it is also watched: three stops within ten minutes of the switch
// call onCrashLoop instead of another restart, so the supervisor can go back
// to the release before.
//
// Given its ports, it starts only once nothing else holds them, and waits
// for them otherwise. A server started onto a taken port only exits with
// "port in use", over and over, and soon after an install each of those
// exits would count as a crash of a release that is fine. A port that cannot
// be listened on for any other reason (EACCES, say) is never waited for:
// that is said at once. Kept apart so the tests can drive it.
import { messageOf, portFree } from './process.mjs'

export const crashLimit = 3
export const crashWindowMs = 10 * 60_000

/**
 * @typedef {import('node:child_process').ChildProcess} ChildProcess
 * @typedef {{ dir: string, child: ChildProcess | null, wanted: boolean, ended: boolean, startedAt: number, timer: unknown, waitSaid: boolean }} LiveEntry
 */

/**
 * @param {{
 *   name?: string,
 *   start: (dir: string) => ChildProcess,
 *   stop: (child: ChildProcess) => Promise<void>,
 *   print: (line: string) => void,
 *   onCrashLoop: (dir: string) => void,
 *   ports?: () => number[],
 *   isFree?: (port: number) => Promise<boolean>,
 *   portRetryMs?: number,
 *   now?: () => number,
 *   setTimer?: (callback: () => void, ms: number) => unknown,
 *   clearTimer?: (timer: unknown) => void,
 * }} options name is what the console calls it ("next start", "mail").
 *   ports, when given, are the ports it listens on: each start waits until
 *   isFree says every one is free, looking again every portRetryMs.
 */
export function liveServer({
  name = 'next start',
  start,
  stop,
  print,
  onCrashLoop,
  ports,
  isFree = portFree,
  portRetryMs = 5000,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = /** @type {(timer: unknown) => void} */ (clearTimeout),
}) {
  /** @type {LiveEntry | null} */
  let entry = null
  let backoff = 1000
  /** @type {{ dir: string, since: number, crashes: number } | null} */
  let watch = null

  /** Still the server meant to run: not stopped on purpose, nor replaced. @param {LiveEntry} current */
  const meant = (current) => entry === current && current.wanted

  /**
   * @param {LiveEntry} current
   * @param {string} why
   */
  function stopped(current, why) {
    if (current.ended) return
    current.ended = true
    if (!meant(current)) return
    const dir = current.dir
    if (watch && watch.dir === dir && now() - watch.since < crashWindowMs && ++watch.crashes >= crashLimit) {
      watch = null
      print(`${name} stopped (${why}) for the third time within ten minutes of this release's switch`)
      onCrashLoop(dir)
      return
    }
    backoff = now() - current.startedAt < 60_000 ? Math.min(backoff * 2, 30_000) : 1000
    print(`${name} stopped (${why}); starting it again in ${backoff / 1000} s`)
    current.timer = setTimer(() => {
      current.timer = null
      if (meant(current)) launch(dir)
    }, backoff)
  }

  /** @param {LiveEntry} current */
  function spawnFor(current) {
    current.startedAt = now()
    try {
      current.child = start(current.dir)
    } catch (error) {
      // Spawning can fail outright (EAGAIN, ENOMEM while a build runs): a stop like any other.
      queueMicrotask(() => stopped(current, `could not start: ${messageOf(error)}`))
      return
    }
    current.child.once('exit', (code, signal) => stopped(current, signal ?? `exit code ${code}`))
    // A failed spawn emits 'error' and never 'exit'.
    current.child.once('error', (error) => stopped(current, `could not start: ${error.message}`))
  }

  /**
   * Starts current once none of its ports is held by something else.
   * @param {LiveEntry} current
   * @param {number[]} wanted
   */
  async function whenFree(current, wanted) {
    current.timer = null
    if (!meant(current)) return
    /** @type {number | undefined} */
    let taken
    try {
      for (const port of wanted) {
        if (!(await isFree(port))) {
          taken = port
          break
        }
      }
    } catch (error) {
      // Not in use, which waiting would cure: the port cannot be listened
      // on at all. Marked ended, so that a restart or an update can try again.
      if (meant(current)) {
        current.ended = true
        print(`${name} cannot be started: ${messageOf(error)}.`)
      }
      return
    }
    if (!meant(current)) return
    if (taken !== undefined) {
      if (!current.waitSaid) {
        print(`Port ${taken} is in use by a process this updater did not start, so ${name} starts once it is free. Stop that process, or restart the server.`)
        current.waitSaid = true
      }
      current.timer = setTimer(() => void whenFree(current, wanted), portRetryMs)
      return
    }
    if (current.waitSaid) print(`Port ${wanted.join(', ')} is free now, so ${name} starts.`)
    spawnFor(current)
  }

  /** @param {string} dir */
  function launch(dir) {
    /** @type {LiveEntry} */
    const current = { dir, child: null, wanted: true, ended: false, startedAt: now(), timer: null, waitSaid: false }
    entry = current
    const wanted = ports?.() ?? []
    if (wanted.length > 0) void whenFree(current, wanted)
    else spawnFor(current)
    return current
  }

  /** Stops the live server, and keeps it stopped. */
  async function stopLive() {
    const current = entry
    if (!current) return
    current.wanted = false
    clearTimer(current.timer)
    current.timer = null
    if (current.child) await stop(current.child)
  }

  return {
    /**
     * Starts dir as the live server, after stopping any that still runs: two
     * servers would fight over one port. A restart of the same folder can
     * keep its crash watch (keepWatch); anything else ends it.
     * @param {string} dir
     * @param {{ keepWatch?: boolean }} [options]
     */
    async start(dir, { keepWatch = false } = {}) {
      await stopLive()
      if (!(keepWatch && watch?.dir === dir)) watch = null
      return launch(dir)
    },
    stop: stopLive,
    /**
     * Counts the live release's stops from since on: called right after a
     * switch to it, or at start-up with the time it was installed.
     * @param {number} [since]
     */
    watchCrashes(since = now()) {
      if (entry) watch = { dir: entry.dir, since, crashes: 0 }
    },
    /**
     * Starts dir unless a server is running, about to be started again, or
     * waiting for its port. True when it started one.
     * @param {string} dir
     */
    ensure(dir) {
      if (entry && entry.wanted && (!entry.ended || entry.timer !== null)) return false
      watch = null
      launch(dir)
      return true
    },
    /** The live server, or null before the first start. */
    get current() {
      return entry
    },
    /** True when nothing is meant to be running: never started, or stopped and not started again. */
    idle() {
      return !entry || !entry.wanted
    },
  }
}

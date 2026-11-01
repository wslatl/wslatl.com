// The live `next start` (scripts/serve.mjs): started from a folder, and
// started again whenever it stops or fails to start. After a switch to a new
// release it is also watched: three stops within ten minutes of the switch
// call onCrashLoop instead of another restart, so the supervisor can go back
// to the release before. Kept apart so the tests can drive it
// (tests/updater-live.test.ts).

export const crashLimit = 3
export const crashWindowMs = 10 * 60_000

/**
 * @param {{
 *   start: (dir: string) => import('node:child_process').ChildProcess,
 *   stop: (child: import('node:child_process').ChildProcess) => Promise<void>,
 *   print: (line: string) => void,
 *   onCrashLoop: (dir: string) => void,
 *   now?: () => number,
 *   setTimer?: (callback: () => void, ms: number) => unknown,
 *   clearTimer?: (timer: unknown) => void,
 * }} options
 */
export function liveServer({
  start,
  stop,
  print,
  onCrashLoop,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = /** @type {(timer: unknown) => void} */ (clearTimeout),
}) {
  /** @type {{ dir: string, child: any, wanted: boolean, ended: boolean, startedAt: number, timer: unknown } | null} */
  let entry = null
  let backoff = 1000
  /** @type {{ dir: string, since: number, crashes: number } | null} */
  let watch = null

  /** @param {string} dir */
  function launch(dir) {
    const current = { dir, child: null, wanted: true, ended: false, startedAt: now(), timer: /** @type {unknown} */ (null) }
    entry = current
    /** @param {string} why */
    const ended = (why) => {
      if (current.ended) return
      current.ended = true
      if (entry !== current || !current.wanted) return
      if (watch && watch.dir === dir && now() - watch.since < crashWindowMs && ++watch.crashes >= crashLimit) {
        watch = null
        print(`next start stopped (${why}) for the third time within ten minutes of this release's switch`)
        onCrashLoop(dir)
        return
      }
      backoff = now() - current.startedAt < 60_000 ? Math.min(backoff * 2, 30_000) : 1000
      print(`next start stopped (${why}); starting it again in ${backoff / 1000} s`)
      current.timer = setTimer(() => {
        if (entry === current && current.wanted) launch(dir)
      }, backoff)
    }
    try {
      current.child = start(dir)
    } catch (error) {
      // Spawning can fail outright (EAGAIN, ENOMEM while a build runs): a stop like any other.
      queueMicrotask(() => ended(`could not start: ${error instanceof Error ? error.message : error}`))
      return current
    }
    current.child.once('exit', (/** @type {number | null} */ code, /** @type {string | null} */ signal) =>
      ended(signal ?? `exit code ${code}`),
    )
    // A failed spawn emits 'error' and never 'exit'.
    current.child.once('error', (/** @type {Error} */ error) => ended(`could not start: ${error.message}`))
    return current
  }

  /** Stops the live server, and keeps it stopped. */
  async function stopLive() {
    const current = entry
    if (!current) return
    current.wanted = false
    clearTimer(current.timer)
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
     * Starts dir unless a server is running or about to be started again.
     * True when it started one.
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

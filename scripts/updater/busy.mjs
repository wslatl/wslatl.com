// The supervisor's busy flag (scripts/serve.mjs). One for everything that
// moves the live site: start-up until its build and clean-up are done,
// updates, rollbacks and restarts, so two of them never start servers on one
// port. Whoever holds it owns the live server and the processes beside it: a
// crash rollback that comes up meanwhile waits for it, and nothing starts the
// site behind the holder's back. Kept apart so the tests can drive the order.

/**
 * @param {{
 *   onCrashLoopDue: (dir: string) => void,
 *   ensureServing: () => void,
 * }} options onCrashLoopDue runs a crash rollback that had to wait; it takes
 *   the flag again at once, before its first await. ensureServing starts the
 *   site when nothing serves.
 */
export function busyFlag({ onCrashLoopDue, ensureServing }) {
  // Start-up holds it from its first line.
  let held = true
  /** @type {string | null} */
  let crashed = null

  return {
    /** True while something holds the flag. */
    get held() {
      return held
    },
    /** Takes the flag; false when something else holds it. */
    take() {
      if (held) return false
      held = true
      return true
    },
    /**
     * Notes a release that kept stopping while the flag was held: it is
     * rolled back once the flag comes free.
     * @param {string} dir
     */
    deferCrash(dir) {
      crashed = dir
    },
    /**
     * Gives the flag back. A crash rollback that waited runs first, and takes
     * the flag again; only when nothing did is the site made sure to serve.
     * The other way round, ensureServing started the crashing release while
     * the rollback was stopping it, and the rollback then found its port taken.
     */
    release() {
      held = false
      const dir = crashed
      crashed = null
      if (dir) onCrashLoopDue(dir)
      if (!held) ensureServing()
    },
  }
}

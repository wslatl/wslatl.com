// The processes beside the website (updater.processes), such as a mail
// server. Each is kept running from the served folder the way the website
// is (scripts/updater/live.mjs): started again when it stops, and watched
// for crashes for ten minutes after an install. A switch moves them after
// the website: each one in turn is asked to stop and given its drainSeconds
// to finish what it is doing, then started from the new folder once its
// ports are free, and must answer on them. The supervisor (scripts/serve.mjs)
// does the spawning; this decides what runs. Kept apart so the tests can
// drive it with stand-in processes.
import { liveServer } from './live.mjs'

/**
 * @typedef {import('./config.mjs').ProcessSettings} ProcessSettings
 * @typedef {import('node:child_process').ChildProcess} ChildProcess
 * @typedef {ReturnType<typeof liveServer>} LiveServer
 * @typedef {{ settings: ProcessSettings, server: LiveServer }} Unit
 */

/** @param {ProcessSettings} a @param {ProcessSettings} b */
const sameSettings = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/**
 * @param {{
 *   start: (dir: string, settings: ProcessSettings) => ChildProcess,
 *   stop: (child: ChildProcess, settings: ProcessSettings) => Promise<void>,
 *   ports: (settings: ProcessSettings) => number[],
 *   waitForPorts: (ports: number[]) => Promise<number | null>,
 *   check: (ports: number[], isGone: () => boolean, started: () => boolean) => Promise<boolean>,
 *   print: (line: string) => void,
 *   onCrashLoop: (dir: string, restartForNow: () => Promise<unknown>) => void,
 *   live?: Partial<Parameters<typeof liveServer>[0]>,
 * }} options start spawns a process from dir on its live ports. stop asks
 *   it to stop, waits its drainSeconds, then makes it. ports are its live
 *   ports, read from its settings. waitForPorts waits a moment for ports to
 *   come free, and gives back the first one still taken, or null. check says
 *   whether the process answers on them. live holds the timers and clock for
 *   the tests.
 */
export function processSet({ start, stop, ports, waitForPorts, check, print, onCrashLoop, live = {} }) {
  /** @type {Map<string, Unit>} */
  const units = new Map()

  /** @param {ProcessSettings} settings @returns {Unit} */
  function unitFor(settings) {
    /** @type {LiveServer} */
    const server = liveServer({
      ...live,
      name: settings.name,
      start: (dir) => start(dir, settings),
      stop: (child) => stop(child, settings),
      print,
      ports: () => ports(settings),
      onCrashLoop: (dir) => onCrashLoop(dir, () => server.start(dir)),
    })
    return { settings, server }
  }

  /**
   * Starts one process from dir, once its ports are free, and checks it answers.
   * @param {Unit} unit
   * @param {string} dir
   * @param {(line: string) => void} onLine
   * @param {boolean} keepWatch
   */
  async function startChecked(unit, dir, onLine, keepWatch) {
    const { settings, server } = unit
    const taken = await waitForPorts(ports(settings))
    if (taken !== null) {
      onLine(`Port ${taken} is still taken by another process, so ${settings.name} cannot start on it.`)
      // Meant to run from here on: it starts by itself once the port is free.
      server.ensure(dir)
      return false
    }
    const entry = await server.start(dir, { keepWatch })
    const ok = await check(
      ports(settings),
      () => entry.ended || server.current !== entry,
      () => entry.child !== null,
    )
    onLine(ok ? `${settings.name} answers.` : `${settings.name} did not answer.`)
    return ok
  }

  return {
    /** The names of the processes meant to run. */
    get names() {
      return [...units.keys()]
    },

    /** The folders processes are meant to run from, which no clean-up may delete. */
    get folders() {
      return [...new Set([...units.values()].filter((unit) => !unit.server.idle()).map((unit) => /** @type {string} */ (unit.server.current?.dir)))]
    },

    /** The process with this name, for the tests and the console. @param {string} name */
    unit(name) {
      return units.get(name)
    },

    /**
     * Makes dir's processes the ones that run: each one that runs from
     * another folder, or with other settings, is stopped with its drain and
     * started from dir; one no longer in the list is stopped; one already
     * running from dir is left alone unless restart is set. True when every
     * process answers.
     * @param {string} dir
     * @param {readonly ProcessSettings[]} list dir's updater.processes
     * @param {(line: string) => void} onLine
     * @param {{ restart?: boolean, keepWatch?: boolean }} [options]
     */
    async switchTo(dir, list, onLine, { restart = false, keepWatch = false } = {}) {
      const wanted = new Set(list.map((settings) => settings.name))
      // A copy, since the loop deletes from units, and waits between.
      for (const [name, unit] of Array.from(units)) {
        if (wanted.has(name)) continue
        onLine(`Stopping ${name}, which the new folder does not run, after up to ${unit.settings.drainSeconds} s to finish its work.`)
        await unit.server.stop()
        units.delete(name)
      }
      let ok = true
      for (const settings of list) {
        const running = units.get(settings.name)
        const same = running !== undefined && sameSettings(running.settings, settings)
        if (same && !restart && running.server.current?.dir === dir && !running.server.idle()) continue
        if (running && !running.server.idle()) {
          onLine(`Stopping ${settings.name}, after up to ${running.settings.drainSeconds} s to finish its work.`)
          await running.server.stop()
        }
        const unit = same && running ? running : unitFor(settings)
        units.set(settings.name, unit)
        onLine(`Starting ${settings.name}.`)
        if (!(await startChecked(unit, dir, onLine, keepWatch && same))) ok = false
      }
      return ok
    },

    /**
     * Starts each of dir's processes that is not running or about to start
     * again, without waiting for it: at start-up, and when nothing serves.
     * @param {string} dir
     * @param {readonly ProcessSettings[]} list
     */
    ensure(dir, list) {
      for (const settings of list) {
        let unit = units.get(settings.name)
        if (!unit || !sameSettings(unit.settings, settings)) {
          if (unit && !unit.server.idle()) continue
          unit = unitFor(settings)
          units.set(settings.name, unit)
        }
        unit.server.ensure(dir)
      }
    },

    /** Stops every process, each with its drain, all at once. */
    async stopAll() {
      await Promise.all([...units.values()].map((unit) => unit.server.stop()))
    },

    /**
     * Counts each process's stops from since on, as for the website.
     * @param {number} [since]
     */
    watchCrashes(since) {
      for (const unit of units.values()) unit.server.watchCrashes(since)
    },
  }
}

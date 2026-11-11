// How many workers `next build` renders the pages with, for an app's
// next.config.mjs, which imports it from here as it imports release.mjs:
//
//   import { PHASE_PRODUCTION_BUILD } from 'next/constants'
//   import { withBuildWorkers } from './scripts/updater/build-workers.mjs'
//
//   export default (phase) => (phase === PHASE_PRODUCTION_BUILD ? withBuildWorkers(nextConfig) : nextConfig)
//
// Left to Next, which is the normal case: one fewer than the CPUs it sees,
// and at least one. BUILD_WORKERS, in .env or the panel's variables, sets
// another number, in either direction, and the supervisor hands it to every
// build (buildSettings in scripts/updater/env.mjs). Every CPU with at least
// four workers was tried on the knowledge base, and ran a server with a
// tight memory limit out of memory: each worker needs its own.
import { availableParallelism } from 'node:os'

/** A value that was refused goes back into the log, but not a whole pasted file. */
const shownLength = 40

/**
 * The worker count, when BUILD_WORKERS sets one, and one line for the build
 * log that says what was found and used.
 * @param {string | undefined} setting BUILD_WORKERS as it was given, if it was
 * @param {number} cpus what Node says this process may use
 * @returns {{ workers: number | undefined, line: string }}
 */
export function chooseBuildWorkers(setting, cpus) {
  const text = (setting ?? '').trim()
  // Digits only: Number() would also take "1e3", "0x10" and "4.0".
  const asked = /^[0-9]+$/.test(text) ? Number(text) : 0
  if (asked >= 1 && Number.isSafeInteger(asked)) {
    return { workers: asked, line: `CPUs seen: ${cpus}, workers: ${asked} (from BUILD_WORKERS)` }
  }
  const shown = text.replaceAll(/\s+/g, ' ').slice(0, shownLength)
  const refused = text ? ` (BUILD_WORKERS "${shown}" ignored: it has to be a whole number of at least 1)` : ''
  return { workers: undefined, line: `CPUs seen: ${cpus}, workers: Next's default${refused}` }
}

/** Left in the build's environment once the line has been printed. */
const said = 'PLATFORM_BUILD_WORKERS_SAID'

/**
 * Prints the line the first time a build gets here. Next loads its config
 * more than once, in the main process and again in the workers it starts,
 * and each load would print it. The mark in the environment is copied into
 * every worker when it starts, and the next build begins without it.
 * @param {string} line
 * @param {Record<string, string | undefined>} [env]
 * @param {(line: string) => void} [print]
 */
export function sayOncePerBuild(line, env = process.env, print = console.log) {
  if (env[said]) return
  env[said] = '1'
  print(line)
}

/**
 * The Next config with BUILD_WORKERS applied, for the production build only.
 * Says once in the build log what it found and used.
 * @template {{ experimental?: object }} T
 * @param {T} config
 * @param {Record<string, string | undefined>} [env]
 * @returns {T}
 */
export function withBuildWorkers(config, env = process.env) {
  const { workers, line } = chooseBuildWorkers(env.BUILD_WORKERS, availableParallelism())
  sayOncePerBuild(line, env)
  return workers ? { ...config, experimental: { ...config.experimental, cpus: workers } } : config
}

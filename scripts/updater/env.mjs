// Which settings each process the updater starts is given. npm and the
// builds get nothing from .env, and the token reaches only the live website,
// whose admin reads releases with it: never npm, a build, a trial, a process
// beside the website or the database step. That keeps settings out of
// builds, bundles and logs, where they would otherwise land by accident. It
// is no wall against hostile code: everything here runs as one user, which
// can read .env as a file. That is why npm ci runs no install scripts but
// the few an app names, and why the token should be a fine-grained one for
// the one repository, with no more access than the app needs.
import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'

/** @typedef {Record<string, string | undefined>} Env */

const windows = process.platform === 'win32'

/** The kit's own secrets, kept from npm, every build and the database step, wherever they are set. */
export const kitSecrets = Object.freeze(['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN'])

/** Only the supervisor and the live website use these. A trial, a process beside the website and the database step never get them. */
export const supervisorOnly = Object.freeze(['GITHUB_TOKEN', 'UPDATER_DIR'])

/** What a setting's name may look like: letters, digits and underscores, not starting with a digit. */
export const settingName = /^[A-Za-z_][A-Za-z0-9_]*$/

/**
 * Whether two setting names are the same setting. Windows ignores case in
 * them, so there `github_token` is GITHUB_TOKEN.
 * @param {string} a
 * @param {string} b
 */
export const sameName = (a, b) => (windows ? a.toUpperCase() === b.toUpperCase() : a === b)

/**
 * env without the named settings.
 * @param {Env} env
 * @param {readonly string[]} names
 * @returns {Env}
 */
export function withoutSecrets(env, names) {
  return Object.fromEntries(Object.entries(env).filter(([name]) => !names.some((secret) => sameName(name, secret))))
}

/**
 * .env as Node reads it: quotes dropped, `export ` allowed, nothing expanded.
 * An empty object when there is no such file.
 * @param {string} file
 * @returns {Env}
 */
export function loadEnvFile(file) {
  return existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {}
}

/**
 * The settings a build is given on purpose: BUILD_WORKERS (how many workers
 * render its pages, scripts/updater/build-workers.mjs) and each name in
 * updater.buildEnv. A release is built in a folder of its own with no .env
 * in it, so a setting that is not handed over never arrives. The panel's
 * variable wins over .env, as it does for every other setting. A blank
 * BUILD_WORKERS is left out, so the build makes its own choice.
 * @param {Env} fileEnv what .env holds
 * @param {Env} panelEnv the panel's variables
 * @param {readonly string[]} [names] updater.buildEnv
 * @returns {Record<string, string>}
 */
export function buildSettings(fileEnv, panelEnv, names = []) {
  /** @type {Record<string, string>} */
  const given = {}
  const workers = (panelEnv.BUILD_WORKERS ?? fileEnv.BUILD_WORKERS ?? '').trim()
  if (workers) given.BUILD_WORKERS = workers
  for (const name of names) {
    const value = panelEnv[name] ?? fileEnv[name]
    if (value !== undefined) given[name] = value
  }
  return given
}

/**
 * A function that hides each secret's value wherever it appears in a line,
 * for the console and the update log. A value shorter than eight characters
 * is left alone: hiding it would garble ordinary words, and no token is that
 * short.
 * @param {readonly (string | undefined)[]} values
 * @returns {(line: string) => string}
 */
export function redactor(values) {
  const hidden = values.filter(/** @returns {value is string} */ (value) => typeof value === 'string' && value.length >= 8)
  if (hidden.length === 0) return (line) => line
  return (line) => hidden.reduce((text, value) => text.replaceAll(value, '[hidden]'), line)
}

// What the app's platform.config.mjs asks of the updater, beyond the plain
// install, build and switch: its `updater` settings. Each folder the
// supervisor installs or serves is read on its own, so a release's own
// settings decide how that release is installed and run.
//
// The file is read in a short-lived child Node, with none of .env and no
// token in its environment, and validated there by the folder's own
// definePlatformConfig (platform/config.mjs). The release's code then never
// runs inside the supervisor, and never sees the token before its trial
// start. What comes back is checked again here, with the same rules, because
// the supervisor acts on it and a config file need not call
// definePlatformConfig at all. The rules match updaterProblems in
// platform/config.mjs, and a test holds them together.
//
// With no platform.config.mjs the settings are the defaults, and the updater
// does exactly what the main website's always has.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { devOnlyPaths } from './dev-files.mjs'
import { kitSecrets, settingName } from './env.mjs'

/**
 * @typedef {{ name: string, command: string, args: string[], ports: string[], drainSeconds: number }} ProcessSettings
 * @typedef {{ backup: string, apply: string }} MigrateSettings
 * @typedef {{
 *   afterInstall: string[],
 *   installScripts: string[],
 *   buildEnv: string[],
 *   processes: ProcessSettings[],
 *   trialEnv: Record<string, string>,
 *   migrate: MigrateSettings | null,
 *   dataDir: string | null,
 *   checkPath: string,
 * }} UpdaterSettings
 */

/** @type {Readonly<UpdaterSettings>} */
export const defaultSettings = Object.freeze({
  afterInstall: [],
  installScripts: [],
  buildEnv: [],
  processes: [],
  trialEnv: {},
  migrate: null,
  dataDir: null,
  checkPath: '/',
})

const keys = ['afterInstall', 'installScripts', 'buildEnv', 'processes', 'trialEnv', 'migrate', 'dataDir', 'checkPath']
const processKeys = ['name', 'command', 'args', 'ports', 'drainSeconds']
const migrateKeys = ['backup', 'apply']

/** An npm script, by the name package.json gives it, such as "db:migrate". Never anything npm could take for an option. */
const scriptName = /^[A-Za-z0-9][\w:.-]{0,99}$/
/** A package on npm, such as "better-sqlite3" or "@node-rs/argon2". */
const packageName = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/
/** A process's name in the console, such as "mail". */
const processName = /^[a-z][a-z0-9-]{0,29}$/
/** A JavaScript file inside the release folder, such as "dist/mail/server.js". */
const scriptFile = /^(?:[\w@+-][\w.@+-]*\/)*[\w@+-][\w.@+-]*\.[cm]?js$/
/** A page on the site, such as "/api/health". */
const pagePath = /^\/(?!\/)[A-Za-z0-9._~/-]{0,199}$/
/** An absolute path on Linux or Windows. */
const absolutePath = /^(?:\/|[A-Za-z]:[\\/])/
/** Set by the updater itself in the trial start and the database step, so a trialEnv may not set them. */
const updaterSets = ['GITHUB_TOKEN', 'UPDATER_DIR', 'PLATFORM_TRIAL', 'PLATFORM_BACKUP_DIR']

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * @param {unknown} value
 * @param {RegExp} pattern
 * @param {number} most
 * @returns {value is string[]}
 */
const listOf = (value, pattern, most) => Array.isArray(value) && value.length <= most && value.every((item) => typeof item === 'string' && pattern.test(item))

/** @param {string[]} list */
const hasRepeats = (list) => new Set(list).size !== list.length

/**
 * Every problem with the updater part of platform.config.mjs, one plain
 * sentence each. platform/config.mjs has the same rules.
 * @param {unknown} updater
 * @returns {string[]}
 */
export function updaterProblems(updater) {
  if (updater === undefined || updater === null) return []
  if (!isObject(updater)) return ['updater must be an object of settings.']
  /** @type {string[]} */
  const problems = []
  for (const key of Object.keys(updater)) {
    if (!keys.includes(key)) problems.push(`updater.${key} is not a setting the updater knows.`)
  }
  const { afterInstall, installScripts, buildEnv, processes, trialEnv, migrate, dataDir, checkPath } = updater
  if (afterInstall !== undefined && !listOf(afterInstall, scriptName, 20)) {
    problems.push('updater.afterInstall must list npm scripts from package.json by name, such as "db:generate".')
  }
  if (installScripts !== undefined && !(listOf(installScripts, packageName, 20) && installScripts.every((name) => name.length <= 214))) {
    problems.push('updater.installScripts must list packages by name, such as "better-sqlite3".')
  }
  if (buildEnv !== undefined) {
    if (!listOf(buildEnv, settingName, 50)) problems.push('updater.buildEnv must list the names of settings, such as "DATABASE_PROVIDER".')
    else {
      for (const name of buildEnv.filter((item) => kitSecrets.some((secret) => secret.toUpperCase() === item.toUpperCase()))) {
        problems.push(`updater.buildEnv cannot list ${name}: the kit's own secrets never go into a build.`)
      }
    }
  }
  if (processes !== undefined) {
    if (!Array.isArray(processes) || processes.length > 10) problems.push('updater.processes must be a list of at most 10 processes.')
    else {
      processes.forEach((entry, index) => problems.push(...processProblems(entry, `updater.processes[${index}]`)))
      const names = processes.map((entry) => (isObject(entry) ? entry.name : undefined)).filter((name) => typeof name === 'string')
      if (hasRepeats(names)) problems.push('updater.processes has two processes with the same name.')
      const ports = processes.flatMap((entry) => (isObject(entry) && Array.isArray(entry.ports) ? entry.ports : [])).filter((name) => typeof name === 'string')
      if (hasRepeats(ports)) problems.push('updater.processes names the same port setting twice.')
    }
  }
  if (trialEnv !== undefined) {
    if (!isObject(trialEnv)) problems.push('updater.trialEnv must be an object of settings, such as { DISABLE_SCHEDULER: "1" }.')
    else {
      for (const [name, value] of Object.entries(trialEnv)) {
        if (!settingName.test(name)) problems.push(`updater.trialEnv has "${name.slice(0, 40)}", which is not the name of a setting.`)
        else if (updaterSets.some((set) => set.toUpperCase() === name.toUpperCase())) problems.push(`updater.trialEnv cannot set ${name}: the updater sets it itself.`)
        if (typeof value !== 'string' || value.length > 10_000 || value.includes('\0')) problems.push(`updater.trialEnv.${name.slice(0, 40)} must be text.`)
      }
    }
  }
  if (migrate !== undefined) {
    if (!isObject(migrate)) problems.push('updater.migrate must be { backup, apply }, two npm scripts from package.json.')
    else {
      for (const key of Object.keys(migrate)) {
        if (!migrateKeys.includes(key)) problems.push(`updater.migrate.${key} is not a setting the updater knows.`)
      }
      for (const key of migrateKeys) {
        const value = migrate[key]
        if (typeof value !== 'string' || !scriptName.test(value)) problems.push(`updater.migrate.${key} must name an npm script from package.json, such as "db:${key === 'apply' ? 'migrate' : 'backup'}".`)
      }
      if (dataDir === undefined) problems.push('updater.migrate needs updater.dataDir, where the backups go.')
    }
  }
  if (dataDir !== undefined && !(typeof dataDir === 'string' && absolutePath.test(dataDir) && !dataDir.includes('\0') && dataDir.length <= 500)) {
    problems.push('updater.dataDir must be an absolute path, outside the release folders.')
  }
  if (checkPath !== undefined && !(typeof checkPath === 'string' && pagePath.test(checkPath))) {
    problems.push('updater.checkPath must be a page on the site, such as "/api/health".')
  }
  return problems
}

/**
 * @param {unknown} entry
 * @param {string} where
 * @returns {string[]}
 */
function processProblems(entry, where) {
  if (!isObject(entry)) return [`${where} must be { name, command }, with args, ports and drainSeconds if it needs them.`]
  /** @type {string[]} */
  const problems = []
  for (const key of Object.keys(entry)) {
    if (!processKeys.includes(key)) problems.push(`${where}.${key} is not a setting the updater knows.`)
  }
  const { name, command, args, ports, drainSeconds } = entry
  if (typeof name !== 'string' || !processName.test(name)) problems.push(`${where}.name must be short, in lowercase letters, digits and dashes, such as "mail".`)
  if (typeof command !== 'string' || !scriptFile.test(command) || command.split('/').some((part) => /^\.+$/.test(part))) {
    problems.push(`${where}.command must be a JavaScript file inside the release folder, such as "dist/mail/server.js".`)
  }
  if (args !== undefined && !(Array.isArray(args) && args.length <= 50 && args.every((arg) => typeof arg === 'string' && arg.length <= 1000 && !arg.includes('\0')))) {
    problems.push(`${where}.args must be a list of text.`)
  }
  if (ports !== undefined) {
    if (!listOf(ports, settingName, 10)) problems.push(`${where}.ports must list the names of the settings that hold its ports, such as "SMTP_PORT".`)
    else if (ports.some((port) => updaterSets.includes(port))) problems.push(`${where}.ports cannot name a setting the updater sets itself.`)
  }
  if (drainSeconds !== undefined && !(Number.isInteger(drainSeconds) && /** @type {number} */ (drainSeconds) >= 0 && /** @type {number} */ (drainSeconds) <= 600)) {
    problems.push(`${where}.drainSeconds must be a whole number of seconds from 0 to 600.`)
  }
  return problems
}

/**
 * The settings, checked and filled in with the defaults. Throws with every
 * problem at once, in plain words.
 * @param {unknown} updater the `updater` part of platform.config.mjs
 * @returns {Readonly<UpdaterSettings>}
 */
export function updaterSettings(updater) {
  const problems = updaterProblems(updater)
  if (problems.length > 0) {
    throw new Error(`platform.config.mjs has ${problems.length} problem${problems.length === 1 ? '' : 's'} for the updater:\n- ${problems.join('\n- ')}`)
  }
  if (updater === undefined || updater === null) return defaultSettings
  const given = /** @type {Record<string, any>} */ (updater)
  return Object.freeze({
    afterInstall: [...(given.afterInstall ?? [])],
    installScripts: [...(given.installScripts ?? [])],
    buildEnv: [...(given.buildEnv ?? [])],
    processes: (given.processes ?? []).map((/** @type {Record<string, any>} */ entry) =>
      Object.freeze({
        name: entry.name,
        command: entry.command,
        args: [...(entry.args ?? [])],
        ports: [...(entry.ports ?? [])],
        drainSeconds: entry.drainSeconds ?? 10,
      }),
    ),
    trialEnv: { ...given.trialEnv },
    migrate: given.migrate ? Object.freeze({ backup: given.migrate.backup, apply: given.migrate.apply }) : null,
    dataDir: given.dataDir ?? null,
    checkPath: given.checkPath ?? '/',
  })
}

const windows = process.platform === 'win32'

/** Whether a path from relative() leads up and out, or to another drive. @param {string} path */
const outside = (path) => path === '..' || path.startsWith(`..${sep}`) || absolutePath.test(path)

/** Folders in the site's folder the updater or the kit replaces or deletes, so data must never live in them. */
const managed = ['.updater', '.next', 'node_modules', 'scripts', 'platform', ...devOnlyPaths.map((path) => path.split('/')[0])]

/**
 * What is wrong with where updater.dataDir puts the app's data, or null
 * when nothing is. It must not hold the site's own folder, and inside it
 * must keep out of every folder the updater or the kit replaces or deletes:
 * the releases above all, which go one update after the next.
 * @param {string} root the uploaded folder
 * @param {string | null} dataDir
 * @returns {string | null}
 */
export function dataDirProblem(root, dataDir) {
  if (!dataDir) return null
  const data = resolve(dataDir)
  const site = resolve(root)
  const up = relative(data, site)
  if (!up || !outside(up)) return `updater.dataDir is ${data}, which holds the site's own folder. Give the data a folder of its own.`
  const down = relative(site, data)
  if (outside(down)) return null
  const first = down.split(sep)[0]
  const clash = managed.find((name) => (windows ? name.toLowerCase() === first.toLowerCase() : name === first))
  return clash ? `updater.dataDir is ${data}, inside ${clash}, which the updater replaces or deletes. Put the data somewhere else, such as ${join(site, 'data')}.` : null
}

/** The child that reads a config file. Its arguments are the file and the folder's platform/config.mjs, or "" when there is none. */
const loader = `
const [file, kit] = process.argv.slice(1)
const { pathToFileURL } = await import('node:url')
try {
  let config = (await import(pathToFileURL(file).href)).default
  if (kit) config = (await import(pathToFileURL(kit).href)).definePlatformConfig(config)
  process.stdout.write(JSON.stringify({ repo: config?.repo ?? null, adminAuth: config?.admin?.auth ?? null, updater: config?.updater ?? null }))
} catch (error) {
  process.stderr.write(String(error instanceof Error ? error.message : error))
  process.exitCode = 1
}
`

/**
 * @typedef {{ found: boolean, repo: string | null, adminAuth: string | null, settings: Readonly<UpdaterSettings> }} FolderSettings
 *   found is false when the folder has no platform.config.mjs. repo and
 *   adminAuth are its `repo` and `admin.auth`, for the console.
 */

/**
 * The updater settings of one folder: the uploaded folder, or a release.
 * Rejects with the file's own problems when it has any.
 * @param {string} dir
 * @param {{ env: import('./env.mjs').Env, timeoutMs?: number }} options env is what the child runs with: no secrets
 * @returns {Promise<FolderSettings>}
 */
export async function readSettings(dir, { env, timeoutMs = 30_000 }) {
  const file = join(dir, 'platform.config.mjs')
  if (!existsSync(file)) return { found: false, repo: null, adminAuth: null, settings: defaultSettings }
  const kit = join(dir, 'platform', 'config.mjs')
  const output = await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', loader, file, existsSync(kit) ? kit : ''], {
      cwd: dir,
      env: /** @type {NodeJS.ProcessEnv} */ (env),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    let out = ''
    let problem = ''
    child.stdout.on('data', (chunk) => {
      out += chunk
      if (out.length > 1_000_000) child.kill('SIGKILL')
    })
    child.stderr.on('data', (chunk) => {
      problem = `${problem}${chunk}`.slice(0, 4000)
    })
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs)
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(new Error(`platform.config.mjs could not be read: ${error.message}`))
    })
    child.once('exit', (code) => {
      clearTimeout(timer)
      if (code === 0) resolvePromise(out)
      else reject(new Error(problem.trim() || `platform.config.mjs could not be read within ${timeoutMs / 1000} seconds.`))
    })
  })
  /** @type {{ repo?: unknown, adminAuth?: unknown, updater?: unknown }} */
  let parsed
  try {
    parsed = JSON.parse(/** @type {string} */ (output))
  } catch {
    throw new Error('platform.config.mjs gave settings that could not be read.')
  }
  return {
    found: true,
    repo: typeof parsed.repo === 'string' ? parsed.repo : null,
    adminAuth: typeof parsed.adminAuth === 'string' ? parsed.adminAuth : null,
    settings: updaterSettings(parsed.updater),
  }
}

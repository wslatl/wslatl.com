/**
 * The app's settings for the kit live in `platform.config.mjs` at the app's
 * root, as plain JavaScript, so Next and the supervisor (plain Node, no
 * build step) both read the same file:
 *
 *   import { definePlatformConfig } from './platform/config.mjs'
 *   export default definePlatformConfig({ name: 'Guides', url: 'https://knowledge.wslatl.com', repo: 'wslatl/knowledge.wslatl.com', admin: { auth: 'password' } })
 *
 * @typedef {object} PlatformConfig
 * @property {string} name What the app is called beside the mark, such as "Guides". The main website uses "WSLATL".
 * @property {string} url Where the app is live, such as "https://knowledge.wslatl.com".
 * @property {string} repo The GitHub repo its releases come from, as "owner/name".
 * @property {AdminConfig} admin How its admin works.
 * @property {UpdaterConfig} [updater] What the updater does beyond the plain install, build and switch.
 *
 * @typedef {object} AdminConfig
 * @property {'password' | 'custom'} auth "password" is the kit's one shared password. "custom" means the app plugs in its own check, such as staff accounts. platform/admin/README.md has both.
 * @property {AdminNavItem[]} [nav] The admin's own pages, in the order its header lists them, when it has more than Updates. Left out, the header lists none, as on the main website.
 * @property {boolean} [wide] Pages 72rem wide instead of 56rem, for an admin with tables.
 * @property {string} [signInText] The line on the sign-in card under "Admin". "Sign in to update the site." unless set.
 *
 * @typedef {object} AdminNavItem
 * @property {string} href An address in the admin, such as "/admin/guides".
 * @property {string} label What the header calls it, such as "Guides".
 *
 * @typedef {object} UpdaterConfig
 *   Read by the updater from each release it installs, so a release's own
 *   settings decide how it is installed. Leave it out and the updater does
 *   what the main website's always has. Nothing here runs through a shell.
 * @property {string[]} [afterInstall] npm scripts from the release's package.json, by name, run in order after `npm ci`, such as "db:generate". They see what the build sees.
 * @property {string[]} [installScripts] Packages allowed to run their own install scripts, such as "better-sqlite3": `npm rebuild` runs them after `npm ci`, which installs everything with --ignore-scripts.
 * @property {string[]} [buildEnv] Settings from `.env` or the panel that the after-install scripts and the build may see, by name, such as "DATABASE_PROVIDER". Nothing else from `.env` reaches a build, and the kit's own secrets (GITHUB_TOKEN, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET) can never be listed.
 * @property {ProcessConfig[]} [processes] Processes kept running beside the website, such as a mail server: each tried on spare ports before a switch, given time to finish its work before it is stopped, and started again when it stops, as the website is.
 * @property {Record<string, string>} [trialEnv] Settings for every trial start, over the live ones, such as { DISABLE_SCHEDULER: "1" }, so a trial never runs migrations, schedulers or alerts against live data. A trial also gets PLATFORM_TRIAL=1.
 * @property {MigrateConfig} [migrate] A database step after the build and before the trial start and the switch, with a backup first. Every change must be additive: the version running before goes on running on the changed database until the switch, and again after any rollback.
 * @property {string} [dataDir] Where the app keeps its data, as an absolute path outside the release folders and outside every folder the updater replaces. The database step's backups go in its `backups` folder.
 * @property {string} [checkPath] The page a trial start and a switch must answer with 200, such as "/api/health". Defaults to "/".
 *
 * @typedef {object} ProcessConfig
 * @property {string} name Shown in the console, such as "mail": lowercase letters, digits and dashes.
 * @property {string} command The JavaScript file that runs it, inside the release folder, such as "dist/mail/server.js". It runs on the same Node as the website, never through a shell.
 * @property {string[]} [args] What follows the file on its command line.
 * @property {string[]} [ports] The names of the settings that hold the ports it listens on, such as "SMTP_PORT". A trial start gets a spare port in each, and the process must accept connections on all of them on 127.0.0.1.
 * @property {number} [drainSeconds] How long it may take to finish its work once asked to stop, before it is made to: 0 to 600 seconds, 10 when left out.
 *
 * @typedef {object} MigrateConfig
 * @property {string} backup The npm script that backs the database up into the folder named by PLATFORM_BACKUP_DIR, such as "db:backup". It must write something there.
 * @property {string} apply The npm script that applies the changes, such as "db:migrate".
 */

/**
 * GitHub's own rules: an owner is letters, digits and inner hyphens, at most
 * 39 characters; a repo name is letters, digits, dots, hyphens and
 * underscores, and never "." or "..", so no name can climb out of a path.
 * The admin holds GITHUB_REPO to it too, and the updater keeps the same
 * rule (scripts/updater/github.mjs), which a test holds together.
 */
export const repoPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/(?!\.{1,2}$)[\w.-]{1,100}$/

/** An address in the admin: /admin itself or a path under it, with nothing that leaves it. */
const adminHref = /^\/admin(?:\/[\w-]+)*$/

/**
 * What is wrong with the admin's optional settings, one sentence each.
 * @param {Partial<AdminConfig>} admin
 * @returns {string[]}
 */
function adminProblems(admin) {
  /** @type {string[]} */
  const problems = []
  const { nav, wide, signInText } = admin
  if (nav !== undefined) {
    const good =
      Array.isArray(nav) &&
      nav.every(
        (item) =>
          typeof item?.href === 'string' && adminHref.test(item.href) && typeof item?.label === 'string' && item.label.trim() !== '',
      )
    if (!good) problems.push('admin.nav must be a list of { href, label }, each href an address in the admin such as "/admin/guides".')
    else if (new Set(nav.map((item) => item.href)).size !== nav.length) problems.push('admin.nav lists the same address twice.')
  }
  if (wide !== undefined && typeof wide !== 'boolean') problems.push('admin.wide must be true or false.')
  if (signInText !== undefined && (typeof signInText !== 'string' || signInText.trim() === '')) {
    problems.push('admin.signInText must be a sentence, such as "Sign in to update the site."')
  }
  return problems
}

// The updater's settings. The updater checks them again, with the same
// rules, when it reads a release (scripts/updater/config.mjs), and a test
// holds the two together.
const updaterKeys = ['afterInstall', 'installScripts', 'buildEnv', 'processes', 'trialEnv', 'migrate', 'dataDir', 'checkPath']
const processKeys = ['name', 'command', 'args', 'ports', 'drainSeconds']
const migrateKeys = ['backup', 'apply']
/** The kit's own secrets, which never go into a build. */
const kitSecrets = ['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN']
/** Set by the updater itself in a trial start and the database step. */
const updaterSets = ['GITHUB_TOKEN', 'UPDATER_DIR', 'PLATFORM_TRIAL', 'PLATFORM_BACKUP_DIR']
const settingName = /^[A-Za-z_][A-Za-z0-9_]*$/
const scriptName = /^[A-Za-z0-9][\w:.-]{0,99}$/
const packageName = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/
const processName = /^[a-z][a-z0-9-]{0,29}$/
const scriptFile = /^(?:[\w@+-][\w.@+-]*\/)*[\w@+-][\w.@+-]*\.[cm]?js$/
const pagePath = /^\/(?!\/)[A-Za-z0-9._~/-]{0,199}$/
const absolutePath = /^(?:\/|[A-Za-z]:[\\/])/

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
 * Every problem with the updater settings, one plain sentence each.
 * @param {unknown} updater
 * @returns {string[]}
 */
export function updaterProblems(updater) {
  if (updater === undefined || updater === null) return []
  if (!isObject(updater)) return ['updater must be an object of settings.']
  /** @type {string[]} */
  const problems = []
  for (const key of Object.keys(updater)) {
    if (!updaterKeys.includes(key)) problems.push(`updater.${key} is not a setting the updater knows.`)
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
 * Checks the app's settings once, when they are read, and says plainly
 * what is wrong, so a bad value never reaches the updater on a server.
 * @param {PlatformConfig} config
 * @returns {Readonly<PlatformConfig>}
 */
export function definePlatformConfig(config) {
  /** @type {string[]} */
  const problems = []
  if (typeof config?.name !== 'string' || config.name.trim() === '') problems.push('name must be the app\'s name, such as "Guides".')
  try {
    if (new URL(config?.url).protocol !== 'https:') problems.push('url must start with https://.')
  } catch {
    problems.push('url must be the full address the app is live at, such as "https://knowledge.wslatl.com".')
  }
  if (typeof config?.repo !== 'string' || !repoPattern.test(config.repo)) problems.push('repo must be "owner/name", such as "wslatl/knowledge.wslatl.com".')
  if (config?.admin?.auth !== 'password' && config?.admin?.auth !== 'custom') problems.push('admin.auth must be "password" or "custom".')
  problems.push(...adminProblems(config?.admin ?? {}))
  problems.push(...updaterProblems(config?.updater))
  if (problems.length > 0) {
    throw new Error(`platform.config.mjs has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n- ${problems.join('\n- ')}`)
  }
  return Object.freeze(config)
}

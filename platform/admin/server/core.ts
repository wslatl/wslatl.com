import 'server-only'
import type { PlatformConfig } from '../../config.mjs'
import type { AdminNavItem } from '../components/admin-nav'
import { adminRequest, type AdminAuth, type AdminUser } from './auth'
import { adminLog } from './request'
import { githubSettings, type GitHubSettings } from './settings'

/** The app's settings as the admin uses them, from its platform.config.mjs. */
export type AdminApp = {
  /** The app's name beside the mark, such as "Guides". */
  name: string
  /** What the tab titles and screen readers call the admin's owner: "WSLATL", or "WSLATL Guides". */
  brand: string
  /** Where the app is live, and its host for "Go to knowledge.wslatl.com". */
  url: string
  host: string
  /** The repository its releases come from. */
  repo: string
  /** Which check platform.config.mjs asks for. */
  auth: 'password' | 'custom'
  nav: readonly AdminNavItem[]
  wide: boolean
  signInText: string
  /** The app's own admin pages shown on the Updates page. */
  updateLinks: readonly AdminNavItem[]
}

export function adminApp(config: PlatformConfig): AdminApp {
  return Object.freeze({
    name: config.name,
    brand: config.name === 'WSLATL' ? 'WSLATL' : `WSLATL ${config.name}`,
    url: config.url,
    host: new URL(config.url).host,
    repo: config.repo,
    auth: config.admin.auth,
    nav: Object.freeze([...(config.admin.nav ?? [])]),
    wide: config.admin.wide === true,
    signInText: config.admin.signInText ?? 'Sign in to update the site.',
    updateLinks: Object.freeze(config.admin.updateLinks?.map((link) => Object.freeze({ ...link })) ?? []),
  })
}

/**
 * What the admin has once it is on. The GitHub settings matter for updating
 * alone: github is null while one is missing or broken, and updatesOff then
 * says why, one sentence for each setting and never its value. Every other
 * admin page and route works either way.
 */
export type AdminSettings = { github: GitHubSettings | null; updatesOff: readonly string[] }

/** Someone signed in, as the kit's pages and routes see them. */
export type SignedIn = { name: string; mayUpdate: boolean }

export type AdminCore = {
  app: AdminApp
  /** The app's check, or null for the ready-made files of an app whose check is its own. */
  auth: AdminAuth | null
  signInPath: string
  signOutPath: string
  /**
   * The settings when the admin is on, or null when it is off: when what
   * signing in needs is missing or broken (the shared password's two
   * settings, or the app's own check's problems). Off means a 404 on every
   * admin page and route, never a page that explains why: the reasons go to
   * the server log, once, where only the owner sees them. A GitHub setting
   * missing or broken leaves the admin on with updates off, also logged once.
   */
  settings(): Promise<AdminSettings | null>
  /** Who sent a request, from its headers, or null when nobody is signed in. */
  user(headers: Headers): Promise<SignedIn | null>
}

// On globalThis, because Next may load this module more than once in one
// server, and a problem must still be logged once.
const loggedKey = Symbol.for('wslatl.admin.problemsLogged')
const store = globalThis as typeof globalThis & { [loggedKey]?: Map<string, string> }

/** A name fit for the log and the update request: printable, and short. */
// oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
const printable = (name: string) => name.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 100)

/** Logs a line once for as long as it stays the same, and forgets it once it is null. */
function report(key: string, line: string | null) {
  // Looked up each time, like every other store on globalThis, so what a
  // restart forgets is forgotten here too.
  const logged = (store[loggedKey] ??= new Map())
  if (line === null) logged.delete(key)
  else if (logged.get(key) !== line) {
    logged.set(key, line)
    adminLog(line)
  }
}

const failure = (error: unknown) => (error instanceof Error ? error.message : String(error))

export function adminCore(config: PlatformConfig, auth: AdminAuth | null): AdminCore {
  const app = adminApp(config)
  const id = `${auth?.kind ?? 'none'} ${app.repo}`

  async function problems(): Promise<string[]> {
    if (!auth) {
      return [
        'admin.auth is "custom" in platform.config.mjs, so the ready-made admin files are off. Use the pages and routes from createAdmin, made with the app\'s own check.',
      ]
    }
    const found: string[] = []
    if (auth.kind !== app.auth) {
      found.push(`admin.auth is "${app.auth}" in platform.config.mjs, but the admin was made with a "${auth.kind}" check.`)
    }
    try {
      found.push(...(await auth.problems(process.env)))
    } catch (error) {
      found.push(`The app's admin check could not say whether it can run: ${failure(error)}`)
    }
    return found
  }

  return {
    app,
    auth,
    signInPath: auth?.signInPath ?? '/admin/login',
    signOutPath: auth?.signOutPath ?? '/admin/api/logout',
    async settings() {
      const found = await problems()
      if (found.length > 0) {
        report(id, `the admin is off, so every admin address answers 404. ${found.join(' ')}`)
        return null
      }
      report(id, null)
      const { github, problems: updatesOff } = githubSettings(process.env, app.repo)
      report(`${id} updates`, updatesOff.length > 0 ? `updates are off, and the rest of the admin works. ${updatesOff.join(' ')}` : null)
      return { github, updatesOff: Object.freeze([...updatesOff]) }
    },
    async user(headers) {
      if (!auth) return null
      try {
        const found: AdminUser | null = await auth.user(adminRequest(headers), process.env)
        const name = typeof found?.name === 'string' ? printable(found.name) : ''
        return found && name ? { name, mayUpdate: found.mayUpdate !== false } : null
      } catch (error) {
        // Nobody counts as signed in when the check cannot say who is.
        adminLog(`the sign-in check failed, so the request counts as signed out: ${failure(error)}`)
        return null
      }
    },
  }
}

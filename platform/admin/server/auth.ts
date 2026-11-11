import 'server-only'
import { readCookie } from './request'
import { readSession, SESSION_COOKIE } from './session'
import { signInSettings, type Env } from './settings'

/**
 * How the kit finds out who sent a request. The app picks one with
 * `admin.auth` in platform.config.mjs:
 *
 * - "password": the kit's shared password, `sharedPassword` below, with its
 *   own sign-in page, sign-in and sign-out routes, and a signed cookie.
 * - "custom": the app's own check, such as the status site's staff accounts
 *   with 2FA. The app writes an AdminAuth and gives it to createAdmin. It
 *   keeps its own sign-in page and its own sign-in and sign-out routes; the
 *   kit's shell, Updates page and update routes ask its check who is there.
 */

/** What the kit knows of a request when it asks who sent it. */
export type AdminRequest = {
  /** The request's headers. */
  headers: Headers
  /** One of the request's cookies, or undefined. */
  cookie(name: string): string | undefined
}

/** Someone signed in to the admin. */
export type AdminUser = {
  /** Who it is, for the server log and the update request. The shared password's is "admin". */
  name: string
  /** False for an account that may see the Updates page but not install or copy anything. True when left out. */
  mayUpdate?: boolean
}

export interface AdminAuth {
  /** Which kind of check this is. Only "password" turns on the kit's own sign-in page and routes. */
  readonly kind: 'password' | 'custom'
  /**
   * What keeps this check from working: one sentence each, starting with
   * the setting's name and never holding its value. Empty when it can run.
   * While there is any, every admin page and route answers 404 and the
   * sentences go to the server log. Called on every request.
   */
  problems(env: Env): string[] | Promise<string[]>
  /**
   * Who sent the request, or null when nobody is signed in: no cookie, or
   * one that is wrong, tampered with or expired. Must not throw for a bad
   * cookie. Called on every admin page and route, after problems() is empty.
   */
  user(request: AdminRequest, env: Env): AdminUser | null | Promise<AdminUser | null>
  /** Where someone who is not signed in is sent. /admin/login unless set. */
  readonly signInPath?: string
  /** Where the Sign out button posts, as JSON. /admin/api/logout unless set. */
  readonly signOutPath?: string
}

/** A request as the kit's checks read it, from its headers alone. */
export function adminRequest(headers: Headers): AdminRequest {
  const cookies = headers.get('cookie')
  return { headers, cookie: (name) => readCookie(cookies, name) }
}

/** The kit's one shared password: ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET, as npm run admin:hash prints them. */
export const sharedPassword: AdminAuth = Object.freeze({
  kind: 'password' as const,
  problems: (env: Env) => signInSettings(env).problems,
  user(request: AdminRequest, env: Env): AdminUser | null {
    const { keys } = signInSettings(env)
    return keys && readSession(request.cookie(SESSION_COOKIE), keys) ? { name: 'admin' } : null
  },
  signInPath: '/admin/login',
  signOutPath: '/admin/api/logout',
})

import 'server-only'

/**
 * What an app's own server code uses from the admin: createAdmin for an app
 * whose check is its own, the AdminAuth it writes, and the request checks.
 * The app's own admin routes call admin.signedInRoute or admin.signedInPost,
 * which run the request checks in the right order; checkPost stays here for
 * code that already calls it after its own settings check. bare(status) is the
 * plain answer the kit's own routes give while the admin is off: no body, the
 * admin's no-store and noindex headers.
 */
export { createAdmin, type Admin } from '../admin'
export { adminRequest, sharedPassword, type AdminAuth, type AdminRequest, type AdminUser } from './auth'
export type { AdminApp, AdminSettings, SignedIn } from './core'
export { adminLog, bare, checkPost, clientIp, json, readCookie, sameOrigin, type PostCheck } from './request'
export type { Env, GitHubSettings } from './settings'

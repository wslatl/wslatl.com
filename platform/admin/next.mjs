import { execFileSync } from 'node:child_process'
import { parseVersion } from './version.mjs'

/**
 * The admin's part of the app's next.config.mjs. Plain JavaScript, because
 * Node reads next.config.mjs before anything is compiled:
 *
 *   import { adminHeaders, buildInfoEnv, outsideAdmin } from './platform/admin/next.mjs'
 *
 *   const nextConfig = {
 *     env: buildInfoEnv(),
 *     async headers() {
 *       return [
 *         { source: '/:path*', headers: securityHeaders },
 *         { source: outsideAdmin, headers: [{ key: 'Content-Security-Policy', value: publicPolicy }] },
 *         ...adminHeaders(),
 *       ]
 *     },
 *   }
 *
 * securityHeaders and publicPolicy are the app's own. The policy goes on
 * outsideAdmin rather than on every address: the admin gets a stricter one,
 * with a nonce, from proxy.ts, and two policies on one page would both
 * apply.
 */

/**
 * Every address but the admin's, as a source for headers(): where the app's
 * own Content Security Policy goes. /admin and everything under it get the
 * admin's policy from proxy.ts (secureRequest) instead.
 */
export const outsideAdmin = '/((?!admin(?:/|$)).*)'

/**
 * Never indexed, wherever a link to the admin turns up. Its pages carry a
 * robots meta tag as well, and its routes send the header themselves.
 * robots.txt must not name the admin: a page it disallows is never fetched,
 * so its noindex is never seen, and the line would tell everyone where the
 * admin is. New objects on every call, since Next writes into the rules it
 * is given.
 * @returns {{ source: string, headers: { key: string, value: string }[] }[]}
 */
export function adminHeaders() {
  return ['/admin', '/admin/:path*'].map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }))
}

/** @typedef {Record<string, string | undefined>} Env */

/**
 * The release this build was made from. The updater names it in
 * SITE_RELEASE when it builds one; a folder uploaded by hand has none.
 * @param {Env} env
 */
function siteRelease(env) {
  const tag = env.SITE_RELEASE ?? ''
  return parseVersion(tag) ? tag : ''
}

/**
 * The commit this build was made from. A downloaded release has no git
 * history, so the updater passes SITE_COMMIT; a build from a git checkout
 * asks git.
 * @param {Env} env
 */
function siteCommit(env) {
  const sha = env.SITE_COMMIT ?? ''
  if (/^[0-9a-f]{40}$/.test(sha)) return sha
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

/**
 * For next.config.mjs's `env`: what this build is, written into it when it
 * is built, for the Updates page. Only these two names. Anything listed in
 * `env` is copied into the build, so no setting that is secret ever goes
 * there.
 * @param {Env} [env]
 * @returns {{ SITE_RELEASE: string, SITE_COMMIT: string }}
 */
export function buildInfoEnv(env = process.env) {
  return { SITE_RELEASE: siteRelease(env), SITE_COMMIT: siteCommit(env) }
}

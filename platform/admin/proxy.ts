import { NextResponse } from 'next/server'
import { sameOrigin } from './origin'

/**
 * The kit's part of the app's proxy.ts. Call it first thing, with the app's
 * own address, `url` in its platform.config.mjs (config below is that file's
 * default export; README.md has the whole file):
 *
 *   import { handOn, secureRequest } from '@/platform/admin/proxy'
 *
 *   export function proxy(request: NextRequest) {
 *     const answered = secureRequest(request, { url: config.url })
 *     if (answered) return answered
 *     // The app's own work, handing the request on with handOn(request):
 *     return NextResponse.next(handOn(request))
 *   }
 *
 * secureRequest, in this order:
 *
 * 1. sends a visitor who came over plain HTTP to the same address on HTTPS
 *    (redirectToHttps), before anything else is answered;
 * 2. lets Next's own error overlay through, in development only;
 * 3. refuses what nothing in the app takes (refuseUnsafeRequests);
 * 4. lets an admin page or route through with the admin's own Content
 *    Security Policy and a nonce that is new for every request.
 *
 * Anything else is a public page: null, and the app goes on with its own
 * rewrites, passing handOn(request) to every NextResponse.next() and
 * NextResponse.rewrite(), which drops a policy the visitor sent.
 *
 * An app with more JSON routes that take a POST passes the whole list:
 * `secureRequest(request, { url: config.url, postRoutes: [...adminPostRoutes, '/admin/api/guides/save'] })`.
 * An app that uses Server Actions on purpose names where its pages post
 * them: `secureRequest(request, { url: config.url, serverActions: ['/admin'] })`.
 */

/**
 * The kit's JSON routes that take a POST. Exact paths: a POST anywhere else
 * under /admin/api/ would reach a page instead.
 */
export const adminPostRoutes: readonly string[] = Object.freeze([
  '/admin/api/login',
  '/admin/api/logout',
  '/admin/api/update',
  '/admin/api/adopt-updater',
])

/** The admin's own addresses. /administrator and the like are not it. */
export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export type RefuseOptions = {
  /** Every exact path that takes a POST. The kit's own four unless the app names more. */
  postRoutes?: readonly string[]
  /**
   * For an app that uses Server Actions on purpose, as the status site does:
   * the addresses whose pages post them, each with everything under it, such
   * as ['/admin'] (['/'] is every page). There, a POST that names a Server
   * Action is let through once it shows it came from a page on this same
   * site; anywhere else, and from any other site, it is still refused. Left
   * out, every request that names a Server Action is refused.
   */
  serverActions?: readonly string[]
  /** Lets Next's own error overlay endpoints through, which only `next dev` serves, and loosens the admin's policy as `next dev` needs. */
  development?: boolean
}

export type SecureOptions = RefuseOptions & {
  /** The app's own address, `url` in its platform.config.mjs: where a visitor who came over plain HTTP is sent. */
  url: string
}

// ----- HTTPS -----

/** What Cloudflare's CF-Visitor header says for a visitor who reached it over plain HTTP: {"scheme":"http"}. */
const plainHttp = /"scheme"\s*:\s*"http"/

/**
 * A 308 to the same address on HTTPS for a visitor who reached Cloudflare
 * over plain HTTP, or null. Cloudflare's own "Always Use HTTPS" does this
 * at the edge; this covers it until that is on (README.md, "For the
 * owner"). The address is the app's own host, from `url`, followed by the
 * request's path and query, never whatever Host the request named, so it
 * cannot be bent into a redirect to another site.
 */
export function redirectToHttps(request: Request, url: string): Response | null {
  if (!plainHttp.test(request.headers.get('cf-visitor') ?? '')) return null
  const { pathname, search } = new URL(request.url)
  return NextResponse.redirect(`https://${new URL(url).host}${pathname}${search}`, 308)
}

// ----- The admin's Content Security Policy -----

/**
 * The admin's policy, the main website's own. With a nonce, the inline
 * scripts that carry it run and no others do; without one (on an answer
 * that is no page, such as a 405), none at all. Its pages have no inline
 * styles, so none are allowed. React needs eval() in development for its
 * debugging tools, and Next adds inline styles there, so `development`
 * allows both; production never does.
 */
export function adminPolicy({ nonce, development = false }: { nonce?: string; development?: boolean } = {}): string {
  const scripts = ["'self'", nonce && `'nonce-${nonce}'`, development && "'unsafe-eval'"].filter(Boolean).join(' ')
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `style-src 'self'${development ? " 'unsafe-inline'" : ''}`,
    `script-src ${scripts}`,
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

/** The request headers Next takes a page's nonce from. */
const policyHeaders = ['content-security-policy', 'content-security-policy-report-only']

function withoutPolicies(original: Headers): Headers {
  const headers = new Headers(original)
  for (const name of policyHeaders) headers.delete(name)
  return headers
}

/**
 * What NextResponse.next() and NextResponse.rewrite() hand on to a public
 * page: the request without a Content-Security-Policy of the visitor's own.
 * Next takes a page's nonce from that header, and only secureRequest may set
 * one, for the admin, so no page is ever rendered with a nonce the visitor
 * chose. Undefined when there is nothing to drop, which hands the request
 * on exactly as it came.
 */
export function handOn(request: Request): { request: { headers: Headers } } | undefined {
  if (!policyHeaders.some((name) => request.headers.has(name))) return undefined
  return { request: { headers: withoutPolicies(request.headers) } }
}

/** 128 random bits, base64, so it cannot be guessed. */
function newNonce(): string {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
}

/**
 * An admin page or route, rendered for this request alone, with a nonce of
 * its own: Next reads it from the request's Content-Security-Policy header
 * and puts it on every script it writes into the page, and the browser runs
 * only the scripts that carry it.
 */
function withNonce(request: Request, development: boolean): NextResponse {
  const policy = adminPolicy({ nonce: newNonce(), development })
  const headers = withoutPolicies(request.headers)
  headers.set('content-security-policy', policy)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', policy)
  return response
}

// ----- Methods -----

const under = (pathname: string, prefix: string) =>
  prefix === '/' || pathname === prefix || pathname.startsWith(`${prefix.replace(/\/+$/, '')}/`)

/**
 * The answer to a request nothing in the app takes, or null to let it
 * through. The apps are read-only apart from their admin's JSON routes, so:
 *
 * - a request naming a Server Action (a Next-Action header) gets a 405,
 *   whatever its method, unless the app opted in for that address. Left to
 *   Next, one an app does not expect logs an error or ends in a 500. Where
 *   the app opted in, it must be a POST, and it gets a 403 unless it came
 *   from a page on this same site;
 * - any other method but GET and HEAD gets a 405, except a POST to one of
 *   postRoutes. A form-encoded POST would otherwise make Next render a
 *   static page from scratch on every request. So a form that posts a
 *   Server Action before its page's script has run, which sends no
 *   Next-Action header, is refused too.
 *
 * The 405 says in Allow what the address does take. On an admin address it
 * carries the admin's policy, since the app's own (next.config.mjs) leaves
 * the admin out. secureRequest calls this; an app may call it on its own.
 */
export function refuseUnsafeRequests(request: Request, options: RefuseOptions = {}): Response | null {
  const { postRoutes = adminPostRoutes, serverActions = [], development = process.env.NODE_ENV === 'development' } = options
  const { pathname } = new URL(request.url)
  // Some of the dev overlay's endpoints take a POST. In production nothing
  // answers there, and the path is treated like any other.
  if (development && pathname.startsWith('/__nextjs_')) return null
  const method = request.method.toUpperCase()
  const actionsHere = serverActions.some((prefix) => under(pathname, prefix))
  const takesPost = postRoutes.includes(pathname) || actionsHere
  const answer = (status: number) =>
    new Response(null, {
      status,
      headers: {
        ...(status === 405 && { Allow: takesPost ? 'GET, HEAD, POST' : 'GET, HEAD' }),
        'Cache-Control': 'no-store',
        ...(isAdminPath(pathname) && { 'Content-Security-Policy': adminPolicy({ development }) }),
      },
    })

  if (request.headers.has('next-action')) {
    if (!actionsHere || method !== 'POST') return answer(405)
    return sameOrigin(request.headers) ? null : answer(403)
  }
  const allowed = method === 'GET' || method === 'HEAD' || (method === 'POST' && postRoutes.includes(pathname))
  return allowed ? null : answer(405)
}

// ----- All of it -----

/**
 * What the kit answers before the app's own proxy work, in order (above):
 * HTTPS, the dev overlay, the methods, and the admin's policy. Null for a
 * public page, which the app hands on with handOn(request).
 */
export function secureRequest(request: Request, options: SecureOptions): Response | null {
  const { url, development = process.env.NODE_ENV === 'development' } = options
  const upgraded = redirectToHttps(request, url)
  if (upgraded) return upgraded
  const { pathname } = new URL(request.url)
  // Next's own overlay, never rewritten by the app's own work.
  if (development && pathname.startsWith('/__nextjs_')) return NextResponse.next()
  const refused = refuseUnsafeRequests(request, { ...options, development })
  if (refused) return refused
  return isAdminPath(pathname) ? withNonce(request, development) : null
}

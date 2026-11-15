import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminPath, redirectToHttps, refuseUnsafeRequests, secureRequest, type SecureOptions } from '../admin/proxy'
import { isLocale } from './config'
import { routing } from './routing'

/**
 * The languages in the app's proxy.ts, after the kit's own rules. The whole
 * file, for an app whose only proxy work is the languages:
 *
 *   import platform from './platform.config.mjs'
 *   import { createProxy } from '@/platform/i18n/proxy'
 *
 *   export const proxy = createProxy({ url: platform.url, isFile: (path) => publicFiles.includes(path) })
 *   export const config = { matcher: ['/((?!_next/).*)'] }
 *
 * In order, for every request:
 *
 * 1. secureRequest (../admin/proxy.ts) answers first, exactly as it does
 *    without languages: plain HTTP to HTTPS on the app's own address, a 405
 *    for every method and Server Action nothing takes, and every admin page
 *    and route with the admin's own Content Security Policy and nonce. The
 *    admin never reaches the languages. An address that cannot be decoded
 *    (/%E0%A4%A) gets the first two, then the app's brokenAddress page, for
 *    an app that has one.
 * 2. What is not a page goes on with no language, as it came: the admin,
 *    /api, the share card at /og, Next's own files, /.well-known/, the files
 *    Next writes at the root (robots.txt, sitemap.xml, manifest.webmanifest,
 *    favicon.ico), and whatever the app's isFile names (its public/ files,
 *    and route handlers such as /company.json).
 * 3. Every other address is a page, and next-intl gives it its language:
 *    /pricing is rewritten to /en/pricing behind the scenes, /es/pricing
 *    stays as it is, and /en/pricing, a second address for the English page,
 *    is sent to /pricing. The prefix is only ever a rewrite, and only ever
 *    to a path under one of the five languages on this same site: any
 *    other is a 404. The one kind of redirect, which drops /en or fixes the
 *    case of a prefix (/ES/ to /es/), is a 307 built on the app's own
 *    address, never the request's Host; one that would leave it, which
 *    next-intl never makes, is a 404.
 *
 * Two kinds of address never reach next-intl at all. One with a "." or ".."
 * segment once decoded, such as /%252e%252e/admin, is a 404: next-intl
 * decodes an address once before it builds its rewrite, and the rewrite
 * would climb out of the language, to /admin, past rule 1, which saw a
 * public page. One with a literal percent sign, such as /es/100%25, goes
 * on to the app under its language as it came, since next-intl 4.14 would
 * make it an address Next cannot read; no page has one, so the app answers
 * it with its own 404.
 *
 * A Content-Security-Policy the visitor sent never reaches a page or route,
 * since Next would take a page's nonce from it, and neither does an
 * X-NEXT-INTL-LOCALE: a page's language comes from its address alone.
 */

/** The share card, at exactly /og, and the files Next writes at an app's root. None of them has a language. */
const kitFiles: readonly string[] = Object.freeze(['/og', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon.ico'])

const under = (pathname: string, folder: string) => pathname === folder || pathname.startsWith(`${folder}/`)

/** /api and everything under it. /apis and /api.php are pages like any other. */
export function isApiPath(pathname: string): boolean {
  return under(pathname, '/api')
}

export type LocaleRoutingOptions = {
  /** The app's own address, `url` in its platform.config.mjs: every redirect the languages make is built on it. */
  url: string
  /**
   * The app's own files, which are served as they are and never given a
   * language: everything in public/, and each route handler at the root
   * (/company.json, say). Anything else is treated as a page, so a made-up
   * address such as /sw.js or /wp-login.php gets the app's own 404, in
   * English, rather than Next's bare one.
   */
  isFile?: (pathname: string) => boolean
  /**
   * Where an address that cannot be decoded goes, as a path on this site,
   * such as '/es/broken-address' for '/es/%E0%A4%A': a page of the app's
   * that says so in the address's language, answered with a 307 built on
   * `url`. Left out, or null for an address, it goes to Next as it came,
   * which answers it with a bare error; an admin address the app leaves
   * null is answered with a 404 instead, since it never got the admin's
   * rules.
   */
  brokenAddress?: (pathname: string) => string | null
  /** Keeps a redirect on the request's own address, as `next dev` on localhost needs. NODE_ENV=development unless set. */
  development?: boolean
}

/** True for an address that is never given a language (step 2 above). */
export function hasNoLanguage(pathname: string, { isFile }: Pick<LocaleRoutingOptions, 'isFile'> = {}): boolean {
  return (
    isAdminPath(pathname) ||
    isApiPath(pathname) ||
    under(pathname, '/_next') ||
    under(pathname, '/.well-known') ||
    kitFiles.includes(pathname) ||
    isFile?.(pathname) === true
  )
}

/** Request headers a page or route never gets from the visitor: the two Next takes a nonce from, and next-intl's own. */
const droppedHeaders = ['content-security-policy', 'content-security-policy-report-only', 'x-next-intl-locale']

function withoutDropped(original: Headers): Headers {
  const headers = new Headers(original)
  for (const name of droppedHeaders) headers.delete(name)
  return headers
}

/**
 * What NextResponse.next() hands on for an address with no language: the
 * request without the headers above, or undefined when it has none of
 * them, which hands it on exactly as it came.
 */
function handOnPlain(request: Request): { request: { headers: Headers } } | undefined {
  if (!droppedHeaders.some((name) => request.headers.has(name))) return undefined
  return { request: { headers: withoutDropped(request.headers) } }
}

/** next-intl hands an address it cannot decode (/%) to Next as it came. This decodes the same way. */
export function decodable(pathname: string): boolean {
  try {
    decodeURI(pathname)
    return true
  } catch {
    return false
  }
}

/**
 * A segment the URL parser reads as "." or "..": each dot as itself or as
 * %2e, in either case, once tabs and line breaks are out, as the parser
 * takes them out.
 */
const dotSegment = /^(?:\.|%2e){1,2}$/i

/**
 * True for an address with a "." or ".." segment once it is decoded, the
 * way next-intl decodes it before it builds its rewrite. To it,
 * /%252e%252e/admin is /%2e%2e/admin, which the URL parser reads as
 * /../admin, so the rewrite would land on /admin, past secureRequest, which
 * saw a public page and gave it none of the admin's rules. The URL parser
 * has already taken out every dot segment the address had as it came, so
 * only a decoded one is left to find. No app has a page at such an address.
 */
export function hasDotSegment(pathname: string): boolean {
  let decoded = pathname
  try {
    decoded = decodeURI(pathname)
  } catch {
    // next-intl does not decode it either, and hands it on as it came.
  }
  return [pathname, decoded].some((path) =>
    path
      .replace(/[\t\n\r]/g, '')
      .split(/[\\/]/)
      .some((segment) => dotSegment.test(segment)),
  )
}

/**
 * True when one of next-intl's rewrites stays on this site and under one of
 * the five languages, as every rewrite it means to make does: /pricing to
 * /en/pricing. Any other, such as one to /admin or /api, would take the
 * request past the kit's own rules, which saw a public page.
 */
function staysUnderLanguage(rewrite: string, request: NextRequest): boolean {
  let target: URL
  try {
    target = new URL(rewrite, request.url)
  } catch {
    return false
  }
  if (target.origin !== request.nextUrl.origin) return false
  const { basePath } = request.nextUrl
  const path = basePath && target.pathname.startsWith(`${basePath}/`) ? target.pathname.slice(basePath.length) : target.pathname
  return isLocale(path.split('/')[1])
}

/** True for an address with a literal percent sign in it (%25). */
const hasPercentSign = (pathname: string) => /%25/i.test(pathname)

/**
 * An address with a literal percent sign, handed on under its language just
 * as it came, never through next-intl. next-intl 4.14 decodes it once more
 * than it should, and would rewrite /es/100%25 to /es/100%, which Next
 * cannot read and answers with a bare 400. No page of any app has a percent
 * sign in its address, so the app answers it with its own 404, in the
 * address's language, as it answers /sw.js.
 */
function handOnWithPercent(request: NextRequest): Response {
  const { pathname } = request.nextUrl
  const prefix = pathname.split('/')[1]
  const headers = withoutDropped(request.headers)
  if (isLocale(prefix)) {
    headers.set('x-next-intl-locale', prefix)
    return NextResponse.next({ request: { headers } })
  }
  headers.set('x-next-intl-locale', routing.defaultLocale)
  const url = request.nextUrl.clone()
  url.pathname = `/${routing.defaultLocale}${pathname}`
  return NextResponse.rewrite(url, { request: { headers } })
}

/**
 * A redirect to a path on this site, on the app's own address (or the
 * request's, in development), or null for a target a browser would read as
 * another site: //evil.example, /\evil.example, or anything that does not
 * end up on the same address.
 */
function redirectOnSite(target: string, base: string, status: number): Response | null {
  if (!target.startsWith('/') || /^\/[\\/]/.test(target)) return null
  let url: URL
  try {
    url = new URL(target, base)
  } catch {
    return null
  }
  if (url.origin !== new URL(base).origin || /^\/[\\/]/.test(url.pathname)) return null
  return NextResponse.redirect(url, status)
}

const refused = () => new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })

/**
 * The locale step alone (2 and 3 above, and the broken address), for a
 * proxy.ts that has work of its own between the kit's rules and the
 * languages. Call secureRequest first, and this for whatever it leaves:
 *
 *   const routeLocale = createLocaleRouting({ url: platform.url, isFile })
 *   export function proxy(request: NextRequest) {
 *     return secureRequest(request, { url: platform.url }) ?? routeLocale(request)
 *   }
 *
 * createProxy does that, and sends an admin address that cannot be decoded
 * to the broken address too, which secureRequest alone would not.
 */
export function createLocaleRouting(options: LocaleRoutingOptions): (request: NextRequest) => Response {
  const { url, isFile, brokenAddress, development = process.env.NODE_ENV === 'development' } = options
  const middleware = createMiddleware(routing)
  return function routeLocale(request) {
    const { pathname } = request.nextUrl
    // In development the redirect stays on localhost; anywhere else, on the app's own address.
    const base = development ? request.nextUrl.origin : new URL(url).origin
    if (!decodable(pathname)) {
      const target = brokenAddress?.(pathname) ?? null
      if (target !== null) return redirectOnSite(target, base, 307) ?? refused()
      // createProxy sends such an address here before secureRequest, which
      // gives the admin its rules: an admin one the app has no page for is
      // answered here, never handed on without them.
      return isAdminPath(pathname) ? refused() : NextResponse.next(handOnPlain(request))
    }
    if (hasDotSegment(pathname)) return refused()
    if (hasNoLanguage(pathname, { isFile })) return NextResponse.next(handOnPlain(request))
    if (hasPercentSign(pathname)) return handOnWithPercent(request)
    // next-intl hands every page the request's own headers, with the
    // language it found in the address: given a copy without the dropped
    // ones, none of them reaches the page.
    const clean = new NextRequest(request.url, {
      method: request.method,
      headers: withoutDropped(request.headers),
      nextConfig: { basePath: request.nextUrl.basePath },
    })
    const response = middleware(clean)
    // Not taken on trust: a rewrite out of the five languages, or off this
    // site, would reach what the kit's own rules never saw.
    const rewrite = response.headers.get('x-middleware-rewrite')
    if (rewrite !== null) return staysUnderLanguage(rewrite, request) ? response : refused()
    const location = response.headers.get('location')
    if (location === null) return response
    // Rebuilt as path and query on the app's own address, whatever Host the
    // request named. next-intl builds its own from the request's address,
    // which is the same site; one that is not, or that a browser would read
    // as another site, is refused.
    let target: URL
    try {
      target = new URL(location, request.url)
    } catch {
      return refused()
    }
    if (target.origin !== request.nextUrl.origin) return refused()
    return redirectOnSite(`${target.pathname}${target.search}`, base, response.status) ?? refused()
  }
}

export type ProxyOptions = SecureOptions & Omit<LocaleRoutingOptions, 'url' | 'development'>

/**
 * The app's whole proxy: the kit's own rules, then the languages. Takes
 * what secureRequest takes (url, and postRoutes or serverActions for an
 * app that needs them), isFile and brokenAddress.
 */
export function createProxy({ isFile, brokenAddress, ...secure }: ProxyOptions): (request: NextRequest) => Response {
  const development = secure.development ?? process.env.NODE_ENV === 'development'
  const routeLocale = createLocaleRouting({ url: secure.url, isFile, brokenAddress, development })
  return function proxy(request) {
    // An address that cannot be decoded is no page and no admin page: the
    // kit's HTTPS and method rules, then the app's broken-address page.
    if (brokenAddress && !decodable(request.nextUrl.pathname)) {
      return redirectToHttps(request, secure.url) ?? refuseUnsafeRequests(request, { ...secure, development }) ?? routeLocale(request)
    }
    return secureRequest(request, { ...secure, development }) ?? routeLocale(request)
  }
}

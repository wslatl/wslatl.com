import { NextResponse, type NextRequest } from 'next/server'
import { adminPolicy } from '@/config/security-headers.mjs'
import { siteConfig } from '@/config/site'
import { adminPostRoutes, isAdminPath, methodAllowed, rewriteTarget } from '@/i18n/routing'

/**
 * Gives every request a language prefix behind the scenes, so the visitor's
 * URL does not change and a page never has two addresses. The rule itself
 * lives in i18n/routing.ts, where it is covered by tests; everything that
 * reaches a route from here has a language app/[locale] recognises. The
 * admin (app/admin) is the exception: English only, and never rewritten.
 *
 * The site is read-only apart from four of the admin's JSON routes under
 * /admin/api/, which take a POST and check where it came from. It has no
 * Server Actions. So every other method, and any request naming a Server
 * Action, gets a plain 405 here. Left to Next, a POST naming a Server Action
 * (a Next-Action header) logs an error or ends in a 500, and a form-encoded
 * POST without one skips the static page and renders it from scratch on
 * every request. tests/proxy.test.ts fails if a Server Action is added, or
 * if an admin route stops checking its POSTs.
 *
 * The admin also gets its Content Security Policy here, with a nonce that is
 * new for every request (config/security-headers.mjs says why).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const admin = isAdminPath(pathname)

  // A visitor who reached Cloudflare over plain HTTP (Cloudflare says so in
  // CF-Visitor) goes to the same address on HTTPS before anything else is
  // answered, so no page, and above all not the admin's sign-in, is ever
  // served unencrypted. Cloudflare's "Always Use HTTPS" does this at the edge
  // (SECURITY.md); this covers it until that is on. The address is the
  // site's own, never whatever Host the request named.
  if (/"scheme"\s*:\s*"http"/.test(request.headers.get('cf-visitor') ?? '')) {
    return NextResponse.redirect(`${siteConfig.siteUrl}${pathname}${request.nextUrl.search}`, 308)
  }

  // The error overlay's endpoints, which only `next dev` serves. Some of them
  // take a POST, so they are let through before the method check. In
  // production nothing answers there, and the path is given a language like
  // any other and gets our 404.
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/__nextjs_')) return NextResponse.next()

  if (request.headers.has('next-action') || !methodAllowed(request.method, pathname)) {
    const allow = adminPostRoutes.includes(pathname) ? 'GET, HEAD, POST' : 'GET, HEAD'
    const refused = new NextResponse(null, { status: 405, headers: { Allow: allow } })
    // next.config.mjs leaves the admin's policy to this file.
    if (admin) refused.headers.set('Content-Security-Policy', adminPolicy())
    return refused
  }

  if (admin) return withNonce(request)

  const target = rewriteTarget(pathname)
  // Next takes a page's nonce from the request's own Content-Security-Policy
  // header. Only this file may set one, for the admin above, so a visitor's
  // own is dropped: no page is ever rendered with a nonce the visitor chose.
  const headers = request.headers.has('content-security-policy') ? withoutPolicy(request.headers) : null
  const forwarded = headers ? { request: { headers } } : undefined
  if (!target) return NextResponse.next(forwarded)

  const url = request.nextUrl.clone()
  url.pathname = target
  return NextResponse.rewrite(url, forwarded)
}

function withoutPolicy(original: Headers): Headers {
  const headers = new Headers(original)
  headers.delete('content-security-policy')
  return headers
}

/**
 * An admin page, rendered for this request alone, with a nonce of its own:
 * Next reads it from the request's Content-Security-Policy header and puts it
 * on every script it writes into the page, and the browser runs only the
 * scripts that carry it. 128 random bits, so it cannot be guessed.
 */
function withNonce(request: NextRequest) {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
  const policy = adminPolicy({ nonce, dev: process.env.NODE_ENV === 'development' })
  const headers = new Headers(request.headers)
  headers.set('content-security-policy', policy)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', policy)
  return response
}

export const config = {
  // Only Next's own assets skip the proxy. The matcher has to be a constant,
  // so the dev-only endpoints are let through in proxy() instead; a pattern
  // here broad enough to cover them also let /__nextjsanything/pricing reach
  // app/[locale] with no language. The files served from the app root are
  // handled in rewriteTarget, where a test can see the list.
  matcher: ['/((?!_next/).*)'],
}

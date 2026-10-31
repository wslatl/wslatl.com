import { NextResponse, type NextRequest } from 'next/server'
import { adminPostRoutes, methodAllowed, rewriteTarget } from '@/i18n/routing'

/**
 * Gives every request a language prefix behind the scenes, so the visitor's
 * URL does not change and a page never has two addresses. The rule itself
 * lives in i18n/routing.ts, where it is covered by tests; everything that
 * reaches a route from here has a language app/[locale] recognises. The
 * admin (app/admin) is the exception: English only, and never rewritten.
 *
 * The site is read-only apart from three of the admin's JSON routes under
 * /admin/api/, which take a POST and check where it came from. It has no
 * Server Actions. So every other method, and any request naming a Server
 * Action, gets a plain 405 here. Left to Next, a POST naming a Server Action
 * (a Next-Action header) logs an error or ends in a 500, and a form-encoded
 * POST without one skips the static page and renders it from scratch on
 * every request. tests/proxy.test.ts fails if a Server Action is added, or
 * if an admin route stops checking its POSTs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The error overlay's endpoints, which only `next dev` serves. Some of them
  // take a POST, so they are let through before the method check. In
  // production nothing answers there, and the path is given a language like
  // any other and gets our 404.
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/__nextjs_')) return NextResponse.next()

  if (request.headers.has('next-action') || !methodAllowed(request.method, pathname)) {
    const allow = adminPostRoutes.includes(pathname) ? 'GET, HEAD, POST' : 'GET, HEAD'
    return new NextResponse(null, { status: 405, headers: { Allow: allow } })
  }

  const target = rewriteTarget(pathname)
  if (!target) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = target
  return NextResponse.rewrite(url)
}

export const config = {
  // Only Next's own assets skip the proxy. The matcher has to be a constant,
  // so the dev-only endpoints are let through in proxy() instead; a pattern
  // here broad enough to cover them also let /__nextjsanything/pricing reach
  // app/[locale] with no language. The files served from the app root are
  // handled in rewriteTarget, where a test can see the list.
  matcher: ['/((?!_next/).*)'],
}

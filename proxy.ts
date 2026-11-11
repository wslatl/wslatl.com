import { NextResponse, type NextRequest } from 'next/server'
import platform from './platform.config.mjs'
import { handOn, secureRequest } from '@/platform/admin/proxy'
import { rewriteTarget } from '@/i18n/routing'

/**
 * Every request comes through here, the admin's included.
 *
 * The kit answers first (secureRequest, platform/admin/proxy.ts): a visitor
 * who reached Cloudflare over plain HTTP goes to the same address on HTTPS,
 * on the site's own host; any method but GET and HEAD gets a 405, apart from
 * a POST to the admin's four JSON routes, and so does any request naming a
 * Server Action, which the site has none of; and every admin page and route
 * gets the admin's Content Security Policy, with a nonce that is new for
 * every request. tests/proxy.test.ts fails if a Server Action is added.
 *
 * What is left is a public page. It is given a language prefix behind the
 * scenes, so the visitor's URL does not change and a page never has two
 * addresses. The rule lives in i18n/routing.ts, where it is covered by
 * tests; everything that reaches a route from here has a language
 * app/[locale] recognises. handOn drops a Content-Security-Policy the
 * visitor sent, which Next would otherwise take a page's nonce from.
 */
export function proxy(request: NextRequest) {
  const answered = secureRequest(request, { url: platform.url })
  if (answered) return answered

  const target = rewriteTarget(request.nextUrl.pathname)
  if (!target) return NextResponse.next(handOn(request))

  const url = request.nextUrl.clone()
  url.pathname = target
  return NextResponse.rewrite(url, handOn(request))
}

export const config = {
  // Only Next's own assets skip the proxy. The matcher has to be a constant,
  // so the dev-only endpoints are let through by secureRequest instead; a
  // pattern here broad enough to cover them also let /__nextjsanything/pricing
  // reach app/[locale] with no language. The files served from the app root
  // are handled in rewriteTarget, where a test can see the list.
  matcher: ['/((?!_next/).*)'],
}

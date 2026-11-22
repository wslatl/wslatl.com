import { NextResponse, type NextRequest } from 'next/server'
import platform from './platform.config.mjs'
import { createProxy } from '@/platform/i18n/proxy'
import { brokenAddress, isRootFile, unlistedPage } from '@/i18n/routing'

/**
 * Every request comes through here, the admin's included, and the kit
 * answers it first (platform/i18n/proxy.ts), in this order:
 *
 * 1. Its own rules first (secureRequest, platform/admin/proxy.ts): a
 *    visitor who reached Cloudflare over plain HTTP goes to the same address
 *    on HTTPS, on the site's own host; any method but GET and HEAD gets a
 *    405, apart from a POST to the admin's JSON routes, and so does any
 *    request naming a Server Action, which the site has none of; and every
 *    admin page and route gets the admin's Content Security Policy, with a
 *    nonce that is new for every request. tests/proxy.test.ts fails if a
 *    Server Action is added.
 * 2. What is not a page goes on with no language: the admin, /api, the share
 *    card, Next's own files, /.well-known/ and the site's own files at the
 *    root (i18n/routing.ts, where a test can see the list).
 * 3. Every other address is a page, and gets its language behind the
 *    scenes: /pricing is the English page under app/[locale], /es/pricing
 *    the Spanish one, so the visitor's URL does not change and a page never
 *    has two addresses. A rewrite only ever lands under one of the five
 *    languages, and an address that would climb out of its language once
 *    decoded is a 404.
 *
 * A Content-Security-Policy the visitor sent, which Next would take a page's
 * nonce from, and a language named in a header, never reach a page. An
 * address that cannot be decoded (/%ff) gets the HTTPS and method rules,
 * then a 307 to our 404 page in its language (brokenAddress), where the
 * framework would answer a bare 500 with none of the headers.
 *
 * What the kit hands on, the site then looks at itself, so that no address
 * anyone can make up reaches a page Next keeps a note of:
 *
 * 4. Outside development, any address under /_next/ is a plain 404: only
 *    Next's own files are there, and they skip the proxy (the matcher
 *    below). Next read /_next/games/<anything> as a game's page with
 *    "_next" for its language.
 * 5. A game, document or partner the build did not make (/games/anything,
 *    in every language, as a page, an RSC request or /partners/x.png) goes
 *    to the catch-all 404 page instead, the same address one segment deeper
 *    (unlistedPage in i18n/routing.ts), with every request header the kit
 *    chose. Next keeps a note in memory of every page of a list it draws,
 *    the whole address in it, and nothing ever clears it.
 */
const routeRequest = createProxy({ url: platform.url, isFile: isRootFile, brokenAddress })

const development = process.env.NODE_ENV === 'development'

export function proxy(request: NextRequest): Response {
  const response = routeRequest(request)
  const rewrite = response.headers.get('x-middleware-rewrite')
  // The kit's own answers stand: a redirect, a 405, a 404.
  if (rewrite === null && response.headers.get('x-middleware-next') === null) return response
  const { pathname } = request.nextUrl
  if (!development && (pathname === '/_next' || pathname.startsWith('/_next/'))) {
    return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }
  const lands = new URL(rewrite ?? request.url)
  const instead = unlistedPage(rewrite === null ? pathname : lands.pathname)
  if (instead === null) return response
  lands.pathname = instead
  const headers = new Headers(response.headers)
  headers.delete('x-middleware-next')
  return NextResponse.rewrite(lands, { headers })
}

export const config = {
  // Only Next's own files skip the proxy; every other address under /_next/
  // reaches it, and gets a 404 (4 above). The matcher has to be a constant,
  // so the dev-only endpoints are let through by the kit instead; a pattern
  // here broad enough to cover them also let /__nextjsanything/pricing reach
  // app/[locale] with no language.
  matcher: ['/((?!_next/static/).*)'],
}

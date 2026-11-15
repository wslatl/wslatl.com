import platform from './platform.config.mjs'
import { createProxy } from '@/platform/i18n/proxy'
import { isRootFile } from '@/i18n/routing'

/**
 * Every request comes through here, the admin's included, and the kit
 * answers it (platform/i18n/proxy.ts), in this order:
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
 * nonce from, and a language named in a header, never reach a page.
 */
export const proxy = createProxy({ url: platform.url, isFile: isRootFile })

export const config = {
  // Only Next's own assets skip the proxy. The matcher has to be a constant,
  // so the dev-only endpoints are let through by the kit instead; a pattern
  // here broad enough to cover them also let /__nextjsanything/pricing reach
  // app/[locale] with no language.
  matcher: ['/((?!_next/).*)'],
}

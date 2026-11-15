import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from './config'

/**
 * next-intl's routing, the same in every app. Each choice is fixed here so
 * that no app can drift from the others:
 *
 * - localePrefix 'as-needed': English keeps its plain addresses (/pricing)
 *   and the other four sit under their prefix (/es/pricing). The prefix is
 *   a rewrite behind the scenes, so the visitor's address never changes.
 * - localeDetection false: nothing is picked from the browser's language or
 *   a cookie. The visitor chooses, with the picker, and every address shows
 *   the same page to everyone, so every page can be built once and cached.
 * - localeCookie false: no NEXT_LOCALE cookie. With no detection nothing
 *   would read it, and a Set-Cookie on a page keeps caches from keeping it.
 * - alternateLinks false: no Link header with the translations. The page's
 *   own hreflang tags and the sitemap list them already, from the app's own
 *   https address (seo.ts). next-intl would build the header from the
 *   request's Host, X-Forwarded-Host and X-Forwarded-Proto, which a request
 *   can set itself, so a cached page could end up naming another site, or
 *   http, as its translations, and it would send one for a 404 too.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
})

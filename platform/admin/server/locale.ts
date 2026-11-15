import 'server-only'
import { ADMIN_LOCALE_COOKIE, adminLocaleFor, chooseAdminLocale } from '../../i18n/admin-locale'
import type { Locale } from '../../i18n/config'
import { readCookie } from './cookies'

/**
 * The admin's language: the signed-in account's own, then the admin's
 * language cookie, then English. The order and the cookie's name are in
 * ../../i18n/admin-locale.ts, where an app's request config reads them too;
 * what the admin alone does with them is here.
 */
export { chooseAdminLocale }

export const LOCALE_COOKIE = ADMIN_LOCALE_COOKIE
export const LOCALE_SECONDS = 365 * 24 * 60 * 60

/**
 * The admin's language cookie. It holds a language code and nothing else,
 * so it can open nothing and say nothing about who is signed in:
 *
 * - Path=/admin: only the admin is sent it, as the device cookie; the
 *   public site never sees it, and its pages stay the same for everyone.
 * - HttpOnly: only the server reads it, to render the page.
 * - Secure: never over plain HTTP.
 * - SameSite=Lax, not Strict: it carries no authority, and with Strict a
 *   link to the admin from an email or a chat would open its first page,
 *   the sign-in card included, in English.
 * - A year, set again each time the language changes.
 *
 * Any value but one of the five codes is ignored, so a cookie set some
 * other way can at most pick one of the five.
 */
export function localeCookie(locale: Locale) {
  return {
    name: LOCALE_COOKIE,
    value: locale,
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/admin',
    maxAge: LOCALE_SECONDS,
  }
}

/** What a request's language cookie says, as it came. */
export function cookieLocale(headers: Headers): string | undefined {
  return readCookie(headers.get('cookie'), LOCALE_COOKIE)
}

/** The language of a request from someone not known yet, or known to keep no language: the cookie, then English. */
export function requestLocale(headers: Headers, stored?: unknown): Locale {
  return adminLocaleFor(headers, stored)
}

import { cookies } from 'next/headers'
import { readCookie } from '../lib/cookies'
import { defaultLocale, isLocale, type Locale } from './config'

/**
 * The admin's language. Its addresses never change (/admin, never
 * /es/admin), so the language comes from, in this order:
 *
 * 1. the signed-in account's own language, for an app whose check returns
 *    one (AdminUser.locale, as the status site keeps one per staff account;
 *    the shared password has none);
 * 2. the admin's language cookie, which the language menu in the admin's
 *    header and the one on the sign-in card set (the admin's
 *    /admin/api/language route);
 * 3. English.
 *
 * A value that is not one of the five codes, exactly as written ('es',
 * never 'ES' or 'es-ES'), counts as none, and the next one decides.
 *
 * It is here, beside the languages, and not in platform/admin/, so an app's
 * i18n/request.ts can read it for the admin's pages without importing the
 * admin, which nothing public may (../admin/README.md).
 *
 * The cookie's name starts with __Secure-, so a browser keeps it only when
 * it is Secure and came over HTTPS: a page served over plain HTTP, on this
 * host or one beside it, cannot plant a language of its own choosing.
 */
export const ADMIN_LOCALE_COOKIE = '__Secure-admin_locale'

/** The admin's language from an account's own language and the cookie's, in that order, then English. */
export function chooseAdminLocale(stored: unknown, cookie: unknown): Locale {
  if (isLocale(stored)) return stored
  if (isLocale(cookie)) return cookie
  return defaultLocale
}

/** The admin's language for a request, from its headers: `stored` is the signed-in account's own, when there is one. */
export function adminLocaleFor(headers: Headers, stored?: unknown): Locale {
  return chooseAdminLocale(stored, readCookie(headers.get('cookie'), ADMIN_LOCALE_COOKIE))
}

/**
 * The admin's language for the page or route being rendered, read through
 * next/headers: the cookie, then English, or the account's own first when
 * it is given. An app's i18n/request.ts gives it to createRequestConfig
 * for the admin's pages, which have no [locale]: on the shared password
 * that is all of it. An app whose accounts keep a language passes its own
 * admin's locale() instead, which asks who is signed in.
 */
export async function adminLocale(stored?: unknown): Promise<Locale> {
  return chooseAdminLocale(stored, (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value)
}

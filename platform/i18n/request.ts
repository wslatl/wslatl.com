import { getRequestConfig, type GetRequestConfigParams, type RequestConfig } from 'next-intl/server'
import { adminLocale as adminCookieLocale } from './admin-locale'
import { defaultLocale, isLocale, type Locale } from './config'
import { platformMessages } from './messages'

/** One language's messages, as the app keeps them in messages/<locale>.json. */
export type AppMessages = Record<string, unknown>

export type RequestConfigOptions = {
  /**
   * The app's own messages in one language: its messages/<locale>.json.
   * A module, as a dynamic import gives it, or the object itself. A map of
   * static imports keeps the bundler from guessing at a template path:
   *
   *   messages: (locale) => ({ en: () => import('../messages/en.json'), ... })[locale]()
   */
  messages: (locale: Locale) => AppMessages | { default: AppMessages } | Promise<AppMessages | { default: AppMessages }>
  /**
   * The page's [locale] root param, from next/root-params, passed as it is:
   * `import { locale } from 'next/root-params'`. With it, the request's
   * headers are never read, so every page stays prerendered and no page
   * needs setRequestLocale. It is undefined on the admin's pages, which
   * have no [locale], and cannot be read in a route handler, which passes
   * its language itself: getTranslations({ locale, namespace }).
   */
  rootLocale?: () => Promise<string | undefined>
  /**
   * The language of a page with no [locale], which is the admin's pages:
   * the admin's language (./admin-locale.ts), the cookie then English
   * unless the app gives its own, as an app whose accounts keep a language
   * does: `adminLocale: () => admin.locale()`.
   */
  adminLocale?: () => Promise<Locale>
  /** The time zone dates are written in, the same on the server and in the browser. UTC unless set, so a date with no time is never moved to the day before. */
  timeZone?: string
} & Pick<RequestConfig, 'formats' | 'onError' | 'getMessageFallback'>

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

/** The messages with English under them: a key a language is missing shows the English words until it is translated. */
function overEnglish(english: Record<string, unknown>, language: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...english }
  for (const [key, value] of Object.entries(language)) {
    merged[key] = isObject(value) && isObject(english[key]) ? overEnglish(english[key], value) : value
  }
  return merged
}

async function load(options: RequestConfigOptions, locale: Locale): Promise<Record<string, unknown>> {
  const loaded = await options.messages(locale)
  const messages = isObject(loaded) && isObject(loaded.default) ? loaded.default : loaded
  if (!isObject(messages)) throw new Error(`messages/${locale}.json must hold an object of messages.`)
  if ('platform' in messages) throw new Error(`messages/${locale}.json has a top-level "platform" key. It is the kit's own: give those messages another name.`)
  return messages
}

/**
 * The language to render, from the first of these that is one of the five:
 *
 * 1. the language a call asked for: getTranslations({ locale });
 * 2. the page's [locale] root param;
 * 3. on a page with no [locale], the admin's: adminLocale;
 * 4. for an app that gives no rootLocale, the language next-intl's proxy
 *    step put on the request;
 * 5. English.
 */
async function chooseLocale(params: GetRequestConfigParams, options: RequestConfigOptions): Promise<Locale> {
  if (isLocale(params.locale)) return params.locale
  const { rootLocale, adminLocale = () => adminCookieLocale() } = options
  if (rootLocale) {
    let fromRoot: string | undefined
    try {
      fromRoot = await rootLocale()
    } catch {
      // A route handler, which must pass its language itself, or outside a
      // page: the request's headers are still not read.
      return defaultLocale
    }
    if (fromRoot === undefined) return adminLocale()
    // A [locale] that is not one of the five: the app's layout answers 404.
    return isLocale(fromRoot) ? fromRoot : defaultLocale
  }
  const requested = await params.requestLocale
  return isLocale(requested) ? requested : defaultLocale
}

/**
 * What getRequestConfig is given: the language of the request, the app's
 * messages in it over the English ones, and the kit's own words for public
 * pages under `platform`, the one top-level name an app's messages may not
 * use. The admin's words stay out: the admin has its own, and nothing
 * public carries them. createRequestConfig wraps this; it is apart so a
 * test can call it outside Next.
 */
export function requestConfig(options: RequestConfigOptions): (params: GetRequestConfigParams) => Promise<RequestConfig> {
  const { timeZone = 'UTC', formats, onError, getMessageFallback } = options
  return async (params) => {
    const locale = await chooseLocale(params, options)
    const own = await load(options, locale)
    const messages = locale === defaultLocale ? own : overEnglish(await load(options, defaultLocale), own)
    return {
      locale,
      timeZone,
      ...(formats !== undefined && { formats }),
      ...(onError !== undefined && { onError }),
      ...(getMessageFallback !== undefined && { getMessageFallback }),
      messages: { ...messages, platform: platformMessages(locale) } as unknown as RequestConfig['messages'],
    }
  }
}

/**
 * The app's i18n/request.ts, whole:
 *
 *   import { locale } from 'next/root-params'
 *   import { createRequestConfig } from '@/platform/i18n/request'
 *
 *   export default createRequestConfig({
 *     rootLocale: locale,
 *     messages: (locale) => import(`../messages/${locale}.json`),
 *   })
 */
export function createRequestConfig(options: RequestConfigOptions) {
  return getRequestConfig(requestConfig(options))
}

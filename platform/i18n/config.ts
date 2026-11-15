/**
 * The five languages every WSLATL app is published in, and the plain
 * helpers around them. Nothing here imports next-intl or React, so the
 * proxy, the sitemap, the share card route and the admin can all use it.
 *
 * English keeps the plain addresses it has always had (/pricing), and every
 * other language sits under its own prefix (/es/pricing). So no address
 * that exists today moves, and each page can point search engines at its
 * translations with hreflang.
 */
export const locales = ['en', 'es', 'fr', 'de', 'pt'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Each language named in itself, which is what a language picker shows. */
export const localeNames: Readonly<Record<Locale, string>> = Object.freeze({
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
})

/** Open Graph wants a language and a region. */
export const openGraphLocales: Readonly<Record<Locale, string>> = Object.freeze({
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
})

/** The BCP 47 tag Intl formatters take for a language, from the region it is written for: 'en-US', 'pt-BR'. */
export function languageTag(locale: Locale): string {
  return openGraphLocales[locale].replace('_', '-')
}

/** True for one of the five codes, exactly as written here: 'es', never 'ES' or 'es-ES'. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/**
 * The path a page has in a given language: localePath('es', '/pricing') is
 * '/es/pricing', and English paths are returned unchanged. Any #anchor is
 * kept at the end.
 */
export function localePath(locale: Locale, path: string): string {
  const [pathname, hash] = path.split('#')
  const prefixed = locale === defaultLocale ? pathname : `/${locale}${pathname === '/' ? '' : pathname}`
  return hash ? `${prefixed || '/'}#${hash}` : prefixed
}

/** The same page in English: the path with any language prefix removed. */
export function stripLocale(path: string): string {
  const match = path.match(/^\/([a-z]{2})(?=\/|$)/)
  return match && isLocale(match[1]) ? path.slice(3) || '/' : path
}

/**
 * Text an app gives the kit in its settings (an admin page's name, say):
 * one string for every language, or one for each of the five.
 */
export type LocalizedText = string | Readonly<Record<Locale, string>>

/** That text in one language. */
export function textIn(text: LocalizedText, locale: Locale): string {
  return typeof text === 'string' ? text : text[locale]
}

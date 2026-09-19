/**
 * The languages the site is published in.
 *
 * English keeps the plain URLs it has always had (/pricing, /legal/terms),
 * and every other language sits under its own prefix (/es/pricing). That way
 * no existing link, bookmark, or search result moves, and each page can point
 * search engines at its translations with hreflang.
 */
export const locales = ['en', 'es', 'fr', 'de', 'pt'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Locales served under a prefix, which is every one except English. */
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale)

/** Each language named in itself, which is what a language picker should show. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
}

/** Open Graph wants a language and a region. */
export const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
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

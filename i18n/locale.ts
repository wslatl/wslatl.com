import { cache } from 'react'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

/**
 * The language of the page being rendered.
 *
 * React's cache() hands out one holder per request, so a page sets the locale
 * once and every Server Component under it can read it without the locale
 * being threaded through as a prop. Client Components cannot read it: give
 * them the strings they need as props (see components/layout/site-header.tsx).
 */
const holder = cache(() => ({ locale: defaultLocale }))

/**
 * Called by each route before it renders anything. The layout answers 404 for
 * an unknown language before any page runs, so the fallback to English is
 * only for the 404 page, which reads the language from the address on its
 * own and must still render whatever that address holds.
 */
export function setLocale(locale: string) {
  holder().locale = isLocale(locale) ? locale : defaultLocale
}

export function getLocale(): Locale {
  return holder().locale
}

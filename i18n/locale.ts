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
 * Called by each route before it renders anything. An unknown language (a
 * URL like /xx/pricing, which 404s) falls back to English so the page around
 * the 404 still renders.
 */
export function setLocale(locale: string) {
  holder().locale = isLocale(locale) ? locale : defaultLocale
}

export function getLocale(): Locale {
  return holder().locale
}

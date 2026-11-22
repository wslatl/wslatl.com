import { notFound } from 'next/navigation'
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
 * Called by each route, and by each page's metadata, before it renders
 * anything: the page's [locale], or a 404 for one that is not ours. The
 * layout answers 404 for such a language too, but a page's metadata runs
 * beside the layout rather than after it, so it must not read its words
 * first: the framework hands /es.rsc, /og.rsc and /_next, which the proxy
 * gives no language, to the home page with "es.rsc", "og" or "_next" for
 * its language, and the missing words were a 500 with a stack trace in the
 * log on every request.
 *
 * The 404 page reads the language from the address on its own and must
 * still render whatever that address holds, so it checks its own and calls
 * this with one of ours.
 */
export function setLocale(locale: string): void {
  if (!isLocale(locale)) notFound()
  holder().locale = locale
}

export function getLocale(): Locale {
  return holder().locale
}

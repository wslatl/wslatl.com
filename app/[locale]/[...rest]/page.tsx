import { notFound } from 'next/navigation'
import type { Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'

/**
 * Any address under a language that is not one of our pages. The proxy gives
 * every request a language prefix, so an unknown URL lands here and gets our
 * own 404 page, in that language, instead of the framework's bare one.
 */
export const dynamicParams = true

export default async function UnknownPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setLocale((await params).locale)
  notFound()
}

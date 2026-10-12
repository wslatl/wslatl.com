import { getLocale } from '@/i18n/locale'
import { openGraphLocales, type Locale } from '@/i18n/config'

/** BCP 47 tags, from the region each language is written for. */
const formats: Record<Locale, string> = Object.fromEntries(
  Object.entries(openGraphLocales).map(([locale, tag]) => [locale, tag.replace('_', '-')]),
) as Record<Locale, string>

/** The BCP 47 tag Intl formatters take for a language: 'en-US', 'pt-BR'. */
export function languageTag(locale: Locale): string {
  return formats[locale]
}

/**
 * An effective date, written the way the reader's language writes it:
 * "September 19, 2026" in English, "19 de septiembre de 2026" in Spanish.
 * Takes the YYYY-MM-DD stored in config/site.ts.
 */
export function formatLegalDate(date: string, locale: Locale = getLocale()): string {
  const [year, month, day] = date.split('-').map(Number)
  // Built in UTC, so a timezone behind UTC cannot shift it to the day before.
  return new Intl.DateTimeFormat(formats[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, day)),
  )
}

/**
 * A month, written the way the reader's language writes it: "Oct 2026" in
 * English, "oct. 2026" in French. Takes YYYY-MM.
 */
export function formatMonth(month: string, locale: Locale = getLocale()): string {
  const [year, number] = month.split('-').map(Number)
  return new Intl.DateTimeFormat(formats[locale], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, number - 1, 1)),
  )
}

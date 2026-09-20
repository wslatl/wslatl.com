import { getLocale, type Locale } from '@/i18n/locale'
import { openGraphLocales } from '@/i18n/config'

/** BCP 47 tags, from the region each language is written for. */
const formats: Record<Locale, string> = Object.fromEntries(
  Object.entries(openGraphLocales).map(([locale, tag]) => [locale, tag.replace('_', '-')]),
) as Record<Locale, string>

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

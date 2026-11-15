import { createTranslator, type Formats } from 'next-intl'
import type { Locale } from '../i18n/config'
import en from '../i18n/messages/en.json'

/**
 * How the admin says things, on the server and in the browser alike: the
 * admin part of the kit's messages (../i18n/messages/<locale>.json), read
 * with next-intl's own translator. It is the admin's alone and never the
 * app's: the app's messages, and next-intl's provider around its public
 * pages, are not needed for it, and no public page carries its words.
 *
 * server/text.ts gives server code one for a language; components/admin-text.tsx
 * hands one to the admin's client components.
 */
export type AdminMessages = (typeof en)['admin']

/** Every time the admin shows is US Central time, the same on the server and in the browser. */
export const adminTimeZone = 'America/Chicago'

/** `{at, date, admin}` in a message: the date and time the Updates page shows, as "Nov 2, 2026, 9:00 AM" in English. */
export const adminFormats: Formats = { dateTime: { admin: { dateStyle: 'medium', timeStyle: 'short' } } }

/** A translator for the admin's words in one language. */
export function translatorFor(locale: Locale, messages: AdminMessages) {
  return createTranslator({ locale, messages, timeZone: adminTimeZone, formats: adminFormats })
}

export type AdminText = ReturnType<typeof translatorFor>

/** The admin's words in English: what a component says when nothing hands it the admin's language, as in a test. */
export const englishText: AdminText = translatorFor('en', en.admin)

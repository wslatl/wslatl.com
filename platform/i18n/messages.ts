import 'server-only'
import type { Locale } from './config'
import de from './messages/de.json'
import en from './messages/en.json'
import es from './messages/es.json'
import fr from './messages/fr.json'
import pt from './messages/pt.json'

/**
 * The kit's own words, in all five languages: messages/<locale>.json, with
 * English as the source. Server code only, because each file holds the
 * admin's words as well, and nothing public may carry those
 * (../admin/README.md): a public page gets the rest through the app's own
 * messages, under `platform` (request.ts).
 *
 * `satisfies` makes the typecheck fail when a language is missing a key
 * English has. tools/i18n-check.mjs finds the rest: extra keys, ICU
 * arguments that differ from English, empty text and the dashes and dots
 * the brand never uses.
 */
export type KitMessages = typeof en

export const kitMessages: Readonly<Record<Locale, KitMessages>> = Object.freeze({ en, es, fr, de, pt } satisfies Record<Locale, KitMessages>)

/** What a public page may use of the kit's words: everything but the admin's. */
export type PlatformMessages = Omit<KitMessages, 'admin'>

/** The admin's words in one language. */
export type AdminMessages = KitMessages['admin']

/** The kit's words for public pages in one language, as request.ts puts them under `platform`. */
export function platformMessages(locale: Locale): PlatformMessages {
  const { admin: _admin, ...rest } = kitMessages[locale]
  return rest
}

/** The admin's words in one language. */
export function adminMessages(locale: Locale): AdminMessages {
  return kitMessages[locale].admin
}

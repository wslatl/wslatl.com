import 'server-only'
import type { Locale } from '../../i18n/config'
import { adminMessages } from '../../i18n/messages'
import { translatorFor, type AdminMessages, type AdminText } from '../text'

const made = new Map<Locale, AdminText>()

/** The admin's words in one language, for server code. Made once per language. */
export function adminText(locale: Locale): AdminText {
  let t = made.get(locale)
  if (!t) {
    t = translatorFor(locale, adminMessages(locale))
    made.set(locale, t)
  }
  return t
}

/** The keys of the admin's problems: what a setting, GitHub or the updater says is wrong. */
export type ProblemKey = keyof AdminMessages['problems']

/**
 * One of those problems, by its key, so it can be said in any language: in
 * English for the server log and in the admin's language on its pages.
 */
export type Said = { key: ProblemKey; values?: Record<string, string | number> }

/** A problem as a sentence, in English unless a language is given. */
export function say({ key, values }: Said, locale: Locale = 'en'): string {
  return adminText(locale)(`problems.${key}`, values)
}

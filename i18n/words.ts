import { createTranslator, type NamespaceKeys, type NestedKeyOf } from 'next-intl'
import type { Locale } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'
import de from '@/messages/de.json'
import en from '@/messages/en.json'
import es from '@/messages/es.json'
import fr from '@/messages/fr.json'
import pt from '@/messages/pt.json'

/**
 * Every word the site's own components render, in messages/<locale>.json,
 * read through next-intl's own translator: words('home.hero')('from',
 * { price }). English is the source; the other four have the same keys, or
 * this does not build, and `npm run i18n:check` holds their arguments and
 * wording rules to the English (platform/tools/i18n-check.mjs).
 *
 * Text that belongs to the data (service descriptions, FAQs, game guidance,
 * legal documents) is not here: it stays in data/ and content/, and its
 * translations live in i18n/content/.
 *
 * The slogan stays in English in every language. It is the brand, the same
 * way the company name is.
 *
 * Synchronous, as getLocale is (i18n/locale.ts), so a Server Component, a
 * metadata function or a helper reads its words while it renders, with the
 * page's language set once by the layout. A number goes in as text, the way
 * the page writes it ("1.5", "2026"), never through the language's number
 * format. A message that is missing, or that is not given its arguments,
 * fails the build rather than showing a key.
 */
const messages: Readonly<Record<Locale, typeof en>> = { en, es, fr, de, pt }

export type Words = typeof en
export type WordsNamespace = NamespaceKeys<Words, NestedKeyOf<Words>>
export type Translator<N extends WordsNamespace = never> = ReturnType<typeof createTranslator<Words, N>>

const translators = new Map<string, unknown>()

/** The site's words in one language, for a part of the messages or all of them. */
export function wordsFor<N extends WordsNamespace = never>(locale: Locale, namespace?: N): Translator<N> {
  const key = `${locale} ${namespace ?? ''}`
  let t = translators.get(key) as Translator<N> | undefined
  if (!t) {
    t = createTranslator<Words, N>({
      locale,
      messages: messages[locale],
      namespace,
      timeZone: 'UTC',
      onError: (error) => {
        throw error
      },
    })
    translators.set(key, t)
  }
  return t
}

/** The messages themselves, as written, for a test or a tool that reads them whole. */
export function messagesFor(locale: Locale): Words {
  return messages[locale]
}

/** The same, in the language of the page being rendered. */
export function words<N extends WordsNamespace = never>(namespace?: N): Translator<N> {
  return wordsFor<N>(getLocale(), namespace)
}

/**
 * A list in the messages (steps.0, steps.1, ...), in its order, each item
 * written out: a string, or an object of strings for a list of objects.
 * `values` go to every item, for the ones that take arguments.
 */
export function listOf<Item extends string | Record<string, string> = string>(
  path: string,
  { locale = getLocale(), values }: { locale?: Locale; values?: Record<string, string> } = {},
): Item[] {
  // The key is built at runtime, so it is read loosely here; the translator
  // still throws for one that is missing.
  const t = wordsFor(locale) as unknown as { (key: string, values?: Record<string, string>): string; raw(key: string): unknown }
  const raw = t.raw(path) as Record<string, unknown>
  return Object.keys(raw).map((index) => {
    const item = raw[index]
    if (typeof item === 'string') return t(`${path}.${index}`, values) as Item
    return Object.fromEntries(Object.keys(item as object).map((field) => [field, t(`${path}.${index}.${field}`, values)])) as Item
  })
}

/**
 * Placeholders the code fills in later, kept as they are: {0} where the
 * brand kit page puts a line of English, {shown} where the browser writes a
 * count. keep('shown', 'total') is { shown: '{shown}', total: '{total}' }.
 */
export function keep(...names: string[]): Record<string, string> {
  return Object.fromEntries(names.map((name) => [name, `{${name}}`]))
}

/**
 * How each language writes a game category inside a sentence ("More
 * survival & sandbox games"): English lowers each capitalized word, Spanish,
 * French and Portuguese lower the first letter, and German, which
 * capitalizes nouns, keeps it as it is.
 */
export const categoryInSentence: Readonly<Record<Locale, (category: string) => string>> = {
  en: (category) => category.replace(/\b[A-Z][a-z]+\b/g, (word) => word.toLowerCase()),
  es: (category) => `${category.charAt(0).toLowerCase()}${category.slice(1)}`,
  fr: (category) => `${category.charAt(0).toLowerCase()}${category.slice(1)}`,
  de: (category) => category,
  pt: (category) => `${category.charAt(0).toLowerCase()}${category.slice(1)}`,
}

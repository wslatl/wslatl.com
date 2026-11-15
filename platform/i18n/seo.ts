import type { MetadataRoute } from 'next'
import { defaultLocale, localePath, locales, openGraphLocales, type Locale } from './config'

/**
 * A page's address in each language it is written in, in the order of
 * `locales`, then x-default: the English one, or the first there is when a
 * page has no English.
 */
export type LanguageAlternates = Partial<Record<Locale | 'x-default', string>>

type SitemapEntry = MetadataRoute.Sitemap[number]

/** What an app's sitemap says of one page beyond its addresses: how often it changes, how it ranks. */
export type SitemapExtras = Omit<SitemapEntry, 'url' | 'alternates'>

/**
 * The languages a page is written in. Every app says so for each page:
 * `locales` for a page in all five, or fewer, such as ['en'] for a guide
 * nobody has translated yet. hreflang and the sitemap list only these, since
 * a search engine takes the same words at five addresses for duplicates.
 */
export type PageLanguages = readonly Locale[]

export type Seo = {
  /** The full address of a page in one language: https://wslatl.com/es/pricing, or the site itself for the English home page. */
  pageUrl(locale: Locale, path: string): string
  /**
   * The page's address in each of its languages, then x-default. The
   * page's hreflang tags and its sitemap entries list this same set, so the
   * two always agree.
   */
  languageAlternates(path: string, languages: PageLanguages): LanguageAlternates
  /**
   * A page's `alternates` in its metadata: its own address as the
   * canonical one, and the addresses of its languages. A page shown in a
   * language it is not written in (an English guide under /es/) is in no
   * set: it lists none, and the app marks it noindex.
   */
  alternates(locale: Locale, path: string, languages: PageLanguages): { canonical: string; languages: LanguageAlternates }
  /** The Open Graph locale of a page, and those of its other languages. */
  openGraph(locale: Locale, languages: PageLanguages): { locale: string; alternateLocale: string[] }
  /**
   * The sitemap: an entry for each page in each of its languages, page by
   * page, each listing the page's languages with x-default. `extras` adds
   * what the app says of a page in a language, such as its priority.
   */
  sitemap<Page extends { path: string; languages: PageLanguages }>(
    pages: readonly Page[],
    extras?: (page: Page, locale: Locale) => SitemapExtras,
  ): MetadataRoute.Sitemap
}

export type SeoOptions = {
  /**
   * Write the English home page with its slash, https://knowledge.wslatl.com/,
   * as the knowledge base always has. Left out, it is the bare address,
   * https://wslatl.com, as the main website has it. Either way an app's
   * canonical and hreflang addresses stay as they were.
   */
  homeSlash?: boolean
}

/** In the order of `locales`, whatever order they were given in, each once. */
const ordered = (languages: PageLanguages) => locales.filter((locale) => languages.includes(locale))

/**
 * The SEO helpers for one app, from its own address (`url` in its
 * platform.config.mjs), never from a request's Host:
 *
 *   const seo = createSeo(platform.url)
 *   export const metadata = { alternates: seo.alternates('es', '/pricing', locales) }
 *
 * `path` is always the page's path without a language, as in /pricing.
 */
export function createSeo(url: string, { homeSlash = false }: SeoOptions = {}): Seo {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:') throw new Error('createSeo needs the app\'s https address, such as "https://wslatl.com".')
  const site = url.replace(/\/+$/, '')

  const pageUrl = (locale: Locale, path: string) => {
    const localized = localePath(locale, path)
    if (localized === '/') return homeSlash ? `${site}/` : site
    return `${site}${localized}`
  }

  const languageAlternates = (path: string, languages: PageLanguages): LanguageAlternates => {
    const written = ordered(languages)
    if (written.length === 0) return {}
    const fallback = written.includes(defaultLocale) ? defaultLocale : written[0]
    return {
      ...(Object.fromEntries(written.map((locale) => [locale, pageUrl(locale, path)])) as LanguageAlternates),
      'x-default': pageUrl(fallback, path),
    }
  }

  return {
    pageUrl,
    languageAlternates,
    alternates: (locale, path, languages) => ({
      canonical: pageUrl(locale, path),
      languages: languages.includes(locale) ? languageAlternates(path, languages) : {},
    }),
    openGraph: (locale, languages) => ({
      locale: openGraphLocales[locale],
      alternateLocale: ordered(languages)
        .filter((other) => other !== locale)
        .map((other) => openGraphLocales[other]),
    }),
    sitemap: (pages, extras) =>
      pages.flatMap((page) =>
        ordered(page.languages).map((locale) => ({
          url: pageUrl(locale, page.path),
          ...extras?.(page, locale),
          alternates: { languages: languageAlternates(page.path, page.languages) },
        })),
      ),
  }
}

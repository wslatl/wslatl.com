import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { defaultLocale, locales, type Locale } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'
import { createSeo } from '@/platform/i18n/seo'

/**
 * Every address, hreflang set and Open Graph locale the site writes, from
 * the kit (platform/i18n/seo.ts), on the site's own https address. Every
 * page is written in all five languages.
 */
export const seo = createSeo(siteConfig.siteUrl)

/**
 * A short fingerprint of the picture's file, for its address. Apps that show
 * link previews (Discord above all) keep a picture by its address, so a
 * picture redrawn at the same address goes on showing the old one. With this,
 * a new picture is a new address, with nothing to remember.
 */
const ogImageFingerprint = createHash('sha256')
  .update(readFileSync(join(process.cwd(), 'public', 'og-image.png')))
  .digest('hex')
  .slice(0, 8)

/**
 * The site's own share picture: the home page's, and the layout's for
 * anything that has none. Every other page has a card of its own (see
 * shareCardUrl).
 */
export const ogImage = {
  url: `/og-image.png?v=${ogImageFingerprint}`,
  width: 1200,
  height: 630,
  alt: 'WSLATL LLC: hosting that actually gives a damn',
  type: 'image/png',
}

/**
 * The address of one page's own share card, drawn by app/og/route.tsx at the
 * size of ogImage. `path` is the page's path without a language, as it is
 * given to pageMetadata(). The card is keyed by page, not by its words: the
 * route looks those up (lib/share-card.ts), so each page has one address to
 * cache and the route never draws text that is not on the site.
 */
export function shareCardUrl(path: string, locale: Locale): string {
  return `/og?${new URLSearchParams({ path, locale })}`
}

/** The full URL of a page in one language: the home page is the bare address, https://wslatl.com. */
export function pageUrl(locale: Locale, path: string): string {
  return seo.pageUrl(locale, path)
}

/**
 * A page's address in every language, with the English one as the fallback
 * for everyone else (x-default). The page head and the sitemap both list
 * these, so they always agree.
 */
export function languageAlternates(path: string): Record<Locale | 'x-default', string> {
  return seo.languageAlternates(path, locales) as Record<Locale | 'x-default', string>
}

interface PageMetadataInput {
  /** Page title. The layout template appends " | WSLATL". */
  title: string
  description: string
  /** Route path without a language prefix, e.g. `/pricing`. */
  path: string
  /** Use the title exactly as given, without the template suffix. */
  absoluteTitle?: boolean
  /** Defaults to the language of the page being rendered. */
  locale?: Locale
}

/**
 * Complete metadata for one page. Next.js replaces (rather than merges) a
 * nested `openGraph` object from the layout, so every page builds its full
 * Open Graph and Twitter set here instead of losing the share image.
 *
 * The share image is the page's own card (shareCardUrl), a 1200x630 PNG with
 * its size and type tags, and the page's title as its alt text. Only the
 * English home page keeps the site's static picture (public/og-image.png,
 * which is in English); the other four home pages have a card in their own
 * language. No page takes a picture of its own: a partner's 3:1 WebP banner
 * is not a share image on Facebook, LinkedIn or X. The same picture and alt
 * go in twitter:image and twitter:image:alt. The brand has no X account, so
 * there is no twitter:site and no twitter:creator, and none is guessed. A
 * page needs its words in lib/share-card.ts to have a card;
 * tests/share-card.test.ts checks every page in the sitemap has them.
 *
 * Every page also points at itself in the other languages, so a search engine
 * can offer a reader the version in their own language (hreflang), with the
 * English one as the fallback for everyone else (x-default).
 */
export function pageMetadata({ title, description, path, absoluteTitle = false, locale }: PageMetadataInput): Metadata {
  const language = locale ?? getLocale()
  // The English home page keeps the site's picture; every other page gets its own card.
  const shareImage = path === '/' && language === defaultLocale ? ogImage : { ...ogImage, url: shareCardUrl(path, language), alt: title }
  const url = pageUrl(language, path)
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.brand}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: seo.alternates(language, path, locales),
    openGraph: {
      type: 'website',
      ...seo.openGraph(language, locales),
      siteName: siteConfig.brand,
      url,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [{ url: shareImage.url, alt: shareImage.alt }],
    },
  }
}

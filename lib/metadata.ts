import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { defaultLocale, localePath, locales, openGraphLocales, type Locale } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'

const ogImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'WSLATL LLC: hosting that actually gives a damn',
  type: 'image/png',
}

/** The full URL of a page in one language. */
export function pageUrl(locale: Locale, path: string): string {
  const localized = localePath(locale, path)
  return localized === '/' ? siteConfig.siteUrl : `${siteConfig.siteUrl}${localized}`
}

interface PageMetadataInput {
  /** Page title. The layout template appends " | WSLATL LLC". */
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
 * Every page also points at itself in the other languages, so a search engine
 * can offer a reader the version in their own language (hreflang), with the
 * English one as the fallback for everyone else (x-default).
 */
export function pageMetadata({ title, description, path, absoluteTitle = false, locale }: PageMetadataInput): Metadata {
  const language = locale ?? getLocale()
  const url = pageUrl(language, path)
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((other) => [other, pageUrl(other, path)])),
        'x-default': pageUrl(defaultLocale, path),
      },
    },
    openGraph: {
      type: 'website',
      locale: openGraphLocales[language],
      alternateLocale: locales.filter((other) => other !== language).map((other) => openGraphLocales[other]),
      siteName: siteConfig.name,
      url,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  }
}

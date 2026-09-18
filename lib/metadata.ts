import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

const ogImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'WSLATL LLC: hosting that actually gives a damn',
  type: 'image/png',
}

interface PageMetadataInput {
  /** Page title. The root layout template appends " | WSLATL LLC". */
  title: string
  description: string
  /** Route path, e.g. `/pricing`. Becomes the canonical URL. */
  path: string
  /** Use the title exactly as given, without the template suffix. */
  absoluteTitle?: boolean
}

/**
 * Complete metadata for one page. Next.js replaces (rather than merges) a
 * nested `openGraph` object from the layout, so every page builds its full
 * Open Graph and Twitter set here instead of losing the share image.
 */
export function pageMetadata({ title, description, path, absoluteTitle = false }: PageMetadataInput): Metadata {
  const url = path === '/' ? siteConfig.siteUrl : `${siteConfig.siteUrl}${path}`
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
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

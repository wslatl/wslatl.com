import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // No line for the admin: it would only point at it, and a disallowed
      // page is one a search engine never fetches, so it would never see the
      // noindex the admin sends in its headers and meta tags.
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  }
}

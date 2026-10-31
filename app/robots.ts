import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin (app/admin). Also noindex in its headers and meta tags.
      disallow: '/admin',
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  }
}

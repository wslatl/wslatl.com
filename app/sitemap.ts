import type { MetadataRoute } from 'next'
import { games } from '@/data/games'
import { primaryLegalPages, secondaryLegalPages } from '@/data/legal'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.siteUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteConfig.siteUrl}/games`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${siteConfig.siteUrl}/games/${game.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const legalRoutes: MetadataRoute.Sitemap = [...primaryLegalPages, ...secondaryLegalPages].map((page) => ({
    url: `${siteConfig.siteUrl}${page.href}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...staticRoutes, ...gameRoutes, ...legalRoutes]
}

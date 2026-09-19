import type { MetadataRoute } from 'next'
import { games } from '@/data/games'
import { legalPages } from '@/data/legal'
import { siteConfig } from '@/config/site'

const url = (path: string) => (path === '/' ? siteConfig.siteUrl : `${siteConfig.siteUrl}${path}`)

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/pricing'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/games'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/legal'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: url(`/games/${game.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const legalRoutes: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: url(page.href),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...staticRoutes, ...gameRoutes, ...legalRoutes]
}

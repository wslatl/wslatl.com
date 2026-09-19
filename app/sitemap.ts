import type { MetadataRoute } from 'next'
import { games } from '@/data/games'
import { legalPages } from '@/data/legal'
import { defaultLocale, locales } from '@/i18n/config'
import { pageUrl } from '@/lib/metadata'

/**
 * Every page in every language. Each entry lists its translations, so a
 * search engine can offer a reader the version in their own language rather
 * than treating the five as duplicates of each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const paths: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/pricing', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/games', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/legal', changeFrequency: 'yearly', priority: 0.3 },
    ...games.map((game) => ({ path: `/games/${game.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...legalPages.map((page) => ({ path: page.href, changeFrequency: 'yearly' as const, priority: 0.3 })),
  ]

  return paths.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: pageUrl(locale, path),
      lastModified: now,
      changeFrequency,
      // A translation is not the page people should land on first.
      priority: locale === defaultLocale ? priority : Math.round(priority * 0.8 * 10) / 10,
      alternates: {
        languages: Object.fromEntries(locales.map((other) => [other, pageUrl(other, path)])),
      },
    })),
  )
}

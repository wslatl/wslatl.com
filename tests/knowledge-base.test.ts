import { describe, expect, it } from 'vitest'
import { games } from '@/data/games'
import { footerColumns } from '@/data/footer'
import { en } from '@/i18n/copy/en'
import { locales } from '@/i18n/config'
import { gameGuidesUrl, knowledgeBaseUrl } from '@/lib/knowledge-base'

describe('links to the knowledge base', () => {
  it('keeps the reader in their language', () => {
    expect(knowledgeBaseUrl('en')).toBe('https://knowledge.wslatl.com/')
    expect(knowledgeBaseUrl('de')).toBe('https://knowledge.wslatl.com/de')
    expect(gameGuidesUrl('minecraft', 'en')).toBe('https://knowledge.wslatl.com/category/minecraft')
    expect(gameGuidesUrl('minecraft', 'es')).toBe('https://knowledge.wslatl.com/es/category/minecraft')
  })

  it('maps the games whose guides live under another slug', () => {
    expect(gameGuidesUrl('ark-survival-evolved', 'en')).toBe('https://knowledge.wslatl.com/category/ark')
    expect(gameGuidesUrl('don-t-starve-together', 'fr')).toBe(
      'https://knowledge.wslatl.com/fr/category/dont-starve-together',
    )
  })

  it('only links games that are on this site and have guides', () => {
    const slugs = new Set(games.map((game) => game.slug))
    const linked = games.filter((game) => gameGuidesUrl(game.slug, 'en'))
    expect(linked.length).toBe(41)
    expect(gameGuidesUrl('grounded', 'en')).toBeNull()
    expect(linked.every((game) => slugs.has(game.slug))).toBe(true)
  })

  it('is in the footer in every language', () => {
    for (const locale of locales) {
      const hrefs = footerColumns(en, locale, []).flatMap((column) => column.links.map((link) => link.href))
      expect(hrefs, locale).toContain(knowledgeBaseUrl(locale))
    }
  })
})

import { describe, expect, it } from 'vitest'
import { locations } from '@/data/locations'
import { productLines } from '@/data/pricing'
import { locales } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { tierStorageTypes } from '@/lib/pricing'
import { kumaPage } from './fixtures/kuma'

/**
 * data/locations.ts holds the little about each location that
 * data/pricing.ts does not: the CPU and the group on the status page. These
 * keep the two files telling the same story, so the home page's live panel
 * can never put one location's prices beside another's hardware.
 */
const groups = productLines.flatMap((line) => line.groups)

describe('the locations', () => {
  it('cover every tier of plans, one location each, with a status group each', () => {
    expect(locations.map((location) => location.tier).toSorted()).toEqual([...new Set(groups.map((group) => group.tier))].toSorted())
    expect(new Set(locations.map((location) => location.statusGroup)).size).toBe(locations.length)
  })

  it('run the CPU, in the city, that every plan group of their tier names', () => {
    for (const location of locations) {
      const city = copyFor('en').home.hero.live.cities[location.id]
      const sold = groups.filter((group) => group.tier === location.tier)
      expect(sold.length, location.id).toBeGreaterThan(0)
      for (const group of sold) {
        expect(group.description, group.id).toContain(location.cpu)
        expect(group.description, group.id).toContain(`in ${city}`)
      }
    }
  })

  it('have one kind of storage each, which the panel names beside the CPU', () => {
    for (const location of locations) expect(tierStorageTypes(location.tier), location.id).toHaveLength(1)
  })

  it('have a name in every language', () => {
    for (const locale of locales) {
      for (const location of locations) expect(copyFor(locale).home.hero.live.cities[location.id], `${locale} ${location.id}`).toMatch(/\S/)
    }
  })

  it('name the groups the status page had on 2026-11-14', () => {
    // A group renamed there shows its location without live status, until
    // statusGroup here is renamed to match.
    const onThePage = kumaPage.publicGroupList.map((group) => group.name.trim())
    for (const location of locations) expect(onThePage, location.id).toContain(location.statusGroup)
  })
})

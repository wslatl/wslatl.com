import { describe, expect, it } from 'vitest'
import { flagCountries } from '@/components/locations/flag'
import { locations, regionCodes } from '@/data/locations'
import { productLines } from '@/data/pricing'
import { locales } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { tierStorageTypes } from '@/lib/pricing'
import { kumaPage } from './fixtures/kuma'
import { eightLocations } from './fixtures/locations'

/**
 * data/locations.ts holds the little about each location that
 * data/pricing.ts does not: the CPU and the group on the status page. These
 * keep the two files telling the same story, so the home page's live panel
 * can never put one location's prices beside another's hardware.
 */
const groups = productLines.flatMap((line) => line.groups)

/** A location's name in a language. */
const cityOf = (locale: (typeof locales)[number], id: string) => (copyFor(locale).home.hero.live.cities as Record<string, string>)[id]

describe('the locations', () => {
  it('cover every tier of plans, each location with its own id and its own status group', () => {
    expect([...new Set(locations.map((location) => location.tier))].toSorted()).toEqual([...new Set(groups.map((group) => group.tier))].toSorted())
    expect(new Set(locations.map((location) => location.id)).size).toBe(locations.length)
    expect(new Set(locations.map((location) => location.statusGroup)).size).toBe(locations.length)
    for (const location of locations) expect(location.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('run the CPU, in the city, that every plan group of their tier names', () => {
    for (const location of locations) {
      const city = cityOf('en', location.id)
      const sold = groups.filter((group) => group.tier === location.tier)
      expect(sold.length, location.id).toBeGreaterThan(0)
      for (const group of sold) {
        expect(group.description, group.id).toContain(location.hardware.cpu)
        expect(group.description, group.id).toContain(`in ${city}`)
      }
    }
  })

  it('state no hardware the site does not already state: memory and RAID are in every plan group of their tier', () => {
    for (const location of locations) {
      for (const group of groups.filter((g) => g.tier === location.tier)) {
        if (location.hardware.memory) expect(group.description, `${location.id} ${group.id}`).toContain(`${location.hardware.memory} memory`)
        if (location.hardware.raid) expect(group.description, `${location.id} ${group.id}`).toContain(`in ${location.hardware.raid}`)
      }
    }
  })

  it('say whose hardware it is, where in the world, and in which country, with a flag to draw', () => {
    for (const location of locations) {
      expect(['rented', 'owned'], location.id).toContain(location.ownership)
      expect(Object.keys(regionCodes), location.id).toContain(location.region)
      expect(location.country, location.id).toMatch(/^[A-Z]{2}$/)
      expect(flagCountries, location.id).toContain(location.country)
    }
    // The fixture's countries too, so the screenshots of it are true to the page.
    for (const location of eightLocations) expect(flagCountries, location.id).toContain(location.country)
  })

  it('have one kind of storage each, which the panel names beside the CPU', () => {
    for (const location of locations) expect(tierStorageTypes(location.tier), location.id).toHaveLength(1)
  })

  it('have a name in every language, and no name is left over from a location that went', () => {
    for (const locale of locales) {
      for (const location of locations) expect(cityOf(locale, location.id), `${locale} ${location.id}`).toMatch(/\S/)
      expect(Object.keys(copyFor(locale).home.hero.live.cities).toSorted(), locale).toEqual(locations.map((location) => location.id).toSorted())
    }
  })

  it('name the groups the status page had on 2026-11-14', () => {
    // A group renamed there shows its location without live status, until
    // statusGroup here is renamed to match.
    const onThePage = kumaPage.publicGroupList.map((group) => group.name.trim())
    for (const location of locations) expect(onThePage, location.id).toContain(location.statusGroup)
  })
})

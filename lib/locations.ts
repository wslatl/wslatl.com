import { regionCodes, type Location, type Region } from '@/data/locations'
import { productLines, type ProductLineId, type StorageType } from '@/data/pricing'
import type { Locale } from '@/i18n/config'
import type { Copy } from '@/i18n/copy/en'
import { tierStorageTypes } from '@/lib/pricing'

/**
 * What a location's entry in data/locations.ts comes to once data/pricing.ts
 * and the page's language are read alongside it. Server side: the names come
 * from the platform's locale data, which the browser's may word differently,
 * so a page computes them here and hands the words to anything that runs in
 * the browser.
 */

/** The product lines that run at a location: the ones it lists, or every line its tier is sold on. */
export function productsAt(location: Location): ProductLineId[] {
  if (location.products) return location.products
  return productLines.filter((line) => line.groups.some((group) => group.tier === location.tier)).map((line) => line.id)
}

/** The drives at a location, from the plan groups of its tier. */
export function storageAt(location: Location): StorageType {
  return tierStorageTypes(location.tier)[0]
}

/** A location's name in a language. The status page's name for its group is only a fallback. */
export function cityOf(t: Copy, location: Location): string {
  return (t.home.hero.live.cities as Record<string, string>)[location.id] ?? location.statusGroup
}

/** A country's name in a language, from its ISO 3166-1 alpha-2 code. */
export function countryName(code: string, locale: Locale): string {
  return new Intl.DisplayNames(locale, { type: 'region' }).of(code) ?? code
}

/** A region's name in a language, by its UN M49 code. */
export function regionName(region: Region, locale: Locale): string {
  return new Intl.DisplayNames(locale, { type: 'region' }).of(regionCodes[region]) ?? region
}

/** The regions the locations are in, in the order they first come up. */
export function regionsOf(places: readonly Location[]): Region[] {
  return [...new Set(places.map((place) => place.region))]
}

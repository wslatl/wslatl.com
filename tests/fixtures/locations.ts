import { locations, type Location } from '@/data/locations'

/**
 * Locations for trying the home page's live panel at sizes the site does not
 * have yet. Not real data: the first two are today's, and the rest are made
 * up for the tests, numbered, and never shown on the site.
 */
export function manyLocations(count: number): Location[] {
  const extra = Array.from({ length: Math.max(0, count - locations.length) }, (_, i): Location => ({
    id: `fixture-${i + 3}`,
    tier: i % 2 === 0 ? 'premium' : 'budget',
    cpu: i % 2 === 0 ? 'AMD Ryzen 9 3900X' : 'Intel Core i7-6700K',
    statusGroup: `Fixture location ${i + 3}`,
  }))
  return [...locations, ...extra].slice(0, count)
}

/** About the size the owner asked to see: eight locations, two of them real. */
export const eightLocations = manyLocations(8)

import { locations, type Location } from '@/data/locations'

/**
 * Locations for trying the live panel and /hardware-and-locations at sizes
 * the site does not have yet. Not real data: the first two are today's, and
 * the rest are made up for the tests, numbered, and never shown on the site.
 * They spread over three regions, and some are owned or run only one line,
 * so grouping and the filters have something to do.
 */
const madeUp: Omit<Location, 'id' | 'statusGroup'>[] = [
  { ownership: 'rented', region: 'north-america', country: 'US', tier: 'premium', hardware: { cpu: 'AMD Ryzen 9 3900X', memory: 'DDR4', raid: 'RAID 1' } },
  { ownership: 'owned', region: 'europe', country: 'DE', tier: 'budget', hardware: { cpu: 'Intel Core i7-6700K', memory: 'DDR4', raid: 'RAID 1' }, products: ['vps'] },
  { ownership: 'rented', region: 'europe', country: 'FR', tier: 'premium', hardware: { cpu: 'AMD Ryzen 9 3900X', memory: 'DDR4', raid: 'RAID 1' } },
  { ownership: 'rented', region: 'europe', country: 'NL', tier: 'budget', hardware: { cpu: 'Intel Core i7-6700K', memory: 'DDR4', raid: 'RAID 1' }, products: ['game'] },
  { ownership: 'owned', region: 'asia', country: 'JP', tier: 'premium', hardware: { cpu: 'AMD Ryzen 9 3900X', memory: 'DDR4', raid: 'RAID 1' } },
  { ownership: 'rented', region: 'asia', country: 'JP', tier: 'budget', hardware: { cpu: 'Intel Core i7-6700K' }, products: ['vps'] },
]

/** Today's two, then as many made-up ones as asked for, the six above in turn. */
export function manyLocations(count: number): Location[] {
  const extra = Array.from({ length: Math.max(0, count - locations.length) }, (_, i): Location => ({
    ...madeUp[i % madeUp.length],
    id: `fixture-${i + 3}`,
    statusGroup: `Fixture location ${i + 3}`,
  }))
  return [...locations, ...extra].slice(0, count)
}

/** About the size the owner asked to see: eight locations, two of them real. */
export const eightLocations = manyLocations(8)

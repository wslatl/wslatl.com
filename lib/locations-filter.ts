import type { PlanGroup, ProductLineId } from '@/data/pricing'

/**
 * The filters on /hardware-and-locations: by product and by tier. They only
 * appear once there are enough locations to need them, and they keep or
 * hide locations; they never reorder or change them. Plain functions, so the
 * browser and the tests share them.
 */

/** From this many locations on, the page offers the filters. Fewer read fine as they are. */
export const filtersFrom = 6

export type ProductFilter = 'all' | ProductLineId
export type TierFilter = 'all' | PlanGroup['tier']

export interface Filterable {
  products: readonly ProductLineId[]
  tier: PlanGroup['tier']
}

/** Whether a location stays in view with these filters. */
export function matchesFilters(place: Filterable, product: ProductFilter, tier: TierFilter): boolean {
  return (product === 'all' || place.products.includes(product)) && (tier === 'all' || place.tier === tier)
}

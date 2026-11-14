import type { PlanGroup } from '@/data/pricing'

/**
 * Where the servers are. Each location runs one tier of the plans in
 * data/pricing.ts, so its prices and its storage come from there; what is
 * written here is only what that file does not hold as a value: the CPU
 * (it is in the plan groups' descriptions, as words) and the group that
 * lists the location's servers on status.wslatl.com.
 *
 * The home page's live panel reads this (components/sections/live-panel.tsx).
 * Each location's name, in every language, is in i18n/copy under
 * home.hero.live.cities. tests/locations.test.ts checks every plan group of a
 * location's tier names its CPU and its city.
 */
export type LocationId = 'los-angeles' | 'new-york'

export interface Location {
  id: LocationId
  /** The plans sold here: Premium in Los Angeles, Budget in New York City. */
  tier: PlanGroup['tier']
  /** The CPU model every server here runs on, as the plan groups name it. */
  cpu: string
  /**
   * The group on the status page that lists this location's servers, by its
   * name there. Renamed there and not here, the location shows no live
   * status (and the panel says so) until the two match again.
   */
  statusGroup: string
}

export const locations: readonly Location[] = [
  { id: 'los-angeles', tier: 'premium', cpu: 'AMD Ryzen 9 3900X', statusGroup: 'Los Angeles' },
  { id: 'new-york', tier: 'budget', cpu: 'Intel Core i7-6700K', statusGroup: 'New York City' },
]

import type { PlanGroup, ProductLineId } from '@/data/pricing'

/**
 * Where the servers are. Each location runs one tier of the plans in
 * data/pricing.ts, so its prices and its storage come from there; what is
 * written here is only what that file does not hold as a value.
 *
 * The hardware is only what the site already says: the plan groups'
 * descriptions name the CPU, the memory (DDR4) and the drives (NVMe or SATA
 * SSD, in RAID 1). Anything not stated anywhere (memory speed, network port
 * speed, the provider) is left out until the owner gives it, never guessed.
 * tests/locations.test.ts checks every value here against those
 * descriptions.
 *
 * Read by /hardware-and-locations (one block each) and by the home page's
 * live panel, which shows the first two in full, in this order, and counts
 * the rest. Each location's name, in every language, is in i18n/copy under
 * home.hero.live.cities.
 */
export type LocationId = string

/** Whose hardware it is. Everything is rented today; some may be owned later. */
export type Ownership = 'rented' | 'owned'

/**
 * Where in the world, for grouping on /hardware-and-locations. Its name in
 * each language comes from the platform's own data (Intl.DisplayNames), by
 * the UN M49 code in regionCodes below.
 */
export type Region = 'north-america' | 'south-america' | 'europe' | 'asia' | 'oceania' | 'africa'

export const regionCodes: Record<Region, string> = {
  'north-america': '003',
  'south-america': '005',
  europe: '150',
  asia: '142',
  oceania: '009',
  africa: '002',
}

export interface Hardware {
  /** The CPU model every server here runs on, as the plan groups name it. */
  cpu: string
  /** The memory, as the plan groups name it, such as "DDR4". */
  memory?: string
  /** How the drives are mirrored, as the plan groups name it, such as "RAID 1". */
  raid?: string
}

export interface Location {
  /** Lowercase letters, digits and dashes, such as "los-angeles". */
  id: LocationId
  ownership: Ownership
  region: Region
  /** ISO 3166-1 alpha-2, such as "US". Its name comes from Intl.DisplayNames. */
  country: string
  /** The plans sold here: Premium in Los Angeles, Budget in New York City. */
  tier: PlanGroup['tier']
  hardware: Hardware
  /**
   * What runs here, when it is not every line the tier is sold on. Left out
   * today: both locations run VPS and game servers.
   */
  products?: ProductLineId[]
  /**
   * The group on the status page that lists this location's servers, by its
   * name there. Renamed there and not here, the location shows no live
   * status (and the page says so) until the two match again.
   */
  statusGroup: string
}

export const locations: readonly Location[] = [
  {
    id: 'los-angeles',
    ownership: 'rented',
    region: 'north-america',
    country: 'US',
    tier: 'premium',
    hardware: { cpu: 'AMD Ryzen 9 3900X', memory: 'DDR4', raid: 'RAID 1' },
    statusGroup: 'Los Angeles',
  },
  {
    id: 'new-york',
    ownership: 'rented',
    region: 'north-america',
    country: 'US',
    tier: 'budget',
    hardware: { cpu: 'Intel Core i7-6700K', memory: 'DDR4', raid: 'RAID 1' },
    statusGroup: 'New York City',
  },
]

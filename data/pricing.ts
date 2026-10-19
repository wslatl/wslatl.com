/**
 * Published plan pricing.
 *
 * This file is the single source of truth for every plan name, spec, and
 * price on the site: the pricing page, the home page product overview, the
 * per-game plan suggestions, and the FAQ answers all read from here. Change a
 * number here and every surface follows. Never hard-code a price anywhere else.
 *
 * The competitor comparisons at the bottom live here too, because they are
 * only true for the prices above. Change a price and re-check every claim.
 */

export type ProductLineId = 'vps' | 'game'
export type StorageType = 'SATA SSD' | 'NVMe'

export interface Plan {
  /** Plan code exactly as it appears in the billing portal, e.g. `B-NYC-4`. */
  name: string
  /** vCPU (VPS) or vCore (game server) count. See `ProductLine.cpuUnit`. */
  cpu: number
  ramGb: number
  storageGb: number
  /** Monthly traffic allowance in TB. Omitted where we do not publish one. */
  trafficTb?: number
  /** Monthly price in USD. */
  price: number
  popular?: boolean
}

export interface PlanGroup {
  id: string
  label: string
  tier: 'budget' | 'premium'
  storageType: StorageType
  description: string
  /** Price comparisons shown under the group heading, by id (see `comparisons` below). */
  comparisons?: ComparisonId[]
  plans: Plan[]
}

export interface ProductLine {
  id: ProductLineId
  label: string
  /** Section id on /pricing, so `/pricing#game-servers` deep-links to it. */
  anchor: string
  cpuUnit: 'vCPU' | 'vCores'
  intro: string
  /** Included with every plan on this line. */
  included: string[]
  groups: PlanGroup[]
}

export const productLines: ProductLine[] = [
  {
    id: 'vps',
    label: 'VPS',
    anchor: 'vps',
    cpuUnit: 'vCPU',
    intro:
      'Isolated resources and full root access, with your choice of OS. Premium plans run on an AMD Ryzen 9 3900X with NVMe in Los Angeles, and Budget plans on an Intel Core i7-6700K with SATA SSD in New York City.',
    included: [
      'Full root and sudo access',
      'Your choice of OS',
      'Plan and billing cycle changes in the billing portal, or by a person',
      'A real person to talk to if something breaks',
    ],
    groups: [
      {
        id: 'premium-vps',
        label: 'Premium VPS',
        tier: 'premium',
        storageType: 'NVMe',
        description: 'AMD Ryzen 9 3900X with DDR4 memory and NVMe drives in RAID 1, in Los Angeles.',
        comparisons: ['digitalocean-vps', 'vultr-vps'],
        // No traffic figures here until the bandwidth allowance is confirmed.
        plans: [
          { name: 'P-VPS-2', cpu: 1, ramGb: 2, storageGb: 30, price: 6.5 },
          { name: 'P-VPS-3', cpu: 2, ramGb: 4, storageGb: 60, price: 11, popular: true },
          { name: 'P-VPS-4', cpu: 4, ramGb: 8, storageGb: 120, price: 18.5 },
          { name: 'P-VPS-5', cpu: 8, ramGb: 16, storageGb: 240, price: 35 },
        ],
      },
      {
        id: 'budget-vps',
        label: 'Budget VPS',
        tier: 'budget',
        storageType: 'SATA SSD',
        description:
          'Intel Core i7-6700K with DDR4 memory and SATA SSD drives in RAID 1, in New York City. The same specs as Premium on an older, busier CPU, so your server can be slower at busy times.',
        comparisons: ['hosturly-budget-vps'],
        // The same plans as Premium VPS. Premium costs 10% more, rounded to the cent.
        plans: [
          { name: 'B-NYC-2', cpu: 1, ramGb: 2, storageGb: 30, trafficTb: 2, price: 5.91 },
          { name: 'B-NYC-4', cpu: 2, ramGb: 4, storageGb: 60, trafficTb: 4, price: 10 },
          { name: 'B-NYC-8', cpu: 4, ramGb: 8, storageGb: 120, trafficTb: 8, price: 16.82, popular: true },
          { name: 'B-NYC-16', cpu: 8, ramGb: 16, storageGb: 240, trafficTb: 16, price: 31.82 },
        ],
      },
    ],
  },
  {
    id: 'game',
    label: 'Game servers',
    anchor: 'game-servers',
    cpuUnit: 'vCores',
    intro:
      "These plans aren't locked to one game. Pick the RAM you need and run whatever you want. We handle most titles that offer a dedicated server, including Minecraft, Rust, CS2, ARK, Valheim, FiveM, and Palworld. Don't see yours? Just ask. We can almost always run it.",
    included: [
      'Pterodactyl control panel',
      'DDoS protection built in',
      'Full mod and plugin support',
      'Same-day setup, most of the time',
      'A real person to talk to if something breaks',
    ],
    groups: [
      {
        id: 'premium-game',
        label: 'Premium game servers',
        tier: 'premium',
        storageType: 'NVMe',
        description: 'AMD Ryzen 9 3900X with DDR4 memory and NVMe drives in RAID 1, in Los Angeles.',
        comparisons: ['sparked-minecraft'],
        // Named by RAM: P-GAME-8 is the 8 GB plan.
        plans: [
          { name: 'P-GAME-4', cpu: 1.5, ramGb: 4, storageGb: 50, price: 9 },
          { name: 'P-GAME-6', cpu: 2.5, ramGb: 6, storageGb: 75, price: 13 },
          { name: 'P-GAME-8', cpu: 3, ramGb: 8, storageGb: 100, price: 17.5, popular: true },
          { name: 'P-GAME-12', cpu: 4.5, ramGb: 12, storageGb: 150, price: 25.5 },
          { name: 'P-GAME-16', cpu: 6, ramGb: 16, storageGb: 200, price: 33.5 },
        ],
      },
      {
        id: 'budget-game',
        label: 'Budget game servers',
        tier: 'budget',
        storageType: 'SATA SSD',
        description:
          'Intel Core i7-6700K with DDR4 memory and SATA SSD drives in RAID 1, in New York City. The same specs as Premium on an older, busier CPU, so your server can be slower at busy times.',
        // No comparison: Sparked's and PebbleHost's Budget lines cost less.
        // The same plans as Premium game servers. Premium costs 10% more, rounded to the cent.
        plans: [
          { name: 'B-GAME-4', cpu: 1.5, ramGb: 4, storageGb: 50, price: 8.18 },
          { name: 'B-GAME-6', cpu: 2.5, ramGb: 6, storageGb: 75, price: 11.82 },
          { name: 'B-GAME-8', cpu: 3, ramGb: 8, storageGb: 100, price: 15.91, popular: true },
          { name: 'B-GAME-12', cpu: 4.5, ramGb: 12, storageGb: 150, price: 23.18 },
          { name: 'B-GAME-16', cpu: 6, ramGb: 16, storageGb: 200, price: 30.45 },
        ],
      },
    ],
  },
]

/**
 * A price comparison against a named competitor. The wording is agreed and
 * published exactly as written: `text` is the claim, `note` is the source,
 * date and hardware line that has to sit right next to it.
 */
export interface Comparison {
  text: string
  note?: string
}

/**
 * Every comparison the site makes. Competitor list prices were checked on
 * 10 October 2026: re-check them every three months, and before any change
 * to the plans above. Do not add a claim that is not on this list, and do
 * not show one anywhere it is not placed (the plan groups above, and game
 * pages through `gameComparisons` below).
 */
export const comparisons = {
  'sparked-minecraft': {
    text: "Premium Minecraft servers for 13% to 19% less than Sparked Host's Enterprise Minecraft plans with the same RAM (4, 6, 8, 12 and 16 GB).",
    note: "Sparked list prices, checked 10 October 2026. Coupons such as FALL26 and FALLLEAVES2026 are not included, and with them Sparked can cost less for up to three months. Our Premium game servers run on an AMD Ryzen 9 3900X with DDR4 and NVMe; Sparked Enterprise uses a Ryzen 9 7900 (or equivalent) with DDR5. Sparked includes 3 vCPU and 100 GB of disk at every size, more than our 4 GB and 6 GB plans. Sparked's Budget Minecraft plans cost less than our Budget and Premium plans.",
  },
  'apex-minecraft': {
    text: "Premium plans for 37% to 42% less than Apex Hosting's Ryzen Series Minecraft plans with the same RAM (4, 6 and 8 GB).",
    note: 'Apex recurring list prices, checked 10 October 2026. Apex lists a Ryzen 9 7950X with DDR5 at most of its US and EU locations; our Premium plans run on an AMD Ryzen 9 3900X with DDR4.',
  },
  'bloom-minecraft': {
    text: 'Premium plans for 25% to 27% less than Bloom.host Essentials at 4 GB and 6 GB.',
    note: "Bloom's Los Angeles Essentials plans list the same CPU model as ours, an AMD Ryzen 9 3900X, and include more disk: 60 GB and 100 GB of NVMe, against our 50 GB and 75 GB. Bloom list prices, checked 10 October 2026.",
  },
  'sparked-fivem': {
    text: 'Premium plans for 5% to 12% less than Sparked Host FiveM with the same RAM (4 to 16 GB).',
    note: 'List prices checked 10 October 2026; coupons not included. Sparked FiveM uses a Ryzen 9 7950X (or equivalent) with DDR5, and our Premium plans an AMD Ryzen 9 3900X with DDR4. Sparked includes more disk at every size, and more vCPU at 4, 6 and 8 GB.',
  },
  'digitalocean-vps': {
    text: "Premium VPS for 45% to 63% less than DigitalOcean's Basic Regular Droplets with the same RAM and the same number of vCPUs: 2 GB $6.50 (DigitalOcean $12), 4 GB $11 ($24), 8 GB $18.50 ($48), 16 GB $35 ($96).",
    note: 'DigitalOcean list prices, checked 10 October 2026. DigitalOcean does not name the CPU model for these Droplets; ours run on an AMD Ryzen 9 3900X with NVMe. DigitalOcean includes more disk: 50, 80, 160 and 320 GiB, against our 30, 60, 120 and 240 GB.',
  },
  'vultr-vps': {
    text: '35% to 53% less than Vultr Cloud Compute Regular Performance with the same RAM and the same number of vCPUs (2, 4 and 8 GB).',
    note: 'Vultr list prices, checked 10 October 2026. Vultr says Regular Performance runs on previous generation Intel CPUs and regular SSD; ours run on an AMD Ryzen 9 3900X with NVMe. Vultr includes more disk: 55, 80 and 160 GB, against our 30, 60 and 120 GB.',
  },
  'hosturly-budget-vps': {
    text: "Budget VPS for 16% to 29% less than Hosturly's Budget VPS with the same RAM, and twice the vCPU and disk (4 GB and 8 GB).",
    note: "Different hardware: our Intel Core i7-6700K with SATA SSD in RAID 1 in New York City, against Hosturly's AMD EPYC 7402P with NVMe in Chicago. Hosturly list prices, checked 10 October 2026.",
  },
} satisfies Record<string, Comparison>

export type ComparisonId = keyof typeof comparisons

/** The competitor plans a comparison is measured against. */
export interface ComparedPrices {
  line: ProductLineId
  /** The plan group of ours that the claim is about. */
  tier: PlanGroup['tier']
  /**
   * The competitor's monthly list price in USD, keyed by GB of RAM. Only
   * plans that match one of ours are listed: the same RAM, and for the VPS
   * claims that say so, the same number of vCPUs.
   */
  prices: Record<number, number>
  /**
   * The competitor's disk in GB (DigitalOcean's in GiB) at the same sizes.
   * Recorded for every claim whose note says the competitor includes more
   * disk, so the tests can check that it really does at every size.
   */
  storageGb?: Record<number, number>
}

/**
 * The competitor list prices behind every comparison above, as checked on
 * 10 October 2026. tests/pricing.test.ts works each percentage out again
 * from these and our plans (rounded down), so a price change that makes a
 * claim untrue fails the tests until the claim is fixed.
 */
export const comparedPrices: Record<ComparisonId, ComparedPrices> = {
  // Enterprise: Mercury, Venus, Neptune, Sun and Milky Way, each with 3 vCPU and 100 GB.
  'sparked-minecraft': { line: 'game', tier: 'premium', prices: { 4: 10.36, 6: 15.54, 8: 20.72, 12: 31.08, 16: 41.44 } },
  // Apex does not publish a disk size for these plans.
  'apex-minecraft': { line: 'game', tier: 'premium', prices: { 4: 14.99, 6: 22.49, 8: 27.99 } },
  'bloom-minecraft': { line: 'game', tier: 'premium', prices: { 4: 12, 6: 18 }, storageGb: { 4: 60, 6: 100 } },
  // 3, 3.25, 3.5, 4 and 4 vCPU.
  'sparked-fivem': {
    line: 'game',
    tier: 'premium',
    prices: { 4: 9.56, 6: 14.34, 8: 19.12, 12: 28.68, 16: 38.24 },
    storageGb: { 4: 75, 6: 100, 8: 150, 12: 200, 16: 250 },
  },
  // Basic Regular with 1, 2, 4 and 8 vCPUs.
  'digitalocean-vps': {
    line: 'vps',
    tier: 'premium',
    prices: { 2: 12, 4: 24, 8: 48, 16: 96 },
    storageGb: { 2: 50, 4: 80, 8: 160, 16: 320 },
  },
  // Regular Performance with 1, 2 and 4 vCPUs. Vultr's 16 GB plan has 6 vCPUs, so it is left out.
  'vultr-vps': { line: 'vps', tier: 'premium', prices: { 2: 10, 4: 20, 8: 40 }, storageGb: { 2: 55, 4: 80, 8: 160 } },
  // B-LX-4 (1 vCPU, 30 GB) and B-LX-8 (2 vCPU, 60 GB).
  'hosturly-budget-vps': { line: 'vps', tier: 'budget', prices: { 4: 12, 8: 24 } },
}

export interface GameComparisons {
  /** Shown above the plan tables on the game's page. */
  plans?: ComparisonId[]
  /** One line at the foot of the game's RAM and price table, never a headline. */
  table?: ComparisonId
}

/**
 * Comparisons on individual game pages, keyed by game slug. Game pages do
 * not show the plan groups' own comparisons: the Sparked Minecraft figure is
 * only true for Minecraft, so it must not headline the Rust or FiveM page.
 */
export const gameComparisons: Record<string, GameComparisons> = {
  minecraft: { plans: ['sparked-minecraft', 'apex-minecraft', 'bloom-minecraft'] },
  fivem: { table: 'sparked-fivem' },
}

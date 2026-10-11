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
      'Upgrades and plan changes handled by a person',
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
          { name: 'P-VPS-3', cpu: 2, ramGb: 4, storageGb: 60, price: 12, popular: true },
          { name: 'P-VPS-4', cpu: 4, ramGb: 8, storageGb: 120, price: 24 },
          { name: 'P-VPS-5', cpu: 8, ramGb: 16, storageGb: 240, price: 48 },
        ],
      },
      {
        id: 'budget-vps',
        label: 'Budget VPS',
        tier: 'budget',
        storageType: 'SATA SSD',
        description: 'Intel Core i7-6700K with DDR4 memory and SATA SSD drives in RAID 1, in New York City.',
        comparisons: ['hosturly-budget-vps'],
        // The same sizes as Premium VPS except 2 GB. Premium costs 10% more.
        plans: [
          { name: 'B-NYC-4', cpu: 2, ramGb: 4, storageGb: 60, trafficTb: 4, price: 10.91 },
          { name: 'B-NYC-8', cpu: 4, ramGb: 8, storageGb: 120, trafficTb: 8, price: 21.82, popular: true },
          { name: 'B-NYC-16', cpu: 8, ramGb: 16, storageGb: 240, trafficTb: 16, price: 43.64 },
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
          { name: 'P-GAME-4', cpu: 1.5, ramGb: 4, storageGb: 60, price: 8.75 },
          { name: 'P-GAME-6', cpu: 2.25, ramGb: 6, storageGb: 90, price: 13 },
          { name: 'P-GAME-8', cpu: 3, ramGb: 8, storageGb: 120, price: 17.5, popular: true },
          { name: 'P-GAME-12', cpu: 4.5, ramGb: 12, storageGb: 180, price: 26.25 },
          { name: 'P-GAME-16', cpu: 6, ramGb: 16, storageGb: 240, price: 35 },
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
    text: "Minecraft servers for 15% less than Sparked Host's Enterprise Minecraft plans with the same RAM, at every size we sell (4, 6, 8, 12 and 16 GB).",
    note: 'Sparked list prices, checked 10 October 2026. Coupons such as FALL26 and FALLLEAVES2026 are not included, and with them Sparked can cost less for up to three months. Our game servers run on an AMD Ryzen 9 3900X with DDR4 and NVMe; Sparked Enterprise uses a Ryzen 9 7900 (or equivalent) with DDR5.',
  },
  'apex-minecraft': {
    text: "37% to 42% less than Apex Hosting's Ryzen Series Minecraft plans with the same RAM (4, 6 and 8 GB).",
    note: 'Apex recurring list prices, checked 10 October 2026.',
  },
  'bloom-minecraft': {
    text: '27% less than Bloom.host Essentials at 4 GB and 6 GB.',
    note: "Bloom's Los Angeles Essentials plans list the same CPU model as ours, an AMD Ryzen 9 3900X. Bloom list prices, checked 10 October 2026.",
  },
  'sparked-fivem': {
    text: '8% less than Sparked Host FiveM with the same RAM.',
    note: 'List prices checked 10 October 2026; coupons not included.',
  },
  'digitalocean-vps': {
    text: "Premium VPS for 45% to 50% less than DigitalOcean's Basic Regular Droplets with the same RAM and the same number of vCPUs: 2 GB $6.50 (DigitalOcean $12), 4 GB $12 ($24), 8 GB $24 ($48), 16 GB $48 ($96).",
    note: 'DigitalOcean list prices, checked 10 October 2026. DigitalOcean does not name the CPU model for these Droplets; ours run on an AMD Ryzen 9 3900X with NVMe.',
  },
  'vultr-vps': {
    text: '35% to 40% less than Vultr Cloud Compute Regular Performance with the same RAM and the same number of vCPUs (2, 4 and 8 GB).',
    note: 'Vultr list prices, checked 10 October 2026.',
  },
  'hosturly-budget-vps': {
    text: "Budget VPS for 9% less than Hosturly's Budget VPS with the same RAM, and twice the vCPU and disk (4 GB and 8 GB).",
    note: "Different hardware: our Intel Core i7-6700K with SATA SSD in RAID 1 in New York City, against Hosturly's AMD EPYC 7402P with NVMe in Chicago. Hosturly list prices, checked 10 October 2026.",
  },
} satisfies Record<string, Comparison>

export type ComparisonId = keyof typeof comparisons

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

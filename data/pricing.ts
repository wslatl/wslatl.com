/**
 * Published plan pricing.
 *
 * This file is the single source of truth for every plan name, spec, and
 * price on the site: the pricing page, the home page product overview, the
 * per-game plan suggestions, and the FAQ answers all read from here. Change a
 * number here and every surface follows. Never hard-code a price anywhere else.
 */

export type ProductLineId = 'vps' | 'game'
export type StorageType = 'SATA SSD' | 'NVMe'

export interface Plan {
  /** Plan code exactly as it appears in the billing portal, e.g. `B-NYC-2`. */
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
  /** Price comparison against a named competitor, shown with the group heading. */
  comparison?: string
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
      'Isolated resources and full root access, with your choice of OS. Budget plans run on SATA SSD, Premium plans on NVMe with high-frequency Ryzen 9 cores.',
    included: [
      'Full root and sudo access',
      'Your choice of OS',
      'Upgrades and plan changes handled by a person',
      'A real person to talk to if something breaks',
    ],
    groups: [
      {
        id: 'budget-vps',
        label: 'Budget VPS',
        tier: 'budget',
        storageType: 'SATA SSD',
        description: 'Solid SATA SSD storage at honest prices.',
        comparison: '10% under Hosturly',
        plans: [
          { name: 'B-NYC-2', cpu: 1, ramGb: 2, storageGb: 20, trafficTb: 1, price: 5.4 },
          { name: 'B-NYC-4', cpu: 1, ramGb: 4, storageGb: 30, trafficTb: 2, price: 10.8 },
          { name: 'B-NYC-6', cpu: 2, ramGb: 6, storageGb: 45, trafficTb: 3, price: 16.2 },
          { name: 'B-NYC-8', cpu: 2, ramGb: 8, storageGb: 60, trafficTb: 4, price: 21.6, popular: true },
          { name: 'B-NYC-10', cpu: 4, ramGb: 10, storageGb: 75, trafficTb: 5, price: 27 },
        ],
      },
      {
        id: 'premium-vps',
        label: 'Premium VPS',
        tier: 'premium',
        storageType: 'NVMe',
        description:
          'NVMe drives on high-frequency Ryzen 9 cores. Real-world performance, not just bigger numbers.',
        comparison: '10% under DigitalOcean',
        plans: [
          { name: 'P-VPS-1', cpu: 1, ramGb: 1, storageGb: 25, price: 5.4 },
          { name: 'P-VPS-2', cpu: 2, ramGb: 2, storageGb: 60, price: 16.2 },
          { name: 'P-VPS-3', cpu: 2, ramGb: 4, storageGb: 80, price: 21.2, popular: true },
          { name: 'P-VPS-4', cpu: 4, ramGb: 8, storageGb: 160, price: 43.2 },
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
        id: 'budget-game',
        label: 'Budget game servers',
        tier: 'budget',
        storageType: 'SATA SSD',
        description: 'Game servers on SATA SSD. We usually have you live the same day.',
        comparison: '10% under Sparked',
        plans: [
          { name: 'GAME-1', cpu: 2, ramGb: 4, storageGb: 25, price: 3.6 },
          { name: 'GAME-2', cpu: 2, ramGb: 8, storageGb: 50, price: 7.2, popular: true },
          { name: 'GAME-3', cpu: 3, ramGb: 16, storageGb: 100, price: 14.4 },
        ],
      },
      {
        id: 'premium-game',
        label: 'Premium game servers',
        tier: 'premium',
        storageType: 'NVMe',
        description: 'NVMe drives and Ryzen 9 cores for when the budget line is not enough.',
        comparison: '25% under Sparked',
        plans: [
          { name: 'P-GAME-1', cpu: 3, ramGb: 4, storageGb: 100, price: 12 },
          { name: 'P-GAME-2', cpu: 3, ramGb: 8, storageGb: 100, price: 24, popular: true },
          { name: 'P-GAME-3', cpu: 3, ramGb: 16, storageGb: 100, price: 48 },
        ],
      },
    ],
  },
]

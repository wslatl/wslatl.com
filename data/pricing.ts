import type { LucideIcon } from 'lucide-react'
import { TrendingDown } from 'lucide-react'

export interface PricingPlan {
  name: string
  specs: string[]
  price: number
  popular?: boolean
}

export interface PricingGroup {
  id: string
  label: string
  storageType: 'SATA SSD' | 'NVMe'
  description: string
  claim?: { text: string; icon: LucideIcon }
  plans: PricingPlan[]
}

export interface PricingTab {
  id: 'vps' | 'game'
  label: string
  note?: string
  groups: PricingGroup[]
}

export const pricingTabs: PricingTab[] = [
  {
    id: 'vps',
    label: 'VPS',
    groups: [
      {
        id: 'b-nyc',
        label: 'Budget VPS',
        storageType: 'SATA SSD',
        description: 'Solid SATA SSD storage at honest prices.',
        claim: { text: '10% under Hosturly', icon: TrendingDown },
        plans: [
          { name: 'B-NYC-2',  specs: ['1 vCPU', '2GB RAM', '20GB SATA SSD', '1TB traffic'], price: 5.40  },
          { name: 'B-NYC-4',  specs: ['1 vCPU', '4GB RAM', '30GB SATA SSD', '2TB traffic'], price: 10.80 },
          { name: 'B-NYC-6',  specs: ['2 vCPU', '6GB RAM', '45GB SATA SSD', '3TB traffic'], price: 16.20 },
          { name: 'B-NYC-8',  specs: ['2 vCPU', '8GB RAM', '60GB SATA SSD', '4TB traffic'], price: 21.60, popular: true },
          { name: 'B-NYC-10', specs: ['4 vCPU', '10GB RAM', '75GB SATA SSD', '5TB traffic'], price: 27.00 },
        ],
      },
      {
        id: 'p-vps',
        label: 'Premium VPS',
        storageType: 'NVMe',
        description: 'NVMe drives on high-frequency Ryzen 9 cores. Real-world performance, not just bigger numbers.',
        claim: { text: '10% under DigitalOcean', icon: TrendingDown },
        plans: [
          { name: 'P-VPS-1', specs: ['1 vCPU', '1GB RAM', '25GB NVMe'],  price: 5.40  },
          { name: 'P-VPS-2', specs: ['2 vCPU', '2GB RAM', '60GB NVMe'],  price: 16.20 },
          { name: 'P-VPS-3', specs: ['2 vCPU', '4GB RAM', '80GB NVMe'],  price: 21.20, popular: true },
          { name: 'P-VPS-4', specs: ['4 vCPU', '8GB RAM', '160GB NVMe'], price: 43.20 },
        ],
      },
    ],
  },
  {
    id: 'game',
    label: 'Game Servers',
    note: "These plans aren't locked to one game. Pick the RAM you need and run whatever you want. We handle most titles that offer a dedicated server, including Minecraft, Rust, CS2, ARK, Valheim, FiveM, and Palworld. Don't see yours? Just ask. We can almost always run it.",
    groups: [
      {
        id: 'budget-game',
        label: 'Budget Game Servers',
        storageType: 'SATA SSD',
        description: 'Game servers on SATA SSD. We usually have you live the same day.',
        claim: { text: '10% under Sparked', icon: TrendingDown },
        plans: [
          { name: 'GAME-1', specs: ['4GB RAM', '2 vCores', '25GB SATA SSD'],   price: 3.60  },
          { name: 'GAME-2', specs: ['8GB RAM', '2 vCores', '50GB SATA SSD'],   price: 7.20, popular: true },
          { name: 'GAME-3', specs: ['16GB RAM', '3 vCores', '100GB SATA SSD'], price: 14.40 },
        ],
      },
      {
        id: 'premium-game',
        label: 'Premium Game Servers',
        storageType: 'NVMe',
        description: 'NVMe drives and Ryzen 9 cores for when the budget line is not enough.',
        claim: { text: '25% under Sparked', icon: TrendingDown },
        plans: [
          { name: 'P-GAME-1', specs: ['4GB RAM',  '3 vCores', '100GB NVMe'], price: 12.00 },
          { name: 'P-GAME-2', specs: ['8GB RAM',  '3 vCores', '100GB NVMe'], price: 24.00, popular: true },
          { name: 'P-GAME-3', specs: ['16GB RAM', '3 vCores', '100GB NVMe'], price: 48.00 },
        ],
      },
    ],
  },
]

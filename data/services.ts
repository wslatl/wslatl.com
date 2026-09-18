import type { ProductLineId } from '@/data/pricing'

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  /** Set for services with published plans; prices come from data/pricing.ts. */
  pricing?: ProductLineId
}

/**
 * The four things we host. VPS and game servers have published plans; the
 * other two are quoted per build. Keep claims here in line with the legal
 * pages (backup frequency in /backups, uptime targets in data/sla.ts).
 */
export const services: Service[] = [
  {
    id: 'vps',
    title: 'VPS hosting',
    description:
      'Isolated resources, full root access, and the flexibility to run whatever you need. A solid middle ground between shared and dedicated.',
    features: ['Full root and sudo access', 'Your choice of OS', 'SATA SSD or NVMe plans'],
    pricing: 'vps',
  },
  {
    id: 'game',
    title: 'Game server hosting',
    description:
      'Game servers with a clean control panel and zero headache. We keep it fast, we keep it online, and if something breaks we fix it.',
    features: ['Pterodactyl panel included', 'DDoS protection built in', 'Mod and plugin support'],
    pricing: 'game',
  },
  {
    id: 'dedicated',
    title: 'Dedicated servers',
    description:
      'Your own hardware and resources. Nobody sharing your CPU or RAM. Full root access, managed or unmanaged, and we are available if anything comes up.',
    features: ['No shared resources', 'NVMe SSD storage', 'IPMI and KVM remote access', 'Unmetered bandwidth options'],
  },
  {
    id: 'web',
    title: 'Web hosting',
    description:
      'Reliable hosting for websites and web apps, managed by us, with a real person to contact if things go sideways.',
    features: ['Free SSL certificates', 'cPanel with one-click app installs', 'Email hosting included', 'Monthly backups included'],
  },
]

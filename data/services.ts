import { siteConfig } from '@/config/site'

export interface Service {
  title: string
  badge: string
  description: string
  features: string[]
  ctaHref: string
}

export const services: Service[] = [
  {
    title: 'Dedicated Servers',
    badge: 'Most Popular',
    description:
      "Your own hardware and resources. Nobody sharing your CPU or RAM. Full root access, managed or unmanaged, and we are available if anything comes up.",
    features: [
      'Dedicated hardware with no shared resources',
      'NVMe SSD storage',
      'Unmetered bandwidth options',
      'IPMI and KVM remote access',
      'Managed or self managed',
    ],
    ctaHref: siteConfig.links.register,
  },
  {
    title: 'Game Hosting',
    badge: 'Pterodactyl Panel',
    description:
      'Game servers with a clean control panel and zero headache. We keep it fast, we keep it online, and if something breaks we fix it.',
    features: [
      'Minecraft, Rust, CS2, ARK, Valheim and more',
      'Pterodactyl panel included',
      'DDoS protection built in',
      'Mod and plugin support',
      'Fast setup, usually same day',
    ],
    ctaHref: siteConfig.links.register,
  },
  {
    title: 'VPS Hosting',
    badge: 'Scalable',
    description:
      'Isolated resources, full root access, and the flexibility to run whatever you need. A solid middle ground between shared and dedicated.',
    features: [
      'Full root and sudo access',
      'Your choice of OS',
      'Scalable CPU and RAM',
      'SSD backed storage',
      '99.9% uptime SLA',
    ],
    ctaHref: siteConfig.links.register,
  },
  {
    title: 'Web Hosting',
    badge: 'Managed',
    description:
      'Reliable hosting for websites and web apps, managed by us. Free SSL, daily backups, and someone to contact if things go sideways.',
    features: [
      'Free SSL certificates',
      'Daily automated backups',
      'Email hosting included',
      'One click app installs',
      'Personal support included',
    ],
    ctaHref: siteConfig.links.register,
  },
]

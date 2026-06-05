import type { ComponentType } from 'react'
import {
  ServerStackGlyph, ControllerGlyph, LayersGlyph, GlobeGlyph,
} from '@/components/brand/glyphs'
import { siteConfig } from '@/config/site'

export interface Service {
  title: string
  badge: string
  description: string
  features: string[]
  accent: string
  halo: string
  Glyph: ComponentType<{ className?: string }>
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
    accent: 'group-hover:border-blue-400/40',
    halo: 'from-blue-500/8 to-indigo-500/4',
    Glyph: ServerStackGlyph,
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
    accent: 'group-hover:border-purple-400/40',
    halo: 'from-purple-500/8 to-pink-500/4',
    Glyph: ControllerGlyph,
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
    accent: 'group-hover:border-cyan-400/40',
    halo: 'from-cyan-500/8 to-blue-500/4',
    Glyph: LayersGlyph,
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
    accent: 'group-hover:border-emerald-400/40',
    halo: 'from-emerald-500/8 to-teal-500/4',
    Glyph: GlobeGlyph,
    ctaHref: siteConfig.links.register,
  },
]

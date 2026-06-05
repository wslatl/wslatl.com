import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import {
  ServerStackGlyph,
  ControllerGlyph,
  LayersGlyph,
  GlobeGlyph,
} from '@/components/glyphs'
import { siteConfig } from '@/config/site'
import { Reveal, RevealGroup } from '@/components/reveal'

const services = [
  {
    Glyph: ServerStackGlyph,
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
  },
  {
    Glyph: ControllerGlyph,
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
  },
  {
    Glyph: LayersGlyph,
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
  },
  {
    Glyph: GlobeGlyph,
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
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              What We Offer
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              Everything hosted.{' '}
              <span className="font-serif italic font-normal text-foreground/90">Nothing outsourced.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              From raw dedicated hardware to game servers, all managed personally by our team.
            </p>
          </div>
        </Reveal>

        <RevealGroup as="div" className="grid md:grid-cols-2 gap-5" step={120}>
          {services.map((service, idx) => {
            const Glyph = service.Glyph
            return (
              <div
                key={idx}
                className={`group relative flex flex-col p-7 rounded-2xl border border-border/70 bg-gradient-to-br ${service.halo} ${service.accent} hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-5 relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                    <Glyph className="w-6 h-6 text-primary" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium uppercase tracking-[0.12em] border-border/80 text-muted-foreground bg-background/40"
                  >
                    {service.badge}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={siteConfig.links.register}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/70 font-semibold transition-colors mt-auto relative"
                >
                  Get started
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

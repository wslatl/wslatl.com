import { Lock, Server, Shield, Zap, Star } from 'lucide-react'
import Link from 'next/link'
import { SupportGlyph } from '@/components/glyphs'
import { siteConfig } from '@/config/site'
import { Reveal, RevealGroup } from '@/components/reveal'

const features = [
  {
    icon: Lock,
    title: 'We Are Picky For Good Reason',
    description:
      "We accept clients on an application basis. That is not gatekeeping. It is how we make sure we can actually serve everyone we take on.",
  },
  {
    icon: Server,
    title: 'Servers That Do Not Let You Down',
    description:
      'NVMe SSDs, high frequency CPUs, redundant network paths. Built to run hard without cutting corners.',
  },
  {
    icon: Shield,
    title: 'Stay Online When It Counts',
    description:
      'DDoS mitigation built in from the start. If something tries to knock you offline, we handle it.',
  },
  {
    icon: Zap,
    title: 'Actually Fast',
    description:
      'Low latency routing, an optimized stack, and hardware that does not throttle. Your milliseconds matter to us.',
  },
  {
    icon: Star,
    title: 'We Know the Inside of Hosting',
    description:
      "Our founders worked at hosting companies. We know where things go wrong and we built WSLATL to avoid all of it.",
  },
]

export function Features() {
  return (
    <section
      id="why-us"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-primary/[0.025] to-transparent"
    >
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Why WSLATL
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              The difference is{' '}
              <span className="font-serif italic font-normal text-foreground/90">personal.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We have seen how the big hosts operate. We built WSLATL to be the direct opposite.
            </p>
          </div>
        </Reveal>

        {/* Featured card */}
        <Reveal>
          <div className="mb-5">
            <div className="relative p-7 md:p-9 rounded-2xl border border-primary/25 bg-primary/[0.04] flex flex-col md:flex-row items-start gap-6 hover:border-primary/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center flex-shrink-0">
                <SupportGlyph className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3 tracking-tight">
                  You talk to a real person. Every time.
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
                  No bot wall. No scripted responses. Open a ticket in your billing portal, ping us
                  on Discord, or DM us directly. You will get a real response from someone who
                  actually knows what they are doing and cares about your server.
                </p>
                <Link
                  href={siteConfig.links.billing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/70 font-semibold transition-colors"
                >
                  Open a support ticket →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Remaining 5 cards */}
        <RevealGroup as="div" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" step={100}>
          {features.map((feature, idx) => {
            const Icon = feature.icon
            const num = String(idx + 1).padStart(2, '0')
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border border-border/70 bg-card/40 hover:bg-card/70 hover:border-primary/30 transition-all duration-300"
              >
                <span
                  aria-hidden
                  className="absolute top-4 right-4 font-serif italic text-xs text-muted-foreground/40"
                >
                  {num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center mb-4 group-hover:ring-primary/30 transition-all">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

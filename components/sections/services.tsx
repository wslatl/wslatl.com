import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealGroup } from '@/components/effects/reveal'
import { services } from '@/data/services'

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
                    <Glyph aria-hidden="true" className="w-6 h-6 text-primary" />
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
                      <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get started with ${service.title}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/70 font-semibold transition-colors mt-auto relative"
                >
                  Get started
                  <ChevronRight aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

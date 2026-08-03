import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Reveal, RevealGroup } from '@/components/effects/reveal'
import { services } from '@/data/services'

export function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              What We Offer
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              Servers, built{' '}
              <span className="font-serif italic font-normal text-foreground/90">the way we&apos;d want them.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Dedicated servers, VPS hosting, and game server hosting, all managed personally
              by our team.
            </p>
          </div>
        </Reveal>

        {/* A plain, hairline-divided list rather than a grid of matching
            icon-badge-bullets cards - the service names carry enough weight
            on their own, and four boxes trying to look identical is what
            makes a page feel templated. */}
        <RevealGroup
          as="div"
          className="max-w-4xl mx-auto divide-y divide-border/70 border-y border-border/70"
          step={100}
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group grid gap-3 py-9 sm:grid-cols-[13rem_1fr] sm:gap-8"
            >
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-primary/80">
                  {service.badge}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <p className="mt-3 text-sm text-foreground/70">
                  {service.features.join('  ·  ')}
                </p>
                <Link
                  href={service.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get started with ${service.title}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2 font-semibold transition-colors"
                >
                  Get started
                  <ChevronRight aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

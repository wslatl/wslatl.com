import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/effects/reveal'

export function PricingTeaser() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/30 p-10 md:p-14 text-center">
            <div
              aria-hidden
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            />

            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Pricing
            </p>
            <h2 className="text-balance text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              Straightforward plans.{' '}
              <span className="font-serif italic font-normal text-foreground/90">
                No renewal traps.
              </span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto mb-8">
              VPS, Game Servers, and Premium lines starting at $5.40/mo. The price you sign up
              at is the price you keep.
            </p>

            <div className="flex flex-col items-center gap-5">
              <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                Starting at <span className="text-primary">$5.40</span>
                <span className="text-base text-muted-foreground font-normal">/mo</span>
              </p>
              <Button
                asChild
                size="lg"
                className="gap-1.5 px-7 h-12 text-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-1 ring-white/5"
              >
                <Link href="/pricing">
                  View All Plans
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

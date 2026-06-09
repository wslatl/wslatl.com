import Link from 'next/link'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/effects/reveal'
import { reviewsSection } from '@/data/reviews'
import { siteConfig } from '@/config/site'

export function Reviews() {
  return (
    <section
      id="reviews"
      className="py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              {reviewsSection.eyebrow}
            </p>
            <h2
              id="reviews-heading"
              className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]"
            >
              {reviewsSection.titleLead}{' '}
              <span className="font-serif italic font-normal text-foreground/90">
                {reviewsSection.titleAccent}
              </span>
              {reviewsSection.titleTail}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {reviewsSection.subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative rounded-2xl border border-border/70 bg-card/40 p-8 md:p-10 text-center overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] to-transparent"
            />
            <div className="relative">
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-border/70 bg-background/40 text-xs font-medium text-muted-foreground"
              >
                <Star className="w-3.5 h-3.5 text-primary" aria-hidden />
                Reviews powered by Trustpilot
              </div>

              <p className="text-foreground/90 text-lg leading-relaxed mb-7 max-w-xl mx-auto">
                {reviewsSection.body}
              </p>

              <Link
                href={siteConfig.trustpilot.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
              >
                {reviewsSection.cta.label}
                <span aria-hidden>↗</span>
              </Link>

              <p className="mt-5 text-xs text-muted-foreground">
                {reviewsSection.ctaFootnote}{' '}
                <Link
                  href={reviewsSection.learnMoreHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  How Trustpilot works
                </Link>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { reviewsSection } from '@/data/reviews'
import { siteConfig } from '@/config/site'

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="shell">
      <div className="grid gap-8 rounded-2xl border bg-card/30 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div className="max-w-2xl">
          <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {reviewsSection.title}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{reviewsSection.body}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {reviewsSection.ask}{' '}
            <a
              href={reviewsSection.learnMoreHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              How Trustpilot works<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
        <Button asChild size="lg" className="h-auto min-h-11 justify-self-start py-2.5 text-center whitespace-normal">
          <a href={siteConfig.links.trustpilot} target="_blank" rel="noopener noreferrer">
            {reviewsSection.cta}
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      </div>
    </section>
  )
}

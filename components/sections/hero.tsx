import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { formatPrice, pricingHref, startingPrice } from '@/lib/pricing'

const entryPoints = [
  { label: 'VPS hosting', detail: `from ${formatPrice(startingPrice('vps'))}/mo`, href: pricingHref('vps') },
  { label: 'Game servers', detail: `from ${formatPrice(startingPrice('game'))}/mo`, href: pricingHref('game') },
  { label: 'Dedicated and web hosting', detail: 'Quoted for your build', href: '/#services' },
]

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="shell pt-16 pb-14 text-center md:pt-24 md:pb-20">
      <h1
        id="hero-heading"
        className="animate-rise mx-auto max-w-5xl text-[clamp(3rem,10vw,7.25rem)] leading-[0.95] font-bold tracking-[-0.04em] text-balance text-foreground"
      >
        Hosting that
        <br />
        <span className="gradient-text font-serif font-normal tracking-[-0.02em] italic">actually</span> gives a
        damn.
      </h1>

      <p
        className="animate-rise mx-auto mt-8 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
        style={{ animationDelay: '120ms' }}
      >
        We have worked inside hosting companies. We know what goes wrong. WSLATL exists to fix that:
        affordable VPS hosting, Minecraft and game server hosting, and dedicated servers, backed by a
        team that actually picks up.
      </p>

      <div
        className="animate-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        style={{ animationDelay: '220ms' }}
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
            Get started
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/pricing">See plans and pricing</Link>
        </Button>
      </div>

      <nav aria-label="Products" className="animate-rise mx-auto mt-14 max-w-3xl" style={{ animationDelay: '320ms' }}>
        <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border text-left sm:grid-cols-3">
          {entryPoints.map((entry) => (
            <li key={entry.label} className="bg-background">
              <Link
                href={entry.href}
                className="group flex h-full items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-card/60"
              >
                <span>
                  <span className="block text-sm font-semibold text-foreground">{entry.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground tabular-nums">{entry.detail}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localePath } from '@/i18n/config'
import { formatPrice, pricingHref, startingPrice } from '@/lib/pricing'

export function Hero() {
  const t = copy().home.hero
  const locale = getLocale()
  const path = (href: string) => localePath(locale, href)

  const entryPoints = [
    { label: t.entries.vps, detail: t.from(formatPrice(startingPrice('vps'))), href: path(pricingHref('vps')) },
    { label: t.entries.game, detail: t.from(formatPrice(startingPrice('game'))), href: path(pricingHref('game')) },
    { label: t.entries.other, detail: t.quoted, href: path('/#services') },
  ]

  return (
    <section aria-labelledby="hero-heading" className="shell pt-16 pb-14 text-center md:pt-24 md:pb-20">
      {/* The slogan paints immediately (it is the page's largest content);
          the supporting copy below rises in after it. */}
      <h1
        id="hero-heading"
        lang="en"
        className="mx-auto max-w-5xl text-[clamp(3rem,10vw,7.25rem)] leading-[0.95] font-bold tracking-[-0.04em] text-balance text-foreground"
      >
        {t.lineOne}
        <br />
        <span className="gradient-text font-serif font-normal tracking-[-0.02em] italic">{t.emphasis}</span>{' '}
        {t.lineTwo}
      </h1>

      <p
        className="animate-rise mx-auto mt-8 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
        style={{ animationDelay: '60ms' }}
      >
        {t.intro}
      </p>

      <div
        className="animate-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        style={{ animationDelay: '220ms' }}
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
            {copy().header.getStarted}
            <span className="sr-only">{copy().header.newTab}</span>
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href={path('/pricing')}>{t.seePlans}</Link>
        </Button>
      </div>

      <nav aria-label={t.products} className="animate-rise mx-auto mt-14 max-w-3xl" style={{ animationDelay: '320ms' }}>
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

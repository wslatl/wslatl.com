import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { CheckedNote, LiveStatusProvider, LocationStatus, type LiveState } from '@/components/sections/live-status'
import { shortLinks } from '@/config/links'
import { siteConfig } from '@/config/site'
import { locations, type Location } from '@/data/locations'
import type { ProductLineId } from '@/data/pricing'
import { localePath } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { formatPrice, pricingHref, startingPrice, tierStorageTypes } from '@/lib/pricing'
import { fill } from '@/lib/utils'

/**
 * The panel beside the slogan: each location, the hardware there, what its
 * plans start at, and its state on status.wslatl.com right now. Everything
 * but the states is in the prerendered page, from data/locations.ts and
 * data/pricing.ts. The states load afterwards (live-status.tsx), into room
 * kept for them. A plain bordered box, as data is on this site.
 *
 * `initial` is what the panel shows before the first answer: nothing, as the
 * prerendered page has it. Tests pass an answer to see the panel with one.
 */
export function LivePanel({ initial }: { initial?: LiveState }) {
  const t = copy().home.hero.live
  const locale = getLocale()

  return (
    <LiveStatusProvider initial={initial}>
      <section aria-labelledby="live-heading" className="max-w-xl rounded-2xl border bg-card/20">
        <h2 id="live-heading" className="border-b px-5 py-4 text-sm font-semibold text-foreground">
          {t.heading}
        </h2>
        <ul className="divide-y">
          {locations.map((location) => (
            <LocationRow key={location.id} location={location} />
          ))}
        </ul>
        <div className="flex items-start justify-between gap-4 border-t px-5 py-3.5 text-xs leading-5 text-muted-foreground">
          <CheckedNote locale={locale} labels={{ checkedAt: t.checkedAt, unavailable: t.unavailable }} />
          <a
            href={siteConfig.links.status}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1 font-medium text-link transition-colors hover:text-foreground"
          >
            {new URL(shortLinks.status.url).host}
            <span className="sr-only">{copy().header.newTab}</span>
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </section>
    </LiveStatusProvider>
  )
}

function LocationRow({ location }: { location: Location }) {
  const t = copy().home.hero.live
  const city = t.cities[location.id]
  const [storage] = tierStorageTypes(location.tier)
  const lines: { id: ProductLineId; label: string }[] = [
    { id: 'vps', label: t.vps },
    { id: 'game', label: t.game },
  ]

  return (
    <li className="px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-lg leading-6 font-semibold tracking-tight text-foreground">{city}</h3>
        <LocationStatus location={location.id} labels={t.states} />
      </div>
      <p className="mt-1 text-sm text-pretty text-muted-foreground">
        {fill(t.hardware, { tier: t.tiers[location.tier], cpu: location.cpu, storage })}
      </p>
      <ul className="mt-3 space-y-1">
        {lines.map((line) => (
          <li key={line.id}>
            <PriceLink line={line.id} label={line.label} price={startingPrice(line.id, location.tier)} />
          </li>
        ))}
      </ul>
    </li>
  )
}

/** One line's starting price at a location, as a link to that line's plans. The figure is mono, as money is. */
function PriceLink({ line, label, price }: { line: ProductLineId; label: string; price: number }) {
  const [before, after = ''] = copy().home.hero.live.fromPrice.split('{price}')

  return (
    <Link
      href={localePath(getLocale(), pricingHref(line))}
      className="group -mx-2 flex items-baseline justify-between gap-3 rounded-md px-2 py-1 transition-colors hover:bg-accent"
    >
      <span className="text-[0.9375rem] text-foreground">{label}</span>{' '}
      <span className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="text-xs text-muted-foreground">
          {before}
          <span className="font-mono text-base font-medium text-foreground tabular-nums">{formatPrice(price)}</span>
          {after}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 self-center text-muted-foreground transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-link"
        />
      </span>
    </Link>
  )
}

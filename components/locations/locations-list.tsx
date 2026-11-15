'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Flag } from '@/components/locations/flag'
import { LocationStatus } from '@/components/sections/live-status'
import type { Ownership } from '@/data/locations'
import type { PlanGroup, ProductLineId } from '@/data/pricing'
import type { LocationState } from '@/lib/live-status/snapshot'
import { matchesFilters, type ProductFilter, type TierFilter } from '@/lib/locations-filter'
import { cn, fill } from '@/lib/utils'
import { Button } from '@/platform/components/button'

/**
 * Every location on /hardware-and-locations, one block each. The server
 * prepares every word and number (components/locations/locations-directory
 * .tsx); this only lays them out, groups them by region when there is more
 * than one, and, from a set number of locations on, filters them by product
 * and tier. Filtering only hides blocks; the states come from the page's
 * live status (components/sections/live-status.tsx), into room kept for
 * them.
 */

export interface ProductView {
  id: ProductLineId
  label: string
  /** "from " and "/mo", the words around the price. */
  before: string
  after: string
  price: string
  href: string
  /** "DDoS protection built in", on the lines the site says it is on. */
  note: string | null
}

export interface LocationView {
  id: string
  city: string
  country: string
  countryCode: string
  region: string
  ownership: Ownership
  ownershipLabel: string
  tier: PlanGroup['tier']
  tierLabel: string
  specs: { label: string; value: string }[]
  products: ProductView[]
}

export interface RegionView {
  id: string
  name: string
}

export interface FilterLabels {
  label: string
  product: string
  tier: string
  all: string
  /** {shown} and {total}. */
  showing: string
  none: string
  reset: string
  products: { id: ProductLineId; label: string }[]
  tiers: { id: PlanGroup['tier']; label: string }[]
}

function LocationBlock({ view, headingLevel, stateLabels }: { view: LocationView; headingLevel: 2 | 3; stateLabels: Record<LocationState, string> }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const headingId = `location-${view.id}`

  return (
    <article aria-labelledby={headingId} data-location={view.id} className="flex h-full flex-col rounded-2xl border bg-card/20 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Heading id={headingId} className="text-lg leading-6 font-semibold tracking-tight text-foreground">
            {view.city}
          </Heading>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Flag country={view.countryCode} />
            {view.country}
          </p>
        </div>
        <LocationStatus location={view.id} labels={stateLabels} />
      </div>

      <p className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
        <span data-ownership={view.ownership} className="rounded-full border px-2.5 py-0.5 text-foreground">
          {view.ownershipLabel}
        </span>
        <span className="rounded-full border px-2.5 py-0.5 text-muted-foreground">{view.tierLabel}</span>
      </p>

      <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1.5 text-sm">
        {view.specs.map((spec) => (
          <div key={spec.label} className="contents">
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd className="text-foreground">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-5">
      <ul className="space-y-2 border-t pt-3">
        {view.products.map((product) => (
          <li key={product.id}>
            <Link
              href={product.href}
              className="group -mx-2 flex items-baseline justify-between gap-3 rounded-md px-2 py-1 transition-colors hover:bg-accent"
            >
              <span className="text-[0.9375rem] text-foreground">{product.label}</span>{' '}
              <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-xs text-muted-foreground">
                  {product.before}
                  <span className="font-mono text-base font-medium text-foreground tabular-nums">{product.price}</span>
                  {product.after}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 self-center text-muted-foreground transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-link"
                />
              </span>
            </Link>
            {product.note && (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-3.5" />
                {product.note}
              </p>
            )}
          </li>
        ))}
      </ul>
      </div>
    </article>
  )
}

/** One filter: a set of choices, of which one is picked, drawn as a row of toggles. */
function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  const name = useId()
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-2 w-full text-xs font-medium text-muted-foreground">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.id}
          className={cn(
            'cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
            value === option.id ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground hover:border-foreground/40 hover:text-foreground',
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}

export function LocationsList({
  views,
  regions,
  filters,
  stateLabels,
  initialProduct = 'all',
  initialTier = 'all',
}: {
  views: LocationView[]
  /** The regions in the order they come up. Grouped under their names when there is more than one. */
  regions: RegionView[]
  /** Only from filtersFrom locations on (lib/locations-filter.ts). */
  filters: FilterLabels | null
  stateLabels: Record<LocationState, string>
  /** The filters it starts with: everything, as the page has it. Tests start elsewhere. */
  initialProduct?: ProductFilter
  initialTier?: TierFilter
}) {
  const [product, setProduct] = useState<ProductFilter>(initialProduct)
  const [tier, setTier] = useState<TierFilter>(initialTier)
  const shown = views.filter((view) => matchesFilters({ products: view.products.map((p) => p.id), tier: view.tier }, product, tier))
  const grouped = regions.length > 1
  const grid = (list: LocationView[], headingLevel: 2 | 3) => (
    <ul className="grid gap-5 md:grid-cols-2">
      {list.map((view) => (
        <li key={view.id}>
          <LocationBlock view={view} headingLevel={headingLevel} stateLabels={stateLabels} />
        </li>
      ))}
    </ul>
  )

  return (
    <div>
      {filters && (
        <fieldset data-filters="" className="mb-8 flex min-w-0 flex-col gap-5 rounded-2xl border p-5 sm:flex-row sm:gap-10">
          <legend className="sr-only">{filters.label}</legend>
          <Choice
            legend={filters.product}
            options={[{ id: 'all' as ProductFilter, label: filters.all }, ...filters.products]}
            value={product}
            onChange={setProduct}
          />
          <Choice
            legend={filters.tier}
            options={[{ id: 'all' as TierFilter, label: filters.all }, ...filters.tiers]}
            value={tier}
            onChange={setTier}
          />
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- announced more reliably than <output>'s implicit role */}
          <p role="status" className="text-sm text-muted-foreground sm:ml-auto sm:self-end">
            {fill(filters.showing, { shown: shown.length, total: views.length })}
          </p>
        </fieldset>
      )}

      {shown.length === 0 && filters ? (
        <div className="rounded-2xl border p-8 text-center">
          <p className="text-foreground">{filters.none}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setProduct('all')
              setTier('all')
            }}
          >
            {filters.reset}
          </Button>
        </div>
      ) : grouped ? (
        <div className="space-y-12">
          {regions.map((region) => {
            const inRegion = shown.filter((view) => view.region === region.id)
            if (inRegion.length === 0) return null
            return (
              <section key={region.id} aria-labelledby={`region-${region.id}`}>
                <h2 id={`region-${region.id}`} className="mb-5 text-xl font-semibold tracking-tight text-foreground">
                  {region.name}
                </h2>
                {grid(inRegion, 3)}
              </section>
            )
          })}
        </div>
      ) : (
        grid(shown, 2)
      )}
    </div>
  )
}

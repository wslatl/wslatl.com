import { ArrowUpRight } from 'lucide-react'
import { LocationsList, type FilterLabels, type LocationView } from '@/components/locations/locations-list'
import { CheckedNote, LiveStatusProvider, type LiveState } from '@/components/sections/live-status'
import { shortLinks } from '@/config/links'
import { siteConfig } from '@/config/site'
import { locations, type Location } from '@/data/locations'
import { productLines, type PlanGroup, type ProductLineId } from '@/data/pricing'
import { localePath } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { filtersFrom } from '@/lib/locations-filter'
import { cityOf, countryName, productsAt, regionName, regionsOf, storageAt } from '@/lib/locations'
import { formatPrice, pricingHref, startingPrice } from '@/lib/pricing'
import { fill } from '@/lib/utils'

/**
 * Everything on /hardware-and-locations below its title: a line with the
 * live status's time and the status page, then one block per location
 * (locations-list.tsx). Every word and number is worked out here, on the
 * server, in the page's language, from data/locations.ts and
 * data/pricing.ts: nothing about a location is typed into the page.
 *
 * With today's two locations it is a short, calm page. With locations in
 * more than one region, they are grouped by region; from filtersFrom
 * locations on, filters by product and tier appear. `places` and `initial`
 * are for tests, as on the home page's panel.
 */
export function LocationsDirectory({ places = locations, initial }: { places?: readonly Location[]; initial?: LiveState }) {
  const t = copy()
  const live = t.home.hero.live
  const page = t.hardware
  const locale = getLocale()
  const [before, after = ''] = live.fromPrice.split('{price}')
  const productLabel: Record<ProductLineId, string> = { vps: live.vps, game: live.game }

  const views: LocationView[] = places.map((place) => ({
    id: place.id,
    city: cityOf(t, place),
    country: countryName(place.country, locale),
    countryCode: place.country,
    region: place.region,
    ownership: place.ownership,
    ownershipLabel: page.ownership[place.ownership],
    tier: place.tier,
    tierLabel: live.tiers[place.tier],
    // Only what the site states; a field it does not state is left out.
    specs: [
      { label: page.specs.cpu, value: place.hardware.cpu },
      ...(place.hardware.memory ? [{ label: page.specs.memory, value: place.hardware.memory }] : []),
      {
        label: page.specs.storage,
        value: place.hardware.raid ? fill(page.storageRaid, { storage: storageAt(place), raid: place.hardware.raid }) : storageAt(place),
      },
    ],
    products: productsAt(place).map((line) => ({
      id: line,
      label: productLabel[line],
      before,
      after,
      price: formatPrice(startingPrice(line, place.tier)),
      href: localePath(locale, pricingHref(line)),
      // The site says DDoS protection is built into game server plans, and
      // says nothing of it for VPS.
      note: line === 'game' ? page.ddos : null,
    })),
  }))

  const used = (line: ProductLineId) => places.some((place) => productsAt(place).includes(line))
  const tiers: PlanGroup['tier'][] = ['premium', 'budget']
  const filters: FilterLabels | null =
    places.length >= filtersFrom
      ? {
          ...page.filters,
          products: productLines.filter((line) => used(line.id)).map((line) => ({ id: line.id, label: productLabel[line.id] })),
          tiers: tiers.filter((tier) => places.some((place) => place.tier === tier)).map((tier) => ({ id: tier, label: live.tiers[tier] })),
        }
      : null

  return (
    <LiveStatusProvider ids={places.map((place) => place.id)} initial={initial}>
      <div className="mb-8 flex items-start justify-between gap-4 border-y py-3.5 text-xs leading-5 text-muted-foreground">
        <CheckedNote locale={locale} labels={{ checkedAt: live.checkedAt, unavailable: live.unavailable }} />
        <a
          href={siteConfig.links.status}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 font-medium text-link transition-colors hover:text-foreground"
        >
          {new URL(shortLinks.status.url).host}
          <span className="sr-only">{t.header.newTab}</span>
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
      <LocationsList
        views={views}
        regions={regionsOf(places).map((region) => ({ id: region, name: regionName(region, locale) }))}
        filters={filters}
        stateLabels={live.states}
      />
    </LiveStatusProvider>
  )
}

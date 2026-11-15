import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import { LocationsDirectory } from '@/components/locations/locations-directory'
import { LocationsList, type LocationView } from '@/components/locations/locations-list'
import { liveStateOf, type LiveState } from '@/components/sections/live-status'
import { footerColumns } from '@/data/footer'
import { legalPages } from '@/data/legal'
import { locations, type Location } from '@/data/locations'
import { localePath, locales, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { locationStates } from '@/lib/live-status/snapshot'
import { filtersFrom, matchesFilters } from '@/lib/locations-filter'
import { countryName, productsAt, regionName } from '@/lib/locations'
import { pageUrl } from '@/lib/metadata'
import { hardwareText } from '@/lib/page-text'
import { formatPrice, pricingHref, startingPrice } from '@/lib/pricing'
import { shareCardText } from '@/lib/share-card'
import { limits } from '../scripts/lib/seo-rules.mjs'
import { eightLocations } from './fixtures/locations'

/**
 * /hardware-and-locations: one block per location, with today's two and
 * with the eight-location fixture (six made up). Today it is a short, calm
 * page; with more regions it groups them; from filtersFrom locations on it
 * offers filters. Everything in a block comes from data/locations.ts and
 * data/pricing.ts, and the states load as on the home page.
 */
vi.mock('@/i18n/locale', () => {
  let current = 'en'
  return {
    setLocale: (locale: string) => {
      current = locale
    },
    getLocale: () => current,
  }
})

const path = '/hardware-and-locations'

function page(locale: Locale, places?: readonly Location[], initial?: LiveState): string {
  setLocale(locale)
  return renderToStaticMarkup(createElement(LocationsDirectory, { places, initial }))
}

const unescape = (html: string) =>
  html.replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')

/** Each location's block, by its id. */
function blocks(html: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const match of html.matchAll(/<article aria-labelledby="location-([a-z0-9-]+)"[^>]*>(.*?)<\/article>/g)) found.set(match[1], match[2])
  return found
}

/** Which of a block's state words shows. */
const shownState = (block: string) =>
  [...block.matchAll(/<span data-state="(\w+)" class="([^"]*)"/g)].filter(([, , classes]) => !classes.split(' ').includes('invisible')).map(([, state]) => state)

const cityOf = (locale: Locale, place: Location) => (copyFor(locale).home.hero.live.cities as Record<string, string>)[place.id] ?? place.statusGroup

describe('the page with today\'s locations', () => {
  for (const locale of locales) {
    it(`gives each location a block with all it should say (${locale})`, () => {
      const t = copyFor(locale)
      const html = unescape(page(locale))
      const found = blocks(html)
      expect([...found.keys()]).toEqual(locations.map((place) => place.id))
      for (const place of locations) {
        const block = found.get(place.id) ?? ''
        expect(block).toContain(`>${cityOf(locale, place)}</h2>`)
        expect(block).toContain(countryName(place.country, locale))
        expect(block).toMatch(new RegExp(`<svg [^>]*aria-hidden="true"[^>]*data-flag="${place.country}"`))
        expect(block).toContain(`>${t.hardware.ownership[place.ownership]}</span>`)
        expect(block).toContain(`>${t.home.hero.live.tiers[place.tier]}</span>`)
        expect(block).toContain(place.hardware.cpu)
        // Room for every state, none of them showing yet.
        expect(shownState(block)).toEqual([])
        expect([...block.matchAll(/data-state="/g)]).toHaveLength(locationStates.length)
        for (const line of productsAt(place)) {
          expect(block).toContain(`href="${localePath(locale, pricingHref(line))}"`)
          expect(block).toContain(formatPrice(startingPrice(line, place.tier)))
        }
        // DDoS protection, which the site states for game server plans only.
        expect(block.split(t.hardware.ddos)).toHaveLength(2)
        expect(block.indexOf(t.hardware.ddos)).toBeGreaterThan(block.indexOf(t.home.hero.live.game))
      }
    })
  }

  it('is a calm page: one region, so no region headings, and too few locations for filters', () => {
    const html = page('en')
    expect(locations.length).toBeLessThan(filtersFrom)
    expect(html).not.toContain('id="region-')
    expect(html).not.toContain('data-filters')
    expect(html).not.toContain('type="radio"')
  })

  it('says the hardware is rented, as all of it is today', () => {
    expect(locations.every((place) => place.ownership === 'rented')).toBe(true)
    expect(page('en').match(/data-ownership="rented"/g)).toHaveLength(locations.length)
  })

  it('shows each location\'s live state when it comes, and the time it was checked', () => {
    const html = page('pt', undefined, liveStateOf({ checkedAt: '2026-11-15T05:00:00.000Z', locations: { 'los-angeles': 'up', 'new-york': 'maintenance' } }))
    expect(shownState(blocks(html).get('los-angeles') ?? '')).toEqual(['up'])
    expect(shownState(blocks(html).get('new-york') ?? '')).toEqual(['maintenance'])
  })
})

describe('the page with the eight-location fixture', () => {
  it('groups the locations by region, in the order the regions come up', () => {
    const html = unescape(page('en', eightLocations))
    const regions = [...html.matchAll(/<h2 id="region-([a-z-]+)"[^>]*>([^<]+)<\/h2>/g)].map(([, id, name]) => [id, name])
    expect(regions).toEqual([
      ['north-america', regionName('north-america', 'en')],
      ['europe', regionName('europe', 'en')],
      ['asia', regionName('asia', 'en')],
    ])
    // Grouped, a location's name is a heading under its region's.
    for (const place of eightLocations) expect(html).toContain(`id="location-${place.id}" class="text-lg`)
    expect(html).not.toMatch(/<h2 id="location-/)
  })

  it('offers filters by product and tier, starting from all of them', () => {
    const t = copyFor('de')
    const html = unescape(page('de', eightLocations))
    expect(eightLocations.length).toBeGreaterThanOrEqual(filtersFrom)
    // One set of filters, named for screen readers by its legend.
    expect(html.match(/<fieldset data-filters=""/g)).toHaveLength(1)
    expect(html).toContain(`<legend class="sr-only">${t.hardware.filters.label}</legend>`)
    expect(html.match(/type="radio"/g)).toHaveLength(6)
    expect(html).toContain(`>${t.hardware.filters.showing.replace('{shown}', '8').replace('{total}', '8')}</p>`)
  })

  it('leaves out what a location does not run, and any hardware the site does not state', () => {
    const found = blocks(unescape(page('en', eightLocations)))
    const vpsOnly = eightLocations.find((place) => place.products?.join() === 'vps' && place.hardware.memory)
    const unstated = eightLocations.find((place) => !place.hardware.memory)
    expect(found.get(vpsOnly!.id)).not.toContain(copyFor('en').home.hero.live.game)
    expect(found.get(unstated!.id)).not.toContain(copyFor('en').hardware.specs.memory)
    expect(found.get(unstated!.id)).not.toContain('RAID')
  })

  it('labels owned hardware as owned', () => {
    const html = page('fr', eightLocations)
    const owned = eightLocations.filter((place) => place.ownership === 'owned')
    expect(owned.length).toBeGreaterThan(0)
    expect(html.match(/data-ownership="owned"/g)).toHaveLength(owned.length)
    expect(html).toContain(copyFor('fr').hardware.ownership.owned)
  })
})

/** What the filters look at in a location. */
const filterable = (products: ('vps' | 'game')[], tier: 'premium' | 'budget') => ({ products, tier })

/** A block's words, for a list drawn without the page around it. */
const view = (id: string, region: string, tier: 'premium' | 'budget', products: ('vps' | 'game')[]): LocationView => ({
  id,
  city: id,
  country: 'United States',
  countryCode: 'US',
  region,
  ownership: 'rented',
  ownershipLabel: 'Rented',
  tier,
  tierLabel: tier,
  specs: [],
  products: products.map((line) => ({ id: line, label: line, before: 'from ', after: '/mo', price: '$1.00', href: '/pricing', note: null })),
})

const labels = copyFor('en').hardware.filters

/** The list on its own, in English, starting from the filters given. */
const list = (views: LocationView[], initialProduct: 'all' | 'vps' | 'game', initialTier: 'all' | 'premium' | 'budget' = 'all') =>
  renderToStaticMarkup(
    createElement(LocationsList, {
      views,
      regions: [
        { id: 'north-america', name: 'North America' },
        { id: 'europe', name: 'Europe' },
      ],
      filters: {
        ...labels,
        products: [
          { id: 'vps', label: 'VPS' },
          { id: 'game', label: 'Game servers' },
        ],
        tiers: [
          { id: 'premium', label: 'Premium' },
          { id: 'budget', label: 'Budget' },
        ],
      },
      stateLabels: copyFor('en').home.hero.live.states,
      initialProduct,
      initialTier,
    }),
  )

describe('filtering', () => {
  it('keeps a location that runs the product and is in the tier, and nothing else', () => {
    expect(matchesFilters(filterable(['vps', 'game'], 'premium'), 'all', 'all')).toBe(true)
    expect(matchesFilters(filterable(['vps'], 'premium'), 'game', 'all')).toBe(false)
    expect(matchesFilters(filterable(['vps', 'game'], 'budget'), 'game', 'premium')).toBe(false)
    expect(matchesFilters(filterable(['game'], 'budget'), 'game', 'budget')).toBe(true)
  })

  it('hides what does not match, and a region with nothing left in it', () => {
    const views = [view('a', 'north-america', 'premium', ['vps', 'game']), view('b', 'europe', 'budget', ['vps'])]
    const html = list(views, 'game')
    expect(html).toContain('data-location="a"')
    expect(html).not.toContain('data-location="b"')
    expect(html).not.toContain('id="region-europe"')
    expect(html).toContain('>1 of 2 locations</p>')
  })

  it('says so, and offers to show every location, when nothing matches', () => {
    const html = list([view('a', 'north-america', 'premium', ['vps'])], 'game', 'budget')
    expect(html).toContain(labels.none)
    expect(html).toContain(`${labels.reset}</button>`)
    expect(html).not.toContain('data-location=')
  })
})

describe('the page in search results, share cards and links', () => {
  it('has a title and a description of its own in every language, within what search results show', () => {
    const seen = new Set<string>()
    for (const locale of locales) {
      const { title, description } = hardwareText(locale)
      expect(title.length, locale).toBeLessThanOrEqual(limits.title - ' | WSLATL'.length)
      expect(description.length, locale).toBeGreaterThanOrEqual(limits.descriptionMin)
      expect(description.length, locale).toBeLessThanOrEqual(limits.descriptionMax)
      seen.add(description)
    }
    expect(seen.size).toBe(locales.length)
  })

  it('is in the sitemap in every language, with every translation listed', () => {
    const entries = sitemap()
    for (const locale of locales) {
      const entry = entries.find((item) => item.url === pageUrl(locale, path))
      expect(entry, locale).toBeDefined()
      expect(Object.keys(entry?.alternates?.languages ?? {}).toSorted()).toEqual([...locales, 'x-default'].toSorted())
    }
  })

  it('has a share card in every language, in its own words', () => {
    for (const locale of locales) expect(shareCardText(path, locale)).toEqual(hardwareText(locale))
  })

  it('is linked from the footer and from /pricing in every language, and from the home panel\'s "+N more" row', () => {
    for (const locale of locales) {
      const links = footerColumns(copyFor(locale), locale, legalPages).flatMap((column) => column.links)
      expect(links.map((link) => link.href), locale).toContain(localePath(locale, path))
    }
    const pricing = readFileSync(join(__dirname, '..', 'app', '[locale]', 'pricing', 'page.tsx'), 'utf8')
    expect(pricing).toContain(`localePath(locale, '${path}')`)
    const panel = readFileSync(join(__dirname, '..', 'components', 'sections', 'live-panel.tsx'), 'utf8')
    expect(panel).toContain(`localePath(locale, '${path}')`)
  })
})

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Hero } from '@/components/sections/hero'
import { LivePanel } from '@/components/sections/live-panel'
import { checkTime, liveStateOf, type LiveState } from '@/components/sections/live-status'
import { siteConfig } from '@/config/site'
import { locations } from '@/data/locations'
import { localePath, locales, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { locationStates, unknownStatus, type LiveStatus } from '@/lib/live-status/snapshot'
import { formatPrice, pricingHref, startingPrice } from '@/lib/pricing'
import { fill } from '@/lib/utils'

/**
 * The first screen as the server sends it: the slogan, the sentence, the two
 * buttons, and the live panel, in every language. Rendered with no answer
 * yet (the prerendered page), with an answer, with part of one, and with
 * none at all. In every case the panel shows its locations and prices, and
 * keeps the same room for the states, so nothing moves when they arrive.
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

const checkedAt = '2026-11-14T21:03:37.000Z'
const live = (states: LiveStatus['locations']): LiveState => liveStateOf({ checkedAt, locations: states })

function hero(locale: Locale): string {
  setLocale(locale)
  return renderToStaticMarkup(createElement(Hero))
}

function panel(locale: Locale, initial?: LiveState): string {
  setLocale(locale)
  return renderToStaticMarkup(createElement(LivePanel, { initial }))
}

const unescape = (html: string) =>
  html.replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')

const literally = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The state words a location's slot holds, and which of them shows. */
function slot(html: string, location: string) {
  const start = html.indexOf(`data-live-status="${location}"`)
  expect(start, location).toBeGreaterThan(-1)
  // The slot's own variants are the first ones after it.
  const variants = [...html.slice(start).matchAll(/<span data-state="(\w+)" class="([^"]*)"/g)].slice(0, locationStates.length)
  return {
    states: variants.map(([, state]) => state),
    shown: variants.filter(([, , classes]) => !classes.split(' ').includes('invisible')).map(([, state]) => state),
  }
}

/** Whether a part with these classes shows, or only keeps its room. */
const shows = (classes: string) => !classes.split(' ').includes('invisible')

/** The note under the panel: what it shows, and the room it keeps. */
function note(html: string) {
  const match = /<span data-live-note="" class="grid">(<span class="([^"]*)">([^<]*)<\/span>)(<span class="([^"]*)">([^<]*)<\/span>)<\/span>/.exec(html)
  expect(match).not.toBeNull()
  const [, , unavailableClass, unavailable, , checkedClass, checked] = match!
  return {
    unavailable: unescape(unavailable),
    checked: unescape(checked),
    shown: [shows(unavailableClass) && 'unavailable', shows(checkedClass) && 'checked'].filter(Boolean),
  }
}

describe('the live panel before the states arrive, as the page is prerendered', () => {
  for (const locale of locales) {
    it(`shows every location with its hardware and prices, and no state yet (${locale})`, () => {
      const t = copyFor(locale).home.hero.live
      const html = unescape(panel(locale))
      expect(html).toContain(`>${t.heading}</h2>`)
      for (const location of locations) {
        expect(html).toContain(`>${t.cities[location.id]}</h3>`)
        expect(html).toContain(location.cpu)
        for (const line of ['vps', 'game'] as const) {
          // From data/pricing.ts, never typed into the panel.
          expect(html).toContain(formatPrice(startingPrice(line, location.tier)))
          expect(html).toContain(`href="${localePath(locale, pricingHref(line))}"`)
        }
        // Room for every state, none of them showing: nothing is claimed yet.
        expect(slot(html, location.id)).toEqual({ states: [...locationStates], shown: [] })
      }
      expect(note(html)).toEqual({ unavailable: t.unavailable, checked: '', shown: [] })
    })
  }

  it('links to the status page through its short link, in a new tab, saying so', () => {
    const html = unescape(panel('de'))
    expect(html).toMatch(
      new RegExp(
        `<a href="${literally(siteConfig.links.status)}" target="_blank" rel="noopener noreferrer"[^>]*>status\\.wslatl\\.com<span class="sr-only">${literally(copyFor('de').header.newTab)}</span>`,
      ),
    )
  })
})

describe('the live panel with the states', () => {
  for (const locale of locales) {
    it(`shows each location's state as a word, and when it was checked (${locale})`, () => {
      const t = copyFor(locale).home.hero.live
      const html = unescape(panel(locale, live({ 'los-angeles': 'up', 'new-york': 'partial' })))
      expect(slot(html, 'los-angeles')).toEqual({ states: [...locationStates], shown: ['up'] })
      expect(slot(html, 'new-york')).toEqual({ states: [...locationStates], shown: ['partial'] })
      expect(html).toContain(t.states.up)
      expect(html).toContain(t.states.partial)
      expect(note(html)).toEqual({
        unavailable: t.unavailable,
        checked: fill(t.checkedAt, { time: checkTime(checkedAt, locale) }),
        shown: ['checked'],
      })
    })
  }

  it('gives every state its badge: colour, icon and word', () => {
    const html = panel('en', live({ 'los-angeles': 'down', 'new-york': 'maintenance' }))
    expect(slot(html, 'los-angeles').shown).toEqual(['down'])
    expect(slot(html, 'new-york').shown).toEqual(['maintenance'])
    for (const [tone, word] of [['success', 'Operational'], ['warning', 'Partial outage'], ['danger', 'Down'], ['info', 'Maintenance']]) {
      expect(html).toMatch(new RegExp(`data-tone="${tone}"[^>]*><svg[^>]*aria-hidden="true"[^>]*>.*?</svg>${word}</span>`))
    }
  })

  it('says "No data" for a location with no state beside one that has a state', () => {
    const html = panel('en', live({ 'los-angeles': 'up', 'new-york': 'unknown' }))
    expect(slot(html, 'new-york').shown).toEqual(['unknown'])
    expect(html).toContain('No data')
    expect(note(html).shown).toEqual(['checked'])
  })
})

describe('the live panel with the data missing', () => {
  const missing: [string, LiveState][] = [
    ['no answer, a late one or a broken one', liveStateOf(null)],
    ['an answer with every location unknown', liveStateOf(unknownStatus())],
  ]

  for (const [what, state] of missing) {
    it(`keeps its locations and prices, shows no state and says why, for ${what}`, () => {
      expect(state).toEqual({ phase: 'missing' })
      for (const locale of locales) {
        const t = copyFor(locale).home.hero.live
        const html = unescape(panel(locale, state))
        for (const location of locations) {
          expect(slot(html, location.id), locale).toEqual({ states: [...locationStates], shown: [] })
          expect(html).toContain(formatPrice(startingPrice('vps', location.tier)))
        }
        expect(note(html), locale).toEqual({ unavailable: t.unavailable, checked: '', shown: ['unavailable'] })
      }
    })
  }
})

describe('the room kept for the states', () => {
  it('fits the time of a check within the room the "not available" line keeps, in every language', () => {
    // The note keeps the room of its longer line from the start. A time at
    // its widest must not need more, or the note would grow when it arrives.
    for (const locale of locales) {
      const t = copyFor(locale).home.hero.live
      const widest = checkTime('2026-11-14T22:58:00.000Z', locale).replace(/\d/g, '8')
      expect(fill(t.checkedAt, { time: widest }).length, locale).toBeLessThan(t.unavailable.length)
    }
  })
})

describe('the first screen', () => {
  it('has the slogan as its one h1, in English on every page, with its last two words kept together', () => {
    for (const locale of locales) {
      const html = hero(locale)
      const h1s = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/g)]
      expect(h1s, locale).toHaveLength(1)
      expect(h1s[0][0]).toContain('lang="en"')
      const text = h1s[0][1].replace(/<br\/>/g, ' ').replace(/<[^>]+>/g, '').replaceAll('&nbsp;', '\u00a0')
      expect(text, locale).toBe('Hosting that actually gives a\u00a0damn.')
    }
  })

  it('has one sentence and the two ways in, in the language of the page', () => {
    for (const locale of locales) {
      const t = copyFor(locale)
      const html = unescape(hero(locale))
      expect(html).toContain(`>${t.home.hero.intro}</p>`)
      expect(t.home.hero.intro.match(/[.!?](\s|$)/g), locale).toHaveLength(1)
      expect(html).toMatch(
        new RegExp(`<a[^>]*href="${literally(siteConfig.links.register)}" target="_blank" rel="noopener noreferrer"[^>]*>${literally(t.header.getStarted)}<span class="sr-only">`),
      )
      expect(html).toContain(`href="${localePath(locale, '/pricing')}"`)
      expect(html).toContain(`>${t.home.hero.seePlans}</a>`)
    }
  })

  it('holds nothing back: no entrance animation, and no gradient on the slogan', () => {
    const html = hero('en')
    expect(html).not.toMatch(/animate-|gradient-text|bg-linear|bg-gradient/)
    expect(html).not.toContain('style=')
  })

  it('has no em dash, en dash or middle dot, in any language', () => {
    // Built from parts so this file does not hold them itself.
    const marks = [0x2014, 0x2013, 0xb7].map((code) => String.fromCharCode(code))
    const entities = ['mdash;', 'ndash;', 'middot;'].map((name) => ['&', name].join(''))
    for (const locale of locales) {
      for (const html of [hero(locale), panel(locale, live({ 'los-angeles': 'up', 'new-york': 'down' }))]) {
        expect([...marks, ...entities].filter((mark) => html.includes(mark)), locale).toEqual([])
      }
    }
  })
})

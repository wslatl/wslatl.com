import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Hero } from '@/components/sections/hero'
import { LivePanel, shownInFull } from '@/components/sections/live-panel'
import { checkTime, liveStateOf, type LiveState } from '@/components/sections/live-status'
import { siteConfig } from '@/config/site'
import { locations, type Location } from '@/data/locations'
import { localePath, locales, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { locationStates, unknownStatus, type LiveStatus, type LocationState } from '@/lib/live-status/snapshot'
import { pluralOf, summarize, summaryText } from '@/lib/live-status/summary'
import { formatPrice, pricingHref, startingPrice } from '@/lib/pricing'
import { fill } from '@/lib/utils'
import { eightLocations, manyLocations } from './fixtures/locations'

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

function panel(locale: Locale, initial?: LiveState, places?: readonly Location[]): string {
  setLocale(locale)
  return renderToStaticMarkup(createElement(LivePanel, { initial, places }))
}

/** A location's name in a language. */
const cityOf = (locale: Locale, id: string) => (copyFor(locale).home.hero.live.cities as Record<string, string>)[id]

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
      // Today's two are both shown in full: nothing is counted or summed up.
      expect(html).not.toContain('data-live-summary')
      expect(html).not.toContain(`href="${localePath(locale, '/hardware-and-locations')}"`)
      for (const location of locations) {
        expect(html).toContain(`>${cityOf(locale, location.id)}</h3>`)
        expect(html).toContain(location.hardware.cpu)
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

/** The line beside the heading: which wording shows, and how many wordings keep its room. */
function summaryOf(html: string) {
  const start = html.indexOf('data-live-summary=""')
  expect(start).toBeGreaterThan(-1)
  const block = html.slice(start, html.indexOf('</div>', start))
  return {
    shown: /data-shown="(\w*)"/.exec(block)?.[1] ?? null,
    room: block.match(/aria-hidden="true" class="invisible col-start-1 row-start-1 flex h-6 items-center"/g)?.length ?? 0,
    block,
  }
}

/** The opening tags, in order: the panel's shape, whatever the words and numbers in it. */
const shape = (html: string) => (html.match(/<[a-z0-9]+/g) ?? []).join(' ')

/** The summary's wordings in a language. */
const summaryLabels = (locale: Locale) => copyFor(locale).home.hero.live.summary

describe('the live panel with many locations', () => {
  // Eight locations, six of them made up (tests/fixtures/locations.ts).
  const ids = eightLocations.map((location) => location.id)
  const states = (each: (id: string) => LocationState) => Object.fromEntries(ids.map((id) => [id, each(id)]))
  const allUp = states(() => 'up')

  for (const locale of locales) {
    it(`shows the first ${shownInFull} in full, and counts the rest in one row that leads to every location (${locale})`, () => {
      const t = copyFor(locale).home.hero.live
      const html = unescape(panel(locale, undefined, eightLocations))
      expect(html.match(/<h3\b/g)).toHaveLength(shownInFull)
      for (const location of eightLocations.slice(0, shownInFull)) expect(html).toContain(`>${cityOf(locale, location.id)}</h3>`)
      // The made-up six are counted, never named or drawn.
      for (const id of ids.slice(shownInFull)) expect(html).not.toContain(`data-live-status="${id}"`)
      expect(html).toMatch(new RegExp(`<a [^>]*href="${literally(localePath(locale, '/hardware-and-locations'))}"`))
      expect(html).toContain(`<span>${fill(pluralOf(t.more, 6, locale), { count: 6 })}</span>`)
    })
  }

  it('keeps one size and shape from three locations to twenty', () => {
    const shapes = [3, 8, 20].map((count) => {
      const places = manyLocations(count)
      return shape(panel('en', live(Object.fromEntries(places.map((place) => [place.id, 'up' as const]))), places))
    })
    expect(new Set(shapes).size).toBe(1)
    // Today's two have no row to count the rest, and no line to sum them up.
    expect(shape(panel('en', live(allUp), manyLocations(2)))).not.toBe(shapes[0])
  })

  it('sums up every location beside the heading, the ones not shown included', () => {
    const cases: [string, Record<string, LocationState>, string | null, string | null][] = [
      ['all up', allUp, 'allUp', 'All 8 operational'],
      ['one not shown with a partial outage', states((id) => (id === 'fixture-5' ? 'partial' : 'up')), 'issues', '1 of 8 has issues'],
      ['two not shown down', states((id) => (id === 'fixture-4' || id === 'fixture-8' ? 'down' : 'up')), 'issues', '2 of 8 have issues'],
      ['one in maintenance', states((id) => (id === 'fixture-7' ? 'maintenance' : 'up')), 'maintenance', '1 of 8 in maintenance'],
      ['two with no state', states((id) => (id === 'fixture-3' || id === 'fixture-6' ? 'unknown' : 'up')), 'someUp', '6 of 8 operational'],
    ]
    for (const [what, given, kind, words] of cases) {
      const html = panel('en', live(given), eightLocations)
      const summary = summaryOf(html)
      expect(summary.shown, what).toBe(kind)
      expect(summary.block, what).toContain(`${words}</span>`)
      expect(summary.room, what).toBe(4)
    }
    // The two shown keep their own badges whatever the rest are doing.
    const html = panel('en', live(states((id) => (id === 'fixture-5' ? 'down' : 'up'))), eightLocations)
    expect(slot(html, 'los-angeles').shown).toEqual(['up'])
    expect(summaryOf(html).block).toMatch(/data-tone="danger"/)
  })

  it('says nothing beside the heading until there is a state, and nothing when there is none, keeping its room', () => {
    for (const state of [undefined, liveStateOf(null), liveStateOf(unknownStatus(eightLocations))]) {
      const html = panel('pt', state, eightLocations)
      expect(summaryOf(html)).toMatchObject({ shown: '', room: 4 })
    }
  })

  it('keeps the room of its widest wording, every count at its largest', () => {
    for (const locale of locales) {
      const t = copyFor(locale).home.hero.live
      const { block } = summaryOf(unescape(panel(locale, undefined, eightLocations)))
      expect(block).toContain(fill(t.summary.allUp, { total: 8 }))
      expect(block).toContain(fill(pluralOf(t.summary.issues, 8, locale), { count: 8, total: 8 }))
      expect(block).toContain(fill(pluralOf(t.summary.maintenance, 8, locale), { count: 8, total: 8 }))
      expect(block).toContain(fill(pluralOf(t.summary.someUp, 8, locale), { count: 8, total: 8 }))
    }
  })
})

describe('summing up the locations', () => {
  it('only says all are operational when every one is known to be', () => {
    expect(summarize(['up', 'up', 'up'])).toEqual({ kind: 'allUp', total: 3 })
    expect(summarize(['up', 'up', 'unknown'])).toEqual({ kind: 'someUp', count: 2, total: 3 })
    expect(summarize(['unknown', 'unknown', 'unknown'])).toBeNull()
  })

  it('puts problems first, with the colour of the worst, then maintenance', () => {
    expect(summarize(['up', 'partial', 'maintenance'])).toEqual({ kind: 'issues', count: 1, total: 3, tone: 'warning' })
    expect(summarize(['down', 'partial', 'up'])).toEqual({ kind: 'issues', count: 2, total: 3, tone: 'danger' })
    expect(summarize(['maintenance', 'up', 'unknown'])).toEqual({ kind: 'maintenance', count: 1, total: 3 })
  })

  it('says one and more each language\'s own way', () => {
    expect(summaryText({ kind: 'issues', count: 1, total: 8, tone: 'warning' }, summaryLabels('en'), 'en')).toBe('1 of 8 has issues')
    expect(summaryText({ kind: 'issues', count: 3, total: 8, tone: 'warning' }, summaryLabels('en'), 'en')).toBe('3 of 8 have issues')
    expect(summaryText({ kind: 'issues', count: 1, total: 8, tone: 'warning' }, summaryLabels('fr'), 'fr')).toBe('1 sur 8 a des problèmes')
    expect(summaryText({ kind: 'issues', count: 2, total: 8, tone: 'warning' }, summaryLabels('fr'), 'fr')).toBe('2 sur 8 ont des problèmes')
    expect(summaryText({ kind: 'someUp', count: 1, total: 8 }, summaryLabels('pt'), 'pt')).toBe('1 de 8 operacional')
    expect(summaryText({ kind: 'someUp', count: 6, total: 8 }, summaryLabels('pt'), 'pt')).toBe('6 de 8 operacionais')
    expect(summaryText({ kind: 'allUp', total: 8 }, summaryLabels('de'), 'de')).toBe('Alle 8 betriebsbereit')
    expect(fill(pluralOf(copyFor('es').home.hero.live.more, 1, 'es'), { count: 1 })).toBe('+1 ubicación más')
    expect(fill(pluralOf(copyFor('es').home.hero.live.more, 6, 'es'), { count: 6 })).toBe('+6 ubicaciones más')
  })
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
      // The words as written, with only the line break and the serif word
      // between them, and "actually" in the blue gradient with the very
      // classes the home page on main gives it.
      expect(h1s[0][1], locale).toMatch(
        /^Hosting that<br\/><span class="gradient-text font-serif font-normal tracking-\[-0\.02em\] italic">actually<\/span> gives a\u00a0damn\.$/,
      )
    }
  })

  it('keeps the gradient on "actually" in the stylesheet, as main has it', () => {
    const css = readFileSync(join(__dirname, '..', 'app', 'globals.css'), 'utf8')
    const rule = /\.gradient-text \{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(rule).toContain('background: linear-gradient(135deg, oklch(0.78 0.16 235) 0%, oklch(0.6 0.22 268) 100%);')
    expect(rule).toContain('background-clip: text;')
    expect(rule).toContain('-webkit-text-fill-color: transparent;')
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

  it('holds nothing back: no entrance animation, and no gradient but the one on "actually"', () => {
    const html = hero('en')
    expect(html).not.toMatch(/animate-|bg-linear|bg-gradient/)
    expect(html.match(/gradient-text/g)).toHaveLength(1)
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

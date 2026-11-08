import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Clients } from '@/components/sections/clients'
import { Partners } from '@/components/sections/partners'
import { clients, type Client } from '@/data/clients'
import { partners, type Partner } from '@/data/partners'
import { locales } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { clientStrip, stripName } from '@/lib/clients'
import { homePartners } from '@/lib/partners'
import { examplePartner } from './fixtures/partners'

/**
 * The home page shows partners in two places, with no step of their own when
 * one is added to data/partners.ts: the trusted clients strip (lib/clients.ts)
 * and the partners section (components/sections/partners.tsx).
 */

const client = (name: string, partner?: string): Client => ({
  name,
  logo: `/clients/${name.toLowerCase()}.webp`,
  width: 300,
  height: 96,
  heightClass: 'h-7 sm:h-10',
  ...(partner ? { partner } : {}),
})
const partner = (slug: string, change: Partial<Partner> = {}): Partner => ({
  ...examplePartner,
  slug,
  name: slug.toUpperCase(),
  ...change,
})

const names = (list: ReturnType<typeof clientStrip>) => list.map(stripName)

describe('the trusted clients strip', () => {
  it('holds every client, and every partner who is not one of them', () => {
    const strip = clientStrip()
    const linked = new Set(clients.map((entry) => entry.partner))
    expect(names(strip).toSorted()).toEqual(
      [...clients.map((entry) => entry.name), ...partners.filter((entry) => !linked.has(entry.slug)).map((entry) => entry.name)].toSorted(),
    )
  })

  it('names only real partners as the partner a client also is', () => {
    const slugs = new Set(partners.map((entry) => entry.slug))
    expect(clients.filter((entry) => entry.partner !== undefined && !slugs.has(entry.partner))).toEqual([])
  })

  it('takes a new partner in by itself, and shows a client who is also a partner once, with their logo', () => {
    const strip = clientStrip([client('Acme'), client('Both', 'both')], [partner('both'), partner('new')])
    expect(strip.map((entry) => `${entry.kind}:${stripName(entry)}`)).toEqual(['client:Acme', 'partner:NEW', 'client:Both'])
  })

  it('lets clients and partners take turns, and keeps the featured partners first', () => {
    const strip = clientStrip(
      [client('A'), client('B')],
      [partner('one'), partner('two'), partner('three', { featured: true }), partner('four')],
    )
    expect(names(strip)).toEqual(['A', 'THREE', 'B', 'ONE', 'TWO', 'FOUR'])
  })

  it('shows each partner on the page as their picture and name, and lists every name for screen readers', () => {
    const html = renderToStaticMarkup(createElement(Clients))
    for (const entry of clientStrip()) expect(html).toContain(`<li>${stripName(entry)}</li>`)
    // The small copy, never the full picture. Under the tests the picture's
    // address is encoded into /_next/image; the site serves it as it is.
    const pictured = partners.filter((each) => each.avatar && !clients.some((c) => c.partner === each.slug))
    expect(pictured.length).toBeGreaterThan(0)
    for (const entry of pictured) expect(html).toContain(encodeURIComponent(`/partners/${entry.slug}/avatar-strip.webp`))
  })

  it('says it is clients and partners in every language', () => {
    const words: Record<string, RegExp> = {
      en: /partners/,
      es: /socios/,
      // "Ils nous font confiance": they trust us, whoever they are.
      fr: /^Ils nous font confiance$/,
      de: /Partner/,
      pt: /parceiros/,
    }
    for (const locale of locales) expect(copyFor(locale).home.clients.heading, locale).toMatch(words[locale])
  })
})

describe('the partners on the home page', () => {
  it('are the featured ones first, then the newest, three at most', () => {
    const list = [
      partner('oldest', { since: '2026-08' }),
      partner('starred', { since: '2026-08', featured: true }),
      partner('september', { since: '2026-09' }),
      partner('october-first', { since: '2026-10' }),
      partner('october-later', { since: '2026-10' }),
    ]
    expect(homePartners(list).map((entry) => entry.slug)).toEqual(['starred', 'october-later', 'october-first'])
    expect(homePartners(list, 5).map((entry) => entry.slug)).toEqual([
      'starred',
      'october-later',
      'october-first',
      'september',
      'oldest',
    ])
    expect(homePartners([])).toEqual([])
  })

  it('show as cards under the section heading, with a link to all of them', () => {
    const html = renderToStaticMarkup(createElement(Partners))
    const shown = homePartners(partners)
    expect(shown.length).toBeGreaterThan(0)
    for (const entry of shown) expect(html).toContain(`<h3 id="partner-${entry.slug}"`)
    expect(html).not.toContain('<h2 id="partner-')
    expect(html).toContain('href="/partners"')
    expect(html).toContain(`See all ${partners.length} partners`)
  })
})

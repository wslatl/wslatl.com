import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ShareAd } from '@/components/share/share-ad'
import { commitments, features, leadFeature } from '@/data/features'
import { services } from '@/data/services'
import { games } from '@/data/games'
import { partners, type Partner } from '@/data/partners'
import { productLines } from '@/data/pricing'
import { locales, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import {
  absoluteUrl,
  discordLimit,
  gameAd,
  gamesIndexAd,
  homeAd,
  partnerAd,
  partnersIndexAd,
  plain,
  productLineAd,
  shareLabels,
  whyLines,
} from '@/lib/share'

const root = join(__dirname, '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const ctx = (locale: Locale) => ({ t: copyFor(locale), locale })
const vps = productLines.find((line) => line.id === 'vps')!
const gameLine = productLines.find((line) => line.id === 'game')!

const site = { commitments, lead: leadFeature, features, services, games }
const why = whyLines(site)

const withCode: Partner = {
  slug: 'with-code',
  name: 'With Code',
  tagline: 'Streams every night.',
  description: 'x',
  referralCode: 'WITHCODE10',
  since: '2026-10',
  games: ['minecraft'],
  socials: { discord: 'https://discord.gg/abc', website: 'https://example.com' },
}
const noCode: Partner = { ...withCode, slug: 'plain', name: 'Plain Partner', referralCode: undefined }

/** Every ad the site can build, in every language, with the address it should end on. */
function everyAd(): { name: string; locale: Locale; url: string; text: string }[] {
  return locales.flatMap((locale) => {
    const c = ctx(locale)
    return [
      { name: 'home', url: absoluteUrl(locale, '/'), text: homeAd(c, site) },
      { name: 'games index', url: absoluteUrl(locale, '/games'), text: gamesIndexAd(c, games) },
      { name: 'partners index', url: absoluteUrl(locale, '/partners'), text: partnersIndexAd(c) },
      ...partners.map((p) => ({
        name: `partner ${p.slug}`,
        url: absoluteUrl(locale, `/partners/${p.slug}`),
        text: partnerAd(c, p),
      })),
      ...games.map((g) => ({
        name: `game ${g.slug}`,
        url: absoluteUrl(locale, `/games/${g.slug}`),
        text: gameAd(c, g, gameLine.included, why),
      })),
      ...productLines.map((line) => ({
        name: `line ${line.id}`,
        url: absoluteUrl(locale, `/pricing#${line.anchor}`),
        text: productLineAd(c, line, why),
      })),
    ].map((ad) => ({ ...ad, locale }))
  })
}

describe('every ad', () => {
  const ads = everyAd()

  it('covers the home page, the games, the partners and the plan lines in every language', () => {
    expect(ads.length).toBeGreaterThanOrEqual(locales.length * (3 + games.length + productLines.length))
  })

  it('stays under the Discord message limit', () => {
    const over = ads.filter((ad) => ad.text.length > discordLimit).map((ad) => `${ad.locale} ${ad.name}`)
    expect(over).toEqual([])
  })

  it('ends with its own page address on a line of its own', () => {
    for (const ad of ads) {
      const lines = ad.text.split('\n')
      expect(lines.at(-1), `${ad.locale} ${ad.name}`).toBe(ad.url)
      expect(new URL(ad.url).origin).toBe('https://wslatl.com')
      expect(lines.at(-2)).toBe('')
    }
  })

  it('opens with a heading and has no mention syntax', () => {
    for (const ad of ads) {
      expect(ad.text.startsWith('## '), `${ad.locale} ${ad.name}`).toBe(true)
      expect(ad.text).not.toMatch(/@everyone|@here/i)
      expect(ad.text).not.toMatch(/<[@#&!:]/)
    }
  })

  it('has no em dash, en dash or middle dot', () => {
    // Built from code points so this file does not trip the house-style check itself.
    const dashes = new RegExp(`[${String.fromCharCode(0x2014, 0x2013, 0xb7)}]`)
    for (const ad of ads) expect(ad.text).not.toMatch(dashes)
  })

  it('previews only its own page: other addresses are wrapped in angle brackets', () => {
    for (const ad of ads) {
      const bare = ad.text.split('\n').filter((line) => /https?:\/\//.test(line) && !/<https?:\/\/[^>]+>/.test(line))
      expect(bare, `${ad.locale} ${ad.name}`).toEqual([ad.url])
    }
  })
})

describe('home ad', () => {
  it('says what WSLATL is, with prices from the data and the home address', () => {
    const text = homeAd(ctx('en'), site)
    expect(text).toContain('## WSLATL: Hosting that actually gives a damn.')
    expect(text).toContain('### What we offer')
    expect(text).toContain('### Why WSLATL')
    expect(text).toContain('### Get started')
    expect(text).toContain('**Game server hosting**, from $')
    expect(text).toContain('Minecraft')
    expect(text).toContain('<https://wslatl.com/games>')
    expect(text).toContain('<https://wslatl.com/partners>')
    expect(text).toContain(leadFeature.title)
    expect(text.endsWith('\nhttps://wslatl.com/')).toBe(true)
  })

  it('follows the language of the page', () => {
    const text = homeAd(ctx('de'), site)
    expect(text).toContain('### Was wir bieten')
    expect(text.endsWith('\nhttps://wslatl.com/de')).toBe(true)
  })
})

describe('main ad', () => {
  it('is a full promo post: at least 700 characters and under the Discord limit, in every language', () => {
    for (const locale of locales) {
      const { length } = homeAd(ctx(locale), site)
      expect(length, locale).toBeGreaterThanOrEqual(700)
      expect(length, locale).toBeLessThan(2000)
    }
  })
})

describe('product ads', () => {
  it('end with a short why-WSLATL block', () => {
    const minecraft = games.find((game) => game.slug === 'minecraft')!
    for (const text of [gameAd(ctx('en'), minecraft, gameLine.included, why), productLineAd(ctx('en'), vps, why)]) {
      expect(text).toContain('**Why WSLATL**')
      expect(text).toContain(leadFeature.title)
    }
  })
})

describe('partner ad', () => {
  it('has the code and the first-invoice discount when the partner has a code', () => {
    const text = partnerAd(ctx('en'), withCode, ['Minecraft'])
    expect(text).toContain('## With Code')
    expect(text).toContain('Streams every night.')
    expect(text).toContain('Referral code: `WITHCODE10`')
    expect(text).toContain('10% off the first invoice for your hosting, except dedicated servers')
    expect(text).toContain('Games: Minecraft')
    expect(text).toContain('- Discord: <https://discord.gg/abc>')
    expect(text.endsWith('\nhttps://wslatl.com/partners/with-code')).toBe(true)
  })

  it('says nothing about a code or a discount when the partner has none', () => {
    const text = partnerAd(ctx('en'), noCode)
    expect(text).not.toMatch(/code|discount|% off/i)
    expect(text).toContain('## Plain Partner')
  })

  it('never promises a discount past the first invoice', () => {
    for (const locale of locales) {
      const text = partnerAd(ctx(locale), withCode)
      expect(text).toContain('10')
      expect(text).not.toMatch(/every invoice|each invoice|renewal/i)
    }
  })

  it("defuses mentions, markup and angle brackets in a partner's own words", () => {
    const evil: Partner = { ...withCode, name: '@everyone <@123> *Bold*', tagline: 'hey @here <#5> _x_' }
    const text = partnerAd(ctx('en'), evil)
    expect(text).not.toMatch(/@everyone|@here|<@|<#/i)
    expect(plain('# a')).toBe('\\# a')
  })

  it('leaves no way around the escaping', () => {
    // Doubled @, a marker behind spaces, a masked link, a numbered list.
    expect(plain('@@everyone and @@@here')).not.toMatch(/@(everyone|here)/i)
    expect(plain('   # Heading')).toBe('\\# Heading')
    expect(plain('[click](https://example.com)')).toBe('\\[click\\](https://example.com)')
    expect(plain('1. first')).toBe('1\\. first')
  })

  it('follows the language of the page', () => {
    expect(partnerAd(ctx('de'), withCode)).toContain('Empfehlungscode: `WITHCODE10`')
    expect(partnerAd(ctx('es'), withCode)).toContain('Código de referido')
    expect(partnerAd(ctx('fr'), withCode)).toContain('Code de parrainage')
    expect(partnerAd(ctx('pt'), withCode)).toContain('Código de indicação')
    expect(partnerAd(ctx('pt'), withCode)).toContain('https://wslatl.com/pt/partners/with-code')
  })
})

describe('game ad', () => {
  const minecraft = games.find((game) => game.slug === 'minecraft')!

  it('has the page heading, tagline, a price the page shows, the RAM rows and the page address', () => {
    const text = gameAd(ctx('en'), minecraft, gameLine.included, why)
    expect(text).toContain('## Minecraft server hosting')
    expect(text).toContain(minecraft.tagline)
    expect(text).toMatch(/Hosting from \$\d+\.\d\d\/mo/)
    for (const row of minecraft.recommendedRam) expect(text).toContain(`- ${row.players}: ${row.ram}`)
    expect(text.endsWith('\nhttps://wslatl.com/games/minecraft')).toBe(true)
  })

  it('follows the language of the page', () => {
    const text = gameAd(ctx('de'), minecraft, gameLine.included, why)
    expect(text).toContain('Hosting ab $')
    expect(text.endsWith('\nhttps://wslatl.com/de/games/minecraft')).toBe(true)
  })
})

describe('VPS ad', () => {
  it('lists each group with its starting price and points at the VPS plans', () => {
    const text = productLineAd(ctx('en'), vps, why)
    expect(text).toContain('## VPS hosting')
    for (const group of vps.groups) {
      const lowest = Math.min(...group.plans.map((plan) => plan.price))
      expect(text).toContain(`- ${group.label}: ${group.storageType}, from $${lowest.toFixed(2)}/mo`)
    }
    expect(text.endsWith('\nhttps://wslatl.com/pricing#vps')).toBe(true)
    expect(productLineAd(ctx('fr'), vps).endsWith('\nhttps://wslatl.com/fr/pricing#vps')).toBe(true)
  })

  it('drops extras rather than the address when an ad would be too long', () => {
    const long = { ...vps, included: Array.from({ length: 200 }, (_, i) => `Included thing number ${i}`) }
    const text = productLineAd(ctx('en'), long)
    expect(text.length).toBeLessThanOrEqual(discordLimit)
    expect(text.endsWith('\nhttps://wslatl.com/pricing#vps')).toBe(true)
  })
})

describe('the button', () => {
  const labels = shareLabels(copyFor('en'))
  const html = renderToStaticMarkup(createElement(ShareAd, { text: '## Hi\n\nhttps://wslatl.com/', labels }))

  it('renders copy and preview buttons, a status message for screen readers and the exact text in the preview', () => {
    expect(html).toContain('Copy Discord ad')
    expect(html).toContain('Preview')
    expect(html).toContain('role="status"')
    expect(html).toContain('<dialog')
    expect(html).toContain('## Hi')
  })

  it('has a label in every language', () => {
    for (const locale of locales) {
      const l = shareLabels(copyFor(locale))
      for (const value of Object.values(l)) expect(value.length).toBeGreaterThan(0)
      expect(l.copy).toBe(copyFor(locale).share.copyAd)
    }
  })
})

describe('where the buttons are', () => {
  it.each([
    ['components/layout/footer.tsx', 'ShareSiteAd'],
    ['components/partners/partner-profile.tsx', 'SharePartnerAd'],
    ['components/partners/partner-card.tsx', 'SharePartnerAd'],
    ['components/partners/become-partner.tsx', 'SharePartnersIndexAd'],
    ['app/[locale]/games/page.tsx', 'ShareGamesIndexAd'],
    ['app/[locale]/games/[slug]/page.tsx', 'ShareGameAd'],
    ['app/[locale]/pricing/page.tsx', 'ShareLineAd'],
  ])('%s uses %s', (file, component) => {
    expect(read(file)).toContain(`<${component}`)
  })
})

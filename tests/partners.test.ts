import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { generateMetadata as partnersPageMetadata } from '@/app/[locale]/partners/page'
import sitemap from '@/app/sitemap'
import { PartnerCard, ghostAloneAt, ghostItemClass } from '@/components/partners/partner-card'
import { PartnerProfile } from '@/components/partners/partner-profile'
import { PartnerShowcase } from '@/components/partners/partner-showcase'
import { isShortLink, shortLinks } from '@/config/links'
import { referralDiscountPercent } from '@/config/referral'
import { siteConfig } from '@/config/site'
import { footerColumns } from '@/data/footer'
import { games } from '@/data/games'
import { legalPages } from '@/data/legal'
import { mainNav } from '@/data/nav'
import { partners, socialPlatformIds, type Partner } from '@/data/partners'
import { defaultLocale, locales } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { en } from '@/i18n/copy/en'
import {
  hasReferralCode,
  orderedPartners,
  partnerMetaDescription,
  partnerProblems,
  partnersPageText,
  partnerText,
  partnerTextLang,
  referralDiscount,
  referralSignupUrl,
  socialLinkProblem,
  socialLinks,
  type PartnerCheckContext,
} from '@/lib/partners'
import { examplePartner, exampleImages, partnerWithoutCode } from './fixtures/partners'
import { imageSize } from './image-size'

// The /partners page module is imported for its metadata. Its header and
// footer are not under test here, and the footer's email addresses are
// server-only, which only a Next.js build can load.
vi.mock('@/components/layout/site-header', () => ({ SiteHeader: () => null }))
vi.mock('@/components/layout/footer', () => ({ Footer: () => null }))

const root = join(__dirname, '..')
const thisMonth = new Date().toISOString().slice(0, 7)
const gameSlugs = games.map((game) => game.slug)

/** The real check: pictures are read from public/. */
const realContext: PartnerCheckContext = {
  imageSize: (path) => {
    const file = join(root, 'public', path)
    return existsSync(file) ? imageSize(readFileSync(file)) : null
  },
  gameSlugs,
  thisMonth,
}

/** The same check for the made-up partner, whose pictures are not on disk. */
const exampleContext: PartnerCheckContext = { ...realContext, imageSize: (path) => exampleImages[path] ?? null }

/** The problems one changed copy of the example partner has. */
const problemsWith = (change: Partial<Partner>) => partnerProblems([{ ...examplePartner, ...change }], exampleContext)

describe('the partners in data/partners.ts', () => {
  it('pass every check: links, pictures, codes, dates, games and lengths', () => {
    expect(partnerProblems(partners, realContext)).toEqual([])
  })

  it('have their pictures in public/, where the profile pages load them from', () => {
    const missing = partners
      .flatMap((partner) => [partner.avatar, partner.banner])
      .filter((path) => !existsSync(join(root, 'public', path)))
    expect(missing).toEqual([])
  })
})

describe('the partner checks', () => {
  it('accept a complete, valid partner', () => {
    expect(partnerProblems([examplePartner], exampleContext)).toEqual([])
  })

  it('reject a slug used twice, and one that is not URL-safe', () => {
    const twice = partnerProblems([examplePartner, { ...examplePartner, referralCode: 'OTHER10' }], exampleContext)
    expect(twice.join('\n')).toMatch(/slug is used twice/)
    expect(problemsWith({ slug: 'Example Creator' }).join('\n')).toMatch(/slug must be/)
  })

  it('take a referral code as the billing panel stores it: capitals and digits, at most 32', () => {
    for (const referralCode of ['abc123', 'A'.repeat(33), 'ABC-123', 'ABC 123', 'CAFÉ', '']) {
      expect(problemsWith({ referralCode }).join('\n'), referralCode).toMatch(/must be 1 to 32 characters/)
    }
    for (const referralCode of ['A', 'AB1', 'ABCD', 'A1B2C3', 'Z'.repeat(32)]) {
      expect(problemsWith({ referralCode }), referralCode).toEqual([])
    }
  })

  it('reject the same code on two partners', () => {
    const problems = partnerProblems([examplePartner, { ...examplePartner, slug: 'someone-else' }], exampleContext)
    expect(problems.join('\n')).toMatch(/EXAMPLE10 is used twice/)
  })

  it('accept a partner with no referral code, since the code is optional', () => {
    expect('referralCode' in partnerWithoutCode).toBe(false)
    expect(partnerProblems([partnerWithoutCode], exampleContext)).toEqual([])
    // Naming the field and leaving it undefined is the same as leaving it out.
    expect(problemsWith({ referralCode: undefined })).toEqual([])
  })

  it('do not count partners with no code as sharing one', () => {
    const second = { ...partnerWithoutCode, slug: 'someone-else' }
    const problems = partnerProblems([partnerWithoutCode, second], exampleContext)
    expect(problems.filter((problem) => /referral code/.test(problem))).toEqual([])
    // A code still has to be unique among the partners that have one.
    const twice = partnerProblems([examplePartner, partnerWithoutCode, { ...examplePartner, slug: 'third' }], exampleContext)
    expect(twice.join('\n')).toMatch(/EXAMPLE10 is used twice/)
  })

  it('still reject an empty referral code, which is a mistake rather than no code', () => {
    for (const referralCode of ['', ' ', '\n']) {
      expect(problemsWith({ referralCode }).join('\n'), JSON.stringify(referralCode)).toMatch(/must be 1 to 32 characters/)
    }
  })

  it('hold the tagline to 80 characters and the description to 600, in every language', () => {
    expect(problemsWith({ tagline: 'a'.repeat(80) })).toEqual([])
    expect(problemsWith({ tagline: 'a'.repeat(81) }).join('\n')).toMatch(/tagline \(en\) is 81 characters/)
    expect(problemsWith({ description: 'a'.repeat(600) })).toEqual([])
    expect(problemsWith({ description: 'a'.repeat(601) }).join('\n')).toMatch(/description \(en\) is 601/)
    expect(problemsWith({ description: { en: 'Fine.', de: 'a'.repeat(601) } }).join('\n')).toMatch(/description \(de\)/)
  })

  it('reject empty text and a language the site is not published in', () => {
    expect(problemsWith({ tagline: ' ' }).join('\n')).toMatch(/tagline \(en\) is empty/)
    const unknown = { en: 'Fine.', it: 'Va bene.' } as unknown as Partner['description']
    expect(problemsWith({ description: unknown }).join('\n')).toMatch(/language we do not publish: it/)
  })

  it('take the start month as YYYY-MM, and not in the future', () => {
    expect(problemsWith({ since: '2026-9' }).join('\n')).toMatch(/must be YYYY-MM/)
    expect(problemsWith({ since: '2026-13' }).join('\n')).toMatch(/must be YYYY-MM/)
    expect(problemsWith({ since: '9999-01' }).join('\n')).toMatch(/in the future/)
  })

  it('only list games that have a page', () => {
    expect(problemsWith({ games: ['minecraft', 'not-a-game'] }).join('\n')).toMatch(/not-a-game is not in data\/games\.ts/)
    expect(problemsWith({ games: ['minecraft', 'minecraft'] }).join('\n')).toMatch(/listed twice/)
  })

  it('need both pictures in the partner folder, with the right shapes', () => {
    expect(problemsWith({ avatar: '/partners/example-creator/missing.webp' }).join('\n')).toMatch(/missing from public/)
    expect(problemsWith({ avatar: '/owners/liam-henry.webp' }).join('\n')).toMatch(/avatar must be in/)
    expect(problemsWith({ banner: '/partners/example-creator/banner.gif' }).join('\n')).toMatch(/WebP, PNG or JPEG/)

    const shapes = (avatar: { width: number; height: number }, banner: { width: number; height: number }) =>
      partnerProblems([examplePartner], {
        ...exampleContext,
        imageSize: (path) => (path.endsWith('avatar.webp') ? avatar : banner),
      }).join('\n')
    expect(shapes({ width: 512, height: 400 }, { width: 1500, height: 500 })).toMatch(/must be square/)
    expect(shapes({ width: 128, height: 128 }, { width: 1500, height: 500 })).toMatch(/at least 256px/)
    expect(shapes({ width: 512, height: 512 }, { width: 1500, height: 1000 })).toMatch(/about 3:1/)
    expect(shapes({ width: 512, height: 512 }, { width: 900, height: 300 })).toMatch(/at least 1200px/)
  })

  it('never look up a picture path that could lead out of the partner folder', () => {
    // On Windows a backslash path resolves on disk, while a browser reads it
    // as a slash and loads a file outside public/partners/.
    const lookedUp: string[] = []
    const context: PartnerCheckContext = {
      ...exampleContext,
      imageSize: (path) => {
        lookedUp.push(path)
        return exampleImages[path] ?? null
      },
    }
    const escapes = [
      '/partners/example-creator/..\\..\\og-image.png',
      '/partners/example-creator/..\\..\\owners\\liam-henry.webp',
      '/partners/example-creator/..%2F..%2Fog-image.png',
      '/partners/example-creator/../../og-image.png',
      '/partners/example-creator/sub/avatar.webp',
      '/partners/example-creator/Avatar.webp',
      '/partners/example-creator/.webp',
      '/partners/example-creator/avatar.webp?v=2',
      '/partners/example-creator/avatar.svg',
    ]
    for (const avatar of escapes) {
      const problems = partnerProblems([{ ...examplePartner, avatar }], context).join('\n')
      expect(problems, avatar).toMatch(/directly in \/partners\/example-creator\//)
    }
    expect(lookedUp.filter((path) => escapes.includes(path))).toEqual([])
  })
})

describe('social links', () => {
  it('accept each platform on its own site', () => {
    const good: [Parameters<typeof socialLinkProblem>[0], string][] = [
      ['discord', 'https://discord.gg/abc123'],
      ['discord', 'https://discord.com/invite/abc123'],
      ['youtube', 'https://www.youtube.com/@someone'],
      ['youtube', 'https://youtube.com/channel/UC123abc'],
      ['tiktok', 'https://www.tiktok.com/@someone'],
      ['twitch', 'https://www.twitch.tv/someone'],
      ['kick', 'https://kick.com/someone'],
      ['x', 'https://x.com/someone'],
      ['x', 'https://twitter.com/someone'],
      ['instagram', 'https://www.instagram.com/some.one/'],
      ['steam', 'https://steamcommunity.com/groups/someone'],
      ['steam', 'https://steamcommunity.com/id/someone'],
      ['steam', 'https://steamcommunity.com/profiles/76561198000000000'],
      ['github', 'https://github.com/someone'],
      ['website', 'https://someone.example.org/about'],
    ]
    expect(good.map(([platform, href]) => socialLinkProblem(platform, href)).filter(Boolean)).toEqual([])
  })

  it('reject a link that is not https', () => {
    expect(socialLinkProblem('youtube', 'http://www.youtube.com/@someone')).toMatch(/not https/)
    expect(socialLinkProblem('website', 'http://someone.example.org')).toMatch(/not https/)
    expect(socialLinkProblem('website', 'javascript:alert(1)')).toMatch(/not https/)
  })

  it('reject a link to the wrong site, or the wrong kind of page', () => {
    const bad: [Parameters<typeof socialLinkProblem>[0], string][] = [
      ['discord', 'https://discord.com/channels/123/456'],
      ['discord', 'https://discord.gg.evil.example/abc'],
      ['youtube', 'https://youtu.be/dQw4w9WgXcQ'],
      ['youtube', 'https://www.youtube.com.evil.example/@someone'],
      ['tiktok', 'https://tiktok.evil.example/@someone'],
      ['kick', 'https://kick.example.com/someone'],
      ['instagram', 'https://instagram.example.com/someone'],
      ['steam', 'https://steamcommunity.example.com/id/someone'],
      ['github', 'https://github.example.com/someone'],
      ['youtube', 'https://www.youtube.com/watch?v=abc'],
      ['tiktok', 'https://www.tiktok.com/someone'],
      ['twitch', 'https://twitch.example.com/someone'],
      ['x', 'https://x.com.evil.example/someone'],
      ['instagram', 'https://www.instagram.com/p/abc/xyz'],
      ['steam', 'https://store.steampowered.com/app/440'],
      ['github', 'https://gist.github.com/someone'],
      ['website', 'https://localhost'],
      ['website', 'https://127.0.0.1'],
      ['website', 'not a link'],
    ]
    const accepted = bad.filter(([platform, href]) => socialLinkProblem(platform, href) === null)
    expect(accepted).toEqual([])
  })

  it('reject a link carrying a login or a port', () => {
    expect(socialLinkProblem('github', 'https://user:pass@github.com/someone')).toMatch(/login or a port/)
    expect(socialLinkProblem('website', 'https://example.com:8443')).toMatch(/login or a port/)
  })

  it('reject text the parser forgives but a browser reads as a path on our own site', () => {
    // "https:discord.gg/abc" parses as discord.gg, yet as an href it is
    // wslatl.com/partners/discord.gg/abc.
    for (const href of [
      'https:discord.gg/abc',
      'https:/discord.gg/abc',
      ' https://discord.gg/abc',
      'https://discord.gg/abc ',
      'https:\\\\discord.gg\\abc',
      'https://discord.gg\\abc',
    ]) {
      expect(socialLinkProblem('discord', href), href).toMatch(/must start with https:\/\/ and have no spaces/)
    }
  })

  it('link to the address exactly as it was checked', () => {
    for (const link of socialLinks(examplePartner)) expect(link.href, link.platform).toBe(new URL(link.href).href)
  })

  it('show the links in the platform order, as short addresses', () => {
    const links = socialLinks(examplePartner)
    expect(links.map((link) => link.platform)).toEqual([...socialPlatformIds])
    expect(links.find((link) => link.platform === 'youtube')?.display).toBe('youtube.com/@example')
    expect(links.find((link) => link.platform === 'website')?.display).toBe('example.com')
  })
})

describe('signing up with a referral code', () => {
  it('goes to the register destination in config/links.json, with the code filled in', () => {
    expect(referralSignupUrl('EXAMPLE10')).toBe(`${shortLinks.register.url}?ref=EXAMPLE10`)
    expect(new URL(referralSignupUrl('EXAMPLE10')).searchParams.get('ref')).toBe('EXAMPLE10')
    expect(referralSignupUrl('EXAMPLE10').startsWith('https://')).toBe(true)
  })

  it('keeps the code intact even if it ever held a character a URL treats specially', () => {
    expect(new URL(referralSignupUrl('A B&C=D')).searchParams.get('ref')).toBe('A B&C=D')
  })

  it('writes the discount from the one config constant, in each language', () => {
    expect(referralDiscount('en')).toBe(`${referralDiscountPercent}%`)
    for (const locale of locales) expect(referralDiscount(locale), locale).toContain(String(referralDiscountPercent))
  })
})

describe('a partner with no referral code', () => {
  it('is told apart from one with a code', () => {
    expect(hasReferralCode(examplePartner)).toBe(true)
    expect(hasReferralCode(partnerWithoutCode)).toBe(false)
  })

  it('has a profile description with no code and no discount, in every language', () => {
    for (const locale of locales) {
      const t = copyFor(locale).partners.profile
      const description = partnerMetaDescription(partnerWithoutCode, t, locale)
      const tagline = partnerText(partnerWithoutCode.tagline, locale)
      expect(description, locale).toBe(`${tagline} ${t.metaDescriptionNoCode(partnerWithoutCode.name)}`)
      expect(description, locale).toContain(partnerWithoutCode.name)
      expect(description, locale).not.toContain(examplePartner.referralCode ?? '')
      expect(description, locale).not.toContain(referralDiscount(locale))
      expect(description, locale).not.toContain(String(referralDiscountPercent))
    }
  })

  it('keeps the code and the discount in the description of a partner who has one', () => {
    for (const locale of locales) {
      const t = copyFor(locale).partners.profile
      const description = partnerMetaDescription(examplePartner, t, locale)
      expect(description, locale).toContain(examplePartner.referralCode ?? '')
      expect(description, locale).toContain(referralDiscount(locale))
    }
  })

  it('does not let the partners page promise a discount when no listed partner has a code', () => {
    for (const locale of locales) {
      const t = copyFor(locale).partners
      const plain = partnersPageText(t, 2, locale, 0)
      expect(plain, locale).toEqual({ intro: t.introNoCodes, description: t.metaDescriptionNoCodes })
      expect(plain.intro, locale).not.toContain(referralDiscount(locale))
      expect(plain.description, locale).not.toContain(referralDiscount(locale))
      // One code anywhere in the list, or no count at all, keeps the offer.
      expect(partnersPageText(t, 2, locale, 1).intro, locale).toBe(t.intro(referralDiscount(locale)))
      expect(partnersPageText(t, 2, locale).intro, locale).toBe(t.intro(referralDiscount(locale)))
      // And an empty list is still the invitation.
      expect(partnersPageText(t, 0, locale, 0).intro, locale).toBe(t.emptyIntro)
    }
  })
})

describe('partner text', () => {
  it('falls back to English for a language the partner did not write', () => {
    expect(partnerText({ en: 'Hello', es: 'Hola' }, 'es')).toBe('Hola')
    expect(partnerText({ en: 'Hello', es: 'Hola' }, 'fr')).toBe('Hello')
    expect(partnerText('Hello', 'de')).toBe('Hello')
  })

  it('marks that English fallback as English, so a screen reader reads it as English', () => {
    expect(partnerTextLang({ en: 'Hello', es: 'Hola' }, 'es')).toBeUndefined()
    expect(partnerTextLang({ en: 'Hello', es: 'Hola' }, 'fr')).toBe('en')
    expect(partnerTextLang('Hello', 'de')).toBe('en')
    expect(partnerTextLang('Hello', 'en')).toBeUndefined()
    expect(partnerTextLang({ en: 'Hello' }, 'en')).toBeUndefined()
  })

  it('puts featured partners first and otherwise keeps the order of the data', () => {
    const list = [
      { ...examplePartner, slug: 'a' },
      { ...examplePartner, slug: 'b', featured: true },
      { ...examplePartner, slug: 'c' },
    ]
    expect(orderedPartners(list).map((partner) => partner.slug)).toEqual(['b', 'a', 'c'])
  })
})

/** /partners below its title, as the server sends it. */
const render = (list: Partner[]) => renderToStaticMarkup(createElement(PartnerShowcase, { partners: list }))
/** A partner's profile between the site header and footer, as the server sends it. */
const renderProfile = (partner: Partner) => renderToStaticMarkup(createElement(PartnerProfile, { partner }))
/** One partner's card on /partners, as the server sends it. */
const renderCard = (partner: Partner) => renderToStaticMarkup(createElement(PartnerCard, { partner }))
const count = (html: string, text: string) => html.split(text).length - 1
/** Every opening <a> tag in some markup, with its href as written (HTML escaping undone for &). */
const anchors = (html: string) =>
  [...html.matchAll(/<a\s[^>]*>/g)].map(([tag]) => ({ tag, href: (/href="([^"]*)"/.exec(tag)?.[1] ?? '').replaceAll('&amp;', '&') }))

describe('the partners page', () => {
  it('shows the "This could be you" card and the program when there are no partners', () => {
    const html = render([])
    expect(count(html, 'data-ghost-card')).toBe(1)
    expect(html).toContain(en.partners.ghost.title)
    expect(html).toContain('id="become-a-partner"')
  })

  it('describes itself to search engines and link previews the way its intro does', async () => {
    // With no partners yet, neither may talk about partners or codes that do not exist.
    for (const locale of locales) {
      const t = copyFor(locale).partners
      expect(partnersPageText(t, 0, locale), locale).toEqual({ intro: t.emptyIntro, description: t.emptyMetaDescription })
      expect(t.emptyMetaDescription, locale).not.toContain(String(referralDiscountPercent))
      const listed = partnersPageText(t, 1, locale)
      expect(listed.description, locale).toBe(t.metaDescription(referralDiscount(locale)))
      expect(listed.intro, locale).toBe(t.intro(referralDiscount(locale)))
    }

    // And the page itself, with the list as it ships.
    const metadata = await partnersPageMetadata({ params: Promise.resolve({ locale: 'en' }) })
    const expected = partnersPageText(en.partners, partners.length, 'en').description
    expect(metadata.description).toBe(expected)
    expect(metadata.openGraph?.description).toBe(expected)
    expect(metadata.twitter?.description).toBe(expected)
  })

  it('gives the "This could be you" card the whole last row rather than leaving it alone there', () => {
    expect(ghostAloneAt(1)).toEqual({ sm: false, lg: false })
    expect(ghostAloneAt(2)).toEqual({ sm: true, lg: false })
    expect(ghostAloneAt(3)).toEqual({ sm: false, lg: true })
    expect(ghostAloneAt(6)).toEqual({ sm: true, lg: true })
    expect(ghostItemClass(ghostAloneAt(1))).toBe('')
    expect(ghostItemClass(ghostAloneAt(2))).toBe('sm:col-span-2 lg:col-span-1')
    expect(ghostItemClass(ghostAloneAt(3))).toBe('lg:col-span-3')
    expect(ghostItemClass(ghostAloneAt(6))).toBe('sm:col-span-2 lg:col-span-3')

    const three = [examplePartner, ...['b', 'c'].map((slug) => ({ ...examplePartner, slug, referralCode: `CODE${slug}` }))]
    expect(render(three)).toMatch(/<li class="lg:col-span-3"><a [^>]*data-ghost-card/)
  })

  it('always ends the grid on the "This could be you" card', () => {
    const second = { ...examplePartner, slug: 'second-creator', referralCode: 'SECOND10', featured: true }
    const html = render([examplePartner, second])
    expect(count(html, 'data-ghost-card')).toBe(1)
    const ghost = html.indexOf('data-ghost-card')
    for (const slug of [examplePartner.slug, second.slug]) {
      expect(html.indexOf(`id="partner-${slug}"`), slug).toBeGreaterThan(-1)
      expect(html.indexOf(`id="partner-${slug}"`), slug).toBeLessThan(ghost)
    }
    // The featured one comes first.
    expect(html.indexOf('id="partner-second-creator"')).toBeLessThan(html.indexOf('id="partner-example-creator"'))
  })

  it('opens every link that leaves the site in a new tab without handing over the page', () => {
    // Both pages: the cards and the program on /partners, and a whole profile.
    const links = anchors(render([examplePartner]) + renderProfile(examplePartner))
    const leaving = links.filter(({ href }) => /^https?:/.test(href) || isShortLink(href))

    // Every kind of link that leaves is in there: partner links on the card
    // and on the profile, the sign-up button, and the program's short links.
    const hrefs = leaving.map(({ href }) => href)
    for (const link of socialLinks(examplePartner)) {
      expect(hrefs.filter((href) => href === link.href), link.href).toHaveLength(2)
    }
    expect(hrefs).toContain(referralSignupUrl(examplePartner.referralCode ?? ''))
    expect(hrefs).toContain(siteConfig.links.discord)
    expect(hrefs).toContain(siteConfig.links.billing)

    const newTab = links.filter((link) => link.tag.includes('target="_blank"'))
    for (const { tag } of [...leaving, ...newTab]) {
      expect(tag).toContain('target="_blank"')
      expect(tag).toContain('rel="noopener noreferrer"')
    }
  })

  it('shows a profile with its code, sign-up button, links and games', () => {
    const html = renderProfile(examplePartner)
    expect(html).toContain(`>${examplePartner.name}</h1>`)
    expect(html).toContain(examplePartner.referralCode ?? '')
    expect(html).toContain(en.partners.profile.discount(referralDiscount('en')))
    for (const game of examplePartner.games ?? []) expect(html, game).toContain(`href="/games/${game}"`)
  })

  it('shows a card with its code and the way to the profile', () => {
    const html = renderCard(examplePartner)
    expect(html).toContain(en.partners.referralCode)
    expect(html).toContain(`>${examplePartner.referralCode}</code>`)
    expect(count(html, '<code')).toBe(1)
    expect(html).toContain(`>${en.partners.copy}<`)
    expect(html).toContain(`href="/partners/${examplePartner.slug}"`)
  })

  it('shows a card with no code box, label or copy button, and keeps the rest', () => {
    const html = renderCard({ ...partnerWithoutCode, featured: true })
    expect(html).not.toContain(en.partners.referralCode)
    expect(html).not.toContain('<code')
    expect(html).not.toContain(`>${en.partners.copy}<`)
    // Nothing is left of the box that held the code.
    expect(html).not.toContain('bg-background/50')
    expect(html).toContain(`>${partnerWithoutCode.name}</h2>`)
    expect(html).toContain(partnerText(partnerWithoutCode.tagline, 'en'))
    expect(html).toContain(encodeURIComponent(partnerWithoutCode.banner))
    expect(html).toContain(encodeURIComponent(partnerWithoutCode.avatar))
    expect(html).toContain(en.partners.featured)
    expect(html).toContain(`href="/partners/${partnerWithoutCode.slug}"`)
    for (const link of socialLinks(partnerWithoutCode)) expect(html, link.platform).toContain(`href="${link.href}"`)
  })

  it('lists a partner with no code beside one that has a code', () => {
    const other = { ...partnerWithoutCode, slug: 'no-code-creator', name: 'No Code Creator' }
    const html = render([examplePartner, other])
    expect(html).toContain('id="partner-example-creator"')
    expect(html).toContain('id="partner-no-code-creator"')
    // Only the partner with a code has a code on their card.
    expect(count(html, '<code')).toBe(1)
    expect(count(html, 'data-ghost-card')).toBe(1)
    // And a page of partners with no codes lists them all the same.
    const alone = render([other])
    expect(alone).toContain('id="partner-no-code-creator"')
    expect(count(alone, '<code')).toBe(0)
  })

  it('shows a profile with no code box, sign-up button or discount line, and keeps the rest', () => {
    const html = renderProfile(partnerWithoutCode)
    expect(html).toContain(`>${partnerWithoutCode.name}</h1>`)
    expect(html).toContain(partnerText(partnerWithoutCode.tagline, 'en'))
    expect(html).toContain('A made-up partner used by the tests.')
    expect(html).toContain(en.partners.officialPartner)
    expect(html).toContain(encodeURIComponent(partnerWithoutCode.banner))
    expect(html).toContain(encodeURIComponent(partnerWithoutCode.avatar))
    for (const link of socialLinks(partnerWithoutCode)) expect(html, link.platform).toContain(`href="${link.href}"`)
    for (const game of partnerWithoutCode.games ?? []) expect(html, game).toContain(`href="/games/${game}"`)

    expect(html).not.toContain('<code')
    expect(html).not.toContain('referral-heading')
    expect(html).not.toContain(en.partners.profile.referral(partnerWithoutCode.name))
    expect(html).not.toContain(en.partners.profile.signUp)
    expect(html).not.toContain(en.partners.profile.discount(referralDiscount('en')))
    expect(html).not.toContain(`>${en.partners.copy}<`)
    // No empty column is held open for the side box.
    expect(html).not.toContain('22rem')

    // No link goes to the billing panel's sign-up page.
    const hrefs = anchors(html).map(({ href }) => href)
    expect(hrefs.filter((href) => href.startsWith(shortLinks.register.url))).toEqual([])
    expect(hrefs.filter((href) => href.includes('ref='))).toEqual([])
  })

  it('shows a profile with a code in a column beside the rest', () => {
    const html = renderProfile(examplePartner)
    expect(html).toContain('referral-heading')
    expect(html).toContain('22rem')
    expect(anchors(html).map(({ href }) => href)).toContain(referralSignupUrl(examplePartner.referralCode ?? ''))
  })

  it('is linked from the header and the footer in every language', () => {
    for (const locale of locales) {
      const t = copyFor(locale)
      const target = locale === defaultLocale ? '/partners' : `/${locale}/partners`
      expect(mainNav(t, locale).map((link) => link.href), locale).toContain(target)
      const footer = footerColumns(t, locale, legalPages).flatMap((column) => column.links)
      expect(footer.map((link) => link.href), locale).toContain(target)
    }
  })

  it('is in the sitemap in every language, with every profile', () => {
    const urls = sitemap().map((entry) => entry.url)
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? '' : `/${locale}`
      expect(urls, locale).toContain(`${siteConfig.siteUrl}${prefix}/partners`)
      for (const partner of partners) {
        expect(urls, `${locale} ${partner.slug}`).toContain(`${siteConfig.siteUrl}${prefix}/partners/${partner.slug}`)
      }
    }
  })
})

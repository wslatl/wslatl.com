import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PricingJsonLd } from '@/components/seo/pricing-json-ld'
import { shortLinks } from '@/config/links'
import { productLines } from '@/data/pricing'
import { defaultLocale, locales, openGraphLocales } from '@/i18n/config'
import {
  alternateKeys,
  brand,
  checkCards,
  checkDuplicates,
  checkLanguages,
  checkPartnerLanguages,
  checkNotFound,
  checkOrganization,
  checkPage,
  checkPicture,
  checkReciprocity,
  checkRobots,
  checkSitemap,
  checkSitemapAgreement,
  expectedUrl,
  imageInfo,
  internalLinks,
  limits,
  linkProblem,
  readPage,
  readSitemap,
  sameAsAllowed,
  sameAsOf,
  locales as ruleLocales,
  defaultLocale as ruleDefaultLocale,
  openGraphLocales as ruleOpenGraphLocales,
} from '../scripts/lib/seo-rules.mjs'

vi.mock('server-only', () => ({}))

const origin = 'https://wslatl.com'

interface PageOptions {
  locale?: string
  path?: string
  omit?: string[]
  extraHead?: string
  body?: string
  jsonLd?: unknown[]
}

/** The company as the home page writes it: everything the rules ask for. */
const fullOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${origin}/#organization`,
  name: 'WSLATL',
  legalName: 'WSLATL LLC',
  url: origin,
  description: 'A small hosting company in Missouri.',
  logo: { '@type': 'ImageObject', url: `${origin}/logo.png`, width: 512, height: 512 },
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer support', url: `${origin}/#contact`, availableLanguage: ['en', 'es', 'fr', 'de', 'pt'] },
  ],
  sameAs: [...sameAsAllowed],
}

/** What a page says in each language that a translated page must not copy from the English one. */
const wordsIn = (locale: string) => (locale === 'en' ? 'Games' : `Games in ${locale}`)

/** A page that passes every rule, to break one thing at a time. */
function page({ locale = 'en', path = '/games', omit = [], extraHead = '', body, jsonLd }: PageOptions = {}) {
  const url = expectedUrl(origin, locale, path)
  const has = (tag: string) => !omit.includes(tag)
  const title = `${wordsIn(locale)} | WSLATL`
  const description = `Plans for game servers and VPS, in ${locale}, with prices that are on the page and every spec listed.`
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: expectedUrl(origin, locale, '/') },
      { '@type': 'ListItem', position: 2, name: 'Games', item: url },
    ],
  }
  // The company is written in full on the home pages and nowhere else.
  const site = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'WSLATL', url: origin }
  const home = [{ ...fullOrganization, description: `${fullOrganization.description} (${locale})` }, crumbs, ...(locale === defaultLocale ? [site] : [])]
  const blocks = jsonLd ?? (path === '/' ? home : [crumbs])
  const alternates = alternateKeys
    .map((key) => `<link rel="alternate" hreflang="${key}" href="${expectedUrl(origin, key === 'x-default' ? 'en' : key, path)}"/>`)
    .join('')
  const others = locales
    .filter((other) => other !== locale)
    .map((other) => `<meta property="og:locale:alternate" content="${openGraphLocales[other as keyof typeof openGraphLocales]}"/>`)
    .join('')
  const card = `${origin}/og?path=${path}&amp;locale=${locale}`
  const html = `<!DOCTYPE html><html lang="${locale}"><head>
    ${has('title') ? `<title>${title}</title>` : ''}
    ${has('description') ? `<meta name="description" content="${description}"/>` : ''}
    ${has('canonical') ? `<link rel="canonical" href="${url}"/>` : ''}
    ${has('hreflang') ? alternates : ''}
    ${has('og') ? `<meta property="og:title" content="${title}"/><meta property="og:description" content="${description}"/><meta property="og:url" content="${url}"/><meta property="og:locale" content="${openGraphLocales[locale as keyof typeof openGraphLocales]}"/>${others}<meta property="og:site_name" content="WSLATL"/><meta property="og:type" content="website"/><meta property="og:image" content="${card}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:type" content="image/png"/><meta property="og:image:alt" content="${wordsIn(locale)} card"/>` : ''}
    ${has('twitter') ? `<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${title}"/><meta name="twitter:description" content="${description}"/><meta name="twitter:image" content="${card}"/><meta name="twitter:image:alt" content="${wordsIn(locale)} card"/>` : ''}
    ${extraHead}
    ${blocks.map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`).join('')}
    </head><body>${body ?? '<main><h1>Games</h1><img src="/a.webp" alt="A picture"/></main>'}</body></html>`
  return { url, parsed: readPage(html), html }
}

const problemsOf = (options?: PageOptions) => {
  const { url, parsed } = page(options)
  return checkPage(parsed, { url, origin })
}

describe('what the SEO check knows about the site', () => {
  it('lists the same languages as the site does', () => {
    expect(ruleLocales).toEqual([...locales])
    expect(ruleDefaultLocale).toBe(defaultLocale)
    expect(ruleOpenGraphLocales).toEqual(openGraphLocales)
  })

  it('allows exactly the company profiles the site links to', () => {
    expect(new Set(sameAsAllowed)).toEqual(new Set([shortLinks.discord.url, shortLinks.trustpilot.url, shortLinks.github.url]))
  })
})

describe('the page rules', () => {
  it('pass a complete page in every language', () => {
    for (const locale of locales) expect(problemsOf({ locale }), locale).toEqual([])
    for (const locale of locales) expect(problemsOf({ locale, path: '/' }), `${locale} home`).toEqual([])
  })

  it('want a title, and one that is not cut off in results', () => {
    expect(problemsOf({ omit: ['title'] })).toContain('no title')
    const { url, parsed } = page()
    expect(limits.title).toBe(65)
    expect(checkPage({ ...parsed, title: 'x'.repeat(70), ogTitle: 'x'.repeat(70), twitterTitle: 'x'.repeat(70) }, { url, origin })).toEqual([
      expect.stringContaining('title is 70 characters (over 65)'),
    ])
    expect(checkPage({ ...parsed, title: 'x'.repeat(65), ogTitle: 'x'.repeat(65), twitterTitle: 'x'.repeat(65) }, { url, origin })).toEqual([])
  })

  it('want a description of a sensible length', () => {
    expect(problemsOf({ omit: ['description'] })).toContain('no meta description')
    const { url, parsed } = page()
    const withDescription = (description: string) => ({ ...parsed, description, ogDescription: description, twitterDescription: description })
    expect(checkPage(withDescription('Short.'), { url, origin })).toEqual([expect.stringContaining('only 6 characters')])
    // Past 70 characters a description says something; this one is the old floor of 30.
    expect(checkPage(withDescription('x'.repeat(40)), { url, origin })).toEqual([expect.stringContaining('only 40 characters')])
    expect(checkPage(withDescription('x'.repeat(70)), { url, origin })).toEqual([])
    expect(checkPage(withDescription('x'.repeat(300)), { url, origin })).toEqual([expect.stringContaining('300 characters')])
  })

  it('want the canonical to be the page itself, English at the plain path', () => {
    expect(problemsOf({ omit: ['canonical'] })).toEqual([expect.stringContaining('canonical is missing')])
    const { url, parsed } = page({ locale: 'es' })
    expect(checkPage({ ...parsed, canonical: `${origin}/games` }, { url, origin })).toEqual([
      expect.stringContaining(`expected ${origin}/es/games`),
    ])
    // A /en/ prefix is a redirect, never a canonical.
    expect(checkPage({ ...parsed, canonical: `${origin}/en/games` }, { url, origin })).toHaveLength(1)
  })

  it('want hreflang for all five languages and x-default, each at the right address', () => {
    expect(problemsOf({ omit: ['hreflang'] })).toHaveLength(alternateKeys.length)
    const { url, parsed } = page()
    const wrong = { ...parsed, alternates: { ...parsed.alternates, de: `${origin}/games` } }
    expect(checkPage(wrong, { url, origin })).toEqual([`hreflang de is ${origin}/games, expected ${origin}/de/games`])
    expect(checkPage({ ...parsed, alternates: { ...parsed.alternates, 'en-US': url } }, { url, origin })).toEqual([
      'hreflang en-US is not a language of the site',
    ])
  })

  it('want the page to say its own language', () => {
    const { url, parsed } = page({ locale: 'fr' })
    expect(checkPage({ ...parsed, lang: 'en' }, { url, origin })).toEqual(['html lang is "en", expected "fr"'])
  })

  it('refuse noindex on a public page', () => {
    expect(problemsOf({ extraHead: '<meta name="robots" content="noindex, nofollow"/>' })).toEqual(['a public page says noindex'])
    expect(problemsOf({ extraHead: '<meta name="robots" content="index, follow"/>' })).toEqual([])
  })

  it('want Open Graph and Twitter cards, with the right locale', () => {
    expect(problemsOf({ omit: ['og'] })).toEqual(
      expect.arrayContaining(['no og:image', 'no og:title', 'no og:description', 'no og:image:alt']),
    )
    expect(problemsOf({ omit: ['twitter'] })).toEqual(
      expect.arrayContaining(['twitter:card is not summary_large_image', 'no twitter:image', 'no twitter:image:alt']),
    )
    const { url, parsed } = page({ locale: 'pt' })
    expect(checkPage({ ...parsed, ogLocale: 'en_US' }, { url, origin })).toEqual(['og:locale is en_US, expected pt_BR'])
  })

  it('want exactly one h1', () => {
    expect(problemsOf({ body: '<main><p>No heading</p></main>' })).toEqual(['0 h1 headings, expected 1'])
    expect(problemsOf({ body: '<main><h1>One</h1><h1>Two</h1></main>' })).toEqual(['2 h1 headings, expected 1'])
    expect(problemsOf({ body: '<main><h1> </h1></main>' })).toEqual(['the h1 is empty'])
    // A heading inside a script is not a heading.
    expect(problemsOf({ body: '<main><h1>One</h1><script>"<h1>x</h1>"</script></main>' })).toEqual([])
  })

  it('want alt text on every image, though an empty one is fine for decoration', () => {
    expect(problemsOf({ body: '<main><h1>A</h1><img src="/a.png"/></main>' })).toEqual([
      expect.stringContaining('1 image(s) with no alt attribute (/a.png)'),
    ])
    expect(problemsOf({ body: '<main><h1>A</h1><img src="/a.png" alt=""/></main>' })).toEqual([])
  })
})

describe('the card rules', () => {
  const cards = (locale = 'en', change: Record<string, unknown> = {}) => {
    const { parsed } = page({ locale })
    return checkCards({ ...parsed, ...change }, { locale })
  }

  it('pass the cards of a page in every language', () => {
    for (const locale of locales) expect(cards(locale), locale).toEqual([])
  })

  it('want the size and the type of the picture in tags, not only in the file', () => {
    expect(cards('en', { ogImageWidth: undefined })).toEqual(['og:image:width is missing, expected 1200'])
    expect(cards('en', { ogImageHeight: '500' })).toEqual(['og:image:height is 500, expected 630'])
    expect(cards('en', { ogImageType: undefined })).toEqual(['og:image:type is missing, expected a PNG or a JPEG'])
    expect(cards('en', { ogImageType: 'image/webp' })).toEqual(['og:image:type is image/webp, expected a PNG or a JPEG'])
    expect(cards('en', { ogImageType: 'image/jpeg' })).toEqual([])
  })

  it('want the picture to be an absolute address, and each language its own card', () => {
    expect(cards('en', { ogImage: '/og?path=/', twitterImage: '/og?path=/' })).toEqual([expect.stringContaining('not an absolute https address')])
    const english = `${origin}/og-image.png?v=1`
    expect(cards('es', { ogImage: english, twitterImage: english })).toEqual([`og:image is not the card for es: ${english}`])
  })

  it('want alt text for both pictures, and the same on both', () => {
    expect(cards('en', { ogImageAlt: undefined })).toEqual(expect.arrayContaining(['no og:image:alt']))
    expect(cards('en', { twitterImageAlt: undefined })).toEqual(['no twitter:image:alt'])
    expect(cards('en', { twitterImageAlt: 'Another' })).toEqual(['twitter:image:alt is not the og:image:alt'])
  })

  it('want the Twitter card to say what the Open Graph one says', () => {
    expect(cards('en', { twitterTitle: 'Other' })).toEqual(['twitter:title is not the og:title'])
    expect(cards('en', { twitterDescription: 'Other' })).toEqual(['twitter:description is not the og:description'])
    expect(cards('en', { twitterImage: `${origin}/og?path=/x&locale=en` })).toEqual(['twitter:image is not the og:image'])
    expect(cards('en', { ogTitle: 'Other', twitterTitle: 'Other' })).toEqual(['og:title is not the page title'])
    expect(cards('en', { ogDescription: 'Other', twitterDescription: 'Other' })).toEqual(['og:description is not the meta description'])
  })

  it('want the site name, a type and the other four languages as alternates', () => {
    expect(cards('en', { ogSiteName: 'WSLATL LLC' })).toEqual([`og:site_name is WSLATL LLC, expected ${brand}`])
    expect(cards('en', { ogType: undefined })).toEqual(['no og:type'])
    expect(cards('fr', { ogLocaleAlternates: ['en_US', 'es_ES', 'de_DE'] })).toEqual([expect.stringContaining('og:locale:alternate is en_US, es_ES, de_DE')])
    // A language is never its own alternate.
    expect(cards('fr', { ogLocaleAlternates: ['fr_FR', 'en_US', 'es_ES', 'de_DE', 'pt_BR'] })).toHaveLength(1)
  })

  it('refuse a partner banner as the share picture: a 3:1 WebP with no size tags', () => {
    const banner = `${origin}/partners/vulnradar/banner.webp`
    const problems = cards('en', { ogImage: banner, twitterImage: banner, ogImageWidth: undefined, ogImageHeight: undefined, ogImageType: undefined })
    expect(problems).toEqual(
      expect.arrayContaining(['og:image:width is missing, expected 1200', 'og:image:height is missing, expected 630']),
    )
  })
})

describe('the picture file rules', () => {
  const png = (width: number, height: number) => {
    const bytes = Buffer.alloc(33)
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes)
    bytes.writeUInt32BE(width, 16)
    bytes.writeUInt32BE(height, 20)
    return bytes
  }
  const jpeg = (width: number, height: number) => {
    // SOI, then a start-of-frame segment: length, precision, height, width.
    const bytes = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0, 0, 0, 0, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    bytes.writeUInt16BE(height, 7)
    bytes.writeUInt16BE(width, 9)
    return bytes
  }
  const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBPVP8 '), Buffer.alloc(20)])

  it('reads the type and the size from the file', () => {
    expect(imageInfo(png(1200, 630))).toEqual({ type: 'image/png', width: 1200, height: 630 })
    expect(imageInfo(jpeg(1200, 630))).toEqual({ type: 'image/jpeg', width: 1200, height: 630 })
    expect(imageInfo(webp)).toEqual({ type: 'image/webp' })
    expect(imageInfo(Buffer.from('<html>'))).toEqual({ type: 'unknown' })
  })

  it('want a 1200x630 PNG or JPEG', () => {
    expect(checkPicture(png(1200, 630))).toEqual([])
    expect(checkPicture(jpeg(1200, 630))).toEqual([])
    expect(checkPicture(png(1500, 500))).toEqual(['is 1500x500, expected 1200x630'])
    expect(checkPicture(webp)).toEqual(['is a WEBP, not a PNG or a JPEG'])
  })
})

const crumbs = (items: unknown[]) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })
const item = (position: number, name: string, href: string) => ({ '@type': 'ListItem', position, name, item: href })
const faqBlock = (name: string, text: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [{ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }],
})
const offer = (price: string, extra: Record<string, unknown> = { availability: 'https://schema.org/InStock' }) => ({
  '@type': 'Product',
  name: 'Premium VPS P-VPS-2',
  sku: 'P-VPS-2',
  offers: { '@type': 'Offer', price, priceCurrency: 'USD', ...extra },
})

describe('the Organization rules', () => {
  const organization = fullOrganization
  const trail = crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])
  const problems = (change: Record<string, unknown>) => checkOrganization({ ...organization, ...change }, { origin })

  it('pass the company as the home pages write it', () => {
    expect(checkOrganization(organization, { origin })).toEqual([])
  })

  it('wants the full company on each home page, and none on the inner pages', () => {
    expect(problemsOf({ path: '/', jsonLd: [] })).toEqual(['0 Organization blocks on the home page, expected 1', '0 WebSite blocks on the home page, expected 1'])
    expect(problemsOf({ path: '/', locale: 'es', jsonLd: [organization, organization] })).toEqual(['2 Organization blocks on the home page, expected 1'])
    expect(problemsOf({ jsonLd: [organization, trail] })).toEqual([
      expect.stringContaining('1 Organization block(s) on an inner page'),
    ])
    // An id reference is not a second copy of the company.
    expect(problemsOf({ jsonLd: [trail, { '@context': 'https://schema.org', '@type': 'Product', name: 'A', sku: 'A', brand: { '@id': `${origin}/#organization` } }] })).toEqual([
      'Product A has no offers',
    ])
  })

  it('wants one display name, the legal name, the site address and a description', () => {
    expect(problems({ name: 'WSLATL LLC' })).toEqual([`Organization name is WSLATL LLC, expected ${brand}`])
    expect(problems({ legalName: undefined })).toEqual(['Organization has no legalName'])
    expect(problems({ url: 'https://example.com' })).toEqual([`Organization url is https://example.com, expected ${origin}`])
    expect(problems({ description: undefined })).toEqual(['Organization has no description'])
  })

  it('wants a logo that is an image of a size Google accepts', () => {
    expect(problems({ logo: undefined })).toEqual(['Organization has no logo'])
    expect(problems({ logo: `${origin}/logo.png` })).toEqual(['Organization logo is not an ImageObject with a url'])
    expect(problems({ logo: { '@type': 'ImageObject', url: `${origin}/logo.png`, width: 64, height: 64 } })).toEqual([
      'Organization logo is under 112x112 or has no size',
    ])
  })

  it('wants a contact point with a type, a way to reach it and its languages', () => {
    expect(problems({ contactPoint: undefined })).toEqual(['Organization has no contactPoint'])
    expect(problems({ contactPoint: [{ '@type': 'ContactPoint', url: `${origin}/#contact`, availableLanguage: ['en'] }] })).toEqual([
      'contactPoint is not a ContactPoint with a contactType',
    ])
    expect(problems({ contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['en'] }] })).toEqual([
      'contactPoint has neither an email nor a url',
    ])
    expect(problems({ contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: 'a@b.c' }] })).toEqual([
      'contactPoint has no availableLanguage',
    ])
  })

  it('wants sameAs to hold the company profiles and nothing else', () => {
    expect(problems({ sameAs: undefined })).toEqual(['Organization has no sameAs'])
    expect(problems({ sameAs: [...sameAsAllowed, 'https://github.com/someone-else'] })).toEqual([
      "sameAs lists https://github.com/someone-else, which is not one of the company's profiles",
    ])
    expect(problems({ sameAs: ['https://github.com/wslatl', 'https://old-domain.example'] })).toHaveLength(1)
  })

  it('reads the profiles the pages list', () => {
    const { parsed } = page({ path: '/', jsonLd: [organization] })
    expect(sameAsOf([{ url: origin, page: parsed }])).toEqual(sameAsAllowed)
  })
})

describe('the language rules', () => {
  const pageIn = (locale: string, change: Record<string, unknown> = {}, path = '/games') => ({
    url: expectedUrl(origin, locale, path),
    page: { ...page({ locale, path }).parsed, ...change },
  })

  it('pass a translated page that has its own words', () => {
    expect(checkLanguages([pageIn('en'), pageIn('es'), pageIn('de')])).toEqual([])
  })

  it('catch a translated title, description or picture text left in English', () => {
    const english = pageIn('en')
    const copy = (field: string) => checkLanguages([english, pageIn('es', { [field]: english.page[field as keyof typeof english.page] })])
    expect(copy('title')).toEqual(['/es/games: the title is the English one'])
    expect(copy('description')).toEqual(['/es/games: the description is the English one'])
    expect(copy('ogImageAlt')).toEqual(['/es/games: og:image:alt is the English one'])
    expect(copy('twitterImageAlt')).toEqual(['/es/games: twitter:image:alt is the English one'])
  })

  it('catch a company description left in English on a translated home page', () => {
    const english = pageIn('en', {}, '/')
    const spanish = { url: expectedUrl(origin, 'es', '/'), page: page({ locale: 'es', path: '/', jsonLd: [fullOrganization] }).parsed }
    const englishWithOrg = { ...english, page: page({ path: '/', jsonLd: [fullOrganization] }).parsed }
    expect(checkLanguages([englishWithOrg, spanish]).filter((problem) => problem.includes('Organization'))).toEqual([
      '/es: the Organization description is the English one',
    ])
  })

  it('lets a named page keep a brand word', () => {
    const english = pageIn('en')
    const same = pageIn('es', { title: english.page.title })
    expect(checkLanguages([english, same], ['es /games'])).toEqual([])
  })
})

describe('the hreflang return-link rules', () => {
  const set = (path = '/games') =>
    locales.map((locale) => ({ url: expectedUrl(origin, locale, path), page: page({ locale, path }).parsed }))

  it('pass pages that list each other', () => {
    expect(checkReciprocity(set())).toEqual([])
  })

  it('catch a page that does not list the page that lists it', () => {
    const pages = set()
    // The Spanish page stops listing the German one.
    const es = pages.find((entry) => entry.url.endsWith('/es/games'))!
    es.page = { ...es.page, alternates: { ...es.page.alternates, de: es.url } }
    expect(checkReciprocity(pages)).toEqual([`${origin}/es/games does not list ${origin}/de/games back as de`])
  })

  it('catch an alternate that was never fetched', () => {
    const pages = set().slice(0, 4)
    expect(checkReciprocity(pages)).toEqual(expect.arrayContaining([expect.stringContaining('which was not fetched')]))
  })
})

describe('the sitemap against the pages', () => {
  it('pass when the sitemap and the page list the same alternates', () => {
    const pages = [{ url: origin, page: page({ path: '/' }).parsed }]
    expect(checkSitemapAgreement([sitemapEntry('/')], pages)).toEqual([])
  })

  it('catch a sitemap and a page that drifted apart', () => {
    const { parsed } = page({ path: '/' })
    const drifted = { ...parsed, alternates: { ...parsed.alternates, fr: `${origin}/fr/old` } }
    expect(checkSitemapAgreement([sitemapEntry('/')], [{ url: origin, page: drifted }])).toEqual([
      `${origin}: the sitemap and the page list different alternates`,
    ])
  })
})

describe('the 404 page rules', () => {
  const notFound = (locale: string, extra = '', lang: string | undefined = undefined) => {
    const en = locale === 'en'
    const title = en ? 'Page not found | WSLATL' : `Not found in ${locale} | WSLATL`
    const html = `<html${lang ? ` lang="${lang}"` : ''}><head><meta name="robots" content="noindex"/><title>${title}</title><meta name="description" content="${en ? 'Body' : `Body ${locale}`}"/><meta property="og:title" content="${title}"/><meta property="og:locale" content="${openGraphLocales[locale as keyof typeof openGraphLocales]}"/>${extra}</head><body><div${lang === undefined ? ` lang="${locale}"` : ''}>x</div></body></html>`
    return readPage(html)
  }
  const english = notFound('en')

  it('pass a 404 in each language with its own title and og:locale', () => {
    for (const locale of locales) expect(checkNotFound(notFound(locale), { locale, english }), locale).toEqual([])
  })

  it('catch an English title or og:locale under a translated address', () => {
    const wrong = { ...notFound('es'), title: english.title, ogTitle: english.title, ogLocale: 'en_US' }
    expect(checkNotFound(wrong, { locale: 'es', english })).toEqual(['title is the English one', 'og:locale is en_US, expected es_ES'])
  })

  it('catch a wrong language and a title with no brand', () => {
    expect(checkNotFound(notFound('fr', '', 'en'), { locale: 'fr', english })).toEqual(['html lang is "en", expected "fr"'])
    expect(checkNotFound({ ...notFound('fr'), title: 'Introuvable', ogTitle: 'Introuvable' }, { locale: 'fr', english })).toEqual([
      'title is "Introuvable", expected it to end in " | WSLATL"',
    ])
  })

  it('want the wrapper lang when there is no html lang', () => {
    const bare = { ...notFound('fr'), bodyLang: undefined }
    expect(checkNotFound(bare, { locale: 'fr', english })).toEqual(['no html lang and the page wrapper lang is "missing", expected "fr"'])
    expect(checkNotFound({ ...bare, bodyLang: 'en' }, { locale: 'fr', english })).toEqual(['no html lang and the page wrapper lang is "en", expected "fr"'])
  })

  it('allow two noindex tags but never one that allows indexing', () => {
    expect(checkNotFound(notFound('de', '<meta name="robots" content="noindex"/>'), { locale: 'de', english })).toEqual([])
    expect(checkNotFound(notFound('de', '<meta name="robots" content="index, follow"/>'), { locale: 'de', english })).toEqual([
      'a robots tag says "index, follow" on a 404 page',
    ])
    const noRobots = { ...notFound('de'), robotsAll: [] }
    expect(checkNotFound(noRobots, { locale: 'de', english })).toEqual(['no robots noindex'])
  })
})

describe('the structured data rules', () => {
  const organization = fullOrganization

  it('rejects JSON that does not parse', () => {
    const { url, parsed } = page()
    const broken = readPage(page().html.replace('</head>', '<script type="application/ld+json">{oops</script></head>'))
    expect(checkPage(broken, { url, origin })).toEqual([expect.stringContaining('not valid JSON')])
    expect(parsed.jsonLd).toHaveLength(1)
  })

  it('wants the schema.org address itself as the context, not one that merely contains it', () => {
    const trail = crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])
    expect(problemsOf({ jsonLd: [{ ...trail, '@context': 'https://schema.org.example.com' }] })).toEqual([
      'structured data @context is not schema.org',
    ])
    expect(problemsOf({ jsonLd: [{ ...trail, '@context': 'https://example.com/schema.org' }] })).toEqual([
      'structured data @context is not schema.org',
    ])
    expect(problemsOf({ jsonLd: [{ ...trail, '@context': 'http://schema.org/' }] })).toEqual([])
  })

  it('wants WebSite data on the English home page only', () => {
    const site = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'WSLATL', url: origin }
    expect(problemsOf({ path: '/', jsonLd: [organization] })).toEqual(['0 WebSite blocks on the home page, expected 1'])
    expect(problemsOf({ path: '/', jsonLd: [organization, site] })).toEqual([])
    expect(problemsOf({ path: '/', locale: 'es', jsonLd: [organization, site] })).toEqual(['WebSite data belongs on the English home page only'])
  })

  it('wants a breadcrumb trail that starts at home and ends on the page', () => {
    expect(problemsOf({ jsonLd: [] })).toEqual(['0 BreadcrumbList blocks, expected 1'])
    expect(problemsOf({ jsonLd: [crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/legal`)])] })).toEqual([
      `BreadcrumbList ends on ${origin}/legal, expected ${origin}/games`,
    ])
    expect(problemsOf({ jsonLd: [crumbs([item(1, 'Home', origin), item(3, 'Games', `${origin}/games`)])] })).toEqual([
      'BreadcrumbList item 2 has position 3',
    ])
    expect(problemsOf({ locale: 'de', jsonLd: [crumbs([item(1, 'Start', origin), item(2, 'Spiele', `${origin}/de/games`)])] })).toEqual([
      `BreadcrumbList starts on ${origin}, expected the home page`,
    ])
  })

  const faqBody = '<main><h1>Games</h1><details class="faq-item"><summary>How do I pay?</summary><p>By card.</p></details></main>'
  const base = [crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])]

  it('wants FAQPage data to match the questions and answers the page shows', () => {
    expect(problemsOf({ body: faqBody, jsonLd: [...base, faqBlock('How do I pay?', 'By card.')] })).toEqual([])
    expect(problemsOf({ body: faqBody, jsonLd: base })).toEqual(['1 questions on the page and 0 FAQPage blocks, expected 1'])
    expect(problemsOf({ body: faqBody, jsonLd: [...base, faqBlock('How do I pay?', 'By cheque.')] })).toEqual([
      'FAQPage answer not shown on the page: How do I pay?',
    ])
    expect(problemsOf({ body: faqBody, jsonLd: [...base, faqBlock('Why?', 'By card.')] })).toEqual([
      'FAQPage question not shown on the page: Why?',
    ])
    expect(problemsOf({ jsonLd: [...base, faqBlock('How do I pay?', 'By card.')] })).toEqual(
      expect.arrayContaining(['FAQPage data on a page with no questions']),
    )
  })

  it('wants the pricing page to carry offers, and each price to be one the page shows', () => {
    const body = '<main><h1>Pricing</h1><p>P-VPS-2 $6.50 a month</p></main>'
    const onPricing = [crumbs([item(1, 'Home', origin), item(2, 'Pricing', `${origin}/pricing`)])]
    const check = (jsonLd: unknown[]) => problemsOf({ path: '/pricing', body, jsonLd })
    expect(check(onPricing)).toEqual(['the pricing page has plans but no Offer data'])
    expect(check([...onPricing, offer('6.50')])).toEqual([])
    expect(check([...onPricing, offer('9.99')])).toEqual(['Offer price 9.99 is not shown on the page'])
    expect(check([...onPricing, { '@type': 'Product', name: 'P-VPS-2', sku: 'P-VPS-2' }])).toEqual([
      'the pricing page has plans but no Offer data',
      'Product P-VPS-2 has no offers',
    ])
  })

  it('wants every offer to say it is available, and every product to have a sku', () => {
    const body = '<main><h1>Pricing</h1><p>P-VPS-2 $6.50 a month</p></main>'
    const onPricing = [crumbs([item(1, 'Home', origin), item(2, 'Pricing', `${origin}/pricing`)])]
    const check = (jsonLd: unknown[]) => problemsOf({ path: '/pricing', body, jsonLd })
    expect(check([...onPricing, offer('6.50', {})])).toEqual(['Offer without an availability (a schema.org address)'])
    expect(check([...onPricing, { ...offer('6.50'), sku: undefined }])).toEqual(['Product Premium VPS P-VPS-2 has no sku'])
  })

  it('is satisfied by the pricing page data the site really sends', () => {
    const plans = productLines.flatMap((line) => line.groups.flatMap((group) => group.plans))
    const html = renderToStaticMarkup(createElement(PricingJsonLd, { lines: productLines, locale: 'en' }))
    type Entry = { item: { name: string; sku: string; offers: { price: string; priceCurrency: string; availability: string } } }
    const data = readPage(html).jsonLd[0].data as { itemListElement: Entry[] }
    expect(data.itemListElement.map((entry) => [entry.item.sku, entry.item.offers.price])).toEqual(
      plans.map((plan) => [plan.name, plan.price.toFixed(2)]),
    )
    expect(new Set(data.itemListElement.map((entry) => entry.item.offers.priceCurrency))).toEqual(new Set(['USD']))
    expect(new Set(data.itemListElement.map((entry) => entry.item.offers.availability))).toEqual(new Set(['https://schema.org/InStock']))
    for (const entry of data.itemListElement) expect(entry.item.name).toContain(entry.item.sku)
  })
})

function sitemapEntry(path: string, overrides: Record<string, string> = {}) {
  const alternates = Object.fromEntries(
    alternateKeys.map((key) => [key, expectedUrl(origin, key === 'x-default' ? 'en' : key, path)]),
  )
  return { loc: expectedUrl(origin, 'en', path), alternates: { ...alternates, ...overrides } }
}

describe('the sitemap rules', () => {
  const full = [sitemapEntry('/'), sitemapEntry('/games')].flatMap((e) =>
    locales.map((l) => ({ loc: expectedUrl(origin, l, new URL(e.loc).pathname), alternates: e.alternates })),
  )

  it('passes a sitemap that lists every page in every language once', () => {
    expect(checkSitemap(full, { origin })).toEqual([])
  })

  it('catches a page listed twice, a page off the site, and a trailing slash', () => {
    expect(checkSitemap([...full, full[0]], { origin })).toEqual([`${full[0].loc} is listed more than once`])
    expect(checkSitemap([{ ...full[0], loc: 'https://example.com/' }, ...full.slice(1)], { origin })).toEqual(
      expect.arrayContaining(['https://example.com/ is not on https://wslatl.com']),
    )
    expect(checkSitemap([...full, { ...sitemapEntry('/legal/'), loc: `${origin}/legal/` }], { origin })).toEqual(
      expect.arrayContaining([`${origin}/legal/ ends in a slash`]),
    )
  })

  it('catches a missing language, a missing x-default, and an alternate the sitemap does not list', () => {
    const { fr: _fr, ...noFrench } = sitemapEntry('/games').alternates
    expect(checkSitemap([{ ...full[0], alternates: noFrench }], { origin })[0]).toContain('lists alternates')
    const { 'x-default': _x, ...noDefault } = sitemapEntry('/games').alternates
    expect(checkSitemap([{ ...full[0], alternates: noDefault }], { origin })[0]).toContain('lists alternates')
    expect(checkSitemap(full.slice(0, 1), { origin })).toEqual(expect.arrayContaining([expect.stringContaining('which the sitemap does not list')]))
  })

  it('reads the entries and their alternates from the XML', () => {
    const xml = `<urlset><url><loc>${origin}/games</loc><xhtml:link rel="alternate" hreflang="es" href="${origin}/es/games"/><xhtml:link rel="alternate" hreflang="x-default" href="${origin}/games"/></url></urlset>`
    expect(readSitemap(xml)).toEqual([
      { loc: `${origin}/games`, alternates: { es: `${origin}/es/games`, 'x-default': `${origin}/games` } },
    ])
  })
})

describe('the robots.txt rules', () => {
  const good = `User-Agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  it('pass a file that allows the site and names the sitemap', () => {
    expect(checkRobots(good, { origin })).toEqual([])
  })
  it('judge only the group for every crawler, not the named ones Cloudflare adds', () => {
    const cloudflare = `# managed
User-agent: *
Content-Signal: search=yes
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: AwarioSmartBot
User-agent: AwarioRssBot
Disallow: /

User-Agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
    expect(checkRobots(cloudflare, { origin })).toEqual([])
    expect(checkRobots(`User-agent: GPTBot
Disallow: /

Sitemap: ${origin}/sitemap.xml`, { origin })).toEqual(['no User-agent: * group'])
    expect(checkRobots(`User-agent: Googlebot
User-agent: *
Disallow: /
Sitemap: ${origin}/sitemap.xml`, { origin })).toEqual([
      'Disallow: / blocks the whole site',
    ])
  })
  it('catch a blocked site, a blocked admin, and a missing or wrong sitemap', () => {
    expect(checkRobots(good.replace('Allow: /', 'Disallow: /'), { origin })).toEqual(['Disallow: / blocks the whole site'])
    expect(checkRobots(`${good}Disallow: /admin\n`, { origin })).toEqual([
      'the admin is disallowed, so a search engine would never see its noindex',
    ])
    expect(checkRobots('User-Agent: *\nAllow: /\n', { origin })).toEqual(['no Sitemap line'])
    expect(checkRobots(good.replace(origin, 'http://localhost:3000'), { origin })).toEqual([
      `Sitemap line is http://localhost:3000/sitemap.xml, expected ${origin}/sitemap.xml`,
    ])
  })
})

const parsed = (title: string, description: string) => ({ ...page().parsed, title, description })

describe('the duplicate rule', () => {
  it('lets the same words sit in different languages but not twice in one', () => {
    expect(
      checkDuplicates([
        { url: `${origin}/games`, page: parsed('Games', 'Plans') },
        { url: `${origin}/es/games`, page: parsed('Games', 'Plans') },
      ]),
    ).toEqual([])
    expect(
      checkDuplicates([
        { url: `${origin}/pricing`, page: parsed('Same', 'One') },
        { url: `${origin}/games`, page: parsed('Same', 'Two') },
      ]),
    ).toEqual([`2 pages share one title: ${origin}/pricing, ${origin}/games`])
  })
})

describe('the link rules', () => {
  it('keeps pages of the site and leaves out mail, other hosts and fragments', () => {
    expect(
      internalLinks(['/pricing', '/pricing#vps', 'https://wslatl.com/games', 'https://example.com/x', 'mailto:a@b.c', '#top', '/es'], 'http://localhost:3000', origin),
    ).toEqual(['/es', '/games', '/pricing'].toSorted())
  })

  it('flags a page that is gone or moved for good, and lets a short link redirect', () => {
    expect(linkProblem(200)).toBeNull()
    expect(linkProblem(307)).toBeNull()
    expect(linkProblem(404)).toBe('answers 404')
    expect(linkProblem(500)).toBe('answers 500')
    expect(linkProblem(308)).toContain('moved for good')
    expect(linkProblem(301)).toContain('moved for good')
  })
})

describe('the partner language rule', () => {
  const entry = (path: string, description: string) => ({
    url: `${origin}${path}`,
    page: readPage(`<html><head><meta name="description" content="${description}"/></head><body></body></html>`),
  })
  const tagline = 'Making mods and playing games while serving my community.'

  it('passes a translated description with its own words', () => {
    expect(checkPartnerLanguages([entry('/partners/a', `${tagline} Sign up.`), entry('/es/partners/a', 'Regístrate con el código A.')])).toEqual([])
  })

  it('catches one that opens with the English tagline', () => {
    expect(checkPartnerLanguages([entry('/partners/a', `${tagline} Sign up.`), entry('/es/partners/a', `${tagline} Regístrate.`)])).toEqual([
      '/es/partners/a: the description opens with the English tagline',
    ])
  })
})

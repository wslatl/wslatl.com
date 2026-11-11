import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PricingJsonLd } from '@/components/seo/pricing-json-ld'
import { productLines } from '@/data/pricing'
import { defaultLocale, locales, openGraphLocales } from '@/i18n/config'
import {
  alternateKeys,
  checkDuplicates,
  checkPage,
  checkRobots,
  checkSitemap,
  expectedUrl,
  internalLinks,
  linkProblem,
  readPage,
  readSitemap,
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

/** A page that passes every rule, to break one thing at a time. */
function page({ locale = 'en', path = '/games', omit = [], extraHead = '', body, jsonLd }: PageOptions = {}) {
  const url = expectedUrl(origin, locale, path)
  const has = (tag: string) => !omit.includes(tag)
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: expectedUrl(origin, locale, '/') },
      { '@type': 'ListItem', position: 2, name: 'Games', item: url },
    ],
  }
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'WSLATL LLC', url: origin, logo: `${origin}/logo.png` }
  const blocks = jsonLd ?? [organization, crumbs]
  const alternates = alternateKeys
    .map((key) => `<link rel="alternate" hreflang="${key}" href="${expectedUrl(origin, key === 'x-default' ? 'en' : key, path)}"/>`)
    .join('')
  const html = `<!DOCTYPE html><html lang="${locale}"><head>
    ${has('title') ? '<title>Games | WSLATL</title>' : ''}
    ${has('description') ? '<meta name="description" content="Plans for game servers and VPS, with prices that are on the page."/>' : ''}
    ${has('canonical') ? `<link rel="canonical" href="${url}"/>` : ''}
    ${has('hreflang') ? alternates : ''}
    ${has('og') ? `<meta property="og:title" content="Pricing"/><meta property="og:description" content="Plans"/><meta property="og:url" content="${url}"/><meta property="og:locale" content="${openGraphLocales[locale as keyof typeof openGraphLocales]}"/><meta property="og:image" content="/og?path=${path}"/>` : ''}
    ${has('twitter') ? '<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="/og"/>' : ''}
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
})

describe('the page rules', () => {
  it('pass a complete page in every language', () => {
    for (const locale of locales) expect(problemsOf({ locale }), locale).toEqual([])
  })

  it('want a title, and one that is not cut off in results', () => {
    expect(problemsOf({ omit: ['title'] })).toContain('no title')
    const { url, parsed } = page()
    expect(checkPage({ ...parsed, title: 'x'.repeat(90) }, { url, origin })).toEqual([expect.stringContaining('title is 90 characters')])
  })

  it('want a description of a sensible length', () => {
    expect(problemsOf({ omit: ['description'] })).toContain('no meta description')
    const { url, parsed } = page()
    expect(checkPage({ ...parsed, description: 'Short.' }, { url, origin })).toEqual([expect.stringContaining('only 6 characters')])
    expect(checkPage({ ...parsed, description: 'x'.repeat(300) }, { url, origin })).toEqual([expect.stringContaining('300 characters')])
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
      expect.arrayContaining(['no og:image', 'no og:title', 'no og:description']),
    )
    expect(problemsOf({ omit: ['twitter'] })).toEqual(['twitter:card is not summary_large_image', 'no twitter:image'])
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

describe('the structured data rules', () => {
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'WSLATL LLC', url: origin, logo: `${origin}/logo.png` }
  const crumbs = (items: unknown[]) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })
  const item = (position: number, name: string, href: string) => ({ '@type': 'ListItem', position, name, item: href })

  it('rejects JSON that does not parse', () => {
    const { url, parsed } = page()
    const broken = readPage(page().html.replace('</head>', '<script type="application/ld+json">{oops</script></head>'))
    expect(checkPage(broken, { url, origin })).toEqual([expect.stringContaining('not valid JSON')])
    expect(parsed.jsonLd).toHaveLength(2)
  })

  it('wants one Organization with a name, the site address and a logo', () => {
    expect(problemsOf({ jsonLd: [crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])] })).toEqual([
      '0 Organization blocks, expected 1',
    ])
    expect(problemsOf({ jsonLd: [{ ...organization, url: 'https://example.com' }, crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])] })).toEqual([
      `Organization url is https://example.com, expected ${origin}`,
    ])
  })

  it('wants the schema.org address itself as the context, not one that merely contains it', () => {
    const trail = crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])
    expect(problemsOf({ jsonLd: [{ ...organization, '@context': 'https://schema.org.example.com' }, trail] })).toEqual([
      'structured data @context is not schema.org',
    ])
    expect(problemsOf({ jsonLd: [{ ...organization, '@context': 'https://example.com/schema.org' }, trail] })).toEqual([
      'structured data @context is not schema.org',
    ])
    expect(problemsOf({ jsonLd: [{ ...organization, '@context': 'http://schema.org/' }, trail] })).toEqual([])
  })

  it('wants WebSite data on the English home page only', () => {
    const site = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'WSLATL', url: origin }
    expect(problemsOf({ path: '/', jsonLd: [organization] })).toEqual(['0 WebSite blocks on the home page, expected 1'])
    expect(problemsOf({ path: '/', jsonLd: [organization, site] })).toEqual([])
    expect(problemsOf({ path: '/', locale: 'es', jsonLd: [organization, site] })).toEqual(['WebSite data belongs on the English home page only'])
  })

  it('wants a breadcrumb trail that starts at home and ends on the page', () => {
    expect(problemsOf({ jsonLd: [organization] })).toEqual(['0 BreadcrumbList blocks, expected 1'])
    expect(problemsOf({ jsonLd: [organization, crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/legal`)])] })).toEqual([
      `BreadcrumbList ends on ${origin}/legal, expected ${origin}/games`,
    ])
    expect(problemsOf({ jsonLd: [organization, crumbs([item(1, 'Home', origin), item(3, 'Games', `${origin}/games`)])] })).toEqual([
      'BreadcrumbList item 2 has position 3',
    ])
    expect(problemsOf({ locale: 'de', jsonLd: [organization, crumbs([item(1, 'Start', origin), item(2, 'Spiele', `${origin}/de/games`)])] })).toEqual([
      `BreadcrumbList starts on ${origin}, expected the home page`,
    ])
  })

  const faqBlock = (name: string, text: string) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }],
  })
  const faqBody = '<main><h1>Games</h1><details class="faq-item"><summary>How do I pay?</summary><p>By card.</p></details></main>'
  const base = [organization, crumbs([item(1, 'Home', origin), item(2, 'Games', `${origin}/games`)])]

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
    const offer = (price: string) => ({ '@type': 'Product', name: 'P-VPS-2', offers: { '@type': 'Offer', price, priceCurrency: 'USD' } })
    const body = '<main><h1>Pricing</h1><p>P-VPS-2 $6.50 a month</p></main>'
    const onPricing = [organization, crumbs([item(1, 'Home', origin), item(2, 'Pricing', `${origin}/pricing`)])]
    const check = (jsonLd: unknown[]) => problemsOf({ path: '/pricing', body, jsonLd })
    expect(check(onPricing)).toEqual(['the pricing page has plans but no Offer data'])
    expect(check([...onPricing, offer('6.50')])).toEqual([])
    expect(check([...onPricing, offer('9.99')])).toEqual(['Offer price 9.99 is not shown on the page'])
    expect(check([...onPricing, { '@type': 'Product', name: 'P-VPS-2' }])).toEqual([
      'the pricing page has plans but no Offer data',
      'Product P-VPS-2 has no offers',
    ])
  })

  it('is satisfied by the pricing page data the site really sends', () => {
    const plans = productLines.flatMap((line) => line.groups.flatMap((group) => group.plans))
    const html = renderToStaticMarkup(createElement(PricingJsonLd, { lines: productLines, locale: 'en' }))
    const data = readPage(html).jsonLd[0].data as { itemListElement: { item: { name: string; offers: { price: string; priceCurrency: string } } }[] }
    expect(data.itemListElement.map((entry) => [entry.item.name, entry.item.offers.price])).toEqual(
      plans.map((plan) => [plan.name, plan.price.toFixed(2)]),
    )
    expect(new Set(data.itemListElement.map((entry) => entry.item.offers.priceCurrency))).toEqual(new Set(['USD']))
  })
})

function entry(path: string, overrides: Record<string, string> = {}) {
  const alternates = Object.fromEntries(
    alternateKeys.map((key) => [key, expectedUrl(origin, key === 'x-default' ? 'en' : key, path)]),
  )
  return { loc: expectedUrl(origin, 'en', path), alternates: { ...alternates, ...overrides } }
}

describe('the sitemap rules', () => {
  const full = [entry('/'), entry('/games')].flatMap((e) =>
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
    expect(checkSitemap([...full, { ...entry('/legal/'), loc: `${origin}/legal/` }], { origin })).toEqual(
      expect.arrayContaining([`${origin}/legal/ ends in a slash`]),
    )
  })

  it('catches a missing language, a missing x-default, and an alternate the sitemap does not list', () => {
    const { fr: _fr, ...noFrench } = entry('/games').alternates
    expect(checkSitemap([{ ...full[0], alternates: noFrench }], { origin })[0]).toContain('lists alternates')
    const { 'x-default': _x, ...noDefault } = entry('/games').alternates
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

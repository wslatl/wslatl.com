// The rules scripts/check-seo.mjs applies. Everything here is a pure function
// of text (a page's HTML, the sitemap, robots.txt), so tests/seo-rules.test.ts
// can feed each rule a good page and a broken one without a server.

/** The languages the site ships in, and the one at plain paths. i18n/config.ts is the source; tests/seo-rules.test.ts checks this agrees. */
export const locales = ['en', 'es', 'fr', 'de', 'pt']
export const defaultLocale = 'en'

/** The hreflang codes a page lists: every language, and the fallback. */
export const alternateKeys = [...locales, 'x-default']

/** Open Graph language codes, per language (mirrors openGraphLocales in i18n/config.ts). */
export const openGraphLocales = { en: 'en_US', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', pt: 'pt_BR' }

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#x27': "'", '#39': "'" }
export const decode = (text) => text.replace(/&(amp|lt|gt|quot|apos|#x27|#39);/g, (_, name) => entities[name])

/** The attributes of one tag, by name. */
function attributes(tag) {
  const found = {}
  for (const [, name, quoted, plain] of tag.matchAll(/([a-zA-Z:-]+)(?:=(?:"([^"]*)"|([^\s>]+)))?/g)) {
    found[name.toLowerCase()] ??= decode(quoted ?? plain ?? '')
  }
  return found
}

const tagsOf = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attributes(m[0]))

/** Everything a search engine or a link preview reads from a page's HTML. */
export function readPage(html) {
  const metas = tagsOf(html, 'meta')
  const meta = (key) => metas.find((m) => m.name === key || m.property === key)?.content
  const links = tagsOf(html, 'link')

  const alternates = {}
  for (const link of links) {
    if (link.rel === 'alternate' && link.hreflang) alternates[link.hreflang] = link.href
  }

  const jsonLd = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      return { data: JSON.parse(m[1]) }
    } catch (error) {
      return { error: error.message }
    }
  })

  const body = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => visibleText(m[1]))
  const images = tagsOf(body, 'img')

  return {
    lang: html.match(/<html\b[^>]*\blang="([^"]*)"/i)?.[1],
    title: decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim(),
    description: meta('description'),
    robots: meta('robots'),
    canonical: links.find((l) => l.rel === 'canonical')?.href,
    alternates,
    ogImage: meta('og:image'),
    ogTitle: meta('og:title'),
    ogDescription: meta('og:description'),
    ogUrl: meta('og:url'),
    ogLocale: meta('og:locale'),
    twitterCard: meta('twitter:card'),
    twitterImage: meta('twitter:image'),
    h1s,
    images,
    faqItems: [...body.matchAll(/<details\b[^>]*class="[^"]*\bfaq-item\b/gi)].length,
    preloadedImages: links.filter((l) => l.rel === 'preload' && l.as === 'image').map((l) => l.href),
    jsonLd,
    text: visibleText(body),
    hrefs: [...body.matchAll(/<a\b[^>]*>/gi)].map((m) => attributes(m[0]).href).filter(Boolean),
  }
}

/** Text as a reader sees it, without markup or runs of whitespace. */
export function visibleText(html) {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

/** The path of a page without its language prefix: /es/pricing is /pricing. */
export function pathWithoutLocale(pathname) {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/)
  return match && locales.includes(match[1]) && match[1] !== defaultLocale ? pathname.slice(3) || '/' : pathname
}

export function localeOfPath(pathname) {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/)
  return match && locales.includes(match[1]) && match[1] !== defaultLocale ? match[1] : defaultLocale
}

/** The URL one page has in one language, on the site's own origin. */
export function expectedUrl(origin, locale, path) {
  const localized = locale === defaultLocale ? path : `/${locale}${path === '/' ? '' : path}`
  return localized === '/' ? origin : `${origin}${localized}`
}

// Search results cut a title near 60 characters and a description near 160.
// These are the points past which the cut is certain, not the ideal lengths.
export const limits = { title: 75, descriptionMin: 30, descriptionMax: 220 }

/**
 * Problems with one page's head and body. `url` is the page's address as the
 * sitemap lists it (on the site's real origin); `origin` is that origin.
 */
export function checkPage(page, { url, origin }) {
  const problems = []
  const pathname = new URL(url).pathname
  const locale = localeOfPath(pathname)
  const path = pathWithoutLocale(pathname)

  if (!page.title) problems.push('no title')
  else if (page.title.length > limits.title) problems.push(`title is ${page.title.length} characters (over ${limits.title})`)

  if (!page.description) problems.push('no meta description')
  else if (page.description.length < limits.descriptionMin) problems.push(`description is only ${page.description.length} characters`)
  else if (page.description.length > limits.descriptionMax)
    problems.push(`description is ${page.description.length} characters (over ${limits.descriptionMax})`)

  if (page.lang !== locale) problems.push(`html lang is "${page.lang}", expected "${locale}"`)
  if (/\bnoindex\b/i.test(page.robots ?? '')) problems.push('a public page says noindex')

  if (page.canonical !== url) problems.push(`canonical is ${page.canonical ?? 'missing'}, expected ${url}`)

  for (const key of alternateKeys) {
    const expected = expectedUrl(origin, key === 'x-default' ? defaultLocale : key, path)
    if (page.alternates[key] !== expected) problems.push(`hreflang ${key} is ${page.alternates[key] ?? 'missing'}, expected ${expected}`)
  }
  for (const key of Object.keys(page.alternates)) {
    if (!alternateKeys.includes(key)) problems.push(`hreflang ${key} is not a language of the site`)
  }

  if (page.ogUrl !== url) problems.push(`og:url is ${page.ogUrl ?? 'missing'}, expected ${url}`)
  if (!page.ogTitle) problems.push('no og:title')
  if (!page.ogDescription) problems.push('no og:description')
  if (page.ogLocale !== openGraphLocales[locale]) problems.push(`og:locale is ${page.ogLocale ?? 'missing'}, expected ${openGraphLocales[locale]}`)
  if (!page.ogImage) problems.push('no og:image')
  if (page.twitterCard !== 'summary_large_image') problems.push('twitter:card is not summary_large_image')
  if (!page.twitterImage) problems.push('no twitter:image')

  if (page.h1s.length !== 1) problems.push(`${page.h1s.length} h1 headings, expected 1`)
  else if (!page.h1s[0]) problems.push('the h1 is empty')

  const unnamed = page.images.filter((img) => img.alt === undefined)
  if (unnamed.length) problems.push(`${unnamed.length} image(s) with no alt attribute (${unnamed.map((i) => i.src ?? '?').slice(0, 3).join(', ')})`)

  problems.push(...checkStructuredData(page, { url, origin, path, locale }))
  return problems
}

const normal = (text) => visibleText(String(text)).toLowerCase()
const asList =(value) => (Array.isArray(value) ? value : value === undefined ? [] : [value])
const typesOf = (node) => asList(node?.['@type'])

/** Every JSON-LD node on the page, however deeply nested (a Product inside a list item, an Offer inside a Product). */
function nodesOf(page) {
  const found = []
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit)
    if (!value || typeof value !== 'object') return
    if (value['@type']) found.push(value)
    Object.values(value).forEach(visit)
  }
  page.jsonLd.forEach((block) => visit(block.data))
  return found
}

/** The whole address, never a part of one: "schema.org" can sit inside any other host's address. */
const schemaContexts = new Set(['https://schema.org', 'https://schema.org/', 'http://schema.org', 'http://schema.org/'])

/**
 * Structured data has to parse, say what the page says, and keep to what
 * Google asks of each type. Prices and questions are compared with the
 * page's own text: data a reader cannot see on the page is a policy violation.
 */
export function checkStructuredData(page, { url, origin, path, locale }) {
  const problems = []
  page.jsonLd.forEach((block, i) => {
    if (block.error) problems.push(`structured data block ${i + 1} is not valid JSON (${block.error})`)
  })
  const nodes = nodesOf(page)
  for (const node of nodes) {
    if (node['@context'] !== undefined && !schemaContexts.has(String(node['@context']))) problems.push('structured data @context is not schema.org')
  }
  const ofType = (type) => nodes.filter((node) => typesOf(node).includes(type))

  const organizations = ofType('Organization')
  if (organizations.length !== 1) problems.push(`${organizations.length} Organization blocks, expected 1`)
  for (const org of organizations) {
    if (!org.name) problems.push('Organization has no name')
    if (org.url !== origin) problems.push(`Organization url is ${org.url}, expected ${origin}`)
    if (!org.logo) problems.push('Organization has no logo')
  }

  const sites = ofType('WebSite')
  if (path === '/' && locale === defaultLocale) {
    if (sites.length !== 1) problems.push(`${sites.length} WebSite blocks on the home page, expected 1`)
    for (const site of sites) {
      if (!site.name) problems.push('WebSite has no name')
      if (site.url !== origin) problems.push(`WebSite url is ${site.url}, expected ${origin}`)
    }
  } else if (sites.length) {
    problems.push('WebSite data belongs on the English home page only')
  }

  const crumbs = ofType('BreadcrumbList')
  if (path !== '/') {
    if (crumbs.length !== 1) problems.push(`${crumbs.length} BreadcrumbList blocks, expected 1`)
  }
  for (const list of crumbs) {
    const items = asList(list.itemListElement)
    if (items.length < 2) problems.push('BreadcrumbList has fewer than two items')
    items.forEach((item, i) => {
      if (item.position !== i + 1) problems.push(`BreadcrumbList item ${i + 1} has position ${item.position}`)
      if (!item.name) problems.push(`BreadcrumbList item ${i + 1} has no name`)
      if (!item.item || !String(item.item).startsWith(origin)) problems.push(`BreadcrumbList item ${i + 1} has no address on the site`)
    })
    const last = items.at(-1)
    if (last && last.item !== url) problems.push(`BreadcrumbList ends on ${last.item}, expected ${url}`)
    if (items[0] && items[0].item !== expectedUrl(origin, locale, '/')) problems.push(`BreadcrumbList starts on ${items[0].item}, expected the home page`)
  }

  // A page that shows questions and answers must say so in FAQPage data,
  // and data for questions it does not show is not allowed.
  const faqs = ofType('FAQPage')
  if (page.faqItems > 0 && faqs.length !== 1) problems.push(`${page.faqItems} questions on the page and ${faqs.length} FAQPage blocks, expected 1`)
  if (page.faqItems === 0 && faqs.length) problems.push('FAQPage data on a page with no questions')
  for (const faq of faqs) {
    if (asList(faq.mainEntity).length !== page.faqItems) problems.push(`FAQPage lists ${asList(faq.mainEntity).length} questions, the page shows ${page.faqItems}`)
  }

  const pageText = normal(page.text)
  for (const faq of faqs) {
    const questions = asList(faq.mainEntity)
    if (!questions.length) problems.push('FAQPage has no questions')
    for (const q of questions) {
      const answer = q.acceptedAnswer?.text
      if (typesOf(q).join() !== 'Question' || !q.name || !answer) {
        problems.push('FAQPage has a question without a name or an answer')
        continue
      }
      if (!pageText.includes(normal(q.name))) problems.push(`FAQPage question not shown on the page: ${q.name}`)
      if (!pageText.includes(normal(answer))) problems.push(`FAQPage answer not shown on the page: ${q.name}`)
    }
  }

  for (const offer of nodes.filter((node) => typesOf(node).includes('Offer'))) {
    if (!(Number(offer.price) >= 0) || !offer.priceCurrency) problems.push('Offer without a price and currency')
    else if (!pageText.includes(Number(offer.price).toFixed(2)) && !pageText.includes(String(Number(offer.price))))
      problems.push(`Offer price ${offer.price} is not shown on the page`)
  }
  if (path === '/pricing' && !nodes.some((node) => typesOf(node).includes('Offer'))) problems.push('the pricing page has plans but no Offer data')
  for (const product of ofType('Product')) {
    if (!product.name) problems.push('Product has no name')
    if (!product.offers) problems.push(`Product ${product.name ?? ''} has no offers`)
  }
  return problems
}

/** Entries of the sitemap: each url, with the alternates it lists. */
export function readSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: decode(m[1].match(/<loc>([^<]*)<\/loc>/)?.[1] ?? '').trim(),
    alternates: Object.fromEntries(
      [...m[1].matchAll(/<xhtml:link\b[^>]*>/g)].map((link) => {
        const a = attributes(link[0])
        return [a.hreflang, a.href]
      }),
    ),
  }))
}

/** Problems with the sitemap itself: duplicates, a wrong origin, or alternates that do not cover the five languages. */
export function checkSitemap(entries, { origin }) {
  const problems = []
  if (!entries.length) return ['the sitemap lists no pages']
  const seen = new Set()
  for (const { loc, alternates } of entries) {
    if (seen.has(loc)) problems.push(`${loc} is listed more than once`)
    seen.add(loc)
    if (!loc.startsWith(origin)) problems.push(`${loc} is not on ${origin}`)
    if (new URL(loc).pathname.endsWith('/') && new URL(loc).pathname !== '/') problems.push(`${loc} ends in a slash`)
    const keys = Object.keys(alternates).toSorted()
    if (keys.join() !== [...alternateKeys].toSorted().join()) problems.push(`${loc} lists alternates ${keys.join(', ') || 'none'}`)
    if (!Object.values(alternates).includes(loc)) problems.push(`${loc} is missing from its own alternates`)
    const path = pathWithoutLocale(new URL(loc).pathname)
    for (const key of alternateKeys) {
      const expected = expectedUrl(origin, key === 'x-default' ? defaultLocale : key, path)
      if (alternates[key] && alternates[key] !== expected) problems.push(`${loc}: ${key} points at ${alternates[key]}, expected ${expected}`)
    }
  }
  // Each alternate has to be a page the sitemap lists itself.
  for (const { loc, alternates } of entries) {
    for (const href of Object.values(alternates)) {
      if (!seen.has(href)) problems.push(`${loc} points at ${href}, which the sitemap does not list`)
    }
  }
  return [...new Set(problems)]
}

/**
 * Problems with robots.txt: it has to allow the site to every crawler in the
 * "*" group, and name the sitemap on the site's own origin. Groups for named
 * crawlers are not judged: Cloudflare adds its own (it turns away AI
 * training crawlers), and what it blocks there is the owner's choice.
 */
export function checkRobots(text, { origin }) {
  const problems = []
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter(Boolean)
  // Lines grouped under the User-agent lines above them; a run of User-agent
  // lines shares the rules that follow.
  const groups = []
  for (const line of lines) {
    const agent = line.match(/^user-agent:\s*(.*)$/i)
    if (agent) {
      if (!groups.length || groups.at(-1).rules.length) groups.push({ agents: [], rules: [] })
      groups.at(-1).agents.push(agent[1].trim())
    } else if (groups.length && !/^sitemap:/i.test(line)) {
      groups.at(-1).rules.push(line)
    }
  }
  const everyone = groups.filter((group) => group.agents.includes('*'))
  if (!everyone.length) problems.push('no User-agent: * group')
  const rules = everyone.flatMap((group) => group.rules)
  if (rules.some((r) => /^disallow:\s*\/\s*$/i.test(r))) problems.push('Disallow: / blocks the whole site')
  if (rules.some((r) => /^disallow:\s*\/admin/i.test(r))) problems.push('the admin is disallowed, so a search engine would never see its noindex')
  const sitemap = lines.find((l) => /^sitemap:/i.test(l))?.replace(/^sitemap:\s*/i, '')
  if (!sitemap) problems.push('no Sitemap line')
  else if (sitemap !== `${origin}/sitemap.xml`) problems.push(`Sitemap line is ${sitemap}, expected ${origin}/sitemap.xml`)
  return problems
}

/** Pages in one language that share a title or a description. Each is reported once. */
export function checkDuplicates(pages) {
  const problems = []
  for (const field of ['title', 'description']) {
    const seen = new Map()
    for (const { url, page } of pages) {
      const value = page[field]
      if (!value) continue
      const key = `${localeOfPath(new URL(url).pathname)}|${value}`
      seen.set(key, [...(seen.get(key) ?? []), url])
    }
    for (const urls of seen.values()) {
      if (urls.length > 1) problems.push(`${urls.length} pages share one ${field}: ${urls.join(', ')}`)
    }
  }
  return problems
}

/**
 * Internal links worth following: paths on the site, without a fragment,
 * deduplicated. Mail and tel links, other hosts, and files are left out.
 */
export function internalLinks(hrefs, base, siteOrigin = new URL(base).origin) {
  const found = new Set()
  for (const href of hrefs) {
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue
    let url
    try {
      url = new URL(href, base)
    } catch {
      continue
    }
    if (url.origin !== new URL(base).origin && url.origin !== siteOrigin) continue
    found.add(url.pathname + url.search)
  }
  return [...found].toSorted()
}

/**
 * Whether a link points somewhere it should not: a page that does not exist,
 * or one that moved for good (the link should name the new address). A short
 * link (/discord) is a deliberate temporary redirect, and is fine.
 */
export function linkProblem(status) {
  if (status === 301 || status === 308) return 'moved for good: link to the new address'
  if (status >= 400) return `answers ${status}`
  return null
}

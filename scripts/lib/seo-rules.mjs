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

/** The name the site goes by: og:site_name, application-name, WebSite and Organization name (siteConfig.brand). */
export const brand = 'WSLATL'

/**
 * The profiles the Organization may list in sameAs. Anything else (an old
 * domain, a personal page, a wrong GitHub) fails. tests/seo-rules.test.ts
 * checks this is the same set as config/links.json.
 */
export const sameAsAllowed = [
  'https://discord.gg/3eKawhSbAF',
  'https://www.trustpilot.com/review/wslatl.com',
  'https://github.com/wslatl',
]

/** The share picture every card has to be: 1200x630, a PNG or a JPEG, under 5 MB. */
export const shareImage = { width: 1200, height: 630, types: ['image/png', 'image/jpeg'], maxBytes: 5 * 1024 * 1024 }

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
    ogImageAlt: meta('og:image:alt'),
    ogImageWidth: meta('og:image:width'),
    ogImageHeight: meta('og:image:height'),
    ogImageType: meta('og:image:type'),
    ogSiteName: meta('og:site_name'),
    ogType: meta('og:type'),
    ogLocaleAlternates: metas.filter((m) => m.property === 'og:locale:alternate').map((m) => m.content),
    // Every tag that tells a crawler what to do with the page: robots, and the googlebot one.
    robotsAll: metas.filter((m) => m.name === 'robots' || m.name === 'googlebot').map((m) => m.content ?? ''),
    ogTitle: meta('og:title'),
    ogDescription: meta('og:description'),
    ogUrl: meta('og:url'),
    ogLocale: meta('og:locale'),
    twitterCard: meta('twitter:card'),
    twitterImage: meta('twitter:image'),
    twitterImageAlt: meta('twitter:image:alt'),
    twitterTitle: meta('twitter:title'),
    twitterDescription: meta('twitter:description'),
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
// These are close to those widths: a title past 65 or a description past 200
// is cut or rewritten, and one under 70 says too little to be a snippet.
export const limits = { title: 65, descriptionMin: 70, descriptionMax: 200 }

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
  problems.push(...checkCards(page, { locale }))

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

  // The company is written in full on the home page of each language, and
  // the other pages refer to it by its id.
  const organizations = ofType('Organization')
  if (path === '/') {
    if (organizations.length !== 1) problems.push(`${organizations.length} Organization blocks on the home page, expected 1`)
    for (const org of organizations) problems.push(...checkOrganization(org, { origin }))
  } else if (organizations.length) {
    problems.push(`${organizations.length} Organization block(s) on an inner page: write it on the home page and refer to ${origin}/#organization`)
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
    if (!/^https:\/\/schema\.org\/[A-Za-z]+$/.test(String(offer.availability ?? ''))) problems.push('Offer without an availability (a schema.org address)')
    if (!(Number(offer.price) >= 0) || !offer.priceCurrency) problems.push('Offer without a price and currency')
    else if (!pageText.includes(Number(offer.price).toFixed(2)) && !pageText.includes(String(Number(offer.price))))
      problems.push(`Offer price ${offer.price} is not shown on the page`)
  }
  if (path === '/pricing' && !nodes.some((node) => typesOf(node).includes('Offer'))) problems.push('the pricing page has plans but no Offer data')
  for (const product of ofType('Product')) {
    if (!product.name) problems.push('Product has no name')
    if (!product.sku) problems.push(`Product ${product.name ?? ''} has no sku`)
    if (!product.offers) problems.push(`Product ${product.name ?? ''} has no offers`)
  }
  return problems
}

/**
 * The share and Twitter cards of one page: Facebook, LinkedIn, X and Discord
 * read these. The picture has to say its size and type (the file itself is
 * checked by checkPicture), have a description in the page's language, and
 * the Twitter card has to say what the Open Graph one does.
 */
export function checkCards(page, { locale }) {
  const problems = []
  if (!page.ogImage) problems.push('no og:image')
  else if (!page.ogImage.startsWith('https://')) problems.push(`og:image is not an absolute https address: ${page.ogImage}`)
  else if (locale !== defaultLocale && !page.ogImage.includes(`locale=${locale}`)) problems.push(`og:image is not the card for ${locale}: ${page.ogImage}`)
  if (String(page.ogImageWidth) !== String(shareImage.width)) problems.push(`og:image:width is ${page.ogImageWidth ?? 'missing'}, expected ${shareImage.width}`)
  if (String(page.ogImageHeight) !== String(shareImage.height)) problems.push(`og:image:height is ${page.ogImageHeight ?? 'missing'}, expected ${shareImage.height}`)
  if (!shareImage.types.includes(page.ogImageType)) problems.push(`og:image:type is ${page.ogImageType ?? 'missing'}, expected a PNG or a JPEG`)
  if (!page.ogImageAlt) problems.push('no og:image:alt')
  if (page.ogSiteName !== brand) problems.push(`og:site_name is ${page.ogSiteName ?? 'missing'}, expected ${brand}`)
  if (!page.ogType) problems.push('no og:type')
  if (!page.ogTitle) problems.push('no og:title')
  else if (page.ogTitle !== page.title) problems.push('og:title is not the page title')
  if (!page.ogDescription) problems.push('no og:description')
  else if (page.ogDescription !== page.description) problems.push('og:description is not the meta description')

  const alternates = locales.filter((other) => other !== locale).map((other) => openGraphLocales[other])
  if ([...page.ogLocaleAlternates].toSorted().join() !== alternates.toSorted().join())
    problems.push(`og:locale:alternate is ${page.ogLocaleAlternates.join(', ') || 'missing'}, expected ${alternates.join(', ')}`)

  if (page.twitterCard !== 'summary_large_image') problems.push('twitter:card is not summary_large_image')
  if (!page.twitterImage) problems.push('no twitter:image')
  else if (page.twitterImage !== page.ogImage) problems.push('twitter:image is not the og:image')
  if (!page.twitterImageAlt) problems.push('no twitter:image:alt')
  else if (page.twitterImageAlt !== page.ogImageAlt) problems.push('twitter:image:alt is not the og:image:alt')
  if (page.twitterTitle !== page.ogTitle) problems.push('twitter:title is not the og:title')
  if (page.twitterDescription !== page.ogDescription) problems.push('twitter:description is not the og:description')
  return problems
}

/** The company's own data, as Google's Organization guidance asks for it. */
export function checkOrganization(org, { origin }) {
  const problems = []
  if (org.name !== brand) problems.push(`Organization name is ${org.name ?? 'missing'}, expected ${brand}`)
  if (!org.legalName) problems.push('Organization has no legalName')
  if (org.url !== origin) problems.push(`Organization url is ${org.url}, expected ${origin}`)
  if (!org.description) problems.push('Organization has no description')

  const logo = typeof org.logo === 'object' ? org.logo : undefined
  if (!org.logo) problems.push('Organization has no logo')
  else if (!logo || typesOf(logo).join() !== 'ImageObject' || !logo.url) problems.push('Organization logo is not an ImageObject with a url')
  else if (!(Number(logo.width) >= 112 && Number(logo.height) >= 112)) problems.push('Organization logo is under 112x112 or has no size')

  const contacts = asList(org.contactPoint)
  if (!contacts.length) problems.push('Organization has no contactPoint')
  for (const contact of contacts) {
    if (typesOf(contact).join() !== 'ContactPoint' || !contact.contactType) problems.push('contactPoint is not a ContactPoint with a contactType')
    else if (!contact.email && !contact.url) problems.push('contactPoint has neither an email nor a url')
    if (!asList(contact.availableLanguage).length) problems.push('contactPoint has no availableLanguage')
  }

  const profiles = asList(org.sameAs)
  if (!profiles.length) problems.push('Organization has no sameAs')
  for (const profile of profiles) {
    if (!sameAsAllowed.includes(profile)) problems.push(`sameAs lists ${profile}, which is not one of the company's profiles`)
  }
  return problems
}

/** The company's description, as the home page of one language writes it. */
const organizationDescription = (page) => nodesOf(page).find((node) => typesOf(node).includes('Organization'))?.description

/**
 * The same page in two languages must not say the same words: a translated
 * page that kept the English title, description, picture text or company
 * description was missed in translation. `allowed` names the few that may
 * match, as "locale path" (for example "de /brand").
 */
export function checkLanguages(pages, allowed = []) {
  const problems = []
  const byUrl = new Map(pages.map((entry) => [entry.url, entry.page]))
  for (const { url, page } of pages) {
    const pathname = new URL(url).pathname
    const locale = localeOfPath(pathname)
    if (locale === defaultLocale) continue
    const path = pathWithoutLocale(pathname)
    if (allowed.includes(`${locale} ${path}`)) continue
    const english = byUrl.get(expectedUrl(new URL(url).origin, defaultLocale, path))
    if (!english) continue
    const same = (label, a, b) => a && b && a === b && problems.push(`${pathname}: ${label} is the English one`)
    same('the title', page.title, english.title)
    same('the description', page.description, english.description)
    same('og:image:alt', page.ogImageAlt, english.ogImageAlt)
    same('twitter:image:alt', page.twitterImageAlt, english.twitterImageAlt)
    same('the Organization description', organizationDescription(page), organizationDescription(english))
  }
  return problems
}

/**
 * hreflang has to be reciprocal: when A lists B as its version in a language,
 * B has to list A as its version in A's language, or Google ignores the pair.
 * Checked page to page over every page fetched, not only against the set a
 * page is expected to list.
 */
export function checkReciprocity(pages) {
  const problems = []
  const byUrl = new Map(pages.map((entry) => [entry.url, entry.page]))
  for (const { url, page } of pages) {
    const own = localeOfPath(new URL(url).pathname)
    for (const [key, href] of Object.entries(page.alternates)) {
      const target = byUrl.get(href)
      if (!target) {
        problems.push(`${url} lists ${key} ${href}, which was not fetched`)
        continue
      }
      if (key !== 'x-default' && target.alternates[own] !== url) problems.push(`${href} does not list ${url} back as ${own}`)
    }
  }
  return problems
}

/** The sitemap and each page's own hreflang tags have to list the same addresses. */
export function checkSitemapAgreement(entries, pages) {
  const problems = []
  const byUrl = new Map(pages.map((entry) => [entry.url, entry.page]))
  for (const { loc, alternates } of entries) {
    const page = byUrl.get(loc)
    if (!page) continue
    const sitemap = JSON.stringify(Object.entries(alternates).toSorted())
    const onPage = JSON.stringify(Object.entries(page.alternates).toSorted())
    if (sitemap !== onPage) problems.push(`${loc}: the sitemap and the page list different alternates`)
  }
  return problems
}

/**
 * A 404 page in one language: it is not a page Google keeps, but it is what
 * a reader and a link preview see, so its title, description and og:locale
 * have to be in the address's language, and every robots tag has to say
 * noindex (the framework adds its own, so there may be two, but none may
 * say "index"). The framework renders it outside the layout that holds
 * <html lang>, so the markup may carry no lang at all; a wrong one fails.
 * `english` is the 404 page at a plain path.
 */
export function checkNotFound(page, { locale, english }) {
  const problems = []
  if (page.lang !== undefined && page.lang !== locale) problems.push(`html lang is "${page.lang}", expected "${locale}"`)
  if (!page.title) problems.push('no title')
  else if (!page.title.endsWith(` | ${brand}`)) problems.push(`title is "${page.title}", expected it to end in " | ${brand}"`)
  if (locale !== defaultLocale && english && page.title === english.title) problems.push('title is the English one')
  if (locale !== defaultLocale && english && page.description && page.description === english.description) problems.push('description is the English one')
  if (page.ogLocale !== openGraphLocales[locale]) problems.push(`og:locale is ${page.ogLocale ?? 'missing'}, expected ${openGraphLocales[locale]}`)
  if (page.ogTitle !== page.title) problems.push('og:title is not the title')
  if (!page.robotsAll.length) problems.push('no robots noindex')
  for (const content of page.robotsAll) {
    if (!/\bnoindex\b/i.test(content)) problems.push(`a robots tag says "${content}" on a 404 page`)
  }
  if (page.canonical) problems.push('a 404 page has a canonical address')
  return problems
}

/**
 * What the picture file itself is, from its first bytes: a PNG or a JPEG
 * with its size, or WebP and anything else by its signature alone.
 */
export function imageInfo(bytes) {
  const b = Buffer.from(bytes)
  if (b.length > 24 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return { type: 'image/png', width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) break
      const marker = b[i + 1]
      const length = b.readUInt16BE(i + 2)
      // The start-of-frame markers carry the size; 0xc4, 0xc8 and 0xcc do not.
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { type: 'image/jpeg', height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) }
      i += 2 + length
    }
    return { type: 'image/jpeg' }
  }
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return { type: 'image/webp' }
  return { type: 'unknown' }
}

/** Problems with one share picture file: its real type, size and weight. */
export function checkPicture(bytes) {
  const problems = []
  const { type, width, height } = imageInfo(bytes)
  if (!shareImage.types.includes(type)) problems.push(`is a ${type.replace('image/', '').toUpperCase()}, not a PNG or a JPEG`)
  else if (width !== shareImage.width || height !== shareImage.height) problems.push(`is ${width}x${height}, expected ${shareImage.width}x${shareImage.height}`)
  if (bytes.length > shareImage.maxBytes) problems.push('is over 5 MB')
  return problems
}

/** The company profiles the home pages list in sameAs, each once. */
export function sameAsOf(pages) {
  return [
    ...new Set(
      pages.flatMap(({ page }) => nodesOf(page).filter((node) => typesOf(node).includes('Organization')).flatMap((org) => asList(org.sameAs))),
    ),
  ]
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

// Checks what search engines read from a running copy of the site and prints
// a Markdown report. Exits 1 when anything fails.
//
//   node scripts/check-seo.mjs http://localhost:3000   (a build, on pull requests)
//   node scripts/check-seo.mjs https://wslatl.com      (production, every week)
//
// .github/workflows/seo.yml runs both. The rules themselves are in
// scripts/lib/seo-rules.mjs, where tests/seo-rules.test.ts covers them. For
// every page in the sitemap, in every language:
//   - a title and description of its own, in range, and not shared
//   - the canonical address (English at plain paths) and hreflang alternates
//     for all five languages plus x-default, agreeing with the sitemap
//   - hreflang that is reciprocal page to page, and the same in the sitemap
//   - Open Graph and Twitter tags (size, type, alt text and language), with
//     pictures that are 1200x630 PNG or JPEG files and load
//   - a translated page that does not repeat the English words
//   - one h1, alt text on every image, structured data that parses and says
//     what the page says
//   - links to other pages of the site that do not 404 or point at an old
//     address
// And for the site: robots.txt, the sitemap, noindex on the admin, the 404
// page in each language (its title, og:locale and one noindex), the company
// profiles in sameAs (GitHub has to answer 200 and its org has to link back to the site), fonts that do not hide text,
// and large pictures that load first.
//
// Run against a local build, the addresses in the sitemap and the tags still
// name https://wslatl.com; each is fetched from the site being checked.
import { eachLimited, makeGet } from './lib/site-http.mjs'
import {
  checkDuplicates,
  checkLanguages,
  checkPartnerLanguages,
  checkNotFound,
  checkPage,
  checkPicture,
  checkReciprocity,
  checkRobots,
  checkSitemap,
  checkSitemapAgreement,
  internalLinks,
  linkProblem,
  locales,
  readPage,
  readSitemap,
  sameAsOf,
} from './lib/seo-rules.mjs'

const base = new URL(process.argv[2] ?? 'https://wslatl.com')
// The address the site calls itself by, which every canonical and sitemap entry uses.
const origin = 'https://wslatl.com'
const get = makeGet(base)
const results = []

function record(check, ok, detail = '') {
  results.push({ check, ok, detail })
}

/** Records one check from a list of problems, showing the first few. */
function report(check, problems, okDetail) {
  const shown = problems.slice(0, 80).join('; ')
  const more = problems.length > 80 ? `; and ${problems.length - 80} more` : ''
  record(check, problems.length === 0, problems.length ? shown + more : okDetail)
}

const onSite = (url) => new URL(url).pathname + new URL(url).search

async function checkRobotsTxt() {
  const res = await get('/robots.txt')
  if (res.status !== 200) return record('robots.txt', false, `status ${res.status}`)
  report('robots.txt', checkRobots(await res.text(), { origin }), 'allows the site and names the sitemap')
}

async function loadSitemap() {
  const res = await get('/sitemap.xml')
  if (res.status !== 200) {
    record('sitemap.xml', false, `status ${res.status}`)
    return []
  }
  const entries = readSitemap(await res.text())
  report('sitemap.xml', checkSitemap(entries, { origin }), `${entries.length} pages, each with all five languages and x-default`)
  return entries
}

async function checkPages(entries) {
  const pages = []
  const unreachable = []
  await eachLimited(entries, async ({ loc }) => {
    const res = await get(onSite(loc))
    if (res.status !== 200) return unreachable.push(`${loc} (${res.status})`)
    pages.push({ url: loc, page: readPage(await res.text()) })
  }, ({ loc }, error) => unreachable.push(`${loc} (${error.message})`))
  report('Every sitemap page answers 200 with no redirect', unreachable, `${entries.length} pages`)

  const wrong = pages.flatMap(({ url, page }) => checkPage(page, { url, origin }).map((problem) => `${onSite(url)}: ${problem}`))
  report('Titles, descriptions, canonicals, hreflang, cards, headings, images and structured data', wrong, `${pages.length} pages`)
  report('No two pages in one language share a title or description', checkDuplicates(pages), `${pages.length} pages`)
  report('A translated page does not repeat the English title, description, picture text or company description', checkLanguages(pages), `${pages.length} pages`)
  report('A translated partner page does not open with the untranslated English tagline', checkPartnerLanguages(pages), `${pages.length} pages`)
  report('hreflang links are returned page to page', checkReciprocity(pages), `${pages.length} pages`)
  report('The sitemap and each page list the same alternates', checkSitemapAgreement(entries, pages), `${pages.length} pages`)
  return pages
}

/**
 * Every card picture the pages name has to load as an image, from the site
 * being checked, and be a 1200x630 PNG or JPEG under 5 MB: its own bytes
 * are read, not only what the page says about it.
 */
async function checkPictures(pages) {
  const pictures = [...new Set(pages.flatMap(({ page }) => [page.ogImage, page.twitterImage]).filter(Boolean))]
  const wrong = []
  await eachLimited(pictures, async (picture) => {
    const url = new URL(picture.replaceAll('&amp;', '&'), origin)
    const res = await get(url.pathname + url.search)
    const type = res.headers.get('content-type') ?? ''
    const bytes = Buffer.from(await res.arrayBuffer())
    const name = `${url.pathname}${url.search}`
    if (res.status !== 200 || !type.startsWith('image/')) wrong.push(`${name} (${res.status} ${type})`)
    else for (const problem of checkPicture(bytes)) wrong.push(`${name} ${problem}`)
  }, (picture, error) => wrong.push(`${picture} (${error.message})`), 4)
  report('Open Graph and Twitter pictures load and are 1200x630 PNG or JPEG', wrong, `${pictures.length} pictures`)
}

async function checkLinks(pages) {
  const links = internalLinks(pages.flatMap(({ page }) => page.hrefs), base, origin)
  const wrong = []
  await eachLimited(links, async (path) => {
    const res = await get(path)
    await res.body?.cancel()
    const problem = linkProblem(res.status)
    if (problem) wrong.push(`${path} ${problem}`)
  }, (path, error) => wrong.push(`${path} (${error.message})`))
  report('Links between pages do not 404 or point at an old address', wrong, `${links.length} links`)
}

/** The admin and the 404 page tell search engines to leave them out. */
async function checkNoindex() {
  const problems = []
  for (const path of ['/admin', '/admin/login']) {
    const res = await get(path)
    const header = res.headers.get('x-robots-tag') ?? ''
    const body = await res.text()
    if (!/noindex/i.test(header)) problems.push(`${path} sends no X-Robots-Tag noindex`)
    if (res.status === 200 && !/<meta[^>]+name="robots"[^>]+noindex/i.test(body)) problems.push(`${path} has no robots noindex tag`)
  }
  let english
  for (const locale of locales) {
    const path = `${locale === 'en' ? '' : `/${locale}`}/no-such-page-${Date.now()}`
    const res = await get(path)
    const body = await res.text()
    if (res.status !== 404) problems.push(`${path} is not a 404 (${res.status})`)
    else if (!/noindex/i.test(body)) problems.push(`${path} answers 404 without a noindex`)
    else {
      const page = readPage(body)
      if (locale === 'en') english = page
      for (const problem of checkNotFound(page, { locale, english })) problems.push(`${path}: ${problem}`)
    }
  }
  report('The admin and the 404 page, in each language, are noindex and in that language', problems, 'admin and 404 pages say noindex; the 404 has its own title and og:locale in all five languages')
}

/**
 * The company profiles the Organization lists have to be the ones we own, and
 * GitHub has to answer. Discord invites and Trustpilot turn away automated
 * requests, so those are not fetched: they are checked against the fixed list
 * in scripts/lib/seo-rules.mjs, and by hand after a change.
 */
async function checkProfiles(pages) {
  const github = sameAsOf(pages).filter((profile) => new URL(profile).hostname === 'github.com')
  const problems = []
  if (!github.length) problems.push('the Organization lists no GitHub profile')
  for (const profile of github) {
    try {
      const res = await fetch(profile, { redirect: 'manual', headers: { 'user-agent': 'wslatl-seo-check' } })
      await res.body?.cancel()
      if (res.status !== 200) problems.push(`${profile} answers ${res.status}`)
    } catch (error) {
      problems.push(`${profile} (${error.message})`)
    }
  }
  report('The GitHub profile in sameAs answers 200', problems, github.join(', '))

  // Google reconciles the company with its GitHub org through the org's own website link.
  const orgProblems = []
  for (const profile of github) {
    const login = new URL(profile).pathname.split('/').filter(Boolean)[0]
    if (!login) continue
    try {
      const res = await fetch(`https://api.github.com/orgs/${login}`, { headers: { 'user-agent': 'wslatl-seo-check', accept: 'application/vnd.github+json' } })
      if (res.status !== 200) {
        await res.body?.cancel()
        orgProblems.push(`${login}: the GitHub API answers ${res.status}`)
        continue
      }
      const { blog } = await res.json()
      if (!blog || blog.replace(/\/+$/, '') !== origin) orgProblems.push(`the GitHub org ${login} has website "${blog ?? ''}", expected ${origin}`)
    } catch (error) {
      orgProblems.push(`${login} (${error.message})`)
    }
  }
  report('The GitHub org in sameAs links back to the site', orgProblems, github.join(', '))
}

/** Text has to show while a font loads, and the biggest pictures have to be fetched first. */
async function checkPerformance(pages) {
  const problems = []
  const home = pages.find(({ url }) => url === origin)
  if (!home) return record('Fonts and large pictures', false, 'the home page is not in the sitemap')

  const res = await get('/')
  const html = await res.text()
  const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1])
  let faces = 0
  for (const href of sheets) {
    const css = await (await get(href)).text()
    for (const [face] of css.matchAll(/@font-face\s*\{[^}]*\}/g)) {
      // The adjusted fallback next/font adds is a local font, which cannot be late.
      if (!/url\(/.test(face)) continue
      faces++
      if (!/font-display:\s*(swap|optional|fallback)/.test(face)) problems.push(`a font in ${href} has no font-display`)
    }
  }
  if (!faces) problems.push('no @font-face found in the stylesheets')

  for (const { url, page } of pages) {
    // A partner's profile opens with its banner, so that picture is what the page paints first.
    if (!/^\/(?:[a-z]{2}\/)?partners\/[^/]+$/.test(new URL(url).pathname)) continue
    const big = page.images.filter((img) => Number(img.width) >= 1000).slice(0, 1)
    for (const img of big) {
      const preloaded = img.fetchpriority === 'high' || page.preloadedImages.includes(img.src)
      if (img.loading === 'lazy' || !preloaded) problems.push(`${onSite(url)}: the large picture ${img.src} does not load first`)
    }
  }
  report('Fonts do not hide text, and large pictures load first', problems, `${faces} font faces; no large picture is lazy`)
}

for (const [name, run] of [
  ['robots.txt', checkRobotsTxt],
  ['Pages', async () => {
    const entries = await loadSitemap()
    const pages = await checkPages(entries)
    await checkPictures(pages)
    await checkProfiles(pages)
    await checkLinks(pages)
    await checkPerformance(pages)
  }],
  ['Noindex', checkNoindex],
]) {
  try {
    await run()
  } catch (error) {
    record(name, false, error.message)
  }
}

const failed = results.filter((r) => !r.ok)
const cell = (text) => String(text).replaceAll('|', '\\|').replaceAll('\n', ' ')
console.log(`## SEO check: ${base.origin}\n`)
console.log(failed.length ? `**${failed.length} of ${results.length} checks failed.**\n` : `All ${results.length} checks passed.\n`)
console.log('| Check | Result | Detail |\n| --- | --- | --- |')
for (const r of results) console.log(`| ${r.check} | ${r.ok ? 'Pass' : '**Fail**'} | ${cell(r.detail)} |`)
console.log(`\nChecked ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC.`)
process.exit(failed.length ? 1 : 0)

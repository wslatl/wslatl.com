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
//   - Open Graph and Twitter tags, with pictures that load
//   - one h1, alt text on every image, structured data that parses and says
//     what the page says
//   - links to other pages of the site that do not 404 or point at an old
//     address
// And for the site: robots.txt, the sitemap, noindex on the admin and on the
// 404 page, fonts that do not hide text, and large pictures that load first.
//
// Run against a local build, the addresses in the sitemap and the tags still
// name https://wslatl.com; each is fetched from the site being checked.
import { eachLimited, makeGet } from './lib/site-http.mjs'
import {
  checkDuplicates,
  checkPage,
  checkRobots,
  checkSitemap,
  internalLinks,
  linkProblem,
  readPage,
  readSitemap,
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
  return pages
}

/** Every card picture the pages name has to load as an image, from the site being checked. */
async function checkPictures(pages) {
  const pictures = [...new Set(pages.flatMap(({ page }) => [page.ogImage, page.twitterImage]).filter(Boolean))]
  const wrong = []
  await eachLimited(pictures, async (picture) => {
    const url = new URL(picture.replaceAll('&amp;', '&'), origin)
    const res = await get(url.pathname + url.search)
    const type = res.headers.get('content-type') ?? ''
    await res.body?.cancel()
    if (res.status !== 200 || !type.startsWith('image/')) wrong.push(`${url.pathname}${url.search} (${res.status} ${type})`)
  }, (picture, error) => wrong.push(`${picture} (${error.message})`), 4)
  report('Open Graph and Twitter pictures load', wrong, `${pictures.length} pictures`)
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
  for (const path of [`/no-such-page-${Date.now()}`, `/es/no-such-page-${Date.now()}`]) {
    const res = await get(path)
    const body = await res.text()
    if (res.status !== 404) problems.push(`${path} is not a 404 (${res.status})`)
    else if (!/noindex/i.test(body)) problems.push(`${path} answers 404 without a noindex`)
  }
  report('The admin and the 404 page are noindex', problems, 'admin and 404 pages say noindex')
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

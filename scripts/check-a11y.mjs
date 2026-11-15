// Accessibility, checked by axe in a real Chrome, and printed as a Markdown
// report. Exits 1 on any violation, or a page that could not be checked.
//
//   node scripts/check-a11y.mjs http://localhost:3100   (a build, in CI)
//   node scripts/check-a11y.mjs https://wslatl.com      (any running copy)
//
// What it checks, each at a phone's width and at a desktop's:
//   - one page of every kind in all five languages: the home page, pricing,
//     the games directory and a game, partners and a partner, the brand kit,
//     the legal index and a document. The kinds come from the sitemap, so a
//     new one is checked without being listed anywhere.
//   - the 404 page in each language, and the admin's sign-in page
//
// axe is the engine behind Lighthouse's accessibility score, which the
// Lighthouse workflow holds at 100 on seven English pages. This runs every
// WCAG 2.2 A and AA rule axe has, and its best practices (lib/a11y.mjs), on
// the translations too, whose longer words and their own labels can break
// what the English passes, and on the admin, whose look comes from the kit.
// .github/workflows/accessibility.yml runs it on every pull request.
//
// Chrome is the one already on the machine: CHROME_PATH, or Chrome's usual
// place. Nothing is downloaded.
import { AxeBuilder } from '@axe-core/playwright'
import { chromium, devices } from 'playwright-core'
import { axeTags, buildReport, pagesToCheck } from './lib/a11y.mjs'
import { eachLimited, makeGet } from './lib/site-http.mjs'

const base = new URL(process.argv[2] ?? 'http://localhost:3100')
const get = makeGet(base)

const widths = [
  { name: 'phone', options: { ...devices['Pixel 7'] } },
  { name: 'desktop', options: { viewport: { width: 1280, height: 800 } } },
]

const sitemap = await get('/sitemap.xml')
if (sitemap.status !== 200) {
  console.log(`## Accessibility check: ${base.origin}\n\n**The sitemap answered ${sitemap.status}**, so there was nothing to check.\n`)
  process.exit(1)
}
const pages = pagesToCheck(await sitemap.text())

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
/** @type {import('./lib/a11y.mjs').PageResult[]} */
const results = []
try {
  for (const width of widths) {
    // Reduced motion, so text that fades in is checked as it ends up rather
    // than halfway through.
    const context = await browser.newContext({ ...width.options, reducedMotion: 'reduce' })
    await eachLimited(
      pages,
      async ({ path, status }) => {
        const page = await context.newPage()
        try {
          const response = await page.goto(new URL(path, base).href, { waitUntil: 'load', timeout: 30_000 })
          if (response?.status() !== status) {
            results.push({ path, width: width.name, error: `answered ${response?.status() ?? 'nothing'}, not ${status}` })
            return
          }
          await page.evaluate(() => document.fonts.ready.then(() => undefined))
          const { violations } = await new AxeBuilder({ page }).withTags(axeTags).analyze()
          results.push({ path, width: width.name, violations })
        } finally {
          await page.close()
        }
      },
      (item, error) => results.push({ path: item.path, width: width.name, error: error.message }),
      4,
    )
    await context.close()
  }
} finally {
  await browser.close()
}

const { text, failed } = buildReport(base.origin, results)
console.log(text)
process.exit(failed ? 1 : 0)

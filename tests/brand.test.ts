import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { generateMetadata } from '@/app/[locale]/brand/page'
import sitemap from '@/app/sitemap'
import { BrandHeader, BrandKit } from '@/components/brand/brand-kit'
import {
  downloadsPath,
  fullKitUrl,
  gradients,
  ink,
  interfaceColors,
  lockupDownloads,
  logoColors,
  markDownloads,
  markSizes,
  pictures,
  tiles,
  voiceExamples,
  voiceRuleExamples,
} from '@/data/brand'
import { footerColumns } from '@/data/footer'
import { legalPages } from '@/data/legal'
import { productLines } from '@/data/pricing'
import { uptimeTarget } from '@/data/sla'
import { defaultLocale, localePath, locales, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { languageAlternates, pageUrl } from '@/lib/metadata'
import { formatPrice, startingPrice } from '@/lib/pricing'
import { downloads as scriptDownloads, pictures as scriptPictures } from '../scripts/brand-kit.mjs'
import { imageSize } from './image-size'

// The page's header and footer are not under test here, and the footer's
// email addresses are server-only, which only a Next.js build can load.
vi.mock('@/components/layout/site-header', () => ({ SiteHeader: () => null }))
vi.mock('@/components/layout/footer', () => ({ Footer: () => null }))
vi.mock('server-only', () => ({}))
// Outside a Next.js render there is no request to keep the language for, so it
// is kept here, and the page can be rendered once in each language.
vi.mock('@/i18n/locale', () => {
  let current = 'en'
  return {
    setLocale: (locale: string) => {
      current = locale
    },
    getLocale: () => current,
  }
})

const root = join(__dirname, '..')
const brandDir = join(root, 'public', 'brand')

/** The page below its header and footer, as the server sends it, in one language. */
const rendered = new Map<Locale, string>()
function render(locale: Locale): string {
  let html = rendered.get(locale)
  if (html === undefined) {
    setLocale(locale)
    html = renderToStaticMarkup(createElement(Fragment, null, createElement(BrandHeader), createElement(BrandKit)))
    rendered.set(locale, html)
  }
  return html
}

const htmlEscape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
const htmlUnescape = (text: string) =>
  text
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
const pattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const count = (html: string, text: string) => html.split(text).length - 1
/** Every opening tag of one kind, as written. */
const tags = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(([tag]) => tag)
const attribute = (tag: string, name: string) => {
  const value = new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1]
  return value === undefined ? undefined : htmlUnescape(value)
}
/** The file an <img> shows, whichever way the framework addresses it: an optimized URL under test, the file itself in the build. */
const shown = (tag: string) => {
  const src = attribute(tag, 'src') ?? ''
  return new URL(src, 'http://localhost').searchParams.get('url') ?? src
}
const hasAttribute = (tag: string, name: string) => new RegExp(`\\s${name}(=|\\s|/?>)`).test(tag)
const hexToRgb = (hex: string) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16))
const byName = (a: [string, unknown], b: [string, unknown]) => a[0].localeCompare(b[0])

describe('the colors', () => {
  const swatches = [...logoColors, ...interfaceColors]

  it('give every swatch a hex and the RGB that hex is, as the guide prints them', () => {
    for (const swatch of swatches) {
      expect(swatch.hex, swatch.name).toMatch(/^#[0-9A-F]{6}$/)
      expect([...swatch.rgb], swatch.name).toEqual(hexToRgb(swatch.hex))
    }
    for (const gradient of gradients) {
      for (const stop of [gradient.from, gradient.to]) {
        expect(stop.hex, gradient.name).toMatch(/^#[0-9A-F]{6}$/)
        expect([...stop.rgb], gradient.name).toEqual(hexToRgb(stop.hex))
      }
    }
  })

  it('name each one once, and every language says what each is for', () => {
    expect(new Set(swatches.map((swatch) => swatch.id)).size).toBe(swatches.length)
    expect(new Set(swatches.map((swatch) => swatch.name)).size).toBe(swatches.length)
    for (const locale of locales) {
      const { uses, gradientUses } = copyFor(locale).brand.colors
      expect(Object.keys(uses).toSorted(), locale).toEqual(swatches.map((swatch) => swatch.id).toSorted())
      expect(Object.keys(gradientUses).toSorted(), locale).toEqual(gradients.map((gradient) => gradient.id).toSorted())
    }
  })

  it('keep Ink the color the dark panels are drawn in', () => {
    expect(ink.hex).toBe('#0F090B')
  })
})

describe('the voice examples', () => {
  it('are the guide six, and take their figures from the price list and the SLA, never typing them again', () => {
    const examples = voiceExamples()
    expect(examples).toHaveLength(6)
    for (const example of examples) {
      expect(example.insteadOf.trim()).not.toBe('')
      expect(example.write.trim()).not.toBe('')
    }

    // The guide says the Ryzen 9 and NVMe plans start at $5.91. That is the
    // cheapest Budget plan, on an Intel i7 with SATA SSD, so the line is only
    // true with the Premium price, which is the one it is given.
    const premium = productLines.find((line) => line.id === 'vps')?.groups.find((group) => group.tier === 'premium')
    expect(premium?.description).toContain('AMD Ryzen 9 3900X')
    expect(premium?.storageType).toBe('NVMe')
    expect(examples[0].write).toBe(
      `New VPS plans. AMD Ryzen 9 3900X, NVMe, from ${formatPrice(startingPrice('vps', 'premium'))}/mo.`,
    )
    expect(examples[3]).toEqual({
      insteadOf: `${uptimeTarget('vps')} uptime SLA`,
      write: `${uptimeTarget('vps')} uptime target on VPS and web hosting.`,
    })
  })

  it('give each rule as many English quotes as its text has marks for, in every language', () => {
    for (const locale of locales) {
      const rules = copyFor(locale).brand.voice.rules
      expect(rules, locale).toHaveLength(voiceRuleExamples.length)
      rules.forEach((rule, index) => {
        const marks = [...rule.body.matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1])).toSorted()
        expect(marks, `${locale}: ${rule.title}`).toEqual(voiceRuleExamples[index].map((_, at) => at))
      })
    }
  })
})

describe('the downloads', () => {
  const offered = [...markDownloads, ...lockupDownloads]
  const folder = join(brandDir, 'downloads')

  it('are the files the kit ships, kept under the names it gave them in public/brand/downloads/', () => {
    const files = readdirSync(folder).toSorted()
    expect(files).toEqual(offered.map((download) => download.file).toSorted())
    // The ones scripts/brand-kit.mjs copies from the kit, as they are.
    expect(files).toEqual(scriptDownloads.map((path) => path.split('/').pop() ?? '').toSorted())
    for (const file of files) expect(file, file).toBe(file.toLowerCase())
  })

  it('are PNGs of the size their name says', () => {
    for (const { file, width, height } of offered) {
      expect(file, file).toBe(`wslatl-${width === height ? 'logo' : 'banner'}-${width}x${height}.png`)
      expect(imageSize(readFileSync(join(folder, file))), file).toEqual({ width, height })
    }
  })

  it('are the mark at 64, 128, 256, 512 and 1024, and the lockup at 1500x500, 1200x630 and 960x540', () => {
    expect(markDownloads.map((download) => download.width)).toEqual([64, 128, 256, 512, 1024])
    expect(lockupDownloads.map((download) => `${download.width}x${download.height}`)).toEqual([
      '1500x500',
      '1200x630',
      '960x540',
    ])
  })

  it('are all on the page with the download attribute, in every language', () => {
    for (const locale of locales) {
      const links = tags(render(locale), 'a').filter((tag) => hasAttribute(tag, 'download'))
      expect(links.map((tag) => attribute(tag, 'href')).toSorted(), locale).toEqual(
        offered.map((download) => `${downloadsPath}/${download.file}`).toSorted(),
      )
    }
  })

  it('come with the sizes the kit ships the mark in, which the page lists', () => {
    expect([...markSizes]).toEqual([16, 32, 48, 64, 96, 128, 144, 152, 180, 192, 256, 512, 1024])
  })
})

describe('the pictures', () => {
  it('are WebP at twice the size they show at', () => {
    for (const [id, { src, width, height }] of Object.entries(pictures)) {
      expect(src, id).toMatch(/^\/brand\/kit-[a-z-]+\.webp$/)
      const file = join(root, 'public', src)
      expect(existsSync(file), id).toBe(true)
      expect(imageSize(readFileSync(file)), id).toEqual({ width: width * 2, height: height * 2 })
    }
  })

  it('are the ones scripts/brand-kit.mjs makes, at the sizes the page uses, and the only kit pictures in public/brand', () => {
    const used = Object.values(pictures).map(
      ({ src, width, height }): [string, number[]] => [src.split('/').pop() ?? '', [width, height]],
    )
    const made = scriptPictures.map((picture): [string, number[]] => [picture.file, picture.display])
    expect(made.toSorted(byName)).toEqual(used.toSorted(byName))
    const onDisk = readdirSync(brandDir).filter((name) => name.startsWith('kit-'))
    expect(onDisk.toSorted()).toEqual(used.map(([file]) => file).toSorted())
  })

  it('make the do-and-don\'t diagram of six, three right and three wrong, each its own picture', () => {
    expect(tiles.filter((tile) => tile.verdict === 'do')).toHaveLength(3)
    expect(tiles.filter((tile) => tile.verdict === 'dont')).toHaveLength(3)
    expect(new Set(tiles.map((tile) => tile.picture)).size).toBe(6)
  })

  it('hold nothing in public/brand but WebP and PNG, never an SVG, which can carry script', () => {
    const files = readdirSync(brandDir, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile())
    expect(files.length).toBeGreaterThan(0)
    expect(files.filter((entry) => !/\.(webp|png)$/.test(entry.name)).map((entry) => entry.name)).toEqual([])
  })
})

describe('the page', () => {
  it('has one title, and a heading for every part with the anchor the page links to', () => {
    for (const locale of locales) {
      const html = render(locale)
      expect(count(html, '<h1'), locale).toBe(1)
      for (const id of ['logo', 'colors', 'type', 'voice', 'dos-and-donts', 'full-kit']) {
        expect(count(html, `<section id="${id}"`), `${locale} ${id}`).toBe(1)
        expect(count(html, `href="#${id}"`), `${locale} ${id}`).toBeGreaterThanOrEqual(1)
      }
      // The button in the header points at the downloads, so they have to be there.
      expect(count(html, 'id="downloads"'), locale).toBe(1)
      expect(count(html, 'href="#downloads"'), locale).toBe(1)
    }
  })

  it('shows the logo only in its four specimens, and leaves the mark at the top to the header', () => {
    for (const locale of locales) {
      const html = render(locale)
      expect(html, locale).not.toContain('wslatl-mark.webp')
      const images = tags(html, 'img').map(shown)
      expect(images.filter((src) => src === pictures.mark.src), locale).toHaveLength(2)
      expect(images.filter((src) => src === pictures.lockup.src), locale).toHaveLength(2)
    }
  })

  it('gives every picture alt text of its own in the language of the page, at its size, lazy-loaded', () => {
    const english = new Set(tags(render('en'), 'img').map((tag) => attribute(tag, 'alt')))
    expect(english.size).toBe(13)
    for (const locale of locales) {
      const images = tags(render(locale), 'img')
      expect(images, locale).toHaveLength(13)
      const alts = images.map((tag) => attribute(tag, 'alt') ?? '')
      expect(new Set(alts).size, locale).toBe(13)
      for (const tag of images) {
        const src = shown(tag)
        const picture = Object.values(pictures).find((one) => one.src === src)
        expect(picture, src).toBeDefined()
        expect(attribute(tag, 'alt')?.length, `${locale} ${src}`).toBeGreaterThan(15)
        expect(attribute(tag, 'loading'), src).toBe('lazy')
        expect(Number(attribute(tag, 'width')), src).toBe(picture?.width)
        expect(Number(attribute(tag, 'height')), src).toBe(picture?.height)
      }
      // Translated, not copied: none of them is the English sentence.
      const untranslated = locale === defaultLocale ? [] : alts.filter((alt) => english.has(alt))
      expect(untranslated, locale).toEqual([])
    }
  })

  it('draws every color as a swatch with its name, hex, RGB and use, and a button that copies the hex', () => {
    for (const locale of locales) {
      const html = render(locale)
      const t = copyFor(locale).brand.colors
      const colors = [...logoColors, ...interfaceColors]
      // The swatches, and the two stops of each gradient.
      expect(count(html, '<code'), locale).toBe(colors.length + gradients.length * 2)
      for (const swatch of colors) {
        const where = `${locale} ${swatch.name}`
        expect(html, where).toContain(`lang="en" translate="no" class="font-semibold text-foreground">${swatch.name}</p>`)
        expect(html, where).toContain(`>${swatch.hex}</code>`)
        expect(html, where).toContain(`RGB ${swatch.rgb.join(', ')}`)
        expect(html, where).toContain(`${t.copy}<span class="sr-only"> ${swatch.hex}</span>`)
        expect(html, where).toContain(htmlEscape(t.uses[swatch.id]))
      }
      for (const gradient of gradients) {
        for (const stop of [gradient.from, gradient.to]) {
          expect(html, `${locale} ${stop.hex}`).toContain(`>${stop.hex}</code>`)
          expect(html, `${locale} ${stop.hex}`).toContain(`${t.copy}<span class="sr-only"> ${stop.hex}</span>`)
          expect(html, `${locale} ${stop.hex}`).toContain(`RGB ${stop.rgb.join(', ')}`)
        }
        expect(html, `${locale} ${gradient.name}`).toContain(htmlEscape(t.gradientUses[gradient.id]))
      }
    }
  })

  it('uses the brand gradient only as bars: the two gradient swatches, and an accent bar on each Ink panel', () => {
    for (const locale of locales) {
      const html = render(locale)
      const bars = [...tags(html, 'span'), ...tags(html, 'div')].filter((tag) => tag.includes('linear-gradient'))
      expect(bars, locale).toHaveLength(gradients.length + 2)
      for (const tag of bars) expect(tag, locale).toContain('aria-hidden="true"')
    }
  })

  it('keeps the English examples in English, marked lang="en", in every language', () => {
    for (const locale of locales) {
      const html = render(locale)
      for (const { insteadOf, write } of voiceExamples()) {
        for (const sentence of [insteadOf, write]) {
          expect(html, `${locale}: ${sentence}`).toMatch(
            new RegExp(`lang="en"[^>]*>${pattern(htmlEscape(sentence))}<`),
          )
        }
      }
      // What the rules quote, and the line in the logo, are English too.
      for (const quote of ['Under 1 hr', 'fast support', 'seamlessly', 'leverage', 'Private Hosting']) {
        expect(html, `${locale}: ${quote}`).toContain(`lang="en" translate="no">${quote}</span>`)
      }
      // And no {0} was left unfilled.
      expect(html, locale).not.toMatch(/\{\d+\}/)
    }
  })

  it('links the full kit on Google Drive twice, in a new tab, saying so', () => {
    for (const locale of locales) {
      const html = render(locale)
      const newTab = copyFor(locale).header.newTab
      const links = [...html.matchAll(new RegExp(`<a [^>]*href="${pattern(fullKitUrl)}"[^>]*>([\\s\\S]*?)</a>`, 'g'))]
      expect(links, locale).toHaveLength(2)
      for (const [link, inner] of links) {
        expect(link, locale).toContain('target="_blank"')
        expect(link, locale).toContain('rel="noopener noreferrer"')
        expect(inner, locale).toContain(`<span class="sr-only">${newTab}</span>`)
      }
      expect(html, locale).toContain(copyFor(locale).brand.fullKit.cta)
    }
  })

  it('opens every link that leaves the site in a new tab without handing over the page', () => {
    for (const locale of locales) {
      const leaving = tags(render(locale), 'a').filter((tag) => /^(https?:|\/discord$)/.test(attribute(tag, 'href') ?? ''))
      expect(leaving.length, locale).toBeGreaterThan(0)
      for (const tag of leaving) {
        expect(tag, locale).toContain('target="_blank"')
        expect(tag, locale).toContain('rel="noopener noreferrer"')
      }
    }
  })

  it('says each part in the language of the page, and differently in each', () => {
    for (const locale of locales) {
      const html = render(locale)
      const t = copyFor(locale).brand
      for (const text of [t.heading, t.intro, t.audience, t.shortVersion.heading, t.logo.heading, t.colors.heading]) {
        expect(html, `${locale}: ${text}`).toContain(htmlEscape(text))
      }
      for (const text of [t.type.heading, t.voice.heading, t.dos.heading, t.fullKit.heading]) {
        expect(html, `${locale}: ${text}`).toContain(htmlEscape(text))
      }
    }
    expect(new Set(locales.map(render)).size).toBe(locales.length)
  })

  it('has no em dash, en dash or middle dot, in any language', () => {
    const dashes = [0x2014, 0x2013, 0x00b7].map((code) => String.fromCharCode(code))
    for (const locale of locales) {
      expect(
        dashes.filter((dash) => render(locale).includes(dash)),
        locale,
      ).toEqual([])
    }
  })
})

describe('the brand kit in search results and the footer', () => {
  it('has a title and a description of its own in every language', async () => {
    for (const locale of locales) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale }) })
      const t = copyFor(locale).brand
      expect(metadata.title, locale).toBe(t.metaTitle)
      expect(metadata.description, locale).toBe(t.metaDescription)
      expect(t.metaDescription.length, locale).toBeGreaterThan(80)
      expect(t.metaDescription.length, locale).toBeLessThanOrEqual(160)
      expect(metadata.alternates?.canonical, locale).toBe(pageUrl(locale, '/brand'))
      expect(metadata.alternates?.languages, locale).toEqual(languageAlternates('/brand'))
      expect(metadata.openGraph?.url, locale).toBe(pageUrl(locale, '/brand'))
    }
    for (const field of ['metaTitle', 'metaDescription'] as const) {
      const values = locales.map((locale) => copyFor(locale).brand[field])
      expect(new Set(values).size, field).toBe(locales.length)
    }
  })

  it('is in the sitemap in every language, listing the same translations as its head', () => {
    const entries = sitemap()
    for (const locale of locales) {
      const entry = entries.find((item) => item.url === pageUrl(locale, '/brand'))
      expect(entry, locale).toBeDefined()
      expect(entry?.alternates?.languages, locale).toEqual(languageAlternates('/brand'))
    }
  })

  it('is linked from the company column of the footer, in every language', () => {
    for (const locale of locales) {
      const t = copyFor(locale)
      const company = footerColumns(t, locale, legalPages).find((column) => column.title === t.footer.columns.company)
      const link = company?.links.find((item) => item.label === t.footer.links.brandKit)
      expect(link?.href, locale).toBe(localePath(locale, '/brand'))
    }
    expect(copyFor('en').footer.links.brandKit).toBe('Brand kit')
  })

  it('is on the Lighthouse run, which holds its pages to the byte budget', () => {
    const run = JSON.parse(readFileSync(join(root, 'lighthouserc.json'), 'utf8'))
    expect(run.ci.collect.url).toContain('http://localhost:3100/brand')
  })
})

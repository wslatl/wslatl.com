import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { describe, expect, it, vi } from 'vitest'
import { generateMetadata as gamesMetadata } from '@/app/[locale]/games/page'
import { generateMetadata as gameMetadata } from '@/app/[locale]/games/[slug]/page'
import { generateMetadata as legalIndexMetadata } from '@/app/[locale]/legal/page'
import { generateMetadata as legalMetadata } from '@/app/[locale]/legal/[slug]/page'
import { generateMetadata as homeMetadata } from '@/app/[locale]/page'
import { generateMetadata as partnersMetadata } from '@/app/[locale]/partners/page'
import { generateMetadata as partnerMetadata } from '@/app/[locale]/partners/[slug]/page'
import { generateMetadata as pricingMetadata } from '@/app/[locale]/pricing/page'
import { GET } from '@/app/og/route'
import sitemap from '@/app/sitemap'
import { partners } from '@/data/partners'
import { defaultLocale, locales, stripLocale, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { shareCardUrl } from '@/lib/metadata'
import { shareCardText } from '@/lib/share-card'
import { imageSize } from './image-size'

// The page modules are imported for their metadata. Their header and footer
// are not under test here, and the footer's email addresses are server-only,
// which only a Next.js build can load.
vi.mock('@/components/layout/site-header', () => ({ SiteHeader: () => null }))
vi.mock('@/components/layout/footer', () => ({ Footer: () => null }))
vi.mock('server-only', () => ({}))

// The real renderer, counting the cards it draws.
const drawings = vi.hoisted(() => ({ count: 0 }))
vi.mock('next/og', async (importOriginal) => {
  const real = await importOriginal<typeof import('next/og')>()
  class CountedImageResponse extends real.ImageResponse {
    constructor(...args: ConstructorParameters<typeof real.ImageResponse>) {
      super(...args)
      drawings.count++
    }
  }
  return { ...real, ImageResponse: CountedImageResponse }
})

const root = join(__dirname, '..')

/** Every page in the sitemap: its path without a language, and its language. */
const pages = sitemap().map((entry) => {
  const { pathname } = new URL(entry.url)
  const locale = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)) ?? defaultLocale
  return { path: stripLocale(pathname), locale }
})

/** What a page's generateMetadata gives, found by its path the way the router finds the page. */
function metadataOf(path: string, locale: Locale): Promise<Metadata> {
  const [, section, slug] = path.split('/')
  const params = Promise.resolve({ locale, slug })
  if (path === '/') return homeMetadata({ params })
  if (section === 'pricing') return pricingMetadata({ params })
  if (section === 'games') return slug ? gameMetadata({ params }) : gamesMetadata({ params })
  if (section === 'legal') return slug ? legalMetadata({ params }) : legalIndexMetadata({ params })
  if (section === 'partners') return slug ? partnerMetadata({ params }) : partnersMetadata({ params })
  throw new Error(`The sitemap has ${path}, which this test does not know a page for`)
}

const titleOf = (head: Metadata) =>
  typeof head.title === 'string' ? head.title : head.title && 'absolute' in head.title ? head.title.absolute : undefined

/** The pictures a page shares itself with, as an address and the alt text it gives. */
function shareImages(head: Metadata): { url: string; alt?: string }[] {
  return [head.openGraph?.images ?? []]
    .flat()
    .map((image) =>
      typeof image === 'string' || image instanceof URL
        ? { url: String(image) }
        : { url: String(image.url), alt: image.alt },
    )
}

describe('the words on a share card', () => {
  it('exist for every page in the sitemap, in every language', () => {
    expect(pages.length).toBeGreaterThan(locales.length)
    const without = pages
      .filter(({ path, locale }) => {
        const card = shareCardText(path, locale)
        return !card?.title || !card.description
      })
      .map(({ path, locale }) => `${locale} ${path}`)
    expect(without).toEqual([])
  })

  it('are the title and description the page gives itself', async () => {
    const differ: string[] = []
    for (const { path, locale } of pages) {
      const head = await metadataOf(path, locale)
      const card = shareCardText(path, locale)
      if (titleOf(head) !== card?.title) differ.push(`${locale} ${path}: title "${card?.title}" and "${titleOf(head)}"`)
      if (head.description !== card?.description) differ.push(`${locale} ${path}: description`)
    }
    expect(differ).toEqual([])
  })

  it('are in the language of the page', () => {
    const english = shareCardText('/pricing', defaultLocale)?.title
    const wrong = locales.filter((locale) => {
      const title = shareCardText('/pricing', locale)?.title
      return title !== copyFor(locale).pricing.metaTitle || (locale !== defaultLocale && title === english)
    })
    expect(wrong).toEqual([])
  })

  it('name the game above the title on a game page, and have nothing above any other title', () => {
    expect(shareCardText('/games/minecraft', 'en')?.kicker).toBe('Minecraft')
    const wrong = pages
      .filter(({ path, locale }) => Boolean(shareCardText(path, locale)?.kicker) !== /^\/games\/[^/]+$/.test(path))
      .map(({ path, locale }) => `${locale} ${path}`)
    expect(wrong).toEqual([])
  })

  it('are only ever the words of a page: anything else has none', () => {
    const notPages = ['', '/nope', '/pricing/', 'pricing', '/es/pricing', '/games/nope', '/legal/nope', '/partners/nope', '/og']
    expect(notPages.filter((path) => shareCardText(path, 'en') !== undefined)).toEqual([])
  })
})

describe('the address of a share card', () => {
  it('names the page and its language', () => {
    expect(shareCardUrl('/games/minecraft', 'es')).toBe('/og?path=%2Fgames%2Fminecraft&locale=es')
  })

  it('is what every page shares itself with: its own card, apart from the home page and a partner with a banner', async () => {
    const wrong: string[] = []
    for (const { path, locale } of pages) {
      const head = await metadataOf(path, locale)
      const card = shareCardText(path, locale)
      const banner = partners.find((partner) => `/partners/${partner.slug}` === path)?.banner
      const own = `/og?path=${encodeURIComponent(path)}&locale=${locale}`
      const want = path === '/' ? '/og-image.png' : (banner ?? own)

      const images = shareImages(head)
      if (images.length !== 1 || images[0].url !== want) {
        wrong.push(`${locale} ${path}: shares ${images.map((image) => image.url).join(', ')}, not ${want}`)
      }
      // The card's alt text is the title it carries.
      if (want === own && images[0]?.alt !== card?.title) wrong.push(`${locale} ${path}: alt text ${images[0]?.alt}`)
      if (JSON.stringify(head.twitter?.images) !== JSON.stringify([want])) wrong.push(`${locale} ${path}: Twitter image`)
    }
    expect(wrong).toEqual([])
  })
})

/** Asks the route for a card, with the query string a link preview would send. */
const draw = (query: string) => GET(new Request(`https://wslatl.com/og${query}`))

/** The picture the route answers with, as bytes. */
const drawnBytes = async (query: string) => Buffer.from(await (await draw(query)).arrayBuffer())

describe('the /og route', () => {
  it('answers 404 for a path that is not a page, a language that is not ours, or no path at all', async () => {
    const queries = [
      '',
      '?locale=en',
      '?path=',
      '?path=/nope&locale=en',
      '?path=/pricing&locale=xx',
      '?path=/pricing&locale=',
      '?path=/es/pricing&locale=es',
      '?path=/pricing/&locale=en',
      '?path=pricing&locale=en',
      '?path=/games/nope&locale=en',
      '?path=/legal/nope&locale=de',
      '?path=/partners/nope&locale=fr',
    ]
    const answers = await Promise.all(queries.map(async (query) => `${query} ${(await draw(query)).status}`))
    expect(answers).toEqual(queries.map((query) => `${query} 404`))
  })

  it('draws a page as a 1200x630 PNG that may be kept for a day', async () => {
    const cards: [string, Locale][] = [
      ['/games/minecraft', 'en'],
      ['/legal/privacy', 'de'],
      ['/pricing', 'es'],
      ['/partners', 'fr'],
      ['/', 'pt'],
    ]
    const wrong: string[] = []
    for (const [path, locale] of cards) {
      const response = await draw(`?path=${encodeURIComponent(path)}&locale=${locale}`)
      const size = imageSize(Buffer.from(await response.arrayBuffer()))
      const got = [
        response.status,
        response.headers.get('content-type'),
        response.headers.get('cache-control'),
        size && `${size.width}x${size.height}`,
      ]
      const want = [
        200,
        'image/png',
        'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        '1200x630',
      ]
      if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${locale} ${path}: ${JSON.stringify(got)}`)
    }
    expect(wrong).toEqual([])
  }, 30_000)

  it('assumes English when it is given no language', async () => {
    expect((await draw('?path=%2Fpricing')).status).toBe(200)
  }, 30_000)

  it('draws a card once, and answers every later request for it from memory', async () => {
    const query = '?path=%2Flegal&locale=fr'
    const before = drawings.count
    const first = await drawnBytes(query)
    const later = await Promise.all([drawnBytes(query), drawnBytes(query), drawnBytes(query)])
    expect(drawings.count - before).toBe(1)
    for (const again of later) expect(again.equals(first)).toBe(true)
  }, 30_000)
})

/** The code points a TrueType font has a glyph for, read from its cmap table (formats 4 and 12). */
function glyphsIn(file: string): Set<number> {
  const font = readFileSync(join(root, 'assets', 'fonts', file))
  const tables = font.readUInt16BE(4)
  let cmap = 0
  for (let i = 0; i < tables; i++) {
    if (font.toString('ascii', 12 + i * 16, 16 + i * 16) === 'cmap') cmap = font.readUInt32BE(20 + i * 16)
  }
  const found = new Set<number>()
  for (let i = 0; i < font.readUInt16BE(cmap + 2); i++) {
    const at = cmap + font.readUInt32BE(cmap + 8 + i * 8)
    const format = font.readUInt16BE(at)
    if (format === 4) {
      const segments = font.readUInt16BE(at + 6) / 2
      const ends = at + 14
      const starts = ends + segments * 2 + 2
      for (let s = 0; s < segments; s++) {
        for (let c = font.readUInt16BE(starts + s * 2); c <= font.readUInt16BE(ends + s * 2) && c < 0xffff; c++) found.add(c)
      }
    } else if (format === 12) {
      for (let g = 0; g < font.readUInt32BE(at + 12); g++) {
        const from = at + 16 + g * 12
        for (let c = font.readUInt32BE(from); c <= font.readUInt32BE(from + 4); c++) found.add(c)
      }
    }
  }
  return found
}

describe('the fonts a share card is drawn in', () => {
  it('have every character the cards use, so none is drawn as an empty box', () => {
    // Geist and Instrument Serif are cut down to the Latin letters the five
    // languages need. A partner whose name has other letters, or a
    // translation with an unusual quote, would otherwise draw as a box.
    const geist = glyphsIn('Geist-400.ttf')
    const geistBold = glyphsIn('Geist-700.ttf')
    const serif = glyphsIn('InstrumentSerif-Italic.ttf')
    const missing = pages.flatMap(({ path, locale }) => {
      const card = shareCardText(path, locale)
      const drawn: [string, Set<number>][] = [
        [card?.title ?? '', geistBold],
        [card?.description ?? '', geist],
        [card?.kicker ?? '', serif],
      ]
      return drawn.flatMap(([text, font]) =>
        [...text]
          .filter((char) => !font.has(char.codePointAt(0) ?? 0))
          .map((char) => `${locale} ${path}: U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`),
      )
    })
    expect(missing).toEqual([])
  })
})

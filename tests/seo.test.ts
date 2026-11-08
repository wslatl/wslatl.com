import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { generateMetadata as homeMetadata } from '@/app/[locale]/page'
import { generateMetadata as gameMetadata } from '@/app/[locale]/games/[slug]/page'
import manifest from '@/app/manifest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { siteConfig } from '@/config/site'
import { games } from '@/data/games'
import { locales } from '@/i18n/config'
import { pageUrl } from '@/lib/metadata'
import { imageSize } from './image-size'
import nextConfig from '../next.config.mjs'

vi.mock('@/components/layout/site-header', () => ({ SiteHeader: () => null }))
vi.mock('@/components/layout/footer', () => ({ Footer: () => null }))
// The home page's contact section reads config/emails.ts, which is server-only.
vi.mock('server-only', () => ({}))

const root = join(__dirname, '..')
const publicFile = (path: string) => readFileSync(join(root, 'public', path))

/** The sizes inside an ICO file, from its directory (0 stands for 256). */
function icoSizes(file: Buffer): number[] {
  const count = file.readUInt16LE(4)
  return Array.from({ length: count }, (_, i) => file.readUInt8(6 + i * 16) || 256)
}

describe('the icons search results and browsers show', () => {
  it('has a square PNG over 48px for Google, which does not take SVG', () => {
    expect(imageSize(publicFile('icon-192.png'))).toEqual({ width: 192, height: 192 })
    expect(imageSize(publicFile('icon-512.png'))).toEqual({ width: 512, height: 512 })
    expect(imageSize(publicFile('icon-maskable-512.png'))).toEqual({ width: 512, height: 512 })
    expect(imageSize(publicFile('apple-icon.png'))).toEqual({ width: 180, height: 180 })
  })

  it('has a favicon.ico holding 16, 32 and 48', () => {
    expect(icoSizes(publicFile('favicon.ico')).toSorted((a, b) => a - b)).toEqual([16, 32, 48])
  })

  it('puts the mark on a solid tile where a transparent icon would not work', () => {
    // iOS fills transparency with black, and a maskable icon must fill its
    // square, so these two are RGB with no alpha channel: PNG colour type 2.
    for (const name of ['apple-icon.png', 'icon-maskable-512.png']) {
      expect(publicFile(name).readUInt8(25), name).toBe(2)
    }
  })

  it('sends the retired favicon.svg to the PNG icon', async () => {
    expect(existsSync(join(root, 'public', 'favicon.svg'))).toBe(false)
    expect(await nextConfig.redirects!()).toContainEqual({
      source: '/favicon.svg',
      destination: '/icon-192.png',
      permanent: true,
    })
  })

  it('has the header mark at three times its 36px display', () => {
    expect(imageSize(publicFile('brand/wslatl-mark.webp'))).toEqual({ width: 108, height: 108 })
  })

  it('stores favicon.ico as classic bitmaps, the form every ICO reader takes', () => {
    const ico = publicFile('favicon.ico')
    for (let i = 0; i < ico.readUInt16LE(4); i++) {
      const at = ico.readUInt32LE(6 + i * 16 + 12)
      // A 40-byte BITMAPINFOHEADER at 32 bits per pixel, not an embedded PNG.
      expect([ico.readUInt32LE(at), ico.readUInt16LE(at + 14)]).toEqual([40, 32])
    }
  })

  it('lists only icons that exist in the web app manifest', () => {
    for (const icon of manifest().icons ?? []) {
      const [width, height] = icon.sizes!.split('x').map(Number)
      expect(imageSize(publicFile(icon.src.slice(1)))).toEqual({ width, height })
    }
  })
})

describe('what Google reads for the site and its pages', () => {
  it('names the brand first in the home page title, in every language', async () => {
    for (const locale of locales) {
      const metadata = await homeMetadata({ params: Promise.resolve({ locale }) })
      expect(metadata.title).toEqual({ absolute: expect.stringMatching(new RegExp(`^${siteConfig.brand}\\b`)) })
      expect(metadata.description).toContain(siteConfig.brand)
    }
  })

  it('gives every game page its own title, in every language', async () => {
    for (const locale of locales) {
      const titles = await Promise.all(
        games.map(async (game) => (await gameMetadata({ params: Promise.resolve({ locale, slug: game.slug }) })).title),
      )
      expect(new Set(titles).size).toBe(games.length)
    }
  })

  it('leaves lastmod out of the sitemap rather than stamping every page with the build date', () => {
    expect(sitemap().filter((entry) => entry.lastModified !== undefined)).toEqual([])
  })

  it('lists the same translations in the sitemap as in the page head, English as the fallback', async () => {
    for (const locale of locales) {
      const head = (await homeMetadata({ params: Promise.resolve({ locale }) })).alternates?.languages
      const entry = sitemap().find((item) => item.url === pageUrl(locale, '/'))
      expect(entry?.alternates?.languages).toEqual(head)
      expect(head).toMatchObject({ 'x-default': siteConfig.siteUrl })
    }
  })
})

describe('the admin, which search engines must leave alone', () => {
  it('is not named in robots.txt, which would only point at it and hide its noindex', () => {
    expect(JSON.stringify(robots())).not.toContain('admin')
  })

  it('is not in the sitemap', () => {
    expect(sitemap().filter((entry) => new URL(entry.url).pathname.startsWith('/admin'))).toEqual([])
  })

  it('is sent with a noindex header on every page and route', async () => {
    const rules = await nextConfig.headers()
    for (const source of ['/admin', '/admin/:path*']) {
      const rule = rules.find((r) => r.source === source)
      expect(rule?.headers, source).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex, nofollow' })
    }
  })
})

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { describe, expect, it, vi } from 'vitest'
import { generateMetadata as homeMetadata } from '@/app/[locale]/page'
import { generateMetadata as gameMetadata } from '@/app/[locale]/games/[slug]/page'
import { generateMetadata as partnerMetadata } from '@/app/[locale]/partners/[slug]/page'
import manifest from '@/app/manifest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { siteConfig } from '@/config/site'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld'
import { games } from '@/data/games'
import { partners } from '@/data/partners'
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

  it('has the header mark at three times its 32px display', () => {
    expect(imageSize(publicFile('brand/wslatl-mark.webp'))).toEqual({ width: 96, height: 96 })
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

/** The Open Graph pictures a page lists, with the tags each carries. */
const shareImages = (metadata: Metadata) =>
  (metadata.openGraph?.images ?? []) as { url: string; alt: string; width: number; height: number; type: string }[]

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

  it('gives every home page a card and picture text in its own language, the English one keeping the static picture', async () => {
    const english = await homeMetadata({ params: Promise.resolve({ locale: 'en' }) })
    const [englishImage] = shareImages(english)
    expect(englishImage.url).toMatch(/^\/og-image\.png\?v=/)
    for (const locale of locales.filter((other) => other !== 'en')) {
      const metadata = await homeMetadata({ params: Promise.resolve({ locale }) })
      const [image] = shareImages(metadata)
      expect(image.url, locale).toBe(`/og?path=%2F&locale=${locale}`)
      expect(image.alt, locale).not.toBe(englishImage.alt)
      expect(image, locale).toMatchObject({ width: 1200, height: 630, type: 'image/png' })
    }
  })

  it('gives Twitter the same picture and alt text as Open Graph, in the page language, and no handle it does not own', async () => {
    for (const locale of locales) {
      const metadata = await homeMetadata({ params: Promise.resolve({ locale }) })
      const [og] = shareImages(metadata)
      expect(metadata.twitter?.images, locale).toEqual([{ url: og.url, alt: og.alt }])
      expect(metadata.twitter, locale).not.toHaveProperty('site')
      expect(metadata.twitter, locale).not.toHaveProperty('creator')
    }
  })

  it('shares every partner profile with its own 1200x630 PNG card, never the 3:1 WebP banner', async () => {
    for (const locale of locales) {
      for (const partner of partners) {
        const metadata = await partnerMetadata({ params: Promise.resolve({ locale, slug: partner.slug }) })
        const [image] = shareImages(metadata)
        expect(image.url, `${locale} ${partner.slug}`).toBe(`/og?path=%2Fpartners%2F${partner.slug}&locale=${locale}`)
        expect(image, `${locale} ${partner.slug}`).toMatchObject({ width: 1200, height: 630, type: 'image/png' })
        expect(metadata.description?.length, `${locale} ${partner.slug}`).toBeGreaterThanOrEqual(70)
      }
    }
  })

  it('keeps every game title inside the width of a result, with the brand on the end', async () => {
    for (const locale of locales) {
      for (const game of games) {
        const metadata = await gameMetadata({ params: Promise.resolve({ locale, slug: game.slug }) })
        const title = `${metadata.title} | ${siteConfig.brand}`
        expect(title.length, `${locale} ${game.slug}: ${title}`).toBeLessThanOrEqual(65)
      }
    }
  })

  it('writes the company in the language of the page, in full, with a way to contact it', () => {
    const descriptions = new Set<string>()
    for (const locale of locales) {
      const html = renderToStaticMarkup(createElement(OrganizationJsonLd, { locale }))
      const org = JSON.parse(html.replace(/^[^>]*>/, '').replace(/<\/script>$/, '').replaceAll('\\u003c', '<'))
      descriptions.add(org.description)
      expect(org).toMatchObject({
        '@id': `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.brand,
        legalName: siteConfig.legal.companyName,
        logo: { '@type': 'ImageObject', width: 512, height: 512 },
        contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support' }],
      })
      expect(org.contactPoint[0].availableLanguage).toEqual([...locales])
    }
    // Five languages, five descriptions.
    expect(descriptions.size).toBe(locales.length)
  })

  it('leaves lastmod out of the sitemap rather than stamping every page with the build date', () => {
    expect(sitemap().filter((entry) => entry.lastModified !== undefined)).toEqual([])
  })

  it('lists every page in the sitemap in every language, English as the fallback, so none is left out', () => {
    const everywhere = [...locales, 'x-default'].toSorted()
    for (const entry of sitemap()) {
      expect(Object.keys(entry.alternates?.languages ?? {}).toSorted(), entry.url).toEqual(everywhere)
    }
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
    const rules = await nextConfig.headers!()
    for (const source of ['/admin', '/admin/:path*']) {
      const rule = rules.find((r) => r.source === source)
      expect(rule?.headers, source).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex, nofollow' })
    }
  })
})

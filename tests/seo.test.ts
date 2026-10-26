import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { generateMetadata as homeMetadata } from '@/app/[locale]/page'
import { generateMetadata as gameMetadata } from '@/app/[locale]/games/[slug]/page'
import manifest from '@/app/manifest'
import sitemap from '@/app/sitemap'
import { siteConfig } from '@/config/site'
import { games } from '@/data/games'
import { locales } from '@/i18n/config'
import { imageSize } from './image-size'

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

  it('draws the mark on a tile, so it does not vanish on a white results page', () => {
    // The mark is white: a favicon.svg without a background is invisible on white.
    expect(publicFile('favicon.svg').toString('utf8')).toMatch(/<rect [^>]*fill="#[0-9a-f]{6}"/i)
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
})

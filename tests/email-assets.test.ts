import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { isRootFile } from '@/i18n/routing'
import { proxy } from '@/proxy'
import nextConfig from '../next.config.mjs'

const root = join(__dirname, '..')
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/** The shared email images: what every app's emails load from wslatl.com/email/. */
const files = [
  { path: '/email/wslatl-wide-dark.png', width: 196, height: 56 },
  { path: '/email/wslatl-mark.png', width: 64, height: 64 },
]

describe('the shared email images', () => {
  for (const { path, width, height } of files) {
    it(`${path} is a small PNG at twice its display size`, () => {
      const file = join(root, 'public', path)
      const bytes = readFileSync(file)
      expect(bytes.subarray(0, 8).equals(pngSignature)).toBe(true)
      // The IHDR chunk: width and height as big-endian 32-bit numbers.
      expect(bytes.readUInt32BE(16)).toBe(width)
      expect(bytes.readUInt32BE(20)).toBe(height)
      expect(statSync(file).size).toBeLessThan(15 * 1024)
    })

    it(`${path} is a file, so the proxy never redirects it to a language`, () => {
      expect(isRootFile(path)).toBe(true)
      const response = proxy(new NextRequest(`https://wslatl.com${path}?v=20261121`))
      expect(response.headers.get('x-middleware-next')).toBe('1')
      expect(response.headers.get('x-middleware-rewrite')).toBeNull()
      expect(response.headers.get('location')).toBeNull()
    })
  }

  it('answers a page under /email/ as a page, so a probe gets our 404', () => {
    expect(isRootFile('/email/pricing')).toBe(false)
    expect(isRootFile('/email/wslatl-mark.svg')).toBe(false)
  })

  it('is cached for a year, publicly and immutably', async () => {
    const rules = await nextConfig.headers!()
    const rule = rules.find((r) => r.source === '/email/:path*')
    expect(rule?.headers).toContainEqual({ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' })
  })
})

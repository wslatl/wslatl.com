import { describe, expect, it, vi } from 'vitest'
import { paths, send } from './site'

/**
 * /og draws a page's share card from two values in its address, path and
 * locale, which anyone can fill with anything. It may only ever draw a card
 * for a real page in a real language, in that page's own words: anything
 * else is a plain 404 that repeats nothing of what was sent, draws nothing
 * and keeps nothing.
 */
vi.mock('server-only', () => ({}))

// Drawing is counted rather than done: what matters here is that nothing
// from outside gets drawn or kept. tests/share-card.test.ts draws for real.
const drawn = vi.hoisted(() => ({ cards: [] as unknown[] }))
vi.mock('next/og', () => ({
  ImageResponse: class {
    constructor(element: unknown) {
      drawn.cards.push(element)
    }
    arrayBuffer() {
      return Promise.resolve(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer)
    }
  },
}))

const card = (query: string) => send(`${paths.shareCard}?${query}`, { method: 'GET' })
const ask = (path: string, locale?: string) =>
  card(`path=${encodeURIComponent(path)}${locale === undefined ? '' : `&locale=${encodeURIComponent(locale)}`}`)

const hostilePaths = [
  '',
  '/../../etc/passwd',
  '../../../../.env',
  '/games/../pricing',
  '/games/./minecraft',
  '/games/minecraft/',
  '//games/minecraft',
  '/GAMES/minecraft',
  '/games/minecraft%00',
  '/games/minecraft\u0000',
  '/games/minecraft?x=1',
  '/games/minecraft#x',
  ' /pricing',
  '/pricing ',
  '/pricing\n',
  '\\pricing',
  'pricing',
  '/ｐｒｉｃｉｎｇ',
  '/__proto__',
  '/constructor',
  '/prototype',
  '/toString',
  '__proto__',
  'https://evil.example/',
  '//evil.example',
  'javascript:alert(1)',
  '<script>alert(1)</script>',
  '/legal/../../../.env',
  '/.env',
  '/admin',
  '/admin/login',
  '/og',
  `/${'a'.repeat(10_000)}`,
  `/games/${'%'.repeat(200)}`,
  '/partners/../../../../windows/win.ini',
]

const hostileLocales = [
  'EN',
  'en-US',
  'en_US',
  'es-ES',
  ' es',
  'es ',
  'xx',
  '',
  '__proto__',
  'constructor',
  'toString',
  'hasOwnProperty',
  '../en',
  'en/../es',
  'en%00',
  'en\u0000',
  'en,es',
  '<script>',
  'a'.repeat(10_000),
]

async function expectNothing(response: Response, what: string) {
  expect(response.status, what).toBe(404)
  const body = await response.text()
  expect(body, what).toBe('Not found')
  expect(response.headers.get('content-type') ?? '', what).not.toMatch(/image|html/)
  expect(response.headers.get('set-cookie'), what).toBeNull()
}

describe('a share card asked for with a hostile path', () => {
  it('is a plain 404 that repeats nothing, in every language', async () => {
    for (const path of hostilePaths) {
      for (const locale of [undefined, 'en', 'es', 'de']) await expectNothing(await ask(path, locale), `${JSON.stringify(path).slice(0, 40)} ${locale}`)
    }
    expect(drawn.cards).toEqual([])
  })
})

describe('a share card asked for with a hostile language', () => {
  it('is a plain 404 for a real page too', async () => {
    for (const locale of hostileLocales) {
      for (const path of ['/', '/pricing', '/games/minecraft', '/legal/privacy']) {
        await expectNothing(await ask(path, locale), `${path} ${JSON.stringify(locale).slice(0, 40)}`)
      }
    }
    expect(drawn.cards).toEqual([])
  })
})

describe('the query string itself', () => {
  it('cannot be bent: unknown, repeated, empty or broken parameters draw nothing new', async () => {
    for (const query of [
      '',
      'path',
      'path=',
      'locale=es',
      'path=%2Fpricing%00&locale=en',
      'path=%E0%A4%A&locale=en',
      'path=%&locale=%',
      'path[]=/pricing',
      'path.x=/pricing',
      'PATH=/pricing',
      `${'x='.repeat(2000)}`,
    ]) {
      await expectNothing(await card(query), query.slice(0, 40))
    }
    expect(drawn.cards).toEqual([])
  })

  it('draws a real page once, however often it is asked for, and a repeated parameter cannot add another', async () => {
    const first = await ask('/pricing', 'es')
    expect(first.status).toBe(200)
    expect(first.headers.get('content-type')).toBe('image/png')
    const again = await Promise.all([
      ask('/pricing', 'es'),
      card('path=/pricing&locale=es&path=/../../etc/passwd'),
      card('locale=es&path=/pricing&locale=__proto__'),
      card('path=/pricing&locale=es&x=<script>'),
    ])
    expect(again.map((answer) => answer.status)).toEqual([200, 200, 200, 200])
    expect(drawn.cards.length).toBe(1)
  })
})

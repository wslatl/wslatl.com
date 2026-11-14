import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rewriteTarget } from '@/i18n/routing'
import { liveStatus } from '@/lib/live-status/source'
import { unknownStatus } from '@/lib/live-status/snapshot'
import { kumaHeartbeats, kumaPage } from '../fixtures/kuma'
import { paths, send } from './site'

/**
 * /live-status.json reads the status page for the home page, and anyone can
 * ask it anything. It may only ever ask the status page's two fixed
 * addresses, whatever arrives with the request; answer every visitor alike,
 * repeating nothing they sent; keep the status page from being flooded,
 * however many arrive; and never fail, answering "unknown" instead.
 */
vi.mock('server-only', () => ({}))

const statusPage = 'https://status.wslatl.com'
const asked: string[] = []
let answer: (url: string) => Response | Promise<Response>

/** The status page as Kuma answers it now, and a record of every address the server asks. */
function kuma(url: string): Response {
  if (url === `${statusPage}/api/status-page/wslatl`) return Response.json(kumaPage)
  if (url === `${statusPage}/api/status-page/heartbeat/wslatl`) return Response.json(kumaHeartbeats(Date.now()))
  return new Response('not here', { status: 404 })
}

beforeEach(() => {
  liveStatus.forget()
  asked.length = 0
  answer = kuma
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>(async (input) => {
      const url = String(input instanceof Request ? input.url : input)
      asked.push(url)
      return answer(url)
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const fixed = [`${statusPage}/api/status-page/heartbeat/wslatl`, `${statusPage}/api/status-page/wslatl`]
const read = (path: string = paths.liveStatus, init: Parameters<typeof send>[1] = {}) => send(path, { method: 'GET', ...init })

describe('the live status route', () => {
  it('is served as it is, never given a language', () => {
    expect(rewriteTarget(paths.liveStatus)).toBeNull()
    // Only that exact path.
    expect(rewriteTarget(`${paths.liveStatus}/`)).toBe(`/en${paths.liveStatus}/`)
  })

  it('answers with each location\'s state as JSON, kept for half a minute at most', async () => {
    const response = await read()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8')
    expect(response.headers.get('cache-control')).toBe('public, max-age=30')
    const body = await response.json()
    expect(Object.keys(body).toSorted()).toEqual(['checkedAt', 'locations'])
    expect(body.locations).toEqual({ 'los-angeles': 'up', 'new-york': 'up' })
    expect(asked.toSorted()).toEqual(fixed)
  })

  it('reads nothing from the request: any query, header or cookie gets the same answer, and asks nothing new', async () => {
    const first = await (await read()).text()
    const bent = [
      `${paths.liveStatus}?url=https://evil.example/`,
      `${paths.liveStatus}?slug=../../admin&host=evil.example`,
      `${paths.liveStatus}?${'x'.repeat(4000)}=1`,
      `${paths.liveStatus}#https://evil.example`,
    ]
    for (const path of bent) {
      const response = await read(path, {
        headers: {
          host: 'evil.example',
          'x-forwarded-host': 'evil.example',
          origin: 'https://evil.example',
          cookie: 'slug=evil',
          'accept-language': 'xx',
          referer: 'https://evil.example/',
        },
      })
      expect(response.status, path).toBe(200)
      const body = await response.text()
      expect(body, path).toBe(first)
      expect(body, path).not.toContain('evil')
    }
    // One read of the status page served them all, from the two fixed addresses.
    expect(asked.toSorted()).toEqual(fixed)
  })

  it('takes reads only: every other method is refused before it reaches the route', async () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      const response = await send(paths.liveStatus, { method, body: method === 'OPTIONS' ? undefined : '{}' })
      expect(response.status, method).toBe(405)
    }
    expect((await send(paths.liveStatus, { method: 'GET', headers: { 'next-action': 'x' } })).status).toBe(405)
    expect(asked).toEqual([])
  })

  it('asks the status page once for a crowd, and once a minute at most', async () => {
    const answers = await Promise.all(Array.from({ length: 100 }, () => read()))
    expect(answers.every((response) => response.status === 200)).toBe(true)
    expect(asked).toHaveLength(2)
    await read()
    expect(asked).toHaveLength(2)
  })

  describe('with the status page down, late or wrong', () => {
    const broken: [string, (url: string) => Response | Promise<Response>][] = [
      ['down', () => Promise.reject(new TypeError('fetch failed'))],
      ['a Cloudflare error page', () => new Response('<html>Error 522</html>', { status: 522, headers: { 'Content-Type': 'text/html' } })],
      ['a redirect elsewhere', () => new Response(null, { status: 301, headers: { Location: 'https://evil.example/api' } })],
      ['bad JSON', () => new Response('{"publicGroupList":', { headers: { 'Content-Type': 'application/json' } })],
      // Kuma's own answer, but two megabytes long: only its size is wrong.
      ['an answer far too large', (url) => new Response(`${JSON.stringify(url.includes('/heartbeat/') ? kumaHeartbeats(Date.now()) : kumaPage)}${' '.repeat(2 * 1024 * 1024)}`, { headers: { 'Content-Type': 'application/json' } })],
      ['hostile JSON', () => Response.json({ publicGroupList: [{ name: 'Los Angeles', monitorList: [{ id: '__proto__' }] }], heartbeatList: { __proto__: [] } })],
    ]

    for (const [what, respond] of broken) {
      it(`answers every location unknown, at once and never kept, for ${what}`, async () => {
        answer = respond
        const response = await read()
        expect(response.status).toBe(200)
        expect(response.headers.get('cache-control')).toBe('no-store')
        expect(await response.json()).toEqual(unknownStatus())
        // Asked once, and not again for every visitor while it is failing.
        await read()
        expect(asked).toHaveLength(2)
        expect(asked.every((url) => fixed.includes(url))).toBe(true)
      })
    }
  })
})

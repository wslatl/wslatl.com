import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import { defaultLocale, locales, stripLocale } from '@/i18n/config'
import { proxy } from '@/proxy'
import { type Admin, logsOf, makeAdmin, origin, paths, restart, send, setUp, signInFully, tearDown, wholeResponse } from './site'

/**
 * Every route handler, fed made-up requests by the thousand: odd methods,
 * headers taken away or bent, bodies of every shape, cookies real, tampered
 * and invented, query strings of anything. Whatever comes in, the site
 * answers with a status it means to give, never a 5xx; sets a cookie only
 * when the right password signs in; acts only on a request that is the
 * owner's own; and never lets a secret out, in an answer or in the log.
 *
 * The requests come from a seeded generator, so a failure names its seed
 * and case and can be run again exactly:
 *
 *   FUZZ_SEED=1234 npx vitest run tests/attack/fuzz.test.ts
 */
vi.mock('server-only', () => ({}))
vi.mock('next/og', () => ({
  ImageResponse: class {
    arrayBuffer() {
      return Promise.resolve(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer)
    }
  },
}))
vi.setConfig({ testTimeout: 120_000 })

const seed = Number(process.env.FUZZ_SEED ?? 20261110)

/** mulberry32: small, fast, and the same numbers for the same seed everywhere. */
function generator(start: number) {
  let state = start >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1))
  const pick = <T>(list: readonly T[]): T => list[int(0, list.length - 1)]
  const chance = (p: number) => next() < p
  const pieces = [
    'a', 'Z', '0', '9', '-', '_', '.', '/', '\\', '..', '../', '%2e%2e%2f', '%00', '\u0000', '\u0007', '\t', ' ', '%20',
    '?', '#', '&', '=', ';', ',', ':', '@', '"', "'", '`', '<', '>', '<script>', '{', '}', '[', ']', '$', '${x}',
    '__proto__', 'constructor', 'prototype', 'toString', 'password', 'admin', 'v1.2.3', '../../etc/passwd',
    'C:\\Windows', '%', '%%', '%G0', '\u202e', '\ufeff', 'é', 'ß', 'ｐ', '😀', '\ud800', 'null', 'true', '-0', '1e308',
  ]
  const text = (max = 40): string => {
    if (chance(0.03)) return pick(pieces).repeat(int(500, 5000))
    return Array.from({ length: int(0, max) }, () => pick(pieces)).join('')
  }
  const jsonValue = (depth = 0): unknown => {
    switch (int(0, depth > 3 ? 4 : 7)) {
      case 0:
        return null
      case 1:
        return chance(0.5)
      case 2:
        return pick([0, -1, 1e308, -1e-308, 2 ** 53 + 1, 0.1, -0])
      case 3:
      case 4:
        return text()
      case 5:
        return Array.from({ length: int(0, 4) }, () => jsonValue(depth + 1))
      default:
        return Object.fromEntries(Array.from({ length: int(0, 5) }, () => [chance(0.3) ? pick(['password', '__proto__', 'constructor', 'tag', 'by']) : text(10), jsonValue(depth + 1)]))
    }
  }
  return { next, int, pick, chance, text, jsonValue }
}

let admin: Admin
let cookie = ''
let device = ''
let rng = generator(seed)

/** Signs in again, as after a fresh start of the server, and keeps both cookies for the next cases. */
async function freshSignIn() {
  const signedIn = await signInFully(admin)
  cookie = signedIn.session
  device = signedIn.device
}

beforeAll(async () => {
  admin = makeAdmin()
  setUp(admin)
  await freshSignIn()
})
afterAll(() => tearDown(admin))

const methods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'PROPFIND', 'get', 'Post', 'X-ANYTHING']
const contentTypes = ['application/json', 'application/json; charset=utf-8', 'APPLICATION/JSON', 'application/json;', 'application/jsonx', 'text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data; boundary=x', 'application/json, text/plain', '*/*', '']
const origins = [origin, origin, origin, 'https://evil.example', 'null', '', 'https://wslatl.com.evil.example', 'http://wslatl.com', 'https://WSLATL.COM', 'https://wslatl.com:443', 'https://knowledge.wslatl.com', ' https://wslatl.com']
const fetchSites = ['same-origin', 'same-origin', 'same-origin', 'cross-site', 'same-site', 'none', '', 'SAME-ORIGIN']
const ips = ['198.51.100.7', '2001:db8::1', '::ffff:198.51.100.9', '', 'not an ip', '999.1.1.1', '198.51.100.7, 10.0.0.1', `fe80::1%eth0`]

/** Only what may stand in a header value: anything else the Request itself refuses. */
const printable = (value: string) => value.replace(/[^\x21-\x7e]/g, '')

/** The company profile without the date it was made (once, at build time, on the real site). */
const undated = (body: string) => JSON.stringify({ ...JSON.parse(body), updatedAt: undefined })

/** A request around one of the site's own, bent at random. */
function madeUp(path: string, usual: string) {
  const { pick, chance, int, text, jsonValue } = rng
  const method = chance(0.8) ? usual : pick(methods)
  const headers: Record<string, string> = {}
  const maybe = (name: string, value: string) => {
    if (chance(0.9) && value !== '') headers[name] = value
  }
  maybe('host', chance(0.95) ? 'wslatl.com' : pick(['evil.example', 'wslatl.com:3000', 'localhost', '']))
  maybe('origin', pick(origins))
  maybe('sec-fetch-site', pick(fetchSites))
  maybe('content-type', pick(contentTypes))
  maybe('cf-connecting-ip', pick(ips))
  if (chance(0.3)) headers['x-forwarded-for'] = `${int(1, 255)}.${int(0, 255)}.${int(0, 255)}.${int(0, 255)}`
  if (chance(0.2)) headers['x-forwarded-host'] = pick(['wslatl.com', 'evil.example', 'wslatl.com, evil.example'])
  if (chance(0.05)) headers['next-action'] = printable(text(20)) || 'x'
  if (chance(0.05)) headers['content-security-policy'] = `script-src 'nonce-${printable(text(10))}'`
  const session = cookie.split('=')[0]
  const real = cookie.slice(session.length + 1)
  const jar = pick([
    '',
    cookie,
    cookie,
    `${session}=${real.slice(0, int(0, real.length))}`,
    `${session}=${real}${pick(['=', '!', 'A', '.', '%00'])}`,
    `${session}=${printable(text(60))}`,
    `wslatl_admin=${real}`,
    `${session}=x; ${cookie}`,
    // The device cookie, real, alone or beside the session, and made up.
    device,
    `${device}; ${cookie}`,
    `${device.slice(0, -1)}${pick(['A', 'B', '='])}`,
    `admin_device=${printable(text(65))}`,
  ])
  if (jar) headers.cookie = jar
  // Where the request says it was sent, and where it says it came from.
  const addressed = (headers['x-forwarded-host']?.split(',')[0] ?? headers.host ?? '').trim().toLowerCase()
  let from = ''
  try {
    from = new URL(headers.origin ?? '').host
  } catch {
    // No Origin, or not an address: from nowhere.
  }
  const passwordGuess = pick([admin.password, `${admin.password} `, admin.password.toUpperCase(), admin.passwordHash, text(30), ''])
  const body = pick([
    () => JSON.stringify(jsonValue()),
    () => JSON.stringify({ password: passwordGuess, ...(chance(0.3) ? { extra: jsonValue() } : {}) }),
    () => JSON.stringify({ password: passwordGuess }),
    () => text(200),
    () => '',
    () => '{"password":',
    () => `{"password":"${admin.password}"}`.padEnd(int(4097, 6000), ' '),
    () => JSON.stringify({ password: admin.password }),
  ])()
  const hasBody = !['GET', 'HEAD', 'get'].includes(method)
  return {
    method,
    headers,
    body: hasBody ? body : undefined,
    rightPassword: hasBody && (() => {
      try {
        return JSON.parse(body)?.password === admin.password
      } catch {
        return false
      }
    })(),
    // The last cookie of a name is the one read; a browser sends the real one only to this site.
    realCookie: jar.endsWith(cookie),
    // Sent by a page of the site it was sent to, by its own account. A
    // browser fills Origin and Sec-Fetch-Site itself, so a page elsewhere
    // can never claim this.
    fromHere: from !== '' && from === addressed && (!('sec-fetch-site' in headers) || headers['sec-fetch-site'] === 'same-origin'),
    describe: () => `seed=${seed} ${method} ${path} ${JSON.stringify(headers).slice(0, 300)} ${JSON.stringify(body).slice(0, 120)}`,
  }
}

type Input = ReturnType<typeof madeUp>

/**
 * Sends made-up requests, and checks what holds for every answer the admin
 * gives. allowedIf says when a success is allowed at all: a 2xx for any other
 * request fails the case. Gives back how many cases were sent.
 */
async function fuzz(path: string, usual: string, cases: number, allowed: number[], allowedIf: (input: Input) => boolean): Promise<number> {
  rng = generator(seed + path.length * 7919 + usual.length)
  let sent = 0
  for (let i = 0; i < cases; i++) {
    if (i % 20 === 0) {
      restart()
      await freshSignIn()
    }
    const input = madeUp(path, usual)
    const label = `case ${i}: ${input.describe()}`
    let response: Response
    const { result, logs } = await logsOf(async () => {
      try {
        response = await send(path, { method: input.method, headers: input.headers, body: input.body })
      } catch (error) {
        // Only the Fetch standard's own refusals: a method or header no browser can send.
        if (error instanceof TypeError) return null
        throw error
      }
      return response
    })
    if (!result) continue
    sent++
    const status = result.status
    expect(allowed, label).toContain(status)
    const text = await wholeResponse(result)
    for (const secret of admin.secrets) {
      expect(text.includes(secret), `${label}: a secret in the answer`).toBe(false)
      expect(logs.includes(secret), `${label}: a secret in the log`).toBe(false)
    }
    // A cookie with a value (a session, or a device cookie) only the right password gets.
    const given = result.headers.getSetCookie().some((header) => !/^[^=]+=;/.test(header))
    expect(!given || (path === paths.login && status === 200 && input.rightPassword), `${label}: a cookie it should not have set`).toBe(true)
    const json = result.headers.get('content-type')?.includes('json') ?? false
    expect(!json || result.headers.get('cache-control') === 'no-store', `${label}: an answer a cache may keep`).toBe(true)
    expect(status >= 300 || allowedIf(input), `${label}: a success it should not have been`).toBe(true)
    const asked = existsSync(join(admin.updaterDir, 'request.json'))
    expect(!asked || (path === paths.update && status === 202), `${label}: an update asked for`).toBe(true)
    if (asked) rmSync(join(admin.updaterDir, 'request.json'))
    // A session ended by a fuzzed sign-out: sign in again for the next case.
    if (path === paths.logout && status === 200 && input.realCookie) {
      restart()
      await freshSignIn()
    }
  }
  return sent
}

describe('fuzzing the admin routes', () => {
  it('login: signs in only with the right password, from this site', async () => {
    const allowed = [200, 400, 401, 403, 405, 413, 415, 429]
    expect(await fuzz(paths.login, 'POST', 150, allowed, (input) => input.rightPassword && input.fromHere)).toBeGreaterThan(100)
  })

  it('logout: never fails, and ends nothing it was not sent from this site', async () => {
    const allowed = [200, 400, 403, 405, 413, 415]
    expect(await fuzz(paths.logout, 'POST', 120, allowed, (input) => input.fromHere)).toBeGreaterThan(80)
  })

  it('the status route: answers only the signed-in owner', async () => {
    expect(await fuzz(paths.update, 'GET', 150, [200, 401, 403, 405], (input) => input.realCookie)).toBeGreaterThan(100)
  })

  it('asking for an update: only the signed-in owner, from this site', async () => {
    const allowed = [202, 400, 401, 403, 405, 409, 413, 415, 503]
    expect(await fuzz(paths.update, 'POST', 150, allowed, (input) => input.realCookie && input.fromHere)).toBeGreaterThan(100)
  })

  it('copying the updater: only the signed-in owner, from this site, and never a 5xx', async () => {
    const allowed = [200, 400, 401, 403, 405, 409, 413, 415, 503]
    expect(await fuzz(paths.adoptUpdater, 'POST', 120, allowed, (input) => input.realCookie && input.fromHere)).toBeGreaterThan(80)
  })
})

describe('fuzzing the public routes', () => {
  // Every page there is, by language: the only cards /og may draw.
  const pages = new Set(
    sitemap().map((entry) => {
      const { pathname } = new URL(entry.url)
      const locale = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)) ?? defaultLocale
      return `${locale} ${stripLocale(pathname)}`
    }),
  )
  const real = [...pages].map((page) => page.split(' '))

  it('/og: draws a real page in a real language, and is a 404 for anything else', async () => {
    rng = generator(seed + 1)
    const { pick, chance, text } = rng
    for (let i = 0; i < 600; i++) {
      const [locale, path] = pick(real)
      const params = new URLSearchParams()
      const sentPath = chance(0.4) ? path : chance(0.5) ? `${path}${text(4)}` : text(30)
      const sentLocale = chance(0.4) ? locale : chance(0.3) ? undefined : chance(0.5) ? `${locale}${text(2)}` : text(6)
      if (chance(0.95)) params.append('path', sentPath)
      if (sentLocale !== undefined) params.append('locale', sentLocale)
      if (chance(0.1)) params.append(pick(['path', 'locale', 'x']), text(10))
      const response = await send(`${paths.shareCard}?${params}`, { method: 'GET' })
      const asked = new URL(`${origin}/og?${params}`).searchParams
      const wanted = `${asked.get('locale') ?? defaultLocale} ${asked.get('path') ?? ''}`
      const label = `seed=${seed} case ${i}: ${params}`.slice(0, 300)
      expect(response.status, label).toBe(pages.has(wanted) ? 200 : 404)
      const body = await response.text()
      expect(response.status === 200 || body === 'Not found', label).toBe(true)
    }
  })

  it('/company.json: the same profile whatever is sent with it, and nothing of what was sent', async () => {
    rng = generator(seed + 2)
    const { text, pick } = rng
    const first = undated(await (await send(paths.companyProfile, { method: 'GET' })).text())
    for (let i = 0; i < 100; i++) {
      const key = printable(text(10)) || 'x'
      const value = printable(text(20)) || 'y'
      const response = await send(`${paths.companyProfile}?${encodeURIComponent(key)}=${encodeURIComponent(value)}`, {
        method: pick(['GET', 'HEAD']),
        headers: { cookie: printable(text(30)), 'accept-language': printable(text(10)) },
      })
      expect(response.status, `case ${i}`).toBe(200)
      const body = await response.text()
      expect(undated(body), `case ${i}`).toBe(first)
      expect(value.length <= 8 || !body.includes(value), `case ${i}`).toBe(true)
    }
  })

  it('the proxy: any address and method, never a crash, a redirect or a rewrite off the site', () => {
    rng = generator(seed + 3)
    const { pick, chance, text } = rng
    for (let i = 0; i < 2000; i++) {
      const path = `/${text(30)}`.replace(/[#?]/g, '')
      const method = pick(methods)
      const headers: Record<string, string> = chance(0.1) ? { 'next-action': 'x' } : {}
      let request: NextRequest
      try {
        request = new NextRequest(`${origin}${path}`, { method, headers })
      } catch {
        continue
      }
      const response = proxy(request)
      const label = `seed=${seed} case ${i}: ${method} ${JSON.stringify(path).slice(0, 100)}`
      expect([200, 405], label).toContain(response.status)
      expect(response.headers.get('location'), label).toBeNull()
      const rewrite = response.headers.get('x-middleware-rewrite')
      expect(rewrite === null || new URL(rewrite).origin === origin, label).toBe(true)
      expect(!headers['next-action'] || response.status === 405, label).toBe(true)
    }
  })
})

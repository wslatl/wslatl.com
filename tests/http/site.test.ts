import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import shortLinks from '../../config/links.json' with { type: 'json' }
import { cookieProblems, headerProblems } from '../../scripts/check-security.mjs'
import { fakeGitHub, type FakeGitHub } from '../attack/fake-github'
import { raw, type Site, startSite } from './server'

/**
 * The attack tests again, against the real thing: the site as `npm run
 * build` made it, run by `next start`. What only a build can show is here:
 * the headers Next adds from next.config.mjs, the pages themselves, Next's
 * own redirects, and what the server prints.
 *
 *   npm run build && npm run test:http
 */
let site: Site
let github: FakeGitHub
const answers: string[] = []

/** Release notes as whoever publishes a release could write them. */
const hostileNotes = [
  'Changes',
  '- <script>alert("notes")</script>',
  '- <img src=x onerror=alert(1)>',
  '- [click](javascript:alert(1))',
  '- [data](data:text/html,<script>alert(1)</script>)',
  '- ![x](https://evil.example/track.png)',
  '- <iframe src="https://evil.example"></iframe>',
].join('\n')

beforeAll(async () => {
  github = await fakeGitHub('wslatl/wslatl.com', [], {
    tag_name: 'v99.0.0',
    name: 'v99.0.0',
    body: hostileNotes,
    html_url: 'javascript:alert(1)',
    published_at: '2026-11-10T00:00:00Z',
    draft: false,
    prerelease: false,
  })
  site = await startSite({ GITHUB_API_URL: github.api })
}, 120_000)

afterAll(async () => {
  await site?.stop()
  await github?.close()
})

/** A request to the site that keeps its answer, so the secrets check at the end can read every one. */
async function ask(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${site.base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(30_000), ...init })
  const body = await response.clone().text()
  answers.push(`${response.status} ${path}\n${[...response.headers].map(([name, value]) => `${name}: ${value}`).join('\n')}\n\n${body}`)
  return response
}

const sameSite = () => ({ origin: site.base, 'sec-fetch-site': 'same-origin', 'content-type': 'application/json' })

/** The browser's device cookie from its first sign-in, sent with every later one, as a browser would. */
let device = ''

async function signIn(): Promise<{ cookie: string; setCookies: string[] }> {
  const response = await ask('/admin/api/login', {
    method: 'POST',
    headers: { ...sameSite(), ...(device && { cookie: device }) },
    body: JSON.stringify({ password: site.password }),
  })
  expect(response.status).toBe(200)
  const setCookies = response.headers.getSetCookie()
  device = setCookies.find((header) => header.startsWith('admin_device='))?.split(';')[0] ?? ''
  const session = setCookies.find((header) => header.startsWith('__Host-wslatl_admin=')) ?? ''
  return { cookie: session.split(';')[0], setCookies }
}

describe('the security headers', () => {
  it('are on every kind of answer: pages, files, errors, redirects, refusals and the admin', async () => {
    const home = await (await ask('/')).text()
    const asset = /\/_next\/static\/[^"']+\.js/.exec(home)?.[0]
    expect(asset).toBeTruthy()
    const { cookie } = await signIn()
    const kinds: [string, string, RequestInit, { admin?: boolean; page?: boolean }][] = [
      ['the home page', '/', {}, {}],
      ['a page', '/pricing', {}, {}],
      ['a page in Spanish', '/es/pricing', {}, {}],
      ['a legal document', '/legal/privacy', {}, {}],
      ['a page that does not exist', '/no-such-page', {}, {}],
      ['an unknown game in German', '/de/games/no-such-game', {}, {}],
      ['a missing file', '/no-such-file.js', {}, {}],
      ['a script', asset ?? '/', {}, {}],
      ['a share card', '/og?path=/pricing&locale=en', {}, {}],
      ['a share card that does not exist', '/og?path=/nope', {}, {}],
      ['the company profile', '/company.json', {}, {}],
      ['robots.txt', '/robots.txt', {}, {}],
      ['the sitemap', '/sitemap.xml', {}, {}],
      // Not the redirects of moved pages and short links: Next sends those
      // without the headers of next.config.mjs. They have no content, the
      // page each leads to has every header, and SECURITY.md has the rest.
      ['a method the site does not take', '/', { method: 'PUT' }, {}],
      ['a Server Action', '/pricing', { method: 'POST', headers: { 'next-action': 'x' } }, {}],
      ['the admin, signed out', '/admin', {}, { admin: true }],
      ['the sign-in page', '/admin/login', {}, { admin: true, page: true }],
      ['the dashboard', '/admin', { headers: { cookie } }, { admin: true, page: true }],
      ['a page under /admin that does not exist', '/admin/no-such-page', {}, { admin: true, page: true }],
      ['an admin route, signed out', '/admin/api/update', {}, { admin: true }],
      ['an admin route, wrong method', '/admin/api/login', {}, { admin: true }],
      ['an admin route, a method nobody takes', '/admin/api/update', { method: 'DELETE' }, { admin: true }],
    ]
    for (const [what, path, init, options] of kinds) {
      const response = await ask(path, init)
      expect(headerProblems(response.headers, options), `${what} (${response.status})`).toEqual([])
    }
  })

  it('give each admin page its own nonce, carried by every script on it, and leave no inline style to block', async () => {
    const { cookie } = await signIn()
    const seen = new Set<string>()
    for (const [path, headers] of [
      ['/admin/login', {}],
      ['/admin/login', {}],
      ['/admin', { cookie }],
      ['/admin/no-such-page', {}],
    ] as const) {
      const response = await ask(path, { headers })
      const html = await response.text()
      const nonce = /'nonce-([^']+)'/.exec(response.headers.get('content-security-policy') ?? '')?.[1] ?? ''
      expect(nonce, path).not.toBe('')
      seen.add(nonce)
      const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map(([tag]) => tag)
      expect(scripts.length, path).toBeGreaterThan(0)
      for (const tag of scripts) expect(tag, path).toContain(`nonce="${nonce}"`)
      expect(html, path).not.toMatch(/\sstyle="/)
      expect([...html.matchAll(/<style\b[^>]*>/g)].filter(([tag]) => !tag.includes(`nonce="${nonce}"`)), path).toEqual([])
    }
    expect(seen.size).toBe(4)
  })

  it('keep the admin out of every cache and every search engine', async () => {
    const { cookie } = await signIn()
    for (const [path, headers] of [
      ['/admin/login', {}],
      ['/admin', { cookie }],
      ['/admin/api/update', { cookie }],
    ] as const) {
      const response = await ask(path, { headers })
      expect(response.headers.get('cache-control'), path).toMatch(/no-store/)
      expect(response.headers.get('x-robots-tag'), path).toMatch(/noindex/)
    }
  })
})

describe('the session, through the real server', () => {
  it('is a __Host- cookie with every flag, beside a device cookie with every flag, and only the real one opens the dashboard', async () => {
    const { cookie, setCookies } = await signIn()
    expect(setCookies.map((header) => header.split('=')[0]).toSorted()).toEqual(['__Host-wslatl_admin', 'admin_device'])
    for (const header of setCookies) expect(cookieProblems(header), header.split('=')[0]).toEqual([])
    expect(setCookies.find((header) => header.startsWith('admin_device='))).toMatch(/Path=\/admin(;|$)/)
    expect(cookie.startsWith('__Host-wslatl_admin=')).toBe(true)
    expect((await ask('/admin', { headers: { cookie } })).status).toBe(200)
    const tampered = `${cookie.slice(0, -1)}${cookie.endsWith('A') ? 'B' : 'A'}`
    for (const forged of [tampered, `${cookie}=`, '__Host-wslatl_admin=a.b', `wslatl_admin=${cookie.split('=')[1]}`]) {
      const page = await ask('/admin', { headers: { cookie: forged } })
      expect(page.status, forged).toBe(307)
      expect(page.headers.get('location'), forged).toBe('/admin/login')
      expect((await ask('/admin/api/update', { headers: { cookie: forged } })).status, forged).toBe(401)
    }
  })

  it('ends for good on sign-out: the old cookie opens nothing', async () => {
    const { cookie } = await signIn()
    const out = await ask('/admin/api/logout', { method: 'POST', headers: { ...sameSite(), cookie }, body: '{}' })
    expect(out.status).toBe(200)
    expect(out.headers.get('set-cookie')).toMatch(/^__Host-wslatl_admin=;/)
    expect((await ask('/admin', { headers: { cookie } })).status).toBe(307)
    expect((await ask('/admin/api/update', { headers: { cookie } })).status).toBe(401)
  })

  it('cannot be started, used or ended from another site', async () => {
    const { cookie } = await signIn()
    const elsewhere = { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site', 'content-type': 'application/json' }
    expect((await ask('/admin/api/login', { method: 'POST', headers: elsewhere, body: JSON.stringify({ password: site.password }) })).status).toBe(403)
    expect((await ask('/admin/api/update', { method: 'POST', headers: { ...elsewhere, cookie }, body: '{}' })).status).toBe(403)
    expect((await ask('/admin/api/logout', { method: 'POST', headers: { ...elsewhere, cookie }, body: '{}' })).status).toBe(403)
    expect((await ask('/admin/api/update', { headers: { cookie, origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' } })).status).toBe(403)
    expect((await ask('/admin/api/update', { headers: { cookie } })).status).toBe(200)
  })

  it('asks for one update when two requests arrive at once', async () => {
    const { cookie } = await signIn()
    const both = await Promise.all([1, 2].map(() => ask('/admin/api/update', { method: 'POST', headers: { ...sameSite(), cookie }, body: '{}' })))
    expect(both.map((response) => response.status).toSorted()).toEqual([202, 409])
    expect(existsSync(join(site.updaterDir, 'request.json'))).toBe(true)
  })
})

describe('the dashboard', () => {
  it('shows release notes from GitHub as text: no script, frame or unsafe link gets through', async () => {
    const { cookie } = await signIn()
    const html = await (await ask('/admin', { headers: { cookie } })).text()
    expect(html).toContain('v99.0.0')
    expect(html).not.toMatch(/<script>alert|<img[^>]+onerror|<iframe|href="javascript:|href="data:|src="https:\/\/evil/i)
  })
})

describe('redirects', () => {
  it('never send anyone to another site, however the address is bent', async () => {
    const short = new Map(Object.values(shortLinks).map(({ path, url }) => [path, url]))
    const probes = [
      '//evil.example',
      '//evil.example/x',
      '/\\evil.example',
      '/%2F%2Fevil.example',
      '/%5Cevil.example',
      '/en//evil.example',
      '/en/%2F%2Fevil.example',
      '/en/%2Fevil.example',
      '/en/%5Cevil.example',
      '/en/%5C%5Cevil.example',
      '/en/\\evil.example',
      '/en/https:%2F%2Fevil.example',
      '/en/https://evil.example',
      '/en/%09/evil.example',
      '/en/%2F%5Cevil.example',
      '/en/%2e%2e/%2e%2e//evil.example',
      '/en/%0d%0aLocation:%20https://evil.example',
      '/en/?next=//evil.example',
      '/en',
      '/en/',
      '/en/pricing',
      '/en/privacy',
      '/privacy/..//evil.example',
      '/es//evil.example',
      '/admin//evil.example',
      '/admin/..//evil.example',
      '/%E3%80%82evil.example',
      '/en/%E3%80%82evil.example',
      '/@evil.example',
      '/discord/..//evil.example',
      ...short.keys(),
    ]
    let redirects = 0
    for (const path of probes) {
      const response = await raw(site.base, 'GET', path)
      if (response.status < 300 || response.status >= 400) continue
      redirects++
      const location = String(response.headers.location ?? '')
      // A short link goes to its own destination, from config/links.json, and nothing else does.
      const destination = short.get(path)
      const allowed = destination
        ? new URL(location).href === new URL(destination).href
        : !/^(\/\/|\/\\|\\)/.test(location) && new URL(location, site.base).origin === site.base
      expect(allowed, `${path} -> ${location}`).toBe(true)
    }
    expect(redirects).toBeGreaterThan(10)
  })

  it('send a visitor who came over plain HTTP to the same address on HTTPS, whatever Host they name', async () => {
    for (const path of ['/', '/pricing?x=1', '/es/pricing', '/admin/login', '/admin/api/update', '/no-such-page']) {
      const response = await raw(site.base, 'GET', path, { 'cf-visitor': '{"scheme":"http"}', host: 'evil.example' })
      expect(response.status, path).toBe(308)
      expect(response.headers.location, path).toBe(`https://wslatl.com${path}`)
    }
    expect((await raw(site.base, 'GET', '/', { 'cf-visitor': '{"scheme":"https"}' })).status).toBe(200)
  })
})

describe('methods', () => {
  it('give a 405 to anything naming a Server Action, and to any method but a read', async () => {
    for (const path of ['/', '/pricing', '/es', '/og', '/company.json', '/admin', '/admin/login', '/admin/api/login', '/admin/api/update']) {
      for (const method of ['GET', 'POST']) {
        expect((await ask(path, { method, headers: { 'next-action': '7f'.repeat(21) } })).status, `${method} ${path}`).toBe(405)
      }
      for (const method of ['PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
        expect((await ask(path, { method })).status, `${method} ${path}`).toBe(405)
      }
    }
  })

  it('never echo a request back (TRACE), cookies and headers included', async () => {
    const canary = `trace-canary-${randomBytes(8).toString('hex')}`
    for (const path of ['/', '/admin/login', '/admin/api/update']) {
      const response = await raw(site.base, 'TRACE', path, { cookie: `__Host-wslatl_admin=${canary}`, 'x-canary': canary })
      expect(response.status, path).toBeGreaterThanOrEqual(400)
      expect(response.body, path).not.toContain(canary)
      expect(JSON.stringify(response.headers), path).not.toContain(canary)
    }
  })
})

/** One sign-in attempt from a page on the site, with these headers on top. */
const guess = (headers: Record<string, string>, password = 'a guess') =>
  ask('/admin/api/login', { method: 'POST', headers: { ...sameSite(), ...headers }, body: JSON.stringify({ password }) })

describe('a flood of guesses from many addresses', () => {
  it('keeps out everyone but a browser that signed in before, and a forged device cookie earns nothing', async () => {
    expect(device).toMatch(/^admin_device=.+/)
    // Thirty wrong guesses, each from an address of its own, fill the limit everyone shares.
    for (let i = 1; i <= 30; i++) expect((await guess({ 'cf-connecting-ip': `198.18.0.${i}` })).status).toBe(401)
    expect((await guess({ 'cf-connecting-ip': '198.18.1.1' }, site.password)).status).toBe(429)
    const forged = `${device.slice(0, -1)}${device.endsWith('A') ? 'B' : 'A'}`
    expect((await guess({ 'cf-connecting-ip': '198.18.1.2', cookie: forged }, site.password)).status).toBe(429)
    expect((await guess({ 'cf-connecting-ip': '198.18.1.3', cookie: 'admin_device=made.up' }, site.password)).status).toBe(429)
    // The owner's own browser still gets in.
    expect((await guess({ 'cf-connecting-ip': '198.18.1.4', cookie: device }, site.password)).status).toBe(200)
  }, 120_000)
})

describe('the secrets', () => {
  it('reach GitHub only as the token, in the header, at the address in the settings', () => {
    expect(github.seen.length).toBeGreaterThan(0)
    for (const request of github.seen) expect(request.authorization).toBe(`Bearer ${site.secrets[3]}`)
  })

  it('are in no answer the site gave, and nowhere in what the server printed', () => {
    expect(answers.length).toBeGreaterThan(50)
    for (const secret of site.secrets) {
      expect(answers.filter((answer) => answer.includes(secret)).map((answer) => answer.split('\n')[0])).toEqual([])
      expect(site.log().includes(secret)).toBe(false)
    }
  })
})

describe('a session secret that is too short', () => {
  it('keeps the admin off, and is named in the log as the server starts', async () => {
    const short = await startSite({ ADMIN_SESSION_SECRET: 'x'.repeat(31) })
    try {
      // Before any visit to /admin: the check runs at start-up.
      expect(short.log()).toMatch(/ADMIN_SESSION_SECRET is shorter than 32 characters/)
      expect((await fetch(`${short.base}/admin/login`)).status).toBe(404)
      expect((await fetch(`${short.base}/admin/api/login`, { method: 'POST', headers: { origin: short.base, 'content-type': 'application/json' }, body: '{}' })).status).toBe(404)
    } finally {
      await short.stop()
    }
  }, 120_000)
})

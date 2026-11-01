import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { hashPassword } from '@/lib/admin/password'
import { loginLimitsKey } from '@/lib/admin/rate-limit'
import { createSession, SESSION_COOKIE } from '@/lib/admin/session'
import * as login from '@/app/admin/api/login/route'
import * as logout from '@/app/admin/api/logout/route'
import * as update from '@/app/admin/api/update/route'

vi.mock('server-only', () => ({}))

const password = 'the admin test password'
let passwordHash = ''
const secret = 's'.repeat(40)
let updaterDir = ''
let ip = 0

beforeAll(async () => {
  passwordHash = await hashPassword(password)
})

beforeEach(() => {
  vi.stubEnv('ADMIN_PASSWORD_HASH', passwordHash)
  vi.stubEnv('ADMIN_SESSION_SECRET', secret)
  vi.stubEnv('GITHUB_TOKEN', 'test-token')
  updaterDir = mkdtempSync(join(tmpdir(), 'admin-routes-'))
  vi.stubEnv('UPDATER_DIR', updaterDir)
  // Each test starts with fresh login counts.
  delete (globalThis as { [loginLimitsKey]?: unknown })[loginLimitsKey]
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  rmSync(updaterDir, { recursive: true, force: true })
})

function request(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string>; session?: string } = {}) {
  const headers = new Headers({
    host: 'wslatl.com',
    origin: 'https://wslatl.com',
    'content-type': 'application/json',
    'cf-connecting-ip': `10.0.0.${++ip}`,
    ...init.headers,
  })
  if (init.session) headers.set('cookie', `${SESSION_COOKIE}=${init.session}`)
  const method = init.method ?? 'POST'
  return new NextRequest(`https://wslatl.com${path}`, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(init.body === undefined ? {} : init.body),
  })
}

const session = () => createSession({ secret, passwordHash })

describe('a disabled admin', () => {
  it('answers 404 on every route when a required setting is missing', async () => {
    for (const name of ['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN']) {
      vi.stubEnv(name, '')
      expect((await login.POST(request('/admin/api/login', { body: { password } }))).status, name).toBe(404)
      expect((await logout.POST(request('/admin/api/logout'))).status, name).toBe(404)
      expect((await update.GET(request('/admin/api/update', { method: 'GET', session: session() }))).status, name).toBe(404)
      expect((await update.POST(request('/admin/api/update', { session: session() }))).status, name).toBe(404)
      vi.stubEnv(name, name === 'GITHUB_TOKEN' ? 'test-token' : name === 'ADMIN_SESSION_SECRET' ? secret : passwordHash)
    }
  })
})

describe('logging in', () => {
  it('sets a short-lived, locked-down session cookie for the right password, and logs it', async () => {
    const response = await login.POST(request('/admin/api/login', { body: { password } }))
    expect(response.status).toBe(200)
    const cookie = response.headers.get('set-cookie') ?? ''
    expect(cookie).toMatch(new RegExp(`^${SESSION_COOKIE}=[\\w-]+\\.[\\w-]+;`))
    for (const part of ['Path=/admin', 'Max-Age=7200', 'HttpOnly', 'Secure', 'SameSite=strict']) {
      expect(cookie.toLowerCase()).toContain(part.toLowerCase())
    }
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/\[admin\] login from 10\.0\.0\.\d+$/))
  })

  it('refuses the wrong password, and logs that too', async () => {
    const response = await login.POST(request('/admin/api/login', { body: { password: 'nope' } }))
    expect(response.status).toBe(401)
    expect(response.headers.get('set-cookie')).toBeNull()
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/\[admin\] login failed from 10\.0\.0\.\d+$/))
    for (const body of [{}, { password: 42 }, { password: 'x'.repeat(2000) }]) {
      expect((await login.POST(request('/admin/api/login', { body }))).status).toBe(401)
    }
  })

  it('refuses a post from another site, and a form post', async () => {
    const crossSite = await login.POST(
      request('/admin/api/login', { body: { password }, headers: { origin: 'https://evil.example' } }),
    )
    expect(crossSite.status).toBe(403)
    const form = await login.POST(
      new NextRequest('https://wslatl.com/admin/api/login', {
        method: 'POST',
        headers: { host: 'wslatl.com', origin: 'https://wslatl.com', 'content-type': 'application/x-www-form-urlencoded' },
        body: `password=${encodeURIComponent(password)}`,
      }),
    )
    expect(form.status).toBe(415)
  })

  it('stops an address after 5 attempts, even with the right password, and says when to retry', async () => {
    const from = { 'cf-connecting-ip': '192.0.2.1' }
    for (let i = 0; i < 5; i++) {
      expect((await login.POST(request('/admin/api/login', { body: { password: 'wrong' }, headers: from }))).status).toBe(401)
    }
    const blocked = await login.POST(request('/admin/api/login', { body: { password }, headers: from }))
    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(800)
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/\[admin\] login refused \(too many attempts\) from 192\.0\.2\.1$/))
    // Another address is not held up by it.
    expect((await login.POST(request('/admin/api/login', { body: { password } }))).status).toBe(200)
  })

  it('counts every address in one IPv6 /64 together', async () => {
    for (let i = 1; i <= 5; i++) {
      const from = { 'cf-connecting-ip': `2001:db8:5:6::${i}` }
      expect((await login.POST(request('/admin/api/login', { body: {}, headers: from }))).status).toBe(401)
    }
    const next = { 'cf-connecting-ip': '2001:db8:5:6:ffff::9' }
    expect((await login.POST(request('/admin/api/login', { body: { password }, headers: next }))).status).toBe(429)
  })

  it('stops everyone after 30 attempts in all, whatever address they claim', async () => {
    // Empty attempts count too, and skip the slow password check.
    for (let i = 0; i < 30; i++) await login.POST(request('/admin/api/login', { body: {} }))
    expect((await login.POST(request('/admin/api/login', { body: { password } }))).status).toBe(429)
  })

  it('answers 400 to a JSON body that is not an object, before counting it', async () => {
    for (const body of [null, [], 'password']) {
      const response = await login.POST(request('/admin/api/login', { body, headers: { 'cf-connecting-ip': '192.0.2.9' } }))
      expect(response.status, JSON.stringify(body)).toBe(400)
    }
    for (let i = 0; i < 4; i++) {
      await login.POST(request('/admin/api/login', { body: { password: 'wrong' }, headers: { 'cf-connecting-ip': '192.0.2.9' } }))
    }
    expect((await login.POST(request('/admin/api/login', { body: { password }, headers: { 'cf-connecting-ip': '192.0.2.9' } }))).status).toBe(200)
  })

  it('never counts the owner\'s own logins toward the overall limit', async () => {
    for (let i = 0; i < 29; i++) await login.POST(request('/admin/api/login', { body: {} }))
    expect((await login.POST(request('/admin/api/login', { body: { password } }))).status).toBe(200)
    // Had the login counted, this one would be the 31st and refused.
    expect((await login.POST(request('/admin/api/login', { body: {} }))).status).toBe(401)
    expect((await login.POST(request('/admin/api/login', { body: {} }))).status).toBe(429)
  })

  it('lets a successful login clear its own address', async () => {
    const from = { 'cf-connecting-ip': '192.0.2.2' }
    for (let i = 0; i < 4; i++) await login.POST(request('/admin/api/login', { body: { password: 'wrong' }, headers: from }))
    expect((await login.POST(request('/admin/api/login', { body: { password }, headers: from }))).status).toBe(200)
    expect((await login.POST(request('/admin/api/login', { body: { password: 'wrong' }, headers: from }))).status).toBe(401)
  })
})

describe('logging out', () => {
  it('clears the cookie', async () => {
    const response = await logout.POST(request('/admin/api/logout', { session: session() }))
    expect(response.status).toBe(200)
    const cookie = response.headers.get('set-cookie') ?? ''
    expect(cookie).toMatch(new RegExp(`^${SESSION_COOKIE}=;`))
    expect(cookie).toContain('Path=/admin')
    expect(cookie).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/)
  })

  it('refuses a post from another site', async () => {
    const response = await logout.POST(request('/admin/api/logout', { headers: { origin: 'https://evil.example' } }))
    expect(response.status).toBe(403)
  })
})

describe('the update route', () => {
  it('needs a session for both reading and requesting', async () => {
    expect((await update.GET(request('/admin/api/update', { method: 'GET' }))).status).toBe(401)
    expect((await update.POST(request('/admin/api/update'))).status).toBe(401)
    const expired = createSession({ secret, passwordHash }, Date.now() - 3 * 60 * 60 * 1000)
    expect((await update.POST(request('/admin/api/update', { session: expired }))).status).toBe(401)
    expect(existsSync(join(updaterDir, 'request.json'))).toBe(false)
  })

  it('refuses a post from another site even with a session', async () => {
    const response = await update.POST(
      request('/admin/api/update', { session: session(), headers: { origin: 'https://evil.example' } }),
    )
    expect(response.status).toBe(403)
    expect(existsSync(join(updaterDir, 'request.json'))).toBe(false)
  })

  it('asks the supervisor for an update, logs it, and reports what it is doing', async () => {
    const response = await update.POST(request('/admin/api/update', { session: session() }))
    expect(response.status).toBe(202)
    const asked = JSON.parse(readFileSync(join(updaterDir, 'request.json'), 'utf8'))
    expect(asked).toEqual({ requestedAt: expect.any(String), by: expect.stringMatching(/^10\.0\.0\.\d+$/) })
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/\[admin\] update requested from 10\.0\.0\.\d+$/))

    const status = await update.GET(request('/admin/api/update', { method: 'GET', session: session() }))
    expect(status.status).toBe(200)
    expect(await status.json()).toEqual({ available: true, pending: true, state: null })
  })

  it('refuses a second request while one waits or runs', async () => {
    expect((await update.POST(request('/admin/api/update', { session: session() }))).status).toBe(202)
    expect((await update.POST(request('/admin/api/update', { session: session() }))).status).toBe(409)
    rmSync(join(updaterDir, 'request.json'))
    writeFileSync(join(updaterDir, 'state.json'), JSON.stringify({ status: 'building', log: [] }))
    expect((await update.POST(request('/admin/api/update', { session: session() }))).status).toBe(409)
  })

  it('says so when the site is not running under npm run serve', async () => {
    vi.stubEnv('UPDATER_DIR', '')
    const response = await update.POST(request('/admin/api/update', { session: session() }))
    expect(response.status).toBe(503)
    const status = await update.GET(request('/admin/api/update', { method: 'GET', session: session() }))
    expect(await status.json()).toEqual({ available: false, pending: false, state: null })
  })
})

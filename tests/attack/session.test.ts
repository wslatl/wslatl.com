import { existsSync, readdirSync } from 'node:fs'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Admin, adminHash, cookieNames, get, logsOf, makeAdmin, paths, post, restart, setCookieFor, setUp, signIn, tearDown } from './site'

/**
 * Stealing, forging or keeping a session. The session is a signed cookie
 * that lasts two hours; these check what the browser is told to do with it,
 * that nothing but the real thing opens the admin, and that signing out ends
 * it for good.
 */
vi.mock('server-only', () => ({}))
// Signing in runs a deliberately slow scrypt.
vi.setConfig({ testTimeout: 30_000 })

let admin: Admin
beforeAll(() => {
  admin = makeAdmin()
})
beforeEach(() => {
  setUp(admin)
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})
afterAll(() => tearDown(admin))

/** The attributes of a Set-Cookie header, by lower-case name. */
function attributes(header: string) {
  const [pair, ...rest] = header.split(';').map((part) => part.trim())
  const values = new Map(
    rest.map((part) => {
      const at = part.indexOf('=')
      return at < 0 ? [part.toLowerCase(), ''] : [part.slice(0, at).toLowerCase(), part.slice(at + 1)]
    }),
  )
  return { name: pair.slice(0, pair.indexOf('=')), value: pair.slice(pair.indexOf('=') + 1), values }
}

/** True when the cookie opens the admin: the status route answers it. */
async function opens(cookie: string): Promise<boolean> {
  const status = (await get(paths.update, { cookie })).status
  if (status !== 200 && status !== 401) throw new Error(`The status route answered ${status}`)
  return status === 200
}

describe('the cookie a sign-in sets', () => {
  it('is a __Host- cookie: Secure, HttpOnly, SameSite=Strict, the whole site, no Domain, two hours at most', async () => {
    const response = await post(paths.login, { password: admin.password })
    expect(response.status).toBe(200)
    const cookie = attributes(setCookieFor(response, cookieNames.session))
    // A __Host- cookie is kept only when it is Secure, on Path=/ and names no
    // Domain, so no other site under wslatl.com can set or replace it.
    expect(cookie.name.startsWith('__Host-')).toBe(true)
    expect(cookie.values.has('secure')).toBe(true)
    expect(cookie.values.has('httponly')).toBe(true)
    expect(cookie.values.get('samesite')?.toLowerCase()).toBe('strict')
    expect(cookie.values.get('path')).toBe('/')
    expect(cookie.values.has('domain')).toBe(false)
    const maxAge = Number(cookie.values.get('max-age'))
    expect(maxAge).toBeGreaterThan(0)
    expect(maxAge).toBeLessThanOrEqual(2 * 60 * 60)
    // Long enough that it can only be had by signing in.
    expect(cookie.value.length).toBeGreaterThanOrEqual(64)
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('is different every time, even signed in twice in the same second', async () => {
    const first = await signIn(admin)
    const second = await signIn(admin)
    expect(first).not.toBe(second)
  })

  it('is cleared on sign-out with the same strict attributes', async () => {
    const cookie = await signIn(admin)
    const response = await post(paths.logout, {}, { cookie })
    expect(response.status).toBe(200)
    const cleared = attributes(setCookieFor(response, cookieNames.session))
    expect(cleared.name).toBe(cookie.split('=')[0])
    expect(cleared.value).toBe('')
    expect(Number(cleared.values.get('max-age') ?? NaN) === 0 || /1970/.test(cleared.values.get('expires') ?? '')).toBe(true)
    for (const flag of ['secure', 'httponly']) expect(cleared.values.has(flag), flag).toBe(true)
    expect(cleared.values.get('path')).toBe('/')
  })
})

/** What a session says about itself, encoded the way a cookie carries it. */
const claims = (body: object) => Buffer.from(JSON.stringify(body)).toString('base64url')

describe('a forged cookie', () => {
  it('opens nothing, however it is made', async () => {
    const real = await signIn(admin)
    const name = real.split('=')[0]
    const [payload] = real.slice(name.length + 1).split('.')
    const now = Math.floor(Date.now() / 1000)
    const forged = [
      '',
      'a',
      'a.b',
      '.',
      `${payload}.`,
      `.${payload}`,
      payload,
      `${claims({ iat: now, exp: now + 3600, sid: 'x'.repeat(22) })}.${'A'.repeat(43)}`,
      // "alg: none", the classic of signed tokens.
      `${Buffer.from('{"alg":"none"}').toString('base64url')}.${claims({ iat: now, exp: now + 3600 })}.`,
      `${claims({ iat: now, exp: now + 3600, sid: 'x'.repeat(22), admin: true })}.${real.split('.')[1]}`,
      'null',
      'undefined',
      '{}',
      '[]',
      `${payload}.${'A'.repeat(43)}`,
      `${'A'.repeat(600)}.${'A'.repeat(43)}`,
      'x'.repeat(10_000),
    ]
    for (const value of forged) {
      expect(await opens(`${name}=${value}`), value.slice(0, 60)).toBe(false)
    }
  })

  it('opens nothing when it was signed for another site with its own settings', async () => {
    const other = adminHash('another site entirely, another password')
    setUp(admin, { ADMIN_PASSWORD_HASH: other.passwordHash, ADMIN_SESSION_SECRET: other.secret })
    const theirs = await post(paths.login, { password: 'another site entirely, another password' })
    const cookie = setCookieFor(theirs, cookieNames.session).split(';')[0]
    setUp(admin)
    expect(await opens(cookie)).toBe(false)
  })

  it('opens nothing under any other name, the old one included', async () => {
    const real = await signIn(admin)
    const value = real.slice(real.indexOf('=') + 1)
    for (const name of ['wslatl_admin', '__Secure-wslatl_admin', 'session', '__host-wslatl_admin']) {
      expect(await opens(`${name}=${value}`), name).toBe(false)
    }
  })
})

describe('a tampered cookie', () => {
  it('opens nothing when any one character of it is changed', async () => {
    const real = await signIn(admin)
    const at = real.indexOf('=') + 1
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    for (let i = at; i < real.length; i++) {
      if (real[i] === '.') continue
      // Each neighbour in the alphabet, and every character at the very end,
      // where base64 has spare bits that decode the same.
      const swaps = i === real.length - 1 ? [...alphabet] : [alphabet[(alphabet.indexOf(real[i]) + 1) % 64], alphabet[(alphabet.indexOf(real[i]) + 32) % 64]]
      for (const swap of swaps) {
        if (swap === real[i]) continue
        const tampered = `${real.slice(0, i)}${swap}${real.slice(i + 1)}`
        expect(await opens(tampered), `position ${i - at}: ${swap}`).toBe(false)
      }
    }
    expect(await opens(real)).toBe(true)
  })

  it('opens nothing with anything added, or cut short', async () => {
    const real = await signIn(admin)
    const [payload, signature] = real.slice(real.indexOf('=') + 1).split('.')
    const name = real.slice(0, real.indexOf('='))
    for (const value of [
      `${payload}.${signature}=`,
      `${payload}.${signature}==`,
      `${payload}.${signature}!`,
      `${payload}.!${signature}`,
      `${payload}=.${signature}`,
      `${payload}.${signature}.`,
      `${payload}.${signature}.${signature}`,
      `${payload}.${signature.slice(0, -1)}`,
      `${payload.slice(1)}.${signature}`,
      `${payload}.${signature.replaceAll('-', '+').replaceAll('_', '/')}`,
      `${payload}.${signature}%00`,
      `${payload}.${signature.slice(0, 20)} ${signature.slice(20)}`,
      `${payload}..${signature}`,
      `${payload.toUpperCase()}.${signature}`,
    ]) {
      if (value === `${payload}.${signature}`) continue
      expect(await opens(`${name}=${value}`), value.slice(-12)).toBe(false)
    }
  })
})

describe('an old session', () => {
  it('stops working once its two hours are up', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-10T12:00:00Z'))
    const cookie = await signIn(admin)
    vi.setSystemTime(new Date('2026-11-10T13:59:00Z'))
    expect(await opens(cookie)).toBe(true)
    vi.setSystemTime(new Date('2026-11-10T14:00:00Z'))
    expect(await opens(cookie)).toBe(false)
  })

  it('never works before it was issued, beyond a minute of clock difference', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-10T12:10:00Z'))
    const cookie = await signIn(admin)
    vi.setSystemTime(new Date('2026-11-10T12:00:00Z'))
    expect(await opens(cookie)).toBe(false)
  })

  it('stops working when the password or the session secret changes', async () => {
    const cookie = await signIn(admin)
    const changed = adminHash('the owner changed the password to this one')
    setUp(admin, { ADMIN_PASSWORD_HASH: changed.passwordHash })
    expect(await opens(cookie)).toBe(false)
    setUp(admin, { ADMIN_SESSION_SECRET: changed.secret })
    expect(await opens(cookie)).toBe(false)
    setUp(admin)
    expect(await opens(cookie)).toBe(true)
  })
})

describe('signing out', () => {
  it('ends the session for good: a copy of the cookie taken before opens nothing after', async () => {
    const cookie = await signIn(admin)
    expect(await opens(cookie)).toBe(true)
    const { logs } = await logsOf(() => post(paths.logout, {}, { cookie }))
    expect(logs).toMatch(/\[admin\] logout from 198\.51\.100\.7/)
    expect(await opens(cookie)).toBe(false)
    expect((await post(paths.update, {}, { cookie })).status).toBe(401)
    expect((await post(paths.adoptUpdater, {}, { cookie })).status).toBe(401)
    expect(existsSync(`${admin.updaterDir}/request.json`)).toBe(false)
  })

  it('ends only that session, so signing in again works', async () => {
    const before = await signIn(admin)
    await post(paths.logout, {}, { cookie: before })
    const after = await signIn(admin)
    expect(await opens(after)).toBe(true)
    expect(await opens(before)).toBe(false)
  })

  it('stays ended after a restart of the server, which every update is', async () => {
    const cookie = await signIn(admin)
    await post(paths.logout, {}, { cookie })
    restart()
    expect(await opens(cookie)).toBe(false)
    // Saved whole: no half-written file is left behind.
    expect(readdirSync(admin.updaterDir).filter((name) => name.endsWith('.tmp'))).toEqual([])
  })

  it('still ends the session when the site runs without the updater, until a restart', async () => {
    setUp(admin, { UPDATER_DIR: '' })
    const cookie = await signIn(admin)
    await post(paths.logout, {}, { cookie })
    expect(await opens(cookie)).toBe(false)
  })

  it('cannot be forced from another site, so nobody can sign the owner out', async () => {
    const cookie = await signIn(admin)
    const response = await post(paths.logout, {}, { cookie, origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' })
    expect(response.status).toBe(403)
    expect(response.headers.get('set-cookie')).toBeNull()
    expect(await opens(cookie)).toBe(true)
  })

  it('does nothing for a cookie that is not a live session, and says nothing about it', async () => {
    const { result, logs } = await logsOf(() => post(paths.logout, {}, { cookie: '__Host-wslatl_admin=made.up' }))
    expect(result.status).toBe(200)
    expect(logs).not.toMatch(/logout from/)
  })
})

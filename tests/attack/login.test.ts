import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Admin, adminHash, cookieFrom, cookieNames, deviceFrom, get, makeAdmin, paths, post, setCookieFor, setUp, signInFully, tearDown } from './site'

/**
 * Guessing the admin password. The login allows 5 attempts per address and
 * 30 in all every 15 minutes, counted before the password is checked, so a
 * guesser gets 30 tries in a quarter of an hour however many addresses they
 * have, and at most two password checks run at once. A browser that signed
 * in before carries a device cookie and is counted on its own, so a flood
 * that fills the 30 cannot lock the owner out.
 */

// Every comparison of a secret has to take the same time whether the guess
// was close or not. Watched here as it happens, rather than timed: a timing
// test fine enough to see one compare against the cost of scrypt would only
// ever measure the machine.
const compared = vi.hoisted(() => [] as [Buffer, Buffer][])
vi.mock('node:crypto', async (importOriginal) => {
  const real = await importOriginal<typeof import('node:crypto')>()
  const timingSafeEqual = (a: NodeJS.ArrayBufferView, b: NodeJS.ArrayBufferView) => {
    compared.push([Buffer.from(a.buffer, a.byteOffset, a.byteLength), Buffer.from(b.buffer, b.byteOffset, b.byteLength)])
    return real.timingSafeEqual(a, b)
  }
  return { ...real, timingSafeEqual, default: { ...real, timingSafeEqual } }
})
vi.mock('server-only', () => ({}))
// Each real password check is a deliberately slow scrypt.
vi.setConfig({ testTimeout: 30_000 })

let admin: Admin
beforeAll(() => {
  admin = makeAdmin()
})
beforeEach(() => {
  setUp(admin)
  compared.length = 0
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
afterAll(() => tearDown(admin))

const attempt = (password: unknown, headers: Record<string, string> = {}) => post(paths.login, { password }, headers)
const from = (ip: string) => ({ 'cf-connecting-ip': ip })
/** A request straight to the server's port, past Cloudflare, claiming an address of its own. */
const direct = (i: number) => ({ 'cf-connecting-ip': '', 'x-forwarded-for': `192.0.2.${i}`, 'x-real-ip': `192.0.2.${i}` })

describe('guessing the password from one address', () => {
  it('is stopped after 5 attempts, even when the sixth is right, and told when to come back', async () => {
    for (let i = 0; i < 5; i++) expect((await attempt(`guess ${i}`, from('203.0.113.10'))).status).toBe(401)
    const locked = await attempt(admin.password, from('203.0.113.10'))
    expect(locked.status).toBe(429)
    expect(Number(locked.headers.get('retry-after'))).toBeGreaterThan(14 * 60)
    expect(locked.headers.get('set-cookie')).toBeNull()
  })

  it('is stopped before the password is checked, so a burst all at once costs no more', async () => {
    const answers = await Promise.all(Array.from({ length: 40 }, (_, i) => attempt(`burst ${i}`, from('203.0.113.11'))))
    const statuses = answers.map((answer) => answer.status)
    // At most 5 checked (401); the rest refused at once (429), some of them
    // because two checks were already running.
    expect(statuses.filter((status) => status === 401).length).toBeLessThanOrEqual(5)
    expect(statuses.filter((status) => status === 429).length).toBeGreaterThanOrEqual(35)
    expect(statuses.every((status) => status === 401 || status === 429)).toBe(true)
  })

  it('counts a whole IPv6 /64 as one address, since one connection can use all of it', async () => {
    for (let i = 1; i <= 5; i++) expect((await attempt('wrong', from(`2001:db8:aa:bb::${i}`))).status).toBe(401)
    expect((await attempt(admin.password, from('2001:db8:aa:bb:cafe::1'))).status).toBe(429)
  })

  it('does not lock out the owner signing in from another address', async () => {
    for (let i = 0; i < 6; i++) await attempt('wrong', from('203.0.113.12'))
    expect((await attempt(admin.password, from('203.0.113.13'))).status).toBe(200)
  })
})

describe('guessing from many addresses', () => {
  // Thirty real password checks, each a deliberately slow scrypt.
  it('is stopped after 30 attempts in all, whatever addresses they come from', async () => {
    for (let i = 0; i < 30; i++) await attempt('wrong', from(`203.0.113.${100 + i}`))
    const locked = await attempt(admin.password, from('203.0.113.200'))
    expect(locked.status).toBe(429)
    expect(locked.headers.get('set-cookie')).toBeNull()
  }, 60_000)

  it('cannot start the count over with a made-up X-Forwarded-For: only CF-Connecting-IP names the address', async () => {
    // The same visitor, claiming a new address in X-Forwarded-For each time.
    for (let i = 0; i < 5; i++) {
      const spoofed = { ...from('203.0.113.20'), 'x-forwarded-for': `192.0.2.${i}, 10.0.0.${i}` }
      expect((await attempt('wrong', spoofed)).status).toBe(401)
    }
    expect((await attempt(admin.password, { ...from('203.0.113.20'), 'x-forwarded-for': '192.0.2.99' })).status).toBe(429)
  })

  it('counts requests that did not come through Cloudflare together, whatever X-Forwarded-For says', async () => {
    for (let i = 0; i < 5; i++) expect((await attempt('wrong', direct(i))).status).toBe(401)
    expect((await attempt(admin.password, direct(50))).status).toBe(429)
  })

  it('counts a CF-Connecting-IP that is no address at all as one name, not as a fresh one each time', async () => {
    for (let i = 0; i < 5; i++) expect((await attempt('wrong', from(`not-an-address-${i}`))).status).toBe(401)
    expect((await attempt(admin.password, from('also not an address'))).status).toBe(429)
  })
})

describe('the comparisons', () => {
  it('checks a password in constant time, with the full-length keys, right or wrong', async () => {
    expect((await attempt('a wrong password of the same sort of length')).status).toBe(401)
    expect((await attempt(admin.password)).status).toBe(200)
    expect(compared.length).toBeGreaterThanOrEqual(2)
    for (const [given, stored] of compared) {
      expect(given.length).toBe(stored.length)
      expect(given.length).toBeGreaterThanOrEqual(32)
    }
  })

  it('checks a session signature in constant time too', async () => {
    const response = await attempt(admin.password)
    const [name, value] = cookieFrom(response).split('=')
    const [payload, signature] = value.split('.')
    compared.length = 0
    // A forged signature of the right length: only the constant-time compare can refuse it.
    const forged = `${payload}.${signature.startsWith('A') ? 'B' : 'A'}${signature.slice(1)}`
    expect((await get(paths.update, { cookie: `${name}=${forged}` })).status).toBe(401)
    expect(compared.some(([given, expected]) => given.length === 32 && expected.length === 32)).toBe(true)
  })

  it('refuses an empty, odd or oversized password, and sets no cookie', async () => {
    const odd = ['', 42, null, ['x'], { x: 1 }, 'x'.repeat(1025)]
    for (const [i, password] of odd.entries()) {
      const response = await attempt(password, from(`203.0.113.${150 + i}`))
      expect(response.status, JSON.stringify(password).slice(0, 20)).toBe(401)
      expect(response.headers.get('set-cookie')).toBeNull()
    }
  })
})

/** Fills the limit everyone shares: 30 wrong guesses, each from an address of its own. */
async function flood() {
  for (let i = 0; i < 30; i++) expect((await attempt('a guess', from(`198.18.0.${i + 1}`))).status).toBe(401)
  expect((await attempt('one more guess', from('198.18.1.1'))).status).toBe(429)
}

/** The value of a device cookie with one character of its signature changed. */
const tampered = (cookie: string) => `${cookie.slice(0, -1)}${cookie.endsWith('A') ? 'B' : 'A'}`

describe('a browser that signed in before (its device cookie)', () => {
  it('gets in during a flood of guesses that keeps everyone else out', async () => {
    const { device } = await signInFully(admin, from('203.0.113.50'))
    await flood()
    // From the owner's own address but without the cookie: held up like anyone.
    expect((await attempt(admin.password, from('203.0.113.50'))).status).toBe(429)
    const known = await attempt(admin.password, { ...from('203.0.113.50'), cookie: device })
    expect(known.status).toBe(200)
    expect(cookieFrom(known)).toMatch(/^__Host-wslatl_admin=.+/)
    // Even from an address the flood used up, or with no Cloudflare address at all.
    expect((await attempt(admin.password, { ...from('198.18.0.1'), cookie: device })).status).toBe(200)
    expect((await attempt(admin.password, { ...direct(1), cookie: device })).status).toBe(200)
  }, 120_000)

  it('gives no way round the limit to a cookie the site did not sign, or did not sign as it is', async () => {
    const { device, session } = await signInFully(admin)
    const value = device.slice(device.indexOf('=') + 1)
    const [id, signature] = value.split('.')
    // One signed for another site with settings of its own.
    const other = adminHash('a password on some other site')
    setUp(admin, { ADMIN_PASSWORD_HASH: other.passwordHash, ADMIN_SESSION_SECRET: other.secret })
    const foreign = deviceFrom(await attempt('a password on some other site'))
    expect(foreign).toMatch(/^admin_device=.+/)
    setUp(admin)
    await flood()
    for (const cookie of [
      `${cookieNames.device}=${tampered(value)}`,
      `${cookieNames.device}=${id}.${'A'.repeat(43)}`,
      `${cookieNames.device}=${'B'.repeat(22)}.${signature}`,
      `${cookieNames.device}=${value}=`,
      `${cookieNames.device}=${value}.x`,
      `${cookieNames.device}=${id}`,
      `${cookieNames.device}=`,
      `${cookieNames.device}=${session.slice(session.indexOf('=') + 1)}`,
      foreign,
      `device=${value}`,
      `${cookieNames.device.toUpperCase()}=${value}`,
    ]) {
      expect((await attempt(admin.password, { ...from('203.0.113.51'), cookie })).status, cookie.slice(0, 40)).toBe(429)
    }
  }, 120_000)

  it('has a limit of its own, which holds, and which touches nobody else\'s', async () => {
    const first = (await signInFully(admin)).device
    const second = (await signInFully(admin)).device
    for (let i = 0; i < 5; i++) expect((await attempt(`guess ${i}`, { ...from(`198.19.0.${i}`), cookie: first })).status).toBe(401)
    const locked = await attempt(admin.password, { ...from('198.19.1.1'), cookie: first })
    expect(locked.status).toBe(429)
    expect(Number(locked.headers.get('retry-after'))).toBeGreaterThan(14 * 60)
    expect(locked.headers.get('set-cookie')).toBeNull()
    // Another browser of the owner's, and a browser with no cookie, are not held up by it.
    expect((await attempt(admin.password, { cookie: second })).status).toBe(200)
    expect((await attempt('a guess', from('198.19.2.2'))).status).toBe(401)
  })

  it('is set at every sign-in as HttpOnly, Secure, SameSite=Strict, on /admin, for 180 days, and kept on sign-out', async () => {
    const response = await attempt(admin.password)
    const header = setCookieFor(response, cookieNames.device)
    const parts = header.split(';').map((part) => part.trim().toLowerCase())
    for (const part of ['httponly', 'secure', 'samesite=strict', 'path=/admin', `max-age=${180 * 24 * 60 * 60}`]) {
      expect(parts, part).toContain(part)
    }
    expect(parts.some((part) => part.startsWith('domain='))).toBe(false)
    const again = setCookieFor(await attempt(admin.password), cookieNames.device)
    expect(again.split(';')[0]).not.toBe(header.split(';')[0])
    const out = await post(paths.logout, {}, { cookie: `${cookieFrom(response)}; ${header.split(';')[0]}` })
    expect(out.status).toBe(200)
    expect(setCookieFor(out, cookieNames.device)).toBe('')
  })

  it('stops counting once the password changes, so cookies gathered with the old one buy nothing', async () => {
    const { device } = await signInFully(admin)
    setUp(admin, { ADMIN_PASSWORD_HASH: adminHash(`${admin.password} changed`).passwordHash })
    await flood()
    expect((await attempt(`${admin.password} changed`, { ...from('203.0.113.52'), cookie: device })).status).toBe(429)
  }, 120_000)

  it('opens nothing by itself', async () => {
    const { device } = await signInFully(admin)
    expect((await get(paths.update, { cookie: device })).status).toBe(401)
    expect((await post(paths.update, {}, { cookie: device })).status).toBe(401)
    expect((await post(paths.adoptUpdater, {}, { cookie: device })).status).toBe(401)
  })
})

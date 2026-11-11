import { spawnSync } from 'node:child_process'
import { createHmac } from 'node:crypto'
import { join } from 'node:path'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { hashPassword, isPasswordHash, verifyPassword } from '@/platform/admin/server/password'
import { adminLimits, atMost, rateLimiter } from '@/platform/admin/server/rate-limit'
import { limitKey } from '@/platform/admin/server/request'
import { SESSION_COOKIE } from '@/platform/admin/server/session'
import { type Admin, adminHash, adminRoutes, get, makeAdmin, paths, post, restart, setUp, signIn, tearDown } from './site'

/**
 * Canaries for the kit's shared password, its session and its limits
 * (platform/admin/server/), as this site runs them: through the site's own
 * routes where a request can show the property, and on the function itself
 * where only that can. The kit's own tests do not run here.
 */
vi.mock('server-only', () => ({}))
// A real password check is a deliberately slow scrypt.
vi.setConfig({ testTimeout: 30_000 })

let admin: Admin
beforeAll(() => {
  admin = makeAdmin()
})
beforeEach(() => {
  setUp(admin)
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
afterAll(() => tearDown(admin))

const from = (ip: string) => ({ 'cf-connecting-ip': ip })
/** An attempt with no password: it counts against the limits, and runs no scrypt. */
const empty = (ip: string) => post(paths.login, {}, from(ip))
const hashScript = join(__dirname, '..', '..', 'platform', 'admin', 'hash-password.mjs')
const runHashScript = (password: string) => spawnSync(process.execPath, [hashScript], { input: `${password}\n`, encoding: 'utf8' })

describe('a stored password hash', () => {
  const salt = Buffer.alloc(16, 7).toString('base64url')
  const key = Buffer.alloc(32, 9).toString('base64url')
  const stored = (N: number, r: number, p: number) => `scrypt:${N}:${r}:${p}:${salt}:${key}`
  const outOfRange = [
    [8192, 8, 1],
    [1024, 8, 1],
    [131072, 8, 1],
    [1048576, 8, 1],
    [32767, 8, 1],
    [49152, 8, 1],
    [0, 8, 1],
    [32768, 7, 1],
    [32768, 17, 1],
    [32768, 64, 1],
    [32768, 8, 0],
    [32768, 8, 5],
    [32768, 8, 64],
  ]

  it('is refused when its scrypt costs are out of range, so .env can make sign-ins neither weak nor ruinously slow', () => {
    // The costs npm run admin:hash uses, for the canary's sake.
    expect(isPasswordHash(stored(32768, 8, 1))).toBe(true)
    for (const [N, r, p] of outOfRange) expect(isPasswordHash(stored(N, r, p)), `N=${N} r=${r} p=${p}`).toBe(false)
  })

  it('out of range turns the whole admin off, so no sign-in ever runs scrypt with those costs', async () => {
    for (const [N, r, p] of outOfRange.slice(0, 4)) {
      setUp(admin, { ADMIN_PASSWORD_HASH: stored(N, r, p) })
      expect((await empty('198.51.100.20')).status, `N=${N}`).toBe(404)
    }
  })

  it('gets a salt of its own every time, from the kit and from npm run admin:hash', async () => {
    const [first, second] = await Promise.all([hashPassword('the same password twice'), hashPassword('the same password twice')])
    expect(isPasswordHash(first)).toBe(true)
    expect(first.split(':')[4]).not.toBe(second.split(':')[4])
    const made = [adminHash('the same password twice'), adminHash('the same password twice')]
    expect(made[0].passwordHash.split(':')[4]).not.toBe(made[1].passwordHash.split(':')[4])
    expect(made[0].secret).not.toBe(made[1].secret)
  })
})

describe('npm run admin:hash', () => {
  it('refuses a password under 12 characters, counting characters rather than code units', () => {
    for (const password of ['12345678901', 'short', '', '\u{1F600}'.repeat(11)]) {
      const result = runHashScript(password)
      expect(result.status, JSON.stringify(password)).toBe(1)
      expect(result.stdout, JSON.stringify(password)).toBe('')
      expect(result.stderr).toMatch(/at least 12 characters/)
    }
    expect(runHashScript('123456789012').status).toBe(0)
  })

  it('prints no $, which Next would expand in .env, even for a password full of them, and a hash the admin takes', async () => {
    const password = 'pa$$word with $HOME and ${PATH} in it'
    const result = runHashScript(password)
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).not.toContain('$')
    expect(result.stderr).not.toContain('$')
    const hash = /^ADMIN_PASSWORD_HASH=(.*)$/m.exec(result.stdout)?.[1].trim() ?? ''
    expect(isPasswordHash(hash)).toBe(true)
    expect(await verifyPassword(password, hash)).toBe(true)
  })
})

/** A session signed exactly the way the kit signs one, so only what it claims can be refused. */
function signed(claims: Record<string, unknown>) {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url')
  const key = createHmac('sha256', admin.secret).update(admin.passwordHash).digest()
  return `${SESSION_COOKIE}=${payload}.${createHmac('sha256', key).update(payload).digest('base64url')}`
}

/** What the status route, which needs a session, answers to a cookie. */
const opens = async (cookie: string) => (await get(paths.update, { cookie })).status

describe('a session cookie the site signed', () => {
  it('is refused when it claims to last longer than two hours, or names no session of its own', async () => {
    const now = Math.floor(Date.now() / 1000)
    const sid = 'A'.repeat(22)
    // Signed right and in date: these open the admin, which proves the signing.
    expect(await opens(signed({ iat: now, exp: now + 2 * 60 * 60, sid }))).toBe(200)
    expect(await opens(signed({ iat: now - 60, exp: now + 60, sid: 'b'.repeat(22) }))).toBe(200)
    for (const claims of [
      { iat: now, exp: now + 2 * 60 * 60 + 1, sid },
      { iat: now, exp: now + 365 * 24 * 60 * 60, sid },
      { iat: now - 2 * 60 * 60, exp: now + 60, sid },
      { iat: now, exp: now + 60 },
      { iat: now, exp: now + 60, sid: '' },
      { iat: now, exp: now + 60, sid: 'A'.repeat(21) },
      { iat: now, exp: now + 60, sid: '!'.repeat(22) },
      { iat: now, exp: now + 60, sid: 1234567890 },
      { iat: now, exp: now + 60, sid: null },
      { iat: now, exp: now + 60, sid: ['A'.repeat(22)] },
    ]) {
      expect(await opens(signed(claims)), JSON.stringify(claims)).toBe(401)
    }
  })
})

describe('the sign-in limits', () => {
  it('keep their memory bounded, however many addresses take part', () => {
    const limiter = rateLimiter({ limit: 5, windowMs: 15 * 60_000 })
    for (let i = 0; i < 10_500; i++) limiter.hit(`key ${i}`)
    expect(limiter.size()).toBeLessThanOrEqual(10_000)
    // And the ones the admin itself keeps.
    restart()
    const limits = adminLimits()
    for (const name of ['perAddress', 'everyone', 'perDevice', 'adopt'] as const) {
      for (let i = 0; i < 10_500; i++) limits[name].hit(`key ${i}`)
      expect(limits[name].size(), name).toBeLessThanOrEqual(10_000)
    }
  })

  it('run at most two password checks at once', async () => {
    const gate = atMost(2)
    const { promise: held, resolve: letGo } = Promise.withResolvers<void>()
    const first = gate(() => held.then(() => 'first'))
    const second = gate(() => held.then(() => 'second'))
    expect(await gate(async () => 'third')).toBeNull()
    letGo()
    expect(await Promise.all([first, second])).toEqual(['first', 'second'])
    expect(await gate(async () => 'after')).toBe('after')

    // Through the site: four right passwords at the same moment, each from
    // an address of its own, so only the cap on checks can turn two away.
    const answers = await Promise.all(['198.51.100.31', '198.51.100.32', '198.51.100.33', '198.51.100.34'].map((ip) => post(paths.login, { password: admin.password }, from(ip))))
    expect(answers.map((answer) => answer.status).toSorted()).toEqual([200, 200, 429, 429])
    for (const answer of answers.filter((each) => each.status === 429)) expect(answer.headers.get('retry-after')).toBe('2')
  })

  it('answer 413 to a body over 4 KB, counted in bytes as it arrives, on every route that takes a POST', async () => {
    const cookie = await signIn(admin)
    const posts = adminRoutes.filter((route) => (route.methods as readonly string[]).includes('POST')).map((route) => route.path)
    expect(posts).toHaveLength(4)
    for (const path of posts) {
      for (const body of [JSON.stringify({ pad: 'y'.repeat(4100) }), JSON.stringify({ pad: 'é'.repeat(2100) })]) {
        const response = await post(path, body, { cookie, ...from('198.51.100.41') })
        expect(response.status, `${path}: ${body.length} characters`).toBe(413)
      }
      // A length it declares too big is refused before anything is read.
      expect((await post(path, '{}', { cookie, 'content-length': '5000' })).status, path).toBe(413)
    }
    // Up to 4 KB is read as usual.
    const exactly = `{"pad":"${'y'.repeat(4096 - 10)}"}`
    expect(Buffer.byteLength(exactly)).toBe(4096)
    expect((await post(paths.login, exactly, from('198.51.100.42'))).status).toBe(401)
  })

  it('answer 400 to JSON that is not an object, and do not count it as an attempt', async () => {
    const ip = '198.51.100.43'
    for (const body of ['null', '[]', '1', '"x"', 'true', `[{"password":${JSON.stringify(admin.password)}}]`]) {
      expect((await post(paths.login, body, from(ip))).status, body).toBe(400)
    }
    // Four attempts that do count; a fifth is still allowed.
    for (let i = 0; i < 4; i++) expect((await empty(ip)).status).toBe(401)
    expect((await post(paths.login, { password: admin.password }, from(ip))).status).toBe(200)
  })

  it('count an IPv4 address written in IPv6 form as that same address', async () => {
    expect(limitKey('::ffff:203.0.113.9')).toBe(limitKey('203.0.113.9'))
    expect(limitKey('::FFFF:203.0.113.9')).toBe(limitKey('203.0.113.9'))
    for (const [guessing, signing] of [
      ['::ffff:203.0.113.77', '203.0.113.77'],
      ['203.0.113.78', '::FFFF:203.0.113.78'],
    ]) {
      for (let i = 0; i < 5; i++) expect((await empty(guessing)).status).toBe(401)
      expect((await post(paths.login, { password: admin.password }, from(signing))).status, `${guessing} then ${signing}`).toBe(429)
    }
  })
})

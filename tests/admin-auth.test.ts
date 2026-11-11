import { spawnSync } from 'node:child_process'
import { createHmac } from 'node:crypto'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { hashPassword, isPasswordHash, verifyPassword } from '@/lib/admin/password'
import { adminSettings } from '@/lib/admin/settings'
import { createSession, readSession, SESSION_COOKIE, SESSION_SECONDS, sessionCookie } from '@/lib/admin/session'
import { rateLimiter, oneAtATime } from '@/lib/admin/rate-limit'
import { checkPost, clientIp, limitKey } from '@/lib/admin/request'

// The admin modules import server-only, which only a Next.js build can load.
vi.mock('server-only', () => ({}))

const root = join(__dirname, '..')

describe('admin passwords', () => {
  it('verifies the password a hash was made from, and nothing else', async () => {
    const stored = await hashPassword('correct horse battery staple')
    expect(stored).toMatch(/^scrypt:32768:8:1:[\w-]{22}:[\w-]{43}$/)
    expect(isPasswordHash(stored)).toBe(true)
    expect(await verifyPassword('correct horse battery staple', stored)).toBe(true)
    expect(await verifyPassword('correct horse battery stapl', stored)).toBe(false)
    expect(await verifyPassword('', stored)).toBe(false)
  })

  it('gives each hash its own salt', async () => {
    expect(await hashPassword('same password here')).not.toBe(await hashPassword('same password here'))
  })

  it('refuses a malformed or out-of-range stored hash without throwing', async () => {
    for (const stored of [
      '',
      'not a hash',
      '$scrypt$32768$8$1$abc$def',
      'scrypt:32768:8:1:c2FsdA:',
      'scrypt:1000:8:1:c2FsdHNhbHRzYWx0c2FsdA:a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2U',
      'scrypt:1048576:8:1:c2FsdHNhbHRzYWx0c2FsdA:a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2U',
      'scrypt:32768:64:1:c2FsdHNhbHRzYWx0c2FsdA:a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2U',
      'scrypt:32768:8:1:c2FsdHNhbHRzYWx0c2FsdA:a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2U:extra',
    ]) {
      expect(isPasswordHash(stored), stored).toBe(false)
      expect(await verifyPassword('anything', stored), stored).toBe(false)
    }
  })

  it('is what scripts/hash-password.mjs prints, with a fresh session secret', async () => {
    const result = spawnSync(process.execPath, [join(root, 'scripts', 'hash-password.mjs')], {
      input: 'a long enough test password\n',
      encoding: 'utf8',
    })
    expect(result.status, result.stderr).toBe(0)
    const lines = Object.fromEntries(
      result.stdout
        .trim()
        .split('\n')
        .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
    )
    expect(await verifyPassword('a long enough test password', lines.ADMIN_PASSWORD_HASH)).toBe(true)
    expect(lines.ADMIN_SESSION_SECRET).toMatch(/^[\w-]{43}$/)
    // Next expands $ in .env values, which would corrupt either line.
    expect(result.stdout).not.toContain('$')
  })

  it('refuses a short password in the script', () => {
    const result = spawnSync(process.execPath, [join(root, 'scripts', 'hash-password.mjs')], {
      input: 'short\n',
      encoding: 'utf8',
    })
    expect(result.status).toBe(1)
    expect(result.stdout).toBe('')
    expect(result.stderr).toMatch(/12 characters/)
  })
})

describe('admin settings', () => {
  const valid = {
    ADMIN_PASSWORD_HASH: 'scrypt:32768:8:1:c2FsdHNhbHRzYWx0c2FsdA:a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2V5a2U',
    ADMIN_SESSION_SECRET: 'x'.repeat(32),
    GITHUB_TOKEN: 'github_pat_example',
  }

  it('turns the admin on only when every required setting is there and well formed', () => {
    const settings = adminSettings(valid)
    expect(settings).toEqual({
      enabled: true,
      passwordHash: valid.ADMIN_PASSWORD_HASH,
      secret: valid.ADMIN_SESSION_SECRET,
      github: { token: 'github_pat_example', repo: 'wslatl/wslatl.com', apiUrl: 'https://api.github.com' },
    })
  })

  it('takes the repository and API address from the environment, and no branch: releases only', () => {
    const settings = adminSettings({
      ...valid,
      GITHUB_REPO: 'someone/fork',
      GITHUB_BRANCH: 'anything',
      GITHUB_API_URL: 'http://127.0.0.1:4010/',
    })
    expect(settings.enabled && settings.github).toEqual({
      token: 'github_pat_example',
      repo: 'someone/fork',
      apiUrl: 'http://127.0.0.1:4010',
    })
  })

  it('stays off, naming every problem, when a setting is missing or malformed', () => {
    expect(adminSettings({})).toEqual({
      enabled: false,
      problems: [
        'ADMIN_PASSWORD_HASH is not set',
        'ADMIN_SESSION_SECRET is not set',
        'GITHUB_TOKEN is not set',
      ],
    })
    const bad = adminSettings({
      ADMIN_PASSWORD_HASH: 'hunter2',
      ADMIN_SESSION_SECRET: 'short',
      GITHUB_TOKEN: ' ',
      GITHUB_REPO: 'not-a-repo',
      GITHUB_API_URL: 'http://example.com',
    })
    expect(bad.enabled).toBe(false)
    expect(!bad.enabled && bad.problems.map((p) => p.split(' ')[0])).toEqual([
      'ADMIN_PASSWORD_HASH',
      'ADMIN_SESSION_SECRET',
      'GITHUB_TOKEN',
      'GITHUB_REPO',
      'GITHUB_API_URL',
    ])
  })

  it('never puts a setting value in a problem, so the log cannot leak one', () => {
    const bad = adminSettings({ ...valid, ADMIN_SESSION_SECRET: 'secret-but-short' })
    expect(JSON.stringify(bad)).not.toContain('secret-but-short')
  })
})

describe('admin sessions', () => {
  const keys = { secret: 's'.repeat(32), passwordHash: 'scrypt:32768:8:1:a:b' }
  const now = Date.UTC(2026, 9, 31, 12)

  it('accepts its own session until it expires', () => {
    const value = createSession(keys, now)
    expect(readSession(value, keys, now)).toBe(true)
    expect(readSession(value, keys, now + (SESSION_SECONDS - 1) * 1000)).toBe(true)
    expect(readSession(value, keys, now + SESSION_SECONDS * 1000)).toBe(false)
  })

  it('refuses a tampered, foreign or garbled session', () => {
    const value = createSession(keys, now)
    const [payload, signature] = value.split('.')
    const longer = Buffer.from(JSON.stringify({ iat: now / 1000, exp: now / 1000 + 86_400 * 365 })).toString('base64url')
    for (const forged of [
      `${longer}.${signature}`,
      `${payload}.${signature.slice(0, -2)}AA`,
      `${payload}.`,
      payload,
      '',
      'a.b.c',
      `${payload}.${signature}.x`,
    ]) {
      expect(readSession(forged, keys, now), forged).toBe(false)
    }
    expect(readSession(undefined, keys, now)).toBe(false)
    expect(readSession(value, { ...keys, secret: 't'.repeat(32) }, now)).toBe(false)
  })

  it('logs everyone out when the password changes', () => {
    const value = createSession(keys, now)
    expect(readSession(value, { ...keys, passwordHash: 'scrypt:32768:8:1:c:d' }, now)).toBe(false)
  })

  it('refuses a session issued in the future', () => {
    const value = createSession(keys, now + 10 * 60 * 1000)
    expect(readSession(value, keys, now)).toBe(false)
  })

  it('refuses a correctly signed session that claims a longer life than sessions get', () => {
    // Signed the way session.ts signs, so only the lifetime check can refuse it.
    const key = createHmac('sha256', keys.secret).update(keys.passwordHash).digest()
    const signed = (exp: number, sid = 'A'.repeat(22)) => {
      const payload = Buffer.from(JSON.stringify({ iat: now / 1000, exp, sid })).toString('base64url')
      return `${payload}.${createHmac('sha256', key).update(payload).digest('base64url')}`
    }
    expect(readSession(signed(now / 1000 + SESSION_SECONDS), keys, now)).toBe(true)
    expect(readSession(signed(now / 1000 + SESSION_SECONDS + 1), keys, now)).toBe(false)
    // And one with no id of its own, which a sign-out could not end.
    expect(readSession(signed(now / 1000 + 60, ''), keys, now)).toBe(false)
  })

  it('accepts only the one spelling of a signature, though base64 has four that decode the same', () => {
    const value = createSession(keys, now)
    const last = value.at(-1) ?? ''
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    const twins = [...alphabet].filter((char) => char !== last && alphabet.indexOf(char) >> 2 === alphabet.indexOf(last) >> 2)
    expect(twins.length).toBe(3)
    for (const twin of twins) expect(readSession(`${value.slice(0, -1)}${twin}`, keys, now), twin).toBe(false)
    for (const extra of ['=', '==', '!', ' ']) expect(readSession(`${value}${extra}`, keys, now), extra).toBe(false)
  })

  it('is a short-lived, HttpOnly, Secure, SameSite=Strict __Host- cookie, which no other site under wslatl.com can set', () => {
    expect(SESSION_SECONDS).toBe(2 * 60 * 60)
    expect(sessionCookie('v')).toEqual({
      name: SESSION_COOKIE,
      value: 'v',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_SECONDS,
    })
    expect(SESSION_COOKIE).toBe('__Host-wslatl_admin')
  })
})

describe('login rate limits', () => {
  it('allows the limit, refuses the next, and frees up after the window', () => {
    const limiter = rateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 })
    const start = 1_000_000
    for (let i = 0; i < 5; i++) expect(limiter.hit('1.2.3.4', start + i)).toBe(true)
    expect(limiter.hit('1.2.3.4', start + 10)).toBe(false)
    expect(limiter.retryAfterSeconds('1.2.3.4', start + 10)).toBe(900)
    expect(limiter.hit('5.6.7.8', start + 10)).toBe(true)
    expect(limiter.hit('1.2.3.4', start + 15 * 60 * 1000)).toBe(true)
  })

  it('gives back an attempt on refund', () => {
    const limiter = rateLimiter({ limit: 2, windowMs: 60_000 })
    limiter.hit('all', 0)
    limiter.hit('all', 0)
    limiter.refund('all')
    expect(limiter.hit('all', 1)).toBe(true)
    expect(limiter.hit('all', 1)).toBe(false)
    limiter.refund('nobody')
  })

  it('starts a key over on reset', () => {
    const limiter = rateLimiter({ limit: 2, windowMs: 60_000 })
    limiter.hit('a', 0)
    limiter.hit('a', 0)
    expect(limiter.hit('a', 1)).toBe(false)
    limiter.reset('a')
    expect(limiter.hit('a', 2)).toBe(true)
  })

  it('forgets old keys instead of growing without end', () => {
    const limiter = rateLimiter({ limit: 1, windowMs: 1000, maxKeys: 100 })
    for (let i = 0; i < 1000; i++) limiter.hit(`ip-${i}`, i * 10)
    expect(limiter.size()).toBeLessThanOrEqual(100)
  })

  it('runs at most the given number of password checks at once', async () => {
    const gate = oneAtATime(2)
    let release!: () => void
    const blocked = new Promise<void>((resolve) => (release = resolve))
    const first = gate(() => blocked.then(() => 'first'))
    const second = gate(() => blocked.then(() => 'second'))
    expect(await gate(async () => 'third')).toBeNull()
    release()
    expect(await Promise.all([first, second])).toEqual(['first', 'second'])
    expect(await gate(async () => 'after')).toBe('after')
  })
})

function post(headers: Record<string, string>, body: BodyInit = '{"password":"x"}') {
  return new Request('https://wslatl.com/admin/api/login', { method: 'POST', headers, body })
}

describe('admin requests', () => {
  const sameOrigin = { origin: 'https://wslatl.com', host: 'wslatl.com', 'content-type': 'application/json' }

  it('reads the visitor address from CF-Connecting-IP alone, never from X-Forwarded-For', () => {
    expect(clientIp(new Headers({ 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' }))).toBe('1.1.1.1')
    expect(clientIp(new Headers({ 'cf-connecting-ip': ' 2001:db8::1 ' }))).toBe('2001:db8::1')
    expect(clientIp(new Headers({ 'x-forwarded-for': '2.2.2.2, 3.3.3.3' }))).toBe('unknown')
    expect(clientIp(new Headers({ 'cf-connecting-ip': 'not an address', 'x-forwarded-for': '2.2.2.2' }))).toBe('unknown')
    expect(clientIp(new Headers())).toBe('unknown')
  })

  it('counts login attempts by address, and an IPv6 address by its /64', () => {
    expect(limitKey('203.0.113.9')).toBe('203.0.113.9')
    expect(limitKey('::ffff:203.0.113.9')).toBe('203.0.113.9')
    expect(limitKey('2001:db8:1:2:aaaa::1')).toBe('2001:db8:1:2::/64')
    expect(limitKey('2001:0DB8:0001:0002:bbbb:cccc:dddd:eeee')).toBe('2001:db8:1:2::/64')
    expect(limitKey('2001:db8:1:3::1')).toBe('2001:db8:1:3::/64')
    expect(limitKey('2001:db8::1')).toBe('2001:db8:0:0::/64')
    expect(limitKey('::1')).toBe('0:0:0:0::/64')
    expect(limitKey('fe80::1%eth0')).toBe('fe80:0:0:0::/64')
  })

  it('accepts a same-origin JSON post and hands back its body', async () => {
    const result = await checkPost(post({ ...sameOrigin, 'sec-fetch-site': 'same-origin' }))
    expect(result).toEqual({ ok: true, body: { password: 'x' } })
    const forwarded = await checkPost(
      post({ ...sameOrigin, host: 'internal:3000', 'x-forwarded-host': 'wslatl.com' }),
    )
    expect(forwarded.ok).toBe(true)
  })

  it('refuses a post from another site, or one that does not say where it is from', async () => {
    for (const headers of [
      { ...sameOrigin, origin: 'https://evil.example' },
      { ...sameOrigin, origin: 'https://wslatl.com.evil.example' },
      { host: 'wslatl.com', 'content-type': 'application/json' },
      { ...sameOrigin, origin: 'null' },
      { ...sameOrigin, 'sec-fetch-site': 'cross-site' },
      { ...sameOrigin, 'sec-fetch-site': 'same-site' },
    ]) {
      const result = await checkPost(post(headers))
      expect(!result.ok && result.response.status, JSON.stringify(headers)).toBe(403)
    }
  })

  it('refuses a form post, a large body and broken JSON', async () => {
    const form = await checkPost(post({ ...sameOrigin, 'content-type': 'application/x-www-form-urlencoded' }, 'a=1'))
    expect(!form.ok && form.response.status).toBe(415)
    const large = await checkPost(post(sameOrigin, JSON.stringify({ password: 'x'.repeat(5000) })))
    expect(!large.ok && large.response.status).toBe(413)
    const broken = await checkPost(post(sameOrigin, '{"password":'))
    expect(!broken.ok && broken.response.status).toBe(400)
  })

  it('refuses JSON that is not an object, which no admin route can read', async () => {
    for (const body of ['null', '[]', '1', '"x"', 'true']) {
      const result = await checkPost(post(sameOrigin, body))
      expect(!result.ok && result.response.status, body).toBe(400)
    }
    expect(await checkPost(post(sameOrigin, ''))).toEqual({ ok: true, body: {} })
  })
})

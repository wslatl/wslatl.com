import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * The admin session: a signed cookie, so there is nothing to store.
 *
 *   <base64url JSON { iat, exp }>.<base64url HMAC-SHA256 of the first part>
 *
 * The signing key is derived from ADMIN_SESSION_SECRET and the password
 * hash together, so changing either one logs everyone out.
 */
export const SESSION_COOKIE = 'wslatl_admin'
export const SESSION_SECONDS = 2 * 60 * 60

type Keys = { secret: string; passwordHash: string }

function sign(payload: string, { secret, passwordHash }: Keys): Buffer {
  const key = createHmac('sha256', secret).update(passwordHash).digest()
  return createHmac('sha256', key).update(payload).digest()
}

export function createSession(keys: Keys, now = Date.now()): string {
  const iat = Math.floor(now / 1000)
  const payload = Buffer.from(JSON.stringify({ iat, exp: iat + SESSION_SECONDS })).toString('base64url')
  return `${payload}.${sign(payload, keys).toString('base64url')}`
}

export function readSession(value: string | undefined, keys: Keys, now = Date.now()): boolean {
  const parts = value?.split('.') ?? []
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false
  const [payload, signature] = parts
  const given = Buffer.from(signature, 'base64url')
  const expected = sign(payload, keys)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false
  try {
    const { iat, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const seconds = now / 1000
    // A minute of leeway for clocks, and never longer than one lifetime.
    return Number.isFinite(iat) && Number.isFinite(exp) && iat <= seconds + 60 && seconds < exp && exp - iat <= SESSION_SECONDS
  } catch {
    return false
  }
}

export function sessionCookie(value: string, maxAge = SESSION_SECONDS) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/admin',
    maxAge,
  }
}

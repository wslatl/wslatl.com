import 'server-only'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * The device cookie, after OWASP's device cookies against password guessing.
 * A browser that has signed in here before carries a cookie the site signed,
 * and its sign-in attempts are counted on their own, by that browser, rather
 * than against the limit everyone shares (lib/admin/rate-limit.ts). So a
 * flood of guesses from many addresses, which fills the shared limit, cannot
 * keep the owner out, and the flood gains nothing by it: without a cookie the
 * site signed, an attempt counts like any other.
 *
 *   <random id, base64url>.<base64url HMAC-SHA256 of "device.<id>">
 *
 * Its key is derived from ADMIN_SESSION_SECRET, apart from the session's own
 * key, and from the password hash too: changing the password ends every
 * browser's standing, so cookies collected by someone who once had the old
 * password stop counting the moment it changes. It is set at every sign-in,
 * lasts 180 days, and is kept on sign-out. It opens nothing by itself.
 */
export const DEVICE_COOKIE = 'admin_device'
export const DEVICE_SECONDS = 180 * 24 * 60 * 60

type Keys = { secret: string; passwordHash: string }

// The id, then the signature, as Node writes base64url: anything else, a
// stray character or another spelling of the same bytes, is not ours.
const shape = /^[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$/

function sign(id: string, { secret, passwordHash }: Keys): Buffer {
  const key = createHmac('sha256', secret).update(`admin device\n${passwordHash}`).digest()
  return createHmac('sha256', key).update(`device.${id}`).digest()
}

export function createDevice(keys: Keys): string {
  const id = randomBytes(16).toString('base64url')
  return `${id}.${sign(id, keys).toString('base64url')}`
}

/** The id of the browser a device cookie names, when the site signed it; null for anything else. */
export function readDevice(value: string | undefined, keys: Keys): string | null {
  if (typeof value !== 'string' || !shape.test(value)) return null
  const [id, signature] = value.split('.')
  const given = Buffer.from(signature, 'base64url')
  if (given.toString('base64url') !== signature) return null
  const expected = sign(id, keys)
  return given.length === expected.length && timingSafeEqual(given, expected) ? id : null
}

export function deviceCookie(value: string) {
  return {
    name: DEVICE_COOKIE,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/admin',
    maxAge: DEVICE_SECONDS,
  }
}

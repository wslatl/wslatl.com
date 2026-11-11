import 'server-only'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { SessionKeys } from './session'

/**
 * The device cookie, after OWASP's device cookies against password guessing.
 * A browser that has signed in here before carries a cookie the site signed,
 * and its sign-in attempts are counted on their own, by that browser, rather
 * than against the limit everyone shares (rate-limit.ts). So a flood of
 * guesses from many addresses, which fills the shared limit, cannot keep the
 * owner out, and the flood gains nothing by it: without a cookie the site
 * signed, an attempt counts like any other. A stolen cookie still gets only
 * its own few attempts.
 *
 *   <id, 22 characters of base64url>.<base64url HMAC-SHA256 of "device.<id>">
 *
 * The id is 16 bytes: when the cookie was made, in seconds, as a 4-byte
 * number, then 12 random bytes. So the site can tell an old cookie from a
 * fresh one without storing anything, and one older than 180 days counts as
 * none, wherever it was kept. The name, the shape, the key and what is signed
 * are the same as the main website's own device cookie, so a browser it knows
 * stays known once that site moves onto the kit, as long as it makes the id
 * the same way.
 *
 * The key is derived from ADMIN_SESSION_SECRET, apart from the session's own
 * key, and from the password hash too: changing either ends every browser's
 * standing, so cookies gathered by someone who once had the old password
 * stop counting the moment it changes. A fresh cookie is set at every
 * sign-in, and it is kept on sign-out. It opens nothing by itself.
 */
export const DEVICE_COOKIE = 'admin_device'
export const DEVICE_SECONDS = 180 * 24 * 60 * 60

// The id, then the signature, as Node writes base64url. Anything else, a
// stray character or another spelling of the same bytes, is not ours.
const shape = /^[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$/

function sign(id: string, { secret, passwordHash }: SessionKeys): Buffer {
  const key = createHmac('sha256', secret).update(`admin device\n${passwordHash}`).digest()
  return createHmac('sha256', key).update(`device.${id}`).digest()
}

export function createDevice(keys: SessionKeys, now = Date.now()): string {
  const id = Buffer.alloc(16)
  id.writeUInt32BE(Math.floor(now / 1000), 0)
  randomBytes(12).copy(id, 4)
  const text = id.toString('base64url')
  return `${text}.${sign(text, keys).toString('base64url')}`
}

/**
 * The id of the browser a device cookie names, when the site signed it as it
 * is and it is less than 180 days old; null for anything else.
 */
export function readDevice(value: string | undefined, keys: SessionKeys, now = Date.now()): string | null {
  if (typeof value !== 'string' || !shape.test(value)) return null
  const [id, signature] = value.split('.')
  const given = Buffer.from(signature, 'base64url')
  const bytes = Buffer.from(id, 'base64url')
  if (given.toString('base64url') !== signature || bytes.toString('base64url') !== id) return null
  const expected = sign(id, keys)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  // A minute of leeway for clocks, and never longer than one lifetime.
  const made = bytes.readUInt32BE(0)
  const seconds = now / 1000
  return made <= seconds + 60 && seconds < made + DEVICE_SECONDS ? id : null
}

/** HttpOnly, Secure and SameSite=Strict, like the session, but only on /admin, for 180 days, as the main website's is. */
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

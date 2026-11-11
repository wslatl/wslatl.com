import 'server-only'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { endSessionId, sessionEnded } from '@/lib/admin/ended-sessions'

/**
 * The admin session: a signed cookie, so there is nothing to store.
 *
 *   <base64url JSON { iat, exp, sid }>.<base64url HMAC-SHA256 of the first part>
 *
 * The signing key is derived from ADMIN_SESSION_SECRET and the password
 * hash together, so changing either one logs everyone out. sid names the one
 * session, so signing out can end exactly it (lib/admin/ended-sessions.ts):
 * a signed cookie is otherwise good until it expires, even after a sign-out.
 *
 * The cookie is a __Host- cookie: the browser keeps it only when it is
 * Secure, has Path=/ and names no Domain, so no other site under wslatl.com
 * can set or overwrite it.
 */
export const SESSION_COOKIE = '__Host-wslatl_admin'
export const SESSION_SECONDS = 2 * 60 * 60

type Keys = { secret: string; passwordHash: string }
type Session = { iat: number; exp: number; sid: string }

// base64url as Node writes it: no padding, and nothing else. Node reads far
// more (it skips any character it does not know, and takes + and / as well),
// so a cookie with a stray = or ! on the end would otherwise pass as the
// same cookie.
const base64url = /^[A-Za-z0-9_-]+$/
const signatureLength = 43
const maxCookieLength = 512

function sign(payload: string, { secret, passwordHash }: Keys): Buffer {
  const key = createHmac('sha256', secret).update(passwordHash).digest()
  return createHmac('sha256', key).update(payload).digest()
}

export function createSession(keys: Keys, now = Date.now()): string {
  const iat = Math.floor(now / 1000)
  const sid = randomBytes(16).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ iat, exp: iat + SESSION_SECONDS, sid })).toString('base64url')
  return `${payload}.${sign(payload, keys).toString('base64url')}`
}

/** The session a cookie holds, when it is one of ours, untouched and in date. Says nothing about a sign-out. */
function verify(value: string | undefined, keys: Keys, now: number): Session | null {
  if (typeof value !== 'string' || value.length > maxCookieLength) return null
  const parts = value.split('.')
  if (parts.length !== 2) return null
  const [payload, signature] = parts
  if (!base64url.test(payload) || !base64url.test(signature) || signature.length !== signatureLength) return null
  const given = Buffer.from(signature, 'base64url')
  // The last character carries two spare bits, so four spellings decode to
  // the same signature. Only the one Node writes is ours.
  if (given.toString('base64url') !== signature) return null
  const expected = sign(payload, keys)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const { iat, exp, sid } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const seconds = now / 1000
    // A minute of leeway for clocks, and never longer than one lifetime.
    const inDate =
      Number.isFinite(iat) && Number.isFinite(exp) && iat <= seconds + 60 && seconds < exp && exp - iat <= SESSION_SECONDS
    return inDate && typeof sid === 'string' && base64url.test(sid) && sid.length >= 22 ? { iat, exp, sid } : null
  } catch {
    return null
  }
}

/** True for a cookie that holds a live session: ours, untouched, in date, and not ended by a sign-out. */
export function readSession(value: string | undefined, keys: Keys, now = Date.now()): boolean {
  const session = verify(value, keys, now)
  return session !== null && !sessionEnded(session.sid, now)
}

/**
 * Signing out: ends the session the cookie holds, for good, rather than only
 * asking the browser to forget it. True when there was a live session to end.
 */
export function endSession(value: string | undefined, keys: Keys, now = Date.now()): boolean {
  const session = verify(value, keys, now)
  if (!session || sessionEnded(session.sid, now)) return false
  endSessionId(session.sid, session.exp, now)
  return true
}

export function sessionCookie(value: string, maxAge = SESSION_SECONDS) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  }
}

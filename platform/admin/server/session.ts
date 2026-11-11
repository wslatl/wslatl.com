import 'server-only'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { endSessionId, sessionEnded } from './ended-sessions'

/**
 * The shared password's session: one signed cookie, so there is nothing to
 * store but the sessions a sign-out ended.
 *
 *   <base64url JSON { iat, exp, sid }>.<base64url HMAC-SHA256 of the first part>
 *
 * The signing key comes from ADMIN_SESSION_SECRET and the password hash
 * together, so changing either one signs everyone out, which is what
 * someone changing a leaked password expects. sid names the one session,
 * so signing out can end exactly it (ended-sessions.ts): a signed cookie is
 * otherwise good until it expires, even after a sign-out.
 *
 * It is a __Host- cookie: the browser keeps one only when it is Secure, on
 * Path=/ and names no Domain, so no other site under the same domain can
 * set or replace it. The name, the shape and the key are the main website's
 * own, so a session it started stays good once it moves onto the kit.
 */
export const SESSION_COOKIE = '__Host-wslatl_admin'
export const SESSION_SECONDS = 2 * 60 * 60

export type SessionKeys = { secret: string; passwordHash: string }

/** What a session cookie says about itself, once it is known to be ours. */
export type Session = { iat: number; exp: number; sid: string }

// base64url as Node writes it: no padding, and nothing else. Node reads far
// more (it skips any character it does not know, and takes + and / as
// well), so a cookie with a stray = or ! on the end would otherwise pass as
// the same cookie.
const b64url = /^[A-Za-z0-9_-]+$/
const signatureLength = 43
const maxCookieLength = 512
/** 16 random bytes, as base64url. */
const sidLength = 22

function sign(payload: string, { secret, passwordHash }: SessionKeys): Buffer {
  const key = createHmac('sha256', secret).update(passwordHash).digest()
  return createHmac('sha256', key).update(payload).digest()
}

export function createSession(keys: SessionKeys, now = Date.now()): string {
  const iat = Math.floor(now / 1000)
  const sid = randomBytes(16).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ iat, exp: iat + SESSION_SECONDS, sid })).toString('base64url')
  return `${payload}.${sign(payload, keys).toString('base64url')}`
}

/**
 * The session a cookie holds when it is one of ours, untouched and in date,
 * or null. Says nothing about a sign-out: readSession does.
 */
export function verifySession(value: string | undefined, keys: SessionKeys, now = Date.now()): Session | null {
  if (typeof value !== 'string' || value.length > maxCookieLength) return null
  const parts = value.split('.')
  if (parts.length !== 2) return null
  const [payload, signature] = parts
  if (!b64url.test(payload) || !b64url.test(signature) || signature.length !== signatureLength) return null
  const given = Buffer.from(signature, 'base64url')
  // The last character carries two spare bits, so four spellings decode to
  // the same signature. Only the one Node writes is ours.
  if (given.toString('base64url') !== signature) return null
  const expected = sign(payload, keys)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const claims: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof claims !== 'object' || claims === null) return null
    const { iat, exp, sid } = claims as { iat?: unknown; exp?: unknown; sid?: unknown }
    if (typeof iat !== 'number' || typeof exp !== 'number' || !Number.isFinite(iat) || !Number.isFinite(exp)) return null
    const seconds = now / 1000
    // A minute of leeway for clocks, and never longer than one lifetime.
    if (!(iat <= seconds + 60 && seconds < exp && exp - iat <= SESSION_SECONDS)) return null
    if (typeof sid !== 'string' || sid.length < sidLength || !b64url.test(sid)) return null
    return { iat, exp, sid }
  } catch {
    return null
  }
}

/** True for a cookie that holds a live session: ours, untouched, in date, and not ended by a sign-out. */
export function readSession(value: string | undefined, keys: SessionKeys, now = Date.now()): boolean {
  const session = verifySession(value, keys, now)
  return session !== null && !sessionEnded(session.sid, now)
}

/**
 * Signing out: ends the session the cookie holds for good, rather than only
 * asking the browser to forget it. True when there was a live session to end.
 */
export function endSession(value: string | undefined, keys: SessionKeys, now = Date.now()): boolean {
  const session = verifySession(value, keys, now)
  if (!session || sessionEnded(session.sid, now)) return false
  endSessionId(session.sid, session.exp, now)
  return true
}

/**
 * HttpOnly so no script can read it, Secure so it never crosses plain HTTP,
 * SameSite=Strict so another site cannot make the browser send it, and a
 * __Host- cookie on the whole site, for two hours.
 */
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

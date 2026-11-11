import 'server-only'
import { isIP } from 'node:net'
import { NextResponse } from 'next/server'

/**
 * What every admin request goes through. The admin's POST handlers are the
 * only routes on the site that take anything but GET (proxy.ts), so each of
 * them starts with checkPost(): the request must come from a page on this
 * same site, as JSON, and small. A form on another site can do none of
 * those, and the session cookie is SameSite=Strict besides. The GET routes
 * start with checkRead(), which refuses a read sent from another site.
 */
const maxBodyBytes = 4096

export function adminLog(message: string) {
  console.log(`${new Date().toISOString()} [admin] ${message}`)
}

/**
 * The visitor's address, from Cloudflare's CF-Connecting-IP and nothing
 * else. Cloudflare sets that header itself on every request it passes on,
 * whatever the visitor sent. X-Forwarded-For is never read: a visitor can
 * put anything in it, and Cloudflare and Next both keep what they were sent,
 * so trusting it would let anyone claim a fresh address for every attempt.
 * A request with no valid CF-Connecting-IP (one that reached the server
 * without going through Cloudflare) is counted as "unknown", all of them
 * together.
 */
export function clientIp(headers: Headers): string {
  const cloudflare = headers.get('cf-connecting-ip')?.trim() ?? ''
  return isIP(cloudflare) ? cloudflare : 'unknown'
}

/**
 * What the login limit counts attempts by: the address, or for IPv6 its
 * /64, since one connection usually has the whole /64 to pick from.
 */
export function limitKey(ip: string): string {
  const address = ip.split('%')[0].toLowerCase()
  const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return mapped[1]
  if (!address.includes(':')) return address
  const [head, tail] = address.split('::')
  const left = head ? head.split(':') : []
  const right = tail ? tail.split(':') : []
  const groups = tail === undefined ? left : [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right]
  return `${groups
    .slice(0, 4)
    .map((group) => group.replace(/^0+(?=.)/, ''))
    .join(':')}::/64`
}

/** A JSON answer that no browser or cache keeps. */
export function json(body: unknown, init: ResponseInit = {}): NextResponse {
  const headers = new Headers(init.headers)
  headers.set('Cache-Control', 'no-store')
  return NextResponse.json(body, { ...init, headers })
}

function sameOrigin(headers: Headers): boolean {
  const fetchSite = headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') return false
  const origin = headers.get('origin')
  const host = (headers.get('x-forwarded-host')?.split(',')[0] ?? headers.get('host'))?.trim().toLowerCase()
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

async function readLimited(request: Request): Promise<string | null> {
  if (Number(request.headers.get('content-length') ?? 0) > maxBodyBytes) return null
  if (!request.body) return ''
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBodyBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export type ReadCheck = { ok: true } | { ok: false; response: Response }

/**
 * For the admin's GET routes. A page on another site could ask for one, but
 * never read the answer (there are no CORS headers) and never send the
 * cookie (SameSite=Strict); it is refused all the same, so no admin route
 * acts on a request from elsewhere. Typing the address in (Sec-Fetch-Site:
 * none) is fine.
 */
export function checkRead(request: Request): ReadCheck {
  const fetchSite = request.headers.get('sec-fetch-site')
  const crossSite = fetchSite !== null && fetchSite !== 'same-origin' && fetchSite !== 'none'
  // Browsers send Origin with a read only when it comes from a script on another page.
  if (crossSite || (request.headers.has('origin') && !sameOrigin(request.headers))) {
    return { ok: false, response: json({ error: 'This request did not come from this site.' }, { status: 403 }) }
  }
  return { ok: true }
}

export type PostCheck = { ok: true; body: unknown } | { ok: false; response: Response }

export async function checkPost(request: Request): Promise<PostCheck> {
  if (!sameOrigin(request.headers)) {
    return { ok: false, response: json({ error: 'This request did not come from this site.' }, { status: 403 }) }
  }
  const type = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') {
    return { ok: false, response: json({ error: 'Send JSON.' }, { status: 415 }) }
  }
  const text = await readLimited(request)
  if (text === null) return { ok: false, response: json({ error: 'Too large.' }, { status: 413 }) }
  let body: unknown
  try {
    body = text ? JSON.parse(text) : {}
  } catch {
    return { ok: false, response: json({ error: 'That is not valid JSON.' }, { status: 400 }) }
  }
  // Every admin route reads named fields, so anything but an object is refused here.
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, response: json({ error: 'Send a JSON object.' }, { status: 400 }) }
  }
  return { ok: true, body }
}

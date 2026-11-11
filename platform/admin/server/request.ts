import 'server-only'
import { isIP } from 'node:net'
import { NextResponse } from 'next/server'
import { sameOrigin } from '../origin'

export { sameOrigin }

/**
 * What every admin request goes through. The admin's POST routes are the
 * only addresses in an app that take anything but GET (proxy.ts, with
 * ../proxy.ts), so each starts with checkPost(): the request must come from
 * a page on this same site, as JSON, and small. A form on another site can
 * do none of those, and the session cookie is SameSite=Strict besides. The
 * GET routes start with checkRead().
 */

export function adminLog(message: string) {
  console.log(`${new Date().toISOString()} [admin] ${message}`)
}

/**
 * The visitor's address, as Cloudflare gives it in CF-Connecting-IP, or
 * null when there is none. X-Forwarded-For is never read: behind Cloudflare
 * its first value is whatever the sender wrote, so a lockout keyed on it
 * could be dodged by changing it on every attempt. A value that is not an
 * address counts as none, so a request sent past Cloudflare cannot fill the
 * limiter or the log with junk.
 *
 * CF-Connecting-IP itself can only be trusted while the server takes
 * connections from Cloudflare alone: anyone who reaches it directly can
 * write any address there. Allowing only Cloudflare's address ranges at the
 * server's firewall is the owner's job (../README.md, "For the owner").
 */
export function clientIp(headers: Headers): string | null {
  const value = headers.get('cf-connecting-ip')?.trim() ?? ''
  return value.length <= 64 && isIP(value) !== 0 ? value : null
}

/** The address for the log and the update request, or "an unknown address". */
export function whoFrom(headers: Headers): string {
  return clientIp(headers) ?? 'an unknown address'
}

/**
 * What the sign-in limit counts attempts by: the address, or for IPv6 its
 * /64, since one connection usually has the whole /64 to pick from. Every
 * request without a Cloudflare address shares one count.
 */
export function limitKey(ip: string | null): string {
  if (ip === null) return 'no address'
  const address = ip.split('%')[0].toLowerCase()
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(address)
  if (mapped) return mapped[1]
  if (!address.includes(':')) return address
  const [head, tail] = address.split('::')
  const left = head ? head.split(':') : []
  const right = tail ? tail.split(':') : []
  const groups = tail === undefined ? left : [...left, ...Array<string>(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right]
  return `${groups
    .slice(0, 4)
    .map((group) => group.replace(/^0+(?=.)/, ''))
    .join(':')}::/64`
}

/** Headers on every answer from an admin route: nothing keeps it, and nothing indexes it. */
export const adminResponseHeaders: Readonly<Record<string, string>> = Object.freeze({
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
})

/** A JSON answer that no browser, cache or search engine keeps. */
export function json(body: unknown, init: ResponseInit = {}): NextResponse {
  const headers = new Headers(init.headers)
  for (const [name, value] of Object.entries(adminResponseHeaders)) headers.set(name, value)
  return NextResponse.json(body, { ...init, headers })
}

/** An empty answer with a status, with the same headers. */
export function bare(status: number, headers: Record<string, string> = {}): Response {
  return new Response(null, { status, headers: { ...adminResponseHeaders, ...headers } })
}

/**
 * For a GET route: a 403 for a read another site's page asked for, or null.
 * Such a page could never read the answer (there are no CORS headers) nor
 * send the session cookie (SameSite=Strict), and it is refused all the same,
 * so no admin route acts on a request from elsewhere. An address typed in
 * (Sec-Fetch-Site: none), and the Updates page's own reads, which carry no
 * Origin, are fine.
 */
export function checkRead(request: Request): Response | null {
  const fetchSite = request.headers.get('sec-fetch-site')
  const crossSite = fetchSite !== null && fetchSite !== 'same-origin' && fetchSite !== 'none'
  if (crossSite || (request.headers.has('origin') && !sameOrigin(request.headers))) {
    return json({ error: 'This request did not come from this site.' }, { status: 403 })
  }
  return null
}

/** Big enough for every request the kit's routes take. */
export const defaultMaxBodyBytes = 4096

async function readLimited(request: Request, maxBytes: number): Promise<string | null> {
  if (Number(request.headers.get('content-length') ?? 0) > maxBytes) return null
  if (!request.body) return ''
  // The declared length can be missing or wrong, so the body is counted as
  // it arrives, and reading stops as soon as it passes the limit.
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export type PostCheck = { ok: true; body: Record<string, unknown> } | { ok: false; response: Response }

/**
 * Every admin POST goes through this before it reads a cookie or acts on
 * anything, and after the settings check, so a switched-off admin answers
 * 404 rather than this. Answers the parsed body, which is always an object,
 * or the response to send instead. An app's own admin routes get it from
 * admin.signedInPost, which runs the three in that order, with a larger
 * maxBytes where they take more; called on its own first, it would tell a
 * prober that the admin is there.
 */
export async function checkPost(request: Request, { maxBytes = defaultMaxBodyBytes } = {}): Promise<PostCheck> {
  if (!sameOrigin(request.headers)) {
    return { ok: false, response: json({ error: 'This request did not come from this site.' }, { status: 403 }) }
  }
  const type = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') {
    return { ok: false, response: json({ error: 'Send JSON.' }, { status: 415 }) }
  }
  const text = await readLimited(request, maxBytes)
  if (text === null) return { ok: false, response: json({ error: 'That is more than this request takes.' }, { status: 413 }) }
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
  return { ok: true, body: body as Record<string, unknown> }
}

/**
 * One cookie from a Cookie header, or undefined. The first one of that
 * name wins: the browser sends the one set for the longest path first.
 */
export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const at = part.indexOf('=')
    if (at === -1 || part.slice(0, at).trim() !== name) continue
    let value = part.slice(at + 1).trim()
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return undefined
}

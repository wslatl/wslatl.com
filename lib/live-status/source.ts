import 'server-only'
import { shortLinks } from '@/config/links'
import { maxCheckAgeMs, statusFromKuma } from '@/lib/live-status/kuma'
import { hasLiveData, unknownStatus, type LiveStatus } from '@/lib/live-status/snapshot'

/**
 * Where /live-status.json gets its answer: the status page's two public JSON
 * answers, asked for by the server, never by the browser, so the site's
 * Content Security Policy keeps the browser on this site alone.
 *
 * - No input: the addresses are fixed, and nothing from the request that
 *   reached the route is read.
 * - Our host only: the status page's own address, from config/links.json,
 *   and only over HTTPS on wslatl.com or a subdomain of it. A redirect is
 *   refused rather than followed, so no answer can send it anywhere else.
 * - Short: both answers within a few seconds, each at most half a megabyte,
 *   read in pieces so a bigger one is dropped as soon as it passes the limit.
 * - Cached: one answer serves everyone for a minute, and only one request
 *   to the status page is ever in flight, however many visitors arrive.
 *
 * Missing or late: the last good answer while its checks are recent
 * (lib/live-status/kuma.ts, maxCheckAgeMs), then every location unknown,
 * which the panel shows as no live status, never as a guess.
 */

/** The status page's slug on Kuma, the "wslatl" in status.wslatl.com/status/wslatl. */
const slug = 'wslatl'

/** The status page's address, if it is ours and on HTTPS; null otherwise, which keeps live status off. */
export function statusPageOrigin(url: string = shortLinks.status.url): string | null {
  try {
    const { protocol, hostname, origin, port, username, password } = new URL(url)
    const ours = hostname === 'wslatl.com' || hostname.endsWith('.wslatl.com')
    return protocol === 'https:' && ours && !port && !username && !password ? origin : null
  } catch {
    return null
  }
}

export const limits = {
  /** For both requests together, from asking to the last byte. */
  timeoutMs: 3000,
  /** For each answer. Today's are about 1 KB and 55 KB. */
  maxBytes: 512 * 1024,
  /** How long one good answer is served before the status page is asked again. Kuma checks once a minute. */
  freshMs: 60_000,
  /** After a failure, how long before the status page is asked again. */
  retryMs: 30_000,
} as const

/** Why the status page's answer was not used. Our own words only: nothing it sent is repeated. */
class Unusable extends Error {}

/** The body, as text, if it is no bigger than the limit; the rest is never read. */
async function readCapped(response: Response, maxBytes: number): Promise<string> {
  const declared = Number(response.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) {
    await response.body?.cancel().catch(() => {})
    throw new Unusable('it was too large')
  }
  if (!response.body) throw new Unusable('it was empty')
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel().catch(() => {})
      throw new Unusable('it was too large')
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Unusable('it was not text')
  }
}

async function readJson(url: string, fetchImpl: typeof fetch, signal: AbortSignal, timeoutMs: number): Promise<unknown> {
  const late = `it did not answer within ${timeoutMs / 1000} seconds`
  let response: Response
  try {
    response = await fetchImpl(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'wslatl-site' },
      redirect: 'error',
      cache: 'no-store',
      signal,
    })
  } catch {
    // A redirect lands here too: it is refused, never followed.
    throw new Unusable(signal.aborted ? late : 'it could not be reached')
  }
  if (response.status !== 200) {
    await response.body?.cancel().catch(() => {})
    throw new Unusable(`it answered ${response.status}`)
  }
  if (!/^application\/json\s*(;|$)/i.test(response.headers.get('content-type') ?? '')) {
    await response.body?.cancel().catch(() => {})
    throw new Unusable('it did not answer with JSON')
  }
  let text: string
  try {
    text = await readCapped(response, limits.maxBytes)
  } catch (error) {
    if (error instanceof Unusable) throw error
    throw new Unusable(signal.aborted ? late : 'the answer broke off')
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Unusable('it was not valid JSON')
  }
}

export interface LiveStatusSource {
  /** The live status to show now, from the cache when it is fresh. Never throws. */
  current(): Promise<LiveStatus>
  /** Drops everything kept, as a restart of the server would. For tests. */
  forget(): void
}

export interface SourceOptions {
  /** What asks the status page. The global fetch, looked up on each call. */
  fetch?: typeof fetch
  /** The clock, in ms since 1970. */
  now?: () => number
  /** Where a problem is reported, once per run of failures. */
  warn?: (message: string) => void
  /** The status page's address, config/links.json's by default. */
  url?: string
  /** For both requests together. limits.timeoutMs by default. */
  timeoutMs?: number
}

/** The status page reader with its cache. The route uses the one below; tests make their own. */
export function createLiveStatusSource(options: SourceOptions = {}): LiveStatusSource {
  const fetchImpl: typeof fetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init))
  const now = options.now ?? Date.now
  const warn = options.warn ?? ((message: string) => console.warn(message))
  const origin = statusPageOrigin(options.url)
  const timeoutMs = options.timeoutMs ?? limits.timeoutMs

  let cached: { status: LiveStatus; until: number } | undefined
  let lastGood: LiveStatus | undefined
  let inFlight: Promise<LiveStatus> | undefined
  let failing = false

  /** The last good answer, while its oldest check is still recent enough to show. */
  function stillGood(at: number): LiveStatus | undefined {
    const checked = lastGood?.checkedAt ? Date.parse(lastGood.checkedAt) : Number.NaN
    return lastGood && at - checked <= maxCheckAgeMs ? lastGood : undefined
  }

  async function ask(): Promise<LiveStatus> {
    if (!origin) throw new Unusable('its address in config/links.json is not an https address on wslatl.com')
    // Either the timeout or the first failure ends both requests: once one
    // answer is unusable, nothing more of the other is read.
    const done = new AbortController()
    const signal = AbortSignal.any([done.signal, AbortSignal.timeout(timeoutMs)])
    let page: unknown
    let heartbeats: unknown
    try {
      ;[page, heartbeats] = await Promise.all([
        readJson(`${origin}/api/status-page/${slug}`, fetchImpl, signal, timeoutMs),
        readJson(`${origin}/api/status-page/heartbeat/${slug}`, fetchImpl, signal, timeoutMs),
      ])
    } finally {
      done.abort()
    }
    const status = statusFromKuma(page, heartbeats, now())
    if (!status) throw new Unusable('its answer was not the shape Uptime Kuma gives')
    if (!hasLiveData(status)) throw new Unusable('it had no recent check for any location')
    return status
  }

  async function refresh(): Promise<LiveStatus> {
    try {
      const status = await ask()
      lastGood = status
      cached = { status, until: now() + limits.freshMs }
      if (failing) warn('Live status: the status page answers again.')
      failing = false
      return status
    } catch (error) {
      const reason = error instanceof Unusable ? error.message : 'something went wrong reading it'
      if (!failing) warn(`Live status: the status page could not be used (${reason}). The home page shows its prices without live status until it can.`)
      failing = true
      const at = now()
      const status = stillGood(at) ?? unknownStatus()
      cached = { status, until: at + limits.retryMs }
      return status
    }
  }

  return {
    current() {
      if (cached && now() < cached.until) return Promise.resolve(cached.status)
      inFlight ??= refresh().finally(() => {
        inFlight = undefined
      })
      return inFlight
    },
    forget() {
      cached = undefined
      lastGood = undefined
      inFlight = undefined
      failing = false
    },
  }
}

/** The one the route serves from, for as long as the server runs. */
export const liveStatus = createLiveStatusSource()

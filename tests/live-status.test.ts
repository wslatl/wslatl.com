import { existsSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { rootFiles } from '@/i18n/routing'
import { maxCheckAgeMs, parseCheckTime, statusFromKuma } from '@/lib/live-status/kuma'
import { hasLiveData, liveStatusPath, loadLiveStatus, readLiveStatus, unknownStatus, type LiveStatus } from '@/lib/live-status/snapshot'
import { createLiveStatusSource, limits, statusPageOrigin, type SourceOptions } from '@/lib/live-status/source'
import { copyOf, DOWN, kumaHeartbeats, kumaPage, kumaTime, MAINTENANCE, monitorsAt, now, PENDING, UP } from './fixtures/kuma'

/**
 * The live panel's data, from the status page to the browser: how Kuma's
 * two answers become a state per location, how the server reads them
 * (cached, short, capped, on our own host only), and every way the data can
 * be missing. Whatever goes wrong, the answer is a state from our own list,
 * or unknown, and never anything the status page wrote.
 */
vi.mock('server-only', () => ({}))

const pageUrl = 'https://status.wslatl.com/api/status-page/wslatl'
const beatsUrl = 'https://status.wslatl.com/api/status-page/heartbeat/wslatl'
const lastCheck = new Date(now).toISOString()

/** The states from the status page's two answers, at `at`. */
const fromKuma = (beats: unknown, page: unknown = kumaPage, at = now) => statusFromKuma(page, beats, at)

/** Every server at a location down on its last check, the rest up. */
const downAt = (location: keyof typeof monitorsAt) => (id: number) => ((monitorsAt[location] as readonly number[]).includes(id) ? DOWN : UP)

/** The same answer, with these monitors no longer checked since six minutes ago. */
function unchecked(beats: ReturnType<typeof kumaHeartbeats>, ids: number[]) {
  const old = kumaHeartbeats(now - maxCheckAgeMs - 60_000).heartbeatList
  for (const id of ids) beats.heartbeatList[String(id)] = old[String(id)]
  return beats
}

/** A fetch that answers every request the same way. */
const answering = (respond: () => Response | Promise<Response>) => vi.fn<typeof fetch>(async () => respond())

describe('reading a check time', () => {
  it('reads Kuma\'s own, which is UTC with no zone', () => {
    expect(parseCheckTime('2026-11-14 21:03:37')).toBe(now)
    expect(parseCheckTime('2026-11-14 21:03:37.123')).toBe(now + 123)
  })

  it('reads ISO 8601 with a zone too', () => {
    expect(parseCheckTime('2026-11-14T21:03:37Z')).toBe(now)
    expect(parseCheckTime('2026-11-14T23:03:37+02:00')).toBe(now)
  })

  it('reads nothing else', () => {
    for (const text of ['', 'yesterday', '2026-11-14', '21:03:37', '2026-13-45 99:99:99', '2026-11-14 21:03:37 PM', `2026-11-14 21:03:37${'0'.repeat(100)}`, 1, null, {}, []]) {
      expect(parseCheckTime(text), String(text)).toBeNull()
    }
  })
})

describe('the states from the status page', () => {
  it('shows every location up when every server there answered its last check', () => {
    expect(fromKuma(kumaHeartbeats())).toEqual({ checkedAt: lastCheck, locations: { 'los-angeles': 'up', 'new-york': 'up' } })
  })

  it('takes the oldest of the last checks as the time, so every state is at least that recent', () => {
    const beats = kumaHeartbeats()
    // LA-1's last check ran 40 seconds before the others.
    beats.heartbeatList['1'].at(-1)!.time = kumaTime(now - 40_000)
    expect(fromKuma(beats)?.checkedAt).toBe(new Date(now - 40_000).toISOString())
  })

  it('uses the last check of each server, in whatever order the list comes', () => {
    const beats = kumaHeartbeats()
    beats.heartbeatList['5'].reverse()
    beats.heartbeatList['5'][0].status = DOWN
    expect(fromKuma(beats)?.locations['new-york']).toBe('partial')
  })

  it('follows Kuma\'s own rule: some servers down is partial, all down is down', () => {
    expect(fromKuma(kumaHeartbeats(now, (id) => (id === 1 ? DOWN : UP)))?.locations).toEqual({ 'los-angeles': 'partial', 'new-york': 'up' })
    expect(fromKuma(kumaHeartbeats(now, downAt('los-angeles')))?.locations).toEqual({ 'los-angeles': 'down', 'new-york': 'up' })
  })

  it('counts a check being retried (pending) as not up, as Kuma does', () => {
    expect(fromKuma(kumaHeartbeats(now, (id) => (id === 6 ? PENDING : UP)))?.locations['new-york']).toBe('partial')
  })

  it('counts a state Kuma may add later as not up either', () => {
    expect(fromKuma(kumaHeartbeats(now, (id) => (id === 3 ? 9 : UP)))?.locations['los-angeles']).toBe('partial')
  })

  it('shows maintenance when the status page has a server there in a maintenance window', () => {
    expect(fromKuma(kumaHeartbeats(now, (id) => (id === 5 ? MAINTENANCE : id === 6 ? DOWN : UP)))?.locations['new-york']).toBe('maintenance')
  })

  it('counts the group\'s own monitor with the servers, as the status page lists it', () => {
    expect(fromKuma(kumaHeartbeats(now, (id) => (id === 4 ? DOWN : UP)))?.locations['new-york']).toBe('partial')
  })

  it('finds a group whatever its spacing or case', () => {
    const page = copyOf(kumaPage)
    page.publicGroupList[2].name = '  los   ANGELES \n'
    expect(fromKuma(kumaHeartbeats(), page)?.locations['los-angeles']).toBe('up')
  })

  it('leaves a location unknown when its group is gone or renamed on the status page', () => {
    const page = copyOf(kumaPage)
    page.publicGroupList[1].name = 'New York'
    expect(fromKuma(kumaHeartbeats(), page)?.locations).toEqual({ 'los-angeles': 'up', 'new-york': 'unknown' })
    const empty = copyOf(kumaPage)
    empty.publicGroupList[2].monitorList = []
    expect(fromKuma(kumaHeartbeats(), empty)?.locations['los-angeles']).toBe('unknown')
  })

  it('leaves out a server that has never been checked, as Kuma does', () => {
    const beats = kumaHeartbeats()
    beats.heartbeatList['3'] = []
    expect(fromKuma(beats)?.locations['los-angeles']).toBe('up')
    delete (beats.heartbeatList as Record<string, unknown>)['1']
    expect(fromKuma(beats)?.locations['los-angeles']).toBe('up')
  })

  describe('late data', () => {
    it('is unknown once the last checks are older than five minutes: checks have stopped', () => {
      expect(fromKuma(kumaHeartbeats(now - maxCheckAgeMs - 1000))).toEqual(unknownStatus())
      // Just inside the limit, they still count.
      expect(fromKuma(kumaHeartbeats(now - maxCheckAgeMs + 1000))?.locations['los-angeles']).toBe('up')
    })

    it('makes a location unknown when one of its servers has gone unchecked, rather than up', () => {
      const status = fromKuma(unchecked(kumaHeartbeats(), [3]))
      expect(status?.locations).toEqual({ 'los-angeles': 'unknown', 'new-york': 'up' })
      // The time is the oldest check behind a state that is shown.
      expect(status?.checkedAt).toBe(lastCheck)
    })

    it('still shows a server that is down beside ones gone unchecked, as partial: it is not known that all are', () => {
      const beats = unchecked(kumaHeartbeats(now, (id) => (id === 1 ? DOWN : UP)), [2, 3])
      expect(fromKuma(beats)?.locations['los-angeles']).toBe('partial')
    })

    it('does not take a check from the future as a recent one', () => {
      expect(fromKuma(kumaHeartbeats(now + maxCheckAgeMs + 60_000))).toEqual(unknownStatus())
    })
  })

  describe('an answer that is not Kuma\'s', () => {
    it('gives nothing at all for the wrong shapes', () => {
      for (const page of [null, 'x', 42, [], {}, { publicGroupList: {} }, { publicGroupList: 'x' }]) {
        expect(fromKuma(kumaHeartbeats(), page), JSON.stringify(page)).toBeNull()
      }
      for (const beats of [null, 'x', [], {}, { heartbeatList: [] }, { heartbeatList: 'x' }]) {
        expect(fromKuma(beats), JSON.stringify(beats)).toBeNull()
      }
    })

    it('skips entries of the wrong shape rather than failing on them', () => {
      const page = copyOf(kumaPage) as { publicGroupList: unknown[] }
      page.publicGroupList.push(null, 'x', { name: 7 }, { name: 'Los Angeles', monitorList: 'x' }, { name: 'Los Angeles', monitorList: [null, { id: '1' }, { id: 1.5 }] })
      const beats = kumaHeartbeats() as { heartbeatList: Record<string, unknown[]> }
      beats.heartbeatList['1'].push(null, 'x', { status: '0', time: kumaTime(now + 1000) }, { status: DOWN, time: 'later' })
      expect(fromKuma(beats, page)?.locations).toEqual({ 'los-angeles': 'up', 'new-york': 'up' })
    })

    it('reads nothing from keys that are not monitor ids', () => {
      const beats = JSON.parse(`{"heartbeatList": {"__proto__": [{"status": 0, "time": "${kumaTime(now)}"}], "constructor": [], "toString": []}}`)
      expect(fromKuma(beats)).toEqual(unknownStatus())
      expect(({} as Record<string, unknown>).status).toBeUndefined()
    })

    it('passes on none of the status page\'s own words', () => {
      const canary = 'canary-<script>alert(1)</script>'
      const page = copyOf(kumaPage)
      page.config.title = canary
      for (const group of page.publicGroupList) for (const monitor of group.monitorList) monitor.name = canary
      const beats = kumaHeartbeats(now, () => DOWN)
      for (const list of Object.values(beats.heartbeatList)) for (const beat of list) beat.msg = canary
      expect(JSON.stringify(fromKuma(beats, page))).not.toContain('canary')
    })
  })
})

describe('the answer the browser reads', () => {
  const good: LiveStatus = { checkedAt: lastCheck, locations: { 'los-angeles': 'up', 'new-york': 'partial' } }

  it('takes a well-formed answer as it is', () => {
    expect(readLiveStatus(JSON.parse(JSON.stringify(good)))).toEqual(good)
    expect(readLiveStatus(unknownStatus())).toEqual(unknownStatus())
  })

  it('counts a location missing from it as unknown, and leaves out anything else it holds', () => {
    expect(readLiveStatus({ checkedAt: lastCheck, locations: { 'los-angeles': 'up', chicago: 'up', __proto__: 'up' }, extra: 1 })).toEqual({
      checkedAt: lastCheck,
      locations: { 'los-angeles': 'up', 'new-york': 'unknown' },
    })
  })

  it('refuses anything else, rather than showing part of it', () => {
    for (const value of [
      null,
      'up',
      [],
      { locations: good.locations },
      { checkedAt: 'yesterday', locations: good.locations },
      { checkedAt: '2026-11-14 21:03:37', locations: good.locations },
      { checkedAt: 12, locations: good.locations },
      { checkedAt: lastCheck, locations: [] },
      { checkedAt: lastCheck, locations: { 'los-angeles': 'fine' } },
      { checkedAt: lastCheck, locations: { 'los-angeles': 1 } },
      // A state with no time behind it.
      { checkedAt: null, locations: { 'los-angeles': 'up' } },
    ]) {
      expect(readLiveStatus(value), JSON.stringify(value)).toBeNull()
    }
  })

  describe('from the browser', () => {
    it('asks this site\'s own route, and nothing else', async () => {
      const fetchImpl = answering(() => Response.json(good))
      expect(await loadLiveStatus(fetchImpl)).toEqual(good)
      expect(fetchImpl).toHaveBeenCalledTimes(1)
      expect(fetchImpl.mock.calls[0][0]).toBe(liveStatusPath)
      // The route that answers it, served at the root with no language.
      expect(existsSync(join(__dirname, '..', 'app', liveStatusPath.slice(1), 'route.ts'))).toBe(true)
      expect(rootFiles).toContain(liveStatusPath)
    })

    it('gives nothing when the route fails, answers wrongly or not at all', async () => {
      const cases: [string, typeof fetch][] = [
        ['an error status', answering(() => new Response('{}', { status: 503 }))],
        ['not JSON', answering(() => new Response('<html>Bad gateway</html>', { status: 200 }))],
        ['the wrong shape', answering(() => Response.json({ checkedAt: 'x' }))],
        ['no network', vi.fn<typeof fetch>(async () => Promise.reject(new TypeError('Failed to fetch')))],
      ]
      for (const [what, fetchImpl] of cases) expect(await loadLiveStatus(fetchImpl), what).toBeNull()
    })

    it('stops waiting after its timeout', async () => {
      const never = vi.fn<typeof fetch>(
        (_input: Parameters<typeof fetch>[0], init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))),
      )
      const started = Date.now()
      expect(await loadLiveStatus(never, 50)).toBeNull()
      expect(Date.now() - started).toBeLessThan(2000)
    })
  })
})

describe('the status page\'s address', () => {
  it('is the one config/links.json sends /status to', () => {
    expect(statusPageOrigin()).toBe('https://status.wslatl.com')
  })

  it('must be ours, on HTTPS, with nothing else in it, or live status stays off', () => {
    expect(statusPageOrigin('https://status.wslatl.com/status/wslatl')).toBe('https://status.wslatl.com')
    expect(statusPageOrigin('https://wslatl.com')).toBe('https://wslatl.com')
    for (const url of [
      'http://status.wslatl.com',
      'https://evil.example',
      'https://wslatl.com.evil.example',
      'https://evilwslatl.com',
      'https://status.wslatl.com:8443',
      'https://user:pass@status.wslatl.com',
      'ftp://status.wslatl.com',
      'javascript:alert(1)',
      'status.wslatl.com',
      '',
    ]) {
      expect(statusPageOrigin(url), url).toBeNull()
    }
  })
})

/** A fake status page: answers each of the two addresses as told, and counts what it was asked. */
function statusPage(answer: (url: string, init?: RequestInit) => Response | Promise<Response> = defaultAnswer) {
  const calls: { url: string; init?: RequestInit }[] = []
  const fetchImpl = vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input)
    calls.push({ url, init })
    return answer(url, init)
  })
  return { fetchImpl: fetchImpl as unknown as typeof fetch, calls }
}

/** Kuma's own answers with this many KiB of spaces after them: valid JSON, so only their size can be refused. */
const padded = (kib: number) => (url: string) =>
  new Response(`${JSON.stringify(url === beatsUrl ? kumaHeartbeats() : kumaPage)}${' '.repeat(kib * 1024)}`, {
    headers: { 'Content-Type': 'application/json' },
  })

function defaultAnswer(url: string): Response {
  if (url === pageUrl) return Response.json(kumaPage)
  if (url === beatsUrl) return Response.json(kumaHeartbeats())
  return new Response('not here', { status: 404 })
}

/** A source on a clock the test moves, reporting its problems into a list. */
function source(fetchImpl: typeof fetch, options: Partial<SourceOptions> = {}) {
  const clock = { now }
  const warnings: string[] = []
  const live = createLiveStatusSource({ fetch: fetchImpl, now: () => clock.now, warn: (message) => warnings.push(message), ...options })
  return { live, clock, warnings }
}

const up = { checkedAt: lastCheck, locations: { 'los-angeles': 'up', 'new-york': 'up' } }

describe('reading the status page from the server', () => {
  it('asks only the two fixed addresses on the status page, refusing any redirect', async () => {
    const page = statusPage()
    expect(await source(page.fetchImpl).live.current()).toEqual(up)
    expect(page.calls.map((call) => call.url).toSorted()).toEqual([beatsUrl, pageUrl])
    for (const { init } of page.calls) {
      expect(init?.redirect).toBe('error')
      expect(init?.signal).toBeInstanceOf(AbortSignal)
      expect(init?.method ?? 'GET').toBe('GET')
      expect(init?.body).toBeUndefined()
    }
  })

  it('asks nothing at all when the address in config/links.json is not ours', async () => {
    const page = statusPage()
    const { live, warnings } = source(page.fetchImpl, { url: 'https://evil.example' })
    expect(await live.current()).toEqual(unknownStatus())
    expect(page.calls).toEqual([])
    expect(warnings.join('\n')).toMatch(/not an https address on wslatl\.com/)
  })

  it('answers everyone from one minute\'s cache, and asks again after it', async () => {
    const page = statusPage()
    const { live, clock } = source(page.fetchImpl)
    await live.current()
    clock.now += limits.freshMs - 1
    await live.current()
    expect(page.calls).toHaveLength(2)
    clock.now += 2
    await live.current()
    expect(page.calls).toHaveLength(4)
  })

  it('has one request in flight however many visitors arrive at once', async () => {
    const { promise: gate, resolve: release } = Promise.withResolvers<void>()
    const page = statusPage(async (url) => {
      await gate
      return defaultAnswer(url)
    })
    const { live } = source(page.fetchImpl)
    const answers = Array.from({ length: 50 }, () => live.current())
    release()
    expect(new Set((await Promise.all(answers)).map((answer) => JSON.stringify(answer))).size).toBe(1)
    expect(page.calls).toHaveLength(2)
  })

  describe('when the data is missing', () => {
    const missing: [string, (url: string, init?: RequestInit) => Response | Promise<Response>][] = [
      ['the status page is down', () => Promise.reject(new TypeError('fetch failed'))],
      ['it answers 502', () => new Response('<html>Bad gateway</html>', { status: 502, headers: { 'Content-Type': 'text/html' } })],
      ['it answers 404', () => new Response('{}', { status: 404, headers: { 'Content-Type': 'application/json' } })],
      ['it answers a redirect as a page', () => new Response(null, { status: 302, headers: { Location: 'https://evil.example/' } })],
      ['it answers with a page instead of JSON', () => new Response('<html>Just a moment...</html>', { status: 200, headers: { 'Content-Type': 'text/html' } })],
      ['its JSON is broken', () => new Response('{"publicGroupList": [', { status: 200, headers: { 'Content-Type': 'application/json' } })],
      ['its text is not UTF-8', () => new Response(new Uint8Array([0x7b, 0xff, 0xfe, 0x7d]), { status: 200, headers: { 'Content-Type': 'application/json' } })],
      ['its JSON is not Kuma\'s', () => Response.json({ hello: 'world' })],
      ['it has no recent checks', (url) => (url === beatsUrl ? Response.json(kumaHeartbeats(now - 3_600_000)) : Response.json(kumaPage))],
      ['one of the two answers fails', (url) => (url === beatsUrl ? Promise.reject(new TypeError('fetch failed')) : Response.json(kumaPage))],
    ]

    for (const [what, answer] of missing) {
      it(`shows every location unknown when ${what}`, async () => {
        const { live, warnings } = source(statusPage(answer).fetchImpl)
        const status = await live.current()
        expect(status).toEqual(unknownStatus())
        expect(hasLiveData(status)).toBe(false)
        expect(warnings).toHaveLength(1)
        // Our own words: nothing the status page sent is repeated.
        expect(warnings[0]).not.toMatch(/evil|moment|Bad gateway|hello|world/)
      })
    }

    it('takes an answer of up to half a megabyte, and drops a good one that is bigger', async () => {
      expect(await source(statusPage(padded(440)).fetchImpl).live.current()).toEqual(up)
      expect(await source(statusPage(padded(520)).fetchImpl).live.current()).toEqual(unknownStatus())
    })

    it('drops an answer bigger than the limit as soon as it says so, before reading it', async () => {
      const cancel = vi.fn<() => void>()
      const page = statusPage(() => {
        const body = new ReadableStream<Uint8Array>({ cancel })
        return new Response(body, { headers: { 'Content-Type': 'application/json', 'Content-Length': String(limits.maxBytes + 1) } })
      })
      const { live, warnings } = source(page.fetchImpl)
      expect(await live.current()).toEqual(unknownStatus())
      expect(warnings[0]).toMatch(/too large/)
      expect(cancel).toHaveBeenCalled()
    })

    it('stops reading an answer that grows past the limit, without its size given', async () => {
      let sent = 0
      const cancel = vi.fn<() => void>()
      const page = statusPage(() => {
        const endless = new ReadableStream<Uint8Array>({
          pull(controller) {
            sent += 64 * 1024
            controller.enqueue(new Uint8Array(64 * 1024).fill(0x20))
          },
          cancel,
        })
        return new Response(endless, { headers: { 'Content-Type': 'application/json' } })
      })
      const { live, warnings } = source(page.fetchImpl)
      expect(await live.current()).toEqual(unknownStatus())
      expect(warnings[0]).toMatch(/too large/)
      expect(cancel).toHaveBeenCalled()
      // Both answers stopped at half a megabyte, give or take what was
      // already on its way: well short of two megabytes between them.
      expect(sent).toBeLessThan(2 * 1024 * 1024)
    })

    it('stops waiting after the timeout, for an answer that never starts', async () => {
      const page = statusPage(
        (_url, init) => new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))),
      )
      const { live, warnings } = source(page.fetchImpl, { timeoutMs: 50 })
      const started = Date.now()
      expect(await live.current()).toEqual(unknownStatus())
      expect(Date.now() - started).toBeLessThan(2000)
      expect(warnings[0]).toMatch(/did not answer within 0\.05 seconds/)
    })

    it('stops waiting after the timeout, for an answer that starts and never ends', async () => {
      const page = statusPage((_url, init) => {
        const stalled = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"publicGroupList": ['))
            init?.signal?.addEventListener('abort', () => controller.error(init.signal?.reason))
          },
        })
        return new Response(stalled, { headers: { 'Content-Type': 'application/json' } })
      })
      const { live } = source(page.fetchImpl, { timeoutMs: 50 })
      const started = Date.now()
      expect(await live.current()).toEqual(unknownStatus())
      expect(Date.now() - started).toBeLessThan(2000)
    })

    it('keeps the last good answer while its checks are recent, then shows nothing', async () => {
      let down = false
      const page = statusPage((url) => (down ? Promise.reject(new TypeError('fetch failed')) : defaultAnswer(url)))
      const { live, clock, warnings } = source(page.fetchImpl)
      expect(await live.current()).toEqual(up)
      down = true
      clock.now += limits.freshMs + 1
      expect(await live.current()).toEqual(up)
      clock.now = now + maxCheckAgeMs + 1
      expect(await live.current()).toEqual(unknownStatus())
      // Said once for the whole run of failures.
      expect(warnings).toHaveLength(1)
    })

    it('waits before asking again after a failure, then says when it answers again', async () => {
      let down = true
      const page = statusPage((url) => (down ? Promise.reject(new TypeError('fetch failed')) : defaultAnswer(url)))
      const { live, clock, warnings } = source(page.fetchImpl)
      await live.current()
      expect(page.calls).toHaveLength(2)
      clock.now += limits.retryMs - 1
      await live.current()
      expect(page.calls).toHaveLength(2)
      down = false
      clock.now += 2
      expect(await live.current()).toEqual({ ...up, checkedAt: lastCheck })
      expect(warnings).toEqual([expect.stringMatching(/could not be used/), 'Live status: the status page answers again.'])
    })
  })

  it('never follows a redirect with the real fetch, even one to its own host', async () => {
    // A real server, reached through the real fetch with what the source
    // passes it: the redirect is refused, and its target is never asked.
    let asked: string[] = []
    const server: Server = createServer((request, response) => {
      asked.push(request.url ?? '')
      response.writeHead(302, { Location: `http://127.0.0.1:${(server.address() as AddressInfo).port}/elsewhere` }).end()
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    try {
      const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
      const throughServer: typeof fetch = (input, init) => fetch(`${base}${new URL(String(input)).pathname}`, init)
      const { live } = source(throughServer)
      expect(await live.current()).toEqual(unknownStatus())
      expect(asked.toSorted()).toEqual(['/api/status-page/heartbeat/wslatl', '/api/status-page/wslatl'])
    } finally {
      asked = []
      await new Promise((resolve) => server.close(resolve))
    }
  })
})

describe('forgetting', () => {
  it('starts over, as a restart of the server would', async () => {
    const page = statusPage()
    const { live } = source(page.fetchImpl)
    await live.current()
    live.forget()
    await live.current()
    expect(page.calls).toHaveLength(4)
  })
})

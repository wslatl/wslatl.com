import { describe, expect, it, vi } from 'vitest'
import { releaseOverview } from '@/lib/admin/github'

vi.mock('server-only', () => ({}))

const gh = { token: 'secret-token-value', repo: 'wslatl/wslatl.com', apiUrl: 'https://api.github.com' }
const repo = '/repos/wslatl/wslatl.com'

function rawRelease(tag: string, extra: Record<string, unknown> = {}) {
  return {
    tag_name: tag,
    name: `Release ${tag}`,
    body: `## What's Changed\n* Something <b>bold</b> for ${tag}`,
    html_url: `https://github.com/wslatl/wslatl.com/releases/tag/${tag}`,
    published_at: '2026-10-31T12:00:00Z',
    draft: false,
    prerelease: false,
    ...extra,
  }
}

function fakeGitHub(routes: Record<string, { status?: number; body?: unknown; headers?: Record<string, string> }>) {
  const calls: { url: string; init?: RequestInit }[] = []
  const fetchImpl = vi.fn<typeof fetch>(async (url, init) => {
    const path = String(url).replace('https://api.github.com', '')
    calls.push({ url: path, init })
    const route = routes[path]
    if (!route) return new Response('{"message":"Not Found"}', { status: 404 })
    return new Response(JSON.stringify(route.body ?? {}), { status: route.status ?? 200, headers: route.headers })
  })
  return { fetchImpl, calls }
}

const withRepo = { [repo]: { body: { full_name: 'wslatl/wslatl.com' } } }

describe('what the dashboard asks GitHub', () => {
  it('sends the token and the API version, and never caches', async () => {
    const { fetchImpl, calls } = fakeGitHub({ [`${repo}/releases/latest`]: { body: rawRelease('v1.2.0') } })
    await releaseOverview(gh, null, fetchImpl)
    const headers = new Headers(calls[0].init?.headers)
    expect(headers.get('authorization')).toBe('Bearer secret-token-value')
    expect(headers.get('x-github-api-version')).toBe('2022-11-28')
    expect(headers.get('accept')).toBe('application/vnd.github+json')
    expect(headers.get('user-agent')).toBeTruthy()
    expect(calls[0].init?.cache).toBe('no-store')
  })

  it('offers the latest release over a folder uploaded by hand, with its notes as plain text', async () => {
    const { fetchImpl, calls } = fakeGitHub({ [`${repo}/releases/latest`]: { body: rawRelease('v1.2.0') } })
    const overview = await releaseOverview(gh, null, fetchImpl)
    expect(overview).toEqual({
      status: 'update',
      installed: null,
      latest: {
        tag: 'v1.2.0',
        name: 'Release v1.2.0',
        publishedAt: '2026-10-31T12:00:00Z',
        url: 'https://github.com/wslatl/wslatl.com/releases/tag/v1.2.0',
        notes: "## What's Changed\n* Something <b>bold</b> for v1.2.0",
      },
    })
    // Nothing reads a branch any more.
    expect(calls.map((call) => call.url)).toEqual([`${repo}/releases/latest`])
  })

  it('offers only a release newer than the installed one, comparing versions as numbers', async () => {
    const cases: [string, string, string][] = [
      ['v1.10.0', 'v1.9.0', 'update'],
      ['v1.2.0', 'v1.2.0', 'up-to-date'],
      ['v1.1.0', 'v1.2.0', 'older'],
    ]
    for (const [latest, installed, status] of cases) {
      const { fetchImpl, calls } = fakeGitHub({
        [`${repo}/releases/latest`]: { body: rawRelease(latest) },
        [`${repo}/releases/tags/${installed}`]: { body: rawRelease(installed) },
      })
      const overview = await releaseOverview(gh, installed, fetchImpl)
      expect(overview.status, `${latest} over ${installed}`).toBe(status)
      expect(overview.installed?.tag).toBe(installed)
      expect(calls.map((call) => call.url)).toContain(`${repo}/releases/tags/${installed}`)
    }
  })

  it('never offers the release a crash took back out, but does offer the fix published after it', async () => {
    const { fetchImpl } = fakeGitHub({
      [`${repo}/releases/latest`]: { body: rawRelease('v1.1.0') },
      [`${repo}/releases/tags/v1.0.0`]: { body: rawRelease('v1.0.0') },
    })
    expect((await releaseOverview(gh, 'v1.0.0', fetchImpl, 10_000, 'v1.1.0')).status).toBe('withdrawn')
    const fixed = fakeGitHub({
      [`${repo}/releases/latest`]: { body: rawRelease('v1.1.1') },
      [`${repo}/releases/tags/v1.0.0`]: { body: rawRelease('v1.0.0') },
    })
    expect((await releaseOverview(gh, 'v1.0.0', fixed.fetchImpl, 10_000, 'v1.1.0')).status).toBe('update')
  })

  it('says no releases are published yet, rather than failing, when there are none', async () => {
    const { fetchImpl } = fakeGitHub(withRepo)
    expect(await releaseOverview(gh, null, fetchImpl)).toEqual({ status: 'no-releases', latest: null, installed: null })
  })

  it('never offers a draft or a pre-release', async () => {
    for (const extra of [{ draft: true }, { prerelease: true }]) {
      const { fetchImpl } = fakeGitHub({ ...withRepo, [`${repo}/releases/latest`]: { body: rawRelease('v1.2.0', extra) } })
      const overview = await releaseOverview(gh, null, fetchImpl)
      expect(overview.status, JSON.stringify(extra)).toBe('no-releases')
      expect(overview.latest).toBeNull()
    }
  })

  it('refuses a release whose tag is not a version', async () => {
    for (const tag of ['1.2.0', 'v1.2', 'v1.2.0-beta.1', 'latest']) {
      const { fetchImpl } = fakeGitHub({ [`${repo}/releases/latest`]: { body: rawRelease(tag) } })
      const overview = await releaseOverview(gh, 'v1.0.0', fetchImpl)
      expect(overview.status, tag).toBe('bad-tag')
    }
  })

  it('escapes the tag in the address', async () => {
    const { fetchImpl, calls } = fakeGitHub({ [`${repo}/releases/latest`]: { body: rawRelease('v1.2.0') } })
    await releaseOverview(gh, 'v1.0.0', fetchImpl)
    expect(calls.map((call) => call.url)).toContain(`${repo}/releases/tags/v1.0.0`)
  })

  it('turns GitHub errors into something to act on, without the token', async () => {
    const cases: [number, Record<string, string>, RegExp][] = [
      [401, {}, /refused the token.*GITHUB_TOKEN/],
      [403, { 'x-ratelimit-remaining': '0' }, /rate limit/],
      [403, {}, /Contents/],
      [500, {}, /GitHub answered 500/],
    ]
    for (const [status, headers, message] of cases) {
      const { fetchImpl } = fakeGitHub({ [`${repo}/releases/latest`]: { status, headers } })
      const error = await releaseOverview(gh, null, fetchImpl).catch((e: Error) => e)
      expect(error, String(status)).toBeInstanceOf(Error)
      expect((error as Error).message).toMatch(message)
      expect((error as Error).message).not.toContain(gh.token)
    }
    // No releases and no repository either: that one is an error.
    const { fetchImpl } = fakeGitHub({})
    const error = await releaseOverview(gh, null, fetchImpl).catch((e: Error) => e)
    expect((error as Error).message).toMatch(/GITHUB_REPO/)
  })

  it('gives up on a GitHub that does not answer', async () => {
    const hanging = vi.fn<typeof fetch>(async (_url, init) => {
      await new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))
      return new Response()
    })
    const error = await releaseOverview(gh, null, hanging, 50).catch((e: Error) => e)
    expect((error as Error).message).toMatch(/did not answer/)
  })
})

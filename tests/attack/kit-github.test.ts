import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ReleaseNotes, safeHref } from '@/platform/admin/components/release-notes'
import { Updates } from '@/platform/admin/components/updates'
import { releaseOverview } from '@/platform/admin/server/github'

/**
 * Canaries for what the kit's admin shows from GitHub on the Updates page
 * (platform/admin/server/github.ts, components/updates.tsx and
 * components/release-notes.tsx). The page holds an admin session, so the
 * token never shows in what GitHub's errors become, a GitHub that stops
 * answering cannot hang it, it never offers a draft or a release a crash
 * took back out, and release notes, which anyone who can publish a release
 * writes, never become a script, a link that keeps window.opener, or a
 * parser that a note can stall.
 */
vi.mock('server-only', () => ({}))

const token = 'canary-admin-github-token-0f3c9a71d2'
const repo = 'wslatl/wslatl.com'
const gh = { token, repo, apiUrl: 'https://api.github.com' }
const base = `/repos/${repo}`

function rawRelease(tag: string, extra: Record<string, unknown> = {}) {
  return {
    tag_name: tag,
    name: tag,
    body: `Notes for ${tag}`,
    html_url: `https://github.com/${repo}/releases/tag/${tag}`,
    published_at: '2026-11-01T12:00:00Z',
    draft: false,
    prerelease: false,
    ...extra,
  }
}

type Route = { status?: number; body?: unknown; headers?: Record<string, string> }

/** A stand-in for GitHub's API that answers from a table, as fetch would. */
function fakeFetch(routes: Record<string, Route>): typeof fetch {
  return (async (url: string | URL | Request) => {
    const route = routes[String(url).replace(gh.apiUrl, '')]
    if (!route) return new Response('{"message":"Not Found"}', { status: 404 })
    return new Response(JSON.stringify(route.body ?? {}), { status: route.status ?? 200, headers: route.headers })
  }) as typeof fetch
}

const failure = (promise: Promise<unknown>) => promise.then(() => 'no error', (error: Error) => error.message)

describe("GitHub's errors", () => {
  it('never carry the token, whatever GitHub answers with', async () => {
    const headerSets: Record<string, string>[] = [{}, { 'x-ratelimit-remaining': '0' }, { 'x-echo': token, 'www-authenticate': `Bearer ${token}` }]
    for (const status of [400, 401, 403, 404, 409, 422, 429, 500, 502, 503]) {
      for (const headers of headerSets) {
        const echoed: Route = { status, headers, body: { message: `Bad credentials: Bearer ${token}`, documentation_url: `https://docs.github.com/?token=${token}` } }
        const message = await failure(releaseOverview(gh, 'v1.0.0', fakeFetch({ [`${base}/releases/latest`]: echoed, [`${base}/releases/tags/v1.0.0`]: echoed, [base]: echoed })))
        expect(message, `${status} ${JSON.stringify(headers)}`).not.toBe('no error')
        expect(message.includes(token), `${status}: ${message}`).toBe(false)
      }
    }
  })

  it('never carry the token when fetch itself fails and says why', async () => {
    const broken = (async () => {
      throw new TypeError(`fetch failed: Authorization: Bearer ${token}`, { cause: new Error(token) })
    }) as typeof fetch
    const message = await failure(releaseOverview(gh, null, broken))
    expect(message).toBe('Could not reach GitHub.')
  })

  it('never reach the page with the token in them', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kit-github-'))
    try {
      vi.stubEnv('UPDATER_DIR', dir)
      vi.stubEnv('SITE_RELEASE', 'v1.0.0')
      for (const status of [401, 403, 500]) {
        const html = renderToStaticMarkup(
          await Updates({ github: gh, fetchImpl: fakeFetch({ [`${base}/releases/latest`]: { status, body: { message: `Bad credentials: ${token}` } } }) }),
        )
        expect(html).toContain('Could not read GitHub')
        expect(html.includes(token), String(status)).toBe(false)
      }
    } finally {
      vi.unstubAllEnvs()
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('a GitHub that stops answering', () => {
  it('is given up on, rather than holding the page', async () => {
    // A server that takes the request and never answers it.
    const held: import('node:http').ServerResponse[] = []
    const server = createServer((_request, response) => {
      held.push(response)
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    const apiUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
    try {
      const started = Date.now()
      const outcome = await Promise.race([
        failure(releaseOverview({ ...gh, apiUrl }, null, fetch, 300)),
        new Promise<string>((resolve) => setTimeout(() => resolve('still waiting after 8 seconds'), 8000)),
      ])
      expect(outcome).toBe('GitHub did not answer within 0.3 seconds.')
      expect(Date.now() - started).toBeLessThan(5000)
    } finally {
      for (const response of held) response.destroy()
      server.closeAllConnections()
      server.close()
    }
  }, 15_000)
})

/** GitHub with the repository, the installed v1.0.0, and tag as the latest release. */
const latest = (tag: string, extra: Record<string, unknown> = {}): Record<string, Route> => ({
  [base]: { body: { full_name: repo } },
  [`${base}/releases/tags/v1.0.0`]: { body: rawRelease('v1.0.0') },
  [`${base}/releases/latest`]: { body: rawRelease(tag, extra) },
})

/** The Updates page as the server renders it, against that GitHub. */
const page = async (routes: Record<string, Route>) => renderToStaticMarkup(await Updates({ github: gh, fetchImpl: fakeFetch(routes) }))

describe('what the Updates page offers', () => {
  let dir = ''
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'kit-github-'))
    vi.stubEnv('UPDATER_DIR', dir)
    vi.stubEnv('SITE_RELEASE', 'v1.0.0')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    rmSync(dir, { recursive: true, force: true })
  })

  it('is never a draft or a pre-release', async () => {
    for (const extra of [{ draft: true }, { prerelease: true }]) {
      const overview = await releaseOverview(gh, 'v1.0.0', fakeFetch(latest('v1.2.0', extra)))
      expect(overview.status, JSON.stringify(extra)).toBe('no-releases')
      expect(overview.latest).toBeNull()
      const html = await page(latest('v1.2.0', extra))
      expect(html, JSON.stringify(extra)).not.toContain('Install v1.2.0')
      expect(html).not.toContain('Notes for v1.2.0')
    }
    // The canary's own check: an ordinary newer release is offered.
    expect(await page(latest('v1.2.0'))).toContain('Install v1.2.0')
  })

  it('is never a release a crash took back out, though the fix published after it is', async () => {
    writeFileSync(join(dir, 'state.json'), JSON.stringify({ status: 'rolled-back', withdrawn: ['v1.1.0'], log: [] }))
    const overview = await releaseOverview(gh, 'v1.0.0', fakeFetch(latest('v1.1.0')), 10_000, ['v1.1.0'])
    expect(overview.status).toBe('withdrawn')
    const html = await page(latest('v1.1.0'))
    expect(html).not.toContain('Install v1.1.0')
    expect(html).toContain('was taken back out')
    expect(await page(latest('v1.1.1'))).toContain('Install v1.1.1')
  })
})

const render = (markdown: string) => renderToStaticMarkup(createElement(ReleaseNotes, { markdown, repo }))
/** The HTML without classes or the screen-reader note on new-tab links. */
const outline = (html: string) => html.replace(/ class="[^"]*"/g, '').replaceAll('<span> (opens in a new tab)</span>', '')

/** Every tag in the HTML, with its attributes. */
function tags(html: string) {
  return [...html.matchAll(/<([a-z][a-z\d]*)([^>]*)>/g)].map(([, name, rest]) => ({
    name,
    attributes: Object.fromEntries([...rest.matchAll(/([^\s=/]+)(?:="([^"]*)")?/g)].map(([, attribute, value]) => [attribute, value ?? ''])),
  }))
}

const allowedTags = ['div', 'p', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'a', 'br', 'hr', 'span']
const allowedAttributes = ['class', 'href', 'target', 'rel', 'start']

/** What the renderer did not write itself: other elements or attributes, or a link that is not https, http or mailto. */
function problems(html: string): string[] {
  return tags(html).flatMap(({ name, attributes }) => [
    ...(allowedTags.includes(name) ? [] : [`<${name}>`]),
    ...Object.keys(attributes)
      .filter((attribute) => !allowedAttributes.includes(attribute))
      .map((attribute) => `${attribute} on <${name}>`),
    ...(name === 'a' && !/^(?:https?:\/\/|mailto:)/.test(attributes.href ?? '') ? [`href ${attributes.href}`] : []),
  ])
}

describe('release notes written to attack the page', () => {
  it('give no link to javascript:, data: or any other scheme, however it is spelled or encoded', () => {
    for (const attack of [
      '[x](javascript:alert(1))',
      '[x](JaVaScRiPt:alert(1))',
      '[x](javascript:alert`1`)',
      '[x]( javascript:alert(1))',
      '[x](java\tscript:alert(1))',
      '[x](java\u0000script:alert(1))',
      '[x](javascript&#58;alert(1))',
      '[x](javascript&colon;alert(1))',
      '[x](&#106;avascript:alert(1))',
      '[x](&#x6A;&#x61;vascript:alert(1))',
      '[x](%6Aavascript:alert(1))',
      '[x](\u0001javascript:alert(1))',
      '[x](data:text/html,<script>alert(1)</script>)',
      '[x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
      '[x](vbscript:msgbox(1))',
      '[x](file:///etc/passwd)',
      '[x](/admin/api/update)',
      '[x](//evil.example/)',
      '[x](\\\\evil.example)',
      '[x](https:\\\\evil.example)',
      '[x](https://example.com/" onmouseover="alert(1))',
      '[x](https://example.com/"><script>alert(1)</script>)',
      '![x](javascript:alert(1))',
      '![x](data:image/svg+xml,<svg onload=alert(1)>)',
    ]) {
      const html = render(attack)
      expect(html, attack).not.toContain('<a')
      expect(problems(html), attack).toEqual([])
      expect(outline(html), attack).toBe('<div><p>x</p></div>')
    }
    for (const address of ['javascript:alert(1)', ' javascript:alert(1)', 'java\nscript:alert(1)', 'JAVASCRIPT:alert(1)', '&#106;avascript:alert(1)', 'data:text/html,x', 'vbscript:x']) {
      expect(safeHref(address), JSON.stringify(address)).toBeNull()
    }
  })

  it('show raw HTML as the text it is', () => {
    for (const [attack, shown] of [
      ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;'],
      ['<img src=x onerror=alert(1)>', '&lt;img src=x onerror=alert(1)&gt;'],
      ['<a href="javascript:alert(1)">x</a>', '&lt;a href=&quot;javascript:alert(1)&quot;&gt;x&lt;/a&gt;'],
      ['**<b onclick="alert(1)">bold</b>**', '<strong>&lt;b onclick=&quot;alert(1)&quot;&gt;bold&lt;/b&gt;</strong>'],
    ]) {
      const html = render(attack)
      expect(outline(html), attack).toBe(`<div><p>${shown}</p></div>`)
      expect(problems(html), attack).toEqual([])
    }
  })

  it('open every web link in a new tab with noopener and noreferrer, since the page holds the session', () => {
    const html = render(['[a](https://example.com)', 'https://example.com/b', '[c](http://example.com)', '#5 @octocat', '[d](mailto:team@example.com)'].join(' '))
    const links = tags(html).filter((tag) => tag.name === 'a')
    expect(links.map((link) => link.attributes.href)).toEqual([
      'https://example.com/',
      'https://example.com/b',
      'http://example.com/',
      `https://github.com/${repo}/pull/5`,
      'https://github.com/octocat',
      'mailto:team@example.com',
    ])
    for (const link of links.slice(0, 5)) expect(link.attributes, link.attributes.href).toMatchObject({ target: '_blank', rel: 'noopener noreferrer' })
    expect(links[5].attributes.target).toBeUndefined()
  })

  it('stay quick on notes built to slow a parser down', () => {
    // 20,000 characters each, the most github.ts keeps of a release's notes,
    // made to send a naive parser back over the same text again and again.
    const hostile = [
      '*a '.repeat(7000),
      '_a '.repeat(7000),
      '**a '.repeat(5000),
      `*a${' *b'.repeat(6666)}`,
      'a* '.repeat(7000),
      '['.repeat(20_000),
      '[a]('.repeat(5000),
      '![x'.repeat(7000),
      '`'.repeat(20_000),
      '``a `'.repeat(4000),
      '#'.repeat(20_000),
      '@a'.repeat(10_000),
      'https://'.repeat(2500),
      `https://example.com/${'('.repeat(2000)}`,
      `https://example.com/${')'.repeat(2000)}`,
      '  - a\n'.repeat(3000),
      `- a\n${'      b\n'.repeat(2500)}`,
      `${'['.repeat(500)}x${']'.repeat(500)}(https://example.com)`,
      `${'*a _b '.repeat(50)}c${' d_ e*'.repeat(50)}`,
    ]
    const started = performance.now()
    for (const text of hostile) expect(problems(render(text)), text.slice(0, 20)).toEqual([])
    // About a fifth of a second for all of them. A parser that searches the
    // rest of the text again for every mark takes seconds on each of the first four.
    expect(performance.now() - started).toBeLessThan(5000)
  }, 30_000)

  it('render images nested as deep as a note allows, quickly and within the stack', () => {
    let nested = 'x'
    for (let depth = 0; depth < 4000; depth++) nested = `![${nested}]()`
    const started = performance.now()
    expect(problems(render(nested))).toEqual([])
    expect(performance.now() - started).toBeLessThan(5000)
  }, 30_000)
})

/** Every source file under folder, at any depth. */
function sourceFiles(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(?:tsx?|mjs|js)$/.test(name) ? [path] : []
  })
}

describe('the admin pages', () => {
  it('never hand React or the browser an HTML string', () => {
    const root = join(__dirname, '..', '..')
    // The kit's admin and this site's files that hand requests to it.
    const files = [join(root, 'platform', 'admin'), join(root, 'app', 'admin')].flatMap(sourceFiles)
    expect(files.length).toBeGreaterThan(20)
    for (const file of files) {
      expect(readFileSync(file, 'utf8'), relative(root, file)).not.toMatch(/dangerouslySetInnerHTML|__html|innerHTML|outerHTML|insertAdjacentHTML|createContextualFragment|document\.write/)
    }
  })
})

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { config, proxy } from '@/proxy'

const root = join(__dirname, '..')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

function post(path: string, headers: Record<string, string>, body: BodyInit = '[]') {
  return new NextRequest(`https://wslatl.com${path}`, { method: 'POST', headers, body })
}

function expectRefused(response: Response) {
  expect(response.status).toBe(405)
  expect(response.headers.get('allow')).toBe('GET, HEAD')
  expect(response.headers.get('x-middleware-next')).toBeNull()
  expect(response.headers.get('x-middleware-rewrite')).toBeNull()
}

describe('requests that are not reads', () => {
  it('turns away a request that names a Server Action, before Next looks it up', () => {
    for (const action of ['x', 'cachefn', '7f0123456789abcdef0123456789abcdef01234567']) {
      expectRefused(proxy(post('/', { 'Next-Action': action })))
    }
  })

  it('turns one away on any page, including one asking for an RSC payload', () => {
    expectRefused(proxy(post('/pricing?_rsc=abc', { 'Next-Action': 'cachefn', RSC: '1' })))
  })

  it('turns away a form post with no Next-Action header, which Next would render from scratch', () => {
    // Next treats any form-encoded POST as a possible Server Action: it skips
    // the static page and renders it per request, or answers a multipart one
    // with a logged 409.
    expectRefused(proxy(post('/', { 'Content-Type': 'application/x-www-form-urlencoded' }, 'a=1')))
    const form = new FormData()
    form.set('a', '1')
    expectRefused(proxy(post('/pricing', {}, form)))
  })

  it('turns away every other method, on pages and files alike', () => {
    for (const method of ['PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      for (const path of ['/', '/es/pricing', '/company.json', '/favicon.ico']) {
        expectRefused(proxy(new NextRequest(`https://wslatl.com${path}`, { method })))
      }
    }
  })

  it('still serves an ordinary request', () => {
    const page = proxy(new NextRequest('https://wslatl.com/pricing'))
    expect(page.status).toBe(200)
    expect(page.headers.get('x-middleware-rewrite')).toContain('/en/pricing')
    const head = proxy(new NextRequest('https://wslatl.com/pricing', { method: 'HEAD' }))
    expect(head.headers.get('x-middleware-rewrite')).toContain('/en/pricing')
  })

  it('is safe because the site has no Server Actions of its own', () => {
    // proxy.ts answers every POST with a 405. If the site ever needs a Server
    // Action, that rule has to change first.
    const withActions = ['app', 'components', 'lib', 'i18n', 'config', 'data', 'content']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => /^\s*['"]use server['"]/m.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(root.length + 1))
    expect(withActions).toEqual([])
  })

  it('is safe because the only route handler answers GET alone', () => {
    const handlers = sourceFiles(join(root, 'app')).filter((file) => /[\\/]route\.tsx?$/.test(file))
    expect(handlers.length).toBeGreaterThan(0)
    for (const file of handlers) {
      const methods = [...readFileSync(file, 'utf8').matchAll(/export\s+(?:async\s+)?function\s+([A-Z]+)/g)]
      expect(methods.map((m) => m[1]), file).toEqual(['GET'])
    }
  })
})

describe('what the proxy runs on', () => {
  const matcher = new RegExp(`^${config.matcher[0]}$`)

  it("skips only Next's own assets", () => {
    expect(matcher.test('/_next/static/chunks/main.js')).toBe(false)
    for (const path of ['/', '/pricing', '/__nextjs', '/__nextjsX/pricing', '/__nextjs_anything']) {
      expect(matcher.test(path), path).toBe(true)
    }
  })

  it('gives a path that looks like a dev endpoint a language in production, so it gets our 404', () => {
    for (const path of ['/__nextjsX/pricing', '/__nextjs_original-stack-frames']) {
      const response = proxy(new NextRequest(`https://wslatl.com${path}`))
      expect(response.headers.get('x-middleware-rewrite'), path).toContain(`/en${path}`)
    }
  })
})

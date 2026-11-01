import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { adminPostRoutes } from '@/i18n/routing'
import { config, proxy } from '@/proxy'

const root = join(__dirname, '..')
const adminApi = join(root, 'app', 'admin', 'api')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

function exportedMethods(file: string): string[] {
  return [...readFileSync(file, 'utf8').matchAll(/export\s+(?:async\s+)?function\s+([A-Z]+)/g)].map((m) => m[1])
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
    // proxy.ts answers every POST outside the admin's JSON routes with a 405,
    // and every request naming a Server Action anywhere. If the site ever
    // needs one, that rule has to change first.
    const withActions = ['app', 'components', 'lib', 'i18n', 'config', 'data', 'content']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => /^\s*['"]use server['"]/m.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(root.length + 1))
    expect(withActions).toEqual([])
  })

  it('is safe because every route handler outside the admin answers GET alone', () => {
    const handlers = sourceFiles(join(root, 'app'))
      .filter((file) => /[\\/]route\.tsx?$/.test(file))
      .filter((file) => !file.startsWith(adminApi))
    expect(handlers.length).toBeGreaterThan(0)
    for (const file of handlers) expect(exportedMethods(file), file).toEqual(['GET'])
  })
})

describe('the admin, the one place that takes a POST', () => {
  it('lets a POST through to its JSON routes untouched', () => {
    for (const path of ['/admin/api/login', '/admin/api/logout', '/admin/api/update']) {
      const response = proxy(post(path, { 'Content-Type': 'application/json' }, '{}'))
      expect(response.status, path).toBe(200)
      expect(response.headers.get('x-middleware-next'), path).toBe('1')
      expect(response.headers.get('x-middleware-rewrite'), path).toBeNull()
    }
  })

  it('turns away a POST to its pages, and to anything that only looks like the admin', () => {
    for (const path of [
      '/admin',
      '/admin/login',
      '/admin/api',
      '/admin/api/anything',
      '/administrator/api/login',
      '/es/admin/api/login',
    ]) {
      expectRefused(proxy(post(path, { 'Content-Type': 'application/json' }, '{}')))
    }
  })

  it('takes nothing but GET, HEAD and POST on its routes', () => {
    for (const method of ['PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      const response = proxy(new NextRequest('https://wslatl.com/admin/api/update', { method }))
      expect(response.status, method).toBe(405)
      expect(response.headers.get('allow')).toBe('GET, HEAD, POST')
    }
  })

  it('turns away a request naming a Server Action even there', () => {
    const response = proxy(post('/admin/api/login', { 'Next-Action': 'x', 'Content-Type': 'application/json' }, '{}'))
    expect(response.status).toBe(405)
  })

  it('serves its pages without a language, and nothing else that starts with the same letters', () => {
    for (const path of ['/admin', '/admin/login', '/admin/api/update']) {
      expect(proxy(new NextRequest(`https://wslatl.com${path}`)).headers.get('x-middleware-rewrite'), path).toBeNull()
    }
    expect(proxy(new NextRequest('https://wslatl.com/administrator')).headers.get('x-middleware-rewrite')).toContain(
      '/en/administrator',
    )
  })

  it('has route handlers that answer only GET or POST, and every POST checks where it came from', () => {
    const handlers = sourceFiles(adminApi).filter((file) => /[\\/]route\.tsx?$/.test(file))
    expect(handlers.length).toBeGreaterThan(0)
    for (const file of handlers) {
      expect(exportedMethods(file).every((method) => method === 'GET' || method === 'POST'), file).toBe(true)
    }
    const posts = handlers.filter((file) => exportedMethods(file).includes('POST'))
    // Exactly these take a POST in proxy.ts.
    const paths = posts.map((file) => `/${relative(join(root, 'app'), dirname(file)).replaceAll('\\', '/')}`)
    expect(paths.toSorted()).toEqual([...adminPostRoutes].toSorted())
    // And each one refuses anything not sent as JSON from a page on this site
    // first thing, before it reads a cookie or acts on anything.
    for (const file of posts) {
      const handler = readFileSync(file, 'utf8').replaceAll('\r\n', '\n').split(/export\s+async\s+function\s+POST/)[1]
      expect(handler, file).toMatch(
        /^\(request: NextRequest\) \{\n\s+const settings = adminEnabled\(\)\n\s+if \(!settings\) return notFoundResponse\(\)\n\s+const check = await checkPost\(request\)\n\s+if \(!check\.ok\) return check\.response\n/,
      )
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

import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from '@/proxy'

const origin = 'https://wslatl.com'

/**
 * proxy.ts sees every request first and gives it a language behind the
 * scenes. It must never send a visitor anywhere (it rewrites, it does not
 * redirect), never rewrite to another site, take no method but a read (and
 * the admin's POSTs), answer every Server Action with a 405, and decide the
 * admin's nonce itself. tests/http checks the redirects Next itself makes
 * from next.config.mjs, against a build.
 */
const request = (path: string, init: ConstructorParameters<typeof NextRequest>[1] = {}) => new NextRequest(`${origin}${path}`, init)

/** Every way this site's address can be bent into another site's, or out of its folder. */
const hostilePaths = [
  '//evil.example',
  '//evil.example/x',
  '/\\evil.example',
  '/\\\\evil.example',
  '/%2F%2Fevil.example',
  '/%2f%2fevil.example',
  '/%5Cevil.example',
  '/%5C%5Cevil.example',
  '/https://evil.example',
  '/https:%2F%2Fevil.example',
  '/http:/evil.example',
  '/en//evil.example',
  '/es//evil.example',
  '/en/%2F%2Fevil.example',
  '/..//evil.example',
  '/%2e%2e/%2e%2e//evil.example',
  '/@evil.example',
  '/evil.example%40wslatl.com',
  '/%09/evil.example',
  '/%0d%0aLocation:%20https://evil.example',
  '/%E3%80%82evil.example',
  '/admin//evil.example',
  '/admin/..//evil.example',
  '/.well-known/../..//evil.example',
  '/clients/..//evil.example.png',
  '/brand/%2F%2Fevil.example.webp',
]

describe('the language rewrite', () => {
  it('never sends a visitor to another site, and never rewrites anywhere but under a language on this one', () => {
    const wrong: string[] = []
    for (const path of hostilePaths) {
      for (const method of ['GET', 'HEAD']) {
        const response = proxy(request(path, { method }))
        const location = response.headers.get('location')
        const rewrite = response.headers.get('x-middleware-rewrite')
        if (location !== null) {
          // The kit's own redirects (/en/x to /x): on this site, never one a browser reads as another.
          const target = new URL(location, origin)
          if (target.origin !== origin || !/^\/(?![\\/])/.test(target.href.slice(origin.length))) wrong.push(`${method} ${path} -> ${location}`)
        } else if (![200, 404].includes(response.status)) {
          // A 404 is the kit refusing an address that climbs out of its language.
          wrong.push(`${method} ${path}: ${response.status}`)
        } else if (rewrite !== null) {
          const target = new URL(rewrite)
          if (target.origin !== origin || !/^\/(?:en|es|fr|de|pt)(?:\/|$)/.test(target.pathname)) wrong.push(`${method} ${path} -> ${rewrite}`)
        }
      }
    }
    expect(wrong).toEqual([])
  })
})

describe('a visitor who came over plain HTTP', () => {
  const plain = { 'cf-visitor': '{"scheme":"http"}' }

  it('goes to the same address on HTTPS, on this site, before anything else is answered', () => {
    for (const path of ['/', '/pricing?plan=a&b=c', '/es/pricing', '/admin/login', '/admin/api/update', '/no-such-page', ...hostilePaths]) {
      for (const method of ['GET', 'HEAD', 'POST', 'PUT']) {
        const response = proxy(request(path, { method, headers: { ...plain, host: 'evil.example', 'x-forwarded-host': 'evil.example' } }))
        expect(response.status, `${method} ${path}`).toBe(308)
        const location = new URL(response.headers.get('location') ?? '')
        expect(location.origin, path).toBe('https://wslatl.com')
        expect(`${location.pathname}${location.search}`, path).toBe(new URL(`${origin}${path}`).pathname + new URL(`${origin}${path}`).search)
      }
    }
  })

  it('is told apart by what Cloudflare says, so HTTPS visitors and local runs are left alone', () => {
    const others: Record<string, string>[] = [{ 'cf-visitor': '{"scheme":"https"}' }, {}, { 'x-forwarded-proto': 'http' }, { 'cf-visitor': 'garbage' }]
    for (const headers of others) {
      expect(proxy(request('/pricing', { headers })).status, JSON.stringify(headers)).toBe(200)
    }
  })
})

describe('what is not a read', () => {
  it('gets a 405 everywhere, apart from the admin\'s own POST routes', () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'PROPFIND', 'MKCOL', 'LOCK', 'PURGE', 'SEARCH']) {
      for (const path of ['/', '/pricing', '/es/pricing', '/og', '/company.json', '/robots.txt', '/admin', '/admin/login', '/admin/api', '/admin/api/login/', '/ADMIN/api/login', '/admin/api/login%2F', ...hostilePaths]) {
        const response = proxy(request(path, { method }))
        expect(response.status, `${method} ${path}`).toBe(405)
        expect(response.headers.get('allow'), `${method} ${path}`).toMatch(/^GET, HEAD/)
      }
    }
  })

  it('gets a 405 whenever it names a Server Action, whatever else it says', () => {
    for (const path of ['/', '/pricing', '/es', '/admin', '/admin/api/login', '/og', '/company.json', '/_not_next/x']) {
      for (const method of ['GET', 'HEAD', 'POST']) {
        for (const header of ['next-action', 'Next-Action', 'NEXT-ACTION']) {
          const response = proxy(request(path, { method, headers: { [header]: 'x', 'content-type': 'text/plain;charset=UTF-8' } }))
          expect(response.status, `${method} ${path} ${header}`).toBe(405)
        }
      }
    }
  })
})

const policyOf = (response: Response) => response.headers.get('content-security-policy') ?? ''

describe('the admin\'s Content Security Policy', () => {
  it('carries a nonce that is new for every request, and allows no other inline script or style', () => {
    const nonces = new Set<string>()
    for (let i = 0; i < 50; i++) {
      const policy = policyOf(proxy(request('/admin/login')))
      const nonce = /'nonce-([A-Za-z0-9+/=]+)'/.exec(policy)?.[1] ?? ''
      // 128 random bits, base64.
      expect(Buffer.from(nonce, 'base64').length).toBe(16)
      nonces.add(nonce)
      const scripts = /script-src ([^;]*)/.exec(policy)?.[1] ?? ''
      const styles = /style-src ([^;]*)/.exec(policy)?.[1] ?? ''
      expect(scripts).not.toContain("'unsafe-inline'")
      expect(scripts).not.toContain("'unsafe-eval'")
      expect(styles).not.toContain("'unsafe-inline'")
      expect(policy).toContain("frame-ancestors 'none'")
      expect(policy).toContain("object-src 'none'")
    }
    expect(nonces.size).toBe(50)
  })

  it('is decided here alone: a policy the visitor sends with the request never reaches a page', () => {
    const chosen = "script-src 'nonce-chosenbythevisitor'"
    for (const path of ['/admin', '/admin/login', '/pricing', '/no-such-page', '/es/no-such-page']) {
      const response = proxy(request(path, { headers: { 'content-security-policy': chosen } }))
      const forwarded = response.headers.get('x-middleware-request-content-security-policy')
      expect(forwarded ?? '', path).not.toContain('chosenbythevisitor')
      // The admin's pages get the proxy's own policy instead; the rest get none.
      expect(forwarded, path).toBe(path.startsWith('/admin') ? policyOf(response) : null)
    }
  })

  it('is on the admin\'s 405 answers too, which no config header covers there', () => {
    const response = proxy(request('/admin/api/update', { method: 'DELETE' }))
    expect(response.status).toBe(405)
    expect(policyOf(response)).toMatch(/default-src 'self'.*script-src 'self'(;|$)/)
  })
})

describe('an address that cannot be decoded', () => {
  it('goes to our 404 page in its own language on this site, never on to a bare 500 with no headers', () => {
    for (const [path, target] of [
      ['/%ff', '/broken-address'],
      ['/%C0%AF', '/broken-address'],
      ['/en/%E0%A4%A', '/broken-address'],
      ['/es/%E0%A4%A', '/es/broken-address'],
      ['/de/games/%ff', '/de/broken-address'],
      ['/zz/%ff', '/broken-address'],
      ['/admin/%ff', '/admin/broken-address'],
      ['/admin/api/login%ff', '/admin/broken-address'],
    ] as const) {
      const response = proxy(request(path, { headers: { host: 'evil.example' } }))
      expect(response.status, path).toBe(307)
      expect(response.headers.get('location'), path).toBe(`${origin}${target}`)
    }
  })

  it('still gets the HTTPS and method rules first', () => {
    const upgraded = proxy(request('/es/%ff', { headers: { 'cf-visitor': '{"scheme":"http"}' } }))
    expect(upgraded.status).toBe(308)
    expect(upgraded.headers.get('location')).toBe(`${origin}/es/%ff`)
    expect(proxy(request('/es/%ff', { method: 'POST', body: 'x' })).status).toBe(405)
    expect(proxy(request('/admin/api/login%ff', { method: 'POST', body: '{}' })).status).toBe(405)
  })
})

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from '@/proxy'

const root = join(__dirname, '..')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

function post(path: string, headers: Record<string, string>) {
  return new NextRequest(`https://wslatl.com${path}`, { method: 'POST', headers, body: '[]' })
}

describe('Server Action requests', () => {
  it('turns away a request that names a Server Action, before Next looks it up', () => {
    for (const action of ['x', 'cachefn', '7f0123456789abcdef0123456789abcdef01234567']) {
      const response = proxy(post('/', { 'Next-Action': action }))
      expect(response.status).toBe(400)
      expect(response.headers.get('x-middleware-next')).toBeNull()
      expect(response.headers.get('x-middleware-rewrite')).toBeNull()
    }
  })

  it('turns one away on any page, including one asking for an RSC payload', () => {
    const response = proxy(post('/pricing?_rsc=abc', { 'Next-Action': 'cachefn', RSC: '1' }))
    expect(response.status).toBe(400)
  })

  it('still serves an ordinary request', () => {
    const page = proxy(new NextRequest('https://wslatl.com/pricing'))
    expect(page.status).toBe(200)
    expect(page.headers.get('x-middleware-rewrite')).toContain('/en/pricing')
  })

  it('is safe because the site has no Server Actions of its own', () => {
    // proxy.ts answers every Next-Action request with a 400. If the site ever
    // needs a Server Action, that rule has to change first.
    const withActions = ['app', 'components', 'lib', 'i18n', 'config', 'data', 'content']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => /^\s*['"]use server['"]/m.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(root.length + 1))
    expect(withActions).toEqual([])
  })
})

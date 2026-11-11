import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import AdminError from '@/app/admin/error'
import AdminNotFound from '@/app/admin/not-found'
import MissingAdminPage from '@/app/admin/[...missing]/page'
import GlobalError from '@/app/global-error'
import { errorCopy } from '@/i18n/error-copy'
import { rootDirectories, sharedDirectories } from '@/i18n/routing'
import nextConfig from '../next.config.mjs'

// The admin's pages are the kit's, whose server side imports server-only.
vi.mock('server-only', () => ({}))

const address = vi.hoisted(() => ({ path: '/' }))
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => address.path,
}))

// What Next hands an error page: the error, and both ways to try again.
const crash = { error: new Error('a detail nobody should see'), reset: () => {}, retry: () => {} }

describe('a missing file in a folder that keeps its path', () => {
  it('gets a language once the real files have been served, for every such folder', async () => {
    const rewrites = (await nextConfig.rewrites()) as { afterFiles: { source: string; destination: string }[] }
    const folders = [...rootDirectories, ...sharedDirectories].toSorted()
    expect(rewrites.afterFiles.map((rule) => rule.source).toSorted()).toEqual(folders.map((folder) => `${folder}:path*`))
    for (const rule of rewrites.afterFiles) expect(rule.destination).toBe(`/en${rule.source}`)
  })
})

describe('a wrong address under /admin', () => {
  it('is a real 404, which the admin answers with its own page', () => {
    expect(() => MissingAdminPage()).toThrow(expect.objectContaining({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' }))
  })

  it('says nothing about the admin, since it also stands in when the admin is switched off', () => {
    const html = renderToStaticMarkup(createElement(AdminNotFound))
    expect(html).toContain('Page not found')
    expect(html).toContain('href="/"')
    expect(html).not.toMatch(/admin/i)
  })
})

describe('a crash in the admin', () => {
  it('offers another try and the way back, and never shows what went wrong', () => {
    const html = renderToStaticMarkup(createElement(AdminError, crash))
    expect(html).toContain('Something went wrong')
    expect(html).toContain('Try again')
    expect(html).toContain('href="/admin"')
    expect(html).not.toContain(crash.error.message)
  })
})

function renderGlobalError(path: string) {
  address.path = path
  return renderToStaticMarkup(createElement(GlobalError, crash))
}

describe('a crash in a root layout', () => {
  it('brings its own page, in the language of the address', () => {
    const html = renderGlobalError('/es/pricing')
    expect(html).toContain('<html lang="es"')
    expect(html).toContain('<body')
    expect(html).toContain(errorCopy.es.tryAgain)
    expect(html).toContain('href="/es"')
  })

  it('reads as English on the admin and the English pages, and never shows what went wrong', () => {
    for (const path of ['/admin/updates', '/pricing', '/']) {
      const html = renderGlobalError(path)
      expect(html, path).toContain('<html lang="en"')
      expect(html, path).toContain(errorCopy.en.heading.replaceAll("'", '&#x27;'))
      expect(html, path).not.toContain(crash.error.message)
    }
  })
})

import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'
import { generateStaticParams as gamePages } from '@/app/[locale]/games/[slug]/page'
import { generateStaticParams as legalPages } from '@/app/[locale]/legal/[slug]/page'
import { generateStaticParams as partnerPages } from '@/app/[locale]/partners/[slug]/page'
import { proxy } from '@/proxy'
import { isAdminPath as kitIsAdminPath } from '@/platform/admin/proxy'
import { defaultLocale, locales } from '@/i18n/config'
import {
  isAdminPath,
  isRootFile,
  listPages,
  partnerImageTypes,
  rootDirectories,
  rootFiles,
  sharedDirectories,
} from '@/i18n/routing'

// The pages are imported for their lists alone; config/emails.ts, which they reach, is server-only.
vi.mock('server-only', () => ({}))

const root = join(__dirname, '..')

/**
 * Where the site's proxy sends a path: the page under a language it is
 * rewritten to, or null when it goes on as it came. Next takes the slash off
 * the end of an address before the proxy sees it (/brand/ to /brand), so
 * none is asked for with one.
 */
function rewriteTarget(path: string): string | null {
  const rewrite = proxy(new NextRequest(`https://wslatl.com${path}`)).headers.get('x-middleware-rewrite')
  return rewrite === null ? null : new URL(rewrite).pathname
}

/**
 * The path Next routes once the proxy is done: where it rewrote the
 * address, or the address itself, when it goes on as it came (one with a
 * language prefix already, or a percent sign). Null when the proxy
 * answered the request itself.
 */
function landing(path: string, headers: Record<string, string> = {}): string | null {
  const response = proxy(new NextRequest(`https://wslatl.com${path}`, { headers }))
  const rewrite = response.headers.get('x-middleware-rewrite')
  if (rewrite !== null) return new URL(rewrite).pathname
  return response.headers.get('x-middleware-next') === null ? null : new URL(`https://wslatl.com${path}`).pathname
}

describe('the files served from the site root', () => {
  it('lists everything in public/, so a new file there is not rewritten into a 404', () => {
    const missing = readdirSync(join(root, 'public')).filter((name) =>
      statSync(join(root, 'public', name)).isDirectory()
        ? !rootDirectories.includes(`/${name}/`) && !sharedDirectories.includes(`/${name}/`)
        : !rootFiles.includes(`/${name}`),
    )
    expect(missing).toEqual([])
  })

  it('recognises a file at the root, and anything inside a directory we serve', () => {
    expect(isRootFile('/favicon.ico')).toBe(true)
    expect(isRootFile('/sitemap.xml')).toBe(true)
    expect(isRootFile('/company.json')).toBe(true)
    expect(isRootFile('/clients/example.png')).toBe(true)
  })

  it('lists every route handler the app serves at the root', () => {
    // app/company.json/route.ts is served at /company.json and app/og/route.tsx
    // at /og. Added there and forgotten in rootFiles, a handler would be given
    // a language and answer 404.
    const handlers = readdirSync(join(root, 'app')).filter((name) =>
      ['route.ts', 'route.tsx'].some((file) => existsSync(join(root, 'app', name, file))),
    )
    expect(handlers).toEqual(expect.arrayContaining(['company.json', 'og']))
    for (const name of handlers) expect(rootFiles, `/${name}`).toContain(`/${name}`)
  })

  it('leaves the share card route without a language, so /og?path=... is not looked up as a page', () => {
    expect(isRootFile('/og')).toBe(true)
    expect(rewriteTarget('/og')).toBeNull()
    // Only that exact path: /og/ is a page that does not exist.
  })
})

describe('the picture folders at the root', () => {
  it('serves only pictures from them, so a made-up path there is a 404, not a copy of a page', () => {
    // /clients/pricing used to skip the language rewrite and render the
    // English pricing page with a canonical pointing at itself: a duplicate
    // anyone could get indexed by linking to it.
    for (const path of ['/clients/pricing', '/owners/legal/privacy', '/owners/games/minecraft']) {
      expect(isRootFile(path), path).toBe(false)
      expect(rewriteTarget(path), path).toBe(`/en${path}`)
    }
    expect(isRootFile('/owners/someone.webp')).toBe(true)
  })
})

describe('a directory shared with pages', () => {
  it('serves the pictures in public/partners/ as files', () => {
    expect(isRootFile('/partners/someone/avatar.webp')).toBe(true)
    expect(isRootFile('/partners/someone/banner.png')).toBe(true)
    expect(rewriteTarget('/partners/someone/banner.jpg')).toBeNull()
  })

  it('still gives the partner pages a language', () => {
    // /partners and /partners/<slug> are pages. Treated as files, the English
    // ones would skip app/[locale] and answer 404.
    const [partner] = listPages.get('partners') ?? []
    expect(rewriteTarget('/partners')).toBe('/en/partners')
    expect(rewriteTarget(`/partners/${partner}`)).toBe(`/en/partners/${partner}`)
    expect(rewriteTarget(`/es/partners/${partner}`)).toBeNull()
  })

  it('treats anything there that is not a picture as a page, so a probe gets our 404', () => {
    expect(rewriteTarget('/partners/someone/wp-login.php')).toBe('/en/partners/someone/wp-login.php')
  })

  it('serves only the picture types partners use, never an SVG, which can carry script', () => {
    for (const path of [
      '/partners/someone/logo.svg',
      '/partners/someone/banner.gif',
      '/partners/someone/banner.avif',
      '/partners/someone/banner.WEBP',
    ]) {
      expect(isRootFile(path), path).toBe(false)
    }
  })

  it('holds nothing in a shared directory but those pictures', () => {
    const picture = new RegExp(`\\.(${partnerImageTypes.join('|')})$`)
    for (const shared of sharedDirectories) {
      const dir = join(root, 'public', shared.replaceAll('/', ''))
      const files = existsSync(dir)
        ? readdirSync(dir, { recursive: true, withFileTypes: true })
            .filter((entry) => entry.isFile())
            .map((entry) => join(entry.parentPath, entry.name))
        : []
      expect(files.filter((file) => !picture.test(file)), shared).toEqual([])
    }
  })

  it('has no page sharing its name with a plain root directory', () => {
    // A page under /clients/ or /owners/ would never be given a language.
    const pages = readdirSync(join(root, 'app', '[locale]'))
    expect(rootDirectories.filter((dir) => pages.includes(dir.replaceAll('/', '')))).toEqual([])
    expect(sharedDirectories.every((dir) => pages.includes(dir.replaceAll('/', '')))).toBe(true)
  })

  it("takes a picture straight under /partners/ for a partner's page, since each partner's pictures have a folder of their own", () => {
    // Served as a file, /partners/<anything>.png went on with no language,
    // missed in public/, and next.config.mjs's rewrite then handed it to the
    // partner page as English, which Next keeps a note of for every slug.
    for (const type of partnerImageTypes) {
      const path = `/partners/no-such-partner.${type}`
      expect(isRootFile(path), path).toBe(false)
      expect(landing(path), path).toBe(`/en${path}/-`)
    }
    const partnersDir = join(root, 'public', 'partners')
    expect(readdirSync(partnersDir).filter((name) => !statSync(join(partnersDir, name)).isDirectory())).toEqual([])
  })
})

describe('a game, document or partner the build did not make', () => {
  const unknown = ['no-such-thing', 'no-such-thing.rsc', 'no-such-thing.prefetch.rsc', 'no-such%25', 'Minecraft', 'privacy%2Fx', '%F0%9F%98%80', 'x'.repeat(4000)]

  it('lands on the catch-all page, one segment deeper, in every language and every form Next reads as that page', () => {
    // Next draws each [slug] page it was not built with when it is first
    // asked for, and keeps a note of it that nothing clears, the whole
    // address in it: up to 16 KB of memory for every new made-up address.
    // app/[locale]/[...rest] is drawn for each request and keeps nothing.
    for (const [list] of listPages) {
      for (const locale of locales) {
        const prefix = locale === defaultLocale ? '' : `/${locale}`
        for (const slug of unknown) {
          const path = `${prefix}/${list}/${slug}`
          expect(landing(path), path).toBe(`/${locale}/${list}/${slug}/-`)
        }
      }
    }
  })

  it('lands there however the request asks for it: a page, an RSC request or a prefetch', () => {
    const asked: Record<string, string>[] = [{}, { rsc: '1' }, { rsc: '1', 'next-router-prefetch': '1' }, { rsc: '1', 'next-router-segment-prefetch': '/_tree' }]
    for (const headers of asked) {
      expect(landing('/games/no-such-game?_rsc=abc', headers), JSON.stringify(headers)).toBe('/en/games/no-such-game/-')
      expect(landing('/de/legal/no-such-document', headers), JSON.stringify(headers)).toBe('/de/legal/no-such-document/-')
    }
  })

  it('leaves every page the build made where it is, in every language, its RSC form and its slug in percent signs included', () => {
    for (const [list, slugs] of listPages) {
      for (const slug of slugs) {
        for (const locale of locales) {
          const prefix = locale === defaultLocale ? '' : `/${locale}`
          expect(landing(`${prefix}/${list}/${slug}`), `${prefix}/${list}/${slug}`).toBe(`/${locale}/${list}/${slug}`)
          expect(landing(`${prefix}/${list}/${slug}.rsc`), `${prefix}/${list}/${slug}.rsc`).toBe(`/${locale}/${list}/${slug}.rsc`)
        }
      }
    }
    // Next decodes a slug before it looks the page up, and next-intl an
    // address before it rewrites it: each is the page itself.
    expect(landing('/games/minecraf%74')).toBe('/en/games/minecraft')
    expect(landing('/es/legal/%70rivacy')).toBe('/es/legal/privacy')
  })

  it('leaves every other address as it was', () => {
    for (const path of ['/games', '/es/legal', '/partners', '/games/no-such-game/deeper', '/pricing/no-such-page', '/es/brand/no-such.png']) {
      expect(landing(path) ?? '', path).not.toMatch(/\/-$/)
    }
  })

  it('knows each list the pages are built from, and every list with a page for each entry', () => {
    const lists = readdirSync(join(root, 'app', '[locale]')).filter((name) => existsSync(join(root, 'app', '[locale]', name, '[slug]', 'page.tsx')))
    expect([...listPages.keys()].toSorted()).toEqual(lists.toSorted())
    const built: Record<string, () => { slug: string }[]> = { games: gamePages, legal: legalPages, partners: partnerPages }
    for (const [list, slugs] of listPages) {
      expect([...slugs].toSorted(), list).toEqual(built[list]().map(({ slug }) => slug).toSorted())
    }
  })
})

describe('the brand kit page and the pictures beside it', () => {
  it('serves the pictures and the logo downloads in public/brand/ as files', () => {
    for (const path of [
      '/brand/wslatl-mark.webp',
      '/brand/kit-mark.webp',
      '/brand/downloads/wslatl-logo-64x64.png',
      '/brand/downloads/wslatl-banner-1500x500.png',
    ]) {
      expect(isRootFile(path), path).toBe(true)
      expect(rewriteTarget(path), path).toBeNull()
    }
  })

  it('still gives /brand, the page, a language in every language', () => {
    // A directory of pictures at the same address must not turn the page into
    // a file: it would skip app/[locale] and answer 404.
    expect(isRootFile('/brand')).toBe(false)
    expect(rewriteTarget('/brand')).toBe('/en/brand')
    expect(rewriteTarget('/es/brand')).toBeNull()
    expect(rewriteTarget('/pt/brand')).toBeNull()
  })

  it('treats anything else under /brand/ as a page, so a probe gets our 404, and never serves an SVG', () => {
    for (const path of ['/brand/wp-login.php', '/brand/downloads/wslatl-logo.svg', '/brand/kit.WEBP']) {
      expect(isRootFile(path), path).toBe(false)
      expect(rewriteTarget(path), path).toBe(`/en${path}`)
    }
  })
})

describe('where a request is sent', () => {
  it('leaves a file, and a path that already has a language, where it is', () => {
    for (const path of ['/favicon.ico', '/owners/liam.png', '/es/pricing', '/de/legal/terms', '/pt']) {
      expect(rewriteTarget(path), path).toBeNull()
    }
  })

  it('gives everything else the default language', () => {
    expect(rewriteTarget('/')).toBe('/en')
    expect(rewriteTarget('/pricing')).toBe('/en/pricing')
    expect(rewriteTarget('/games/minecraft')).toBe('/en/games/minecraft')
  })

  it('sends paths that look like files through it too', () => {
    // app/[locale] only accepts a real language because of this. A path that
    // skipped the rewrite arrived with "sw.js" where the language belongs,
    // and the framework logged an error for every bot that probed one.
    expect(rewriteTarget('/sw.js')).toBe('/en/sw.js')
    expect(rewriteTarget('/.env')).toBe('/en/.env')
    expect(rewriteTarget('/wp-login.php')).toBe('/en/wp-login.php')
  })
})

describe('the admin', () => {
  it('lives outside the languages, so its paths are never given one', () => {
    for (const path of ['/admin', '/admin/', '/admin/login', '/admin/api/update']) expect(isAdminPath(path), path).toBe(true)
    // Asked without the slash at the end, as Next hands the proxy every address.
    for (const path of ['/admin', '/admin/login', '/admin/api/update']) expect(rewriteTarget(path), path).toBeNull()
    for (const path of ['/administrator', '/admin.php', '/adminer', '/es/admin']) {
      expect(isAdminPath(path), path).toBe(false)
    }
    expect(rewriteTarget('/admin.php')).toBe('/en/admin.php')
  })

  it('is the same admin the kit answers for, so no address falls between the two', () => {
    for (const path of ['/admin', '/admin/', '/admin/login', '/admin/api/update', '/administrator', '/admin.php', '/es/admin', '/', '/pricing']) {
      expect(isAdminPath(path), path).toBe(kitIsAdminPath(path))
    }
  })
})

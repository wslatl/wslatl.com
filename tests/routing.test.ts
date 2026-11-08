import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  isAdminPath,
  isRootFile,
  methodAllowed,
  partnerImageTypes,
  rewriteTarget,
  rootDirectories,
  rootFiles,
  sharedDirectories,
} from '@/i18n/routing'

const root = join(__dirname, '..')

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
    expect(rewriteTarget('/og/')).toBe('/en/og/')
  })
})

describe('the picture folders at the root', () => {
  it('serves only pictures from them, so a made-up path there is a 404, not a copy of a page', () => {
    // /clients/pricing used to skip the language rewrite and render the
    // English pricing page with a canonical pointing at itself: a duplicate
    // anyone could get indexed by linking to it.
    for (const path of ['/clients/pricing', '/owners/legal/privacy', '/owners/games/minecraft', '/clients/']) {
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
    expect(rewriteTarget('/partners')).toBe('/en/partners')
    expect(rewriteTarget('/partners/')).toBe('/en/partners/')
    expect(rewriteTarget('/partners/someone')).toBe('/en/partners/someone')
    expect(rewriteTarget('/es/partners/someone')).toBeNull()
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
    expect(rewriteTarget('/brand/')).toBe('/en/brand/')
    expect(rewriteTarget('/es/brand')).toBeNull()
    expect(rewriteTarget('/pt/brand')).toBeNull()
  })

  it('treats anything else under /brand/ as a page, so a probe gets our 404, and never serves an SVG', () => {
    for (const path of ['/brand/wp-login.php', '/brand/downloads/', '/brand/downloads/wslatl-logo.svg', '/brand/kit.WEBP']) {
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
    expect(rewriteTarget('/')).toBe('/en/')
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
    for (const path of ['/admin', '/admin/', '/admin/login', '/admin/api/update']) {
      expect(isAdminPath(path), path).toBe(true)
      expect(rewriteTarget(path), path).toBeNull()
    }
    for (const path of ['/administrator', '/admin.php', '/adminer', '/es/admin']) {
      expect(isAdminPath(path), path).toBe(false)
    }
    expect(rewriteTarget('/admin.php')).toBe('/en/admin.php')
  })

  it('is the only place a POST is allowed, and only on its JSON routes', () => {
    for (const path of ['/', '/pricing', '/es/pricing', '/admin', '/admin/login', '/company.json']) {
      expect(methodAllowed('GET', path), path).toBe(true)
      expect(methodAllowed('HEAD', path), path).toBe(true)
      expect(methodAllowed('POST', path), path).toBe(false)
    }
    expect(methodAllowed('POST', '/admin/api/login')).toBe(true)
    // Only the routes that exist: anything else there would reach a page.
    expect(methodAllowed('POST', '/admin/api/anything')).toBe(false)
    expect(methodAllowed('POST', '/admin/api/login/')).toBe(false)
    expect(methodAllowed('PUT', '/admin/api/login')).toBe(false)
    expect(methodAllowed('DELETE', '/admin/api/update')).toBe(false)
  })
})

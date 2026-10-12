import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  isRootFile,
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

  it('lists every file the app generates at the root', () => {
    // app/company.json/route.ts is served at /company.json. Added there and
    // forgotten in rootFiles, it would be given a language and answer 404.
    const generated = readdirSync(join(root, 'app')).filter(
      (name) => name.includes('.') && statSync(join(root, 'app', name)).isDirectory(),
    )
    expect(generated.length).toBeGreaterThan(0)
    for (const name of generated) expect(rootFiles, `/${name}`).toContain(`/${name}`)
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

  it('holds nothing in public/partners/ but those pictures', () => {
    const dir = join(root, 'public', 'partners')
    const files = existsSync(dir)
      ? readdirSync(dir, { recursive: true, withFileTypes: true })
          .filter((entry) => entry.isFile())
          .map((entry) => join(entry.parentPath, entry.name))
      : []
    const picture = new RegExp(`\\.(${partnerImageTypes.join('|')})$`)
    expect(files.filter((file) => !picture.test(file))).toEqual([])
  })

  it('has no page sharing its name with a plain root directory', () => {
    // A page under /clients/ or /owners/ would never be given a language.
    const pages = readdirSync(join(root, 'app', '[locale]'))
    expect(rootDirectories.filter((dir) => pages.includes(dir.replaceAll('/', '')))).toEqual([])
    expect(sharedDirectories.every((dir) => pages.includes(dir.replaceAll('/', '')))).toBe(true)
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

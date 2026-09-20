import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { isRootFile, rewriteTarget, rootDirectories, rootFiles } from '@/i18n/routing'

const root = join(__dirname, '..')

describe('the files served from the site root', () => {
  it('lists everything in public/, so a new file there is not rewritten into a 404', () => {
    const missing = readdirSync(join(root, 'public')).filter((name) =>
      statSync(join(root, 'public', name)).isDirectory()
        ? !rootDirectories.includes(`/${name}/`)
        : !rootFiles.includes(`/${name}`),
    )
    expect(missing).toEqual([])
  })

  it('recognises a file at the root, and anything inside a directory we serve', () => {
    expect(isRootFile('/favicon.ico')).toBe(true)
    expect(isRootFile('/sitemap.xml')).toBe(true)
    expect(isRootFile('/clients/example.png')).toBe(true)
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

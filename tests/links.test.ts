import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import { mainNav, portalLinks, requestAccessLink } from '@/data/nav'
import { footerColumns } from '@/data/footer'
import { legalPages, legalSlug } from '@/data/legal'
import { games } from '@/data/games'
import { productLines } from '@/data/pricing'
import { reachOptions } from '@/data/reach-options'
import { isShortLink, shortLinks } from '@/config/links'
import nextConfig from '../next.config.mjs'

const root = join(__dirname, '..')

/** The slugs each dynamic route is statically generated for. */
const dynamicSlugs: Record<string, string[]> = {
  '/games/[slug]': games.map((game) => game.slug),
  '/legal/[slug]': legalPages.map(legalSlug),
}

/** Every route the app serves, read from the app directory. */
function appRoutes(): Set<string> {
  const routes = new Set<string>()
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path)
      else if (name === 'page.tsx') {
        const route = '/' + relative(join(root, 'app'), dir).split(sep).join('/')
        if (route.includes('[')) {
          const slugs = dynamicSlugs[route]
          if (!slugs) throw new Error(`Add ${route} to dynamicSlugs in tests/links.test.ts`)
          for (const slug of slugs) routes.add(route.replace('[slug]', slug))
        } else {
          routes.add(route === '/' ? '/' : route.replace(/\/$/, ''))
        }
      }
    }
  }
  walk(join(root, 'app'))
  return routes
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|mjs|json)$/.test(name) ? [path] : []
  })
}

/** Section ids rendered on the home page, found in the section components. */
function homeSectionIds(): Set<string> {
  const dir = join(root, 'components', 'sections')
  const ids = new Set<string>()
  for (const name of readdirSync(dir)) {
    const text = readFileSync(join(dir, name), 'utf8')
    for (const match of text.matchAll(/\bid="([a-z0-9-]+)"/g)) ids.add(match[1])
  }
  return ids
}

const routes = appRoutes()
const sectionIds = homeSectionIds()
const pricingAnchors = new Set(productLines.map((l) => l.anchor))

/** Why an internal link is broken, or null when it resolves. */
function brokenReason(href: string): string | null {
  const [path, hash] = href.split('#')
  const route = path === '' ? '/' : path
  if (isShortLink(route)) return null
  if (!routes.has(route)) return `no route for ${href}`
  if (hash && route === '/' && !sectionIds.has(hash)) return `no #${hash} on the home page`
  if (hash && route === '/pricing' && !pricingAnchors.has(hash)) return `no #${hash} on /pricing`
  return null
}

const allLinks = [
  ...mainNav,
  ...portalLinks,
  requestAccessLink,
  ...footerColumns.flatMap((c) => c.links),
  ...legalPages.map((p) => ({ label: p.label, href: p.href })),
  ...reachOptions.flatMap((o) => ('href' in o ? [{ label: o.title, href: o.href }] : [])),
]

// Every check collects all failures and asserts once, so a broken link
// reports every problem at the same time and no assertion is ever skipped.
describe('links', () => {
  it('points every internal link at a real route and anchor', () => {
    const internal = allLinks.filter((link) => link.href.startsWith('/'))
    expect(internal.length).toBeGreaterThan(0)
    expect(internal.map((link) => brokenReason(link.href)).filter(Boolean)).toEqual([])
  })

  it('uses https for every external link', () => {
    const insecure = allLinks.filter(
      (link) => /^[a-z]+:/i.test(link.href) && !link.href.startsWith('mailto:') && !link.href.startsWith('https://'),
    )
    expect(insecure).toEqual([])
  })

  it('redirects retired URLs to pages that exist', async () => {
    const redirects = await nextConfig.redirects()
    const retired = redirects.filter((r) => r.permanent)
    expect(retired.length).toBeGreaterThan(0)
    expect(redirects.filter((r) => routes.has(r.source)).map((r) => r.source)).toEqual([])
    expect(retired.filter((r) => !routes.has(r.destination)).map((r) => r.destination)).toEqual([])
  })

  it('redirects every short link, temporarily, to its https destination', async () => {
    const redirects = await nextConfig.redirects()
    const problems = Object.entries(shortLinks).flatMap(([name, { path, url }]) => {
      const redirect = redirects.find((r) => r.source === path)
      if (!/^\/[a-z0-9-]+$/.test(path)) return [`${name}: ${path} is not a simple path`]
      if (!url.startsWith('https://')) return [`${name}: ${url} is not https`]
      if (!redirect) return [`${name}: no redirect for ${path}`]
      // Permanent redirects are cached by browsers, which would pin visitors
      // to an old destination after it changes.
      if (redirect.permanent) return [`${name}: ${path} must not be permanent`]
      if (redirect.destination !== url) return [`${name}: ${path} goes to ${redirect.destination}`]
      return []
    })
    expect(problems).toEqual([])
    const paths = Object.values(shortLinks).map((link) => link.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('links to panels and profiles only through their short links', () => {
    // Typing a destination into a page defeats the point: it would not follow
    // the next change to config/links.json.
    const destinations = Object.values(shortLinks).map((link) => link.url.replace(/\/$/, ''))
    const offenders = ['app', 'components', 'content', 'data', 'lib']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .flatMap((file) => {
        const text = readFileSync(file, 'utf8')
        return destinations.filter((url) => text.includes(url)).map((url) => `${relative(root, file)}: ${url}`)
      })
    expect(offenders).toEqual([])
  })

  it('keeps every legal document reachable at its old top-level URL', async () => {
    // Legal pages moved from /privacy to /legal/privacy (and so on). Old links
    // must keep working, so each document needs a permanent redirect.
    const redirects = await nextConfig.redirects()
    const missing = legalPages
      .map((page) => ({ from: `/${legalSlug(page)}`, to: page.href }))
      .filter(({ from, to }) => !redirects.some((r) => r.source === from && r.destination === to && r.permanent))
    expect(missing).toEqual([])
  })
})

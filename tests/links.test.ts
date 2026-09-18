import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import { mainNav, portalLinks, requestAccessLink } from '@/data/nav'
import { footerColumns } from '@/data/footer'
import { legalPages } from '@/data/legal'
import { games } from '@/data/games'
import { productLines } from '@/data/pricing'
import { reachOptions } from '@/data/reach-options'
import nextConfig from '../next.config.mjs'

const root = join(__dirname, '..')

/** Every route the app serves, read from the app directory. */
function appRoutes(): Set<string> {
  const routes = new Set<string>()
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path)
      else if (name === 'page.tsx') {
        const route = '/' + relative(join(root, 'app'), dir).split(sep).join('/')
        if (route.includes('[slug]')) {
          for (const game of games) routes.add(route.replace('[slug]', game.slug))
        } else {
          routes.add(route === '/' ? '/' : route.replace(/\/$/, ''))
        }
      }
    }
  }
  walk(join(root, 'app'))
  return routes
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

function checkInternal(href: string) {
  const [path, hash] = href.split('#')
  const route = path === '' ? '/' : path
  expect(routes.has(route), `no route for ${href}`).toBe(true)
  if (hash && route === '/') expect(sectionIds.has(hash), `no #${hash} on the home page`).toBe(true)
  if (hash && route === '/pricing') expect(pricingAnchors.has(hash), `no #${hash} on /pricing`).toBe(true)
}

const allLinks = [
  ...mainNav,
  ...portalLinks,
  requestAccessLink,
  ...footerColumns.flatMap((c) => c.links),
  ...legalPages.map((p) => ({ label: p.label, href: p.href })),
  ...reachOptions.map((o) => ({ label: o.title, href: o.href })),
]

describe('links', () => {
  it('points every internal link at a real route and anchor', () => {
    for (const link of allLinks) {
      if (link.href.startsWith('/')) checkInternal(link.href)
    }
  })

  it('uses https for every external link', () => {
    for (const link of allLinks) {
      if (/^[a-z]+:/i.test(link.href) && !link.href.startsWith('mailto:')) {
        expect(link.href, link.label).toMatch(/^https:\/\//)
      }
    }
  })

  it('redirects retired URLs to pages that exist', async () => {
    const redirects = await nextConfig.redirects()
    for (const redirect of redirects) {
      expect(routes.has(redirect.source), `${redirect.source} still exists`).toBe(false)
      expect(routes.has(redirect.destination), `${redirect.destination} is missing`).toBe(true)
    }
  })
})

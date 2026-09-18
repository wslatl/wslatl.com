import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { games, ramNeedGb } from '@/data/games'
import { legalPages } from '@/data/legal'
import { uptimeTarget, uptimeTargets } from '@/data/sla'
import { siteConfig } from '@/config/site'

const root = join(__dirname, '..')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|mjs|mts|css|md|ya?ml|json)$/.test(name) ? [path] : []
  })
}

describe('house style', () => {
  it('has no em dashes anywhere in the site source', () => {
    const files = ['app', 'components', 'config', 'content', 'data', 'lib', 'tests', '.github']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .concat(
        ['README.md', 'package.json', 'next.config.mjs', 'eslint.config.mjs', 'vitest.config.mts'].map((f) =>
          join(root, f),
        ),
      )
    // Built from parts so this file does not match itself.
    const emDash = String.fromCharCode(0x2014)
    const entity = '&' + 'mdash;'
    const offenders = files.filter((file) => {
      const text = readFileSync(file, 'utf8')
      return text.includes(emDash) || text.includes(entity)
    })
    expect(offenders).toEqual([])
  })
})

describe('games', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = games.map((g) => g.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('gives every game RAM guidance we can turn into a plan suggestion', () => {
    for (const game of games) {
      expect(game.recommendedRam.length, game.slug).toBeGreaterThan(0)
      for (const row of game.recommendedRam) {
        expect(ramNeedGb(row), `${game.slug}: ${row.ram}`).toBeGreaterThan(0)
      }
    }
  })

  it('features at least one game', () => {
    expect(games.some((g) => g.featured)).toBe(true)
  })

  it('lists RAM rows smallest first, since the first row sets the "from" price', () => {
    for (const game of games) {
      const needs = game.recommendedRam.map(ramNeedGb)
      expect(needs, game.slug).toEqual([...needs].sort((a, b) => a - b))
    }
  })

  it('reads the top of a RAM range, decimals included', () => {
    expect(ramNeedGb({ players: '', ram: '2-4GB' })).toBe(4)
    expect(ramNeedGb({ players: '', ram: '16GB+ per map' })).toBe(16)
    expect(ramNeedGb({ players: '', ram: '1.5GB' })).toBe(1.5)
  })
})

describe('SLA targets', () => {
  it('covers every service once', () => {
    const services = uptimeTargets.map((t) => t.service)
    expect(new Set(services).size).toBe(services.length)
  })

  it('keeps VPS and web hosting equal, which the Refund Policy wording assumes', () => {
    // content/legal/refund.tsx says "{vps} for VPS and Web hosting". If these
    // ever differ, that sentence needs rewording.
    expect(uptimeTarget('vps')).toBe(uptimeTarget('web'))
  })
})

describe('legal documents', () => {
  it('have unique keys and paths, each with an effective date', () => {
    const keys = legalPages.map((p) => p.key)
    const hrefs = legalPages.map((p) => p.href)
    expect(new Set(keys).size).toBe(keys.length)
    expect(new Set(hrefs).size).toBe(hrefs.length)
    for (const page of legalPages) {
      expect(siteConfig.legal.effectiveDates[page.key], page.key).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    }
  })
})

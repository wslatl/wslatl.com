import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { games, ramNeedGb } from '@/data/games'
import { legalPages } from '@/data/legal'
import { uptimeTarget, uptimeTargets } from '@/data/sla'
import { siteConfig } from '@/config/site'
import { scrambleEmail, unscrambleEmail } from '@/lib/email-cipher'

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
    const files = ['app', 'components', 'config', 'content', 'data', 'i18n', 'lib', 'scripts', 'tests', '.github']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .concat(
        [
          'README.md',
          'package.json',
          'next.config.mjs',
          'eslint.config.mjs',
          'vitest.config.mts',
          'lighthouserc.json',
          'lychee.toml',
        ].map((f) => join(root, f)),
      )
    // Built from parts so this file does not match itself.
    const emDash = String.fromCharCode(0x2014)
    const entity = ['&', 'mdash;'].join('')
    const offenders = files.filter((file) => {
      const text = readFileSync(file, 'utf8')
      return text.includes(emDash) || text.includes(entity)
    })
    expect(offenders).toEqual([])
  })
})

describe('legal paths', () => {
  it('links to legal documents through siteConfig.paths, never a hard-coded path', () => {
    // A literal "/terms" silently goes stale when documents move (they did,
    // to /legal/...). Every legal link has to come from config.
    const slugs = legalPages.map((page) => page.href.split('/').pop())
    const literal = new RegExp(`["'\`]/(legal/)?(${slugs.join('|')})["'\`#]`)
    const offenders = ['app', 'components', 'content', 'data', 'lib']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => literal.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })
})

describe('legal documents render as sentences', () => {
  it('never runs a component into the next word', () => {
    // JSX drops the newline after <Email /> or <ShortLink />, so a line that
    // ends with one and continues on the next needs {' '} or the page reads
    // "contact us at support@wslatl.comand we will provide it."
    const runTogether = /<(Email|ShortLink)\b[^>]*\/>\n\s+[\p{L}]/gu
    const offenders = sourceFiles(join(root, 'content', 'legal'))
      .filter((file) => file.endsWith('.tsx'))
      .flatMap((file) => {
        const text = readFileSync(file, 'utf8')
        return [...text.matchAll(runTogether)].map(
          (match) => `${relative(root, file)}:${text.slice(0, match.index).split('\n').length}`,
        )
      })
    expect(offenders).toEqual([])
  })
})

describe('email protection', () => {
  it('keeps every address in config/emails.ts, so pages can only render them through <Email>', () => {
    const address = /[a-z0-9._%+-]+@wslatl\.com/i
    const offenders = ['app', 'components', 'config', 'content', 'data', 'lib']
      .flatMap((dir) => sourceFiles(join(root, dir)))
      .filter((file) => !file.endsWith(join('config', 'emails.ts')))
      .filter((file) => address.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('scrambles an address beyond what a harvester matches, and gets it back', () => {
    for (const address of ['support@wslatl.com', 'dmca@wslatl.com', 'a.b+c@example.org']) {
      const code = scrambleEmail(address)
      expect(code).toMatch(/^[0-9a-f]+$/)
      expect(code).not.toContain('@')
      expect(unscrambleEmail(code)).toBe(address)
    }
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
      expect(needs, game.slug).toEqual(needs.toSorted((a, b) => a - b))
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
      expect(siteConfig.legal.effectiveDates[page.key], page.key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

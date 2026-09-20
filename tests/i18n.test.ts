import { describe, expect, it } from 'vitest'
import { defaultLocale, isLocale, localeNames, localePath, locales, openGraphLocales, stripLocale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { errorCopy } from '@/i18n/error-copy'
import { translationFor } from '@/i18n/content'
import { services } from '@/data/services'
import { commitments, features } from '@/data/features'
import { faqs } from '@/data/faqs'
import { team } from '@/data/team'
import { uptimeTargets } from '@/data/sla'
import { productLines } from '@/data/pricing'
import { games, gameCategories } from '@/data/games'
import { legalPages } from '@/data/legal'

const others = locales.filter((locale) => locale !== defaultLocale)

/** Text that reads as words, so it needs translating, unlike "99.9%". */
const wordy = (text: string) => /[a-z]{3,}/i.test(text.replace(/GB/gi, ''))

/** Fails with the ids a language is missing, rather than just a count. */
function cover(name: string, ids: string[], entries: Record<string, unknown> | undefined) {
  expect(ids.filter((id) => !entries?.[id]), name).toEqual([])
}

/** Every string in a dictionary, as "path: value" pairs. Functions are skipped. */
function strings(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, inner]) => strings(inner, path ? `${path}.${key}` : key))
  }
  return []
}

describe('languages', () => {
  it('has a name and an Open Graph locale for each', () => {
    for (const locale of locales) {
      expect(localeNames[locale], locale).toBeTruthy()
      expect(openGraphLocales[locale], locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/)
    }
    expect(isLocale('en')).toBe(true)
    expect(isLocale('xx')).toBe(false)
  })

  it('puts English at the plain path and every other language under its own', () => {
    expect(localePath('en', '/pricing')).toBe('/pricing')
    expect(localePath('es', '/pricing')).toBe('/es/pricing')
    expect(localePath('es', '/')).toBe('/es')
    // An anchor stays at the end, where a browser expects it.
    expect(localePath('fr', '/#contact')).toBe('/fr#contact')
    expect(localePath('en', '/#contact')).toBe('/#contact')
  })

  it('takes a language back off a path', () => {
    for (const locale of locales) expect(stripLocale(localePath(locale, '/games'))).toBe('/games')
    expect(stripLocale('/')).toBe('/')
    // A path that merely starts with two letters is not a language.
    expect(stripLocale('/games')).toBe('/games')
  })
})

describe('site copy', () => {
  it('gives every language the same keys as English', () => {
    const english = strings(copyFor(defaultLocale)).map(([path]) => path)
    for (const locale of others) {
      expect(strings(copyFor(locale)).map(([path]) => path), locale).toEqual(english)
    }
  })

  it('has no empty string in any language', () => {
    for (const locale of locales) {
      const empty = strings(copyFor(locale)).filter(([, value]) => value.trim() === '')
      expect(empty, locale).toEqual([])
    }
  })

  it('actually translates: most strings differ from the English', () => {
    // Brand and product names are the same in every language, so this is a
    // floor, not a target. A language left in English lands far below it.
    const english = new Map(strings(copyFor(defaultLocale)))
    for (const locale of others) {
      const pairs = strings(copyFor(locale))
      const translated = pairs.filter(([path, value]) => english.get(path) !== value)
      expect(translated.length / pairs.length, `${locale} is mostly English`).toBeGreaterThan(0.6)
    }
  })

  it('keeps the placeholders the browser fills in', () => {
    for (const locale of locales) {
      const directory = copyFor(locale).games
      expect(directory.matchCount, locale).toContain('{shown}')
      expect(directory.matchCount, locale).toContain('{total}')
      expect(directory.showing, locale).toContain('{shown}')
      expect(directory.noMatch, locale).toContain('{query}')
      expect(directory.toStart, locale).toContain('{ram}')
      expect(directory.fromPrice, locale).toContain('{price}')
    }
  })

  it('keeps the slogan in English, because it is the brand', () => {
    for (const locale of locales) {
      const hero = copyFor(locale).home.hero
      expect(`${hero.lineOne} ${hero.emphasis} ${hero.lineTwo}`, locale).toBe('Hosting that actually gives a damn.')
    }
  })

  it('translates the error boundary, which carries its own words', () => {
    for (const locale of others) {
      expect(errorCopy[locale].heading, locale).not.toBe(errorCopy.en.heading)
      expect(errorCopy[locale].tryAgain, locale).not.toBe(errorCopy.en.tryAgain)
    }
  })
})

describe('content translations', () => {
  it('covers every piece of text the data files hold', () => {
    for (const locale of others) {
      const t = translationFor(locale)
      expect(t, locale).toBeDefined()
      cover(`${locale} services`, services.map((s) => s.id), t?.services)
      cover(`${locale} commitments`, commitments.map((c) => c.id), t?.commitments)
      cover(`${locale} features`, features.map((f) => f.id), t?.features)
      cover(`${locale} faqs`, faqs.map((f) => f.id), t?.faqs)
      cover(`${locale} team`, team.map((m) => m.name), t?.team)
      cover(`${locale} sla`, uptimeTargets.map((row) => row.service), t?.sla)
      cover(`${locale} pricing lines`, productLines.map((line) => line.id), t?.pricing?.lines)
      cover(
        `${locale} pricing groups`,
        productLines.flatMap((line) => line.groups.map((group) => group.id)),
        t?.pricing?.groups,
      )
      cover(`${locale} games`, games.map((game) => game.slug), t?.games)
      cover(`${locale} game categories`, [...gameCategories], t?.gameCategories)
      cover(`${locale} legal`, legalPages.map((page) => page.key), t?.legal)
      expect(t?.leadFeature?.title, `${locale} lead feature`).toBeTruthy()
      expect(t?.reviews?.title, `${locale} reviews`).toBeTruthy()
    }
  })

  it('translates the figures that are words rather than numbers', () => {
    // "99.9%" reads the same everywhere; "Under 1 hr", "Same day" and
    // "16GB+ per map" do not.
    const ramLabels = [...new Set(games.flatMap((g) => g.recommendedRam.map((row) => row.ram)).filter(wordy))]
    const values = commitments.filter((c) => wordy(c.value)).map((c) => c.id)
    const targets = uptimeTargets.filter((row) => wordy(row.target)).map((row) => row.service)

    for (const locale of others) {
      const t = translationFor(locale)
      expect(ramLabels.filter((ram) => !t?.ramLabels?.[ram]), `${locale} RAM labels`).toEqual([])
      expect(values.filter((id) => !t?.commitments?.[id]?.value), `${locale} commitment figures`).toEqual([])
      expect(targets.filter((service) => !t?.sla?.[service]?.target), `${locale} uptime targets`).toEqual([])
    }
  })

  it('keeps every game entry complete, with the same number of setups and questions', () => {
    for (const locale of others) {
      const t = translationFor(locale)
      const problems = games.flatMap((game) => {
        const entry = t?.games?.[game.slug]
        if (!entry) return [`${locale} ${game.slug}: missing`]
        const issues: string[] = []
        if (!entry.tagline || !entry.description) issues.push(`${locale} ${game.slug}: no tagline or description`)
        if (entry.setups.length !== game.recommendedRam.length) {
          issues.push(`${locale} ${game.slug}: ${entry.setups.length} setups for ${game.recommendedRam.length} rows`)
        }
        if (entry.faqs.length !== game.faqs.length) {
          issues.push(`${locale} ${game.slug}: ${entry.faqs.length} questions for ${game.faqs.length}`)
        }
        if (entry.popularFor.length !== game.popularFor.length) {
          issues.push(`${locale} ${game.slug}: ${entry.popularFor.length} uses for ${game.popularFor.length}`)
        }
        return issues
      })
      expect(problems, locale).toEqual([])
    }
  })
})

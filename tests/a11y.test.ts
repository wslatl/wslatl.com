import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { defaultLocale, locales } from '@/i18n/config'
import { axeTags, buildReport, kindOf, missingPath, pagesToCheck } from '../scripts/lib/a11y.mjs'

// Built from character codes so this file holds no such character itself.
const dash = new RegExp(`[${[0x2013, 0x2014, 0xb7].map((code) => String.fromCharCode(code)).join('')}]`)

/** The site's own sitemap, as the XML scripts/check-a11y.mjs reads from a running copy. */
const xml = `<urlset>${sitemap()
  .map((entry) => `<url><loc>${entry.url}</loc></url>`)
  .join('')}</urlset>`

const localeOf = (path: string) => locales.find((l) => path === `/${l}` || path.startsWith(`/${l}/`)) ?? defaultLocale
const withoutLocale = (path: string) => (localeOf(path) === defaultLocale ? path : path.slice(3) || '/')

describe('the pages the accessibility check opens', () => {
  it('sorts addresses into kinds of page', () => {
    expect(kindOf('/')).toBe('/')
    expect(kindOf('/pricing')).toBe('/pricing')
    expect(kindOf('/games/minecraft')).toBe('/games/*')
    expect(kindOf('/legal/privacy')).toBe('/legal/*')
  })

  it('are one page of every kind the sitemap has, in every language', () => {
    const pages = pagesToCheck(xml).filter((page) => page.status === 200 && page.path !== '/admin/login')
    const kinds = new Set(sitemap().map((entry) => kindOf(withoutLocale(new URL(entry.url).pathname))))
    expect(kinds.size).toBeGreaterThan(5)
    for (const locale of locales) {
      const mine = pages.filter((page) => localeOf(page.path) === locale).map((page) => kindOf(withoutLocale(page.path)))
      expect(mine.toSorted(), locale).toEqual([...kinds].toSorted())
    }
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length)
  })

  it('include the 404 page in every language, which must answer 404, and the admin sign-in page', () => {
    const missing = pagesToCheck(xml).filter((page) => page.status === 404)
    expect(missing.map((page) => page.path).toSorted()).toEqual(
      locales.map((l) => (l === defaultLocale ? missingPath : `/${l}${missingPath}`)).toSorted(),
    )
    expect(pagesToCheck(xml)).toContainEqual({ path: '/admin/login', status: 200 })
  })

  it('are checked against WCAG 2.2 A and AA and the best practices', () => {
    expect(axeTags).toEqual(expect.arrayContaining(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']))
  })
})

/** An axe violation, as it reports one, on two elements. */
const violation = (id: string, impact: string, help = 'Something is wrong') => ({
  id,
  impact,
  help,
  helpUrl: `https://dequeuniversity.com/rules/axe/4.14/${id}`,
  nodes: [{ target: ['main > p'] }, { target: ['footer a'] }],
})

describe('the accessibility report', () => {
  it('passes when every page was checked and nothing was found', () => {
    const { text, failed } = buildReport('http://localhost:3100', [
      { path: '/', width: 'phone', violations: [] },
      { path: '/', width: 'desktop', violations: [] },
    ])
    expect(failed).toBe(false)
    expect(text).toContain('No violations in 2 checks: 1 page, each at every width')
  })

  it('fails on a violation, grouped by rule, the worst first, with every page it was on', () => {
    const { text, failed } = buildReport('http://localhost:3100', [
      { path: '/es/pricing', width: 'phone', violations: [violation('heading-order', 'moderate')] },
      { path: '/de', width: 'desktop', violations: [violation('color-contrast', 'serious'), violation('heading-order', 'moderate')] },
    ])
    expect(failed).toBe(true)
    expect(text).toContain('2 rules broken')
    expect(text.indexOf('color-contrast')).toBeLessThan(text.indexOf('heading-order'))
    expect(text).toContain('/es/pricing (phone), /de (desktop)')
    expect(text).toMatch(/heading-order: Something is wrong \| moderate \| 4 \|/)
  })

  it('fails on a page that could not be checked, and says why', () => {
    const { text, failed } = buildReport('http://localhost:3100', [{ path: '/admin/login', width: 'phone', error: 'answered 404, not 200' }])
    expect(failed).toBe(true)
    expect(text).toContain('| /admin/login | phone | answered 404, not 200 |')
  })

  it('keeps pipes and the dashes the house style leaves out away from what axe says', () => {
    const odd = `Lists ${String.fromCharCode(0x2014)} and | tables ${String.fromCharCode(0xb7)} done`
    const { text } = buildReport('http://localhost:3100', [{ path: '/', width: 'phone', violations: [violation('list', 'serious', odd)] }])
    expect(text).not.toMatch(dash)
    expect(text).toContain('Lists - and \\| tables , done')
  })
})

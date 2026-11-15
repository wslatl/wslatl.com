// What scripts/check-a11y.mjs checks and how it reports, kept apart from the
// browser so tests/a11y.test.ts can cover it without one.
import { defaultLocale, locales, localeOfPath, pathWithoutLocale, readSitemap } from './seo-rules.mjs'

/**
 * Every rule axe has for WCAG 2.0, 2.1 and 2.2 at levels A and AA, and its
 * best practices on top (one main landmark, everything inside a landmark,
 * headings in order), which the site meets as well.
 */
export const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

/** An address no page will ever have, for the 404 page. */
export const missingPath = '/this-page-does-not-exist'

/**
 * The kind of page an address without its language is: its section, with a
 * star for a page inside one. /games/minecraft is /games/*, /pricing is
 * /pricing, the home page is /.
 * @param {string} path
 */
export function kindOf(path) {
  const [section, inner] = path.split('/').filter(Boolean)
  if (!section) return '/'
  return inner ? `/${section}/*` : `/${section}`
}

/**
 * The pages to check, each with the status it must answer: one page of every
 * kind in every language (the first of each the sitemap lists, so a kind of
 * page added later is checked without anyone listing it), then the 404 page
 * in each language, and the admin's sign-in page.
 * @param {string} sitemapXml
 * @returns {{ path: string, status: number }[]}
 */
export function pagesToCheck(sitemapXml) {
  /** @type {Map<string, string>} */
  const chosen = new Map()
  for (const { loc } of readSitemap(sitemapXml)) {
    const { pathname } = new URL(loc)
    const key = `${localeOfPath(pathname)} ${kindOf(pathWithoutLocale(pathname))}`
    if (!chosen.has(key)) chosen.set(key, pathname)
  }
  const missing = locales.map((locale) => (locale === defaultLocale ? missingPath : `/${locale}${missingPath}`))
  return [
    ...[...chosen.values()].map((path) => ({ path, status: 200 })),
    ...missing.map((path) => ({ path, status: 404 })),
    { path: '/admin/login', status: 200 },
  ]
}

const impactOrder = ['critical', 'serious', 'moderate', 'minor']

/** The dashes and the dot the house style leaves out, built from their codes so this file holds none of them. */
const dashes = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`, 'g')
const middleDot = String.fromCharCode(0xb7)

/** Text from axe or a page for one table cell: one line, no pipes, and no dashes the house style leaves out. */
const cell = (text) =>
  String(text ?? '')
    .replaceAll(dashes, '-')
    .replaceAll(middleDot, ',')
    .replaceAll('|', '\\|')
    .replaceAll(/\s+/g, ' ')
    .trim()

/**
 * @typedef {{ id: string, impact?: string | null, help: string, helpUrl: string, nodes: { target: unknown[] }[] }} Violation
 * @typedef {{ path: string, width: string, violations?: Violation[], error?: string }} PageResult
 */

/**
 * The Markdown report, and whether anything failed: a violation, or a page
 * that could not be checked. Violations are grouped by rule, worst first,
 * with the pages each was found on and one element it was found in.
 * @param {string} origin
 * @param {PageResult[]} results one per page and width
 */
export function buildReport(origin, results) {
  const errors = results.filter((r) => r.error)
  /** @type {Map<string, { violation: Violation, where: string[], elements: number }>} */
  const rules = new Map()
  for (const { path, width, violations = [] } of results) {
    for (const violation of violations) {
      const rule = rules.get(violation.id) ?? { violation, where: [], elements: 0 }
      rule.where.push(`${path} (${width})`)
      rule.elements += violation.nodes.length
      rules.set(violation.id, rule)
    }
  }
  const sorted = [...rules.values()].toSorted(
    (a, b) => impactOrder.indexOf(a.violation.impact ?? 'minor') - impactOrder.indexOf(b.violation.impact ?? 'minor'),
  )
  const lines = [`## Accessibility check: ${origin}`, '']
  if (sorted.length === 0 && errors.length === 0) {
    const pages = new Set(results.map((r) => r.path)).size
    lines.push(
      `No violations in ${results.length} checks: ${pages} page${pages === 1 ? '' : 's'}, each at every width, against axe's rules for ${axeTags.join(', ')}.`,
    )
  } else {
    lines.push(`**${sorted.length} rule${sorted.length === 1 ? '' : 's'} broken, ${errors.length} page${errors.length === 1 ? '' : 's'} not checked**, out of ${results.length} checks.`)
  }
  if (sorted.length > 0) {
    lines.push('', '| Rule | Impact | Elements | Pages | First element | How to fix |', '| --- | --- | --- | --- | --- | --- |')
    for (const { violation, where, elements } of sorted) {
      const shown = where.slice(0, 6).join(', ') + (where.length > 6 ? `, and ${where.length - 6} more` : '')
      const first = JSON.stringify(violation.nodes[0]?.target ?? [])
      lines.push(
        `| ${cell(violation.id)}: ${cell(violation.help)} | ${cell(violation.impact ?? 'unknown')} | ${elements} | ${cell(shown)} | \`${cell(first).replaceAll('`', "'")}\` | [axe](${violation.helpUrl}) |`,
      )
    }
  }
  if (errors.length > 0) {
    lines.push('', '| Page | Width | Why it was not checked |', '| --- | --- | --- |')
    for (const { path, width, error } of errors) lines.push(`| ${cell(path)} | ${cell(width)} | ${cell(error)} |`)
  }
  lines.push('', `Checked ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC.`)
  return { text: `${lines.join('\n')}\n`, failed: sorted.length > 0 || errors.length > 0 }
}

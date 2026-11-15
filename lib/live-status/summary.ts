import type { LocationState } from '@/lib/live-status/snapshot'
import { fill } from '@/lib/utils'

/**
 * The words the live panel puts together from numbers: the "+N more
 * locations" row and the line that sums up every location's state. Plain
 * functions, so the server (the row) and the browser (the line) share them.
 */

/** A wording in the form for one and the form for more, from i18n/copy. */
export type PluralForms = { one: string; other: string }

/** The form a language uses for this count, as Intl.PluralRules has it. */
export function pluralOf(forms: PluralForms, count: number, locale: string): string {
  return new Intl.PluralRules(locale).select(count) === 'one' ? forms.one : forms.other
}

/**
 * What every location's state comes to. Issues (a partial outage or an
 * outage) come first, coloured for the worst of them, then maintenance; "all
 * operational" only when every location is known to be. Null when no
 * location has a state.
 */
export type Summary =
  | { kind: 'allUp'; total: number }
  | { kind: 'issues'; count: number; total: number; tone: 'warning' | 'danger' }
  | { kind: 'maintenance'; count: number; total: number }
  | { kind: 'someUp'; count: number; total: number }

export function summarize(states: readonly LocationState[]): Summary | null {
  const total = states.length
  const issues = states.filter((state) => state === 'partial' || state === 'down').length
  const maintenance = states.filter((state) => state === 'maintenance').length
  const up = states.filter((state) => state === 'up').length
  if (issues > 0) return { kind: 'issues', count: issues, total, tone: states.includes('down') ? 'danger' : 'warning' }
  if (maintenance > 0) return { kind: 'maintenance', count: maintenance, total }
  if (up === 0) return null
  return up === total ? { kind: 'allUp', total } : { kind: 'someUp', count: up, total }
}

/** The wordings of a summary, from home.hero.live.summary in i18n/copy. */
export interface SummaryLabels {
  allUp: string
  issues: PluralForms
  maintenance: PluralForms
  someUp: PluralForms
}

/** A summary in words, in the page's language. */
export function summaryText(summary: Summary, labels: SummaryLabels, locale: string): string {
  if (summary.kind === 'allUp') return fill(labels.allUp, { total: summary.total })
  return fill(pluralOf(labels[summary.kind], summary.count, locale), { count: summary.count, total: summary.total })
}

import { links } from './links'

export const siteConfig = {
  name: 'WSLATL LLC',
  description: 'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting.',
  shortDescription: 'Private hosting, personal service.',
  location: 'Missouri, USA',
  jurisdiction: 'WSLATL LLC, Missouri, USA',
  siteUrl: 'https://wslatl.com',

  // Short paths (/billing, /discord, ...) that redirect to each panel and
  // profile. Destinations live in config/links.json; see config/links.ts.
  links,

  // Legal documents live under /legal. Their old top-level paths (/privacy,
  // /terms, ...) permanently redirect here; see next.config.mjs.
  paths: {
    privacy:        '/legal/privacy',
    terms:          '/legal/terms',
    acceptableUse:  '/legal/acceptable-use',
    abuse:          '/legal/abuse',
    refund:         '/legal/refund',
    sla:            '/legal/sla',
    dmca:           '/legal/dmca',
    accountCredit:  '/legal/account-credit',
    subprocessors:  '/legal/subprocessors',
    backups:        '/legal/backups',
    contact:        '/#contact',
  },

  credits: {
    label: 'Made by RejectModders',
  },

  legal: {
    companyName:   'WSLATL LLC',
    mailingAddress: 'Missouri, United States',

    /**
     * Fallback effective date. Only used if a document has no entry in
     * `effectiveDates` below. Prefer adding an entry there instead.
     */
    effectiveDate: 'July 21, 2026',

    /**
     * Per-document effective dates.
     *
     * Each legal document carries its own date so that revising one policy
     * does not silently re-date the others. When you change the substance of
     * a document, bump ONLY that document's entry to the date the revision
     * actually takes effect.
     */
    effectiveDates: {
      privacy:        'July 21, 2026',
      terms:          'July 21, 2026',
      acceptableUse:  'July 21, 2026',
      abuse:          'July 21, 2026',
      refund:         'July 21, 2026',
      sla:            'July 21, 2026',
      dmca:           'July 21, 2026',
      accountCredit:  'July 21, 2026',
      subprocessors:  'July 21, 2026',
      backups:        'July 21, 2026',
    },
  },
} as const

export type SiteConfig = typeof siteConfig

/** Keys of the per-document effective date map. */
export type LegalDocumentKey = keyof typeof siteConfig.legal.effectiveDates

/**
 * Effective date for a single legal document, falling back to the shared date
 * if the document has no entry of its own.
 */
export function legalEffectiveDate(doc: LegalDocumentKey): string {
  return siteConfig.legal.effectiveDates[doc] ?? siteConfig.legal.effectiveDate
}

import { links } from './links'

export const siteConfig = {
  name: 'WSLATL LLC',
  /**
   * The name the site goes by in search results, browser tabs and link
   * previews: the brand people type, without the "LLC". It is the WebSite
   * name Google reads for the site name in results, so it must match what
   * the titles end with (app/[locale]/layout.tsx and lib/metadata.ts).
   */
  brand: 'WSLATL',
  /** Never translated: it stays in English on every page, marked lang="en". */
  slogan: 'Hosting that actually gives a damn.',
  description: 'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting.',
  shortDescription: 'Private hosting, personal service.',
  location: 'Missouri, USA',
  jurisdiction: 'WSLATL LLC, Missouri, USA',
  siteUrl: 'https://wslatl.com',
  /**
   * The knowledge base, linked directly rather than through a short link:
   * every page there has its own address in each language, and a redirect
   * in between would hide those links from search engines. See
   * lib/knowledge-base.ts.
   */
  knowledgeBaseUrl: 'https://knowledge.wslatl.com',

  /**
   * The brand blue, matching --primary in app/globals.css, and the near-black
   * page background. The browser theme colour (app/[locale]/layout.tsx) and
   * the web app manifest (app/manifest.ts) both read these.
   */
  themeColor: '#0073c7',
  backgroundColor: '#050505',

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
     * Per-document effective dates, as YYYY-MM-DD. They are written out in
     * the reader's language by formatLegalDate (i18n/dates.ts).
     *
     * Each legal document carries its own date so that revising one policy
     * does not silently re-date the others. When you change the substance of
     * a document, bump ONLY that document's entry to the date the revision
     * actually takes effect.
     */
    effectiveDates: {
      privacy:        '2026-10-19',
      terms:          '2026-11-02',
      acceptableUse:  '2026-09-19',
      abuse:          '2026-09-19',
      refund:         '2026-09-19',
      sla:            '2026-09-19',
      dmca:           '2026-09-19',
      accountCredit:  '2026-10-19',
      subprocessors:  '2026-10-19',
      backups:        '2026-10-19',
    },
  },
} as const

/** Keys of the per-document effective date map. */
export type LegalDocumentKey = keyof typeof siteConfig.legal.effectiveDates

/**
 * Effective date for a single legal document. Every document has its own
 * entry in effectiveDates (LegalDocumentKey is built from that map), so
 * there is nothing to fall back to.
 */
export function legalEffectiveDate(doc: LegalDocumentKey): string {
  return siteConfig.legal.effectiveDates[doc]
}

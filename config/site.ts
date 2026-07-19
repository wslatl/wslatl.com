export const siteConfig = {
  name: 'WSLATL LLC',
  description: 'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting.',
  shortDescription: 'Private hosting, personal service.',
  location: 'Missouri, USA',
  jurisdiction: 'WSLATL LLC, Missouri, USA',
  siteUrl: 'https://wslatl.com',

  links: {
    site:        'https://wslatl.com',
    billing:     'https://billing.wslatl.com',
    register:    'https://billing.wslatl.com/register',
    gamingPanel: 'https://panel.wslatl.com',
    vpsPanel:    'https://vps.wslatl.com',
    cPanel:      'https://r3.directdns.com:2083/',
    dedicated:   'https://dedicated.wslatl.com/',
    discord:     'https://discord.gg/3eKawhSbAF',
    discordVanity: 'https://discord.gg/3eKawhSbAF',
    status:      'https://status.wslatl.com',
    github:      'https://github.com/wslatl',
  },

  paths: {
    privacy:        '/privacy',
    terms:          '/terms',
    acceptableUse:  '/acceptable-use',
    refund:         '/refund',
    sla:            '/sla',
    dmca:           '/dmca',
    accountCredit:  '/account-credit',
    subprocessors:  '/subprocessors',
    backups:        '/backups',
    contact:        '/#contact',
  },

  email: {
    support: 'support@wslatl.com',
    info:    'info@wslatl.com',
  },

  trustpilot: {
    profileUrl: 'https://www.trustpilot.com/review/wslatl.com',
  },

  credits: {
    label: 'Made by RejectModders',
    href:  'https://rejectmodders.dev',
  },

  legal: {
    companyName:   'WSLATL LLC',
    mailingAddress: 'Missouri, United States',
    discordVanity:  'discord.gg/3eKawhSbAF',

    /**
     * Fallback effective date. Only used if a document has no entry in
     * `effectiveDates` below. Prefer adding an entry there instead.
     */
    effectiveDate: 'June 3, 2026',

    /**
     * Per-document effective dates.
     *
     * Each legal document carries its own date so that revising one policy
     * does not silently re-date the others. When you change the substance of
     * a document, bump ONLY that document's entry to the date the revision
     * actually takes effect.
     */
    effectiveDates: {
      privacy:        'July 19, 2026',
      terms:          'July 19, 2026',
      acceptableUse:  'June 3, 2026',
      refund:         'July 19, 2026',
      sla:            'July 19, 2026',
      dmca:           'July 19, 2026',
      accountCredit:  'July 19, 2026',
      subprocessors:  'July 19, 2026',
      backups:        'July 19, 2026',
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

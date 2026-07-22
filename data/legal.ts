export interface LegalPage {
  label: string
  href: string
  /**
   * Primary documents get a permanent pill in the legal page switcher.
   * Secondary documents live behind the "More legal" overflow menu so the
   * pill row does not wrap into a wall of links on small screens.
   */
  tier: 'primary' | 'secondary'
  /** Short label used inside the overflow menu where there is more room. */
  summary?: string
}

export const legalPages: LegalPage[] = [
  { label: 'Privacy Policy',   href: '/privacy',         tier: 'primary' },
  { label: 'Terms of Service', href: '/terms',           tier: 'primary' },
  { label: 'Acceptable Use',   href: '/acceptable-use',  tier: 'primary' },
  { label: 'Refund Policy',    href: '/refund',          tier: 'primary' },

  { label: 'Service Level Agreement', href: '/sla',            tier: 'secondary', summary: 'Uptime targets and service credits' },
  { label: 'DMCA Policy',             href: '/dmca',           tier: 'secondary', summary: 'Copyright notices and counter-notices' },
  { label: 'Abuse Policy',            href: '/abuse',          tier: 'secondary', summary: 'Report abuse of our infrastructure' },
  { label: 'Account Credit',          href: '/account-credit', tier: 'secondary', summary: 'Stored value, gifting, and balances' },
  { label: 'Subprocessors',           href: '/subprocessors',  tier: 'secondary', summary: 'Who else touches your data' },
  { label: 'Backups',                 href: '/backups',        tier: 'secondary', summary: 'What is backed up and who owns it' },
]

export const primaryLegalPages = legalPages.filter((page) => page.tier === 'primary')
export const secondaryLegalPages = legalPages.filter((page) => page.tier === 'secondary')

import { siteConfig, type LegalDocumentKey } from '@/config/site'

export interface LegalPage {
  /** Key into `siteConfig.legal.effectiveDates`. */
  key: LegalDocumentKey
  /** Short name for navigation lists. */
  label: string
  /** Full document title, used for the page heading and <title>. */
  title: string
  href: string
  /** Meta description for search results and link previews. */
  metaDescription: string
  /** Plain-language summary shown under the page title. */
  intro: string
}

export const legalPages: LegalPage[] = [
  {
    key: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    href: siteConfig.paths.privacy,
    metaDescription: 'How WSLATL LLC collects, uses, and protects your personal information.',
    intro:
      'We collect only what we need to run your services. We do not sell your data, ever. Here is exactly what we do with the information you share with us.',
  },
  {
    key: 'terms',
    label: 'Terms of Service',
    title: 'Terms of Service',
    href: siteConfig.paths.terms,
    metaDescription: 'The terms and conditions governing your use of WSLATL LLC hosting services.',
    intro:
      'These terms govern your use of all services provided by WSLATL LLC. Please read them carefully before using our services. By using any WSLATL service, you agree to these terms.',
  },
  {
    key: 'acceptableUse',
    label: 'Acceptable Use',
    title: 'Acceptable Use Policy',
    href: siteConfig.paths.acceptableUse,
    metaDescription: 'What is and is not permitted on WSLATL LLC hosting infrastructure.',
    intro:
      'Our infrastructure is shared between clients. One bad actor affects everyone. This policy defines what is and is not acceptable on WSLATL servers. Read it. Follow it. We enforce it.',
  },
  {
    key: 'refund',
    label: 'Refund Policy',
    title: 'Refund Policy',
    href: siteConfig.paths.refund,
    metaDescription:
      'How WSLATL LLC handles refund requests, including the 48-hour and 14-day refund windows, eligible reasons, and non-refundable items.',
    intro:
      'We keep our refund policy straightforward. A 48-hour window for any reason. A 14-day window for real problems. Read on for exactly what is and is not eligible.',
  },
  {
    key: 'sla',
    label: 'Service Level Agreement',
    title: 'Service Level Agreement',
    href: siteConfig.paths.sla,
    metaDescription:
      'WSLATL LLC uptime targets by service type, scheduled maintenance notice, and how to claim a service credit.',
    intro:
      'Our uptime targets by service type, how we handle maintenance, and the service credit you can claim when we miss a target. This restates Section 5 of our Terms of Service.',
  },
  {
    key: 'dmca',
    label: 'DMCA Policy',
    title: 'DMCA Policy',
    href: siteConfig.paths.dmca,
    metaDescription:
      'How to file a copyright takedown notice or counter-notice with WSLATL LLC, and our repeat infringer policy under 17 U.S.C. 512.',
    intro:
      'How to report copyright infringement on WSLATL infrastructure, how a client disputes a removal, and what happens to accounts that infringe repeatedly.',
  },
  {
    key: 'abuse',
    label: 'Abuse Policy',
    title: 'Abuse Policy',
    href: siteConfig.paths.abuse,
    metaDescription:
      'How to report abuse of WSLATL LLC infrastructure (spam, network attacks, phishing, malware, illegal content) and how we handle reports.',
    intro:
      'How to report abuse of WSLATL infrastructure, what we do with a report once we have it, and how we deal with services that are the source of abuse.',
  },
  {
    key: 'accountCredit',
    label: 'Account Credit',
    title: 'Account Credit Terms',
    href: siteConfig.paths.accountCredit,
    metaDescription:
      'How account credit works at WSLATL LLC: buying credit, applying it to invoices, gifting it to another account, and what it can and cannot be used for.',
    intro:
      'Account credit is prepaid value you spend on WSLATL services. It does not expire and it is not redeemable for cash. Here is exactly how it works.',
  },
  {
    key: 'subprocessors',
    label: 'Subprocessors',
    title: 'Subprocessors',
    href: siteConfig.paths.subprocessors,
    metaDescription:
      'The third parties that process personal data on behalf of WSLATL LLC, what each one receives, and how international transfers are handled.',
    intro:
      'Every third party that touches personal data on our behalf, what they get, and why. Named, not just categorized.',
  },
  {
    key: 'backups',
    label: 'Backups',
    title: 'Backup Policy',
    href: siteConfig.paths.backups,
    metaDescription:
      'What WSLATL LLC backs up, why backups are best-effort, why you should keep your own copies, and how to request a restore.',
    intro:
      'What we back up, what a backup is and is not, and why you should keep your own copies anyway. Plus how to ask for a restore.',
  },
]

/** Every legal document is served at /legal/<slug>. */
export const LEGAL_BASE_PATH = '/legal'

/** The last path segment, for example privacy for the Privacy Policy. */
export function legalSlug(page: LegalPage): string {
  return page.href.slice(LEGAL_BASE_PATH.length + 1)
}

export function legalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((page) => legalSlug(page) === slug)
}

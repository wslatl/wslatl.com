import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import DmcaContent from '@/content/legal/dmca'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'DMCA Policy | WSLATL LLC',
  description: 'How to file a copyright takedown notice or counter-notice with WSLATL LLC, and our repeat infringer policy under 17 U.S.C. 512.',
  alternates: { canonical: `${siteConfig.siteUrl}${siteConfig.paths.dmca}` },
  openGraph: {
    title: 'DMCA Policy | WSLATL LLC',
    description: 'How to file a copyright takedown notice or counter-notice with WSLATL LLC, and our repeat infringer policy under 17 U.S.C. 512.',
    url: `${siteConfig.siteUrl}${siteConfig.paths.dmca}`,
  },
}

export default function DmcaPage() {
  return (
    <LegalLayout
      title="DMCA Policy"
      description="How to report copyright infringement on WSLATL infrastructure, how a client disputes a removal, and what happens to accounts that infringe repeatedly."
      effectiveDate={legalEffectiveDate('dmca')}
      currentPath={siteConfig.paths.dmca}
    >
      <DmcaContent />
    </LegalLayout>
  )
}

import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import AbuseContent from '@/content/legal/abuse'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Abuse Policy | WSLATL LLC',
  description: 'How to report abuse of WSLATL LLC infrastructure (spam, network attacks, phishing, malware, illegal content) and how we handle reports.',
  alternates: { canonical: `${siteConfig.siteUrl}${siteConfig.paths.abuse}` },
  openGraph: {
    title: 'Abuse Policy | WSLATL LLC',
    description: 'How to report abuse of WSLATL LLC infrastructure (spam, network attacks, phishing, malware, illegal content) and how we handle reports.',
    url: `${siteConfig.siteUrl}${siteConfig.paths.abuse}`,
  },
}

export default function AbusePage() {
  return (
    <LegalLayout
      title="Abuse Policy"
      description="How to report abuse of WSLATL infrastructure, what we do with a report once we have it, and how we deal with services that are the source of abuse."
      effectiveDate={legalEffectiveDate('abuse')}
      currentPath={siteConfig.paths.abuse}
    >
      <AbuseContent />
    </LegalLayout>
  )
}

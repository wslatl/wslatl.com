import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import PrivacyContent from '@/content/legal/privacy'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | WSLATL LLC',
  description: 'How WSLATL LLC collects, uses, and protects your personal information.',
  alternates: { canonical: `${siteConfig.siteUrl}${siteConfig.paths.privacy}` },
  openGraph: {
    title: 'Privacy Policy | WSLATL LLC',
    description: 'How WSLATL LLC collects, uses, and protects your personal information.',
    url: `${siteConfig.siteUrl}${siteConfig.paths.privacy}`,
  },
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="We collect only what we need to run your services. We do not sell your data, ever. Here is exactly what we do with the information you share with us."
      effectiveDate={legalEffectiveDate('privacy')}
      currentPath={siteConfig.paths.privacy}
    >
      <PrivacyContent />
    </LegalLayout>
  )
}

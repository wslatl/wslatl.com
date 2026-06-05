import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import AcceptableUseContent from '@/content/legal/acceptable-use'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | WSLATL LLC',
  description: 'What is and is not permitted on WSLATL LLC hosting infrastructure.',
}

export default function AcceptableUsePage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      description="Our infrastructure is shared between clients. One bad actor affects everyone. This policy defines what is and is not acceptable on WSLATL servers. Read it. Follow it. We enforce it."
      effectiveDate={siteConfig.legal.effectiveDate}
      currentPath={siteConfig.paths.acceptableUse}
    >
      <AcceptableUseContent />
    </LegalLayout>
  )
}

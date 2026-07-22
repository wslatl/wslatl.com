import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import SlaContent from '@/content/legal/sla'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Service Level Agreement | WSLATL LLC',
  description: 'WSLATL LLC uptime targets by service type, scheduled maintenance notice, and how to claim a service credit.',
}

export default function SlaPage() {
  return (
    <LegalLayout
      title="Service Level Agreement"
      description="Our uptime targets by service type, how we handle maintenance, and the service credit you can claim when we miss a target. This restates Section 5 of our Terms of Service."
      effectiveDate={legalEffectiveDate('sla')}
      currentPath={siteConfig.paths.sla}
    >
      <SlaContent />
    </LegalLayout>
  )
}

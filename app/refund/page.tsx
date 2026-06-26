import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import RefundContent from '@/content/legal/refund'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Refund Policy | WSLATL LLC',
  description: 'How WSLATL LLC handles refund requests, including the 48-hour and 14-day refund windows, eligible reasons, and non-refundable items.',
}

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      description="We keep our refund policy straightforward. A 48-hour window for any reason. A 14-day window for real problems. Read on for exactly what is and is not eligible."
      effectiveDate={siteConfig.legal.effectiveDate}
      currentPath={siteConfig.paths.refund}
    >
      <RefundContent />
    </LegalLayout>
  )
}

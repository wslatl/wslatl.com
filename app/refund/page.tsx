import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import RefundContent from '@/content/legal/refund'
import { legalPage } from '@/data/legal'

const page = legalPage('refund')

export const metadata = legalMetadata(page)

export default function RefundPage() {
  return <LegalLayout page={page} content={RefundContent} />
}

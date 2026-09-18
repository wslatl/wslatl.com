import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import SlaContent from '@/content/legal/sla'
import { legalPage } from '@/data/legal'

const page = legalPage('sla')

export const metadata = legalMetadata(page)

export default function SlaPage() {
  return <LegalLayout page={page} content={SlaContent} />
}

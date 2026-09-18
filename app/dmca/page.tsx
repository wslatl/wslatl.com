import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import DmcaContent from '@/content/legal/dmca'
import { legalPage } from '@/data/legal'

const page = legalPage('dmca')

export const metadata = legalMetadata(page)

export default function DmcaPage() {
  return <LegalLayout page={page} content={DmcaContent} />
}

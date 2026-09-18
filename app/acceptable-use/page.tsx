import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import AcceptableUseContent from '@/content/legal/acceptable-use'
import { legalPage } from '@/data/legal'

const page = legalPage('acceptableUse')

export const metadata = legalMetadata(page)

export default function AcceptableUsePage() {
  return <LegalLayout page={page} content={AcceptableUseContent} />
}

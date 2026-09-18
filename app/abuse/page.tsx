import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import AbuseContent from '@/content/legal/abuse'
import { legalPage } from '@/data/legal'

const page = legalPage('abuse')

export const metadata = legalMetadata(page)

export default function AbusePage() {
  return <LegalLayout page={page} content={AbuseContent} />
}

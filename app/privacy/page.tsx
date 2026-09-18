import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import PrivacyContent from '@/content/legal/privacy'
import { legalPage } from '@/data/legal'

const page = legalPage('privacy')

export const metadata = legalMetadata(page)

export default function PrivacyPage() {
  return <LegalLayout page={page} content={PrivacyContent} />
}

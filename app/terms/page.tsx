import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import TermsContent from '@/content/legal/terms'
import { legalPage } from '@/data/legal'

const page = legalPage('terms')

export const metadata = legalMetadata(page)

export default function TermsPage() {
  return <LegalLayout page={page} content={TermsContent} />
}

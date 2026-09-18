import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import BackupsContent from '@/content/legal/backups'
import { legalPage } from '@/data/legal'

const page = legalPage('backups')

export const metadata = legalMetadata(page)

export default function BackupsPage() {
  return <LegalLayout page={page} content={BackupsContent} />
}

import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import SubprocessorsContent from '@/content/legal/subprocessors'
import { legalPage } from '@/data/legal'

const page = legalPage('subprocessors')

export const metadata = legalMetadata(page)

export default function SubprocessorsPage() {
  return <LegalLayout page={page} content={SubprocessorsContent} />
}

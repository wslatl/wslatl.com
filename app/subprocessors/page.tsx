import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import SubprocessorsContent from '@/content/legal/subprocessors'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Subprocessors | WSLATL LLC',
  description: 'The third parties that process personal data on behalf of WSLATL LLC, what each one receives, and how international transfers are handled.',
}

export default function SubprocessorsPage() {
  return (
    <LegalLayout
      title="Subprocessors"
      description="Every third party that touches personal data on our behalf, what they get, and why. Named, not just categorized."
      effectiveDate={legalEffectiveDate('subprocessors')}
      currentPath={siteConfig.paths.subprocessors}
    >
      <SubprocessorsContent />
    </LegalLayout>
  )
}

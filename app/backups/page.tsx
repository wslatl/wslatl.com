import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import BackupsContent from '@/content/legal/backups'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Backup Policy | WSLATL LLC',
  description: 'What WSLATL LLC backs up, why backups are best-effort, why you should keep your own copies, and how to request a restore.',
}

export default function BackupsPage() {
  return (
    <LegalLayout
      title="Backup Policy"
      description="What we back up, what a backup is and is not, and why you should keep your own copies anyway. Plus how to ask for a restore."
      effectiveDate={legalEffectiveDate('backups')}
      currentPath={siteConfig.paths.backups}
    >
      <BackupsContent />
    </LegalLayout>
  )
}

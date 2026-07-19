import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import TermsContent from '@/content/legal/terms'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms of Service | WSLATL LLC',
  description: 'The terms and conditions governing your use of WSLATL LLC hosting services.',
}

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="These terms govern your use of all services provided by WSLATL LLC. Please read them carefully before using our services. By using any WSLATL service, you agree to these terms."
      effectiveDate={legalEffectiveDate('terms')}
      currentPath={siteConfig.paths.terms}
    >
      <TermsContent />
    </LegalLayout>
  )
}

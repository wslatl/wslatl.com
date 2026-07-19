import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/legal-layout'
import AccountCreditContent from '@/content/legal/account-credit'
import { siteConfig, legalEffectiveDate } from '@/config/site'

export const metadata: Metadata = {
  title: 'Account Credit Terms | WSLATL LLC',
  description: 'How account credit works at WSLATL LLC: buying credit, applying it to invoices, gifting it to another account, and what it can and cannot be used for.',
}

export default function AccountCreditPage() {
  return (
    <LegalLayout
      title="Account Credit Terms"
      description="Account credit is prepaid value you spend on WSLATL services. It does not expire and it is not redeemable for cash. Here is exactly how it works."
      effectiveDate={legalEffectiveDate('accountCredit')}
      currentPath={siteConfig.paths.accountCredit}
    >
      <AccountCreditContent />
    </LegalLayout>
  )
}

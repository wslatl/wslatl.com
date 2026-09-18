import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import AccountCreditContent from '@/content/legal/account-credit'
import { legalPage } from '@/data/legal'

const page = legalPage('accountCredit')

export const metadata = legalMetadata(page)

export default function AccountCreditPage() {
  return <LegalLayout page={page} content={AccountCreditContent} />
}

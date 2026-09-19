import type { ComponentType } from 'react'
import type { LegalDocumentKey } from '@/config/site'
import AbuseContent from './abuse'
import AcceptableUseContent from './acceptable-use'
import AccountCreditContent from './account-credit'
import BackupsContent from './backups'
import DmcaContent from './dmca'
import PrivacyContent from './privacy'
import RefundContent from './refund'
import SlaContent from './sla'
import SubprocessorsContent from './subprocessors'
import TermsContent from './terms'

/** The body of every legal document. The Record type makes a missing one a type error. */
export const legalContent: Record<LegalDocumentKey, ComponentType> = {
  privacy: PrivacyContent,
  terms: TermsContent,
  acceptableUse: AcceptableUseContent,
  abuse: AbuseContent,
  refund: RefundContent,
  sla: SlaContent,
  dmca: DmcaContent,
  accountCredit: AccountCreditContent,
  subprocessors: SubprocessorsContent,
  backups: BackupsContent,
}

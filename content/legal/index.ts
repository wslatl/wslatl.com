import type { ComponentType } from 'react'
import type { LegalDocumentKey } from '@/config/site'
import type { Locale } from '@/i18n/config'
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
import EsAbuse from './es/abuse'
import EsBackups from './es/backups'
import EsSla from './es/sla'
import EsSubprocessors from './es/subprocessors'
import FrAbuse from './fr/abuse'
import FrBackups from './fr/backups'
import FrSla from './fr/sla'
import FrSubprocessors from './fr/subprocessors'
import DeAbuse from './de/abuse'
import DeBackups from './de/backups'
import DeSla from './de/sla'
import DeSubprocessors from './de/subprocessors'
import PtAbuse from './pt/abuse'
import PtBackups from './pt/backups'
import PtSla from './pt/sla'
import PtSubprocessors from './pt/subprocessors'

/** The English body of every document. A missing one is a type error. */
const english: Record<LegalDocumentKey, ComponentType> = {
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

/**
 * Translated documents, registered as they are written. A language with no
 * entry for a document shows the English one, which is the version that
 * applies in any case (see the notice on every translated legal page).
 */
const translations: Partial<Record<Locale, Partial<Record<LegalDocumentKey, ComponentType>>>> = {
  es: {
    abuse: EsAbuse,
    backups: EsBackups,
    sla: EsSla,
    subprocessors: EsSubprocessors,
  },
  fr: {
    abuse: FrAbuse,
    backups: FrBackups,
    sla: FrSla,
    subprocessors: FrSubprocessors,
  },
  de: {
    abuse: DeAbuse,
    backups: DeBackups,
    sla: DeSla,
    subprocessors: DeSubprocessors,
  },
  pt: {
    abuse: PtAbuse,
    backups: PtBackups,
    sla: PtSla,
    subprocessors: PtSubprocessors,
  },
}

export function legalContent(locale: Locale, key: LegalDocumentKey): ComponentType {
  return translations[locale]?.[key] ?? english[key]
}

/** True when this language has its own copy of the document. */
export function hasTranslation(locale: Locale, key: LegalDocumentKey): boolean {
  return Boolean(translations[locale]?.[key])
}

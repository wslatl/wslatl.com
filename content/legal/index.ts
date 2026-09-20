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
import EsAcceptableUse from './es/acceptable-use'
import EsAccountCredit from './es/account-credit'
import EsBackups from './es/backups'
import EsDmca from './es/dmca'
import EsPrivacy from './es/privacy'
import EsRefund from './es/refund'
import EsSla from './es/sla'
import EsSubprocessors from './es/subprocessors'
import FrAbuse from './fr/abuse'
import FrAcceptableUse from './fr/acceptable-use'
import FrAccountCredit from './fr/account-credit'
import FrBackups from './fr/backups'
import FrDmca from './fr/dmca'
import FrPrivacy from './fr/privacy'
import FrRefund from './fr/refund'
import FrSla from './fr/sla'
import FrSubprocessors from './fr/subprocessors'
import DeAbuse from './de/abuse'
import DeAcceptableUse from './de/acceptable-use'
import DeAccountCredit from './de/account-credit'
import DeBackups from './de/backups'
import DeDmca from './de/dmca'
import DePrivacy from './de/privacy'
import DeRefund from './de/refund'
import DeSla from './de/sla'
import DeSubprocessors from './de/subprocessors'
import DeTerms from './de/terms'
import PtAbuse from './pt/abuse'
import PtAcceptableUse from './pt/acceptable-use'
import PtAccountCredit from './pt/account-credit'
import PtBackups from './pt/backups'
import PtDmca from './pt/dmca'
import PtPrivacy from './pt/privacy'
import PtRefund from './pt/refund'
import PtSla from './pt/sla'
import PtSubprocessors from './pt/subprocessors'
import PtTerms from './pt/terms'

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
    acceptableUse: EsAcceptableUse,
    accountCredit: EsAccountCredit,
    backups: EsBackups,
    dmca: EsDmca,
    privacy: EsPrivacy,
    refund: EsRefund,
    sla: EsSla,
    subprocessors: EsSubprocessors,
  },
  fr: {
    abuse: FrAbuse,
    acceptableUse: FrAcceptableUse,
    accountCredit: FrAccountCredit,
    backups: FrBackups,
    dmca: FrDmca,
    privacy: FrPrivacy,
    refund: FrRefund,
    sla: FrSla,
    subprocessors: FrSubprocessors,
  },
  de: {
    abuse: DeAbuse,
    acceptableUse: DeAcceptableUse,
    accountCredit: DeAccountCredit,
    backups: DeBackups,
    dmca: DeDmca,
    privacy: DePrivacy,
    refund: DeRefund,
    sla: DeSla,
    subprocessors: DeSubprocessors,
    terms: DeTerms,
  },
  pt: {
    abuse: PtAbuse,
    acceptableUse: PtAcceptableUse,
    accountCredit: PtAccountCredit,
    backups: PtBackups,
    dmca: PtDmca,
    privacy: PtPrivacy,
    refund: PtRefund,
    sla: PtSla,
    subprocessors: PtSubprocessors,
    terms: PtTerms,
  },
}

export function legalContent(locale: Locale, key: LegalDocumentKey): ComponentType {
  return translations[locale]?.[key] ?? english[key]
}

/** True when this language has its own copy of the document. */
export function hasTranslation(locale: Locale, key: LegalDocumentKey): boolean {
  return Boolean(translations[locale]?.[key])
}

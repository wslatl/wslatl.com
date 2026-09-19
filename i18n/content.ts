import { getLocale } from '@/i18n/locale'
import type { Locale } from '@/i18n/config'
import type { ContentTranslation } from '@/i18n/content/types'
import { services as englishServices, type Service } from '@/data/services'
import { commitments as englishCommitments, features as englishFeatures, leadFeature as englishLead, type Commitment, type Feature } from '@/data/features'
import { faqs as englishFaqs, type Faq } from '@/data/faqs'
import { team as englishTeam, type TeamMember } from '@/data/team'
import { reviewsSection as englishReviews } from '@/data/reviews'
import { uptimeTargets as englishUptime, type UptimeTarget } from '@/data/sla'
import { games as englishGames, gameCategories as englishCategories, type GameEntry } from '@/data/games'
import { productLines as englishLines, type ProductLine } from '@/data/pricing'
import { legalPages as englishLegal, type LegalPage } from '@/data/legal'
import { es } from '@/i18n/content/es'
import { fr } from '@/i18n/content/fr'
import { de } from '@/i18n/content/de'
import { pt } from '@/i18n/content/pt'

/**
 * The data files are the English text, so only the other languages appear
 * here. Everything below falls back to the English entry when a translation
 * has no line for it, which keeps a page whole rather than blank.
 */
const translations: Partial<Record<Locale, ContentTranslation>> = { es, fr, de, pt }

function current(): ContentTranslation | undefined {
  return translations[getLocale()]
}

export function localizedServices(): Service[] {
  const t = current()?.services
  if (!t) return englishServices
  return englishServices.map((service) => ({ ...service, ...t[service.id] }))
}

export function localizedCommitments(): Commitment[] {
  const t = current()?.commitments
  if (!t) return englishCommitments
  return englishCommitments.map((item) => ({ ...item, label: t[item.id] ?? item.label }))
}

export function localizedLeadFeature(): Feature {
  return { ...englishLead, ...current()?.leadFeature }
}

export function localizedFeatures(): Feature[] {
  const t = current()?.features
  if (!t) return englishFeatures
  return englishFeatures.map((feature) => ({ ...feature, ...t[feature.id] }))
}

export function localizedFaqs(): Faq[] {
  const t = current()?.faqs
  if (!t) return englishFaqs
  return englishFaqs.map((faq) => ({ ...faq, ...t[faq.id] }))
}

export function localizedTeam(): TeamMember[] {
  const t = current()?.team
  if (!t) return englishTeam
  return englishTeam.map((member) => ({ ...member, ...t[member.name] }))
}

export function localizedReviews() {
  const t = current()?.reviews
  if (!t) return englishReviews
  return { ...englishReviews, ...t }
}

export function localizedUptimeTargets(): UptimeTarget[] {
  const t = current()?.sla
  if (!t) return englishUptime
  return englishUptime.map((row) => ({ ...row, label: t[row.service] ?? row.label }))
}

export function localizedProductLines(): ProductLine[] {
  const t = current()?.pricing
  if (!t) return englishLines
  return englishLines.map((line) => ({
    ...line,
    ...t.lines?.[line.id],
    groups: line.groups.map((group) => ({ ...group, ...t.groups?.[group.id] })),
  }))
}

export function localizedProductLine(id: ProductLine['id']): ProductLine {
  const line = localizedProductLines().find((entry) => entry.id === id)
  if (!line) throw new Error(`No product line ${id}`)
  return line
}

export function localizedGames(): GameEntry[] {
  const t = current()?.games
  const categories = current()?.gameCategories
  if (!t && !categories) return englishGames
  return englishGames.map((game) => {
    const translated = t?.[game.slug]
    return {
      ...game,
      tagline: translated?.tagline ?? game.tagline,
      description: translated?.description ?? game.description,
      popularFor: translated?.popularFor ?? game.popularFor,
      category: categories?.[game.category] ?? game.category,
      recommendedRam: game.recommendedRam.map((row, i) => ({
        ...row,
        players: translated?.setups?.[i] ?? row.players,
      })),
    }
  })
}

export function localizedGameCategories(): string[] {
  const t = current()?.gameCategories
  return t ? englishCategories.map((category) => t[category] ?? category) : englishCategories
}

export function localizedLegalPages(): LegalPage[] {
  const t = current()?.legal
  if (!t) return englishLegal
  return englishLegal.map((page) => ({ ...page, ...t[page.key] }))
}

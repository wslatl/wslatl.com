import { siteConfig } from '@/config/site'
import { shortLinks } from '@/config/links'
import { legalPages, legalSlug } from '@/data/legal'
import { team } from '@/data/team'
import { faqs } from '@/data/faqs'
import { en } from '@/i18n/copy/en'
import { fillPrices } from '@/lib/pricing'

/**
 * The company profile for the billing panel, served at /company.json.
 *
 * It is built from the same sources the pages read (config/site.ts,
 * config/links.json, data/team.ts, data/faqs.ts, data/legal.ts and the
 * English home copy), so there is no second copy of any sentence to keep in
 * step. It is English only on purpose: it is a fixed document for a program,
 * not a page for a visitor.
 *
 * Bump `version` only when the shape changes in a way a reader of the old
 * shape would misread. Adding a field does not need a new version.
 */
export const companyProfileVersion = 1

export interface CompanyProfile {
  version: typeof companyProfileVersion
  name: string
  legalName: string
  location: string
  description: string
  shortDescription: string
  website: string
  team: { name: string; role: string; bio: string }[]
  about: { heading: string; paragraphs: string[]; closing: string }
  links: Record<string, string>
  legal: Record<string, string>
  faqs: { id: string; question: string; answer: string }[]
  updatedAt: string
}

/**
 * Short links that are not about the company itself. The credit link goes to
 * the developer of this site, so it stays out of the company's profile.
 */
const notCompanyLinks: readonly string[] = ['credits']

export function buildCompanyProfile(now: Date = new Date()): CompanyProfile {
  const about = en.home.about

  return {
    version: companyProfileVersion,
    name: siteConfig.name,
    legalName: siteConfig.legal.companyName,
    location: siteConfig.location,
    description: siteConfig.description,
    shortDescription: siteConfig.shortDescription,
    website: siteConfig.siteUrl,
    // The photo is left out: the profile is words, not pictures.
    team: team.map(({ name, role, bio }) => ({ name, role, bio })),
    about: {
      heading: about.heading,
      paragraphs: [...about.paragraphs],
      closing: about.closing,
    },
    links: Object.fromEntries(
      Object.entries(shortLinks)
        .filter(([key]) => !notCompanyLinks.includes(key))
        .map(([key, link]) => [key, link.url]),
    ),
    legal: Object.fromEntries(legalPages.map((page) => [legalSlug(page), `${siteConfig.siteUrl}${page.href}`])),
    faqs: faqs.map(({ id, question, answer }) => ({ id, question, answer: fillPrices(answer) })),
    updatedAt: now.toISOString(),
  }
}

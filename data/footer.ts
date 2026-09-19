import { siteConfig } from '@/config/site'
import { localePath, type Locale } from '@/i18n/config'
import type { Copy } from '@/i18n/copy/en'
import type { LegalPage } from '@/data/legal'
import { portalLinks, requestAccessLink, type NavLink } from '@/data/nav'
import { pricingHref } from '@/lib/pricing'

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export function footerColumns(t: Copy, locale: Locale, legalPages: LegalPage[]): FooterColumn[] {
  const path = (href: string) => localePath(locale, href)
  return [
    {
      title: t.footer.columns.hosting,
      links: [
        { label: t.footer.links.vpsPlans, href: path(pricingHref('vps')) },
        { label: t.footer.links.gamePlans, href: path(pricingHref('game')) },
        { label: t.footer.links.supportedGames, href: path('/games') },
        { label: t.footer.links.dedicated, href: path('/#services') },
        { label: t.footer.links.web, href: path('/#services') },
      ],
    },
    {
      title: t.footer.columns.company,
      links: [
        { label: t.footer.links.about, href: path('/#about') },
        { label: t.footer.links.howItWorks, href: path('/#how-it-works') },
        { label: t.footer.links.contact, href: path(siteConfig.paths.contact) },
        { label: t.footer.links.reviews, href: siteConfig.links.trustpilot },
        { label: t.footer.links.discord, href: siteConfig.links.discord },
        { label: t.footer.links.status, href: siteConfig.links.status },
      ],
    },
    {
      title: t.footer.columns.clientArea,
      links: [...portalLinks(t), requestAccessLink(t)].map(({ label, href }) => ({ label, href })),
    },
    {
      title: t.footer.columns.legal,
      links: legalPages.map(({ label, href }) => ({ label, href: path(href) })),
    },
  ]
}

import { siteConfig } from '@/config/site'
import { legalPages } from '@/data/legal'
import { portalLinks, requestAccessLink, type NavLink } from '@/data/nav'
import { pricingHref } from '@/lib/pricing'

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Hosting',
    links: [
      { label: 'VPS plans', href: pricingHref('vps') },
      { label: 'Game server plans', href: pricingHref('game') },
      { label: 'Supported games', href: '/games' },
      { label: 'Dedicated servers', href: '/#services' },
      { label: 'Web hosting', href: '/#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/#about' },
      { label: 'How ordering works', href: '/#how-it-works' },
      { label: 'Contact', href: siteConfig.paths.contact },
      { label: 'Reviews on Trustpilot', href: siteConfig.links.trustpilot },
      { label: 'Discord', href: siteConfig.links.discord },
      { label: 'Status page', href: siteConfig.links.status },
    ],
  },
  {
    title: 'Client area',
    links: [...portalLinks, requestAccessLink].map(({ label, href }) => ({ label, href })),
  },
  {
    title: 'Legal',
    links: legalPages.map(({ label, href }) => ({ label, href })),
  },
]

import { siteConfig } from '@/config/site'

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

export const servicesColumn: FooterColumn = {
  title: 'Services',
  links: [
    { label: 'Dedicated Servers', href: '#services' },
    { label: 'Game Hosting',      href: '#services' },
    { label: 'VPS Hosting',       href: '#services' },
    { label: 'Web Hosting',       href: '#services' },
  ],
}

export const quickLinksColumn: FooterColumn = {
  title: 'Quick Links',
  links: [
    { label: 'Billing Portal', href: siteConfig.links.billing,     external: true },
    { label: 'Gaming Panel',   href: siteConfig.links.gamingPanel, external: true },
    { label: 'VPS Panel',      href: siteConfig.links.vpsPanel,    external: true },
    { label: 'Discord Server', href: siteConfig.links.discord,     external: true },
    { label: 'Status Page',    href: siteConfig.links.status,      external: true },
  ],
}

export const legalColumn: FooterColumn = {
  title: 'Legal',
  links: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Acceptable Use',   href: '/acceptable-use' },
    { label: 'Contact Us',       href: '/#contact' },
  ],
}

export const footerColumns: FooterColumn[] = [
  servicesColumn,
  quickLinksColumn,
  legalColumn,
]

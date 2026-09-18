import { siteConfig } from '@/config/site'

export interface NavLink {
  label: string
  href: string
}

export interface PortalLink extends NavLink {
  description: string
}

/** Header navigation. External URLs open in a new tab automatically. */
export const mainNav: NavLink[] = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Game servers', href: '/games' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Status', href: siteConfig.links.status },
]

/** Every client panel, shown in the header Login menu and the footer. */
export const portalLinks: PortalLink[] = [
  { label: 'Billing portal', href: siteConfig.links.billing, description: 'Invoices, orders, and support tickets' },
  { label: 'Game panel', href: siteConfig.links.gamingPanel, description: 'Manage game servers' },
  { label: 'VPS panel', href: siteConfig.links.vpsPanel, description: 'Manage your VPS' },
  { label: 'Dedicated portal', href: siteConfig.links.dedicated, description: 'Manage dedicated servers' },
  { label: 'cPanel', href: siteConfig.links.cPanel, description: 'Web hosting and email' },
]

export const requestAccessLink: PortalLink = {
  label: 'Request access',
  href: siteConfig.links.register,
  description: 'New here? Apply for an account',
}

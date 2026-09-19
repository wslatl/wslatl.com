import { siteConfig } from '@/config/site'
import { localePath, type Locale } from '@/i18n/config'
import type { Copy } from '@/i18n/copy/en'

export interface NavLink {
  label: string
  href: string
}

export interface PortalLink extends NavLink {
  description: string
}

/** Header navigation. External URLs open in a new tab automatically. */
export function mainNav(t: Copy, locale: Locale): NavLink[] {
  const path = (href: string) => localePath(locale, href)
  return [
    { label: t.nav.pricing, href: path('/pricing') },
    { label: t.nav.games, href: path('/games') },
    { label: t.nav.services, href: path('/#services') },
    { label: t.nav.about, href: path('/#about') },
    { label: t.nav.contact, href: path('/#contact') },
    { label: t.nav.status, href: siteConfig.links.status },
  ]
}

/** Every client panel, shown in the header Login menu and the footer. */
export function portalLinks(t: Copy): PortalLink[] {
  return [
    { ...t.portals.billing, href: siteConfig.links.billing },
    { ...t.portals.gamingPanel, href: siteConfig.links.gamingPanel },
    { ...t.portals.vpsPanel, href: siteConfig.links.vpsPanel },
    { ...t.portals.dedicated, href: siteConfig.links.dedicated },
    { ...t.portals.cPanel, href: siteConfig.links.cPanel },
  ]
}

export function requestAccessLink(t: Copy): PortalLink {
  return { ...t.portals.register, href: siteConfig.links.register }
}

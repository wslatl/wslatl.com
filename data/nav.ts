import { markShortLink } from '@/config/links'
import { siteConfig } from '@/config/site'
import { localePath, type Locale } from '@/i18n/config'
import type { Translator } from '@/i18n/words'

export interface NavLink {
  label: string
  href: string
  /**
   * Left out of the desktop header bar until the screen is wide enough for
   * it in every language (72rem). The mobile menu and the footer always
   * carry it.
   */
  wideOnly?: boolean
  /** A short link (/status): it leaves the site, so it opens in a new tab like any off-site link. */
  external?: boolean
}

export interface PortalLink extends NavLink {
  description: string
}

/** Header navigation. Off-site links, short links included, open in a new tab. */
export function mainNav(t: Translator, locale: Locale): NavLink[] {
  const path = (href: string) => localePath(locale, href)
  const links: NavLink[] = [
    { label: t('nav.pricing'), href: path('/pricing') },
    { label: t('nav.games'), href: path('/games') },
    { label: t('nav.services'), href: path('/#services') },
    { label: t('nav.about'), href: path('/#about') },
    // Seven links do not fit the 1024px bar in French or Spanish. From 72rem
    // they do, with the room the kit's header (platform/components/site-header.tsx)
    // leaves; a longer label in any language needs that measured again.
    { label: t('nav.partners'), href: path('/partners'), wideOnly: true },
    { label: t('nav.contact'), href: path(siteConfig.paths.contact) },
    { label: t('nav.status'), href: siteConfig.links.status },
  ]
  return links.map(markShortLink)
}

/** Every client panel, shown in the header Login menu and the footer. */
export function portalLinks(t: Translator): PortalLink[] {
  return [
    { label: t('portals.billing.label'), description: t('portals.billing.description'), href: siteConfig.links.billing },
    { label: t('portals.gamingPanel.label'), description: t('portals.gamingPanel.description'), href: siteConfig.links.gamingPanel },
    { label: t('portals.vpsPanel.label'), description: t('portals.vpsPanel.description'), href: siteConfig.links.vpsPanel },
    { label: t('portals.dedicated.label'), description: t('portals.dedicated.description'), href: siteConfig.links.dedicated },
    { label: t('portals.cPanel.label'), description: t('portals.cPanel.description'), href: siteConfig.links.cPanel },
  ]
}

export function requestAccessLink(t: Translator): PortalLink {
  return { label: t('portals.register.label'), description: t('portals.register.description'), href: siteConfig.links.register }
}

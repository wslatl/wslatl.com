'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteLink, isExternal } from '@/components/ui/site-link'
import { Wordmark } from '@/components/brand/wordmark'
import { DiscordIcon } from '@/components/brand/icons'
import { LoginMenu } from '@/components/layout/login-menu'
import { LanguagePicker } from '@/components/layout/language-picker'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export interface HeaderLink {
  label: string
  href: string
}

export interface PortalEntry extends HeaderLink {
  description: string
}

interface HeaderProps {
  locale: Locale
  homeHref: string
  nav: HeaderLink[]
  portals: PortalEntry[]
  requestAccess: PortalEntry
  discordHref: string
  registerHref: string
  /** The header's own words, already in this page's language. */
  labels: {
    home: string
    discord: string
    getStarted: string
    openMenu: string
    newTab: string
    login: string
    clientPanels: string
    language: string
    chooseLanguage: string
    reviewNote: string
  }
}

function isCurrent(pathname: string, href: string) {
  if (isExternal(href) || href.includes('#')) return false
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function Header({
  locale,
  homeHref,
  nav,
  portals,
  requestAccess,
  discordHref,
  registerHref,
  labels,
}: HeaderProps) {
  const pathname = usePathname()
  // The mobile menu is a native popover: the browser opens and closes it
  // (button, Escape, tap outside) with or without JavaScript. Script is only
  // needed to close it after an in-app navigation keeps the page mounted.
  const menuRef = useRef<HTMLDivElement>(null)
  const closeMenu = () => menuRef.current?.hidePopover()

  return (
    <header className="site-header sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md print:hidden">
      {/* A size container, so the wordmark text can step aside when enlarged
          text leaves no room (the query is in rem, so it follows font size). */}
      <div className="shell @container flex h-16 items-center gap-3 lg:gap-6">
        <Link href={homeHref} className="-m-1 flex shrink-0 items-center rounded-md p-1" aria-label={labels.home}>
          <Wordmark textClassName="@max-[17.5rem]:hidden" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((link) => {
              const current = isCurrent(pathname, link.href)
              return (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    aria-current={current ? 'page' : undefined}
                    // A 404 is prerendered without the visitor's URL, so the
                    // current-page mark can legitimately differ on the client.
                    suppressHydrationWarning
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.label}
                    {isExternal(link.href) && <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-60" />}
                  </SiteLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguagePicker locale={locale} label={labels.language} heading={labels.chooseLanguage} />
          <Button asChild variant="ghost" size="icon-sm" className="hidden sm:inline-flex">
            <a href={discordHref} target="_blank" rel="noopener noreferrer" aria-label={labels.discord}>
              <DiscordIcon className="size-[18px]" />
            </a>
          </Button>
          <LoginMenu
            portals={portals}
            requestAccess={requestAccess}
            labels={{ login: labels.login, clientPanels: labels.clientPanels, newTab: labels.newTab }}
          />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <a href={registerHref} target="_blank" rel="noopener noreferrer">
              {labels.getStarted}
              <span className="sr-only">{labels.newTab}</span>
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-foreground lg:hidden"
            popoverTarget="mobile-menu"
            aria-label={labels.openMenu}
          >
            <Menu aria-hidden="true" className="menu-icon-closed size-5" />
            <X aria-hidden="true" className="menu-icon-open hidden size-5" />
          </Button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        popover="auto"
        className="mobile-menu lg:hidden"
        // The menu covers the page, so once keyboard focus leaves it (Tab past
        // the last link) close it rather than let focus land on hidden content.
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null
          if (!next) return
          if (e.currentTarget.contains(next) || next.getAttribute('popovertarget') === 'mobile-menu') return
          closeMenu()
        }}
      >
        <nav aria-label="Main" className="shell py-4">
          <ul className="divide-y divide-border">
            {nav.map((link) => (
              <li key={link.href}>
                <SiteLink
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                  suppressHydrationWarning
                  className="flex items-center justify-between py-3.5 text-base font-medium text-foreground aria-[current=page]:text-link"
                >
                  {link.label}
                  {isExternal(link.href) && <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />}
                </SiteLink>
              </li>
            ))}
            <li>
              <a
                href={discordHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex items-center justify-between py-3.5 text-base font-medium text-foreground"
              >
                Discord
                <span className="sr-only">{labels.newTab}</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
              </a>
            </li>
          </ul>
          <Button asChild size="lg" className="mt-6 w-full">
            <a href={registerHref} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              {labels.getStarted}
              <span className="sr-only">{labels.newTab}</span>
            </a>
          </Button>
          <p className="mt-3 text-center text-sm text-muted-foreground">{labels.reviewNote}</p>
        </nav>
      </div>
    </header>
  )
}

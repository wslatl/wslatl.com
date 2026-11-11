'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { ArrowUpRight, LayoutGrid, Menu, X } from 'lucide-react'
import { Button, buttonVariants } from './button'
import { Logo } from './logo'
import { SiteLink, isExternal } from './site-link'
import { cn } from '../lib/cn'

export interface NavItem {
  label: string
  href: string
  /** Treat as off-site although it is not an absolute URL (a short link such as /discord). */
  external?: boolean
  /** Only in the desktop bar from 72rem up. */
  wideOnly?: boolean
}

export interface AppLink {
  label: string
  /** The app's address. Another app's is absolute. */
  href: string
  /** True for the app the visitor is in. */
  current?: boolean
}

export interface SiteHeaderProps {
  /** Where the mark leads. */
  homeHref: string
  /** The mark link's accessible name, for example "WSLATL, home". */
  homeLabel: string
  /** The app's name in small text beside the mark. Left out on the main website. */
  appName?: string
  /** The page links, in the bar on large screens and in the menu on small ones. */
  nav: NavItem[]
  /** The nav's accessible name. */
  navLabel: string
  /** What a screen reader hears after a link that opens a new tab. */
  newTabLabel: string
  /** The accessible name of the button that opens the menu on small screens. */
  openMenuLabel: string
  /** Everything on the right of the bar: login, language, buttons. They sit before the menu button. */
  actions?: React.ReactNode
  /** Below the links in the mobile menu: a call to action, a language list. */
  mobileFooter?: React.ReactNode
  /** The small app switcher (Website, Guides, Status). Addresses come from the app. */
  switcher?: { label: string; apps: AppLink[] }
  /** Path segments that are a language and not a page (`['es', 'fr']`), ignored when marking the current page. */
  localePrefixes?: string[]
  /** The current path, when the app knows better than the router (a 404 rendered without the visitor's URL). */
  currentPath?: string
}

function stripPrefix(path: string, prefixes: string[]): string {
  const [, first = '', ...rest] = path.split('/')
  return prefixes.includes(first) ? `/${rest.join('/')}` : path
}

function isCurrent(pathname: string, item: NavItem, prefixes: string[]) {
  if (isExternal(item.href, item.external) || item.href.includes('#')) return false
  // Both without the language: an English page can be prerendered under a
  // prefix while its links have none, so comparing them as they are would
  // never mark the current page.
  const [page, link] = [stripPrefix(pathname, prefixes), stripPrefix(item.href, prefixes)]
  return link === '/' ? page === '/' : page === link || page.startsWith(`${link}/`)
}

/**
 * The header: the mark, the app's name on the smaller apps, the page links,
 * the app switcher, and whatever the app puts on the right. Below 64rem the
 * links move into a menu. It runs in the browser (the current page and the
 * menu), so it only takes plain props and elements.
 */
export function SiteHeader({
  homeHref,
  homeLabel,
  appName,
  nav,
  navLabel,
  newTabLabel,
  openMenuLabel,
  actions,
  mobileFooter,
  switcher,
  localePrefixes = [],
  currentPath,
}: SiteHeaderProps) {
  const routerPath = usePathname()
  const pathname = currentPath ?? routerPath ?? '/'
  // The mobile menu is a native popover: the browser opens and closes it
  // (button, Escape, tap outside) with or without JavaScript. Script is only
  // needed to close it after an in-app navigation keeps the page mounted.
  const menuRef = useRef<HTMLDivElement>(null)
  const closeMenu = () => menuRef.current?.hidePopover()
  const switcherRef = useRef<HTMLDetailsElement>(null)

  // Solid, not see-through: the brand kit puts the logo on a solid surface,
  // never over the page scrolling underneath.
  return (
    <header className="site-header sticky top-0 z-50 border-b bg-background print:hidden">
      <div className="shell flex h-16 items-center gap-3 lg:gap-6">
        <Link
          href={homeHref}
          className={cn('-m-1 flex shrink-0 items-center rounded-md p-1', appName && 'gap-2.5')}
          aria-label={homeLabel}
        >
          <Logo />
          {appName && <span className="text-sm font-semibold text-foreground">{appName}</span>}
        </Link>

        <nav aria-label={navLabel} className="hidden lg:block">
          {/* The bar stops growing at 72rem, where every link shows. The
              spacing is sized so they fit on one line there in every
              language; below it, where the wide-only ones are left out, a
              long label may wrap. */}
          <ul className="flex items-center">
            {nav.map((link) => {
              const current = isCurrent(pathname, link, localePrefixes)
              return (
                <li key={link.href} className={cn(link.wideOnly && 'hidden min-[72rem]:block')}>
                  <SiteLink
                    href={link.href}
                    external={link.external}
                    newTab={newTabLabel}
                    aria-current={current ? 'page' : undefined}
                    // A 404 is prerendered without the visitor's URL, so the
                    // current-page mark can legitimately differ on the client.
                    suppressHydrationWarning
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium transition-colors min-[72rem]:whitespace-nowrap',
                      current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.label}
                    {isExternal(link.href, link.external) && (
                      <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-60" />
                    )}
                  </SiteLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {switcher && (
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Escape and a move of focus out of the open menu reach it from the summary and the links inside, which are the interactive elements; it only closes the menu again
            <details
              ref={switcherRef}
              className="relative hidden lg:block"
              onBlur={(e) => {
                const next = e.relatedTarget as Node | null
                if (!next || !e.currentTarget.contains(next)) e.currentTarget.open = false
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && switcherRef.current) {
                  switcherRef.current.open = false
                  switcherRef.current.querySelector('summary')?.focus()
                }
              }}
            >
              <summary
                aria-label={switcher.label}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                  'cursor-pointer list-none [&::-webkit-details-marker]:hidden',
                )}
              >
                <LayoutGrid aria-hidden="true" className="size-[18px]" />
              </summary>
              <ul className="absolute top-full right-0 z-50 mt-2 w-44 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl">
                {switcher.apps.map((app) => (
                  <li key={app.href}>
                    <a
                      href={app.href}
                      aria-current={app.current ? 'true' : undefined}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current]:text-foreground"
                    >
                      {app.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {actions}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-foreground lg:hidden"
            popoverTarget="mobile-menu"
            aria-label={openMenuLabel}
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
        <nav aria-label={navLabel} className="shell py-4">
          <ul className="divide-y divide-border">
            {nav.map((link) => (
              <li key={link.href}>
                <SiteLink
                  href={link.href}
                  external={link.external}
                  newTab={newTabLabel}
                  onClick={closeMenu}
                  aria-current={isCurrent(pathname, link, localePrefixes) ? 'page' : undefined}
                  suppressHydrationWarning
                  className="flex items-center justify-between py-3.5 text-base font-medium text-foreground aria-[current=page]:text-link"
                >
                  {link.label}
                  {isExternal(link.href, link.external) && (
                    <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
                  )}
                </SiteLink>
              </li>
            ))}
          </ul>
          {mobileFooter}
          {switcher && (
            <div className="mt-6 border-t pt-4">
              <p className="text-sm font-semibold text-foreground">{switcher.label}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {switcher.apps.map((app) => (
                  <li key={app.href}>
                    <a
                      href={app.href}
                      onClick={closeMenu}
                      aria-current={app.current ? 'true' : undefined}
                      className="text-muted-foreground hover:text-foreground aria-[current]:font-medium aria-[current]:text-foreground"
                    >
                      {app.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

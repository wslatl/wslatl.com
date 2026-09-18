'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteLink, isExternal } from '@/components/ui/site-link'
import { Wordmark } from '@/components/brand/wordmark'
import { DiscordIcon } from '@/components/brand/icons'
import { LoginMenu } from '@/components/layout/login-menu'
import { mainNav } from '@/data/nav'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

function isCurrent(pathname: string, href: string) {
  if (isExternal(href) || href.includes('#')) return false
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  // The menu remembers which page it was opened on, so navigating anywhere
  // (a link, back/forward) closes it without an effect.
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const menuOpen = menuPath === pathname
  const closeMenu = () => setMenuPath(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuPath(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="site-header sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md print:hidden">
      <div className="shell flex h-16 items-center gap-6">
        <Link href="/" className="-m-1 shrink-0 rounded-md p-1" aria-label="WSLATL home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((link) => {
              const current = isCurrent(pathname, link.href)
              return (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    aria-current={current ? 'page' : undefined}
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
          <Button asChild variant="ghost" size="icon-sm" className="hidden sm:inline-flex">
            <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" aria-label="WSLATL on Discord (opens in a new tab)">
              <DiscordIcon className="size-[18px]" />
            </a>
          </Button>
          <LoginMenu />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
              Get started
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-foreground lg:hidden"
            onClick={() => setMenuPath(menuOpen ? null : pathname)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-background lg:hidden"
        >
          <nav aria-label="Main" className="shell py-4">
            <ul className="divide-y divide-border">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                    className="flex items-center justify-between py-3.5 text-base font-medium text-foreground"
                  >
                    {link.label}
                    {isExternal(link.href) && <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />}
                  </SiteLink>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-3.5 text-base font-medium text-foreground"
                >
                  Discord
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
                </a>
              </li>
            </ul>
            <Button asChild size="lg" className="mt-6 w-full">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                Get started
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              New accounts are reviewed by a person, usually the same day.
            </p>
          </nav>
        </div>
      )}
    </header>
  )
}

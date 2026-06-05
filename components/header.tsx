'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import {
  Menu, X, ChevronDown, LogIn, UserPlus,
  CreditCard, Gamepad2, Server, LayoutDashboard, HardDrive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { siteConfig } from '@/config/site'
import { Wordmark } from '@/components/wordmark'
import { cn } from '@/lib/utils'

type NavLink = { label: string; href: string; Icon: React.ElementType }
type NavItem = NavLink | null

const mainLinks = [
  { label: 'Home',     href: '/',            external: false },
  { label: 'Services', href: '#services',    external: false },
  { label: 'About',    href: '#about',       external: false },
  { label: 'Contact',  href: '#contact',     external: false },
  { label: 'Status',   href: siteConfig.links.status,  external: true },
  { label: 'Discord',  href: siteConfig.links.discord, external: true },
]

const loginLinks: NavItem[] = [
  { label: 'Billing Portal',  href: siteConfig.links.billing,    Icon: CreditCard },
  { label: 'Register',        href: siteConfig.links.register,   Icon: UserPlus },
  null,
  { label: 'Gaming Panel',    href: siteConfig.links.gamingPanel, Icon: Gamepad2 },
  { label: 'VPS Panel',       href: siteConfig.links.vpsPanel,   Icon: Server },
  { label: 'Dedicated Portal',href: siteConfig.links.dedicated,  Icon: HardDrive },
  { label: 'cPanel',          href: siteConfig.links.cPanel,     Icon: LayoutDashboard },
]

function LoginDropdownItems() {
  return (
    <>
      {loginLinks.map((item, idx) =>
        item === null ? (
          <DropdownMenuSeparator key={`sep-${idx}`} />
        ) : (
          <DropdownMenuItem key={item.label} asChild>
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <item.Icon className="w-4 h-4" />
              {item.label}
            </Link>
          </DropdownMenuItem>
        )
      )}
    </>
  )
}

const loginButtonClass =
  'group/login relative flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-medium rounded-md ' +
  'border border-border/60 bg-transparent text-foreground ' +
  'transition-all duration-300 ease-out ' +
  'hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_0_4px_oklch(0.55_0.18_240/0.08)] hover:text-foreground ' +
  'focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/30 ' +
  'data-[open=true]:border-primary/70 data-[open=true]:bg-primary/12 data-[open=true]:shadow-[0_0_0_4px_oklch(0.55_0.18_240/0.12)] ' +
  'active:scale-[0.98]'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const openLogin = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setLoginOpen(true)
  }

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setLoginOpen(false), 150)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md',
        'transition-[border-color,box-shadow,background-color] duration-300',
        scrolled
          ? 'border-border shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]'
          : 'border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">

          {/* Left: Wordmark */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center flex-shrink-0" aria-label="WSLATL home">
              <Wordmark size="md" showText={false} />
            </Link>
          </div>

          {/* Center: Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="relative text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium tracking-wide after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-foreground/60 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Login + hamburger */}
          <div className="flex-1 flex items-center justify-end gap-2">

            {/* Desktop: pure hover dropdown — animated Login button */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={openLogin}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                data-open={loginOpen}
                className={loginButtonClass}
                aria-label="Open login menu"
                aria-expanded={loginOpen}
              >
                <LogIn className="w-3.5 h-3.5 transition-transform duration-300 group-hover/login:translate-x-0.5" />
                <span>Login</span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 opacity-60 transition-transform duration-300',
                    loginOpen && 'rotate-180',
                  )}
                />
                {/* Sweep highlight on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-md overflow-hidden"
                >
                  <span
                    className={cn(
                      'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent',
                      'transition-transform duration-500 ease-out',
                      'group-hover/login:translate-x-full',
                    )}
                  />
                </span>
              </button>

              {loginOpen && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="w-56 rounded-lg border border-border bg-popover/95 backdrop-blur text-popover-foreground shadow-xl p-1.5">
                    {loginLinks.map((item, idx) =>
                      item === null ? (
                        <div key={`sep-${idx}`} className="-mx-1 my-1 h-px bg-border" />
                      ) : (
                        <Link
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <item.Icon className="w-4 h-4 text-muted-foreground" />
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: click-triggered Login dropdown — same animated button */}
            <div className="lg:hidden">
              <DropdownMenu onOpenChange={setLoginOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    data-open={loginOpen}
                    className={loginButtonClass}
                    aria-label="Open login menu"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 opacity-60 transition-transform duration-300',
                        loginOpen && 'rotate-180',
                      )}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-md overflow-hidden"
                    >
                      <span
                        className={cn(
                          'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent',
                          'transition-transform duration-500 ease-out',
                          'group-active/login:translate-x-full',
                        )}
                      />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <LoginDropdownItems />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 pt-3 border-t border-border/60">
            <div className="space-y-0.5 mb-4">
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="block px-3 py-2.5 rounded-md text-foreground hover:bg-accent transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}{link.external ? ' →' : ''}
                </Link>
              ))}
            </div>

            <Button asChild className="w-full" size="sm">
              <Link
                href={siteConfig.links.register}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

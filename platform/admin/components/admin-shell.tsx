import Link from 'next/link'
import { AdminNav, type AdminNavItem } from './admin-nav'
import { Button } from '../../components/button'
import type { Locale } from '../../i18n/config'
import { cn } from '../../lib/cn'
import { Logo } from '../../components/logo'
import { adminText } from '../server/text'
import { LanguageMenu } from './language-menu'
import { SignOut } from './sign-out'
import { hidden } from './tags'

export type AdminShellProps = {
  /** What a screen reader hears before "Admin", such as "WSLATL". */
  brand: string
  /** The admin's own pages, from admin.nav, with their words in the admin's language. Left out, the header has none, as on the main website. */
  nav?: readonly AdminNavItem[]
  /** 72rem wide instead of 56rem, for an admin with tables. */
  wide?: boolean
  /** Where Sign out posts, and where it goes after. */
  signOutPath?: string
  signInPath?: string
  /** The admin's language, as its layout chose it. English when left out. */
  locale?: Locale
  children: React.ReactNode
}

/**
 * The header every signed-in admin page sits under, and the page's main
 * area. The mark once, on the solid bar, with the gradient only as the thin
 * rule above it. It wraps onto a second row where the five languages' longer
 * words would not fit beside the name on a phone.
 */
export function AdminShell({ brand, nav = [], wide = false, signOutPath, signInPath, locale = 'en', children }: AdminShellProps) {
  const width = wide ? 'max-w-6xl' : 'max-w-4xl'
  const t = adminText(locale)
  return (
    <>
      <header className="border-b bg-card">
        <div aria-hidden="true" className="brand-bar" />
        <div
          className={cn(
            'mx-auto flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2.5 px-4 py-2.5 sm:px-6',
            width,
            nav.length > 0 && 'lg:gap-x-6',
          )}
        >
          <p className="flex items-center gap-3 font-semibold">
            <Logo />
            <span>{t.rich('heading', { brand, hidden })}</span>
          </p>
          {nav.length > 0 && (
            // Its own row until there is room for it between the name and the links.
            <div className="order-last w-full lg:order-none lg:mr-auto lg:w-auto">
              <AdminNav items={nav} />
            </div>
          )}
          <nav aria-label={t('shell.nav')} className="ml-auto flex flex-wrap items-center justify-end gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" prefetch={false}>
                {t('shell.viewSite')}
              </Link>
            </Button>
            <LanguageMenu />
            <SignOut action={signOutPath} then={signInPath} />
          </nav>
        </div>
      </header>
      <main id="main" className={cn('mx-auto space-y-6 px-4 py-8 sm:px-6 sm:py-10', width)}>
        {children}
      </main>
    </>
  )
}

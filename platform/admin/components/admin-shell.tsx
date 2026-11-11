import Link from 'next/link'
import { AdminNav, type AdminNavItem } from './admin-nav'
import { Button } from '../../components/button'
import { cn } from '../../lib/cn'
import { Logo } from '../../components/logo'
import { SignOut } from './sign-out'

export type AdminShellProps = {
  /** What a screen reader hears before "Admin", such as "WSLATL". */
  brand: string
  /** The admin's own pages, from admin.nav. Left out, the header has none, as on the main website. */
  nav?: readonly AdminNavItem[]
  /** 72rem wide instead of 56rem, for an admin with tables. */
  wide?: boolean
  /** Where Sign out posts, and where it goes after. */
  signOutPath?: string
  signInPath?: string
  children: React.ReactNode
}

/**
 * The header every signed-in admin page sits under, and the page's main
 * area. The mark once, on the solid bar, with the gradient only as the thin
 * rule above it.
 */
export function AdminShell({ brand, nav = [], wide = false, signOutPath, signInPath, children }: AdminShellProps) {
  const width = wide ? 'max-w-6xl' : 'max-w-4xl'
  return (
    <>
      <header className="border-b bg-card">
        <div aria-hidden="true" className="brand-bar" />
        <div
          className={cn(
            'mx-auto flex items-center justify-between gap-3 px-4 sm:px-6',
            width,
            nav.length > 0 ? 'min-h-16 flex-wrap gap-y-2.5 py-2.5 lg:gap-x-6' : 'h-16',
          )}
        >
          <p className="flex items-center gap-3 font-semibold">
            <Logo />
            <span>
              <span className="sr-only">{`${brand} `}</span>Admin
            </span>
          </p>
          {nav.length > 0 && (
            // Its own row until there is room for it between the name and the links.
            <div className="order-last w-full lg:order-none lg:mr-auto lg:w-auto">
              <AdminNav items={nav} />
            </div>
          )}
          <nav aria-label="Admin" className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" prefetch={false}>
                View site
              </Link>
            </Button>
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

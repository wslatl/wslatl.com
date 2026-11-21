import { cn } from '../../lib/cn'
import { Logo } from '../../components/logo'
import type { Locale } from '../../i18n/config'
import { sectionsOf, type ShellEntry } from '../nav'
import { adminText } from '../server/text'
import { SidebarBody } from './admin-sidebar'
import { MobileMenu } from './mobile-menu'
import { hidden } from './tags'

export type AdminShellProps = {
  /** What a screen reader hears before "Admin", such as "WSLATL". */
  brand: string
  /** The app's name beside the mark, such as "Status". Left out, the mark has "Admin" beside it alone. */
  name?: string
  /**
   * The admin's own pages, from admin.nav, with their words in the admin's
   * language: pages, and groups of pages with their heading. A flat list of
   * { href, label } is every page ungrouped. Left out, the sidebar has no
   * pages of its own, as on the main website.
   */
  nav?: readonly ShellEntry[]
  /** 72rem wide instead of 56rem, for an admin with tables. */
  wide?: boolean
  /** Where Sign out posts, and where it goes after. */
  signOutPath?: string
  signInPath?: string
  /** The admin's language, as its layout chose it. English when left out. */
  locale?: Locale
  /** The app's version, at the foot of the sidebar, such as "v1.4.2". */
  version?: React.ReactNode
  children: React.ReactNode
}

/** The Updates page's address, which the sidebar lists on its own unless the app's pages already do. */
const UPDATES = '/admin/updates'

/**
 * The frame every signed-in admin page sits in: a sidebar on a desktop, and
 * on a phone a bar with the name and a menu button that opens the same
 * sidebar over the page. The app's name and mark are at its top, its pages
 * in their groups under that, and under them, apart, Updates, View site, the
 * language menu, Sign out and the app's version. The mark once, on the
 * solid surface, with the gradient only as the thin rule along the top.
 */
export function AdminShell({ brand, name, nav = [], wide = false, signOutPath, signInPath, locale = 'en', version, children }: AdminShellProps) {
  const t = adminText(locale)
  const sections = sectionsOf(nav)
  const listsUpdates = sections.some((section) => section.items.some((item) => item.href === UPDATES))
  const body = (idPrefix: string, inMenu: boolean) => (
    <SidebarBody
      sections={sections}
      updates={listsUpdates ? null : t('updates.title')}
      signOutPath={signOutPath}
      signInPath={signInPath}
      version={version}
      idPrefix={idPrefix}
      inMenu={inMenu}
    />
  )
  const title = (
    <p className="flex min-w-0 items-center gap-3">
      <Logo />
      <span className="flex min-w-0 flex-col leading-tight">
        {name !== undefined && (
          <span aria-hidden="true" className="truncate font-semibold">
            {name}
          </span>
        )}
        <span className={cn('truncate', name === undefined ? 'font-semibold' : 'text-xs text-muted-foreground')}>{t.rich('heading', { brand, hidden })}</span>
      </span>
    </p>
  )

  return (
    <div className="lg:flex lg:items-start">
      {/* A desktop's sidebar: fixed in width, and as tall as the window however far the page scrolls. */}
      <div className="hidden w-64 shrink-0 border-r bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col print:hidden xl:w-72">
        <div aria-hidden="true" className="brand-bar shrink-0" />
        <div className="shrink-0 border-b px-5 py-4">{title}</div>
        {body('side', false)}
      </div>
      <div className="min-w-0 flex-1">
        {/* A phone's bar: 4rem tall, which is where the open menu starts. */}
        <header className="relative z-40 flex h-16 items-center justify-between gap-3 border-b bg-card px-4 sm:px-6 lg:hidden print:hidden">
          <div aria-hidden="true" className="brand-bar absolute inset-x-0 top-0" />
          {title}
          <MobileMenu>{body('menu', true)}</MobileMenu>
        </header>
        <main id="main" className={cn('mx-auto w-full space-y-6 px-4 py-8 sm:px-6 sm:py-10', wide ? 'max-w-6xl' : 'max-w-4xl')}>
          {children}
        </main>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Download, Globe } from 'lucide-react'
import { cn } from '../../lib/cn'
import { activeHref, type NavSection } from '../nav'
import { AdminNav, rowClass, rowState } from './admin-nav'
import { useAdminText } from './admin-text'
import { LanguageMenu } from './language-menu'
import { MENU_ID } from './menu-id'
import { SignOut } from './sign-out'

const closeMenu = () => {
  const menu = document.getElementById(MENU_ID)
  if (menu?.matches(':popover-open')) menu.hidePopover()
}

/**
 * What sits in the sidebar under the app's name, on a desktop and in the
 * phone's menu alike: the app's pages in their groups, then, apart from
 * them, Updates (unless the app lists it), View site, the language menu,
 * Sign out and the app's version. The page being looked at is worked out
 * here, once, over the pages and Updates together, so only one is lit.
 * It runs in the browser for the current address.
 */
export function SidebarBody({
  sections,
  updates,
  signOutPath,
  signInPath,
  version,
  idPrefix,
  inMenu = false,
}: {
  sections: readonly NavSection[]
  /** The Updates page's label, or null when the app lists the page itself. */
  updates: string | null
  signOutPath?: string
  signInPath?: string
  version?: React.ReactNode
  /** Keeps the two copies' ids apart (the desktop's and the phone menu's). */
  idPrefix: string
  inMenu?: boolean
}) {
  const pathname = usePathname() ?? '/'
  const { t } = useAdminText()
  const pages = [...sections.flatMap((section) => section.items), ...(updates === null ? [] : [{ href: '/admin/updates' }])]
  const active = activeHref(pathname, pages)
  const onNavigate = inMenu ? closeMenu : undefined

  // A move to another page that keeps this one mounted still closes the menu.
  useEffect(() => {
    if (inMenu && pathname) closeMenu()
  }, [pathname, inMenu])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {sections.length > 0 && <AdminNav sections={sections} active={active} idPrefix={idPrefix} onNavigate={onNavigate} />}
      </div>
      <div className="shrink-0 space-y-3 border-t px-3 py-3">
        <nav aria-label={t('shell.account')}>
          <ul className="space-y-0.5">
            {updates !== null && (
              <li>
                <Link
                  href="/admin/updates"
                  aria-current={active === '/admin/updates' ? 'page' : undefined}
                  onClick={onNavigate}
                  className={cn(rowClass, rowState(active === '/admin/updates'))}
                >
                  <Download aria-hidden="true" className={cn('size-4 shrink-0', active === '/admin/updates' && 'text-link')} />
                  {updates}
                </Link>
              </li>
            )}
            <li>
              <Link href="/" prefetch={false} className={cn(rowClass, rowState(false))}>
                <Globe aria-hidden="true" className="size-4 shrink-0" />
                {t('shell.viewSite')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="space-y-0.5">
          <LanguageMenu variant="inline" />
          <SignOut action={signOutPath} then={signInPath} className="h-auto w-full justify-start px-3 py-2.5 text-sm font-medium lg:py-2" />
        </div>
        {version != null && <p className="px-3 text-xs text-muted-foreground">{version}</p>}
      </div>
    </div>
  )
}

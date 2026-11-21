'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../../components/button'
import { useAdminText } from './admin-text'
import { MENU_ID } from './menu-id'

/**
 * The phone's menu: a native popover, as the kit's SiteHeader has, so the
 * button opens it and the button, Escape and a tap outside close it with no
 * script at all. Script only keeps the button's state and name in step, and
 * closes the menu once focus moves past its last link, which would
 * otherwise land on the page hidden behind it.
 */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const { t } = useAdminText()
  const menu = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const element = menu.current
    if (!element) return
    const sync = (event: Event) => setOpen((event as ToggleEvent).newState === 'open')
    element.addEventListener('toggle', sync)
    return () => element.removeEventListener('toggle', sync)
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-foreground lg:hidden"
        popoverTarget={MENU_ID}
        aria-controls={MENU_ID}
        aria-expanded={open}
        aria-label={open ? t('shell.closeMenu') : t('shell.menu')}
      >
        <Menu aria-hidden="true" className="menu-icon-closed size-5" />
        <X aria-hidden="true" className="menu-icon-open hidden size-5" />
      </Button>
      <div
        id={MENU_ID}
        ref={menu}
        popover="auto"
        className="mobile-menu bg-card lg:hidden [&:popover-open]:flex [&:popover-open]:flex-col"
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null
          if (!next || e.currentTarget.contains(next) || next.getAttribute('popovertarget') === MENU_ID) return
          e.currentTarget.hidePopover()
        }}
      >
        {children}
      </div>
    </>
  )
}

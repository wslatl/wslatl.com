'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface SectionNavItem {
  id: string
  label: string
  detail?: string
}

/**
 * Sticky in-page switcher for the pricing sections. The links are plain
 * anchors (so they work without JavaScript and deep-link as /pricing#vps);
 * the script only marks which section is currently on screen.
 */
export function SectionNav({ items, label }: { items: SectionNavItem[]; label: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    // The current section is the last one whose top has scrolled past the
    // upper third of the viewport. Above the first section, none is current.
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current: string | null = null
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  return (
    <nav
      aria-label={label}
      className="sticky top-16 z-30 -mx-4 border-b bg-background/90 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 print:hidden"
    >
      <ul className="flex w-fit gap-1 rounded-full border bg-card/40 p-1">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {item.detail && (
                  <span className={cn('text-xs tabular-nums', isActive ? 'text-background/70' : 'text-muted-foreground')}>
                    {item.detail}
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

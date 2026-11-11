'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/cn'

export type AdminNavItem = { href: string; label: string }

/**
 * The admin's own pages, for an app whose admin has more than Updates
 * (admin.nav in platform.config.mjs). It wraps rather than scrolls, so on a
 * phone no page is hidden off the edge.
 */
export function AdminNav({ items }: { items: readonly AdminNavItem[] }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin pages" className="flex flex-wrap gap-1">
      {items.map(({ href, label }) => {
        const active = href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3',
              active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

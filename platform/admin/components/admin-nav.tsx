'use client'

import Link from 'next/link'
import { cn } from '../../lib/cn'
import { icons } from '../icons'
import { badgeText, type NavSection } from '../nav'
import { useAdminText } from './admin-text'

/** One of the admin's own pages, with its words in the admin's language. */
export type AdminNavItem = { href: string; label: string }

/** What every row of the sidebar looks like: a page, Updates, View site. */
export const rowClass =
  'relative flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring lg:py-2'

/** A row that is the page being looked at, or one that is not. */
export const rowState = (active: boolean) =>
  active
    ? "bg-secondary text-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-link before:content-['']"
    : 'text-muted-foreground hover:bg-accent hover:text-foreground'

/**
 * The count beside a page, such as open incidents. The number is for the
 * eye; a screen reader hears the sentence, in the admin's language.
 */
export function Badge({ count }: { count: number | undefined }) {
  const { t } = useAdminText()
  const shown = badgeText(count)
  if (shown === null || count === undefined) return null
  return (
    <>
      <span aria-hidden="true" className="ml-auto min-w-5 rounded-full bg-primary px-1.5 py-px text-center text-xs font-semibold text-primary-foreground tabular-nums">
        {shown}
      </span>
      <span className="sr-only">{t('shell.badge', { count })}</span>
    </>
  )
}

/**
 * The admin's own pages in the sidebar, in the sections the app gave them.
 * `active` is the one address lit, from the most specific match
 * (activeHref); it is the sidebar's to work out, since Updates beside it
 * takes part in the same choice. A group is a role=group named by its
 * heading, so a screen reader hears where it is; pages given on their own
 * sit in a group with no name.
 */
export function AdminNav({ sections, active, idPrefix, onNavigate }: { sections: readonly NavSection[]; active: string | null; idPrefix: string; onNavigate?: () => void }) {
  const { t } = useAdminText()
  return (
    <nav aria-label={t('shell.pages')} className="space-y-5">
      {sections.map((section, index) => {
        const headingId = `${idPrefix}-group-${index}`
        return (
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset is for form controls; this is a named group of links
          <div key={section.heading ?? `loose-${index}`} role="group" aria-labelledby={section.heading === null ? undefined : headingId}>
            {section.heading !== null && (
              <p id={headingId} className="px-3 pb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {section.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon ? icons[item.icon] : null
                const here = item.href === active
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={here ? 'page' : undefined} onClick={onNavigate} className={cn(rowClass, rowState(here))}>
                      {Icon && <Icon aria-hidden="true" className={cn('size-4 shrink-0', here && 'text-link')} />}
                      <span className="min-w-0 break-words">{item.label}</span>
                      <Badge count={item.badge} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

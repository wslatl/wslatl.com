import type { AdminIcon } from '../config.mjs'
import { textIn, type Locale, type LocalizedText } from '../i18n/config'

/**
 * The admin's sidebar, as data. admin.nav in platform.config.mjs and what an
 * app's navFor hook hands back share these shapes; the sidebar itself gets
 * them with every label already in the admin's language.
 */

/** A page in the sidebar, as the config or the hook gives it. */
export type NavItem = {
  href: string
  label: LocalizedText
  icon?: AdminIcon
  /** Lit on its own address only. "/admin" is exact unless this says false. */
  exact?: boolean
  /** A count beside the label (open incidents, failed mail). From the navFor hook only. */
  badge?: number
}

/** Pages under a heading. Left without one, they sit apart from the others under none. */
export type NavGroup = { group?: LocalizedText; items: readonly NavItem[] }

export type NavEntry = NavItem | NavGroup

/** A page with its words in one language. A flat `{ href, label }` is one. */
export type ShellItem = { href: string; label: string; icon?: AdminIcon; exact?: boolean; badge?: number }

export type ShellGroup = { heading?: string; items: readonly ShellItem[] }

export type ShellEntry = ShellItem | ShellGroup

/** A run of pages the sidebar draws together, with its heading when it has one. */
export type NavSection = { heading: string | null; items: ShellItem[] }

const isGroup = (entry: NavEntry | ShellEntry): entry is NavGroup | ShellGroup => 'items' in entry

/** The nav with its words in one language, ready for the shell. */
export function navIn(nav: readonly NavEntry[], locale: Locale): ShellEntry[] {
  const item = ({ label, ...rest }: NavItem): ShellItem => ({ ...rest, label: textIn(label, locale) })
  return nav.map((entry) => {
    if (!isGroup(entry)) return item(entry)
    const group = entry as NavGroup
    return { ...(group.group === undefined ? {} : { heading: textIn(group.group, locale) }), items: group.items.map(item) }
  })
}

/**
 * The sections the sidebar draws: each group, and each run of pages given
 * on their own (above any group, or between two), in order. A group with no
 * pages left, because the app hid them for this request, is not drawn.
 */
export function sectionsOf(nav: readonly ShellEntry[]): NavSection[] {
  const sections: NavSection[] = []
  let loose: NavSection | null = null
  for (const entry of nav) {
    if (isGroup(entry)) {
      loose = null
      if (entry.items.length > 0) sections.push({ heading: entry.heading ?? null, items: [...entry.items] })
    } else {
      if (!loose) sections.push((loose = { heading: null, items: [] }))
      loose.items.push(entry)
    }
  }
  return sections
}

/** A page is exact when it says so; "/admin", the overview, is unless it says otherwise. */
const isExact = ({ href, exact }: { href: string; exact?: boolean }) => exact ?? href === '/admin'

/**
 * The one page lit for an address: the most specific that matches. A page
 * matches its own address and everything under it, so /admin/updates/publish
 * lights Publish, not Updates, and /admin/guides/edit lights Guides; an exact
 * page matches its own address only.
 */
export function activeHref(pathname: string, pages: readonly { href: string; exact?: boolean }[]): string | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  let best: string | null = null
  for (const page of pages) {
    const matches = path === page.href || (!isExact(page) && path.startsWith(`${page.href}/`))
    if (matches && (best === null || page.href.length > best.length)) best = page.href
  }
  return best
}

/** What a badge shows: the count, or 99+ when it is long. Nothing for 0. */
export function badgeText(count: number | undefined): string | null {
  if (!count || count < 1) return null
  return count > 99 ? '99+' : String(count)
}

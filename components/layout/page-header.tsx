import { JsonLd } from '@/components/seo/json-ld'
import { pageUrl } from '@/lib/metadata'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localePath } from '@/i18n/config'
import { Breadcrumbs as Trail, PageStart, type Crumb } from '@/platform/components/page-start'

export type { Crumb }

interface PageHeaderProps {
  title: React.ReactNode
  /** Trail above the title. Home goes first and the current page last, both automatically. */
  breadcrumbs?: Crumb[]
  /** Plain-text name of this page, for the breadcrumb trail. */
  crumbLabel?: string
  /** This page's path, so structured data can end the trail on it. */
  path?: string
  children?: React.ReactNode
  className?: string
}

interface BreadcrumbsProps {
  /** Trail before the current page. Home goes first automatically. */
  breadcrumbs: Crumb[]
  /** Plain-text name of this page. */
  crumbLabel: string
  /** This page's path, so structured data can end the trail on it. */
  path?: string
  className?: string
}

/** The trail from the home page, in this page's language, with its addresses in it. */
function trailOf(breadcrumbs: Crumb[]): Crumb[] {
  const locale = getLocale()
  return [{ label: copy().breadcrumbs.home, href: '/' }, ...breadcrumbs].map((crumb) => ({
    label: crumb.label,
    href: localePath(locale, crumb.href),
  }))
}

/** The same trail as structured data, ending on this page when its path is given. */
function BreadcrumbData({ breadcrumbs, crumbLabel, path }: Omit<BreadcrumbsProps, 'className'>) {
  const locale = getLocale()
  const trail = [{ label: copy().breadcrumbs.home, href: '/' }, ...breadcrumbs, ...(path ? [{ label: crumbLabel, href: path }] : [])]
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.label,
          item: pageUrl(locale, crumb.href),
        })),
      }}
    />
  )
}

/**
 * The kit's trail above a page title, and the same trail as structured
 * data. On its own for pages whose start has its own shape (a partner's
 * profile opens with their banner).
 */
export function Breadcrumbs({ breadcrumbs, crumbLabel, path, className }: BreadcrumbsProps) {
  return (
    <>
      <Trail trail={trailOf(breadcrumbs)} current={crumbLabel} label={copy().breadcrumbs.label} className={className} />
      <BreadcrumbData breadcrumbs={breadcrumbs} crumbLabel={crumbLabel} path={path} />
    </>
  )
}

/**
 * How every inner page starts, the kit's PageStart: breadcrumb, serif title,
 * intro. This adds the trail's structured data and the site's words for it.
 */
export function PageHeader({ title, breadcrumbs, crumbLabel, path, children, className }: PageHeaderProps) {
  // The structured data goes first, so the page start keeps the same
  // neighbours on the page as before.
  return (
    <>
      {breadcrumbs && crumbLabel && <BreadcrumbData breadcrumbs={breadcrumbs} crumbLabel={crumbLabel} path={path} />}
      <PageStart
        title={title}
        breadcrumbs={breadcrumbs && trailOf(breadcrumbs)}
        current={crumbLabel}
        breadcrumbLabel={copy().breadcrumbs.label}
        className={className}
      >
        {children}
      </PageStart>
    </>
  )
}

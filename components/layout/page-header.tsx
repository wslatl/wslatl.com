import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/seo/json-ld'
import { cn } from '@/lib/utils'
import { pageUrl } from '@/lib/metadata'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localePath } from '@/i18n/config'

export interface Crumb {
  label: string
  href: string
}

interface PageHeaderProps {
  title: React.ReactNode
  /** Trail above the title. The current page is appended automatically. */
  breadcrumbs?: Crumb[]
  /** Plain-text name of this page, for the breadcrumb trail. */
  crumbLabel?: string
  /** This page's path, so structured data can end the trail on it. */
  path?: string
  children?: React.ReactNode
  className?: string
}

interface BreadcrumbsProps {
  /** Trail before the current page, which is appended automatically. */
  breadcrumbs: Crumb[]
  /** Plain-text name of this page. */
  crumbLabel: string
  /** This page's path, so structured data can end the trail on it. */
  path?: string
  className?: string
}

/**
 * The trail above a page title, and the same trail as structured data. Used
 * by PageHeader, and on its own by pages whose header has its own shape (a
 * partner's profile opens with their banner).
 */
export function Breadcrumbs({ breadcrumbs, crumbLabel, path, className }: BreadcrumbsProps) {
  const locale = getLocale()
  const trail = [{ label: copy().breadcrumbs.home, href: '/' }, ...breadcrumbs]

  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('mb-8 print:hidden', className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {trail.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <Link href={localePath(locale, crumb.href)} className="transition-colors hover:text-foreground">
                {crumb.label}
              </Link>
              <ChevronRight aria-hidden="true" className="size-3.5 opacity-60" />
            </li>
          ))}
          <li aria-current="page" className="font-medium text-foreground">
            {crumbLabel}
          </li>
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [...trail, ...(path ? [{ label: crumbLabel, href: path }] : [])].map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: crumb.label,
            item: pageUrl(locale, crumb.href),
          })),
        }}
      />
    </>
  )
}

/** Title block shared by every inner page: breadcrumb, serif title, intro. */
export function PageHeader({ title, breadcrumbs, crumbLabel, path, children, className }: PageHeaderProps) {
  return (
    <div className={cn('pt-14 pb-10 md:pt-20 md:pb-14', className)}>
      {breadcrumbs && crumbLabel && <Breadcrumbs breadcrumbs={breadcrumbs} crumbLabel={crumbLabel} path={path} />}
      <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] text-balance break-words hyphens-auto text-foreground italic md:text-6xl">
        {title}
      </h1>
      {children && (
        <div className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{children}</div>
      )}
    </div>
  )
}

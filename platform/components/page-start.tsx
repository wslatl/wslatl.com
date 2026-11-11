import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'

export interface Crumb {
  label: string
  href: string
}

export interface BreadcrumbsProps {
  /** The trail before the current page, home included. */
  trail: Crumb[]
  /** The current page's name. */
  current: string
  /** The language of `current` when it differs from the page's, such as an English guide title on a Spanish page. */
  currentLang?: string
  /** The nav's accessible name, for example "Breadcrumb". */
  label: string
  className?: string
}

/** The trail above a page title. Also usable on its own by pages whose start has its own shape. */
export function Breadcrumbs({ trail, current, currentLang, label, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cn('mb-8 print:hidden', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {trail.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <Link href={crumb.href} className="transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5 opacity-60" />
          </li>
        ))}
        <li aria-current="page" lang={currentLang} className="font-medium text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  )
}

export interface PageStartProps {
  /** The page's h1, set in the serif. */
  title: React.ReactNode
  /** The trail before this page, home included. Leave out on a home page. */
  breadcrumbs?: Crumb[]
  /** This page's name in the trail. Needed with `breadcrumbs`. */
  current?: string
  /** The language of `current` when it differs from the page's. */
  currentLang?: string
  /** The breadcrumb nav's accessible name. Needed with `breadcrumbs`. */
  breadcrumbLabel?: string
  /** One or two plain sentences. */
  children?: React.ReactNode
  className?: string
}

/** How every inner page starts: breadcrumb, large serif title, one or two sentences. */
export function PageStart({ title, breadcrumbs, current, currentLang, breadcrumbLabel, children, className }: PageStartProps) {
  return (
    <div className={cn('pt-14 pb-10 md:pt-20 md:pb-14', className)}>
      {breadcrumbs && current && breadcrumbLabel && (
        <Breadcrumbs trail={breadcrumbs} current={current} currentLang={currentLang} label={breadcrumbLabel} />
      )}
      <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.01em] text-balance break-words hyphens-auto text-foreground italic md:text-6xl">
        {title}
      </h1>
      {children && (
        <div className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{children}</div>
      )}
    </div>
  )
}

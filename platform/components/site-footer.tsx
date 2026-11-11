import { SiteLink } from './site-link'
import { cn } from '../lib/cn'

export interface FooterLink {
  label: string
  href: string
  /** Treat as off-site although it is not an absolute URL. */
  external?: boolean
}

export interface FooterColumn {
  /** The column's heading, which also names its nav. */
  title: string
  links: FooterLink[]
}

export interface SiteFooterProps {
  /** The link columns. The grid is built for four. */
  columns: FooterColumn[]
  /** What a screen reader hears after a link that opens a new tab. */
  newTabLabel: string
  /** The block on the left: a sentence about the company, a contact line. No logo, the mark shows once per page. */
  about?: React.ReactNode
  /** The line at the bottom left, for example the rights notice. */
  legal: React.ReactNode
  /** The link at the bottom right. */
  credit?: FooterLink
  className?: string
}

/** The footer: an about block, link columns, and a bottom line. */
export function SiteFooter({ columns, newTabLabel, about, legal, credit, className }: SiteFooterProps) {
  return (
    <footer className={cn('mt-24 border-t bg-card/20 print:hidden', className)}>
      <div className={cn('shell grid gap-12 py-14', about && 'lg:grid-cols-[1.1fr_3fr]')}>
        {about && <div className="max-w-xs">{about}</div>}

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-foreground">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <SiteLink
                      href={link.href}
                      external={link.external}
                      newTab={newTabLabel}
                      className="text-muted-foreground transition-colors break-words hyphens-auto hover:text-foreground"
                    >
                      {link.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{legal}</p>
          {credit && (
            <p>
              <SiteLink
                href={credit.href}
                external={credit.external}
                newTab={newTabLabel}
                className="transition-colors hover:text-foreground"
              >
                {credit.label}
              </SiteLink>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}

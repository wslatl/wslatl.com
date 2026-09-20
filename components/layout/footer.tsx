import Link from 'next/link'
import { Wordmark } from '@/components/brand/wordmark'
import { Email } from '@/components/ui/email'
import { SiteLink } from '@/components/ui/site-link'
import { footerColumns } from '@/data/footer'
import { siteConfig } from '@/config/site'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localePath } from '@/i18n/config'
import { localizedLegalPages } from '@/i18n/content'

export function Footer() {
  const locale = getLocale()
  const t = copy()
  const columns = footerColumns(t, locale, localizedLegalPages())

  return (
    <footer className="mt-24 border-t bg-card/20 print:hidden">
      <div className="shell grid gap-12 py-14 lg:grid-cols-[1.1fr_3fr]">
        <div className="max-w-xs">
          <Link
            href={localePath(locale, '/')}
            className="-m-1 inline-flex items-center rounded-md p-1"
            aria-label={t.header.home}
          >
            <Wordmark />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.footer.blurb(siteConfig.location)}</p>
          <p className="mt-4 text-sm">
            <Email name="support" className="text-foreground hover:text-link" />
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-foreground">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <SiteLink
                      href={link.href}
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
          <p>{t.footer.rights(new Date().getFullYear(), siteConfig.legal.companyName)}</p>
          <p>
            <SiteLink href={siteConfig.links.credits} className="transition-colors hover:text-foreground">
              {siteConfig.credits.label}
            </SiteLink>
          </p>
        </div>
      </div>
    </footer>
  )
}

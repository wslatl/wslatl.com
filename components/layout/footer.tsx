import { ShareSiteAd } from '@/components/share/ads'
import { Email } from '@/components/ui/email'
import { markShortLink } from '@/config/links'
import { footerColumns } from '@/data/footer'
import { siteConfig } from '@/config/site'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localizedLegalPages } from '@/i18n/content'
import { SiteFooter } from '@/platform/components/site-footer'

// Every page is static, so this is the year the site was built. Read here
// rather than while rendering, which keeps the render itself free of the clock.
const copyrightYear = new Date().getFullYear()

/** The kit's footer, with this site's columns, its about block and its bottom line. */
export function Footer() {
  const locale = getLocale()
  const t = copy()

  return (
    <SiteFooter
      columns={footerColumns(t, locale, localizedLegalPages())}
      newTabLabel={t.header.newTab}
      // No logo here: the brand kit shows the mark once per page, in the header.
      about={
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.footer.blurb(siteConfig.location)} <span lang="en">{siteConfig.slogan}</span>
          </p>
          <p className="mt-4 text-sm">
            <Email name="support" className="text-foreground hover:text-link" />
          </p>
          <p className="mt-5 text-sm text-muted-foreground">{t.share.shareOurAdHint}</p>
          <ShareSiteAd size="sm" className="mt-2" />
        </>
      }
      legal={t.footer.rights(copyrightYear, siteConfig.legal.companyName)}
      credit={markShortLink({ label: siteConfig.credits.label, href: siteConfig.links.credits })}
    />
  )
}

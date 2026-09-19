import { Header } from '@/components/layout/header'
import { siteConfig } from '@/config/site'
import { mainNav, portalLinks, requestAccessLink } from '@/data/nav'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localePath } from '@/i18n/config'

/**
 * Prepares everything the header needs in the current language and hands it
 * over. The header itself runs in the browser, where the locale cannot be
 * read (see i18n/locale.ts), so it only ever receives plain strings.
 */
export function SiteHeader() {
  const locale = getLocale()
  const t = copy()

  return (
    <Header
      locale={locale}
      homeHref={localePath(locale, '/')}
      nav={mainNav(t, locale)}
      portals={portalLinks(t)}
      requestAccess={requestAccessLink(t)}
      discordHref={siteConfig.links.discord}
      registerHref={siteConfig.links.register}
      labels={t.header}
    />
  )
}

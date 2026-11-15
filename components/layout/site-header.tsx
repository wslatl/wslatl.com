import { DiscordIcon } from '@/components/brand/icons'
import { LoginMenu } from '@/components/layout/login-menu'
import { MobileMenuEnd } from '@/components/layout/mobile-menu-end'
import { siteConfig } from '@/config/site'
import { mainNav, portalLinks, requestAccessLink } from '@/data/nav'
import { words } from '@/i18n/words'
import { getLocale } from '@/i18n/locale'
import { localeNames, localePath, locales } from '@/i18n/config'
import { Button } from '@/platform/components/button'
import { SiteHeader as Header } from '@/platform/components/site-header'

/**
 * The kit's header, with this site's links, words and right-hand side: the
 * language picker, Discord, the Login menu and Get started. Everything is
 * prepared here in the current language and handed over: the header runs in
 * the browser, where the locale cannot be read (see i18n/locale.ts), so it
 * only ever receives plain strings and elements.
 */
export function SiteHeader() {
  const locale = getLocale()
  const t = words()
  const labels = words('header')
  return (
    <Header
      homeHref={localePath(locale, '/')}
      homeLabel={labels('home')}
      // Discord is one more row of the mobile menu's list. The desktop bar
      // shows it as the icon beside the language picker instead.
      nav={[
        ...mainNav(t, locale),
        { label: t('footer.links.discord'), href: siteConfig.links.discord, external: true, mobileOnly: true },
      ]}
      navLabel={labels('mainNav')}
      newTabLabel={labels('newTab')}
      openMenuLabel={labels('openMenu')}
      // English pages are built under /en while their links have no prefix,
      // so every language is a prefix to look past when marking the page.
      localePrefixes={[...locales]}
      // The kit's picker: the same page in each language, plain links that
      // work with no script, in the bar from 40rem up and at the end of the
      // mobile menu below that.
      languages={{
        locale,
        label: `${labels('language')}: ${localeNames[locale]}`,
        heading: labels('chooseLanguage'),
      }}
      actions={
        <>
          <Button asChild variant="ghost" size="icon-sm" className="hidden sm:inline-flex">
            <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" aria-label={labels('discord')}>
              <DiscordIcon className="size-[18px]" />
            </a>
          </Button>
          <LoginMenu
            portals={portalLinks(t)}
            requestAccess={requestAccessLink(t)}
            labels={{ login: labels('login'), clientPanels: labels('clientPanels'), newTab: labels('newTab') }}
          />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
              {labels('getStarted')}
              <span className="sr-only">{labels('newTab')}</span>
            </a>
          </Button>
        </>
      }
      mobileFooter={
        <MobileMenuEnd
          registerHref={siteConfig.links.register}
          labels={{
            getStarted: labels('getStarted'),
            newTab: labels('newTab'),
            reviewNote: labels('reviewNote'),
          }}
        />
      }
    />
  )
}

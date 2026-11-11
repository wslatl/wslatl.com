import type { Metadata } from 'next'
import { locale as requestedLocale } from 'next/root-params'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { TabTitle } from '@/components/layout/tab-title'
import { siteConfig } from '@/config/site'
import { defaultLocale, localePath } from '@/i18n/config'
import { getLocale, setLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { Button } from '@/platform/components/button'
import { ErrorPage } from '@/platform/components/error-page'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default async function NotFound() {
  // This page is rendered on its own, without the params of the page it
  // stands in for, so the language comes from the address instead. Reading a
  // header here would answer every 404 correctly and cost the whole site its
  // static pages, because a header is only knowable per request.
  setLocale((await requestedLocale()) ?? defaultLocale)
  const locale = getLocale()
  const t = copy()
  const path = (href: string) => localePath(locale, href)
  const destinations = [
    { label: t.notFound.destinations.pricing, href: path('/pricing') },
    { label: t.notFound.destinations.games, href: path('/games') },
    { label: t.notFound.destinations.services, href: path('/#services') },
    { label: t.notFound.destinations.legal, href: path('/legal') },
  ]

  return (
    // The framework renders this page on its own, outside the layout that
    // carries <html lang>, so the language is declared here instead. It also
    // sends it to the browser as data rather than as finished markup, which
    // is why a reader with no JavaScript gets nothing here. Both follow from
    // <html> living in app/[locale]; moving it out would fix them and cost
    // every translated page the right language, which is the worse trade.
    <div lang={locale}>
      <TabTitle title={`${t.notFound.metaTitle} | ${siteConfig.brand}`} />
      <SiteHeader />
      {/* The kit's 404: the code, the serif heading, places to go and the buttons. */}
      <ErrorPage
        variant="notFound"
        code="404"
        heading={t.notFound.heading}
        destinations={destinations}
        actions={
          <>
            <Button asChild>
              <Link href={path('/')}>{t.notFound.home}</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
                {t.notFound.askOnDiscord}
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </Button>
          </>
        }
      >
        {t.notFound.body}
      </ErrorPage>
      <Footer />
    </div>
  )
}

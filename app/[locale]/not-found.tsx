import type { Metadata } from 'next'
import { locale as requestedLocale } from 'next/root-params'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { TabTitle } from '@/components/layout/tab-title'
import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale, localePath, locales, openGraphLocales } from '@/i18n/config'
import { getLocale, setLocale } from '@/i18n/locale'
import { words, wordsFor } from '@/i18n/words'
import { Button } from '@/platform/components/button'
import { ErrorPage } from '@/platform/components/error-page'

/**
 * The title, description and Open Graph language in the language of the
 * address, read from the same root parameter as the page below. Robots is set
 * here so the layout's "index, follow" is not left on a 404 beside the
 * framework's own noindex (two noindex tags say the same thing; one saying
 * index would not). scripts/check-seo.mjs checks each language's 404 for its
 * title, og:locale and that no robots tag allows indexing.
 */
export async function generateMetadata(): Promise<Metadata> {
  const requested = await requestedLocale()
  const locale = isLocale(requested) ? requested : defaultLocale
  const t = wordsFor(locale, 'notFound')
  const title = `${t('metaTitle')} | ${siteConfig.brand}`
  return {
    title: t('metaTitle'),
    description: t('body'),
    robots: { index: false },
    openGraph: {
      locale: openGraphLocales[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => openGraphLocales[other]),
      title,
      description: t('body'),
    },
    twitter: { title, description: t('body') },
  }
}

export default async function NotFound() {
  // This page is rendered on its own, without the params of the page it
  // stands in for, so the language comes from the address instead. Reading a
  // header here would answer every 404 correctly and cost the whole site its
  // static pages, because a header is only knowable per request.
  setLocale((await requestedLocale()) ?? defaultLocale)
  const locale = getLocale()
  const t = words()
  const path = (href: string) => localePath(locale, href)
  const destinations = [
    { label: t('notFound.destinations.pricing'), href: path('/pricing') },
    { label: t('notFound.destinations.games'), href: path('/games') },
    { label: t('notFound.destinations.services'), href: path('/#services') },
    { label: t('notFound.destinations.legal'), href: path('/legal') },
  ]

  return (
    // The framework renders this page on its own, outside the layout that
    // carries <html lang>, so the language is declared here instead. It also
    // sends it to the browser as data rather than as finished markup, which
    // is why a reader with no JavaScript gets nothing here. Both follow from
    // <html> living in app/[locale]; moving it out would fix them and cost
    // every translated page the right language, which is the worse trade.
    <div lang={locale}>
      <TabTitle title={`${t('notFound.metaTitle')} | ${siteConfig.brand}`} />
      <SiteHeader />
      {/* The kit's 404: the code, the serif heading, places to go and the buttons. */}
      <ErrorPage
        variant="notFound"
        code="404"
        heading={t('notFound.heading')}
        destinations={destinations}
        actions={
          <>
            <Button asChild>
              <Link href={path('/')}>{t('notFound.home')}</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
                {t('notFound.askOnDiscord')}
                <span className="sr-only">{t('header.newTab')}</span>
              </a>
            </Button>
          </>
        }
      >
        {t('notFound.body')}
      </ErrorPage>
      <Footer />
    </div>
  )
}

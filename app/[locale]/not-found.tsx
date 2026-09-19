import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { Main } from '@/components/layout/main'
import { localePath } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default function NotFound() {
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
    <>
      <SiteHeader />
      <Main className="shell pt-20 pb-10 md:pt-28">
        <p className="text-sm font-medium text-link">404</p>
        <h1 className="mt-3 font-serif text-5xl text-foreground italic md:text-6xl">{t.notFound.heading}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.notFound.body}</p>
        <ul className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          {destinations.map((d) => (
            <li key={d.href} className="bg-background">
              <Link
                href={d.href}
                className="block p-4 font-medium text-foreground transition-colors hover:bg-card/50 hover:text-link"
              >
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={path('/')}>{t.notFound.home}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
              {t.notFound.askOnDiscord}
              <span className="sr-only">{t.header.newTab}</span>
            </a>
          </Button>
        </div>
      </Main>
      <Footer />
    </>
  )
}

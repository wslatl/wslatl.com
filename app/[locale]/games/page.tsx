import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { GameDirectory, type GameListing } from '@/components/games/game-directory'
import { games, ramNeedGb } from '@/data/games'
import { siteConfig } from '@/config/site'
import { cheapestPlanWithRam, formatPrice, pricingHref, startingPrice } from '@/lib/pricing'
import { pageMetadata } from '@/lib/metadata'
import { Main } from '@/components/layout/main'
import { localePath, type Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { localizedGameCategories, localizedGames } from '@/i18n/content'

// The four named in the title, plus the rest rounded down to a tidy "40+".
const moreCount = Math.floor((games.length - 4) / 10) * 10

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  const t = copy().games
  return pageMetadata({
    title: t.metaTitle(moreCount),
    description: t.metaDescription(formatPrice(startingPrice('game'))),
    path: '/games',
    locale,
  })
}

export default async function GamesPage({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const t = copy()
  const path = (href: string) => localePath(locale, href)

  const listings: GameListing[] = localizedGames().map((game) => {
    // The cheapest plan that covers the game's smallest recommended setup.
    const entry = cheapestPlanWithRam('game', ramNeedGb(game.recommendedRam[0]))
    return {
      slug: game.slug,
      name: game.name,
      category: game.category,
      tagline: game.tagline,
      startingRam: game.recommendedRam[0].ram,
      fromPrice: entry ? formatPrice(entry.plan.price) : null,
      featured: !!game.featured,
      href: path(`/games/${game.slug}`),
    }
  })

  return (
    <>
      <SiteHeader />
      <Main className="shell">
        <PageHeader title={t.games.heading} breadcrumbs={[]} crumbLabel={t.games.crumb} path="/games">
          <p>
            {t.games.introPrefix}{' '}
            <Link href={path(pricingHref('game'))} className="text-link underline underline-offset-4 hover:text-foreground">
              {t.games.introLink}
            </Link>
            {t.games.introSuffix}
          </p>
        </PageHeader>

        <GameDirectory
          games={listings}
          categories={localizedGameCategories()}
          discordHref={siteConfig.links.discord}
          labels={{
            searchLabel: t.games.searchLabel,
            searchPlaceholder: t.games.searchPlaceholder(listings.length),
            categories: t.games.categories,
            matchCount: t.games.matchCount,
            showing: t.games.showing,
            noMatch: t.games.noMatch,
            noMatchHelp: t.games.noMatchHelp,
            askOnDiscord: t.games.askOnDiscord,
            newTab: t.header.newTab,
            featured: t.games.featured,
            toStart: t.games.toStart,
            fromPrice: t.games.fromPrice,
          }}
        />
      </Main>
      <Footer />
    </>
  )
}

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { GameDirectory, type GameListing } from '@/components/games/game-directory'
import { games, gameCategories, ramNeedGb } from '@/data/games'
import { cheapestPlanWithRam, formatPrice, pricingHref, startingPrice } from '@/lib/pricing'
import { pageMetadata } from '@/lib/metadata'
import { Main } from '@/components/layout/main'

// The four named in the title, plus the rest rounded down to a tidy "40+".
const moreCount = Math.floor((games.length - 4) / 10) * 10

export const metadata = pageMetadata({
  title: `Game Server Hosting: Minecraft, Rust, ARK, FiveM & ${moreCount}+ More`,
  description: `DDoS-protected game server hosting from ${formatPrice(startingPrice('game'))}/mo on NVMe and SATA SSD hardware. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld and dozens more, all on the same Pterodactyl panel.`,
  path: '/games',
})

/** Price of the cheapest plan that covers a game's smallest recommended setup. */
function entryPrice(game: (typeof games)[number]): string | null {
  const entry = cheapestPlanWithRam('game', ramNeedGb(game.recommendedRam[0]))
  return entry ? formatPrice(entry.plan.price) : null
}

export default function GamesPage() {
  const listings: GameListing[] = games.map((game) => ({
    slug: game.slug,
    name: game.name,
    category: game.category,
    tagline: game.tagline,
    startingRam: game.recommendedRam[0].ram,
    fromPrice: entryPrice(game),
    featured: !!game.featured,
  }))

  return (
    <>
      <Header />
      <Main className="shell">
        <PageHeader title="Game server hosting" breadcrumbs={[]} crumbLabel="Games">
          <p>
            Every game runs on the same Pterodactyl-powered plans: you pick the RAM, not a game-locked
            package. Find your game for realistic RAM guidance, then compare{' '}
            <Link href={pricingHref('game')} className="text-link underline underline-offset-4 hover:text-foreground">
              game server plans
            </Link>
            . Don&rsquo;t see yours? If it has a dedicated server, we can almost always run it.
          </p>
        </PageHeader>

        <GameDirectory games={listings} categories={gameCategories} />
      </Main>
      <Footer />
    </>
  )
}

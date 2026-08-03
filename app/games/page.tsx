import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal, RevealGroup } from '@/components/effects/reveal'
import { games, gameCategories } from '@/data/games'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Game Server Hosting - Minecraft, Rust, ARK, FiveM & 40+ More',
  description:
    'Cheap, DDoS-protected game server hosting on NVMe and SATA SSD hardware. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld and dozens more, all on the same Pterodactyl panel.',
  alternates: { canonical: `${siteConfig.siteUrl}/games` },
  openGraph: {
    title: 'Game Server Hosting - Minecraft, Rust, ARK, FiveM & 40+ More | WSLATL LLC',
    description:
      'Cheap, DDoS-protected game server hosting on NVMe and SATA SSD hardware, all on the same Pterodactyl panel.',
    url: `${siteConfig.siteUrl}/games`,
  },
}

export default function GamesPage() {
  return (
    <div className="relative min-h-screen page-enter">
      <Header />

      {/* Header and Footer must stay outside <main> so they keep their
          implicit banner/contentinfo landmark roles - a <header>/<footer>
          nested inside <main> loses that role entirely. */}
      <main id="main-content" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-8 md:pb-10 text-center">
          <Reveal>
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Game Server Hosting
            </p>
            <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.05] tracking-[-0.03em]">
              Pick your <span className="font-serif italic font-normal text-foreground/95">game.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Every plan below runs on the same Pterodactyl-powered hardware. Pick the game you actually
              play, see realistic RAM guidance for it, then choose your plan on the{' '}
              <Link href="/pricing" className="text-primary hover:underline underline-offset-2">
                pricing page
              </Link>
              .
            </p>
            <p className="mt-6 text-sm text-foreground/80">
              Don&rsquo;t see your game below? Ask us. If it has a dedicated server, we can almost always run it.
            </p>
          </Reveal>
        </div>

        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            {gameCategories.map((category) => {
              const inCategory = games.filter((g) => g.category === category)
              return (
                <div key={category}>
                  <Reveal>
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 tracking-tight">
                      {category}
                    </h2>
                  </Reveal>
                  <RevealGroup
                    as="div"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    step={40}
                  >
                    {inCategory.map((game) => (
                      <Link
                        key={game.slug}
                        href={`/games/${game.slug}`}
                        className="group flex flex-col p-5 rounded-xl border border-border/70 bg-card/30 hover:border-primary/40 hover:bg-card/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <h3 className="font-semibold text-foreground mb-1.5 tracking-tight">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
                          {game.tagline}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                          View hosting details
                          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    ))}
                  </RevealGroup>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

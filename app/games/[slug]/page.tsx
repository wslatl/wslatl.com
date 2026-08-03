import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Check } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal } from '@/components/effects/reveal'
import { Button } from '@/components/ui/button'
import { games, gameBySlug, gamesCtaHref } from '@/data/games'
import { siteConfig } from '@/config/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const game = gameBySlug(slug)
  if (!game) return {}

  const title = `${game.name} Server Hosting`
  const description = `${game.name} server hosting on NVMe and SATA SSD hardware with DDoS protection and a Pterodactyl panel. ${game.tagline}`

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.siteUrl}/games/${game.slug}` },
    openGraph: {
      title: `${title} | WSLATL LLC`,
      description,
      url: `${siteConfig.siteUrl}/games/${game.slug}`,
    },
  }
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params
  const game = gameBySlug(slug)
  if (!game) notFound()

  const related = games
    .filter((g) => g.category === game.category && g.slug !== game.slug)
    .slice(0, 6)

  const faqJsonLd = game.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: game.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }
    : null

  return (
    <div className="relative min-h-screen page-enter">
      <Header />

      {faqJsonLd && (
        // JSON-LD, not HTML: the FAQ copy is static content from data/games.ts,
        // never user input. The escape guards the one real risk here — a
        // literal `</script>` inside the JSON string breaking out of the tag —
        // as defense-in-depth in case a future FAQ answer contains one.
        // eslint-disable-next-line react/no-danger
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
        />
      )}

      {/* Header and Footer must stay outside <main> so they keep their
          implicit banner/contentinfo landmark roles - a <header>/<footer>
          nested inside <main> loses that role entirely. */}
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
          <Link href="/games" className="hover:text-primary transition-colors">Games</Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
          <span className="text-foreground font-medium">{game.name}</span>
        </nav>

        <Reveal>
          <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
            {game.category}
          </p>
          <h1 className="text-balance text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-[1.08] tracking-[-0.03em]">
            {game.name} <span className="font-serif italic font-normal text-foreground/90">Server Hosting</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
            {game.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Button asChild size="lg">
              <a href={gamesCtaHref} target="_blank" rel="noopener noreferrer">
                Order a {game.name} server
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See plan pricing</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <section aria-labelledby="ram-heading" className="mb-12">
            <h2 id="ram-heading" className="text-xl font-semibold text-foreground mb-4 tracking-tight">
              How much RAM does {game.name} need?
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full text-sm">
                <caption className="sr-only">Recommended RAM for {game.name} by player count</caption>
                <thead>
                  <tr className="border-b border-border/70 bg-card/40">
                    <th scope="col" className="text-left font-semibold text-foreground px-4 py-3">Scenario</th>
                    <th scope="col" className="text-left font-semibold text-foreground px-4 py-3">Recommended RAM</th>
                  </tr>
                </thead>
                <tbody>
                  {game.recommendedRam.map((row) => (
                    <tr key={row.players} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-3 text-foreground/90">{row.players}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.ram}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              These are starting points, not hard limits. Every plan can be changed later as your server grows.
            </p>
          </section>
        </Reveal>

        {game.popularFor.length > 0 && (
          <Reveal delay={120}>
            <section aria-labelledby="popular-heading" className="mb-12">
              <h2 id="popular-heading" className="text-xl font-semibold text-foreground mb-4 tracking-tight">
                Popular {game.name} setups
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {game.popularFor.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check aria-hidden="true" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}

        <Reveal delay={160}>
          <section aria-labelledby="included-heading" className="mb-12">
            <h2 id="included-heading" className="text-xl font-semibold text-foreground mb-4 tracking-tight">
              What&rsquo;s included
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                'Pterodactyl control panel access',
                'DDoS protection built in',
                'NVMe or SATA SSD storage, your choice',
                'Full mod and plugin support',
                'Same-day setup, most of the time',
                'A real person to talk to if something breaks',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check aria-hidden="true" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {game.faqs.length > 0 && (
          <Reveal delay={200}>
            <section aria-labelledby="faq-heading" className="mb-12">
              <h2 id="faq-heading" className="text-xl font-semibold text-foreground mb-4 tracking-tight">
                {game.name} hosting questions
              </h2>
              <div className="space-y-4">
                {game.faqs.map((faq) => (
                  <div key={faq.q} className="p-5 rounded-xl border border-border/70 bg-card/30">
                    <h3 className="font-semibold text-foreground mb-1.5">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {related.length > 0 && (
          <Reveal delay={240}>
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-semibold text-foreground mb-4 tracking-tight">
                More {game.category.toLowerCase()}
              </h2>
              <div className="flex flex-wrap gap-2">
                {related.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium border border-border/70 text-foreground/80 hover:text-foreground hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {g.name}
                  </Link>
                ))}
                <Link
                  href="/games"
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium text-primary hover:underline underline-offset-2"
                >
                  View all games
                </Link>
              </div>
            </section>
          </Reveal>
        )}
      </main>

      <Footer />
    </div>
  )
}

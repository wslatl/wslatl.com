import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { PlanGroupTable } from '@/components/pricing/plan-group'
import { FaqList } from '@/components/sections/faq'
import { JsonLd } from '@/components/seo/json-ld'
import { Button } from '@/components/ui/button'
import { games, gameBySlug, ramNeedGb } from '@/data/games'
import { siteConfig } from '@/config/site'
import { cheapestPlanWithRam, formatPrice, productLine, smallestPlansWithRam } from '@/lib/pricing'
import { pageMetadata } from '@/lib/metadata'
import { slugify } from '@/lib/utils'
import { Main } from '@/components/layout/main'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

/** "GAME-1 ($3.60/mo) or P-GAME-1 ($12.00/mo)", or a way to ask when nothing is big enough. */
function PlansThatFit({ ramGb }: { ramGb: number }) {
  const fits = smallestPlansWithRam('game', ramGb)
  if (fits.length === 0) {
    return (
      <Link href="/#contact" className="text-link underline underline-offset-4 hover:text-foreground">
        Bigger than our game plans: ask us
      </Link>
    )
  }
  return fits.map(({ plan }, i) => (
    <span key={plan.name}>
      {i > 0 && ' or '}
      <span className="whitespace-nowrap">
        <span className="font-medium text-foreground">{plan.name}</span> ({formatPrice(plan.price)}/mo)
      </span>
    </span>
  ))
}

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const game = gameBySlug(slug)
  if (!game) return {}

  return pageMetadata({
    title: `${game.name} Server Hosting`,
    description: `${game.name} server hosting on NVMe and SATA SSD hardware with DDoS protection and a Pterodactyl panel. ${game.tagline}`,
    path: `/games/${game.slug}`,
  })
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params
  const game = gameBySlug(slug)
  if (!game) notFound()

  const line = productLine('game')
  // The cheapest plan that covers the smallest recommended setup.
  const entry = cheapestPlanWithRam('game', ramNeedGb(game.recommendedRam[0]))
  const related = games.filter((g) => g.category === game.category && g.slug !== game.slug).slice(0, 8)
  const faqs = game.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))

  return (
    <>
      <Header />
      {faqs.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }}
        />
      )}

      <Main className="shell">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14 xl:gap-20">
        <div className="min-w-0">
          <PageHeader
            title={`${game.name} server hosting`}
            breadcrumbs={[{ label: 'Games', href: '/games' }]}
            crumbLabel={game.name}
          >
            <p>{game.description}</p>
          </PageHeader>

          <div className="-mt-2 flex flex-col gap-3 sm:flex-row sm:items-center lg:hidden">
            <Button asChild size="lg">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                Order a {game.name} server
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#plans">Compare plans</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground lg:mt-0">
            Listed under{' '}
            <Link href={`/games#${slugify(game.category)}`} className="text-link underline underline-offset-4 hover:text-foreground">
              {game.category}
            </Link>
            . Plans are not locked to one game, so you can switch titles any time.
          </p>

        <section aria-labelledby="ram-heading" className="mt-16">
          <h2 id="ram-heading" className="text-2xl font-semibold tracking-tight text-foreground">
            How much RAM does {game.name} need?
          </h2>
          {/* Table from sm up; stacked rows on phones, where three columns would crush the plan names. */}
          <div className="mt-5 hidden overflow-hidden rounded-xl border sm:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Recommended RAM for {game.name} and the smallest plans that cover it
              </caption>
              <thead className="bg-card/50 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Setup</th>
                  <th scope="col" className="px-4 py-3 font-medium">Recommended RAM</th>
                  <th scope="col" className="px-4 py-3 font-medium">Smallest plans that fit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {game.recommendedRam.map((row) => (
                  <tr key={row.players}>
                    <th scope="row" className="px-4 py-3.5 font-medium text-foreground">{row.players}</th>
                    <td className="px-4 py-3.5 whitespace-nowrap text-foreground/90">{row.ram}</td>
                    <td className="px-4 py-3.5 text-muted-foreground tabular-nums">
                      <PlansThatFit ramGb={ramNeedGb(row)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-5 divide-y rounded-xl border sm:hidden">
            {game.recommendedRam.map((row) => (
              <li key={row.players} className="p-4">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-foreground">{row.players}</span>
                  <span className="shrink-0 text-sm whitespace-nowrap text-foreground/90">{row.ram}</span>
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground tabular-nums">
                  Fits: <PlansThatFit ramGb={ramNeedGb(row)} />
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            These are starting points, not hard limits. Every plan can be changed later as your server grows.
          </p>
        </section>
        </div>

        <aside aria-label={`${game.name} hosting at a glance`} className="hidden lg:block">
          <div className="sticky top-24 mt-24 rounded-2xl border bg-card/30 p-6">
            {entry && (
              <>
                <p className="text-sm font-medium text-muted-foreground">{game.name} hosting</p>
                <p className="mt-2 text-sm text-muted-foreground tabular-nums">
                  from{' '}
                  <span className="text-4xl font-bold tracking-[-0.03em] text-foreground">
                    {formatPrice(entry.plan.price)}
                  </span>
                  /mo
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground tabular-nums">
                  {entry.plan.name}: {entry.plan.cpu} {line.cpuUnit}, {entry.plan.ramGb} GB RAM,{' '}
                  {entry.plan.storageGb} GB {entry.group.storageType}
                </p>
              </>
            )}
            <Button asChild size="lg" className="mt-6 w-full">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                Order a {game.name} server
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="mt-2 w-full">
              <a href="#plans">Compare plans</a>
            </Button>
            <ul className="mt-6 space-y-2 border-t pt-5 text-sm text-muted-foreground">
              {line.included.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        </div>

        <section id="plans" aria-labelledby="plans-heading" className="mt-16">
          <h2 id="plans-heading" className="text-2xl font-semibold tracking-tight text-foreground">
            Game server plans
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The same plans run every game we host. Budget plans use SATA SSD; Premium plans add NVMe
            and Ryzen 9 cores.
          </p>
          <div className="mt-8 space-y-12">
            {line.groups.map((group) => (
              <PlanGroupTable key={group.id} line={line} group={group} />
            ))}
          </div>
        </section>

        <div className="mt-16 grid max-w-4xl gap-12 md:grid-cols-2">
          {game.popularFor.length > 0 && (
            <section aria-labelledby="popular-heading">
              <h2 id="popular-heading" className="text-lg font-semibold tracking-tight text-foreground">
                Popular {game.name} setups
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/90">
                {game.popularFor.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
                    <span className="first-letter:uppercase">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="included-heading">
            <h2 id="included-heading" className="text-lg font-semibold tracking-tight text-foreground">
              Included with every game plan
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/90">
              {line.included.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="mt-16 max-w-4xl">
            <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-foreground">
              {game.name} hosting questions
            </h2>
            <FaqList faqs={faqs} className="mt-4" />
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16">
            <h2 id="related-heading" className="text-lg font-semibold tracking-tight text-foreground">
              More {game.category.toLowerCase()} games
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/games/${g.slug}`}
                    className="inline-block rounded-full border px-3.5 py-1.5 text-sm text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/games" className="inline-block px-3.5 py-1.5 text-sm font-medium text-link hover:text-foreground">
                  All games
                </Link>
              </li>
            </ul>
          </section>
        )}
      </Main>
      <Footer />
    </>
  )
}

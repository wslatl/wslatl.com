import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { PlanGroupTable } from '@/components/pricing/plan-group'
import { FaqList } from '@/components/sections/faq'
import { JsonLd } from '@/components/seo/json-ld'
import { Button } from '@/components/ui/button'
import { games, ramNeedGb, type RamRow } from '@/data/games'
import { siteConfig } from '@/config/site'
import { cheapestPlanWithRam, formatPrice, smallestPlansWithRam } from '@/lib/pricing'
import { pageMetadata } from '@/lib/metadata'
import { slugify } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import { localePath, type Locale } from '@/i18n/config'
import { getLocale, setLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { localizedGames, localizedProductLine } from '@/i18n/content'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

/** The game in the language of the page, or nothing when the slug is unknown. */
function localizedGame(slug: string) {
  return localizedGames().find((game) => game.slug === slug)
}

/**
 * "GAME-1 ($3.60/mo) or P-GAME-1 ($12.00/mo)", or a way to ask when nothing is
 * big enough. Rows sized "per map" (clusters) name the plan for each map,
 * since every map in a cluster runs as its own server.
 */
function PlansThatFit({ row }: { row: RamRow }) {
  const t = copy().games.detail
  const fits = smallestPlansWithRam('game', ramNeedGb(row))
  const perMap = /per map/i.test(row.ram)
  if (fits.length === 0) {
    return (
      <Link
        href={localePath(getLocale(), '/#contact')}
        className="text-link underline underline-offset-4 hover:text-foreground"
      >
        {t.tooBig}
      </Link>
    )
  }
  return fits.map(({ plan }, i) => (
    <span key={plan.name}>
      {i === 0 && perMap && t.perMap}
      {i > 0 && t.or}
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
  const { locale, slug } = await params
  setLocale(locale)
  const game = localizedGame(slug)
  if (!game) return {}

  return pageMetadata({
    title: copy().games.detail.metaTitle(game.name),
    description: `${copy().games.detail.heading(game.name)}. ${game.tagline}`,
    path: `/games/${game.slug}`,
    locale,
  })
}

export default async function GamePage({ params }: PageProps) {
  const { locale, slug } = await params
  setLocale(locale)
  const t = copy()
  const path = (href: string) => localePath(locale, href)
  const game = localizedGame(slug)
  if (!game) notFound()

  const line = localizedProductLine('game')
  // The cheapest plan that covers the smallest recommended setup.
  const entry = cheapestPlanWithRam('game', ramNeedGb(game.recommendedRam[0]))
  const related = localizedGames().filter((g) => g.category === game.category && g.slug !== game.slug).slice(0, 8)
  const faqs = game.faqs.map((faq, i) => ({ id: `${game.slug}-faq-${i}`, question: faq.q, answer: faq.a }))

  return (
    <>
      <SiteHeader />
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
            title={t.games.detail.heading(game.name)}
            breadcrumbs={[{ label: t.games.crumb, href: '/games' }]}
            crumbLabel={game.name}
            path={`/games/${game.slug}`}
          >
            <p>{game.description}</p>
          </PageHeader>

          <div className="-mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:hidden">
            <Button asChild size="lg" className="h-auto min-h-11 py-2.5 text-center whitespace-normal">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                {t.games.detail.order(game.name)}
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#plans">{t.games.detail.comparePlans}</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground lg:mt-0">
            {t.games.detail.listedUnderPrefix}{' '}
            <Link
              href={path(`/games#${slugify(game.category)}`)}
              className="text-link underline underline-offset-4 hover:text-foreground"
            >
              {game.category}
            </Link>
            {t.games.detail.listedUnderSuffix}
          </p>

        <section aria-labelledby="ram-heading" className="@container mt-16">
          <h2 id="ram-heading" className="text-2xl font-semibold tracking-tight text-foreground">
            {t.games.detail.ramHeading(game.name)}
          </h2>
          {/* A table when there is room (measured in rem, so enlarged text counts); stacked rows otherwise, where three columns would crush the plan names. */}
          <div className="mt-5 hidden overflow-hidden rounded-xl border @min-[36rem]:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                {t.games.detail.ramCaption(game.name)}
              </caption>
              <thead className="bg-card/50 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">{t.games.detail.setup}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.games.detail.recommendedRam}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.games.detail.smallestPlans}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {game.recommendedRam.map((row) => (
                  <tr key={row.players}>
                    <th scope="row" className="px-4 py-3.5 font-medium text-foreground">{row.players}</th>
                    <td className="px-4 py-3.5 whitespace-nowrap text-foreground/90">{row.ram}</td>
                    <td className="px-4 py-3.5 text-muted-foreground tabular-nums">
                      <PlansThatFit row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-5 divide-y rounded-xl border @min-[36rem]:hidden">
            {game.recommendedRam.map((row) => (
              <li key={row.players} className="p-4">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-foreground">{row.players}</span>
                  <span className="shrink-0 text-sm whitespace-nowrap text-foreground/90">{row.ram}</span>
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground tabular-nums">
                  {t.games.detail.fits} <PlansThatFit row={row} />
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            {t.games.detail.ramNote}
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
            <Button asChild size="lg" className="mt-6 h-auto min-h-11 w-full py-2.5 text-center whitespace-normal">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                {t.games.detail.order(game.name)}
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="mt-2 w-full">
              <a href="#plans">{t.games.detail.comparePlans}</a>
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
                {t.games.detail.popular(game.name)}
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
              {t.games.detail.included}
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
              {t.games.detail.questions(game.name)}
            </h2>
            <FaqList faqs={faqs} className="mt-4" />
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16">
            <h2 id="related-heading" className="text-lg font-semibold tracking-tight text-foreground">
              {t.games.detail.moreIn(game.category.toLowerCase())}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={path(`/games/${g.slug}`)}
                    className="inline-block rounded-full border px-3.5 py-1.5 text-sm text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={path('/games')} className="inline-block px-3.5 py-1.5 text-sm font-medium text-link hover:text-foreground">
                  {t.games.detail.allGames}
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

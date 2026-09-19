import Link from 'next/link'
import { ArrowDown, Check, Gamepad2, Server } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { PlanGroupTable } from '@/components/pricing/plan-group'
import { SectionNav } from '@/components/pricing/section-nav'
import { Button } from '@/components/ui/button'
import { HowItWorks } from '@/components/sections/how-it-works'
import type { ProductLine } from '@/data/pricing'
import { uptimeTarget } from '@/data/sla'
import { formatPrice, specRanges, startingPrice } from '@/lib/pricing'
import { pageMetadata } from '@/lib/metadata'
import { Main } from '@/components/layout/main'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { localizedProductLines } from '@/i18n/content'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  const t = copy().pricing
  return pageMetadata({
    title: t.metaTitle,
    description: t.metaDescription(formatPrice(startingPrice('vps')), formatPrice(startingPrice('game'))),
    path: '/pricing',
    locale,
  })
}

const lineIcons: Record<ProductLine['id'], typeof Server> = {
  vps: Server,
  game: Gamepad2,
}

function LineOverview({ line }: { line: ProductLine }) {
  const t = copy().pricing
  const Icon = lineIcons[line.id]
  const ranges = specRanges(line.id)
  return (
    <a href={`#${line.anchor}`} className="group flex h-full flex-col bg-background p-6 transition-colors hover:bg-card/50 sm:p-8">
      <span className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
        <Icon aria-hidden="true" className="size-5 text-link" strokeWidth={1.75} />
        {t.lines[line.id]}
      </span>
      <span className="mt-4 text-sm text-muted-foreground tabular-nums">
        {t.from}{' '}
        <span className="text-4xl font-bold tracking-[-0.03em] text-foreground">
          {formatPrice(startingPrice(line.id))}
        </span>
        {t.perMonth}
      </span>
      <span className="mt-3 text-sm leading-relaxed text-muted-foreground tabular-nums">
        {t.lineSummary({
          plans: line.groups.reduce((n, g) => n + g.plans.length, 0),
          ramMin: ranges.ramGb.min,
          ramMax: ranges.ramGb.max,
          cpuMin: ranges.cpu.min,
          cpuMax: ranges.cpu.max,
          cpuUnit: line.cpuUnit,
        })}
      </span>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-link group-hover:text-foreground">
        {t.seePlans(t.lines[line.id])}
        <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover:translate-y-0.5" />
      </span>
    </a>
  )
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const t = copy().pricing
  const productLines = localizedProductLines()

  return (
    <>
      <SiteHeader />
      <Main>
        <div className="shell">
          <PageHeader title={t.heading}>
            <p>{t.intro}</p>
            <p className="mt-3 text-base">
              {t.orderingPrefix}{' '}
              <a href="#how-it-works" className="text-link underline underline-offset-4 hover:text-foreground">
                {t.orderingLink}
              </a>
            </p>
          </PageHeader>

          <ul className="mb-14 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
            {productLines.map((line) => (
              <li key={line.id}>
                <LineOverview line={line} />
              </li>
            ))}
          </ul>

          <SectionNav
            label={t.planTypes}
            items={productLines.map((line) => ({
              id: line.anchor,
              label: line.label,
              detail: `${t.from} ${formatPrice(startingPrice(line.id))}`,
            }))}
          />

          {productLines.map((line) => (
            <section key={line.id} id={line.anchor} aria-labelledby={`${line.anchor}-heading`} className="scroll-mt-14 pt-14 md:pt-20">
              <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-14">
                <div>
                  <h2 id={`${line.anchor}-heading`} className="text-3xl font-bold tracking-[-0.03em] text-foreground md:text-4xl">
                    {t.lines[line.id]}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{line.intro}</p>
                </div>
                <div className="self-start rounded-xl border bg-card/30 p-5">
                  <h3 className="text-sm font-semibold text-foreground">{t.included}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {[...line.included, t.uptimeIncluded(uptimeTarget(line.id))].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 space-y-12">
                {line.groups.map((group) => (
                  <PlanGroupTable key={group.id} line={line} group={group} />
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="custom-heading" className="mt-20 grid gap-6 rounded-2xl border bg-card/30 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <h2 id="custom-heading" className="text-xl font-semibold tracking-tight text-foreground">
                {t.custom.heading}
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{t.custom.body}</p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href={localePath(locale, '/#contact')}>{t.custom.cta}</Link>
            </Button>
          </section>

          <div className="mt-20 border-t pt-16">
            <HowItWorks compact />
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}

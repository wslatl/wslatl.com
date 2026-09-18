import Link from 'next/link'
import { ArrowDown, Check, Gamepad2, Server } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { PlanGroupTable } from '@/components/pricing/plan-group'
import { SectionNav } from '@/components/pricing/section-nav'
import { Button } from '@/components/ui/button'
import { HowItWorks } from '@/components/sections/how-it-works'
import { productLines, type ProductLine } from '@/data/pricing'
import { uptimeTarget } from '@/data/sla'
import { formatPrice, specRanges, startingPrice } from '@/lib/pricing'
import { pageMetadata } from '@/lib/metadata'
import { Main } from '@/components/layout/main'

export const metadata = pageMetadata({
  title: 'Cheap VPS & Game Server Hosting Pricing',
  description: `Published monthly pricing for VPS hosting from ${formatPrice(startingPrice('vps'))} and game server hosting from ${formatPrice(startingPrice('game'))}, on SATA SSD or NVMe. No renewal price traps: the price you sign up at is the price you keep.`,
  path: '/pricing',
})

const lineCopy: Record<ProductLine['id'], { title: string; icon: typeof Server }> = {
  vps: { title: 'VPS hosting', icon: Server },
  game: { title: 'Game server hosting', icon: Gamepad2 },
}

function LineOverview({ line }: { line: ProductLine }) {
  const { title, icon: Icon } = lineCopy[line.id]
  const ranges = specRanges(line.id)
  const planCount = line.groups.reduce((n, g) => n + g.plans.length, 0)
  return (
    <a href={`#${line.anchor}`} className="group flex h-full flex-col bg-background p-6 transition-colors hover:bg-card/50 sm:p-8">
      <span className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
        <Icon aria-hidden="true" className="size-5 text-link" strokeWidth={1.75} />
        {title}
      </span>
      <span className="mt-4 text-sm text-muted-foreground tabular-nums">
        from{' '}
        <span className="text-4xl font-bold tracking-[-0.03em] text-foreground">
          {formatPrice(startingPrice(line.id))}
        </span>
        /mo
      </span>
      <span className="mt-3 text-sm leading-relaxed text-muted-foreground tabular-nums">
        {planCount} plans. {ranges.ramGb.min} to {ranges.ramGb.max} GB RAM, {ranges.cpu.min} to {ranges.cpu.max}{' '}
        {line.cpuUnit}, SATA SSD or NVMe.
      </span>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-link group-hover:text-foreground">
        See {line.id === 'vps' ? 'VPS' : 'game server'} plans
        <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover:translate-y-0.5" />
      </span>
    </a>
  )
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <Main>
        <div className="shell">
          <PageHeader title="Pricing">
            <p>
              Every plan is billed monthly in US dollars. No renewal price traps: the price you sign up
              at is the price you keep.
            </p>
            <p className="mt-3 text-base">
              Ordering starts with a short application, and most are approved the same day.{' '}
              <a href="#how-it-works" className="text-link underline underline-offset-4 hover:text-foreground">
                How ordering works
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
            label="Plan types"
            items={productLines.map((line) => ({
              id: line.anchor,
              label: line.label,
              detail: `from ${formatPrice(startingPrice(line.id))}`,
            }))}
          />

          {productLines.map((line) => (
            <section key={line.id} id={line.anchor} aria-labelledby={`${line.anchor}-heading`} className="scroll-mt-32 pt-14 md:pt-20">
              <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-14">
                <div>
                  <h2 id={`${line.anchor}-heading`} className="text-3xl font-bold tracking-[-0.03em] text-foreground md:text-4xl">
                    {lineCopy[line.id].title}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{line.intro}</p>
                </div>
                <div className="self-start rounded-xl border bg-card/30 p-5">
                  <h3 className="text-sm font-semibold text-foreground">Included with every plan</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {[...line.included, `${uptimeTarget(line.id)} monthly uptime target (see our SLA)`].map((item) => (
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
                Dedicated servers and web hosting
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                These are quoted per build rather than sold off a price list, because the right hardware
                or setup depends on what you are running. Tell us what you need and we will come back
                with a price.
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href="/#contact">Get a quote</Link>
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

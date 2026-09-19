import { TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PlanGroup, ProductLine } from '@/data/pricing'
import { siteConfig } from '@/config/site'
import { formatGb, formatPrice, formatTraffic } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { copy } from '@/i18n/copy'

interface PlanGroupTableProps {
  line: ProductLine
  group: PlanGroup
}

function OrderButton({ planName, emphasis, className }: { planName: string; emphasis: boolean; className?: string }) {
  const t = copy().pricing
  return (
    <Button asChild size="sm" variant={emphasis ? 'default' : 'outline'} className={className}>
      <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
        {t.table.order}
        <span className="sr-only">{t.table.orderPlan(planName)}</span>
      </a>
    </Button>
  )
}

function PopularTag() {
  return (
    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-link">
      Popular
    </span>
  )
}

/**
 * One plan group (e.g. "Budget VPS") as a spec table when its container has room, and
 * as a stacked list when it does not. Only one of the two is ever displayed, so
 * assistive tech sees a single copy.
 */
export function PlanGroupTable({ line, group }: PlanGroupTableProps) {
  const t = copy().pricing
  const showTraffic = group.plans.some((p) => p.trafficTb !== undefined)
  const headingId = `${group.id}-heading`

  return (
    <section aria-labelledby={headingId} className="@container">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 id={headingId} className="text-xl font-semibold tracking-tight text-foreground">
          {group.label}
        </h3>
        <span className="text-sm text-muted-foreground">
          {group.storageType} {t.storageSuffix}
        </span>
        {group.comparison && (
          <span className="inline-flex items-center gap-1 text-sm text-link">
            <TrendingDown aria-hidden="true" className="size-3.5" />
            {group.comparison}
          </span>
        )}
      </div>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{group.description}</p>

      {/* Wide containers (in rem, so large text counts): comparison table */}
      <div className="mt-5 hidden overflow-hidden rounded-xl border @min-[44rem]:block">
        <table className="w-full table-fixed text-left text-sm tabular-nums">
          <caption className="sr-only">
            {t.table.caption(group.label)}
          </caption>
          {/* Fixed widths so tables with the same columns line up down the page. */}
          <colgroup>
            <col />
            <col className="w-20 lg:w-24" />
            <col className="w-[4.5rem] lg:w-28" />
            <col className="w-[5.5rem] lg:w-28" />
            {showTraffic && <col className="w-[4.5rem] lg:w-28" />}
            <col className="w-28 lg:w-36" />
            <col className="w-[6.5rem] lg:w-28" />
          </colgroup>
          <thead className="bg-card/50 text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">{t.table.plan}</th>
              <th scope="col" className="px-4 py-3 font-medium">{line.cpuUnit}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t.table.ram}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t.table.storage}</th>
              {showTraffic && <th scope="col" className="px-4 py-3 font-medium">{t.table.traffic}</th>}
              <th scope="col" className="px-4 py-3 text-right font-medium">{t.table.price}</th>
              <th scope="col" className="px-5 py-3"><span className="sr-only">{t.table.order}</span></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {group.plans.map((plan) => (
              <tr
                key={plan.name}
                className={cn('transition-colors hover:bg-card/50', plan.popular && 'bg-primary/[0.05]')}
              >
                <th scope="row" className="px-5 py-3.5 font-semibold text-foreground">
                  <span className="flex items-center gap-2">
                    {plan.name}
                    {plan.popular && <PopularTag />}
                  </span>
                </th>
                <td className="px-4 py-3.5 text-foreground/90">{plan.cpu}</td>
                <td className="px-4 py-3.5 text-foreground/90">{formatGb(plan.ramGb)}</td>
                <td className="px-4 py-3.5 text-foreground/90">{formatGb(plan.storageGb)}</td>
                {showTraffic && <td className="px-4 py-3.5 text-foreground/90">{formatTraffic(plan) ?? 'n/a'}</td>}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <span className="text-base font-semibold text-foreground">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/mo</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <OrderButton planName={plan.name} emphasis={!!plan.popular} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow containers: stacked plans */}
      <ul className="mt-5 divide-y rounded-xl border @min-[44rem]:hidden">
        {group.plans.map((plan) => (
          <li key={plan.name} className={cn('p-4', plan.popular && 'bg-primary/[0.05]')}>
            <div className="flex items-start justify-between gap-3">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
                {plan.name}
                {plan.popular && <PopularTag />}
              </p>
              <p className="shrink-0 tabular-nums">
                <span className="text-lg font-semibold text-foreground">{formatPrice(plan.price)}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </p>
            </div>
            <dl className={cn('mt-3 grid grid-cols-2 gap-2 text-sm tabular-nums', showTraffic ? '@min-[20rem]:grid-cols-4' : '@min-[16rem]:grid-cols-3')}>
              <div>
                <dt className="text-xs text-muted-foreground">{line.cpuUnit}</dt>
                <dd className="text-foreground/90">{plan.cpu}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">RAM</dt>
                <dd className="text-foreground/90">{formatGb(plan.ramGb)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Storage</dt>
                <dd className="text-foreground/90">{formatGb(plan.storageGb)}</dd>
              </div>
              {showTraffic && (
                <div>
                  <dt className="text-xs text-muted-foreground">Traffic</dt>
                  <dd className="text-foreground/90">{formatTraffic(plan) ?? 'n/a'}</dd>
                </div>
              )}
            </dl>
            <OrderButton planName={plan.name} emphasis={!!plan.popular} className="mt-4 w-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}

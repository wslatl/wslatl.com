'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealGroup } from '@/components/effects/reveal'
import { pricingTabs, type PricingPlan, type PricingTab } from '@/data/pricing'
import { cn } from '@/lib/utils'

const ORDER_HREF = 'https://billing.wslatl.com/register'

function PricingCard({ plan }: { plan: PricingPlan }) {
  const popular = !!plan.popular
  return (
    <div
      className={cn(
        'group relative flex flex-col p-7 rounded-2xl border transition-all duration-300',
        popular
          ? 'border-primary/40 bg-primary/[0.04] hover:bg-primary/[0.06] hover:border-primary/50'
          : 'border-border/70 bg-card/30 hover:bg-card/60 hover:border-primary/30',
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <h4 className="text-lg font-semibold text-foreground tracking-tight">{plan.name}</h4>
        {popular && (
          <Badge
            variant="default"
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          >
            Most Popular
          </Badge>
        )}
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
          ${plan.price.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground ml-1.5">/mo billed monthly</span>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {plan.specs.map((spec) => (
          <li key={spec} className="flex items-start gap-2 text-sm text-foreground/80">
            <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
            <span>{spec}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={popular ? 'default' : 'outline'}
        className="w-full mt-auto"
      >
        <Link href={ORDER_HREF} target="_blank" rel="noopener noreferrer">
          Order Now
        </Link>
      </Button>
    </div>
  )
}

function GroupBlock({ group }: { group: PricingTab['groups'][number] }) {
  const claim = group.claim
  const ClaimIcon = claim?.icon
  return (
    <div className="mb-14 last:mb-0">
      <Reveal>
        <div className="mb-7 max-w-2xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
              {group.label}{' · '}
              <span className="font-serif italic font-normal text-foreground/90">
                {group.storageType}
              </span>
            </h3>
            {claim && ClaimIcon && (
              <span
                aria-label={`Pricing advantage: ${claim.text}`}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                <ClaimIcon className="w-3 h-3" />
                {claim.text}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{group.description}</p>
        </div>
      </Reveal>

      <RevealGroup
        as="div"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        step={100}
      >
        {group.plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </RevealGroup>
    </div>
  )
}

export function Pricing() {
  const [activeId, setActiveId] = useState<PricingTab['id']>('vps')
  const activeTab = pricingTabs.find((t) => t.id === activeId) ?? pricingTabs[0]
  const isGame = activeTab.id === 'game'

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-full border border-border/70 bg-card/30 w-fit">
            {pricingTabs.map((tab) => {
              const isActive = activeId === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    'px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
                  )}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {activeTab.note && (
          <p className="text-center text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            {activeTab.note}
          </p>
        )}

        <div>
          {activeTab.groups.map((group) => (
            <GroupBlock key={group.id} group={group} />
          ))}
          {isGame && (
            <p className="mt-12 text-center text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Every game plan includes the Pterodactyl panel, DDoS protection, mod and plugin support, and same-day setup.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

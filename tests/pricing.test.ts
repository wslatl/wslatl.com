import { describe, expect, it } from 'vitest'
import {
  comparedPrices,
  comparisons,
  gameComparisons,
  productLines,
  type ComparisonId,
  type Plan,
  type PlanGroup,
  type ProductLineId,
} from '@/data/pricing'
import { faqs } from '@/data/faqs'
import { games } from '@/data/games'
import {
  cheapestPlanWithRam,
  entryPlan,
  fillPrices,
  formatPrice,
  pricingHref,
  smallestPlansWithRam,
  specRanges,
  startingPrice,
} from '@/lib/pricing'

const allPlans = productLines.flatMap((line) => line.groups.flatMap((group) => group.plans))

function plansIn(line: ProductLineId, tier: PlanGroup['tier']): Plan[] {
  return productLines
    .filter((l) => l.id === line)
    .flatMap((l) => l.groups.filter((g) => g.tier === tier).flatMap((g) => g.plans))
}

const cents = (usd: number) => Math.round(usd * 100)

/** What a plan gives, without its name or price. */
const spec = ({ cpu, ramGb, storageGb }: Plan) => ({ cpu, ramGb, storageGb })

/**
 * How much less we charge than the competitor at each recorded size, in
 * whole percent rounded down, worked out in cents so no float rounds a
 * claim up.
 */
function gaps(id: ComparisonId): number[] {
  const { line, tier, prices } = comparedPrices[id]
  return Object.entries(prices).map(([ram, theirs]) => {
    const plan = plansIn(line, tier).find((p) => p.ramGb === Number(ram))
    if (!plan) throw new Error(`${id}: we sell no ${tier} ${line} plan with ${ram} GB`)
    return Math.floor(((cents(theirs) - cents(plan.price)) * 100) / cents(theirs))
  })
}

describe('pricing data', () => {
  it('uses every plan name exactly once', () => {
    const names = allPlans.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('has sane numbers on every plan', () => {
    for (const plan of allPlans) {
      expect(plan.price, plan.name).toBeGreaterThan(0)
      // Game plans sell half vCores (1.5, 2.5, 4.5).
      expect(Number.isInteger(plan.cpu * 2), plan.name).toBe(true)
      expect(plan.ramGb, plan.name).toBeGreaterThan(0)
      expect(plan.storageGb, plan.name).toBeGreaterThan(0)
      // Prices are whole cents.
      expect(Math.round(plan.price * 100) / 100, plan.name).toBe(plan.price)
    }
  })

  it('lists each group cheapest first with at most one popular plan', () => {
    for (const line of productLines) {
      for (const group of line.groups) {
        const prices = group.plans.map((p) => p.price)
        expect(prices.toSorted((a, b) => a - b), group.id).toEqual(prices)
        expect(group.plans.filter((p) => p.popular).length, group.id).toBeLessThanOrEqual(1)
      }
    }
  })

  it('sells the same plans on both tiers, with Premium at 10% more', () => {
    for (const line of productLines) {
      const budget = plansIn(line.id, 'budget')
      const premium = plansIn(line.id, 'premium')
      expect(premium.map(spec), line.id).toEqual(budget.map(spec))
      // The billing panel adds 10% to the Budget price and rounds half up to the cent.
      for (const [i, plan] of budget.entries()) {
        expect(cents(premium[i].price), premium[i].name).toBe(Math.round((cents(plan.price) * 110) / 100))
      }
    }
  })

  it('dates every comparison and only places ones that exist', () => {
    for (const [id, comparison] of Object.entries(comparisons)) {
      expect(`${comparison.text} ${comparison.note}`, id).toMatch(/checked 10 October 2026/)
    }
    const slugs = new Set(games.map((g) => g.slug))
    for (const slug of Object.keys(gameComparisons)) expect(slugs.has(slug), slug).toBe(true)
  })

  it('claims only what the recorded competitor prices give, rounded down', () => {
    for (const id of Object.keys(comparisons) as ComparisonId[]) {
      const found = gaps(id)
      const low = Math.min(...found)
      const high = Math.max(...found)
      const range = low === high ? `${low}%` : `${low}% to ${high}%`
      // A leading space, so "13% to 19%" cannot pass as "3% to 19%".
      expect(` ${comparisons[id].text}`, id).toContain(` ${range} less`)
    }
  })

  it('shows each comparison only with the plans it is about', () => {
    for (const line of productLines) {
      for (const group of line.groups) {
        for (const id of group.comparisons ?? []) {
          expect(comparedPrices[id], `${group.id}: ${id}`).toMatchObject({ line: line.id, tier: group.tier })
        }
      }
    }
    for (const [slug, placed] of Object.entries(gameComparisons)) {
      for (const id of [...(placed.plans ?? []), ...(placed.table ? [placed.table] : [])]) {
        expect(comparedPrices[id].line, `${slug}: ${id}`).toBe('game')
      }
    }
  })

  it('gives every line a unique anchor and group ids that do not collide', () => {
    const anchors = productLines.map((l) => l.anchor)
    const groupIds = productLines.flatMap((l) => l.groups.map((g) => g.id))
    expect(new Set(anchors).size).toBe(anchors.length)
    expect(new Set(groupIds).size).toBe(groupIds.length)
  })
})

describe('pricing helpers', () => {
  it('formats US dollars with cents', () => {
    expect(formatPrice(6.5)).toBe('$6.50')
    expect(formatPrice(35)).toBe('$35.00')
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })

  it('derives starting prices from the data', () => {
    for (const line of productLines) {
      const min = Math.min(...line.groups.flatMap((g) => g.plans.map((p) => p.price)))
      expect(startingPrice(line.id)).toBe(min)
    }
    expect(entryPlan('game').price).toBe(startingPrice('game'))
    expect(entryPlan('game', 'premium').price).toBe(startingPrice('game', 'premium'))
    expect(entryPlan('vps', 'budget').price).toBe(startingPrice('vps', 'budget'))
  })

  it('fills every price token the FAQ answers use', () => {
    for (const faq of faqs) expect(fillPrices(faq.answer), faq.id).not.toMatch(/\{\w+\}/)
    expect(fillPrices('{gamePrice} {gameRam} {gamePremiumPrice} {vpsPrice}')).toBe(
      [
        formatPrice(startingPrice('game', 'budget')),
        String(entryPlan('game', 'budget').ramGb),
        formatPrice(startingPrice('game', 'premium')),
        formatPrice(startingPrice('vps')),
      ].join(' '),
    )
  })

  it('reports spec ranges that contain every plan', () => {
    for (const line of productLines) {
      const ranges = specRanges(line.id)
      for (const plan of line.groups.flatMap((g) => g.plans)) {
        expect(plan.ramGb).toBeGreaterThanOrEqual(ranges.ramGb.min)
        expect(plan.ramGb).toBeLessThanOrEqual(ranges.ramGb.max)
      }
    }
  })

  it('suggests the cheapest plan with enough RAM, per group and overall', () => {
    const matches = smallestPlansWithRam('game', 5)
    for (const { group, plan } of matches) {
      expect(plan.ramGb).toBeGreaterThanOrEqual(5)
      const cheaperFits = group.plans.filter((p) => p.ramGb >= 5 && p.price < plan.price)
      expect(cheaperFits).toEqual([])
    }
    const overall = cheapestPlanWithRam('game', 5)
    expect(overall?.plan.price).toBe(Math.min(...matches.map((m) => m.plan.price)))
    expect(cheapestPlanWithRam('game', 10_000)).toBeNull()
  })

  it('links to the pricing anchors', () => {
    expect(pricingHref('vps')).toBe('/pricing#vps')
    expect(pricingHref('game')).toBe('/pricing#game-servers')
  })
})

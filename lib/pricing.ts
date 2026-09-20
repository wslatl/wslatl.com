import {
  productLines,
  type Plan,
  type PlanGroup,
  type ProductLine,
  type ProductLineId,
} from '@/data/pricing'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** `5.4` -> `$5.40`. The only price formatter on the site. */
export function formatPrice(amount: number): string {
  return usd.format(amount)
}

export function formatGb(gb: number): string {
  return `${gb} GB`
}

export function formatTraffic(plan: Plan): string | null {
  return plan.trafficTb === undefined ? null : `${plan.trafficTb} TB`
}

export function productLine(id: ProductLineId): ProductLine {
  const line = productLines.find((l) => l.id === id)
  if (!line) throw new Error(`Unknown product line "${id}"`)
  return line
}

export function pricingHref(id: ProductLineId): string {
  return `/pricing#${productLine(id).anchor}`
}

function plansOf(id: ProductLineId, tier?: PlanGroup['tier']): Plan[] {
  return productLine(id)
    .groups.filter((g) => !tier || g.tier === tier)
    .flatMap((g) => g.plans)
}

/** Lowest monthly price on a product line, optionally within one tier. */
export function startingPrice(id: ProductLineId, tier?: PlanGroup['tier']): number {
  return Math.min(...plansOf(id, tier).map((p) => p.price))
}

/** The smallest plan in a tier, i.e. the one that sets the starting price. */
export function entryPlan(id: ProductLineId, tier: PlanGroup['tier']): Plan {
  const plans = plansOf(id, tier)
  return plans.reduce((min, p) => (p.price < min.price ? p : min), plans[0])
}

export interface SpecRange {
  min: number
  max: number
}

function range(values: number[]): SpecRange {
  return { min: Math.min(...values), max: Math.max(...values) }
}

/** Spec spread across every plan on a line, for summaries like "1 to 10 GB RAM". */
export function specRanges(id: ProductLineId) {
  const plans = plansOf(id)
  return {
    cpu: range(plans.map((p) => p.cpu)),
    ramGb: range(plans.map((p) => p.ramGb)),
    storageGb: range(plans.map((p) => p.storageGb)),
  }
}

export interface PlanMatch {
  group: PlanGroup
  plan: Plan
}

/** The cheapest plan on a line with at least `ramGb` of memory, or null if none is big enough. */
export function cheapestPlanWithRam(id: ProductLineId, ramGb: number): PlanMatch | null {
  return smallestPlansWithRam(id, ramGb).reduce<PlanMatch | null>(
    (min, match) => (!min || match.plan.price < min.plan.price ? match : min),
    null,
  )
}

/**
 * The cheapest plan in each group of a line with at least `ramGb` of memory.
 * Groups with no plan big enough are left out, so an empty result means the
 * need is beyond the published plans.
 */
export function smallestPlansWithRam(id: ProductLineId, ramGb: number): PlanMatch[] {
  return productLine(id).groups.flatMap((group) => {
    const fits = group.plans.filter((p) => p.ramGb >= ramGb)
    if (fits.length === 0) return []
    const plan = fits.reduce((min, p) => (p.price < min.price ? p : min), fits[0])
    return [{ group, plan }]
  })
}

/**
 * Fills the price tokens a written answer can carry, so the same sentence
 * shows today's prices in every language: {gamePrice}, {gameRam},
 * {gamePremiumPrice} and {vpsPrice} all come from data/pricing.ts.
 */
export function fillPrices(text: string): string {
  const budgetGame = entryPlan('game', 'budget')
  const values: Record<string, string> = {
    gamePrice: formatPrice(budgetGame.price),
    gameRam: String(budgetGame.ramGb),
    gamePremiumPrice: formatPrice(startingPrice('game', 'premium')),
    vpsPrice: formatPrice(startingPrice('vps')),
  }
  return text.replace(/\{(\w+)\}/g, (whole, key) => values[key] ?? whole)
}

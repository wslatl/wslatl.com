import { describe, expect, it } from 'vitest'
import { productLines } from '@/data/pricing'
import {
  cheapestPlanWithRam,
  entryPlan,
  formatPrice,
  pricingHref,
  smallestPlansWithRam,
  specRanges,
  startingPrice,
} from '@/lib/pricing'

const allPlans = productLines.flatMap((line) => line.groups.flatMap((group) => group.plans))

describe('pricing data', () => {
  it('uses every plan name exactly once', () => {
    const names = allPlans.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('has sane numbers on every plan', () => {
    for (const plan of allPlans) {
      expect(plan.price, plan.name).toBeGreaterThan(0)
      expect(Number.isInteger(plan.cpu), plan.name).toBe(true)
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
        expect([...prices].sort((a, b) => a - b), group.id).toEqual(prices)
        expect(group.plans.filter((p) => p.popular).length, group.id).toBeLessThanOrEqual(1)
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
    expect(formatPrice(5.4)).toBe('$5.40')
    expect(formatPrice(27)).toBe('$27.00')
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })

  it('derives starting prices from the data', () => {
    for (const line of productLines) {
      const min = Math.min(...line.groups.flatMap((g) => g.plans.map((p) => p.price)))
      expect(startingPrice(line.id)).toBe(min)
    }
    expect(entryPlan('game', 'budget').price).toBe(startingPrice('game', 'budget'))
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

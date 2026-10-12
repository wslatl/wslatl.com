import { TrendingDown } from 'lucide-react'
import type { ComparisonId } from '@/data/pricing'
import { localizedComparison } from '@/i18n/content'
import { cn } from '@/lib/utils'

/**
 * Price comparisons against named competitors, each with its source and date
 * right underneath. The wording comes from data/pricing.ts and is shown as
 * written; do not shorten a claim here.
 */
export function ComparisonList({ ids, className }: { ids: ComparisonId[]; className?: string }) {
  if (ids.length === 0) return null
  return (
    <ul className={cn('max-w-3xl space-y-3', className)}>
      {ids.map((id) => {
        const comparison = localizedComparison(id)
        return (
          <li key={id} className="flex gap-2.5">
            <TrendingDown aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
            <div>
              <p className="text-sm leading-relaxed font-medium text-foreground">{comparison.text}</p>
              {comparison.note && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{comparison.note}</p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** A single comparison as one line of text, for the foot of a price table. */
export function comparisonLine(id: ComparisonId): string {
  const comparison = localizedComparison(id)
  return comparison.note ? `${comparison.text} ${comparison.note}` : comparison.text
}

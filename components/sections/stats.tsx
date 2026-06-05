import { cn } from '@/lib/utils'
import { CountUp } from '@/components/effects/count-up'
import { stats } from '@/data/stats'

export function Stats() {
  return (
    <section className="border-y border-border/80 bg-background/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={cn(
                'py-9 px-6 text-center',
                (idx === 1 || idx === 3) && 'border-l border-border/80',
                idx >= 2 && 'border-t border-border/80 md:border-t-0',
                idx > 0 && 'md:border-l md:border-border/80',
              )}
            >
              <div className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2 tabular-nums">
                {stat.prefix}
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="h-px w-8 mx-auto bg-border mb-2" />
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

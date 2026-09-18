import Link from 'next/link'
import { ArrowRight, Check, Gamepad2, Globe, HardDrive, Server, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { services, type Service } from '@/data/services'
import { formatPrice, pricingHref, productLine, specRanges, startingPrice } from '@/lib/pricing'

const icons: Record<string, LucideIcon> = {
  vps: Server,
  game: Gamepad2,
  dedicated: HardDrive,
  web: Globe,
}

function specSummary(id: NonNullable<Service['pricing']>) {
  const { cpu, ramGb, storageGb } = specRanges(id)
  const line = productLine(id)
  const planCount = line.groups.reduce((n, g) => n + g.plans.length, 0)
  return `${planCount} plans from ${cpu.min} to ${cpu.max} ${line.cpuUnit}, ${ramGb.min} to ${ramGb.max} GB RAM, and ${storageGb.min} to ${storageGb.max} GB storage.`
}

function ServiceCtas({ service }: { service: Service }) {
  const linkClass =
    'group inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:text-foreground'
  const arrow = <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />

  if (service.pricing === 'vps') {
    return (
      <Link href={pricingHref('vps')} className={linkClass}>
        Compare VPS plans {arrow}
      </Link>
    )
  }
  if (service.pricing === 'game') {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href={pricingHref('game')} className={linkClass}>
          Compare game server plans {arrow}
        </Link>
        <Link href="/games" className={linkClass}>
          Find your game {arrow}
        </Link>
      </div>
    )
  }
  return (
    <Link href="/#contact" className={linkClass}>
      Get a quote {arrow}
    </Link>
  )
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="py-20 md:py-28">
      <div className="shell">
        <SectionHeader id="services-heading" title="What we host">
          <p>
            VPS and game servers have published prices. Dedicated servers and web hosting are quoted
            for what you actually need to run.
          </p>
        </SectionHeader>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
          {services.map((service) => {
            const Icon = icons[service.id] ?? Server
            return (
            <article key={service.id} className="flex flex-col bg-background p-6 sm:p-8">
              <Icon aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{service.title}</h3>
                {service.pricing ? (
                  <p className="text-sm text-muted-foreground tabular-nums">
                    from{' '}
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {formatPrice(startingPrice(service.pricing))}
                    </span>
                    /mo
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Quoted for your build</p>
                )}
              </div>
              <p className="mt-3 leading-relaxed text-muted-foreground">{service.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
                    {feature}
                  </li>
                ))}
              </ul>
              {service.pricing && (
                <p className="mt-5 text-sm text-muted-foreground">{specSummary(service.pricing)}</p>
              )}
              <div className="mt-auto pt-7">
                <ServiceCtas service={service} />
              </div>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

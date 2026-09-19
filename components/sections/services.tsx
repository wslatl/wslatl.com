import Link from 'next/link'
import { ArrowRight, Check, Gamepad2, Globe, HardDrive, Server, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import type { Service } from '@/data/services'
import { formatPrice, pricingHref, specRanges, startingPrice } from '@/lib/pricing'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { localePath } from '@/i18n/config'
import { localizedProductLine, localizedServices } from '@/i18n/content'

const icons: Record<string, LucideIcon> = {
  vps: Server,
  game: Gamepad2,
  dedicated: HardDrive,
  web: Globe,
}

function specSummary(id: NonNullable<Service['pricing']>) {
  const { cpu, ramGb, storageGb } = specRanges(id)
  const line = localizedProductLine(id)
  return copy().home.services.specSummary({
    plans: line.groups.reduce((n, g) => n + g.plans.length, 0),
    cpuMin: cpu.min,
    cpuMax: cpu.max,
    cpuUnit: line.cpuUnit,
    ramMin: ramGb.min,
    ramMax: ramGb.max,
    storageMin: storageGb.min,
    storageMax: storageGb.max,
  })
}

function ServiceCtas({ service }: { service: Service }) {
  const t = copy().home.services
  const locale = getLocale()
  const linkClass =
    'group inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:text-foreground'
  const arrow = <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />

  if (service.pricing === 'vps') {
    return (
      <Link href={localePath(locale, pricingHref('vps'))} className={linkClass}>
        {t.compareVps} {arrow}
      </Link>
    )
  }
  if (service.pricing === 'game') {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href={localePath(locale, pricingHref('game'))} className={linkClass}>
          {t.compareGame} {arrow}
        </Link>
        <Link href={localePath(locale, '/games')} className={linkClass}>
          {t.findGame} {arrow}
        </Link>
      </div>
    )
  }
  return (
    <Link href={localePath(locale, '/#contact')} className={linkClass}>
      {t.getQuote} {arrow}
    </Link>
  )
}

export function Services() {
  const t = copy().home.services
  const services = localizedServices()

  return (
    <section id="services" aria-labelledby="services-heading" className="py-20 md:py-28">
      <div className="shell">
        <SectionHeader id="services-heading" title={t.heading}>
          <p>{t.intro}</p>
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
                    {t.from}{' '}
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {formatPrice(startingPrice(service.pricing))}
                    </span>
                    {t.perMonth}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.quoted}</p>
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

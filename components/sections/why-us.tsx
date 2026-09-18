import Link from 'next/link'
import { Check } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { commitments, features, leadFeature } from '@/data/features'
import { siteConfig } from '@/config/site'

export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="border-y bg-card/20 py-20 md:py-28">
      <div className="shell">
        <SectionHeader id="why-us-heading" title="The difference is personal.">
          <p>We have seen how the big hosts operate. We built WSLATL to be the direct opposite.</p>
        </SectionHeader>

        {/* Columns follow the strip's own width in rem, so enlarged text gets fewer, wider cells. */}
        <div className="@container mt-12">
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border @min-[18rem]:grid-cols-2 @min-[50rem]:grid-cols-4">
            {commitments.map((item) => (
              <div key={item.value} className="flex flex-col-reverse justify-end bg-background p-5 sm:p-6">
                <dt className="mt-2 text-sm leading-snug text-muted-foreground">{item.label}</dt>
                <dd className="text-xl font-bold tracking-[-0.03em] text-foreground tabular-nums min-[360px]:text-2xl sm:text-3xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Uptime targets for every service, and the credits you get if we miss one, are in our{' '}
          <Link href={siteConfig.paths.sla} className="text-link underline underline-offset-4 hover:text-foreground">
            Service Level Agreement
          </Link>
          .
        </p>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="self-start border-l-2 border-primary/70 pl-6">
            <h3 className="text-2xl font-semibold tracking-tight text-balance text-foreground md:text-3xl">
              {leadFeature.title}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{leadFeature.description}</p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link underline underline-offset-4 hover:text-foreground"
              >
                Join our Discord<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={siteConfig.links.billing}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link underline underline-offset-4 hover:text-foreground"
              >
                Open a ticket<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <ul className="divide-y border-y">
            {features.map((feature) => {
              const Icon = feature.icon ?? Check
              return (
                <li key={feature.title} className="grid gap-1.5 py-5 sm:grid-cols-[13rem_1fr] sm:items-baseline sm:gap-6">
                  <h3 className="flex items-center gap-2.5 font-semibold text-foreground">
                    <Icon aria-hidden="true" className="size-4 shrink-0 text-link" />
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

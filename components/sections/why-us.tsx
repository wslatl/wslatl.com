import Link from 'next/link'
import { SectionHeader } from '@/components/ui/section-header'
import { commitments, features } from '@/data/features'

export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="border-y bg-card/20 py-20 md:py-28">
      <div className="shell">
        <SectionHeader id="why-us-heading" title="The difference is personal.">
          <p>We have seen how the big hosts operate. We built WSLATL to be the direct opposite.</p>
        </SectionHeader>

        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => (
            <div key={item.value} className="border-t-2 border-primary/50 pt-5">
              <dt className="text-3xl font-bold tracking-[-0.02em] text-foreground">{item.value}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
                {item.href && (
                  <>
                    {' '}
                    <Link href={item.href} className="text-link underline underline-offset-4 hover:text-foreground">
                      Read the SLA
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title}>
              <h3 className="font-semibold tracking-tight text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

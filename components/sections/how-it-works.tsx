import { siteConfig } from '@/config/site'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const steps = [
  {
    title: 'Request access',
    description:
      'Fill in a short application in the billing portal. A person reads every one, and most are approved the same day.',
  },
  {
    title: 'Tell us what you need',
    description:
      'Once you are approved, message us on Discord or open a ticket. We talk through your setup with you. No automated flow.',
  },
  {
    title: 'Your server goes live',
    description:
      'We set you up, walk you through your panel, and stay available after. Most clients are up and running the same day.',
  },
]

interface HowItWorksProps {
  /** Tighter version for the pricing page, without the section intro. */
  compact?: boolean
}

export function HowItWorks({ compact = false }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn(!compact && 'py-20 md:py-28')}
    >
      <div className={cn(!compact && 'shell')}>
        <SectionHeader id="how-it-works-heading" title="How ordering works">
          {!compact && (
            <p>
              We are application-only on purpose. It is how a small team keeps every client properly
              looked after.
            </p>
          )}
        </SectionHeader>

        {/* A real sequence, so numbered nodes joined by a rule: vertical on
            phones, horizontal from md up. */}
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, idx) => (
            <li
              key={step.title}
              className={cn(
                'relative grid grid-cols-[2.5rem_1fr] gap-x-4 md:block',
                idx < steps.length - 1 &&
                  'before:absolute before:top-12 before:bottom-[-2rem] before:left-5 before:w-px before:bg-border md:before:top-5 md:before:right-[-1.5rem] md:before:bottom-auto md:before:left-14 md:before:h-px md:before:w-auto',
              )}
            >
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full border border-primary/60 bg-background text-sm font-semibold text-link tabular-nums"
              >
                {idx + 1}
              </span>
              <div className="md:mt-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  <span className="sr-only">Step {idx + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm text-muted-foreground">
          Ready?{' '}
          <a
            href={siteConfig.links.register}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link underline underline-offset-4 hover:text-foreground"
          >
            Request access<span className="sr-only"> (opens in a new tab)</span>
          </a>{' '}
          or{' '}
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link underline underline-offset-4 hover:text-foreground"
          >
            ask us on Discord<span className="sr-only"> (opens in a new tab)</span>
          </a>{' '}
          first.
        </p>
      </div>
    </section>
  )
}

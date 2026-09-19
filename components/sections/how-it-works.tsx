import { siteConfig } from '@/config/site'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'
import { copy } from '@/i18n/copy'

interface HowItWorksProps {
  /** Tighter version for the pricing page, without the section intro. */
  compact?: boolean
}

export function HowItWorks({ compact = false }: HowItWorksProps) {
  const t = copy().home.howItWorks
  const steps = t.steps

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn(!compact && 'py-20 md:py-28')}
    >
      <div className={cn(!compact && 'shell')}>
        <SectionHeader id="how-it-works-heading" title={t.heading}>
          {!compact && <p>{t.intro}</p>}
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
                  <span className="sr-only">{t.step(idx + 1)}</span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm text-muted-foreground">
          {t.readyPrefix}{' '}
          <a
            href={siteConfig.links.register}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link underline underline-offset-4 hover:text-foreground"
          >
            {t.requestAccess}
            <span className="sr-only">{copy().header.newTab}</span>
          </a>{' '}
          {t.or}{' '}
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link underline underline-offset-4 hover:text-foreground"
          >
            {t.askOnDiscord}
            <span className="sr-only">{copy().header.newTab}</span>
          </a>{' '}
          {t.readySuffix}
        </p>
      </div>
    </section>
  )
}

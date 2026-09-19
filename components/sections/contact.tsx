import { Button } from '@/components/ui/button'
import { sectionHeadingClass } from '@/components/ui/section-header'
import { Email } from '@/components/ui/email'
import { SiteLink } from '@/components/ui/site-link'
import { reachOptions } from '@/data/reach-options'
import { siteConfig } from '@/config/site'

const ctaClass = 'mt-2 inline-block text-sm font-medium text-link underline underline-offset-4 hover:text-foreground'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="pt-20 md:pt-28">
      <div className="shell">
        <div className="grid gap-12 rounded-3xl border border-primary/30 bg-card/30 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
          <div>
            <h2 id="contact-heading" className={sectionHeadingClass}>
              A hosting company that treats you like a person. Imagine that.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              Request access and an admin reviews your application. Once you are approved, we get you set
              up fast. Most clients are live the same day.
            </p>
            <Button asChild size="lg" className="mt-8">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                Request access
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Prefer to talk first?</h3>
            <ul className="mt-4 divide-y border-y">
              {reachOptions.map((option) => (
                <li key={option.title} className="py-5">
                  <p className="font-medium text-foreground">{option.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{option.description}</p>
                  {'email' in option ? (
                    <Email name={option.email} className={ctaClass} />
                  ) : (
                    <SiteLink href={option.href} className={ctaClass}>
                      {option.cta}
                    </SiteLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

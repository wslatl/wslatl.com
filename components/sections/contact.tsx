import { Button } from '@/components/ui/button'
import { sectionHeadingClass } from '@/components/ui/section-header'
import { Email } from '@/components/ui/email'
import { SiteLink } from '@/components/ui/site-link'
import { siteConfig } from '@/config/site'
import { copy } from '@/i18n/copy'

const ctaClass = 'mt-2 inline-block text-sm font-medium text-link underline underline-offset-4 hover:text-foreground'

export function Contact() {
  const t = copy()
  const reachOptions = [
    { ...t.home.contact.options.discord, href: siteConfig.links.discord },
    { ...t.home.contact.options.billing, href: siteConfig.links.billing },
    { ...t.home.contact.options.email, email: 'support' as const },
  ]

  return (
    <section id="contact" aria-labelledby="contact-heading" className="pt-20 md:pt-28">
      <div className="shell">
        <div className="grid gap-12 rounded-3xl border border-primary/30 bg-card/30 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
          <div>
            <h2 id="contact-heading" className={sectionHeadingClass}>
              {t.home.contact.heading}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{t.home.contact.body}</p>
            <Button asChild size="lg" className="mt-8">
              <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                {t.home.contact.requestAccess}
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t.home.contact.preferToTalk}</h3>
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

import Link from 'next/link'
import { BadgeCheck, IdCard, Percent, Tag, Wallet } from 'lucide-react'
import { becomePartnerAnchor } from '@/components/partners/partner-card'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { localePath } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { referralDiscount } from '@/lib/partners'
import { cn } from '@/lib/utils'

/**
 * The partner program, explained. Every line here is something the billing
 * panel actually does (see the facts in config/referral.ts): keep it that way
 * when changing the words.
 */
export function BecomePartner({ className }: { className?: string }) {
  const locale = getLocale()
  const t = copy()
  const program = t.partners.program
  const percent = referralDiscount(locale)

  const points = [
    { icon: BadgeCheck, ...program.approved },
    { icon: Tag, ...program.code },
    { icon: Percent, title: program.discount.title(percent), body: program.discount.body(percent) },
    { icon: Wallet, ...program.credit },
    { icon: IdCard, ...program.profile },
  ]

  return (
    <section
      id={becomePartnerAnchor}
      aria-labelledby="become-partner-heading"
      className={cn('@container rounded-3xl border border-primary/30 bg-card/30 p-6 sm:p-10', className)}
    >
      {/* Two columns when the section itself is wide (in rem, so enlarged text counts); stacked beside the lone card. */}
      <div className="grid gap-10 @min-[52rem]:grid-cols-[1fr_1.25fr] @min-[52rem]:gap-14">
        <div>
          <h2
            id="become-partner-heading"
            className="text-3xl leading-[1.1] font-bold tracking-[-0.03em] text-balance text-foreground md:text-4xl"
          >
            {program.heading}
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-pretty text-muted-foreground">{program.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg">
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
                {program.discordCta}
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={siteConfig.links.billing} target="_blank" rel="noopener noreferrer">
                {program.ticketCta}
                <span className="sr-only">{t.header.newTab}</span>
              </a>
            </Button>
          </div>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">{program.ticketNote}</p>
          <p className="mt-3 text-sm">
            <Link
              href={localePath(locale, siteConfig.paths.accountCredit)}
              className="text-link underline underline-offset-4 hover:text-foreground"
            >
              {program.creditLink}
            </Link>
          </p>
        </div>

        <ul className="divide-y border-y">
          {points.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3.5 py-4">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-link" />
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

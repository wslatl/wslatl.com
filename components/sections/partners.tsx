import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PartnerCard } from '@/components/partners/partner-card'
import { SectionHeader } from '@/components/ui/section-header'
import { partners } from '@/data/partners'
import { localePath } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { hasReferralCode, homePartners, partnersPageText } from '@/lib/partners'
import { cn } from '@/lib/utils'

/**
 * Partners on the home page: the featured ones and then the newest, as the
 * same cards /partners shows, so a partner is on the home page from the day
 * they are added (homePartners). Three fill the three columns of a wide
 * screen; between the phone and desktop layouts the grid has two, so the
 * third waits for /partners.
 */
export function Partners() {
  const locale = getLocale()
  const t = copy().partners
  const shown = homePartners(partners)
  if (shown.length === 0) return null
  const { intro } = partnersPageText(t, partners.length, locale, partners.filter(hasReferralCode).length)

  return (
    <section id="partners" aria-labelledby="partners-heading" className="shell pt-20 md:pt-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <SectionHeader id="partners-heading" title={t.heading}>
          <p>{intro}</p>
        </SectionHeader>
        <Link
          href={localePath(locale, '/partners')}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:text-foreground"
        >
          {t.seeAll(partners.length)}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((partner, index) => (
          <li key={partner.slug} className={cn(index === 2 && 'sm:max-lg:hidden')}>
            <PartnerCard partner={partner} headingLevel={3} />
          </li>
        ))}
      </ul>
    </section>
  )
}

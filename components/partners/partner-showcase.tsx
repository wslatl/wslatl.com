import { BecomePartner } from '@/components/partners/become-partner'
import { GhostCard, PartnerCard, ghostAloneAt, ghostItemClass } from '@/components/partners/partner-card'
import type { Partner } from '@/data/partners'
import { orderedPartners } from '@/lib/partners'

/**
 * Everything on /partners below the title. With partners, a grid of their
 * cards that always ends on the "This could be you" card, then the program.
 * With none yet, that card takes the lead spot beside the program, so the
 * page reads as an open invitation rather than an empty list.
 */
export function PartnerShowcase({ partners }: { partners: readonly Partner[] }) {
  const list = orderedPartners(partners)

  if (list.length === 0) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <GhostCard hero />
        <BecomePartner />
      </div>
    )
  }

  const alone = ghostAloneAt(list.length)

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((partner) => (
          <li key={partner.slug}>
            <PartnerCard partner={partner} />
          </li>
        ))}
        <li className={ghostItemClass(alone) || undefined}>
          <GhostCard alone={alone} />
        </li>
      </ul>
      <BecomePartner className="mt-20" />
    </>
  )
}

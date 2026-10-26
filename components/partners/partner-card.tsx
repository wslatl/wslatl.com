import Link from 'next/link'
import { ArrowDown, ArrowRight, UserRound } from 'lucide-react'
import { PartnerAvatar, PartnerBanner } from '@/components/partners/partner-pictures'
import { CopyCode } from '@/components/partners/copy-code'
import { SharePartnerAd } from '@/components/share/ads'
import { SocialIcon } from '@/components/partners/social-icon'
import type { Partner } from '@/data/partners'
import { localePath } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import type { Copy } from '@/i18n/copy/en'
import { getLocale } from '@/i18n/locale'
import { hasReferralCode, partnerText, partnerTextLang, platformName, socialLinks } from '@/lib/partners'
import { cn } from '@/lib/utils'

/** Where the "This could be you" card leads: the program, on /partners. */
export const becomePartnerAnchor = 'become-a-partner'

/** The words the Copy button needs, in the language of the page. */
export function copyLabels(t: Copy) {
  return {
    copy: t.partners.copy,
    copied: t.partners.copied,
    copyFailed: t.partners.copyFailed,
  }
}

/** One partner on /partners: banner, picture, name, links, their code if they show one, and the way to their profile. */
export function PartnerCard({ partner }: { partner: Partner }) {
  const locale = getLocale()
  const t = copy()
  const links = socialLinks(partner)
  const headingId = `partner-${partner.slug}`

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border bg-card/20',
        partner.featured && 'border-primary/40 bg-primary/[0.04]',
      )}
    >
      {/* overflow-hidden holds the box at 3:1 when a banner is a little taller than that. */}
      <div className="relative aspect-[3/1] overflow-hidden bg-card">
        <PartnerBanner src={partner.banner} alt="" sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 50vw, 100vw" />
        {partner.featured && (
          <span className="absolute top-3 right-3 rounded-full border border-primary/40 bg-background/85 px-2.5 py-0.5 text-xs font-medium text-foreground">
            {t.partners.featured}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <PartnerAvatar name={partner.name} src={partner.avatar} alt="" className="-mt-8 size-16 text-xs" />
        <h2 id={headingId} className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          {partner.name}
        </h2>
        <p
          lang={partnerTextLang(partner.tagline, locale)}
          className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
        >
          {partnerText(partner.tagline, locale)}
        </p>

        {links.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {links.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.partners.onPlatform(partner.name, platformName(link.platform, t))}${t.header.newTab}`}
                  className="inline-flex size-10 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <SocialIcon platform={link.platform} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          {/* A partner with no code gets no box, so nothing empty sits above the link. */}
          {hasReferralCode(partner) && (
            <div className="rounded-lg border bg-background/50 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">{t.partners.referralCode}</p>
              <CopyCode code={partner.referralCode} labels={copyLabels(t)} className="mt-1" />
            </div>
          )}
          <SharePartnerAd partner={partner} size="sm" className={cn('mb-4', hasReferralCode(partner) && 'mt-4')} />
          <Link
            href={localePath(locale, `/partners/${partner.slug}`)}
            className={cn(
              'group inline-flex items-center gap-1.5 text-sm font-medium text-link transition-colors hover:text-foreground',
            )}
          >
            {t.partners.viewProfile}
            <span className="sr-only">: {partner.name}</span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Grid widths at which the "This could be you" card would sit alone on the last row. */
export interface GhostRow {
  /** The two-column grid, from 40rem. */
  sm: boolean
  /** The three-column grid, from 64rem. */
  lg: boolean
}

/** Where the "This could be you" card would be alone on the last row, for this many partners. */
export function ghostAloneAt(partnerCount: number): GhostRow {
  return { sm: partnerCount % 2 === 0, lg: partnerCount % 3 === 0 }
}

/**
 * The column span for the grid item holding the "This could be you" card:
 * the whole row wherever it would otherwise sit alone at the end, rather
 * than one card beside empty space.
 */
export function ghostItemClass(alone: GhostRow): string {
  return cn(alone.sm && 'sm:col-span-2', alone.lg ? 'lg:col-span-3' : alone.sm && 'lg:col-span-1')
}

/**
 * The empty seat: a dashed outline where a partner would be, inviting the
 * next one. It is always the last card, and with no partners yet it takes
 * the lead spot on its own (`hero`). Where it takes a whole row of the grid
 * (`alone`), its banner is a short strip instead of 3:1.
 */
export function GhostCard({ hero = false, alone }: { hero?: boolean; alone?: GhostRow }) {
  const t = copy().partners

  return (
    // The link is named by its visible text (title, sentence and call to
    // action), so what a screen reader says matches what is on screen.
    // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- that text sits deeper than the rule looks
    <a
      href={`#${becomePartnerAnchor}`}
      data-ghost-card=""
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border-2 border-dashed border-input transition-colors hover:border-link/70 hover:bg-primary/[0.03]',
        // In the grid it matches the height of the cards beside it; on its
        // own it keeps its natural height and stays in view beside the
        // program, at a card's width rather than across a whole tablet.
        hero ? 'max-w-md lg:sticky lg:top-24' : 'h-full',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'partner-placeholder aspect-[3/1] border-b-2 border-dashed border-input/70',
          alone?.sm && 'sm:aspect-auto sm:h-24',
          alone?.lg ? 'lg:aspect-auto lg:h-24' : alone?.sm && 'lg:aspect-[3/1] lg:h-auto',
        )}
      />
      <div className={cn('flex flex-1 flex-col', hero ? 'px-6 pb-7 sm:px-8' : 'px-5 pb-5')}>
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-full border-2 border-dashed border-input bg-background text-muted-foreground transition-colors group-hover:text-link',
            hero ? '-mt-11 size-22' : '-mt-8 size-16',
          )}
        >
          <UserRound className={hero ? 'size-9' : 'size-7'} />
        </span>
        <h2
          className={cn(
            'mt-3 font-semibold tracking-tight text-foreground',
            hero ? 'font-serif text-4xl font-normal italic' : 'text-lg',
          )}
        >
          {t.ghost.title}
        </h2>
        <p className={cn('mt-1.5 leading-relaxed text-muted-foreground', hero ? 'max-w-md text-base' : 'text-sm')}>
          {t.ghost.body}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-link transition-colors group-hover:text-foreground">
          <span>{t.ghost.cta}</span>
          {/* The program sits below the cards, or beside this one on a wide screen with no partners yet. */}
          <ArrowDown
            aria-hidden="true"
            className={cn('size-4 transition-transform group-hover:translate-y-0.5', hero && 'lg:hidden')}
          />
          {hero && (
            <ArrowRight
              aria-hidden="true"
              className="hidden size-4 transition-transform group-hover:translate-x-0.5 lg:block"
            />
          )}
        </span>
      </div>
    </a>
  )
}

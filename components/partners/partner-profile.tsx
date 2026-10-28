import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, BadgeCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/page-header'
import { CopyCode } from '@/components/partners/copy-code'
import { copyLabels } from '@/components/partners/partner-card'
import { PartnerAvatar, PartnerBanner } from '@/components/partners/partner-pictures'
import { SharePartnerAd } from '@/components/share/ads'
import { SocialIcon } from '@/components/partners/social-icon'
import { Button } from '@/components/ui/button'
import type { Partner } from '@/data/partners'
import { localePath } from '@/i18n/config'
import { localizedGames } from '@/i18n/content'
import { copy } from '@/i18n/copy'
import { formatMonth } from '@/i18n/dates'
import { getLocale } from '@/i18n/locale'
import {
  hasReferralCode,
  partnerGames,
  partnerText,
  partnerTextLang,
  platformName,
  referralDiscount,
  referralSignupUrl,
  socialLinks,
} from '@/lib/partners'
import { cn } from '@/lib/utils'

/**
 * A partner's profile, everything between the site header and footer on
 * /partners/<slug>: banner, picture, name, their code and the sign-up button
 * (only for a partner who shows a code), their description, links and games.
 */
export function PartnerProfile({ partner }: { partner: Partner }) {
  const locale = getLocale()
  const t = copy()
  const words = t.partners
  const path = (href: string) => localePath(locale, href)
  const links = socialLinks(partner)
  const games = partnerGames(partner, localizedGames())
  const paragraphs = partnerText(partner.description, locale).split(/\n\s*\n/)

  return (
    <>
      <div className="pt-10 md:pt-14">
        <Breadcrumbs
          breadcrumbs={[{ label: words.crumb, href: '/partners' }]}
          crumbLabel={partner.name}
          path={`/partners/${partner.slug}`}
          className="mb-6"
        />

        <div className="aspect-[3/1] overflow-hidden rounded-2xl border bg-card">
          <PartnerBanner
            src={partner.banner}
            alt={words.profile.bannerAlt(partner.name)}
            preload
            sizes="(min-width: 72rem) 68rem, 100vw"
          />
        </div>

        <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:gap-6 sm:px-6">
          <PartnerAvatar
            name={partner.name}
            src={partner.avatar}
            alt={words.profile.avatarAlt(partner.name)}
            loading="eager"
            className="-mt-12 size-24 shrink-0 text-xl sm:-mt-16 sm:size-32 sm:text-2xl md:-mt-20 md:size-40 md:text-3xl"
          />
          {/* The top padding keeps a long name that wraps onto several lines clear of the banner. */}
          <div className="min-w-0 sm:pt-5 sm:pb-2">
            <h1 className="font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-balance break-words text-foreground italic md:text-5xl">
              {partner.name}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-medium text-foreground">
                <BadgeCheck aria-hidden="true" className="size-4 text-link" />
                {words.officialPartner}
              </span>
              <span>{words.since(formatMonth(partner.since, locale))}</span>
            </p>
          </div>
        </div>
        <p
          lang={partnerTextLang(partner.tagline, locale)}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground"
        >
          {partnerText(partner.tagline, locale)}
        </p>
        <SharePartnerAd partner={partner} variant="default" className="mt-6" />
      </div>

      {/* With no code there is no side box, so the page is one column rather than a column and an empty gap. */}
      <div
        className={cn('mt-12 grid gap-12', hasReferralCode(partner) && 'lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16')}
      >
        {/* First in reading order on a phone, where the code is what most visitors came for. */}
        {hasReferralCode(partner) && (
          <aside aria-labelledby="referral-heading" className="lg:order-last">
            <div className="rounded-2xl border border-primary/30 bg-card/30 p-6 lg:sticky lg:top-24">
              <h2 id="referral-heading" className="text-sm font-medium text-muted-foreground">
                {words.profile.referral(partner.name)}
              </h2>
              <CopyCode code={partner.referralCode} labels={copyLabels(t)} size="lg" className="mt-3" />
              <Button asChild size="lg" className="mt-6 h-auto min-h-11 w-full py-2.5 text-center whitespace-normal">
                <a href={referralSignupUrl(partner.referralCode)} target="_blank" rel="noopener noreferrer">
                  {words.profile.signUp}
                  <span className="sr-only">{t.header.newTab}</span>
                </a>
              </Button>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {words.profile.discount(referralDiscount(locale))}
              </p>
            </div>
          </aside>
        )}

        <div className="min-w-0 space-y-14">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-semibold tracking-tight text-foreground">
              {words.profile.about(partner.name)}
            </h2>
            <div
              lang={partnerTextLang(partner.description, locale)}
              className="mt-4 max-w-2xl space-y-4 leading-relaxed text-pretty text-foreground/90"
            >
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          {links.length > 0 && (
            <section aria-labelledby="links-heading">
              <h2 id="links-heading" className="text-2xl font-semibold tracking-tight text-foreground">
                {words.profile.links(partner.name)}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {links.map((link) => (
                  // min-w-0 lets a long address (a Steam group, a website) shorten with an
                  // ellipsis instead of widening the page on a phone.
                  <li key={link.platform} className="min-w-0">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-18 items-center gap-4 rounded-xl border bg-card/20 p-4 transition-colors hover:border-foreground/25 hover:bg-card/50"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-background text-foreground ring-1 ring-border">
                        <SocialIcon platform={link.platform} className="size-6" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-foreground">{platformName(link.platform, t)}</span>
                        <span className="block truncate text-sm text-muted-foreground">{link.display}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                      <span className="sr-only">{t.header.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {games.length > 0 && (
            <section aria-labelledby="games-heading">
              <h2 id="games-heading" className="text-2xl font-semibold tracking-tight text-foreground">
                {words.profile.games}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {games.map((game) =>
                  game.slug ? (
                    <li key={game.slug}>
                      <Link
                        href={path(`/games/${game.slug}`)}
                        className="inline-block rounded-full border px-3.5 py-1.5 text-sm text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        {game.name}
                      </Link>
                    </li>
                  ) : (
                    // No page for this game yet: the same pill, without a link.
                    <li key={game.name} lang="en" className="inline-block rounded-full border px-3.5 py-1.5 text-sm text-foreground/85">
                      {game.name}
                    </li>
                  ),
                )}
              </ul>
            </section>
          )}

          <p>
            <Link
              href={path('/partners')}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-link transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />
              {words.profile.allPartners}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

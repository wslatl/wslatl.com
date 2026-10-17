import type React from 'react'
import { ShareAd } from '@/components/share/share-ad'
import type { Partner } from '@/data/partners'
import type { ProductLine } from '@/data/pricing'
import type { GameEntry } from '@/data/games'
import { localizedCommitments, localizedFeatures, localizedGames, localizedLeadFeature, localizedProductLine, localizedServices } from '@/i18n/content'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { gameAd, gamesIndexAd, homeAd, partnerAd, partnersIndexAd, productLineAd, shareLabels, whyLines } from '@/lib/share'

/**
 * The share button for each kind of page. Each one builds its ad on the
 * server, in the language of the page, from the same localized data the page
 * shows, and hands the finished text to the button (components/share/share-ad.tsx).
 * The text itself is built in lib/share.ts.
 */

type Look = Pick<React.ComponentProps<typeof ShareAd>, 'variant' | 'size' | 'className'>

/** What the site says about itself, in the language of the page. */
function siteContent() {
  return {
    commitments: localizedCommitments(),
    lead: localizedLeadFeature(),
    features: localizedFeatures(),
    services: localizedServices(),
    games: localizedGames(),
  }
}

function context() {
  return { t: copy(), locale: getLocale() }
}

/** The ad for the whole company. */
export function ShareSiteAd(look: Look) {
  const ctx = context()
  const text = homeAd(ctx, siteContent())
  return <ShareAd text={text} labels={{ ...shareLabels(ctx.t), copy: ctx.t.share.shareOurAd }} {...look} />
}

/** The ad for one partner, with the names of the games they play. */
export function SharePartnerAd({ partner, ...look }: Look & { partner: Partner }) {
  const ctx = context()
  const all = localizedGames()
  const names = (partner.games ?? []).flatMap((slug) => all.filter((game) => game.slug === slug).map((game) => game.name))
  return <ShareAd text={partnerAd(ctx, partner, names)} labels={shareLabels(ctx.t)} {...look} />
}

/** The ad for one game page. */
export function ShareGameAd({ game, ...look }: Look & { game: GameEntry }) {
  const ctx = context()
  const included = localizedProductLine('game').included
  return <ShareAd text={gameAd(ctx, game, included, whyLines(siteContent()))} labels={shareLabels(ctx.t)} {...look} />
}

/** The ad for the games index. */
export function ShareGamesIndexAd(look: Look) {
  const ctx = context()
  return <ShareAd text={gamesIndexAd(ctx, localizedGames())} labels={shareLabels(ctx.t)} {...look} />
}

/** The ad for one plan line on /pricing (VPS or game servers). */
export function ShareLineAd({ line, ...look }: Look & { line: ProductLine }) {
  const ctx = context()
  return <ShareAd text={productLineAd(ctx, line, whyLines(siteContent()))} labels={shareLabels(ctx.t)} {...look} />
}

/** The "Become a partner" ad for /partners. */
export function SharePartnersIndexAd(look: Look) {
  const ctx = context()
  return <ShareAd text={partnersIndexAd(ctx)} labels={shareLabels(ctx.t)} {...look} />
}

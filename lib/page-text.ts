import { games, type GameEntry } from '@/data/games'
import type { LegalPage } from '@/data/legal'
import { partners, type Partner } from '@/data/partners'
import type { Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'
import { hasReferralCode, partnerMetaDescription, partnersPageText } from '@/lib/partners'
import { formatPrice, gameEntryPlan, startingPrice } from '@/lib/pricing'

/** What a page says about itself, in search results, in link previews and on its share card. */
export interface PageText {
  title: string
  description: string
}

// One function per kind of page. Each page's generateMetadata reads its words
// from here, and so does the share card (lib/share-card.ts), so the two can
// never disagree. Each takes the language it is asked for rather than reading
// the one being rendered (i18n/locale.ts): the card is drawn outside a page
// render, where that is not set.

export function homeText(locale: Locale): PageText {
  const t = copyFor(locale).home
  return {
    title: t.metaTitle,
    description: t.metaDescription(formatPrice(startingPrice('game')), formatPrice(startingPrice('vps'))),
  }
}

export function pricingText(locale: Locale): PageText {
  const t = copyFor(locale).pricing
  return {
    title: t.metaTitle,
    description: t.metaDescription(formatPrice(startingPrice('vps')), formatPrice(startingPrice('game'))),
  }
}

// The four named in the title, plus the rest rounded down to a tidy "40+".
const moreGames = Math.floor((games.length - 4) / 10) * 10

export function gamesText(locale: Locale): PageText {
  const t = copyFor(locale).games
  return {
    title: t.metaTitle(moreGames),
    description: t.metaDescription(formatPrice(startingPrice('game'))),
  }
}

/** One game's page, from the game in the language of the page. */
export function gameText(game: GameEntry, locale: Locale): PageText {
  // The same "from" price the page shows. When no plan covers even the
  // smallest setup, the page shows no price, so the search result does not
  // either.
  const entry = gameEntryPlan(game)
  const price = entry ? formatPrice(entry.plan.price) : null
  const t = copyFor(locale).games.detail
  return {
    title: price ? t.metaTitle(game.name, price) : t.heading(game.name),
    description: price
      ? t.metaDescription(game.name, price, game.tagline)
      : t.metaDescriptionNoPrice(game.name, game.tagline),
  }
}

export function legalIndexText(locale: Locale): PageText {
  const t = copyFor(locale).legal
  return { title: t.metaTitle, description: t.metaDescription }
}

export function brandText(locale: Locale): PageText {
  const t = copyFor(locale).brand
  return { title: t.metaTitle, description: t.metaDescription }
}

/** One legal document, from the document in the language of the page. */
export function legalText(page: LegalPage): PageText {
  return { title: page.title, description: page.metaDescription }
}

export function partnersText(locale: Locale): PageText {
  const t = copyFor(locale).partners
  const codeCount = partners.filter(hasReferralCode).length
  return {
    title: t.metaTitle,
    // Search results and link previews say what the page says.
    description: partnersPageText(t, partners.length, locale, codeCount).description,
  }
}

export function partnerProfileText(partner: Partner, locale: Locale): PageText {
  const t = copyFor(locale).partners.profile
  return { title: t.metaTitle(partner.name), description: partnerMetaDescription(partner, t, locale) }
}

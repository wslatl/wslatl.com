import { partners } from '@/data/partners'
import type { Locale } from '@/i18n/config'
import { localizedGames, localizedLegalPages } from '@/i18n/content'
import {
  gameText,
  gamesText,
  homeText,
  legalIndexText,
  legalText,
  partnerProfileText,
  partnersText,
  pricingText,
  type PageText,
} from '@/lib/page-text'

export interface ShareCardText extends PageText {
  /** A small line above the title: the game, on a game's page. */
  kicker?: string
}

/**
 * The words on the share card for one page, looked up from the page itself.
 *
 * The card is addressed by page (/og?path=/games/minecraft&locale=es), not
 * by its words, so it can only ever say what a page of this site says about
 * itself, in that page's language, and there is a fixed number of cards to
 * cache. The words are the ones the page puts in its own metadata, from the
 * same functions (lib/page-text.ts).
 *
 * `path` is the page's path without a language, as pageMetadata() takes it.
 * Returns undefined for anything that is not a page. A new page needs a line
 * here, and tests/share-card.test.ts fails for any page in the sitemap that
 * has none.
 */
export function shareCardText(path: string, locale: Locale): ShareCardText | undefined {
  switch (path) {
    case '/':
      return homeText(locale)
    case '/pricing':
      return pricingText(locale)
    case '/games':
      return gamesText(locale)
    case '/legal':
      return legalIndexText(locale)
    case '/partners':
      return partnersText(locale)
  }

  const game = localizedGames(locale).find((entry) => `/games/${entry.slug}` === path)
  if (game) return { ...gameText(game, locale), kicker: game.name }

  const document = localizedLegalPages(locale).find((page) => page.href === path)
  if (document) return legalText(document)

  const partner = partners.find((entry) => `/partners/${entry.slug}` === path)
  if (partner) return partnerProfileText(partner, locale)

  return undefined
}

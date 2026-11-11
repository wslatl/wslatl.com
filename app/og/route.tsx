import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale, locales } from '@/i18n/config'
import { shareCardText } from '@/lib/share-card'
import { createShareCardRoute } from '@/platform/og'

/**
 * The card a link to one of this site's pages shows when it is shared on
 * Discord, X, Slack and the rest, drawn by the kit (platform/og/) so every
 * WSLATL site's cards look alike. pageMetadata() (lib/metadata.ts) points
 * every page at it, apart from the home page, which keeps the picture in
 * public/og-image.png, and a partner who gave a banner, which is shown in
 * its place.
 *
 * It is addressed by page, /og?path=/games/minecraft&locale=es, and looks the
 * page's own words up itself (lib/share-card.ts). So it can only draw text
 * the site already says in that language, anything that is not a page is a
 * 404, and there is a fixed number of cards to cache.
 */
export const { GET } = createShareCardRoute({
  // The lockup's alt text: "WSLATL Private Hosting", the words it shows.
  appName: 'Private Hosting',
  address: siteConfig.siteUrl,
  locales,
  defaultLocale,
  textFor: (path, locale) => (isLocale(locale) ? shareCardText(path, locale) : undefined),
})

import { siteConfig } from '@/config/site'
import { localePath, type Locale } from '@/i18n/config'

/**
 * The games that have a category of guides on knowledge.wslatl.com, by their
 * slug here. Copied from lib/categories.ts in the knowledge base's repo, which
 * links back to /games/<slug> for the same games. Add a game when its guides
 * are written; one that is not listed simply gets no link.
 */
const gamesWithGuides = new Set([
  'minecraft', 'rust', 'ark-survival-evolved', 'valheim', 'palworld',
  '7-days-to-die', 'project-zomboid', 'conan-exiles', 'the-forest',
  'sons-of-the-forest', 'enshrouded', 'v-rising', 'terraria', 'starbound',
  'craftopia', 'core-keeper', 'necesse', 'icarus', 'scum', 'astroneer',
  'stationeers', 'empyrion', 'barotrauma', 'eco', 'don-t-starve-together',
  'factorio', 'unturned', 'cs2', 'team-fortress-2', 'left-4-dead-2',
  'garrys-mod', 'squad', 'insurgency-sandstorm', 'killing-floor-2', 'arma-3',
  'arma-reforger', 'mordhau', 'fivem', 'satisfactory', 'space-engineers',
  'dayz',
])

/** Where the knowledge base's category slug differs from ours. */
const categoryAliases: Record<string, string> = {
  'ark-survival-evolved': 'ark',
  'don-t-starve-together': 'dont-starve-together',
}

/**
 * A page on the knowledge base in the reader's language. It uses the same
 * scheme as this site: English at the plain address, the rest under /es etc.
 */
export function knowledgeBaseUrl(locale: Locale, path = '/'): string {
  return `${siteConfig.knowledgeBaseUrl}${localePath(locale, path)}`
}

/** The guides for one of our games, or null when none are written yet. */
export function gameGuidesUrl(gameSlug: string, locale: Locale): string | null {
  if (!gamesWithGuides.has(gameSlug)) return null
  const category = categoryAliases[gameSlug] ?? gameSlug
  return knowledgeBaseUrl(locale, `/category/${category}`)
}

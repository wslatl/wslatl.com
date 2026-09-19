import shortLinkData from './links.json'

/**
 * Every link to a WSLATL panel, portal, or profile goes through a short path
 * on this site: pages link to /discord, and next.config.mjs redirects that to
 * the invite in config/links.json. When a destination changes, edit it there
 * once. Every button on the site, and every wslatl.com/discord link already
 * shared in a chat or an email, follows immediately.
 *
 * The redirects are temporary (307) on purpose. Browsers remember permanent
 * redirects, so a returning visitor would keep landing on the old address.
 */
export const shortLinks = shortLinkData satisfies Record<string, { path: string; url: string }>

export type ShortLinkName = keyof typeof shortLinks

/** The on-site path of each short link, for hrefs: links.discord is '/discord'. */
export const links = Object.fromEntries(
  Object.entries(shortLinks).map(([name, link]) => [name, link.path]),
) as { [Name in ShortLinkName]: string }

const shortPaths = new Set<string>(Object.values(links))

/** True for a short-link path, which leaves the site through a redirect. */
export function isShortLink(href: string): boolean {
  return shortPaths.has(href)
}

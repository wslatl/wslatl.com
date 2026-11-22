import { defaultLocale, isLocale } from '@/i18n/config'
import { games } from '@/data/games'
import { legalPages, legalSlug } from '@/data/legal'
import { partners } from '@/data/partners'

/**
 * The paths served from the site root that are files or endpoints rather
 * than pages. They have no language, so the kit's proxy leaves them alone
 * (isRootFile is its isFile, proxy.ts); everything else is given one. That
 * is what lets app/[locale] trust that it has a real language, rather than
 * the framework rejecting an unknown first segment and serving its own bare
 * 404 page.
 *
 * tests/routing.test.ts keeps this in step with public/ and with the route
 * handlers directly under app/ (app/<name>/route.ts), so adding a file or a
 * handler there and forgetting it here fails the tests rather than the site.
 */
export const rootFiles: readonly string[] = [
  // public/
  '/favicon.ico',
  '/favicon.png',
  '/apple-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/logo.png',
  '/og-image.png',
  // Generated from app/: robots.ts, sitemap.ts, manifest.ts and the
  // company.json route (the company profile for the billing panel).
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
  '/company.json',
  // The share card of every page, in every language, drawn by app/og/route.tsx
  // from its query string. Given a language prefix, it would be looked up as a
  // page called "og" and answer 404 instead of an image.
  '/og',
]

/**
 * Directories under public/ that hold only pictures (client logos, team
 * photos). Only a picture there is a file; any other path under them is a
 * page and gets a language, so a made-up address like /clients/pricing is a
 * 404 rather than a second copy of /pricing that a search engine could index.
 */
export const rootDirectories: readonly string[] = ['/clients/', '/owners/']

/**
 * Directories under public/ that share their name with pages. /partners and
 * /partners/<slug> are pages, while each partner's pictures sit beside them
 * at /partners/<slug>/avatar.webp. The same goes for /brand, the brand kit
 * page: the pictures on it and the logo files to download sit beside it, at
 * /brand/wslatl-mark.webp and /brand/downloads/wslatl-logo-64x64.png. In here
 * only a picture of one of the types below is a file; every other path is a
 * page and is given a language like any other.
 */
export const sharedDirectories: readonly string[] = ['/brand/', '/partners/']

/**
 * The picture types a shared folder may hold, and so the only files served
 * from it: a partner's pictures, and the brand kit's pictures and downloads.
 * lib/partners.ts checks partner pictures against this same list. SVG stays
 * out on purpose: an SVG can carry script, and one opened directly would run
 * it on our own address. (The kit's SVG files are in the full kit on Google
 * Drive, not here.)
 */
export const partnerImageTypes = ['webp', 'png', 'jpg', 'jpeg'] as const

const sharedFile = new RegExp(`\\.(${partnerImageTypes.join('|')})$`)

/**
 * The admin (app/admin, from the kit): English only, outside the languages,
 * so its paths are never given one. /administrator and the like are not it.
 * The kit's proxy answers every admin address before anything here is asked
 * (proxy.ts), with the same rule as this one, which tests/routing.test.ts
 * holds together. It is written out here so that nothing public imports the
 * admin: lib/partners.ts reads this file too.
 */
export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

/**
 * The lists with a page of their own for each entry, at /<list>/<slug> in
 * every language, and the slugs the build makes those pages for: the same
 * lists each app/[locale]/<list>/[slug]/page.tsx builds from
 * (generateStaticParams), which tests/routing.test.ts holds together.
 */
export const listPages: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  ['games', new Set(games.map((game) => game.slug))],
  ['legal', new Set(legalPages.map(legalSlug))],
  ['partners', new Set(partners.map((partner) => partner.slug))],
])

/**
 * For /<list>/<segment>, the address of one of a list's pages whether the
 * build made it or not: the list's slugs and that segment. Null for any
 * other path.
 */
function listPageAt(path: string): { slugs: ReadonlySet<string>; segment: string } | null {
  const [, list, segment, ...deeper] = path.split('/')
  const slugs = listPages.get(list)
  return slugs !== undefined && segment && deeper.length === 0 ? { slugs, segment } : null
}

export function isRootFile(pathname: string): boolean {
  if (rootFiles.includes(pathname)) return true
  // A partner's pictures sit in a folder of their own (lib/partners.ts
  // checks that they do), so one straight under /partners/ is the address
  // of a partner's page instead, and goes the way of any slug of a list.
  if (listPageAt(pathname) !== null) return false
  return [...rootDirectories, ...sharedDirectories].some((dir) => pathname.startsWith(dir) && sharedFile.test(pathname))
}

/**
 * Where a page address goes instead when it would reach one of those pages
 * with a slug the build made none for (/games/anything, /es/legal/anything,
 * /partners/anything.png): the same address one segment deeper, which no
 * page answers but app/[locale]/[...rest], with the same 404 page. Null for
 * every other address, every page the build made included.
 *
 * Next draws such a page the first time it is asked for, and keeps a note
 * of it beside its cache that nothing ever clears, with the whole address
 * in it: up to 16 KB of memory for every new address, which anyone can make
 * up, for as long as the server runs. The catch-all is drawn for each
 * request and keeps nothing.
 *
 * `pathname` is the address as Next will route it, under its language
 * (proxy.ts). Next reads /games/<slug>.rsc as an RSC request for the page
 * at /games/<slug>, and decodes a slug before it looks it up
 * (/games/minecraf%74 is the Minecraft page), so a slug is compared the
 * same way.
 */
export function unlistedPage(pathname: string): string | null {
  const locale = pathname.split('/')[1]
  const page = isLocale(locale) ? listPageAt(pathname.slice(locale.length + 1)) : null
  if (page === null) return null
  let slug = page.segment.replace(/\.rsc$/, '')
  try {
    slug = decodeURIComponent(slug)
  } catch {
    // Not one of ours either: no slug has a percent sign in it.
  }
  return page.slugs.has(slug) ? null : `${pathname}/-`
}

/**
 * Where an address that cannot be decoded goes (/%ff, /es/%E0%A4%A): our
 * 404 page, in the language its first segment names, and the admin's own
 * 404 for an admin address. The kit's proxy sends it there with a 307 on the
 * site's own address (brokenAddress in proxy.ts). Without it the framework
 * answered such an address with a bare 500 that carried none of the
 * security headers, its Content Security Policy included. No page is called
 * broken-address, so each lands on the 404 page of its language.
 */
export function brokenAddress(pathname: string): string {
  const first = pathname.split('/')[1]
  if (first === 'admin') return '/admin/broken-address'
  return isLocale(first) && first !== defaultLocale ? `/${first}/broken-address` : '/broken-address'
}

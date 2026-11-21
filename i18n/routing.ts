import { defaultLocale, isLocale } from '@/i18n/config'

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

export function isRootFile(pathname: string): boolean {
  return (
    rootFiles.includes(pathname) ||
    [...rootDirectories, ...sharedDirectories].some((dir) => pathname.startsWith(dir) && sharedFile.test(pathname))
  )
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

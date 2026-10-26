import { defaultLocale, locales } from '@/i18n/config'

/**
 * The paths served from the site root that are files rather than pages.
 * They have no language, so they are left alone; everything else is given
 * one. That is what lets app/[locale] trust that it has a real language,
 * rather than the framework rejecting an unknown first segment and serving
 * its own bare 404 page.
 *
 * tests/routing.test.ts keeps this in step with public/ and with the
 * app/<name>.<ext>/route.ts handlers, so adding a file there and forgetting
 * it here fails the tests rather than the site.
 */
export const rootFiles: readonly string[] = [
  // public/
  '/favicon.ico',
  '/favicon.png',
  '/favicon.svg',
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
]

/** Directories under public/, served exactly as they are. */
export const rootDirectories: readonly string[] = ['/clients/', '/owners/']

/**
 * Directories under public/ that share their name with pages. /partners and
 * /partners/<slug> are pages, while each partner's pictures sit beside them
 * at /partners/<slug>/avatar.webp. In here only a picture of one of the
 * types below is a file; every other path is a page and is given a language
 * like any other.
 */
export const sharedDirectories: readonly string[] = ['/partners/']

/**
 * The picture types a partner's folder may hold, and so the only files
 * served from it. lib/partners.ts checks partner pictures against this same
 * list. SVG stays out on purpose: an SVG can carry script, and one opened
 * directly would run it on our own address.
 */
export const partnerImageTypes = ['webp', 'png', 'jpg', 'jpeg'] as const

const sharedFile = new RegExp(`\\.(${partnerImageTypes.join('|')})$`)

export function isRootFile(pathname: string): boolean {
  return (
    rootFiles.includes(pathname) ||
    rootDirectories.some((dir) => pathname.startsWith(dir)) ||
    sharedDirectories.some((dir) => pathname.startsWith(dir) && sharedFile.test(pathname))
  )
}

/**
 * Where a request should be sent, or null to leave it where it is.
 *
 * English keeps the plain URLs (/pricing) and every other language sits
 * under a prefix (/es/pricing), while every page lives under app/[locale].
 * So anything that is not already prefixed, and is not one of the files
 * above, is rewritten to the English one behind the scenes. Paths that look
 * like files (/sw.js, /.env) go through it too: they used to skip it and
 * arrive with "sw.js" where the language belongs, which the framework
 * answered by rejecting the request and logging "Internal: NoFallbackError"
 * for every bot that probed one.
 */
export function rewriteTarget(pathname: string): string | null {
  if (isRootFile(pathname)) return null
  const first = pathname.split('/')[1]
  if ((locales as readonly string[]).includes(first)) return null
  return `/${defaultLocale}${pathname}`
}

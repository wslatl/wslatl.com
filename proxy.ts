import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/i18n/config'

/**
 * English keeps the plain URLs (/pricing), every other language sits under a
 * prefix (/es/pricing), and every page lives under app/[locale]. So a request
 * without a language prefix is rewritten to the English one behind the
 * scenes: the visitor's URL does not change, and /en/pricing itself redirects
 * away in next.config.mjs so a page never has two addresses.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]
  if ((locales as readonly string[]).includes(first)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  /*
   * Everything except Next's own assets and the files served from the app
   * root (robots.txt, sitemap.xml, the icons, og-image.png): those are not
   * pages and have no language.
   */
  matcher: ['/((?!_next/|.*\\.[^/]+$).*)'],
}

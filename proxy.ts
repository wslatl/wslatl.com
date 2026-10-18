import { NextResponse, type NextRequest } from 'next/server'
import { rewriteTarget } from '@/i18n/routing'

/**
 * Gives every request a language prefix behind the scenes, so the visitor's
 * URL does not change and a page never has two addresses. The rule itself
 * lives in i18n/routing.ts, where it is covered by tests; everything that
 * reaches a route from here has a language app/[locale] recognises.
 *
 * The site has no Server Actions, so a request naming one (a Next-Action
 * header) is a scanner probing for one. It gets a plain 400 here: left to
 * Next, each one logs an error, and one that also asks for an RSC payload
 * ends in a 500. tests/proxy.test.ts fails if a Server Action is added.
 */
export function proxy(request: NextRequest) {
  if (request.headers.has('next-action')) return new NextResponse(null, { status: 400 })

  const target = rewriteTarget(request.nextUrl.pathname)
  if (!target) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = target
  return NextResponse.rewrite(url)
}

export const config = {
  // Next's own assets and dev endpoints. The files served from the app root
  // are handled in rewriteTarget, where a test can see the list.
  matcher: ['/((?!_next/|__nextjs).*)'],
}

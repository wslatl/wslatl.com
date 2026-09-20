import { NextResponse, type NextRequest } from 'next/server'
import { rewriteTarget } from '@/i18n/routing'

/**
 * Gives every request a language prefix behind the scenes, so the visitor's
 * URL does not change and a page never has two addresses. The rule itself
 * lives in i18n/routing.ts, where it is covered by tests; everything that
 * reaches a route from here has a language app/[locale] recognises.
 */
export function proxy(request: NextRequest) {
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

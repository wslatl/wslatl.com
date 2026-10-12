import { buildCompanyProfile } from '@/lib/company-profile'

/**
 * /company.json: the company profile for the billing panel. It is written
 * once, when the site is built, from the same data the pages use, so it can
 * never disagree with them. proxy.ts leaves this path alone (it is listed in
 * rootFiles in i18n/routing.ts); without that it would be given a language
 * and answer with the 404 page.
 */
export const dynamic = 'force-static'

export function GET() {
  return new Response(`${JSON.stringify(buildCompanyProfile(), null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Public, and short: a price or a name changes with the next deploy,
      // so nothing downstream should hold on to an old copy for long.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

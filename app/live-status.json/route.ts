import { liveStatus } from '@/lib/live-status/source'
import { hasLiveData } from '@/lib/live-status/snapshot'

/**
 * /live-status.json: each location's state from status.wslatl.com, for the
 * live panel at the top of the home page, which loads it once the page is
 * up. The home page itself stays prerendered; only this answers per request,
 * from a one-minute cache (lib/live-status/source.ts).
 *
 * It reads nothing from the request, so every visitor gets the same answer.
 * proxy.ts leaves this path alone (it is listed in rootFiles in
 * i18n/routing.ts); without that it would be given a language and answer
 * with the 404 page.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const status = await liveStatus.current()
  return new Response(JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A state is a minute old at most when it leaves the cache; no one
      // should keep it for longer than half that again. With nothing to
      // show, nothing is kept, so the next visitor asks afresh.
      'Cache-Control': hasLiveData(status) ? 'public, max-age=30' : 'no-store',
    },
  })
}

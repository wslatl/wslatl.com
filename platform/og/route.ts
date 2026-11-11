import { drawShareCard, type ShareCardInput } from './card'

/**
 * The words a page gives its card: the same as ShareCardInput without the
 * app's own name and address, which the route adds.
 */
export type ShareCardText = Omit<ShareCardInput, 'address' | 'appName'>

export interface ShareCardRouteOptions {
  /** The app's name, for the logo's alt text. */
  appName: string
  /** The site's address as the card shows it, such as https://wslatl.com. */
  address: string
  /** The languages the app has. A one-language app passes just its own. */
  locales: readonly string[]
  /** Used when the address names no language. */
  defaultLocale: string
  /**
   * Looks one page's words up from the page itself, or returns undefined for
   * anything that is not a page. The card is addressed by page, never by its
   * words, so it can only say what the site already says, anything that is
   * not a page is a 404, and there is a fixed number of cards to cache.
   */
  textFor: (path: string, locale: string) => ShareCardText | undefined | Promise<ShareCardText | undefined>
  /** How many drawn cards to keep in memory. Defaults to 500, about 25 MB at most. */
  maxCached?: number
}

/**
 * The longest path a card address may ask for. A page's path is short; this
 * stops a hostile address from being looked up or cached under at length.
 */
export const MAX_PATH_LENGTH = 200
const MAX_LOCALE_LENGTH = 16

/**
 * Drawing a card runs Satori and resvg over three fonts, which is real work
 * for one process. The framework's default for an image is no caching, which
 * had every unfurl by Discord, Slack or X draw it again. The card's address
 * is its page, not its words, so a retitled or newly translated page keeps
 * the same address: a day is as long as anything may hold an old card, and
 * after that it is redrawn in the background on the next request.
 */
export const CARD_CACHE_CONTROL = 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'

// A path is a slash and then printable characters. Control characters are
// never in a real page's path.
// oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
const PATH = /^\/[^\u0000-\u001f\u007f]*$/

/**
 * The route handler an app re-exports from its own app/og/route.tsx:
 *
 *   export const { GET } = createShareCardRoute({ ... })
 *
 * Asked for /og?path=/pricing&locale=es, it answers with a 1200x630 PNG, or
 * a 404 for a path that is not a page, a language that is not the app's, or
 * an address that is not shaped like either.
 */
export function createShareCardRoute(options: ShareCardRouteOptions): { GET: (request: Request) => Promise<Response> } {
  const { appName, address, locales, defaultLocale, textFor } = options
  const maxCached = options.maxCached ?? 500

  /**
   * The cards drawn so far in this process, by language and page. A page's
   * words change only with a new release, which starts a new process. Only a
   * real page gets this far, and past maxCached the card asked for least recently is dropped,
   * so asking for the same card again costs nothing and nothing can fill the
   * memory.
   */
  const drawn = new Map<string, Promise<ArrayBuffer>>()

  async function GET(request: Request): Promise<Response> {
    const params = new URL(request.url).searchParams
    const locale = params.get('locale') ?? defaultLocale
    const path = params.get('path') ?? ''

    if (locale.length > MAX_LOCALE_LENGTH || !locales.includes(locale)) return notFound()
    if (path.length > MAX_PATH_LENGTH || !PATH.test(path)) return notFound()

    const card = await textFor(path, locale)
    if (!card) return notFound()

    const key = `${locale} ${path}`
    let png = drawn.get(key)
    if (png) {
      // Asked for again: it moves to the back of the line, so the cards
      // dropped first are the ones asked for least recently.
      drawn.delete(key)
      drawn.set(key, png)
    } else {
      png = drawShareCard({ ...card, address, appName }).arrayBuffer()
      drawn.set(key, png)
      // A card that failed to draw is drawn again on the next request.
      png.catch(() => drawn.delete(key))
      if (drawn.size > maxCached) {
        const oldest = drawn.keys().next().value
        if (oldest !== undefined) drawn.delete(oldest)
      }
    }

    try {
      return new Response(await png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': CARD_CACHE_CONTROL } })
    } catch {
      return new Response('The card could not be drawn', { status: 500 })
    }
  }

  return { GET }
}

function notFound(): Response {
  return new Response('Not found', { status: 404 })
}

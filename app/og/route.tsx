import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale } from '@/i18n/config'
import { ogImage } from '@/lib/metadata'
import { shareCardText, type ShareCardText } from '@/lib/share-card'

/**
 * The card a link to one of this site's pages shows when it is shared on
 * Discord, X, Slack and the rest. pageMetadata() (lib/metadata.ts) points
 * every page at it, apart from the home page, which keeps the picture in
 * public/og-image.png, and a partner who gave a banner, which is shown in
 * its place.
 *
 * It is addressed by page, /og?path=/games/minecraft&locale=es, and looks the
 * page's own words up itself (lib/share-card.ts). So it can only draw text
 * the site already says in that language, anything that is not a page is a
 * 404, and there is a fixed number of cards to cache.
 *
 * It is drawn to the brand kit's rules and to match public/og-image.png: the
 * full lockup top left on solid Ink with nothing behind it, the title in
 * Paper, the description in Muted, and the brand gradient only as a bar along
 * the very bottom edge.
 */
const INK = '#0F090B'
const PAPER = '#F1EDEE'
const MUTED = '#9A8A8F'
const LIGHT_ACCENT = '#48C5FF'
const GRADIENT = 'linear-gradient(90deg, #7879F2, #23C7E5)'

// Read once per process rather than per request. Geist and Instrument Serif
// are under the SIL Open Font Licence; see CREDITS.md.
// Static instances, not the variable file: Satori fails to parse the variable
// Geist and the route answers 500 with a TypeError deep in the font parser.
// Each path is written out in full: built from a spread of parts, the build
// cannot tell which files the route reads and traces the whole project into
// the server output.
const geistRegular = readFileSync(join(process.cwd(), 'assets', 'fonts', 'Geist-400.ttf'))
const geistBold = readFileSync(join(process.cwd(), 'assets', 'fonts', 'Geist-700.ttf'))
const serifItalic = readFileSync(join(process.cwd(), 'assets', 'fonts', 'InstrumentSerif-Italic.ttf'))
// The full lockup, trimmed from the brand kit's banner at twice the 224x64 it
// is drawn at (see Images in README.md). Never recolour or stretch it.
const lockup = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'assets', 'brand', 'wslatl-lockup.png'),
).toString('base64')}`

/**
 * Drawing a card runs Satori and resvg over three fonts, which is real work
 * for one process. The framework's default for an image is no caching, which
 * had every unfurl by Discord, Slack or X draw it again. The card's address
 * is its page, not its words, so a retitled or newly translated page keeps
 * the same address: a day is as long as anything may hold an old card, and
 * after that it is redrawn in the background on the next request.
 */
const CACHE_CONTROL = 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'

/** Cuts a text that is longer than the card has room for at a word, with an ellipsis. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s,;:]+$/, '')}…`
}

/**
 * Ties the last two words together with a no-break space, so a text never
 * ends on a word alone on its line: a game's title breaks before "from
 * $8.18/mo" rather than leaving the price by itself.
 */
function tieEnd(text: string): string {
  return text.replace(/ (\S+)$/, '\u00a0$1')
}

/**
 * The cards drawn so far in this process, by language and page. Drawing is
 * the costly part, and a page's words change only with a new release, which
 * starts a new process. Only a real page gets this far, so this holds at most
 * one card per page in the sitemap, about 50 KB each, and asking for the same
 * card again and again costs nothing after the first time.
 */
const drawn = new Map<string, Promise<ArrayBuffer>>()

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const locale = params.get('locale') ?? defaultLocale
  const path = params.get('path') ?? ''
  const card = isLocale(locale) ? shareCardText(path, locale) : undefined
  if (!card) return new Response('Not found', { status: 404 })

  const key = `${locale} ${path}`
  let png = drawn.get(key)
  if (!png) {
    png = drawCard(card).arrayBuffer()
    drawn.set(key, png)
    // A card that failed to draw is drawn again on the next request.
    png.catch(() => drawn.delete(key))
  }
  return new Response(await png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': CACHE_CONTROL } })
}

function drawCard(card: ShareCardText): ImageResponse {
  // Every page's words are shorter than these today. They only stop a very
  // long partner name or a new translation from running off the card.
  const title = tieEnd(clamp(card.title, 90))
  const kicker = card.kicker ? clamp(card.kicker, 40) : undefined
  const description = tieEnd(clamp(card.description, 220))

  // A short title can be set large; a long one has to come down to fit. The
  // cut-offs were measured on every title the site has, in all five
  // languages: at each size they take two lines at most, which leaves room
  // for the game's name above and a description of three or four lines below.
  const titleSize = title.length > 46 ? 58 : title.length > 36 ? 70 : 84

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: INK,
          padding: '60px 88px 74px',
          fontFamily: 'Geist',
        }}
      >
        {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse draws plain elements, next/image does not apply */}
        <img src={lockup} width={224} height={64} alt="WSLATL Private Hosting" />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {kicker ? (
            <div
              style={{
                fontFamily: 'Instrument Serif',
                fontStyle: 'italic',
                fontSize: 44,
                lineHeight: 1,
                color: LIGHT_ACCENT,
                marginBottom: 14,
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -titleSize * 0.03,
              color: PAPER,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ fontSize: 26, lineHeight: 1.4, color: MUTED, maxWidth: 820 }}>{description}</div>
          <div style={{ fontSize: 26, lineHeight: 1.4, fontWeight: 700, color: PAPER }}>
            {siteConfig.siteUrl.replace('https://', '')}
          </div>
        </div>

        {/* The brand gradient, as an accent bar and nothing else. Satori needs
            an explicit width and backgroundImage: the left/right pair and the
            background shorthand that work in a browser drew nothing. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: ogImage.width,
            height: 8,
            backgroundImage: GRADIENT,
          }}
        />
      </div>
    ),
    {
      width: ogImage.width,
      height: ogImage.height,
      fonts: [
        { name: 'Geist', data: geistRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: geistBold, weight: 700, style: 'normal' },
        { name: 'Instrument Serif', data: serifItalic, weight: 400, style: 'italic' },
      ],
    },
  )
}

import { ImageResponse } from 'next/og'
import { cardAssets } from './assets'
import { cardAddress, clampText, oneLine, tieEnd } from './text'

/**
 * The share card: the picture a link to one of WSLATL's pages shows when it
 * is shared on Discord, X, Slack and the rest. wslatl.com, the knowledge
 * base, status and notification all draw it from here, so they look alike.
 *
 * It is drawn to the brand kit's rules: the full lockup top left on solid
 * Ink with nothing behind it, the title in Paper, the description in Muted,
 * and the brand gradient only as a bar along the very bottom edge.
 */
const INK = '#0F090B'
const PAPER = '#F1EDEE'
const MUTED = '#9A8A8F'
const LIGHT_ACCENT = '#48C5FF'
const GRADIENT = 'linear-gradient(90deg, #7879F2, #23C7E5)'

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

export interface ShareCardInput {
  /** What the page is called. */
  title: string
  /** The small line above the title: the game, on a game's page. */
  kicker?: string
  /** One or two sentences under the title. */
  description?: string
  /** The site's address, shown bottom right, with or without https://. */
  address: string
  /** The app's name, for the logo's alt text. */
  appName: string
}

/**
 * Draws a card from plain words. Every text is cleaned and cut to fit, so
 * no input can run off the card, break the layout or make it slow to draw.
 */
export function drawShareCard(input: ShareCardInput): ImageResponse {
  const assets = cardAssets()

  // Every page's words are shorter than these today. They only stop a very
  // long partner name or a new translation from running off the card.
  const title = tieEnd(clampText(oneLine(input.title), 90))
  const kicker = clampText(oneLine(input.kicker), 40)
  const description = tieEnd(clampText(oneLine(input.description), 220))
  const address = cardAddress(input.address)
  const appName = clampText(oneLine(input.appName), 60) || 'WSLATL'

  // A short title can be set large; a long one has to come down to fit. The
  // cut-offs were measured on every title the site has, in all five
  // languages: at each size they take two lines at most, which leaves room
  // for the kicker above and a description of three or four lines below.
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
        {/* ImageResponse draws plain elements, so next/image does not apply. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.lockup} width={224} height={64} alt={`WSLATL ${appName}`} />

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
          {/* The address cannot wrap, so it never shrinks: the description
              gives way. */}
          <div style={{ fontSize: 26, lineHeight: 1.4, fontWeight: 700, color: PAPER, flexShrink: 0 }}>{address}</div>
        </div>

        {/* The brand gradient, as an accent bar and nothing else. Satori needs
            an explicit width and backgroundImage: the left/right pair and the
            background shorthand that work in a browser drew nothing. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: CARD_WIDTH,
            height: 8,
            backgroundImage: GRADIENT,
          }}
        />
      </div>
    ),
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: [
        { name: 'Geist', data: assets.geistRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: assets.geistBold, weight: 700, style: 'normal' },
        { name: 'Instrument Serif', data: assets.serifItalic, weight: 400, style: 'italic' },
      ],
    },
  )
}

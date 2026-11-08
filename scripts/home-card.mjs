/**
 * Draws public/og-image.png, the home page's share picture (every other page
 * has a card drawn by app/og/route.tsx): the slogan on solid Ink, with the
 * fonts, lockup and gradient bar the cards use, from assets/. Run it after a
 * change to the slogan or the branding: `npm run home:card`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
// With .js: next has no exports map, so a plain script names the file.
import { ImageResponse } from 'next/og.js'
import { createElement as h } from 'react'
import sharp from 'sharp'

const root = join(import.meta.dirname, '..')
const asset = (/** @type {string[]} */ ...parts) => readFileSync(join(root, 'assets', ...parts))

// The site's .gradient-text (app/globals.css), oklch(0.78 0.16 235) to
// oklch(0.6 0.22 268), in sRGB: the renderer reads no oklch().
const accentFrom = '#1fc6ff'
const accentTo = '#496fff'
const lockup = `data:image/png;base64,${asset('brand', 'wslatl-lockup.png').toString('base64')}`

const card = h(
  'div',
  {
    style: {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '60px 88px 76px 88px',
      // The brand kit puts the logo on a solid surface: Ink, no glow.
      backgroundColor: '#0F090B',
      fontFamily: 'Geist',
      color: '#F1EDEE',
    },
  },
  h('img', { src: lockup, width: 224, height: 64 }),
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', marginTop: 64, fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -2.6 } },
    h('div', { style: { display: 'flex' } }, 'Hosting that'),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'baseline', marginTop: 4 } },
      h(
        'span',
        {
          style: {
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 108,
            letterSpacing: 0,
            // As .gradient-text does on the site: the gradient paints only
            // inside the word's box, and the italic letters lean past it (the
            // tail of the y hung below it and was cut off). The padding widens
            // the painted area, and the negative margins keep the layout where
            // it was, 24px from the next word.
            padding: '0 22px 36px 22px',
            margin: '0 2px -36px -22px',
            backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            backgroundClip: 'text',
            color: 'transparent',
          },
        },
        'actually',
      ),
      h('span', null, 'gives a damn.'),
    ),
  ),
  h('div', { style: { display: 'flex', flexGrow: 1 } }),
  h(
    'div',
    { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 24, lineHeight: 1.45 } },
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h('span', { style: { color: '#9A8A8F' } }, 'VPS, game servers, dedicated servers, and web hosting.'),
      h('span', null, 'Run by a small team in Missouri.'),
    ),
    h('span', { style: { fontWeight: 700 } }, 'wslatl.com'),
  ),
  // The kit's "Ink panel + gradient accent bar": the wordmark gradient as a rule.
  h('div', {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: 1200,
      height: 8,
      backgroundImage: 'linear-gradient(90deg, #7879F2, #23C7E5)',
    },
  }),
)

const response = new ImageResponse(card, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Geist', data: asset('fonts', 'Geist-400.ttf'), weight: 400, style: 'normal' },
    { name: 'Geist', data: asset('fonts', 'Geist-700.ttf'), weight: 700, style: 'normal' },
    { name: 'Instrument Serif', data: asset('fonts', 'InstrumentSerif-Italic.ttf'), weight: 400, style: 'italic' },
  ],
})
const drawn = Buffer.from(await response.arrayBuffer())
const png = await sharp(drawn).flatten({ background: '#0F090B' }).png({ palette: true, quality: 95, effort: 10, dither: 1 }).toBuffer()
writeFileSync(join(root, 'public', 'og-image.png'), png)
console.log(`public/og-image.png: 1200x630, ${png.length} bytes`)

# Share cards

The 1200 by 630 picture a link to one of WSLATL's pages shows when it is shared on Discord, X, Slack and the rest. The design is the one wslatl.com, the knowledge base and billing already share: the lockup top left on Ink, the title in Paper, the description in Muted, the brand gradient as a bar along the bottom edge.

## In an app

`app/og/route.tsx`:

```ts
import { createShareCardRoute } from '../../platform/og'

export const { GET } = createShareCardRoute({
  appName: 'Private Hosting',
  address: 'https://wslatl.com',
  locales: ['en', 'es', 'de', 'fr', 'pt'],
  defaultLocale: 'en',
  // Look the page up by its path and return its own words, or undefined for anything that is not a page.
  textFor: (path, locale) => shareCardText(path, locale),
})
```

A page then shares `/og?path=/games/minecraft&locale=es`. The card is addressed by page and never by its words, so it can only say what the site already says, anything that is not a page is a 404, and there is a fixed number of cards to keep.

`textFor` returns `{ title, description?, kicker? }`. The `kicker` is the small line above the title (the game, on a game's page).

## Drawing one directly

```ts
import { drawShareCard } from '../platform/og'

const image = drawShareCard({
  title: 'Minecraft server hosting from $8.18/mo',
  kicker: 'Minecraft',
  description: 'Game servers on AMD Ryzen 9 3900X with NVMe.',
  address: 'https://wslatl.com',
  appName: 'Private Hosting',
}) // an ImageResponse
```

## What it checks

- A `locale` must be one of the app's, at most 16 characters. A `path` must start with `/`, be at most 200 characters and have no control characters. Anything else is a 404 before any lookup.
- Every text is stripped of control and direction-changing characters, made one line, and cut at a word to fit: title 90 characters, kicker 40, description 220, address 60.
- Drawn cards are kept in memory, at most 500 by default (`maxCached`), and sent with a day's cache headers.

## Files

The three fonts and the lockup are in `kit/assets/`. In an app they are read from `platform/assets/` the first time a card is drawn. Geist and Instrument Serif are under the SIL Open Font Licence, and are static instances because Satori cannot read the variable Geist.

# Credits

## Fonts

Three font files come with the shared kit, under `platform/assets/fonts/`, because the share card of every page is drawn on the server (`platform/og/`, through `app/og/route.tsx`) and needs the font data on disk. They are under the SIL Open Font Licence 1.1, which permits bundling and redistribution.

| File | Family | Source |
| --- | --- | --- |
| `Geist-400.ttf`, `Geist-700.ttf` | Geist | [vercel/geist-font](https://github.com/vercel/geist-font) via Google Fonts |
| `InstrumentSerif-Italic.ttf` | Instrument Serif | [Instrument/instrument-serif](https://github.com/Instrument/instrument-serif) |

Copyright 2024 The Geist Project Authors. Copyright 2022 The Instrument Serif Project Authors. Each file also carries its own copyright notice and the licence address in its name table.

These are families the site itself loads through `next/font` (`platform/fonts.ts`, with Geist Mono for codes), so a share card and the page it links to are set in the same type. The files are static instances cut down to the Latin letters the five languages use: the card renderer fails on the variable Geist, and `tests/share-card.test.ts` fails if a card ever needs a character they do not have.

## The WSLATL lockup

`platform/assets/brand/wslatl-lockup.png` is the full WSLATL lockup (the mark, "WSLATL" and "Private Hosting") from the brand kit, as it ships: trimmed of its transparent margin and resized, nothing else. It is WSLATL LLC's own artwork. The header's mark is the kit's too, `platform/assets/brand/wslatl-mark-32.png` and its 64px copy for sharper screens. See Images in `README.md`.

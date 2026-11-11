# Email layout

One layout for every WSLATL email: the status app's invites, subscribe confirmations and incident emails, and the notification gateway's sign-in code and unsubscribe footers.

Open [`sample.html`](./sample.html) in a browser to see it. It is an incident update and uses every part.

## Using it

```ts
import { renderEmail } from '../platform/email'

const { html, text } = renderEmail({
  preheader: 'Your sign-in code is 482913. It works for 10 minutes.',
  logo: { url: 'cid:lockup', alt: 'WSLATL Private Hosting' },
  heading: 'Your sign-in code',
  paragraphs: ['Type this code in to sign in. It works for 10 minutes.'],
  code: '482913',
  rows: [{ label: 'Requested from', value: '203.0.113.7', mono: true }],
  button: { label: 'Open the panel', url: 'https://notification.wslatl.com/' },
  signOff: {
    name: 'Your Name',
    role: 'Your role, WSLATL',
    link: { label: 'Discord', url: 'https://discord.gg/wslatl' },
    markUrl: 'cid:mark',
  },
  footer: [
    'You get this because someone asked to sign in with this address.',
    { label: 'Unsubscribe', url: 'https://notification.wslatl.com/unsubscribe/token' },
  ],
})

// Send both as the two alternatives of one message.
await transport.sendMail({ to, subject, html, text, attachments })
```

Only `preheader`, `logo`, `heading` and `paragraphs` are required. The rest is left out when it is not given.

## The parts

| Part | What it is |
| --- | --- |
| `preheader` | The line an inbox shows beside the subject. Put the fact here, not a greeting. Not in the text version. |
| `logo` | The real artwork as a picture address, never typed text. Defaults to 140 by 40, the lockup's shape. |
| `heading`, `paragraphs` | Plain words. No markup: it is escaped. |
| `code` | A code to type in, set large in the monospace face. |
| `rows` | Facts as label and value: dates, amounts, IDs. `mono: true` sets a value in the monospace face. |
| `button` | The one thing to do. The address is also written out in full under it. |
| `signOff` | The brand guide's sign-off: the mark at 32px, the name, the role and a direct Discord or email link. No slogan. |
| `footer` | Small print. A string is a line of text, and `{ label, url }` is a line that is a link, such as Unsubscribe. |
| `lang`, `title` | The message's language (default `en`) and the page title (default the heading). |

## The pictures

Pass the shipped files, which are in `kit/assets/brand/`: `wslatl-lockup.png` for `logo` and `wslatl-mark-64.png` (the mark, drawn at 32px) for `signOff.markUrl`. The brand guide asks for the picture to be attached to the message, not linked from the web. Attach each one with a content id and pass `cid:that-id`:

```ts
attachments: [
  { filename: 'wslatl-lockup.png', path: lockupPath, cid: 'lockup' },
  { filename: 'wslatl-mark.png', path: markPath, cid: 'mark' },
]
```

A plain `https:` address works too, for an app that serves the files itself.

## What it does for you

- **Table layout with inline styles**, with a conditional button for Outlook, so it holds up in Gmail, Outlook and Apple Mail. No web fonts are loaded: Geist is used where the reader has it, then the system fonts.
- **Dark, always.** Ink surface, Paper text, Muted for the small print and the blue `#0079CE` for the button with white text. Every surface has a `bgcolor` as well as a CSS colour, and the page declares `color-scheme: dark`, so a client's dark mode has nothing to turn over.
- **Every value is escaped**, and every field is made a single line: a new line, a control character or a direction-changing mark in a word cannot start a new paragraph or header.
- **No em dash, en dash or middle dot** gets out, even from a word the layout was handed. A dash becomes a spaced hyphen and a middle dot becomes a comma.
- **Links are checked.** Only `https:`, `http:` and `mailto:` can be linked, and a picture may also be `cid:`. Anything else (`javascript:`, `data:`, a relative address, an address with a password in it) throws an `EmailLinkError` so the mistake shows up in a test and not in an inbox.
- **A plain-text version** that reads well on its own: the heading, the paragraphs, the rows as `Label: value`, each address on a line of its own, then the sign-off and the small print.

## Brand rules it follows

Sections 6, 7.3 and 7.5 of the brand guide: facts first, no marketing copy in transactional mail, order IDs, amounts and dates in the rows, and a sign-off with the mark, a name, a role and a direct link. Write the words the same way: answer in the first sentence, say the number.

## Changing the sample

`sample.html` is checked by `tests/email/sample.test.ts`. After a change to the layout, run `UPDATE_EMAIL_SAMPLE=1 npm test` once to write it again, and look at the result.

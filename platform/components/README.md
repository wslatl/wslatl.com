# components/

The shared look: the pieces every WSLATL app uses, so the four apps read as one. They are the main website's own pieces, moved here. Each takes its text and addresses through props, uses only the token names (`bg-card`, `text-muted-foreground`, `text-link`, `border-border`), and imports only from inside the kit. Never edit them in an app.

## Wiring an app up

1. **Styles.** In the app's main stylesheet, after Tailwind, with the kit's copy beside it as `platform/`:

   ```css
   @import 'tailwindcss';
   @import '../platform/styles/tokens.css';
   @import '../platform/styles/base.css';
   @source '../platform';
   ```

   `@source '../platform'` makes Tailwind read the classes the kit's components use. `base.css` brings the base layer, selection, focus ring, scrollbars and the few rules the header, mobile menu and skip link need.

2. **Fonts.** In the root layout, put the kit's class names on `<html>`. They set `--font-sans`, `--font-mono` and `--font-serif`, which `tokens.css` reads:

   ```tsx
   import { fontClassNames } from '../platform/fonts'

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en" className={fontClassNames}>
         <body className="relative isolate min-h-dvh font-sans antialiased">
           <SkipLink>Skip to main content</SkipLink>
           {children}
         </body>
       </html>
     )
   }
   ```

3. **Components.** Import from `../platform/components` (or from a single file in it). Only `SiteHeader`, `CopyButton` and `useCopyText` run in the browser; everything else renders on the server.

The mark files are in `platform/assets/brand/`. They are the brand kit's own PNGs, as shipped, and `Logo` imports them, so the app copies nothing into `public/`.

## Components

All text below is an example. The app passes its own, in the page's language.

**Button** takes `variant` (`default`, `outline`, `ghost`), `size` (`default`, `sm`, `lg`, `icon-sm`) and `asChild`. An icon-only button needs an `aria-label`.

```tsx
<Button asChild size="lg">
  <a href="https://billing.wslatl.com">Get started</a>
</Button>
```

**SiteHeader** shows the mark (32px, the same everywhere) and the app's `appName` in small text beside it on the smaller apps. `nav` fills the bar and the mobile menu; `actions` is the right-hand area; `mobileFooter` goes under the links in the menu; `switcher` is the small Website, Guides, Status menu with addresses from the app. Give `localePrefixes` if the app puts the language in the path.

```tsx
<SiteHeader
  homeHref="/"
  homeLabel="WSLATL Guides, home"
  appName="Guides"
  nav={[
    { label: 'Servers', href: '/servers' },
    { label: 'Discord', href: '/discord', external: true },
  ]}
  navLabel="Main"
  newTabLabel=" (opens in a new tab)"
  openMenuLabel="Open menu"
  switcher={{
    label: 'WSLATL sites',
    apps: [
      { label: 'Website', href: 'https://wslatl.com' },
      { label: 'Guides', href: 'https://knowledge.wslatl.com', current: true },
      { label: 'Status', href: 'https://status.wslatl.com' },
    ],
  }}
  actions={<Button asChild size="sm"><a href="/login">Log in</a></Button>}
/>
```

**SiteFooter** takes `columns` (a `title` and `links` each; the grid is built for four), an `about` block, a `legal` line and an optional `credit` link.

```tsx
<SiteFooter
  columns={[{ title: 'Company', links: [{ label: 'About', href: '/about' }] }]}
  newTabLabel=" (opens in a new tab)"
  about={<p className="text-sm leading-relaxed text-muted-foreground">Small hosting company in Missouri.</p>}
  legal="2026 WSLATL LLC. All rights reserved."
  credit={{ label: 'Credits', href: '/credits' }}
/>
```

**PageStart** is how every inner page starts: breadcrumb, serif title, one or two sentences. `breadcrumbs` is the trail before the page, home included. When the page's name is in another language than the page, such as an English guide title on a Spanish page, pass `currentLang` so it is marked as that language.

```tsx
<PageStart
  title="Partners"
  breadcrumbs={[{ label: 'Home', href: '/' }]}
  current="Partners"
  breadcrumbLabel="Breadcrumb"
>
  People who send us customers, and what they get for it.
</PageStart>
```

**BannerCard** is the one card shape: a 3:1 banner, a round picture overlapping it, the name, one line, and the thing to do. `headingLevel` is `3` where the cards sit under a section's own heading. `meta` sits under the line (icon links) and `actions` at the bottom. `featured` needs `featuredLabel`. Without pictures it shows a plain banner and the initials.

```tsx
<BannerCard
  name="Nxtlyfe"
  headingId="partner-nxtlyfe"
  line="Streams survival games."
  bannerSrc="/partners/nxtlyfe-banner.webp"
  pictureSrc="/partners/nxtlyfe.webp"
  featured
  featuredLabel="Featured"
  actions={<a href="/partners/nxtlyfe" className="text-sm font-medium text-link">View profile</a>}
/>
```

**Field** and **Input**: a label, a control, a hint and an error, tied together. `error` is shown in words and marks the control invalid. Pass a function as the child to receive the props to spread, or pass an `Input` with the same `id`.

```tsx
<Field id="email" label="Email" hint="We only reply to this." error={problem}>
  {(control) => <Input {...control} name="email" type="email" autoComplete="email" required />}
</Field>
```

**StatusBadge** takes `tone` (`success`, `warning`, `danger`, `info`) and the word to show. It always has an icon and a word, never colour alone.

```tsx
<StatusBadge tone="success">Operational</StatusBadge>
```

**CopyButton** shows a value as selectable text with a Copy button. `labels` has the three words, `size` is `sm` or `lg`.

```tsx
<CopyButton value="NXTLYFE10" labels={{ copy: 'Copy', copied: 'Copied', copyFailed: 'Could not copy, select it by hand' }} />
```

**ErrorPage** is the content of the 404 and of the crash page, with `variant` `notFound` or `crash`. It renders the page's `<main>`. Put the app's header and footer around a 404; the crash page is rendered on its own.

```tsx
// not-found.tsx
<ErrorPage
  variant="notFound"
  code="404"
  heading="That page is not here"
  destinations={[{ label: 'Pricing', href: '/pricing' }]}
  actions={<Button asChild><Link href="/">Back to the home page</Link></Button>}
>
  The address may have moved, or it may never have existed.
</ErrorPage>

// error.tsx (a client component)
<ErrorPage
  variant="crash"
  heading="Something broke on our side"
  actions={<Button type="button" onClick={reset}>Try again</Button>}
>
  Please try again, or tell us on <a href="/discord" className={errorLinkClassName}>Discord</a>.
</ErrorPage>
```

**GlobalErrorPage** is for `app/global-error.tsx`, the last resort when a root layout itself crashes. Then the stylesheet, the fonts and the router may all be gone, so it brings its own `<html>` and `<body>`, styles everything inline with the token values, and goes home with a plain link. Take the language from the address, and use `globalErrorLinkStyle` for a link in the text.

```tsx
'use client'
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <GlobalErrorPage lang="en" title="Something went wrong | WSLATL" heading="Something went wrong" retryLabel="Try again" onRetry={reset} homeHref="/" homeLabel="Back to the home page">
      Please try again, or tell us on <a href="/discord" style={globalErrorLinkStyle}>Discord</a>.
    </GlobalErrorPage>
  )
}
```

Also exported: `Main` and `SkipLink` (the landmark and the first link in `<body>`), `Breadcrumbs`, `SiteLink` (internal and off-site links; off-site opens in a new tab and says so), `Logo`, `useCopyText`, and `cn` from `../lib/cn`.

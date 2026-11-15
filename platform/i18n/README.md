# platform/i18n/

Every page of every WSLATL app in five languages, run the same way in all four: next-intl 4, with the choices PLAN.md section 6.8 makes fixed here. English (`en`) is the default and the source; Spanish (`es`), French (`fr`), German (`de`) and Portuguese (`pt`) sit under their prefix.

| File | What it is |
| --- | --- |
| `config.ts` | The five locales, each named in itself (`localeNames`), their Open Graph locales and BCP 47 tags, `isLocale`, `localePath`, `stripLocale`, and `LocalizedText` for settings in five languages. No next-intl, no React. |
| `routing.ts` | next-intl's `defineRouting`, with the choices below. |
| `navigation.ts` | `createNavigation(routing)`: `Link`, `redirect`, `permanentRedirect`, `getPathname`, `usePathname`, `useRouter`. |
| `proxy.ts` | `createProxy` for the app's `proxy.ts`: the kit's own rules first, then the languages. `createLocaleRouting` is the language step alone. |
| `request.ts` | `createRequestConfig` for the app's `i18n/request.ts`. |
| `messages/<locale>.json` | The kit's own words in five languages, English the source. |
| `messages.ts` | Those words for server code. A public page gets them through the app's messages, under `platform`. |
| `admin-locale.ts` | The admin's language: its cookie and the readers an app's request config uses. |
| `seo.ts` | `createSeo`: canonical, hreflang with x-default, the Open Graph locale and the sitemap, for the languages a page is written in. |
| `language-picker.tsx` | The picker: the same page in each language, with no JavaScript needed. |
| `crash-words.ts` | The crash page's words in five languages, for the two error pages that have no provider. |

The check every app runs in CI is `platform/tools/i18n-check.mjs` (below).

## The choices, fixed for every app

- **`localePrefix: 'as-needed'`.** English keeps its plain addresses (`/pricing`), the other four sit under their prefix (`/es/pricing`). No address that exists today moves.
- **`localeDetection: false`.** Nothing is picked from the browser's language or a cookie. The visitor chooses with the picker, and an address shows the same page to everyone, so every page is built once and cached.
- **`localeCookie: false`.** No `NEXT_LOCALE`. With no detection nothing reads it, and a Set-Cookie on a page keeps Cloudflare from caching it.
- **`alternateLinks: false`.** No `Link` header with the translations. Every page already lists them in its head, and the sitemap lists them too, both from the app's own https address (`seo.ts`). next-intl builds the header from the request's Host, X-Forwarded-Host and X-Forwarded-Proto, which a request can set itself, so a cached page could name another site, or `http:`, as its translations. It would also go out with every 404 and every made-up address, listing five translations of a page that does not exist.
- **The language comes from `next/root-params`.** The request config reads the page's `[locale]`, never the request's headers, so every page stays prerendered and no page calls `setRequestLocale`, which next-intl 4 marks as old.
- **Text stays on the server.** The kit's public components take their words as props, so no public page loads next-intl's browser runtime because of the kit.
- **Dates are written in UTC** unless an app says otherwise, so a date with no time is never moved to the day before. The admin writes its times in US Central time.

## Setting an app up

1. **Packages.** `next-intl` in `dependencies`, at the floor in `platform/versions.json` (4.14.9); `npm run platform:check` says so when it is missing or older. The kit pins `use-intl` and `icu-minify`, which next-intl brings, at the same version (`overrides` in its own package.json); an app may do the same, so a fresh install does not take a newer one.
2. **`next.config.mjs`**, the plugin outermost:

   ```js
   import createNextIntlPlugin from 'next-intl/plugin'
   const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
   export default withNextIntl(nextConfig)
   ```

3. **`i18n/request.ts`**:

   ```ts
   import { locale } from 'next/root-params'
   import { createRequestConfig } from '@/platform/i18n/request'

   export default createRequestConfig({
     rootLocale: locale,
     messages: (language) => import(`../messages/${language}.json`),
   })
   ```

   The language is, in order: the one a call asks for (`getTranslations({ locale, namespace })`, which every route handler must do, since root params do not reach route handlers); the page's `[locale]`; on a page with no `[locale]`, which is the admin, the admin's language (below); then English. The messages are the app's in that language over its English ones, so a key a language is missing shows English until it is translated, and the check fails CI until then. The kit's words for public pages are added under `platform`, the one top-level name an app's messages may not use. The admin's words are never added: nothing public carries them.

   Options: `timeZone` (UTC unless set), `formats`, `onError`, `getMessageFallback`, and `adminLocale` for an app whose accounts keep a language (below).

4. **`app/[locale]/layout.tsx`**: answer 404 for anything that is not one of the five, and list the five for the build:

   ```tsx
   import { notFound } from 'next/navigation'
   import { isLocale, locales } from '@/platform/i18n/config'

   export const generateStaticParams = () => locales.map((locale) => ({ locale }))

   export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
     const { locale } = await params
     if (!isLocale(locale)) notFound()
     return <html lang={locale}>...</html>
   }
   ```

   A `NextIntlClientProvider`, where an app needs one, always gets `messages` with only what its Client Components use, such as `messages={{ search: messages.search }}`. Without it, next-intl hands every message of the language to every page.

5. **Typed keys**, in a `global.d.ts`:

   ```ts
   import type { routing } from '@/platform/i18n/routing'
   import type { PlatformMessages } from '@/platform/i18n/messages'
   import type messages from './messages/en.json'

   declare module 'next-intl' {
     interface AppConfig {
       Locale: (typeof routing.locales)[number]
       Messages: typeof messages & { platform: PlatformMessages }
     }
   }
   ```

   A key misspelt or missing in English then fails `npm run typecheck`. Whether the other four have it is the check's job.

6. **`proxy.ts`** (below), **`platform.config.mjs`** (the check's folders, below), and **`package.json`**: `"i18n:check": "node platform/tools/i18n-check.mjs"`, run in CI.

## The proxy

```ts
import platform from './platform.config.mjs'
import { createProxy } from '@/platform/i18n/proxy'

export const proxy = createProxy({ url: platform.url, isFile: isRootFile })
export const config = { matcher: ['/((?!_next/).*)'] }
```

In order, for every request:

1. **The kit's rules, as before** (`secureRequest`, `platform/admin/README.md`): plain HTTP to HTTPS on the app's own host, a 405 for every method and Server Action nothing takes, and every admin page and route with the admin's own policy and nonce. The admin never reaches the languages, and keeps its plain addresses: `/admin`, never `/es/admin`.
2. **What is not a page goes on with no language:** the admin, `/api` and under it, `/og`, `/_next/`, `/.well-known/`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `favicon.ico`, and every path `isFile` says is the app's own file (its `public/` files, and route handlers at the root such as `/company.json`). An address that only looks like a file, such as `/sw.js`, is a page, and gets the app's own 404.
3. **Every other address is a page**, and next-intl gives it its language: `/pricing` is rewritten to `/en/pricing` behind the scenes, and `/es/pricing` stays as it is. The prefix is a rewrite, never a redirect to another site. The kit does not take next-intl's word for where a rewrite goes: one that would land anywhere but under one of the five languages on this site is answered with a 404.

next-intl makes two redirects, both to the same page on this site: `/en/pricing`, a second address for the English page, goes to `/pricing`, and a prefix in the wrong case, `/ES/pricing`, goes to `/es/pricing`. Both are 307s, as next-intl sends them; nothing links to those addresses. The kit builds each one again as path and query on the app's own `url`, never the request's Host, and refuses with a 404 one that would leave it or that a browser would read as another site (`//host`, `/\host`). Under `next dev` the redirect stays on localhost.

**Two kinds of address never reach next-intl.** One with a `.` or `..` segment once decoded, such as `/%252e%252e/admin`, is a 404: next-intl decodes an address once before it builds its rewrite, and the URL parser then reads `%2e%2e` as `..`, so the rewrite would climb out of the language into the admin, the API or a file, past the kit's own rules, which saw a public page. One with a literal percent sign, such as `/es/100%25`, goes on under its language as it came: next-intl 4.14 would rewrite it to `/es/100%`, which Next answers with a bare 400. No page has a percent sign in its address, so the app answers it with its own 404, as it answers `/sw.js`.

The visitor's `Content-Security-Policy` headers, which Next would take a page's nonce from, and any `X-NEXT-INTL-LOCALE`, never reach a page or route, the admin's included: a page's language comes from its address alone, and the admin's from the account or its cookie. No answer sets a cookie or a `Link` header.

**An address that cannot be decoded** (`/%E0%A4%A`) goes to Next as it came, which answers it with a bare error, unless the app has a page for it: `brokenAddress: (pathname) => '/es/broken-address'`. Then, after the kit's HTTPS and method rules, it gets a 307 to that path on the app's own `url`, the admin's addresses included. A path that would leave the site is refused with a 404, and so is an admin address the app's `brokenAddress` leaves null, since it never got the admin's rules.

A `proxy.ts` with work of its own calls the steps apart: `secureRequest(request, { url }) ?? createLocaleRouting({ url, isFile })(request)`.

## The admin's language

The admin's addresses never change. Its language comes from, in this order:

1. the signed-in account's own language, for an app whose check returns one as `locale` on the user (`platform/admin/README.md`);
2. the admin's language cookie, `__Secure-admin_locale`, which the menu in the admin's header and the row on the sign-in card set;
3. English.

A value that is not one of the five codes, exactly as written, counts as none. The cookie holds a language code and nothing else: `Path=/admin`, `HttpOnly`, `Secure` (which its `__Secure-` name makes the browser insist on), `SameSite=Lax`, a year. Lax rather than Strict, because it grants nothing, and with Strict a link to the admin from an email would open its first page in English.

For the app's own admin pages, which have no `[locale]`, `createRequestConfig` asks `adminLocale` from `admin-locale.ts`, the cookie then English, so their `getTranslations('...')` is in the same language as the kit's. An app whose accounts keep a language passes its own admin's: `adminLocale: () => admin.locale()`. An admin route handler passes the language itself: `getTranslations({ locale: await adminLocale(), namespace })`, or the `locale` that `admin.signedInRoute` and `admin.signedInPost` hand back.

## The kit's own words

`messages/<locale>.json`, English the source, five languages, checked by the kit's own tests and by every app's check. Two parts:

- **For public pages:** `header` (skip link, the mark's name, the nav's name, "(opens in a new tab)", the menu button, the app switcher and its three apps), `breadcrumbs`, `language` (the picker), `copy` (the copy button), `status` (the status badge's "No data"), `footer` (the rights line, its year passed as a string so it is never written 2,026) and `errors` (the 404 and the crash page). An app reads them under `platform`, as `t('platform.header.newTab')`, and hands them to the kit's components as props, as it hands its own.
- **The admin's own words,** under `admin`, which only the admin reads, through its own small translator. They never reach a public page, and an app's admin pages need no provider for the kit's parts.

The kit's Client Components do not read next-intl for their words, so the public pages carry none of its message runtime because of the kit: `SiteHeader`, `LanguagePicker`, `CopyButton` and `GlobalErrorPage` take their words as props. One exception: `Link` from `platform/i18n/navigation` reads the page's language in the browser, so it needs a `NextIntlClientProvider` above it, or every page fails with "No intl context found". Give it one in `app/[locale]/layout.tsx`, with no messages, so no words are sent to the browser:

```tsx
import { NextIntlClientProvider } from 'next-intl'

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={{}}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

A component that reads words with `useTranslations` needs the provider to carry just the messages it uses (see the provider note in step 3). The admin's client components read the admin's words from the admin's own provider, which its layouts put around every admin page.

**Install scripts.** next-intl 4.14.9 pulls in `@parcel/watcher` and `@swc/core`, which have install scripts. Only next-intl's message extractor needs them, and the kit and the apps never run it; the runtime does not. Apps do not approve those install scripts: keep `npm ci --ignore-scripts`, which is how the updater installs on the server, and nothing breaks without them.

**The two error pages with no provider.** `app/[locale]/error.tsx` and `app/global-error.tsx` are in every page's script, and `global-error` renders with no layout. `crash-words.ts` has their words in five languages as plain text, a copy of `errors.crash` that a test holds to the messages; `linkParts` splits the sentence around its link with no ICU runtime:

```tsx
'use client'
import { crashWords, linkParts } from '@/platform/i18n/crash-words'
import { localePath } from '@/platform/i18n/config'

// locale: from the address, as the page has no params here.
const words = crashWords[locale]
const { before, link, after } = linkParts(words.body)
<GlobalErrorPage lang={locale} title={`${words.title} | WSLATL`} heading={words.heading} retryLabel={words.retry} onRetry={reset} homeHref={localePath(locale, '/')} homeLabel={words.home}>
  {before}<a href="/discord" style={globalErrorLinkStyle}>{link}</a>{after}
</GlobalErrorPage>
```

## The picker

`LanguagePicker` leads to the same page in each language, each named in itself and marked with its own `lang` and `hrefLang`, and the page's own marked `aria-current`. Plain links, in a `<details>`, so it works with no JavaScript at all; with script it also closes on Escape and when focus leaves it, as the header's app switcher does. Give it to the header and it is in the bar from 40rem up and at the end of the mobile menu below that:

```tsx
<SiteHeader
  {...header}
  languages={{
    locale,
    label: t('platform.language.label', { language: localeNames[locale] }),
    heading: t('platform.language.heading'),
  }}
/>
```

`path` gives the page's path without its language where the router does not know it, as on a 404. Leave `languages` out for an app in one language.

## SEO

```ts
import { createSeo } from '@/platform/i18n/seo'
import { locales } from '@/platform/i18n/config'

const seo = createSeo(platform.url)

// In generateMetadata, for a page written in all five:
alternates: seo.alternates(locale, '/pricing', locales),
openGraph: { ...seo.openGraph(locale, locales), url: seo.pageUrl(locale, '/pricing'), ... },

// app/sitemap.ts:
export default () => seo.sitemap(pages.map((page) => ({ ...page, languages: locales })))
```

Every call names the languages the page is written in. hreflang lists those, in the order of `locales`, then x-default, the English one (or the first there is, for a page with no English). A page written in fewer, such as a guide nobody has translated, lists fewer; a page shown in a language it is not written in, such as an English guide under `/es/`, is in no set, and the app marks it noindex. The head and the sitemap list the same set, from the same function, so the two always agree. Every address is built on the app's own `url`. The English home page is the bare address, `https://wslatl.com`, as the main website has it, or with its slash for an app that has always written it so: `createSeo(url, { homeSlash: true })`.

## The check

`node platform/tools/i18n-check.mjs`, from the app's root, in CI. It reads `platform.config.mjs`:

```js
i18n: {
  messages: 'messages', // the app's messages/<locale>.json; this is the default
  pages: [
    'content/legal', // the English files, and each language's in content/legal/<locale>/
    { folder: 'content', layout: 'suffix', missing: 'list' }, // each language's beside the English, as <name>.<locale>.mdx
  ],
},
```

It checks the app's messages and the kit's, each language against English, and the long pages, and fails (exit code 1) on:

- a key a language is missing, or one English does not have;
- an ICU argument or rich text tag that differs from English, by name or kind (`{count, plural}` where English has `{count}`, a `<link>` left out, an apostrophe that quotes an argument away);
- a message that is not valid ICU as formatjs, next-intl's parser, reads it (an argument's name with `.`, `-` or `:` in it, a type but number, date, time, plural, select and selectordinal, an option given twice, a `=` option that is no whole number, a plural with no `other`), is not text, or is empty;
- a top-level `platform` key in the app's messages;
- an em dash, an en dash or a middle dot, in a message or a long page;
- a long page with no file in a language, and a translation with no English page. A folder's index (`index.ts`) is no page.

A message left the same as English is only a warning: names, brands and codes stay as they are. So is a missing long page in a folder marked `missing: 'list'`, for pages still being translated, where the English shows, marked `lang="en"`, until then. The tool reads ICU the way formatjs does, with no package of its own, so it runs on plain Node.

A page is a file a page is written in: Markdown, MDX, a module, HTML, text, JSON or YAML. A picture or a font beside the pages is none, and is neither counted nor read. The folders are held to the rules `definePlatformConfig` has for them even when a config skips it, every one must be inside the app, and no link is followed out of it. What the tool prints from the app, a key or a file's name, has its control characters written as escapes, so nothing in a file can fake a line of the CI log or a `::` command to the runner.

## Not machine translation

Translations are written, then read through, never put through a translation widget: one would send every visitor's page to a third party and break the security policy.

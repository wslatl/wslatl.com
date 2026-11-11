# wslatl.com

The public website for WSLATL LLC. Private hosting based in Missouri: VPS hosting, game server hosting, dedicated servers, and web hosting. Built with Next.js 16, React 19, Tailwind v4, and a small set of shadcn/ui primitives. Designed and built by [RejectModders](https://rejectmodders.dev).

---

## What this site does

1. Tells visitors what WSLATL sells, what it costs, and why we are different from the big hosting companies.
2. Publishes plan pricing for VPS and game servers on `/pricing`, with a page per supported game under `/games`.
3. Routes visitors to the right panel (billing, game panel, VPS panel, dedicated portal, cPanel) through the header Login menu and the footer.
4. Hosts the full legal library (ten policies) under `/legal`.
5. Shows our official referral partners on `/partners`, each with a profile page and, if they have one, their referral code.
6. Gives partners and designers the brand kit on `/brand`: the logo to download, the colors to copy, the type, the voice and the rules for using them, with the full kit on Google Drive.
7. Does all of that in English, Spanish, French, German and Portuguese.

Every public page is static. There is no CMS and no database: content lives in `data/*.ts` and `content/legal/*.tsx`, so copy is one PR away.

---

## Where things live

```
app/
  globals.css              Tailwind v4 entry: the kit's tokens and base layer, and the few styles that are this site's own.
  sitemap.ts, robots.ts    Every page in every language, from the same data the pages use.
  manifest.ts              /manifest.webmanifest: the name and icons for a home-screen shortcut.
  company.json/route.ts    /company.json: the company profile for the billing panel, written at build time.
  og/route.tsx             /og: the share card of every page but the home page, drawn on request by the kit (see Images).
  admin/                   The admin, the kit's: one-line files that hand each page and route to platform/admin/ (see Admin and updates).
  [locale]/                Every page, once, for all five languages (see Languages).
    layout.tsx             Root layout: language, the kit's fonts and skip link, default metadata, Organization JSON-LD.
    page.tsx               Home page composition.
    pricing/page.tsx       Pricing: line overviews, plan tables, what's included, how ordering works.
    games/page.tsx         Game directory with search.
    games/[slug]/page.tsx  One page per game, statically generated from data/games.ts.
    legal/page.tsx         Index of every legal document.
    legal/[slug]/page.tsx  Every policy, at /legal/privacy, /legal/terms, and so on.
    partners/page.tsx      Official partners: their cards, the "This could be you" card, the partner program.
    partners/[slug]/page.tsx  One profile per partner, statically generated from data/partners.ts.
    brand/page.tsx         The brand kit: logo and downloads, colors, type, voice, do and don't, and the full kit on Google Drive (see Brand kit).
    not-found.tsx, error.tsx  The 404 and error pages, on the kit's error page with this site's words.

proxy.ts                   The kit's secureRequest first (plain-HTTP visitors to HTTPS, a 405 to every method but GET and HEAD apart from POST on the admin's JSON routes, the admin's nonce), then serves the English tree at the unprefixed URLs.
instrumentation.ts         The kit checks the admin's settings once, as the server starts.

platform/                  The shared kit, a copy of one tagged version, never edited here (see The shared kit): the look (tokens, base styles, fonts, header, footer, page start, banner card, button, copy button, error pages), the admin, the share card drawing with its fonts and lockup, and the email layout.
platform.config.mjs        This site's settings for the kit: its name, address, repository and how the admin signs in.

components/
  ui/                      Primitives: dropdown-menu, section-header, the email link. Buttons and links are the kit's.
  layout/                  The kit's header and footer with this site's links and words, the login menu, the language picker, the page header (the kit's page start with breadcrumb data), legal layout.
  sections/                Home page sections.
  pricing/                 Plan tables and the sticky section switcher.
  games/                   Game directory (the only client-side search on the site).
  legal/                   The blocks every legal document is built from, and the SLA uptime table.
  partners/                Partner cards (on the kit's banner card), the profile's pictures, platform icons, the partner program section.
  brand/                   The sections of the brand kit page, and the icons the header uses.
  seo/json-ld.tsx          Structured data.

config/site.ts             Company details, paths, credits, legal metadata and effective dates.
config/links.json          Where each short link (/billing, /discord, ...) sends people.
config/emails.ts           Our email addresses. Server-only; rendered through <Email>.
config/security-headers.mjs  The security headers and both Content Security Policies (see SECURITY.md).
config/referral.ts         The referral discount percent (first invoice only), which must match the billing panel.
content/legal/             The text of each policy; index.ts maps each document and language to its text.
data/                      Everything else the pages render (see below).
i18n/                      Languages: the current one, the dictionaries, the translations.
lib/                       pricing helpers, pageMetadata(), what each page says about itself (page-text.ts) and the share card's words (share-card.ts), cn() (the kit's) and slugify().
scripts/                   Checks that need a build or a live site (see Automation), keep-old-assets.mjs (see Deploying), home-card.mjs (see Images), brand-kit.mjs (see Brand kit), and serve.mjs with updater/, the kit's updater (see Admin and updates).
tests/                     Vitest suites for data, links, and house style; attack/ and http/ attack the site (see SECURITY.md).
SECURITY.md                How to report a problem, the threat model, and what is left to set up outside the code.
```

---

## Discord ads (share buttons)

Visitors can copy a ready-made Discord post about a page: the footer has "Share our ad" for the whole company, every partner card and profile, game page, the games index, each plan line on /pricing and the partner program have "Copy Discord ad". A Preview button shows the exact text first, and phones that support it also get a Share button.

- The text is built by pure functions in `lib/share.ts` (`homeAd`, `partnerAd`, `gameAd`, `gamesIndexAd`, `productLineAd`, `partnersIndexAd`). They take the site's words and data as arguments and use only what is already on the site: prices come from `data/pricing.ts`, a partner's discount line only appears when they have a code.
- Each ad is Discord markdown: a `## ` title, `### ` headings, `- ` bullets, and the page's full address alone on the last line so Discord shows a link preview. Other links are wrapped in `<angle brackets>` so they do not push that preview out. No mentions are ever written, and a partner's own words are escaped.
- The wording is under `share` in `i18n/copy/*.ts` (all five languages); the ad follows the page's language. Which facts go into the main ad (services, features, commitments) is chosen in `homeAd`.
- Ads are kept under Discord's 2000 character limit: the required lines always stay, optional lines are added only while they fit. `tests/share.test.ts` checks every ad in every language.
- The button is `components/share/share-ad.tsx`; `components/share/ads.tsx` builds the text on the server for each page.

## Single sources of truth

Some facts appear on many pages. Each one is defined exactly once, and everything else derives from it:

| Fact | Defined in | Used by |
| --- | --- | --- |
| Plan names, specs, prices | `data/pricing.ts` | Pricing page, home page, game pages, FAQ answer, meta descriptions |
| Price comparisons with competitors | `data/pricing.ts` (`comparisons`, dated when checked, and the competitor prices and disk sizes behind them in `comparedPrices`, which the tests check every claim against) | Pricing page plan groups, the Minecraft and FiveM pages |
| Uptime targets | `data/sla.ts` | Terms of Service, SLA, Refund Policy, home page commitments, pricing page |
| Legal document titles and dates | `data/legal.ts` and `config/site.ts` | Legal pages, `/legal`, footer, sitemap |
| Games | `data/games.ts` | `/games`, game pages, sitemap |
| Official partners | `data/partners.ts`, with their pictures in `public/partners/<slug>/` | `/partners`, partner profiles, sitemap |
| Brand kit colors, files and Drive folder | `data/brand.ts`, with the files in `public/brand/` | `/brand` |
| Referral discount, and what the partner program may promise | `config/referral.ts` (the percent must match the billing panel) | `/partners`, partner profiles |
| Panel, portal, and profile URLs | `config/links.json` | Every button and link (through short links), redirects, structured data |
| Email addresses | `config/emails.ts` | Every address on the site, through `<Email>` |
| Company profile (owners, story, links, questions) | `lib/company-profile.ts`, built from the files above | `/company.json`, read by the billing panel. Its shape is versioned, so change it with care |

Never type a price, a plan spec, or an uptime figure anywhere else. Format prices with `formatPrice()` from `lib/pricing.ts`.

---

## Pages and metadata

Use `pageMetadata({ title, description, path })` from `lib/metadata.ts` for every new page. It sets the canonical URL and the full Open Graph and Twitter set, share card included (see Images). Next.js replaces a nested `openGraph` object instead of merging it, so hand-written page metadata silently loses the share image. What a page says about itself is written once, in `lib/page-text.ts`, and its `generateMetadata` and its share card both read it from there.

Retired URLs get a permanent redirect in `next.config.mjs`, in the same change that moves the page. The link tests check that every redirect lands on a page that exists. The legal documents moved from the site root to `/legal/...` in September 2026; their old paths (`/privacy`, `/terms`, and so on) redirect, and a test fails if any document loses its redirect. Always link to a legal document through `siteConfig.paths`, never a typed-out path (a test enforces this too).

To add a legal document: add its path to `siteConfig.paths` and its date to `effectiveDates`, add an entry to `data/legal.ts`, write the text in `content/legal/`, and register it in `content/legal/index.ts`. The route, footer link, sitemap entry, and table of contents follow automatically.

---

## Short links

Every link to a panel, portal, or profile goes through a short path on this site: `/billing`, `/register`, `/game-panel`, `/vps-panel`, `/dedicated-portal`, `/cpanel`, `/status`, `/discord`, `/github`, `/trustpilot`, and `/rejectmodders`. Pages link to the path; `next.config.mjs` redirects it to the destination in `config/links.json`.

To change where one goes, edit its `url` in `config/links.json`. Nothing else changes: every button on the site follows, and so does every `wslatl.com/discord` link already shared in a chat or an email. To add one, add an entry there and link to `siteConfig.links.<name>`, or `<ShortLink name="..." />` in running text, which shows the short address itself.

These redirects are temporary (307) on purpose. Browsers cache permanent redirects, so a visitor who clicked once would keep going to an old destination. Tests fail if a short link is permanent, collides with a page, or if a destination URL is typed into a page directly.

---

## Email addresses

Addresses live only in `config/emails.ts` and are rendered with `<Email name="support" />`. The page carries the address scrambled; the browser rebuilds it into a mailto link once a person moves the mouse, touches the screen, scrolls, or presses a key (`lib/presence.ts`). Anything that only reads the HTML, which is how address harvesters work, sees a "Show email address" button and no address. The button also reveals it, which is how screen reader users get to it. Structured data carries no email for the same reason.

`config/emails.ts` imports `server-only`, so importing it from a Client Component fails the build instead of shipping every address in a script. A test fails if an address appears anywhere else in the source.

---

## Languages

The site is published in English, Spanish, French, German and Portuguese. English keeps the plain URLs it has always had (`/pricing`, `/legal/terms`); the others sit under a prefix (`/es/pricing`). Every page lives under `app/[locale]`, `proxy.ts` rewrites an unprefixed path to the English tree without changing the URL, and `/en/...` redirects to the plain address so no page has two.

| Where | What it holds |
| --- | --- |
| `i18n/config.ts` | The languages, their names, and `localePath()` |
| `i18n/locale.ts` | The language of the page being rendered |
| `i18n/copy/` | The words components render, one file per language |
| `i18n/content/` | Translations of the text in `data/`, keyed by id |
| `i18n/error-copy.ts` | The error boundary's words, kept small because it ships with every page |
| `content/legal/<locale>/` | Translated legal documents, registered in `content/legal/index.ts` |

Each language's copy file is typed against English, so a missing or extra key fails the build, and the tests fail if a language is mostly English, loses a `{placeholder}`, or is short an entry from `data/`. Anything without a translation falls back to English rather than rendering blank.

To add a language: add it to `locales` in `i18n/config.ts`, add `i18n/copy/<locale>.ts` and `i18n/content/<locale>.ts`, add its entry to `i18n/error-copy.ts`, and translate the legal documents. Routing, the language picker, hreflang and the sitemap follow automatically.

Prices, plan names, specs (vCPU, NVMe, GB), game titles, people's names and the slogan stay as they are in every language. A Server Component reads the language with `getLocale()`; a Client Component is handed plain strings, since it cannot read it (see `components/layout/site-header.tsx`).

Legal documents in a translation carry a notice that the English version is the one that applies, with a link to it.

---

## Legal documents

Documents are built from a handful of blocks in `components/legal/blocks.tsx`, so all ten look alike: `Callout` (with a tone: note, good, caution, critical), `InfoCard` and `InfoRow` for boxed details, `CompanyContact` for the closing contact card, `Tiers` and `Tier` for rules that step up in severity, and `ScrollTable` around every table. Spacing, lists, links, and bold text come from `LegalSection` and the `.legal-body` styles, so a document should not need class names of its own.

---

## Partners

`/partners` shows our official referral partners. Each one has a profile at `/partners/<slug>` with their banner, picture, description, links, the games they play, and their referral code with a "Sign up with this code" button that opens the billing panel's sign-up page with the code filled in. The code is optional: a partner who is not in the referral program, or who does not want a code shown, is listed without one, and then their card and profile have no code box, no sign-up button and no discount line. The list lives in `data/partners.ts` and starts empty: with no partners, the page leads with a "This could be you" card beside the partner program, and once there are partners that card stays as the last one in the grid.

Every partner is on the home page too, with no step of its own. They are in the trusted clients strip near the top (`clientStrip` in `lib/clients.ts`), as their picture and name, and the featured ones and then the newest get a card in the partners section further down (`homePartners` in `lib/partners.ts`), so a new partner is on the home page from the day they are added. A client in `data/clients.ts` who is also a partner names them with `partner: '<slug>'` and shows once, with their logo. The strip says "Trusted by our clients and partners", which stays true for a partner who is not a client.

The program text only says what the billing panel actually does. Those facts, and the discount percent, are in `config/referral.ts`. The percent must match the referral discount in the billing panel (Settings, Orders), so change both on the same day.

The referral deal, as the site words it: the person who signs up with a code gets the percent off their first invoice for hosting (not dedicated servers) and nothing after that; the person who referred them gets a one-time account credit once that first invoice is paid. Do not write that the discount lasts, applies to every invoice or renewal, or depends on the partner staying in the program. `tests/referral-copy.test.ts` fails if any language says so.

### How to add a partner

Only with the partner's written OK to be shown here. Keep that message (a ticket or a Discord message) in case they ask later.

Taking someone down is two steps on the same day: delete their entry and their folder here, and revoke them as a referrer in the billing panel. Revoking is what stops their code from giving the first-invoice discount and the referral credit from then on. The site does not promise the discount for as long as a partner stays, so no page text changes when someone is taken down.

1. Get from them: their name (60 characters at most), a one-line tagline (80 characters at most), a short description (600 at most), optionally a square picture, a wide banner and their own ad (1,900 at most; see step 4), the links they want shown, the games they play, and their referral code from the billing panel. The code is optional: skip it for a partner who is not in the referral program or does not want one shown.
2. Pictures are optional: skip steps 2 and 3 for a partner who has none yet. Without a picture their card and profile show a circle in our primary blue with their initials, without a banner a plain branded banner of the same shape, and a shared link to their profile shows a share card made for it (see Images). A picture that is given must still pass the checks in step 5. Export the picture as a square WebP, 512px (at least 256px), and the banner as a WebP about 3:1, ideally 1500x500 (at least 1200px wide). PNG and JPEG work too; nothing else is served from `public/partners/` (no SVG, which can carry script). Two things to tell them about the banner:
   - On their profile, their picture sits over the bottom-left corner of the banner, so nothing important should be there.
   - The banner is also the picture a shared link to their profile shows. Many link previews (Facebook, LinkedIn, X) are made for pictures of about 2:1 and crop the left and right ends off a 3:1 banner, so names and logos belong in the middle.
3. Put them in `public/partners/<slug>/`, for example `public/partners/pixel-forge/avatar.webp` and `banner.webp`. The slug and the file names are lowercase letters, digits and hyphens, and the slug becomes the address of their profile. Then run `npm run partners:cards` once the entry in step 4 is in. It makes `avatar-strip.webp`, the 80px copy of the picture that the trusted clients strip on the home page loads, and `banner-card.webp`, the 720x240 copy of the banner that their card on `/partners` and on the home page loads. Their profile and shared links keep the full pictures; full banners on every card would take the page over its 600 KB budget. The tests fail until the copies exist.
4. Add their entry to `partners` in `data/partners.ts`:

   ```ts
   {
     slug: 'pixel-forge',
     name: 'Pixel Forge',
     tagline: 'Modded Minecraft builds and a friendly survival community.',
     description: 'Who they are, in their own words.\n\nA second paragraph.',
     ad: '## Their own ad\n**Discord markdown** works here.', // optional
     avatar: '/partners/pixel-forge/avatar.webp', // optional
     banner: '/partners/pixel-forge/banner.webp', // optional
     referralCode: 'PIXELFORGE',
     since: '2026-10',
     games: ['minecraft', 'terraria'],
     socials: {
       discord: 'https://discord.gg/<invite>',
       youtube: 'https://www.youtube.com/@<handle>',
     },
   },
   ```

   `referralCode` is optional: leave the line out for a partner with no code to show. Do not use an empty string for that, because the tests reject it. `\n\n` in the description starts a new paragraph. `since` is the month they became a partner. `games` are slugs from `data/games.ts` (`'fivem'`) or a game's name (`'Among Us'`). A game with a page here links to it; any other shows as plain text, and links by itself once its game gets a page whose slug is the name in lowercase with hyphens. `socials` takes any of `discord` (an invite, or a profile link such as `https://discord.com/users/<number>`), `youtube`, `tiktok`, `twitch`, `kick`, `x`, `instagram`, `steam`, `github` and `website`, as full https links. Add `featured: true` to show someone first. To give the tagline, description or ad in other languages, use an object instead of a string, `{ en: '...', es: '...' }`; a language left out shows the English.

   `ad` is for a partner who wants their own ad: it is what the share button on their profile copies, in place of the one the site writes for them. Leave it out and the site writes it, as before. It is Discord's markdown, with `\n` for a new line, up to 1,900 characters. Their profile's address goes on the end by itself, so the ad still brings people there and Discord shows the preview, and anything that would ping a server when it is pasted (`@everyone`, `@here`, `<@id>`) is taken out. Read it before adding it, since it goes out from our site: the tests stop a promise of a discount past the first invoice, and an em dash, which has to be swapped for other punctuation.
5. Run `npm test`. It checks every entry: each link is a plain https:// address on that platform's own site, slugs and codes are unique, a code (when there is one) is A to Z and 0 to 9 and at most 32 characters (as the billing panel stores them), the lengths, the month, the games, and that each picture that is given is a WebP, PNG or JPEG files directly in their folder, in the right shapes. The profile page, its sitemap entry and its share picture all follow from the entry.

`public/partners/` shares its name with the pages, so `i18n/routing.ts` serves only WebP, PNG and JPEG pictures from it as files (`sharedDirectories` and `partnerImageTypes`); every other path under `/partners/` is a page and gets a language like any other. A test fails if anything else is put in that folder.

---

## Brand kit

`/brand` is our own page for the WSLATL brand kit, in all five languages: the logo to download, the colors to copy, the type, the voice, and the do and don't, with the full kit one click away on Google Drive (`fullKitUrl` in `data/brand.ts`). It follows the kit's guide: the mark once near the top, on a solid surface, which is the header's (the page adds only the four specimens on white and on Ink that it is about), the brand gradient only as a bar, and no color on its own.

**Where the files come from.** The kit is a folder, `Brand Kit/`, with the guide, its diagrams in `assets/` and the logo files in `assets/logo-png/`. Nothing on the page is drawn by hand:

- `public/brand/downloads/`: eight PNGs copied byte for byte from `assets/logo-png/` (the mark at 64, 128, 256, 512 and 1024 px, the lockup at 1500x500, 1200x630 and 960x540).
- `public/brand/kit-*.webp`: WebP at twice the size they show at. The mark and the lockup are the kit's PNGs, resized. The clear space, minimum size and do-and-don't diagrams are cropped to the figure: the guide's titles and captions are English text inside the picture and cannot be translated, so the page says the same in words, and the do-and-don't diagram is its six pictures with their labels written under them.
- `data/brand.ts` and `i18n/copy/*.ts` (under `brand`): the guide's colors, examples and words.

The kit's two SVG files only wrap pictures, so they stay on Drive (`i18n/routing.ts` serves no SVG from `public/`, because one opened directly can carry script), and `logo-png/profile/` is not used.

**When the kit changes:** download it and run `npm run brand:images -- "path/to/Brand Kit"` (`scripts/brand-kit.mjs`), which copies the downloads and makes the WebP files again. If a color, a size or an example changed in the guide, change `data/brand.ts` and the words in every `i18n/copy/<locale>.ts`; if the Drive folder moved, change `fullKitUrl`; if a diagram changed shape, adjust its crop in the script and its size in `data/brand.ts`. `tests/brand.test.ts` fails until each file is twice the size it shows at. Then run `npm run check`.

Two of the voice examples hold figures, so they come from `data/pricing.ts` and `data/sla.ts` like every other figure on the site. The guide's line for new VPS plans says "$5.91/mo" beside the Ryzen 9 and NVMe, but $5.91 is the cheapest Budget plan (Intel i7, SATA SSD), so the page quotes what the Premium plans cost.

---

## Search engines

- **Site name.** Google shows "WSLATL" as the site's name in results. It reads that from the `WebSite` structured data, which only the English home page carries (Google ignores it anywhere else), and from `application-name` and `og:site_name`. All three come from `siteConfig.brand`, and every title ends with it. The `Organization` data on every page has the legal name, "WSLATL LLC", with "WSLATL" as an `alternateName`, so the two read as one brand.
- **Titles and descriptions.** The home page title starts with the brand. Game pages say the game and the real starting price, in the words people search with in each language ("DayZ Server mieten", "hébergement de serveur"). Prices come from `data/pricing.ts`, never typed. `tests/seo.test.ts` checks the brand and that no two game pages share a title.
- **Sitemap.** It has no `lastmod`. Google only trusts that date when it is accurate every time, and a build date on every page teaches it to ignore the field. Add one back only with a real per-page date.
- **Link previews.** Every page but the home page is shared with a card of its own, drawn by `/og` in the page's language from the same title and description the page gives search engines. The home page keeps `public/og-image.png`, and a partner with a banner is shared with the banner. See Images.
- **Icons.** See Images.

## Images

`images.unoptimized` is on, so every file in `public/` is served as-is. Export images at twice their display size before adding them: client logos are trimmed WebP at 96px tall, team photos are 192px square WebP. Partner pictures go in `public/partners/<slug>/` (see Partners), and the brand kit page's pictures in `public/brand/` (see Brand kit). `public/og-image.png` (1200x630) is the home page's share picture, drawn by `npm run home:card` (`scripts/home-card.mjs`) from the share cards' fonts and lockup in the kit's `platform/assets/`; run it again after a change to the slogan or the branding. Every other page has a card drawn on request (see Share cards below).

The icons are the WSLATL mark from the brand kit (`assets/logo-png/logo/`), used as it ships: three panels, cyan to violet, on a transparent background. Its colours read on a white results page, in a light browser tab and on dark, so the icons need no tile. `favicon.ico` holds the kit's own 16, 32 and 48px marks as classic 32-bit bitmaps (the form every ICO reader takes, rather than PNGs inside the ICO), `favicon.png` is its 64px one, `icon-192.png` is the one Google uses beside results (it takes PNG or ICO, not SVG, square and larger than 48px), and `icon-512.png` is for the web app manifest. Two icons may not be transparent, so they put the mark on the brand's Ink tile (`#0F090B`) with room around it: `apple-icon.png` (180px; iOS fills transparency with black and rounds the corners) and `icon-maskable-512.png` (the mark inside the centre 80% that Android's masks keep). The logo ships as pictures only (its SVG files just wrap pictures), so there is no `favicon.svg`; its old address redirects to `icon-192.png`. `logo.png` (the 512px mark) is the logo in the `Organization` data. `tests/seo.test.ts` checks their sizes and that the two tiles have no transparency. Each one must also be listed in `rootFiles` in `i18n/routing.ts`.

The header shows the mark alone at 32px, the smallest the brand kit allows in a header: the shared kit's `Logo` (`platform/components/logo.tsx`), the brand kit's own 32px mark with its 64px copy for sharper screens, the same in every WSLATL app. `public/brand/wslatl-mark.webp`, the 96px mark the header used before, stays at its address for anything that links to it. The brand kit asks for the mark once per page, near the top, on a solid surface, so the header is opaque and the footer has no logo. The share images carry the full lockup (the mark, "WSLATL" and "Private Hosting", from `assets/logo-png/banner/`) on solid Ink, with the brand gradient only as an accent bar along the bottom. The kit's other rules: the name is artwork, so never set "WSLATL" in type beside the mark; keep clear space of about 18% of the mark's height on every side; the lockup is never under 190px wide; and never recolour, stretch, outline or rebuild the logo.

### Share cards

Every page but the home page has a share card of its own, drawn by the shared kit (`platform/og/`, whose README has the details) through `app/og/route.tsx`, and addressed by page: `/og?path=/games/minecraft&locale=es`. `pageMetadata()` points the page's Open Graph and Twitter image at it, with the page's title as the alt text, so a link on Discord, X or Slack shows that page's title and description in its language, and a game page also shows the game's name above its title. The home page keeps `public/og-image.png`, and a partner who gave a banner is shared with it.

- **It can only say what the site says.** The route looks the words up from the page itself (`lib/share-card.ts`), through the same functions the page's `generateMetadata` reads its title and description from (`lib/page-text.ts`). So a card and its page cannot disagree, a link cannot be made to show other words, and a path that is not a page, or a language that is not ours, is a 404. Cards are kept for a day (`Cache-Control: public, max-age=86400`), so a changed title or price shows on its card within a day. A preview Discord or X already made keeps the old card until they refresh it.
- **To give a new page its words,** add a function for it to `lib/page-text.ts` (it takes the language), build the page's metadata from it (`pageMetadata({ ...pricingText(locale), path: '/pricing', locale })`), and add a line for its path to `shareCardText()` in `lib/share-card.ts`. `tests/share-card.test.ts` fails for any page in the sitemap that has no words or does not point at its card, and for a page it has no metadata function for, which is added to `metadataOf()` there.
- **The lockup comes from the brand kit.** `platform/assets/brand/wslatl-lockup.png` is the brand kit's `assets/logo-png/banner/wslatl-banner-1920x600.png`, trimmed of its transparent margin and resized to 448x128, twice the 224x64 it is drawn at. It is the shared kit's file, so a change to it is made in the kit. Never recolour or stretch it.
- **The rest follows the brand kit too:** 1200x630 on solid Ink `#0F090B`, the title in Geist 700 (Paper `#F1EDEE`), an optional line above it in Instrument Serif italic (`#48C5FF`), the description in Geist 400 (Muted `#9A8A8F`), `wslatl.com` bottom right, and the gradient as an 8px bar along the very bottom edge with nothing on it. The fonts are static instances in `platform/assets/fonts/`, credited in `CREDITS.md`; the renderer cannot read the variable Geist. They are cut down to Latin letters, and a test fails if a page's words need a character they lack.
- **Every WSLATL app draws the same card.** The drawing is the shared kit's, so a link to any of the sites looks alike, and a change to the design is made once, in the kit.
- **Each card is drawn once per server start.** The route keeps the cards it draws in memory, by language and page, up to 500, and answers later requests from there. Only a real page gets that far, and the site has fewer than that. A new release starts a new process, so it draws its cards again with its own words.
- **`npm run check:site` checks them on the live site:** one page of each kind has to name a share picture that loads.

---

## Deploying

`npm run build` keeps the stylesheets and scripts of earlier builds for 30 days (`scripts/keep-old-assets.mjs`, run before and after `next build` as `prebuild` and `postbuild`). Every build renames them, because their names carry a hash of their content, and `next build` deletes the old ones. Google fetches a page's HTML on one day and renders it later with the files that HTML names, so without the old files it renders the page without its stylesheet. The kept files wait in `.next-static-history/` (gitignored); delete that folder only to start fresh. After each build they are put back beside the new build's own files, and listed in `.next/restored-assets.json`, so the next build counts only its own files as live and the old ones go 30 days after they were last live.

Production runs `npm run serve` (see Admin and updates), which installs published GitHub releases (see Releasing) and builds each one with `npm run build`, every one sharing the `.next-static-history/` beside `.env` (`STATIC_HISTORY_DIR`). A build by hand must use `npm run build` too, not `npx next build`, and keep `.next-static-history/` between restarts.

## Releasing

The live site only ever runs a published GitHub release. Merging into `main` changes nothing on the server by itself.

1. Merge the pull request into `main`.
2. Publish a release of `main`, tagged with the next version in the form `vMAJOR.MINOR.PATCH`: a fix raises the last number (v1.4.1), something new the middle one (v1.5.0), a big change the first (v2.0.0). On GitHub: Releases, Draft a new release, type the new tag, pick `main` as the target, Generate release notes, Publish release. Or from a terminal: `gh release create v1.5.0 --target main --generate-notes`. The version in `package.json` must be the same number as the tag (v1.5.0 needs `"version": "1.5.0"`), set in a pull request merged before you publish, because the updater reads the installed version from it. The Release check workflow tests this and the points above right after you publish, and opens an issue saying what to fix if anything is wrong.
3. Open `wslatl.com/admin` and press **Install v1.5.0**.

The dashboard offers a release only when it is GitHub's latest release (never a draft or a pre-release), its tag is a version, and that version is newer than the installed one, compared as numbers (v1.10.0 is newer than v1.9.0). A tag in any other form is refused with a message saying so. To hold a release back from the site, publish it as a pre-release.

When you press Install, the updater asks GitHub once which commit the tag points at and builds exactly that commit, so a tag moved halfway through an update changes nothing. If the repository's settings offer immutable releases (Settings, General, Releases), turn them on as well: a published release's tag can then never be moved at all.

## The shared kit

`platform/` is a copy of one tagged version of WSLATL's shared kit, from the private repository `wslatl/platform`, and so are `scripts/serve.mjs` and `scripts/updater/`. The look (colours, type, header, footer, page start, banner card, buttons, error pages), the admin, the share cards and the updater come from it, so WSLATL's apps cannot drift apart. `platform/VERSION` says which version this is, and `platform/MANIFEST.json` holds a hash of every file.

- **Never edit them here.** Change the kit, release a new kit version, then sync. `npm run platform:check` fails, in CI too, when a kit file differs from its version, when a file was added inside `platform/`, or when a package falls behind the kit's versions.
- **To move to a new version,** with the kit's repository cloned beside this one: `npm run platform:sync -- v0.2.0` on a branch, then `npm run check`, then a pull request. It reads the version from its tag in the clone, with no network.
- **This site's settings for it** are in `platform.config.mjs`: its name, address and repository, and how the admin signs in. It has no `updater` settings, so the updater does what this site's always did.
- **Where to look:** `platform/components/README.md` (the look, with an example of each component), `platform/admin/README.md` (the admin, and the Cloudflare and server settings left for the owner) and `platform/og/README.md` (the share cards).

## Admin and updates

`/admin` updates the site from GitHub, and that is all it does: sign in, see which release is installed and which is the latest, read what the latest one brings, press **Install**, and watch each step. It is the shared kit's admin (`platform/admin/`, whose README says everything it keeps to), the same in every WSLATL app. It looks like the brand kit: its exact colours (`platform/admin/admin.css`), Geist with Geist Mono for tags and the log, the mark once at the top, and every state in words as well as colour. It is English only, outside the language routing, never indexed (a robots meta tag and an `X-Robots-Tag` header), and not in the sitemap. robots.txt leaves it out on purpose: a line there would only point at it, and a disallowed page is never fetched, so its noindex would never be seen. There is no database: the settings are in `.env`, and the code comes from GitHub releases.

### How an update works

`npm run serve` (`scripts/serve.mjs`) is the server's startup command. It runs `next start`, starts it again if it stops, and does the updating, since a running Next server cannot replace itself. It and `scripts/updater/` are the shared kit's: this site's own updater, with the knowledge base's fixes, the same in every WSLATL app. What follows describes the kit's. A server keeps running the updater it started with until **Copy the new updater** is pressed and the server restarted (see When something goes wrong), so until then it runs the site's old one, which ignores `UPDATE_STEP_MINUTES`, unpacks a download with the system's tar, and logs "The admin is off" when `GITHUB_TOKEN` is missing, although the kit's admin stays on with updates off. **Install** writes `.updater/request.json`, and within two seconds the supervisor:

1. **Download**: asks GitHub for the latest release, checks that its tag is a version newer than the installed one (see Releasing), asks which commit the tag points at (as `tags/<tag>`, so a branch of the same name is never taken for it), and downloads exactly that commit into `.updater/releases/<tag>/` (named by tag, since two releases may tag the same commit). The updater unpacks it itself, not with the system's tar, and takes plain files and folders inside the release alone: a link, a device, an absolute path or a way up and out stops the update. Every file of the download is then checked against GitHub's own record of that commit (its tree, with the git hash of each file, from the API rather than the download servers), and the release is refused if a file differs, is missing, or is one the commit does not have (`scripts/updater/github.mjs`).
2. **Install**: runs `npm ci --ignore-scripts` there.
3. **Build**: runs `npm run build` there, with the live build's own assets copied in (not the old ones put back beside them) and the one shared `.next-static-history/`, so old hashed assets survive exactly as they do in a build by hand (see Deploying).
4. **Clean up** (`prune` in the code): deletes from the release what production never uses (`devOnlyPaths` in `scripts/updater/dev-files.mjs`): `tests/`, `.github/`, `.vscode/`, `coverage/`, `lighthouse-reports/`, the Vitest, ESLint, Oxlint, gitleaks, Lighthouse and lychee configs, `tsconfig.tsbuildinfo` and `.next/cache/`. Then `npm prune --omit=dev --ignore-scripts` removes the devDependencies (Tailwind, PostCSS, TypeScript, ESLint, Oxlint, Vitest and what they pull in), which only the build and the checks use. Everything the site and the updater read stays: the rest of `.next/`, `public/`, `package.json`, `package-lock.json`, the production packages, `next.config.mjs` with the files it imports (`next start` loads it too: `config/links.json`, `config/security-headers.mjs` and `platform/admin/next.mjs`), `platform.config.mjs` and all of `platform/`, and all of `scripts/`, which the updater compares with the uploaded folder's. `tests/updater-prune.test.ts` checks the list against what this site reads. A file that cannot be deleted is logged and left.
5. **Trial start**: starts the pruned build on a spare local port and waits for its home page to answer, so a release that still needs something the prune removed never goes live. Until here, the live site has not been touched.
6. **Switch**: stops the live server and starts the new build on the real port. If it does not answer within two minutes, the release before it starts again (rolled back).

A failure at any step leaves the site on the version it had, removes the half-built release, and shows the reason and the log on the dashboard. The install, the build and `npm prune` each get 15 minutes (`UPDATE_STEP_MINUTES` in `.env` changes that), after which they are stopped together with everything they started. The build of the uploaded folder at start-up has no limit, as before the supervisor: stopped, it would only start over when the server starts again. The site is down only for the few seconds of the switch. `.env` and `.next-static-history/` are never touched.

At every start and after every update and rollback, the supervisor writes the live release's version into the uploaded folder's `package.json`, so the file you see in the panel says what is running. Only that value changes.

At every start, the supervisor also deletes the same files from the uploaded folder, apart from `.next/cache/`. It never touches that folder's `node_modules`, `.next`, `.env`, `.next-static-history/`, `scripts/` or `.updater/`: the build at start-up needs the devDependencies, and the uploaded folder may be what serves. A folder that is a git checkout (it holds `.git`), such as a clone you try `npm run serve` in, keeps every file: its releases are still pruned.

A new release is watched for ten minutes after its switch, across a restart of the server too: if it stops three times in that time, the supervisor goes back to the release before it by itself, and the dashboard says so. When there is none left (each update removes it to make room, so after an update the only earlier build is the uploaded folder), it goes back to the uploaded folder instead and says that this may be an older version. Otherwise the supervisor starts `next start` again whenever it stops, waiting a little longer each time.

**Disk space.** The live release and the one before it are kept and older ones deleted, and when the next update starts, every release but the live one is removed (the one before it, and one a crash took back out). So at most three copies of the site are on the disk at once: the uploaded folder, the live release and the new one. A release holds about 750 MB once it is built, and about 530 MB after the prune step (step 4), which runs before its trial start, so the trial proves the pruned release still starts. The uploaded folder keeps its full `node_modules` and build, about 750 MB, since it is built at start-up while no release is installed and the build tools are devDependencies; at every start it loses only the files on the same list (see above). npm's download cache, about 140 MB, lives in `.updater/npm-cache/` only while an update runs, and is deleted after it. That makes about 1.8 GB between updates, and about 2.2 GB at the most, while a new release builds beside the live one. Give the server a disk limit of at least 4 GB: Pterodactyl stops a server that goes over its limit, and does not start it again until it is back under.

The supervisor reports through `.updater/state.json`, which the dashboard reads. The site itself keeps one file there too, `.updater/ended-sessions.json`: the sessions a sign-out ended, until they would have expired anyway, so a restart does not bring one back. The settings in `.env` are given to `next start` alone: the updater's `npm ci`, every build and its `npm prune` get none of them, and the build of the uploaded folder at start-up sees each of them empty. The GitHub token reaches only the live site, whose admin reads the releases with it, and is hidden in every line the updater writes. `npm ci` also skips install scripts, which is where a compromised package usually strikes (the site needs none: sharp and the compilers ship prebuilt). A build still runs the site's own code and its build tools, exactly as a build by hand does. The console logs each login and failed login with the visitor's address, each update request, and each step of an update.

### One-time setup on Pterodactyl

1. **Upload this version by hand, one last time**, the way you do now. Keep `.env` and `.next-static-history/`.
2. **Make a GitHub token.** On GitHub: Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token. Resource owner `wslatl`. Repository access: Only select repositories, `wslatl/wslatl.com`. Repository permissions: Contents, Read-only (Metadata, Read-only comes with it). Nothing else. Give it an expiry and note the date: once it expires, the dashboard says GitHub refused the token, and you make a new one.
3. **Make the password hash.** On your own computer, in a copy of this repository, run `npm run admin:hash`. It asks for the password twice (12 characters or more, not shown as you type) and prints an `ADMIN_PASSWORD_HASH=` line and an `ADMIN_SESSION_SECRET=` line.
4. **Fill in `.env`** in the server's folder, beside `package.json`, with `.env.example` as the template: the two lines from step 3, `GITHUB_TOKEN=` with the token, and `GITHUB_REPO` only if it is not `wslatl/wslatl.com`.
5. **Change the startup command** on the server's Startup tab, from `npm run build && npm start` to `npm run serve`. If the field is locked, a panel admin can change it under Admin, Servers, the server, Startup. It listens on `SERVER_PORT`, which Pterodactyl sets to the server's port (then `PORT`, then 3000).
6. **Restart the server.** The console says `The admin is on at /admin.` and `Updates install the latest release of wslatl/wslatl.com.`, or which setting is missing. Until the first update, every start builds the uploaded folder first (a minute or two), as the old startup command did. Open `wslatl.com/admin` and sign in.
7. **Put `/admin` behind Cloudflare Access** (strongly recommended). The login allows 30 attempts per 15 minutes in all, which stops password guessing, but anyone with a handful of addresses can use them up and keep you locked out. With Access in front, nobody else reaches the login at all. In the Cloudflare dashboard: Zero Trust, Access, Applications, Add an application, Self-hosted. Application domain `wslatl.com`, path `admin` (everything under `/admin` is covered). Add a policy: action Allow, include Emails, your own address. Save. `/admin` then asks for a one-time code sent to that address before the login page appears. If you would rather not use Access, a WAF custom rule does most of it: Security, WAF, Custom rules, block when the URI path starts with `/admin` and the IP source address is not yours (this needs an address that does not change).

From then on, a change reaches the site as a release: see Releasing.

### When something goes wrong

- **`/admin` answers 404.** The admin is off because `ADMIN_PASSWORD_HASH` or `ADMIN_SESSION_SECRET` is missing or malformed. The console says which, at startup and on the first visit to `/admin`.
- **The Updates page says updates are off.** `GITHUB_TOKEN` is missing, or `GITHUB_REPO` or `GITHUB_API_URL` is not right; the page says which. Signing in and the rest of the admin still work. Fix it in `.env` and restart.
- **The dashboard says the site was not started with `npm run serve`.** The startup command is still the old one (step 5).
- **An update failed.** The dashboard shows the step, the reason and the log, and the site is unchanged. Fix the problem, publish a new release, and install that.
- **Nothing to install.** The dashboard says why: no release is published yet, the latest release is the installed one, the release marked latest is older than the installed one, or its tag is not in the form `vMAJOR.MINOR.PATCH`.
- **The dashboard says the updater itself changed.** `scripts/serve.mjs` and `scripts/updater/` always run from the uploaded folder, so a release that changes them takes effect only once they are copied over: press **Copy the new updater** on that notice, then restart the server from the panel. The notice goes at that restart. The button copies both from `.updater/releases/<tag>/scripts/` into the server's `scripts/` folder and keeps what was there in `.updater/updater-backup/`, so a bad updater can be put back by hand. It copies at most ten times an hour. No release replaces the updater by itself, because it is what rolls a bad release back. Without the button, put `cp -f .updater/releases/<tag>/scripts/serve.mjs scripts/serve.mjs; cp -rf .updater/releases/<tag>/scripts/updater/. scripts/updater/;` in front of the startup command, restart once, and take it off again.
- **Going back to uploading by hand.** Once an update has run, the site is served from `.updater/releases/`, so files uploaded to the server's folder are not served. Stop the server, delete the `.updater/` folder (never `.env` or `.next-static-history/`), and start it again: it builds the uploaded folder and serves it.
- **Logging everyone out.** Change `ADMIN_SESSION_SECRET` or the password, and restart. A session lasts two hours anyway, and **Sign out** ends its own session for good, a copy of the cookie included.
- **An update failed with "The download does not match commit ...".** What arrived from GitHub's download servers is not what GitHub's API says the commit holds, so nothing was installed. Try again later; if it keeps happening, do not install that release, and look at it on GitHub. A `.gitattributes` line with `export-ignore` or `export-subst` also changes the download, and is not supported. A download that holds a link, or a name that leads out of its folder, is refused before that, with "The download holds ...".
- **A new release went back by itself.** It stopped three times within ten minutes of its switch; the dashboard says so, and the console has its errors. That release is not offered again: fix it, publish the fix as a newer release, and install that.
- **`.updater/state.json` is damaged.** The console says so at start-up. The site then runs from the uploaded folder, and no release is deleted until an update writes the file again.

**The server console** (Pterodactyl's Console tab) takes these commands: `status` (what is serving, and what the updater last did), `update` (install the latest release, as the dashboard does), `rollback` (back to the release before the live one), `rollback upload` (back to the uploaded folder, when no release before is left: it may be much older), `restart` (start the live server again) and `stop`. While the server starts (and builds the uploaded folder) and while an update or a rollback runs, the commands that move the site wait for it to finish.

### How it is kept safe

- **Login.** The password is checked against an scrypt hash in constant time. Each address gets 5 attempts and everyone together 30 per 15 minutes, counted before the password is checked, and at most two checks run at once. Your own successful logins give their attempt back. The address is Cloudflare's `CF-Connecting-IP` and nothing else: `X-Forwarded-For` says whatever the visitor wants, so it is never read, and a request without a valid `CF-Connecting-IP` counts as one address, with all the others like it. A browser that has signed in before carries a device cookie (`admin_device`, `platform/admin/server/device.ts`, after OWASP's device cookies): signed by the site, HttpOnly, Secure, SameSite=Strict, Path=/admin, for 180 days, renewed at every sign-in and kept on sign-out. Its attempts count on their own, 5 per 15 minutes, instead of against the 30, so a flood of guesses from elsewhere cannot keep you out. A cookie the site did not sign counts as none, so does one more than 180 days old (its id carries the time it was made), and changing the password ends every device's standing.
- **Only four routes take a POST:** `/admin/api/login`, `/admin/api/logout`, `/admin/api/update` and `/admin/api/adopt-updater` (`adminPostRoutes` in the kit's `platform/admin/proxy.ts`).
- **Session.** A signed cookie, `__Host-wslatl_admin`: HttpOnly, Secure, SameSite=Strict, Path=/, two hours. The `__Host-` name makes the browser keep it only like that, with no Domain, so no other site under wslatl.com can set or replace it. Its key comes from the session secret (32 characters at least, checked when the server starts) and the password hash together, and only the one spelling the server writes is accepted. Each session has an id of its own, and **Sign out** ends it for good: a copy of the cookie stops working too, across a restart under `npm run serve` (`.updater/ended-sessions.json`).
- **Every POST** must come from a page on this site (the `Origin` matches the host, and `Sec-Fetch-Site`, when sent, is `same-origin`), as JSON, and at most 4 KB. The status route refuses a read sent from another site the same way. The kit's `secureRequest`, first in `proxy.ts`, answers every other POST with a 405. `tests/proxy.test.ts` checks that each file in `app/admin/api/` hands the request straight to the kit's route of the same name, and `tests/attack/admin-routes.test.ts` sends the attacks.
- **Its own Content Security Policy.** The admin's pages are rendered for each request, so the kit's proxy gives each one a fresh nonce, and they run no inline script or style without it (`adminPolicy` in `platform/admin/proxy.ts`; `config/security-headers.mjs` says why the public pages cannot do the same).
- **HTTPS.** A visitor who reaches Cloudflare over plain HTTP (its `CF-Visitor` header says so) is sent to the same address on HTTPS before anything is answered.
- **Secrets** are read on the server, on each request, in the kit's `server-only` modules. `tests/admin-secrets.test.ts` keeps them away from client components, and `npm run scan:build` fails if a secret from `.env`, a password hash or a GitHub token turns up anywhere in the build. CI builds with made-up values in `.env` to prove it. The token goes to GitHub's API over HTTPS and nowhere else: with any other `GITHUB_API_URL`, updates stay off and the token goes nowhere.
- **Attack tests.** `tests/attack/` and `tests/http/` try each of these from outside, by request and response, and SECURITY.md has the threat model, which test covers what, and what is left to set up outside the code.
- **Release notes** come from GitHub and show on a page that holds the session, so they are never taken as HTML. `platform/admin/components/release-notes.tsx` reads their Markdown itself and builds React elements from it: every piece of text reaches the page escaped, raw HTML included, and a link goes only to an https, http or mailto address. Any other link (`javascript:`, `data:`, a relative path) shows as its text, and an image as its alt text. The kit's own tests render our own notes, GitHub's generated ones, and a list of attacks.
- **If a setting that signing in needs is missing,** the admin is off. It never runs open. Without the GitHub settings it is on, with updates off.
- **Lockouts.** The overall limit stops the password being guessed however many addresses are used, and its flip side is that anyone with a handful of addresses (one IPv6 network holds hundreds) can use it up and keep the login locked for a browser with no device cookie: a new one, or any after the password changes. The per-address limit cannot prevent that: it reads Cloudflare's `CF-Connecting-IP`, which anyone who reaches the server's port directly can make up, so it is only trustworthy once the server's port accepts connections from Cloudflare's addresses alone (or a Cloudflare Tunnel is used). Cloudflare Access in front of `/admin` (setup step 7) closes it.

| File | What it holds |
| --- | --- |
| `app/admin/` | One-line files that hand the sign-in page, the Updates page, the 404 and crash pages, and the JSON routes under `api/` (login, logout, update, adopt-updater) to the kit |
| `platform/admin/` | The kit's admin: the sign-in card, the Updates page with its update panel and release notes, the notices, the routes, and on the server the settings, password hashing, sessions and the sessions a sign-out ended, rate limits, request checks, GitHub, and the Updates page's side of the updater. Its README says what it keeps to |
| `platform.config.mjs` | The site's settings for the kit: its name, address and repository, and `admin.auth` |
| `scripts/serve.mjs` | The supervisor, `npm run serve` (the kit's) |
| `scripts/updater/` | The kit's update steps and the `.updater/` layout (`lib.mjs`), GitHub and the check of each download against it (`github.mjs`), the unpacking (`tarball.mjs`), the version rule (`release.mjs`), what production never uses and its deleting (`dev-files.mjs`), the settings each process is given (`env.mjs`), the live server and its crash watch (`live.mjs`) and child processes (`process.mjs`). Its unit tests are in the kit's repository; `tests/attack/` tries it as this site runs it |
| `platform/admin/hash-password.mjs` | `npm run admin:hash` |
| `.env.example` | Every setting, with what it does |

The admin and the updater are the shared kit's, the same in WSLATL's other apps, so each is set up the same way.


## Local development

You need Node.js 20.9 or newer (CI uses 22). npm is the package manager.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Pass a port with `npm run dev -- -p 3002` if something else is on 3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run serve` | Serve it under the updater, the server's startup command (see Admin and updates) |
| `npm run admin:hash` | Make the admin password hash and session secret for `.env` |
| `npm run platform:sync -- <version>` | Put a version of the shared kit in place (see The shared kit) |
| `npm run platform:check` | Fails if a kit file was edited here, or a package is behind the kit's versions |
| `npm run brand:images -- "<kit folder>"` | Bring the brand kit's logo downloads and page pictures into `public/brand/` (see Brand kit) |
| `npm run lint` | Oxlint, then ESLint with the Next.js core-web-vitals and TypeScript rules |
| `npm run lint:fix` | Same, applying the safe automatic fixes |
| `npm test` | Vitest: pricing invariants, link integrity, redirects, legal data, a no-em-dash check, and the attack tests in `tests/attack/` (SECURITY.md) |
| `npm run test:http` | The attack tests against the build, run by `next start` (`tests/http/`); run after a build |
| `npm run typecheck` | `tsc` (TypeScript 7) against the whole project; run after a build |
| `npm run scan:build` | Fails if an email address reached what the site serves, an admin secret reached any of the build, or a page in the sitemap is no longer prerendered |
| `npm run check:site <url>` | Checks a running site: pages, headers, redirects, short links, certificate |
| `npm run check:seo <url>` | Checks what search engines read from a running site: titles, descriptions, canonicals, hreflang, sitemap, robots.txt, share cards, headings, structured data |
| `npm run check:security <url>` | Checks a running site's security from outside, passively: every header, cookie flags, HTTPS and TLS |
| `npm run check` | Lint, test, build, scan, the attack tests against the build, typecheck, in the order CI runs them |

Linting runs in two passes. [Oxlint](https://oxc.rs/docs/guide/usage/linter) goes first and does most of the work in well under a second (config in `.oxlintrc.json`: correctness rules fail the lint, suspicious patterns warn). ESLint then covers only what Oxlint cannot check yet, mainly the React Compiler hook rules and the rest of the Next.js set; `eslint-plugin-oxlint` switches off every ESLint rule Oxlint already runs, so nothing is reported twice. To silence a rule on one line, use an `oxlint-disable-next-line` comment with a reason.

TypeScript 7 provides `tsc`. The `typescript` package is aliased to `@typescript/typescript6` because ESLint's TypeScript parser still needs the TypeScript 6 API. ESLint stays on 9.x until `eslint-plugin-react` supports 10.

`package.json` carries two `overrides`, both for the Security audit. `sharp` needs 0.35.5 or newer, which fixes an advisory in the image library Next.js bundles. `@next/eslint-plugin-next` (the lint rules inside `eslint-config-next`) gets `tinyglobby` in place of its `fast-glob`: `fast-glob` pulls in `braces`, which has a high-severity advisory and no fixed release, and the plugin only calls `globSync` with one option, which `tinyglobby` also has (Vitest already installs it). Remove that override once `eslint-config-next` stops depending on `fast-glob`, then run `npm audit` to confirm the tree is still clean.

The Node.js version lives in `.nvmrc`; every workflow reads it from there.

---

## Automation

| Workflow | Runs | What it does when it fails |
| --- | --- | --- |
| CI | Every push and pull request | The kit check, lint, tests (the attack tests included), build, email and secret scan, the attack tests against the build, typecheck. Red check on the commit. |
| Security | Every push and pull request; the live check on Mondays | gitleaks over every commit, and OWASP ZAP's baseline scan of a build, failing on medium risk or worse (reviewed exceptions in `.github/zap/rules.tsv`). Every Monday it also checks wslatl.com's headers, cookies and TLS from outside, GET requests only, and keeps one issue open while that fails. SECURITY.md has the rest. |
| Outdated packages | Mondays | Keeps one issue listing packages with newer versions. It closes itself once everything is current. |
| Security audit | Daily, and on dependency changes | Fails on a known vulnerability or a bad registry signature. |
| CodeQL | Push, pull request, weekly | Static analysis of the site code and these workflows. Findings appear under Security. |
| Dependency review | Pull requests | Blocks a pull request that would add a vulnerable package. |
| Lighthouse | Push and pull request | Accessibility, best practices, and SEO must stay at 100, with page weight and layout shift budgets (`lighthouserc.json`). Reports are kept as an artifact. |
| Broken links | Mondays | Opens every page in the live sitemap and follows every link (`lychee.toml`, which skips only Trustpilot and our `/trustpilot` short link, because Trustpilot refuses link checkers). Broken ones go in one issue. |
| Site health | Every six hours | Checks production with `scripts/check-site.mjs`. A failure opens one issue that closes itself when the site recovers. Run it by hand against any URL to check a deploy. |
| SEO | Pull requests, and Mondays | On a pull request, builds the site and runs `scripts/check-seo.mjs` over every page in its sitemap. On Mondays, runs it against production; a failure opens one issue that closes itself once fixed. The rules are in `scripts/lib/seo-rules.mjs`, with tests in `tests/seo-rules.test.ts`. |
| Workflow lint | Changes under `.github` | actionlint, including shellcheck on every `run` step. |
| Release check | A release is published, or by hand | Checks that the tag is `vMAJOR.MINOR.PATCH`, its commit is on `main`, `package.json` there has the same version, and the release has notes (`scripts/release-check.mjs`). A failure opens one issue per tag that says what to fix, and the run goes red. |
| Waiting pull requests | Mondays | Keeps one issue listing pull requests open for more than 7 days, with links and ages (`scripts/waiting-prs.mjs`). It closes itself when none is left. |
| Unreleased changes | Tuesdays | Keeps one issue listing what is merged into `main` but not in the latest release, once the oldest of it is over 7 days old (`scripts/unreleased-report.mjs`). Merging deploys nothing, so this catches a fix nobody released. It closes itself when a release catches up. |

Dependabot (`.github/dependabot.yml`) opens grouped pull requests for npm packages and action versions every Monday, three days after a release so a hijacked version that gets pulled quickly never arrives. Majors held back on purpose are listed there and in `scripts/outdated-report.mjs`.

The scheduled workflows write to one issue each rather than a new one every week: opened on the first failure, quietly updated while it keeps failing, closed with a comment when it passes again (`.github/actions/tracking-issue`).

GitHub turns off scheduled workflows in a repository with no activity for 60 days, and mails the person who last edited a schedule when one fails.

---

## Configuration

Runtime site config lives in `config/site.ts`: company name and location, the site URL (used for canonical URLs and the sitemap), internal paths, the footer credit, and per-document legal effective dates. Link destinations are in `config/links.json` and email addresses in `config/emails.ts`. When you revise a policy, bump only that document's entry in `effectiveDates`. The public site reads no environment variables; the admin's settings are in `.env`, listed in `.env.example` (see Admin and updates).

---

## Credits

Designed and built by [RejectModders](https://rejectmodders.dev). The fonts the share cards are drawn in are credited in `CREDITS.md`.

The site footer also displays "Made by RejectModders" with a link to the same place. If you fork this project, please keep the credit or replace it with your own.

---

## License

Private. All rights reserved. The codebase is shared for portfolio review. Do not redeploy under the WSLATL brand without permission.

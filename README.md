# wslatl.com

The public website for WSLATL LLC. Private hosting based in Missouri: VPS hosting, game server hosting, dedicated servers, and web hosting. Built with Next.js 16, React 19, Tailwind v4, and a small set of shadcn/ui primitives. Designed and built by [RejectModders](https://rejectmodders.dev).

---

## What this site does

1. Tells visitors what WSLATL sells, what it costs, and why we are different from the big hosting companies.
2. Publishes plan pricing for VPS and game servers on `/pricing`, with a page per supported game under `/games`.
3. Routes visitors to the right panel (billing, game panel, VPS panel, dedicated portal, cPanel) through the header Login menu and the footer.
4. Hosts the full legal library (ten policies) under `/legal`.
5. Shows our official referral partners on `/partners`, each with a profile page and, if they have one, their referral code.
6. Does all of that in English, Spanish, French, German and Portuguese.

Every public page is static. There is no CMS and no database: content lives in `data/*.ts` and `content/legal/*.tsx`, so copy is one PR away.

---

## Where things live

```
app/
  globals.css              Tailwind v4 entry, design tokens, the few custom styles.
  sitemap.ts, robots.ts    Every page in every language, from the same data the pages use.
  manifest.ts              /manifest.webmanifest: the name and icons for a home-screen shortcut.
  company.json/route.ts    /company.json: the company profile for the billing panel, written at build time.
  admin/                   The admin: sign in and update the site from GitHub (see Admin and updates).
  [locale]/                Every page, once, for all five languages (see Languages).
    layout.tsx             Root layout: language, fonts, default metadata, Organization JSON-LD, skip link.
    page.tsx               Home page composition.
    pricing/page.tsx       Pricing: line overviews, plan tables, what's included, how ordering works.
    games/page.tsx         Game directory with search.
    games/[slug]/page.tsx  One page per game, statically generated from data/games.ts.
    legal/page.tsx         Index of every legal document.
    legal/[slug]/page.tsx  Every policy, at /legal/privacy, /legal/terms, and so on.
    partners/page.tsx      Official partners: their cards, the "This could be you" card, the partner program.
    partners/[slug]/page.tsx  One profile per partner, statically generated from data/partners.ts.
    not-found.tsx, error.tsx  Branded 404 and error pages.

proxy.ts                   Serves the English tree at the unprefixed URLs, and answers 405 to every method but GET and HEAD, apart from POST on the admin's JSON routes.

components/
  ui/                      Primitives: button, dropdown-menu, section-header, site-link.
  layout/                  Header, login menu, footer, page header (with breadcrumbs), legal layout.
  sections/                Home page sections.
  pricing/                 Plan tables and the sticky section switcher.
  games/                   Game directory (the only client-side search on the site).
  legal/                   The blocks every legal document is built from, and the SLA uptime table.
  partners/                Partner cards, the copy-code button, platform icons, the partner program section.
  seo/json-ld.tsx          Structured data.

config/site.ts             Company details, paths, credits, legal metadata and effective dates.
config/links.json          Where each short link (/billing, /discord, ...) sends people.
config/emails.ts           Our email addresses. Server-only; rendered through <Email>.
config/referral.ts         The referral discount percent (first invoice only), which must match the billing panel.
content/legal/             The text of each policy; index.ts maps each document and language to its text.
data/                      Everything else the pages render (see below).
i18n/                      Languages: the current one, the dictionaries, the translations.
lib/                       pricing helpers, pageMetadata(), cn() and slugify().
scripts/                   Checks that need a build or a live site (see Automation), keep-old-assets.mjs (see Deploying), and serve.mjs, the updater (see Admin and updates).
tests/                     Vitest suites for data, links, and house style.
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
| Referral discount, and what the partner program may promise | `config/referral.ts` (the percent must match the billing panel) | `/partners`, partner profiles |
| Panel, portal, and profile URLs | `config/links.json` | Every button and link (through short links), redirects, structured data |
| Email addresses | `config/emails.ts` | Every address on the site, through `<Email>` |
| Company profile (owners, story, links, questions) | `lib/company-profile.ts`, built from the files above | `/company.json`, read by the billing panel. Its shape is versioned, so change it with care |

Never type a price, a plan spec, or an uptime figure anywhere else. Format prices with `formatPrice()` from `lib/pricing.ts`.

---

## Pages and metadata

Use `pageMetadata({ title, description, path })` from `lib/metadata.ts` for every new page. It sets the canonical URL and the full Open Graph and Twitter set. Next.js replaces a nested `openGraph` object instead of merging it, so hand-written page metadata silently loses the share image.

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

The program text only says what the billing panel actually does. Those facts, and the discount percent, are in `config/referral.ts`. The percent must match the referral discount in the billing panel (Settings, Orders), so change both on the same day.

The referral deal, as the site words it: the person who signs up with a code gets the percent off their first invoice for hosting (not dedicated servers) and nothing after that; the person who referred them gets a one-time account credit once that first invoice is paid. Do not write that the discount lasts, applies to every invoice or renewal, or depends on the partner staying in the program. `tests/referral-copy.test.ts` fails if any language says so.

### How to add a partner

Only with the partner's written OK to be shown here. Keep that message (a ticket or a Discord message) in case they ask later.

Taking someone down is two steps on the same day: delete their entry and their folder here, and revoke them as a referrer in the billing panel. Revoking is what stops their code from giving the first-invoice discount and the referral credit from then on. The site does not promise the discount for as long as a partner stays, so no page text changes when someone is taken down.

1. Get from them: their name (60 characters at most), a one-line tagline (80 characters at most), a short description (600 at most), optionally a square picture and a wide banner, the links they want shown, the games they play, and their referral code from the billing panel. The code is optional: skip it for a partner who is not in the referral program or does not want one shown.
2. Pictures are optional: skip steps 2 and 3 for a partner who has none yet. Without a picture their card and profile show a circle in our primary blue with their initials, without a banner a plain branded banner of the same shape, and a shared link to their profile shows the site's own picture. A picture that is given must still pass the checks in step 5. Export the picture as a square WebP, 512px (at least 256px), and the banner as a WebP about 3:1, ideally 1500x500 (at least 1200px wide). PNG and JPEG work too; nothing else is served from `public/partners/` (no SVG, which can carry script). Two things to tell them about the banner:
   - On their profile, their picture sits over the bottom-left corner of the banner, so nothing important should be there.
   - The banner is also the picture a shared link to their profile shows. Many link previews (Facebook, LinkedIn, X) are made for pictures of about 2:1 and crop the left and right ends off a 3:1 banner, so names and logos belong in the middle.
3. Put them in `public/partners/<slug>/`, for example `public/partners/pixel-forge/avatar.webp` and `banner.webp`. The slug and the file names are lowercase letters, digits and hyphens, and the slug becomes the address of their profile. With a banner, also run `npm run partners:cards` once the entry in step 4 is in: it makes `banner-card.webp`, the small 720x240 copy of the banner that their card on `/partners` loads. Their profile and shared links keep the full banner; full banners on every card would take the page over its 600 KB budget. The tests fail until the copy exists.
4. Add their entry to `partners` in `data/partners.ts`:

   ```ts
   {
     slug: 'pixel-forge',
     name: 'Pixel Forge',
     tagline: 'Modded Minecraft builds and a friendly survival community.',
     description: 'Who they are, in their own words.\n\nA second paragraph.',
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

   `referralCode` is optional: leave the line out for a partner with no code to show. Do not use an empty string for that, because the tests reject it. `\n\n` in the description starts a new paragraph. `since` is the month they became a partner. `games` are slugs from `data/games.ts` (`'fivem'`) or a game's name (`'Among Us'`). A game with a page here links to it; any other shows as plain text, and links by itself once its game gets a page whose slug is the name in lowercase with hyphens. `socials` takes any of `discord` (an invite, or a profile link such as `https://discord.com/users/<number>`), `youtube`, `tiktok`, `twitch`, `kick`, `x`, `instagram`, `steam`, `github` and `website`, as full https links. Add `featured: true` to show someone first. To give the tagline or description in other languages, use an object instead of a string, `{ en: '...', es: '...' }`; a language left out shows the English.
5. Run `npm test`. It checks every entry: each link is a plain https:// address on that platform's own site, slugs and codes are unique, a code (when there is one) is A to Z and 0 to 9 and at most 32 characters (as the billing panel stores them), the lengths, the month, the games, and that each picture that is given is a WebP, PNG or JPEG files directly in their folder, in the right shapes. The profile page, its sitemap entry and its share picture all follow from the entry.

`public/partners/` shares its name with the pages, so `i18n/routing.ts` serves only WebP, PNG and JPEG pictures from it as files (`sharedDirectories` and `partnerImageTypes`); every other path under `/partners/` is a page and gets a language like any other. A test fails if anything else is put in that folder.

---

## Search engines

- **Site name.** Google shows "WSLATL" as the site's name in results. It reads that from the `WebSite` structured data, which only the English home page carries (Google ignores it anywhere else), and from `application-name` and `og:site_name`. All three come from `siteConfig.brand`, and every title ends with it. The `Organization` data on every page has the legal name, "WSLATL LLC", with "WSLATL" as an `alternateName`, so the two read as one brand.
- **Titles and descriptions.** The home page title starts with the brand. Game pages say the game and the real starting price, in the words people search with in each language ("DayZ Server mieten", "hébergement de serveur"). Prices come from `data/pricing.ts`, never typed. `tests/seo.test.ts` checks the brand and that no two game pages share a title.
- **Sitemap.** It has no `lastmod`. Google only trusts that date when it is accurate every time, and a build date on every page teaches it to ignore the field. Add one back only with a real per-page date.
- **Icons.** See Images.

## Images

`images.unoptimized` is on, so every file in `public/` is served as-is. Export images at twice their display size before adding them: client logos are trimmed WebP at 96px tall, team photos are 192px square WebP. Partner pictures go in `public/partners/<slug>/` (see Partners). `public/og-image.png` (1200x630) is rendered from the site's own fonts and logo; re-export it if the slogan or branding changes.

The icons are the WSLATL mark from the brand kit (`assets/logo-png/logo/`), used as it ships: three panels, cyan to violet, on a transparent background. Its colours read on a white results page, in a light browser tab and on dark, so the icons need no tile. `favicon.ico` holds the kit's own 16, 32 and 48px marks as classic 32-bit bitmaps (the form every ICO reader takes, rather than PNGs inside the ICO), `favicon.png` is its 64px one, `icon-192.png` is the one Google uses beside results (it takes PNG or ICO, not SVG, square and larger than 48px), and `icon-512.png` is for the web app manifest. Two icons may not be transparent, so they put the mark on the brand's Ink tile (`#0F090B`) with room around it: `apple-icon.png` (180px; iOS fills transparency with black and rounds the corners) and `icon-maskable-512.png` (the mark inside the centre 80% that Android's masks keep). The logo ships as pictures only (its SVG files just wrap pictures), so there is no `favicon.svg`; its old address redirects to `icon-192.png`. `logo.png` (the 512px mark) is the logo in the `Organization` data. `tests/seo.test.ts` checks their sizes and that the two tiles have no transparency. Each one must also be listed in `rootFiles` in `i18n/routing.ts`.

The header shows the mark alone at 32px, the smallest the kit allows in a header: `public/brand/wslatl-mark.webp` is the kit's own 96px mark, three times that (`components/brand/logo.tsx`). The brand kit asks for the mark once per page, near the top, on a solid surface, so the header is opaque and the footer has no logo. The share image carries the full lockup (the mark, "WSLATL" and "Private Hosting", from `assets/logo-png/banner/`) on solid Ink, with the brand gradient only as an accent bar along the bottom. The kit's other rules: the name is artwork, so never set "WSLATL" in type beside the mark; keep clear space of about 18% of the mark's height on every side; the lockup is never under 190px wide; and never recolour, stretch, outline or rebuild the logo.

---

## Deploying

`npm run build` keeps the stylesheets and scripts of earlier builds for 30 days (`scripts/keep-old-assets.mjs`, run before and after `next build` as `prebuild` and `postbuild`). Every build renames them, because their names carry a hash of their content, and `next build` deletes the old ones. Google fetches a page's HTML on one day and renders it later with the files that HTML names, so without the old files it renders the page without its stylesheet. The kept files wait in `.next-static-history/` (gitignored); delete that folder only to start fresh. After each build they are put back beside the new build's own files, and listed in `.next/restored-assets.json`, so the next build counts only its own files as live and the old ones go 30 days after they were last live.

Production runs `npm run serve` (see Admin and updates), which installs published GitHub releases (see Releasing) and builds each one with `npm run build`, every one sharing the `.next-static-history/` beside `.env` (`STATIC_HISTORY_DIR`). A build by hand must use `npm run build` too, not `npx next build`, and keep `.next-static-history/` between restarts.

## Releasing

The live site only ever runs a published GitHub release. Merging into `main` changes nothing on the server by itself.

1. Merge the pull request into `main`.
2. Publish a release of `main`, tagged with the next version in the form `vMAJOR.MINOR.PATCH`: a fix raises the last number (v1.4.1), something new the middle one (v1.5.0), a big change the first (v2.0.0). On GitHub: Releases, Draft a new release, type the new tag, pick `main` as the target, Generate release notes, Publish release. Or from a terminal: `gh release create v1.5.0 --target main --generate-notes`. The version lives in the tag alone; no commit is needed to bump it.
3. Open `wslatl.com/admin` and press **Install v1.5.0**.

The dashboard offers a release only when it is GitHub's latest release (never a draft or a pre-release), its tag is a version, and that version is newer than the installed one, compared as numbers (v1.10.0 is newer than v1.9.0). A tag in any other form is refused with a message saying so. To hold a release back from the site, publish it as a pre-release.

When you press Install, the updater asks GitHub once which commit the tag points at and builds exactly that commit, so a tag moved halfway through an update changes nothing. If the repository's settings offer immutable releases (Settings, General, Releases), turn them on as well: a published release's tag can then never be moved at all.

## Admin and updates

`/admin` updates the site from GitHub, and that is all it does: sign in, see which release is installed and which is the latest, read what the latest one brings, press **Install**, and watch each step. It looks like the brand kit: its exact colours (`app/admin/admin.css`), Geist with Geist Mono for tags and the log, the mark once at the top, and every state in words as well as colour. It is English only, outside the language routing, never indexed (a robots meta tag and an `X-Robots-Tag` header), and not in the sitemap. robots.txt leaves it out on purpose: a line there would only point at it, and a disallowed page is never fetched, so its noindex would never be seen. There is no database: the settings are in `.env`, and the code comes from GitHub releases.

### How an update works

`npm run serve` (`scripts/serve.mjs`) is the server's startup command. It runs `next start`, starts it again if it stops, and does the updating, since a running Next server cannot replace itself. **Install** writes `.updater/request.json`, and within two seconds the supervisor:

1. **Download**: asks GitHub for the latest release, checks that its tag is a version newer than the installed one (see Releasing), asks which commit the tag points at, and downloads exactly that commit into `.updater/releases/<tag>/` (named by tag, since two releases may tag the same commit).
2. **Install**: runs `npm ci --ignore-scripts` there.
3. **Build**: runs `npm run build` there, with the live build's own assets copied in (not the old ones put back beside them) and the one shared `.next-static-history/`, so old hashed assets survive exactly as they do in a build by hand (see Deploying).
4. **Trial start**: starts the new build on a spare local port and waits for its home page to answer. Until here, the live site has not been touched.
5. **Switch**: stops the live server and starts the new build on the real port. If it does not answer within two minutes, the release before it starts again (rolled back).

A failure at any step leaves the site on the version it had, removes the half-built release, and shows the reason and the log on the dashboard. The install and the build each get 15 minutes, after which they are stopped together with everything they started. The build of the uploaded folder at start-up has no limit, as before the supervisor: stopped, it would only start over when the server starts again. The site is down only for the few seconds of the switch. `.env` and `.next-static-history/` are never touched.

A new release is watched for ten minutes after its switch, across a restart of the server too: if it stops three times in that time, the supervisor goes back to the release before it by itself, and the dashboard says so. When there is none left (each update removes it to make room, so after an update the only earlier build is the uploaded folder), it goes back to the uploaded folder instead and says that this may be an older version. Otherwise the supervisor starts `next start` again whenever it stops, waiting a little longer each time.

**Disk space.** The live release and the one before it are kept and older ones deleted, and when the next update starts, every release but the live one is removed (the one before it, and one a crash took back out). So at most three copies of the site are on the disk at once: the uploaded folder, the live release and the new one. Each holds its own `node_modules` and build, about 800 MB. npm's download cache lives in `.updater/npm-cache/` only while an update runs, and is deleted after it. Give the server a disk limit of at least 4 GB: Pterodactyl stops a server that goes over its limit, and does not start it again until it is back under.

The supervisor reports through `.updater/state.json`, which the dashboard reads. The settings in `.env` are given to `next start`, and never to the updater's `npm ci` or its builds of a release; `npm ci` also skips install scripts, which is where a compromised package usually strikes (the site needs none: sharp and the compilers ship prebuilt). A build still runs the site's own code and its build tools, exactly as a build by hand does, and the build of the uploaded folder at start-up reads `.env` from that folder itself, as any build by hand does. The console logs each login and failed login with the visitor's address, each update request, and each step of an update.

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

- **`/admin` answers 404.** The admin is off because a setting is missing or malformed. The console says which, at startup and on the first visit to `/admin`.
- **The dashboard says the site was not started with `npm run serve`.** The startup command is still the old one (step 5).
- **An update failed.** The dashboard shows the step, the reason and the log, and the site is unchanged. Fix the problem, publish a new release, and install that.
- **Nothing to install.** The dashboard says why: no release is published yet, the latest release is the installed one, the release marked latest is older than the installed one, or its tag is not in the form `vMAJOR.MINOR.PATCH`.
- **The dashboard says the updater itself changed.** `scripts/serve.mjs` and `scripts/updater/` always run from the uploaded folder, so a commit that changes them takes effect only once they are copied over: copy both from `.updater/releases/<tag>/scripts/` into the server's `scripts/` folder, then restart the server.
- **Going back to uploading by hand.** Once an update has run, the site is served from `.updater/releases/`, so files uploaded to the server's folder are not served. Stop the server, delete the `.updater/` folder (never `.env` or `.next-static-history/`), and start it again: it builds the uploaded folder and serves it.
- **Logging everyone out.** Change `ADMIN_SESSION_SECRET` or the password, and restart. A session lasts two hours anyway.
- **A new release went back by itself.** It stopped three times within ten minutes of its switch; the dashboard says so, and the console has its errors. That release is not offered again: fix it, publish the fix as a newer release, and install that.
- **`.updater/state.json` is damaged.** The console says so at start-up. The site then runs from the uploaded folder, and no release is deleted until an update writes the file again.

**The server console** (Pterodactyl's Console tab) takes these commands: `status` (what is serving, and what the updater last did), `update` (install the latest release, as the dashboard does), `rollback` (back to the release before the live one), `rollback upload` (back to the uploaded folder, when no release before is left: it may be much older), `restart` (start the live server again) and `stop`. While the server starts (and builds the uploaded folder) and while an update or a rollback runs, the commands that move the site wait for it to finish.

### How it is kept safe

- **Login.** The password is checked against an scrypt hash in constant time. Each address gets 5 attempts and everyone together 30 per 15 minutes, counted before the password is checked, and at most two checks run at once. Your own successful logins give their attempt back.
- **Only three routes take a POST:** `/admin/api/login`, `/admin/api/logout` and `/admin/api/update` (`adminPostRoutes` in `i18n/routing.ts`).
- **Session.** A signed cookie, `wslatl_admin`: HttpOnly, Secure, SameSite=Strict, Path=/admin, two hours. Its key comes from the session secret and the password hash together.
- **Every POST** must come from a page on this site (the `Origin` matches the host, and `Sec-Fetch-Site`, when sent, is `same-origin`), as JSON, and at most 4 KB. `proxy.ts` answers every other POST with a 405; `tests/proxy.test.ts` checks that each admin POST handler calls `checkPost()` before anything else.
- **Secrets** are read on the server, on each request, in `server-only` modules. `tests/admin-secrets.test.ts` keeps them away from client components, and `npm run scan:build` fails if a secret from `.env`, a password hash or a GitHub token turns up in anything the site serves. CI builds with made-up values in `.env` to prove it.
- **Release notes** come from GitHub and show on a page that holds the session, so they are never taken as HTML. `components/admin/release-notes.tsx` reads their Markdown itself and builds React elements from it: every piece of text reaches the page escaped, raw HTML included, and a link goes only to an https, http or mailto address. Any other link (`javascript:`, `data:`, a relative path) shows as its text, and an image as its alt text. `tests/admin-release-notes.test.ts` renders our own notes, GitHub's generated ones, and a list of attacks.
- **If any required setting is missing,** the admin is off. It never runs open.
- **Lockouts.** The overall limit stops the password being guessed however many addresses are used, and its flip side is that anyone with a handful of addresses (one IPv6 network holds hundreds) can use it up and keep the login locked, through Cloudflare or not. The per-address limit cannot prevent that: it reads Cloudflare's `CF-Connecting-IP`, which anyone who reaches the server's port directly can make up, and Next keeps a client's own `X-Forwarded-For`. Cloudflare Access in front of `/admin` (setup step 7) closes it. Accepting connections to the server's port from Cloudflare's addresses only (or a Cloudflare Tunnel) keeps the address honest as well.

| File | What it holds |
| --- | --- |
| `app/admin/` | The login page, the dashboard, the admin's colours (`admin.css`), and the JSON routes under `api/` (login, logout, update) |
| `components/admin/` | The login form, the update panel, the sign-out button, the release notes renderer, and the notices and badges that show each state |
| `lib/admin/` | Settings, password hashing, sessions, rate limits, request checks, GitHub, and the dashboard's side of the updater |
| `scripts/serve.mjs` | The supervisor, `npm run serve` |
| `scripts/updater/` | The update steps and the `.updater/` layout (`lib.mjs`), the version rule (`release.mjs`), the live server and its crash watch (`live.mjs`) and child processes (`process.mjs`), each with tests in `tests/updater*.test.ts` |
| `scripts/hash-password.mjs` | `npm run admin:hash` |
| `.env.example` | Every setting, with what it does |

The knowledge base (knowledge.wslatl.com) follows the same admin design, with the same settings and the same `npm run serve`, so the two are set up the same way.


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
| `npm run lint` | Oxlint, then ESLint with the Next.js core-web-vitals and TypeScript rules |
| `npm run lint:fix` | Same, applying the safe automatic fixes |
| `npm test` | Vitest: pricing invariants, link integrity, redirects, legal data, and a no-em-dash check |
| `npm run typecheck` | `tsc` (TypeScript 7) against the whole project; run after a build |
| `npm run scan:build` | Fails if an email address or an admin secret reached the build output, or a page in the sitemap is no longer prerendered |
| `npm run check:site <url>` | Checks a running site: pages, headers, redirects, short links, certificate |
| `npm run check` | Lint, test, build, scan, typecheck, in the order CI runs them |

Linting runs in two passes. [Oxlint](https://oxc.rs/docs/guide/usage/linter) goes first and does most of the work in well under a second (config in `.oxlintrc.json`: correctness rules fail the lint, suspicious patterns warn). ESLint then covers only what Oxlint cannot check yet, mainly the React Compiler hook rules and the rest of the Next.js set; `eslint-plugin-oxlint` switches off every ESLint rule Oxlint already runs, so nothing is reported twice. To silence a rule on one line, use an `oxlint-disable-next-line` comment with a reason.

TypeScript 7 provides `tsc`. The `typescript` package is aliased to `@typescript/typescript6` because ESLint's TypeScript parser still needs the TypeScript 6 API. ESLint stays on 9.x until `eslint-plugin-react` supports 10.

`package.json` carries two `overrides`, both for the Security audit. `sharp` needs 0.35.5 or newer, which fixes an advisory in the image library Next.js bundles. `@next/eslint-plugin-next` (the lint rules inside `eslint-config-next`) gets `tinyglobby` in place of its `fast-glob`: `fast-glob` pulls in `braces`, which has a high-severity advisory and no fixed release, and the plugin only calls `globSync` with one option, which `tinyglobby` also has (Vitest already installs it). Remove that override once `eslint-config-next` stops depending on `fast-glob`, then run `npm audit` to confirm the tree is still clean.

The Node.js version lives in `.nvmrc`; every workflow reads it from there.

---

## Automation

| Workflow | Runs | What it does when it fails |
| --- | --- | --- |
| CI | Every push and pull request | Lint, tests, build, email scan, typecheck. Red check on the commit. |
| Outdated packages | Mondays | Keeps one issue listing packages with newer versions. It closes itself once everything is current. |
| Security audit | Daily, and on dependency changes | Fails on a known vulnerability or a bad registry signature. |
| CodeQL | Push, pull request, weekly | Static analysis of the site code and these workflows. Findings appear under Security. |
| Dependency review | Pull requests | Blocks a pull request that would add a vulnerable package. |
| Lighthouse | Push and pull request | Accessibility, best practices, and SEO must stay at 100, with page weight and layout shift budgets (`lighthouserc.json`). Reports are kept as an artifact. |
| Broken links | Mondays | Opens every page in the live sitemap and follows every link (`lychee.toml`, which skips only Trustpilot and our `/trustpilot` short link, because Trustpilot refuses link checkers). Broken ones go in one issue. |
| Site health | Every six hours | Checks production with `scripts/check-site.mjs`. A failure opens one issue that closes itself when the site recovers. Run it by hand against any URL to check a deploy. |
| Workflow lint | Changes under `.github` | actionlint, including shellcheck on every `run` step. |

Dependabot (`.github/dependabot.yml`) opens grouped pull requests for npm packages and action versions every Monday, three days after a release so a hijacked version that gets pulled quickly never arrives. Majors held back on purpose are listed there and in `scripts/outdated-report.mjs`.

The scheduled workflows write to one issue each rather than a new one every week: opened on the first failure, quietly updated while it keeps failing, closed with a comment when it passes again (`.github/actions/tracking-issue`).

GitHub turns off scheduled workflows in a repository with no activity for 60 days, and mails the person who last edited a schedule when one fails.

---

## Configuration

Runtime site config lives in `config/site.ts`: company name and location, the site URL (used for canonical URLs and the sitemap), internal paths, the footer credit, and per-document legal effective dates. Link destinations are in `config/links.json` and email addresses in `config/emails.ts`. When you revise a policy, bump only that document's entry in `effectiveDates`. The public site reads no environment variables; the admin's settings are in `.env`, listed in `.env.example` (see Admin and updates).

---

## Credits

Designed and built by [RejectModders](https://rejectmodders.dev).

The site footer also displays "Made by RejectModders" with a link to the same place. If you fork this project, please keep the credit or replace it with your own.

---

## License

Private. All rights reserved. The codebase is shared for portfolio review. Do not redeploy under the WSLATL brand without permission.

# wslatl.com

The public website for WSLATL LLC. Private hosting based in Missouri: VPS hosting, game server hosting, dedicated servers, and web hosting. Built with Next.js 16, React 19, Tailwind v4, and a small set of shadcn/ui primitives. Designed and built by [RejectModders](https://rejectmodders.dev).

---

## What this site does

1. Tells visitors what WSLATL sells, what it costs, and why we are different from the big hosting companies.
2. Publishes plan pricing for VPS and game servers on `/pricing`, with a page per supported game under `/games`.
3. Routes visitors to the right panel (billing, game panel, VPS panel, dedicated portal, cPanel) through the header Login menu and the footer.
4. Hosts the full legal library (ten policies) under `/legal`.
5. Does all of that in English, Spanish, French, German and Portuguese.

Every page is static. There is no CMS and no database: content lives in `data/*.ts` and `content/legal/*.tsx`, so copy is one PR away.

---

## Where things live

```
app/
  globals.css              Tailwind v4 entry, design tokens, the few custom styles.
  sitemap.ts, robots.ts    Every page in every language, from the same data the pages use.
  [locale]/                Every page, once, for all five languages (see Languages).
    layout.tsx             Root layout: language, fonts, default metadata, Organization JSON-LD, skip link.
    page.tsx               Home page composition.
    pricing/page.tsx       Pricing: line overviews, plan tables, what's included, how ordering works.
    games/page.tsx         Game directory with search.
    games/[slug]/page.tsx  One page per game, statically generated from data/games.ts.
    legal/page.tsx         Index of every legal document.
    legal/[slug]/page.tsx  Every policy, at /legal/privacy, /legal/terms, and so on.
    not-found.tsx, error.tsx  Branded 404 and error pages.

proxy.ts                   Serves the English tree at the unprefixed URLs.

components/
  ui/                      Primitives: button, dropdown-menu, section-header, site-link.
  layout/                  Header, login menu, footer, page header (with breadcrumbs), legal layout.
  sections/                Home page sections.
  pricing/                 Plan tables and the sticky section switcher.
  games/                   Game directory (the only client-side search on the site).
  legal/                   The blocks every legal document is built from, and the SLA uptime table.
  seo/json-ld.tsx          Structured data.

config/site.ts             Company details, paths, credits, legal metadata and effective dates.
config/links.json          Where each short link (/billing, /discord, ...) sends people.
config/emails.ts           Our email addresses. Server-only; rendered through <Email>.
content/legal/             The text of each policy; index.ts maps each document and language to its text.
data/                      Everything else the pages render (see below).
i18n/                      Languages: the current one, the dictionaries, the translations.
lib/                       pricing helpers, pageMetadata(), cn() and slugify().
scripts/                   Checks that need a build or a live site (see Automation).
tests/                     Vitest suites for data, links, and house style.
```

---

## Single sources of truth

Some facts appear on many pages. Each one is defined exactly once, and everything else derives from it:

| Fact | Defined in | Used by |
| --- | --- | --- |
| Plan names, specs, prices | `data/pricing.ts` | Pricing page, home page, game pages, FAQ answer, meta descriptions |
| Uptime targets | `data/sla.ts` | Terms of Service, SLA, Refund Policy, home page commitments, pricing page |
| Legal document titles and dates | `data/legal.ts` and `config/site.ts` | Legal pages, `/legal`, footer, sitemap |
| Games | `data/games.ts` | `/games`, game pages, sitemap |
| Panel, portal, and profile URLs | `config/links.json` | Every button and link (through short links), redirects, structured data |
| Email addresses | `config/emails.ts` | Every address on the site, through `<Email>` |

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

## Images

`images.unoptimized` is on, so every file in `public/` is served as-is. Export images at twice their display size before adding them: client logos are trimmed WebP at 96px tall, team photos are 192px square WebP. `public/og-image.png` (1200x630) is rendered from the site's own fonts and logo; re-export it if the slogan or branding changes.

---

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
| `npm run lint` | Oxlint, then ESLint with the Next.js core-web-vitals and TypeScript rules |
| `npm run lint:fix` | Same, applying the safe automatic fixes |
| `npm test` | Vitest: pricing invariants, link integrity, redirects, legal data, and a no-em-dash check |
| `npm run typecheck` | `tsc` (TypeScript 7) against the whole project; run after a build |
| `npm run scan:build` | Fails if an email address reached the build output |
| `npm run check:site <url>` | Checks a running site: pages, headers, redirects, short links, certificate |
| `npm run check` | Lint, test, build, scan, typecheck, in the order CI runs them |

Linting runs in two passes. [Oxlint](https://oxc.rs/docs/guide/usage/linter) goes first and does most of the work in well under a second (config in `.oxlintrc.json`: correctness rules fail the lint, suspicious patterns warn). ESLint then covers only what Oxlint cannot check yet, mainly the React Compiler hook rules and the rest of the Next.js set; `eslint-plugin-oxlint` switches off every ESLint rule Oxlint already runs, so nothing is reported twice. To silence a rule on one line, use an `oxlint-disable-next-line` comment with a reason.

TypeScript 7 provides `tsc`. The `typescript` package is aliased to `@typescript/typescript6` because ESLint's TypeScript parser still needs the TypeScript 6 API. ESLint stays on 9.x until `eslint-plugin-react` supports 10.

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
| Broken links | Mondays | Opens every page in the live sitemap and follows every link (`lychee.toml`). Broken ones go in one issue. |
| Site health | Every six hours | Checks production with `scripts/check-site.mjs`. A failure opens one issue that closes itself when the site recovers. Run it by hand against any URL to check a deploy. |
| Workflow lint | Changes under `.github` | actionlint, including shellcheck on every `run` step. |

Dependabot (`.github/dependabot.yml`) opens grouped pull requests for npm packages and action versions every Monday, three days after a release so a hijacked version that gets pulled quickly never arrives. Majors held back on purpose are listed there and in `scripts/outdated-report.mjs`.

The scheduled workflows write to one issue each rather than a new one every week: opened on the first failure, quietly updated while it keeps failing, closed with a comment when it passes again (`.github/actions/tracking-issue`).

GitHub turns off scheduled workflows in a repository with no activity for 60 days, and mails the person who last edited a schedule when one fails.

---

## Configuration

Runtime site config lives in `config/site.ts`: company name and location, the site URL (used for canonical URLs and the sitemap), internal paths, the footer credit, and per-document legal effective dates. Link destinations are in `config/links.json` and email addresses in `config/emails.ts`. When you revise a policy, bump only that document's entry in `effectiveDates`. There are no environment variables.

---

## Credits

Designed and built by [RejectModders](https://rejectmodders.dev).

The site footer also displays "Made by RejectModders" with a link to the same place. If you fork this project, please keep the credit or replace it with your own.

---

## License

Private. All rights reserved. The codebase is shared for portfolio review. Do not redeploy under the WSLATL brand without permission.

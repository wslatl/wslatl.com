# wslatl.com

The public website for WSLATL LLC. Private hosting based in Missouri: VPS hosting, game server hosting, dedicated servers, and web hosting. Built with Next.js 16, React 19, Tailwind v4, and a small set of shadcn/ui primitives. Designed and built by [RejectModders](https://rejectmodders.dev).

---

## What this site does

1. Tells visitors what WSLATL sells, what it costs, and why we are different from the big hosting companies.
2. Publishes plan pricing for VPS and game servers on `/pricing`, with a page per supported game under `/games`.
3. Routes visitors to the right panel (billing, game panel, VPS panel, dedicated portal, cPanel) through the header Login menu and the footer.
4. Hosts the full legal library (ten policies) under `/legal`.

Every page is static. There is no CMS and no database: content lives in `data/*.ts` and `content/legal/*.tsx`, so copy is one PR away.

---

## Where things live

```
app/
  layout.tsx               Root layout: fonts, default metadata, Organization JSON-LD, skip link.
  page.tsx                 Home page composition.
  globals.css              Tailwind v4 entry, design tokens, the few custom styles.
  pricing/page.tsx         Pricing: line overviews, plan tables, what's included, how ordering works.
  games/page.tsx           Game directory with search.
  games/[slug]/page.tsx    One page per game, statically generated from data/games.ts.
  legal/page.tsx           Index of every legal document.
  legal/[slug]/page.tsx    Every policy, at /legal/privacy, /legal/terms, and so on.
  not-found.tsx, error.tsx Branded 404 and error pages.
  sitemap.ts, robots.ts    Generated from the same data the pages use.

components/
  ui/                      Primitives: button, dropdown-menu, section-header, site-link.
  layout/                  Header, login menu, footer, page header (with breadcrumbs), legal layout.
  sections/                Home page sections.
  pricing/                 Plan tables and the sticky section switcher.
  games/                   Game directory (the only client-side search on the site).
  legal/                   Pieces shared between legal documents (the SLA uptime table).
  seo/json-ld.tsx          Structured data.

config/site.ts             Links, emails, paths, credits, legal metadata and effective dates.
content/legal/             The text of each policy; index.ts maps each document to its text.
data/                      Everything else the pages render (see below).
lib/                       pricing helpers, pageMetadata(), cn() and slugify().
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
| Panel and portal URLs | `config/site.ts` | Header, footer, every call to action |

Never type a price, a plan spec, or an uptime figure anywhere else. Format prices with `formatPrice()` from `lib/pricing.ts`.

---

## Pages and metadata

Use `pageMetadata({ title, description, path })` from `lib/metadata.ts` for every new page. It sets the canonical URL and the full Open Graph and Twitter set. Next.js replaces a nested `openGraph` object instead of merging it, so hand-written page metadata silently loses the share image.

Retired URLs get a permanent redirect in `next.config.mjs`, in the same change that moves the page. The link tests check that every redirect lands on a page that exists. The legal documents moved from the site root to `/legal/...` in September 2026; their old paths (`/privacy`, `/terms`, and so on) redirect, and a test fails if any document loses its redirect. Always link to a legal document through `siteConfig.paths`, never a typed-out path (a test enforces this too).

To add a legal document: add its path to `siteConfig.paths` and its date to `effectiveDates`, add an entry to `data/legal.ts`, write the text in `content/legal/`, and register it in `content/legal/index.ts`. The route, footer link, sitemap entry, and table of contents follow automatically.

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
| `npm run check` | All of the above, in the order CI runs them |

Linting runs in two passes. [Oxlint](https://oxc.rs/docs/guide/usage/linter) goes first and does most of the work in well under a second (config in `.oxlintrc.json`: correctness rules fail the lint, suspicious patterns warn). ESLint then covers only what Oxlint cannot check yet, mainly the React Compiler hook rules and the rest of the Next.js set; `eslint-plugin-oxlint` switches off every ESLint rule Oxlint already runs, so nothing is reported twice. To silence a rule on one line, use an `oxlint-disable-next-line` comment with a reason.

TypeScript 7 provides `tsc`. The `typescript` package is aliased to `@typescript/typescript6` because ESLint's TypeScript parser still needs the TypeScript 6 API. ESLint stays on 9.x until `eslint-plugin-react` supports 10.

CI (`.github/workflows/ci.yml`) runs lint, tests, build, and typecheck on every push to `main` and every pull request.

---

## Configuration

All runtime site config lives in `config/site.ts`: company name and location, the site URL (used for canonical URLs and the sitemap), panel and social links, internal paths, contact emails, the footer credit, and per-document legal effective dates. When you revise a policy, bump only that document's entry in `effectiveDates`. There are no environment variables.

---

## Credits

Designed and built by [RejectModders](https://rejectmodders.dev).

The site footer also displays "Made by RejectModders" with a link to the same place. If you fork this project, please keep the credit or replace it with your own.

---

## License

Private. All rights reserved. The codebase is shared for portfolio review. Do not redeploy under the WSLATL brand without permission.

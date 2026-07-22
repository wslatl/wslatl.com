# wslatl.com

The public website for WSLATL LLC. Private hosting based in Missouri. Dedicated servers, game hosting, VPS, and web hosting. Built with Next.js 16, React 19, Tailwind v4, and shadcn/ui. Designed and built by [RejectModders](https://rejectmodders.dev).

---

## What this site does

Four things.

1. Tells visitors what WSLATL sells and why we are different from the big hosting companies.
2. Routes visitors to the right panel (Billing, Register, Gaming, VPS, Dedicated, cPanel) through a hover Login dropdown.
3. Publishes plan pricing for VPS and game servers on a dedicated `/pricing` page.
4. Hosts the full legal library (ten policies) with an in-page switcher and breadcrumb navigation.

No CMS, no database. Content lives in `data/*.ts` and `content/legal/*.tsx`, so copy is one PR away.

---

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript 5.7, with `strict: true`
- Tailwind CSS v4, configured in `app/globals.css` (no `tailwind.config.js`)
- shadcn/ui (new-york style). Three primitives in `components/ui/`.
- Radix UI for the dropdown primitives
- lucide-react for icons
- next/font for Geist Sans, Geist Mono, and Instrument Serif

Most of the shadcn-style Radix dependencies in `package.json` are installed for future use. Today the site actively uses React, Next, Tailwind, lucide-react, next/font, and Radix (for the Login dropdown).

---

## Directory structure

```
app/
  layout.tsx               Root layout. Fonts (Geist, Geist Mono, Instrument Serif), theme, metadata, animated background, scroll progress.
  page.tsx                 Home page composition.
  globals.css              Tailwind v4 entry plus design tokens and keyframes.
  pricing/page.tsx         Pricing page. Renders the <Pricing> tabs (VPS and Game Servers).
  privacy/page.tsx         Privacy Policy shell.        Renders content/legal/privacy.tsx.
  terms/page.tsx           Terms of Service shell.      Renders content/legal/terms.tsx.
  acceptable-use/page.tsx  Acceptable Use shell.        Renders content/legal/acceptable-use.tsx.
  refund/page.tsx          Refund Policy shell.         Renders content/legal/refund.tsx.
  sla/page.tsx             SLA shell.                   Renders content/legal/sla.tsx.
  dmca/page.tsx            DMCA Policy shell.           Renders content/legal/dmca.tsx.
  abuse/page.tsx           Abuse Policy shell.          Renders content/legal/abuse.tsx.
  account-credit/page.tsx  Account Credit shell.        Renders content/legal/account-credit.tsx.
  subprocessors/page.tsx   Subprocessors shell.         Renders content/legal/subprocessors.tsx.
  backups/page.tsx         Backup Policy shell.         Renders content/legal/backups.tsx.

components/
  ui/                      shadcn primitives (badge, button, dropdown-menu).
  brand/                   Visual identity. wordmark, glyphs, icons, animated background, scroll progress.
  layout/                  Page chrome. header (with Login dropdown), footer (with credits), legal layout.
  sections/                Home and pricing sections. hero, clients, stats, about, how-it-works, services, pricing-teaser, pricing, features, reviews, faq, cta-banner, contact.
  effects/                 Reusable effects. reveal (intersection observer), count-up (animated counter).

config/
  site.ts                  Single source of truth for site links, emails, credits, location, and legal metadata.

content/
  legal/                   Legal document bodies. One component per policy (ten in total).

data/
  nav.ts                   Header mainLinks and Login dropdown links.
  services.ts              Four hosting service cards.
  pricing.ts               VPS and game server pricing tabs, groups, and plans.
  features.ts              Five feature cards.
  reviews.ts               Trustpilot reviews section copy.
  faqs.ts                  Six FAQ entries.
  team.ts                  About section team members.
  clients.ts               Client logo marquee.
  stats.ts                 Animated stat counters.
  reach-options.ts         Contact card options.
  footer.ts                Footer link columns.
  legal.ts                 Legal page switcher list (primary and secondary tiers).

hooks/
  use-reduced-motion.ts    SSR-safe matchMedia hook.

lib/
  utils.ts                 cn() helper, clsx plus tailwind-merge.

public/                    Favicons, OG image, client logos, owner photos.
```

---

## Home page composition

The home page is composed top to bottom in `app/page.tsx`.

1. `Header`. Sticky, blur-on-scroll, hover Login dropdown on desktop, Radix dropdown on mobile.
2. `Hero`. Two columns on `lg+`. Copy and CTAs on the left, the WSLATL mark on the right.
3. `Clients`. Infinite marquee of client logos with an edge mask.
4. `Stats`. Four animated counters.
5. `About`. Who we are, three pillars, a pull quote, and the team.
6. `HowItWorks`. Three steps with an animated dashed connector.
7. `Services`. Four hosting services in a responsive grid.
8. `PricingTeaser`. A condensed pricing preview that links to the full `/pricing` page.
9. `Features`. Featured "real person" card plus five feature cards.
10. `Reviews`. Trustpilot review callout linking to the public profile.
11. `FAQ`. Six collapsible items.
12. `CtaBanner`. "Ready to get started?" with a conic-gradient backdrop.
13. `Contact`. Three reach options (Billing ticket, Discord, DM).
14. `Footer`. Brand, link columns, the Made by RejectModders credit, and the Missouri line.

---

## Pricing page

`/pricing` renders the `Pricing` section (`components/sections/pricing.tsx`), a tabbed table of plans. All plan data lives in `data/pricing.ts` as two tabs (VPS and Game Servers), each split into a Budget (SATA SSD) and a Premium (NVMe) group. The `PricingTeaser` on the home page is a condensed preview that links here.

---

## Legal pages

Ten legal documents: Privacy Policy, Terms of Service, Acceptable Use, Refund Policy, Service Level Agreement, DMCA Policy, Abuse Policy, Account Credit, Subprocessors, and Backup Policy. Each one lives as:

- A content component in `content/legal/{slug}.tsx` built entirely from `<LegalSection>` and `<LegalSubSection>`.
- A thin page in `app/{slug}/page.tsx` that imports the content, exports `metadata`, and wraps it in `<LegalLayout>`.

`LegalLayout` renders the shared chrome for every policy: header, breadcrumb, an in-page document switcher, the page header (title, description, effective date, jurisdiction), the content, a contact strip, and the footer. The switcher keeps the four primary documents (Privacy, Terms, Acceptable Use, Refund) as permanent pills and tucks the rest behind a "More legal" overflow menu; the primary and secondary tiers are defined in `data/legal.ts`. Whichever document you are viewing is always promoted into the pill row so it is never hidden.

To edit policy text, change only the file in `content/legal/`. To change the chrome shared by every legal page, change only `components/layout/legal-layout.tsx`. Contact details, paths, the Discord vanity URL, and per-document effective dates all come from `config/site.ts`, so a single edit there updates the relevant policies at once.

---

## Local development

You need Node.js 20 or higher. pnpm is the original package manager, but npm works too.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Hot reload is on.

Other scripts:

```bash
npm run build   # Production build
npm run start   # Serve the production build
```

ESLint is not installed in this repo today. The `npm run lint` script is wired up, but the package itself is not in `devDependencies`. Add `eslint` and the Next config when you need it.

---

## Configuration

All runtime site config lives in `config/site.ts`.

- `siteConfig.name`, `siteConfig.description`, `siteConfig.shortDescription`, `siteConfig.location`, `siteConfig.jurisdiction`.
- `siteConfig.siteUrl`. Used for canonical URLs and absolute link rendering.
- `siteConfig.links`. Billing, register, gaming/VPS/dedicated/cPanel panels, Discord, status, GitHub, and more.
- `siteConfig.paths`. Internal route paths for the pricing and legal pages, plus the in-page contact anchor.
- `siteConfig.email`. support, info, abuse, and dmca addresses.
- `siteConfig.trustpilot`. Public review profile URL.
- `siteConfig.credits`. The Made by RejectModders credit shown in the footer.
- `siteConfig.legal`. Company name, mailing address, Discord vanity, a fallback effective date, and a per-document `effectiveDates` map. Read a document's date with the exported `legalEffectiveDate(doc)` helper, which falls back to the shared date.

Edit this file to update the footer credits, the Login dropdown targets, the contact mailto links, or any legal page metadata across the site. There are no environment variables today.

`app/layout.tsx` sets its own `metadataBase` from `siteConfig.siteUrl`. Change it if you deploy to a different domain.

---

## Credits

Designed and built by [RejectModders](https://rejectmodders.dev).

The site footer also displays "Made by RejectModders" with a link to the same place. If you fork this project, please keep the credit or replace it with your own.

---

## License

Private. All rights reserved. The codebase is shared for portfolio review. Do not redeploy under the WSLATL brand without permission.

# wslatl.com

The public website for WSLATL LLC. Private hosting based in Missouri. Dedicated servers, game hosting, VPS, and web hosting. Built with Next.js 16, React 19, Tailwind v4, and shadcn/ui. Designed and built by [RejectModders](https://rejectmodders.dev).

---

## What this site does

Three things.

1. Tells visitors what WSLATL sells and why we are different from the big hosting companies.
2. Routes visitors to the right panel (Billing, Gaming, VPS, Dedicated, cPanel) through a hover Login dropdown.
3. Hosts the full legal disclosures (Privacy, Terms, Acceptable Use) with a switcher and breadcrumb navigation.

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

The shadcn-style Radix dependencies in `package.json` are preinstalled for future use. Today the site only consumes React, Next, Tailwind, lucide, and next/font.

---

## Directory structure

```
app/
  layout.tsx               Root layout. Fonts, theme, animated background, scroll progress.
  page.tsx                 Home page composition.
  globals.css              Tailwind v4 entry plus design tokens and keyframes.
  privacy/page.tsx         Privacy Policy shell. Renders content from content/legal/privacy.tsx.
  terms/page.tsx           Terms of Service shell. Renders content from content/legal/terms.tsx.
  acceptable-use/page.tsx  Acceptable Use Policy shell. Renders content from content/legal/acceptable-use.tsx.

components/
  ui/                      shadcn primitives (button, badge, dropdown-menu).
  brand/                   Visual identity. wordmark, glyphs, icons, animated background, scroll progress.
  layout/                  Page chrome. header (with Login dropdown), footer (with credits), legal layout.
  sections/                Page sections. hero, clients, stats, about, how-it-works, services, features, faq, cta-banner, contact.
  effects/                 Reusable effects. reveal (intersection observer), count-up, interactive-mark (cursor-driven wordmark).

config/
  site.ts                  Single source of truth for site links, emails, credits, location, legal metadata.

content/
  legal/                   Legal document bodies. One component per policy.

data/
  nav.ts                   Header mainLinks and loginLinks.
  services.ts              Four hosting plans.
  features.ts              Five feature cards.
  faqs.ts                  Six FAQ entries.
  team.ts                  About section team members.
  clients.ts               Client logo marquee.
  stats.ts                 Animated stat counters.
  reach-options.ts         Contact card options.
  footer.ts                Footer link columns.
  legal.ts                 Legal page switcher list.

hooks/
  use-reduced-motion.ts    SSR-safe matchMedia hook.
  use-mouse-position.ts    Pointer-tracking hook (used by interactive-mark).

lib/
  utils.ts                 cn() helper, clsx plus tailwind-merge.

public/                    Favicons, OG image, client logos, owner photos.
```

---

## Home page composition

The home page is composed top to bottom in `app/page.tsx`.

1. `Header`. Sticky, blur-on-scroll, hover Login dropdown on desktop, Radix dropdown on mobile.
2. `Hero`. Two columns on `lg+`. Copy on the left, interactive WSLATL mark on the right.
3. `Clients`. Infinite marquee of client logos with an edge mask.
4. `Stats`. Four animated counters.
5. `About`. Who we are, three pillars, a pull quote, the team.
6. `HowItWorks`. Three steps with an animated dashed connector.
7. `Services`. Four hosting plans in a responsive grid.
8. `Features`. Featured "real person" card plus five feature cards.
9. `FAQ`. Six collapsible items.
10. `CtaBanner`. "Ready to get started?" with a conic-gradient backdrop.
11. `Contact`. Three reach options (Billing, Discord, DM).
12. `Footer`. Brand, link columns, the Made by RejectModders credit, and the Missouri line.

---

## Legal pages

Three policies. Privacy, Terms of Service, and Acceptable Use. Each lives as:

- A content component in `content/legal/{slug}.tsx` that contains every section as `<LegalSection>` and `<LegalSubSection>`.
- A thin page in `app/{slug}/page.tsx` that imports the content, exports `metadata`, and wraps it in `<LegalLayout>`.

The `LegalLayout` component renders a consistent chrome for all three. Header, breadcrumb, in-page switcher (segmented control), page header (title, description, effective date, jurisdiction), the content, a contact strip, and the footer.

To edit policy text, modify only the file in `content/legal/`. To change the layout or chrome of every legal page, modify only `components/layout/legal-layout.tsx`. All contact details, effective dates, paths, and the Discord vanity URL come from `config/site.ts`, so a single edit there updates every policy at once.

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

- `siteConfig.name`, `siteConfig.description`, `siteConfig.location`, `siteConfig.jurisdiction`
- `siteConfig.siteUrl`. Used for canonical URLs and absolute link rendering.
- `siteConfig.links`. Billing, register, panels, Discord, status, GitHub, and more.
- `siteConfig.paths`. Internal route paths for the privacy, terms, and acceptable-use pages, plus the in-page contact anchor.
- `siteConfig.email`. Support and info addresses.
- `siteConfig.credits`. The Made by RejectModders credit shown in the footer.
- `siteConfig.legal`. Effective date, company name, mailing address, and Discord vanity shared by all three policy pages.

Edit this file to update the footer credits, the Login dropdown, the contact mailto links, or the legal page metadata anywhere on the site. There are no environment variables today.

`app/layout.tsx` has its own `metadataBase` pointing at `siteConfig.siteUrl`. Change one or the other if you deploy to a different domain.

---

## Credits

Designed and built by [RejectModders](https://rejectmodders.dev).

The site footer also displays "Made by RejectModders" with a link to the same place. If you fork this project, please keep the credit or replace it with your own.

---

## License

Private. All rights reserved. The codebase is shared for portfolio review. Do not redeploy under the WSLATL brand without permission.

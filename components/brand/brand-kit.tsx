import { ArrowUpRight, Check, Download } from 'lucide-react'
import { ColorSection } from '@/components/brand/color-section'
import { DosSection } from '@/components/brand/dos-section'
import { FullKitSection } from '@/components/brand/full-kit-section'
import { LogoSection } from '@/components/brand/logo-section'
import { TypeSection } from '@/components/brand/type-section'
import { VoiceSection } from '@/components/brand/voice-section'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { SiteLink } from '@/components/ui/site-link'
import { fullKitUrl } from '@/data/brand'
import { copy } from '@/i18n/copy'

/**
 * The title block: what the kit is for, who it is for, and the two ways in.
 * The mark itself is not repeated here: the kit asks for it once per page,
 * near the top, and the header above already has it.
 */
export function BrandHeader() {
  const t = copy()
  const b = t.brand
  return (
    <PageHeader title={b.heading} breadcrumbs={[]} crumbLabel={b.crumb} path="/brand">
      <p>{b.intro}</p>
      <p className="mt-3">{b.audience}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild size="lg">
          <SiteLink href={fullKitUrl} newTab={t.header.newTab}>
            {b.getFullKit}
            <ArrowUpRight aria-hidden="true" />
          </SiteLink>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#downloads">
            <Download aria-hidden="true" />
            {b.getLogo}
          </a>
        </Button>
      </div>
    </PageHeader>
  )
}

/** The guide's own short version, four lines, before any of the detail. */
function ShortVersion() {
  const t = copy().brand.shortVersion
  return (
    <section aria-labelledby="short-version-heading" className="rounded-2xl border bg-card/30 p-6 sm:p-8">
      <h2 id="short-version-heading" className="font-semibold text-foreground">
        {t.heading}
      </h2>
      <ul className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
        {t.items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-link" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Plain anchors to each part, so the page works as a list of links with or without script. */
function PageNav() {
  const t = copy().brand
  const parts = [
    { id: 'logo', label: t.nav.logo },
    { id: 'colors', label: t.nav.colors },
    { id: 'type', label: t.nav.type },
    { id: 'voice', label: t.nav.voice },
    { id: 'dos-and-donts', label: t.nav.rules },
    { id: 'full-kit', label: t.nav.fullKit },
  ]
  return (
    <nav aria-labelledby="brand-nav-heading" className="mt-8 print:hidden">
      <p id="brand-nav-heading" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {t.onThisPage}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {parts.map((part) => (
          <li key={part.id}>
            <a
              href={`#${part.id}`}
              className="inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {part.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Everything on /brand below its title: the short version, a way round the
 * page, then the six parts in the order the guide takes them (logo, color,
 * type, voice, do and don't) and the full kit last.
 */
export function BrandKit() {
  return (
    <>
      <ShortVersion />
      <PageNav />
      <LogoSection />
      <ColorSection />
      <TypeSection />
      <VoiceSection />
      <DosSection />
      <FullKitSection />
    </>
  )
}

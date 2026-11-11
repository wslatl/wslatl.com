import { ArrowUpRight, Check } from 'lucide-react'
import { BrandSection } from '@/components/brand/brand-section'
import { Button } from '@/platform/components/button'
import { SiteLink } from '@/platform/components/site-link'
import { siteConfig } from '@/config/site'
import { fullKitUrl, kitContents, markSizes } from '@/data/brand'
import { copy } from '@/i18n/copy'

/** Part 6: the whole kit, one click away on Google Drive: every size, the SVG files and the PDF guide. */
export function FullKitSection() {
  const t = copy()
  const b = t.brand.fullKit
  const contents = b.items({
    sizes: markSizes.length,
    smallest: markSizes[0],
    largest: markSizes[markSizes.length - 1],
    banners: kitContents.bannerSizes,
    pages: kitContents.guidePages,
  })

  return (
    <BrandSection id="full-kit" number="6" title={b.heading} intro={b.body}>
      <div className="rounded-3xl border border-primary/30 bg-card/30 p-6 sm:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <ul className="space-y-3">
            {contents.map((item) => (
              <li key={item} className="flex gap-3 text-foreground">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-link" />
                {item}
              </li>
            ))}
          </ul>
          {/* The label is the longest on the page in some languages: on a phone it wraps rather than push the card wider than the screen. */}
          <Button asChild size="lg" className="h-auto min-h-11 py-2.5 text-center whitespace-normal">
            <SiteLink href={fullKitUrl} newTab={t.header.newTab}>
              {b.cta}
              <ArrowUpRight aria-hidden="true" />
            </SiteLink>
          </Button>
        </div>
        <p className="mt-8 max-w-2xl border-t pt-6 text-sm leading-relaxed text-muted-foreground">
          {b.questionPrefix}{' '}
          <SiteLink
            href={siteConfig.links.discord}
            // A short link, which leaves the site through its redirect.
            external
            newTab={t.header.newTab}
            className="text-link underline underline-offset-4 hover:text-foreground"
          >
            {b.questionLink}
          </SiteLink>
          {b.questionSuffix}
        </p>
      </div>
    </BrandSection>
  )
}

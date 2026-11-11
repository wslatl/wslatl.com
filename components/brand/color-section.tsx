import { BrandSection, Prose, SubSection } from '@/components/brand/brand-section'
import { CopyButton, type CopyButtonLabels } from '@/platform/components/copy-button'
import {
  gradientCss,
  gradients,
  interfaceColors,
  logoColors,
  type Swatch,
} from '@/data/brand'
import { copy } from '@/i18n/copy'

const rgbText = (rgb: readonly number[]) => `RGB ${rgb.join(', ')}`

/**
 * One color: its name, its hex with a button that copies it, its RGB and what
 * it is for. The swatch itself says nothing: every fact is in the words next
 * to it, so no one needs to see the color to use it. Beside the swatch on a
 * phone, under it from 640px.
 */
function SwatchCard({ swatch, use, labels }: { swatch: Swatch; use: string; labels: CopyButtonLabels }) {
  return (
    <li className="flex gap-4 rounded-xl border bg-card/30 p-3 sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0">
      {/* The ring keeps the near-black swatches from melting into the page. */}
      <div
        aria-hidden="true"
        className="size-16 shrink-0 rounded-lg ring-1 ring-white/20 ring-inset sm:h-24 sm:w-full sm:rounded-none"
        style={{ backgroundColor: swatch.hex }}
      />
      <div className="min-w-0 flex-1 sm:p-4">
        <p lang="en" translate="no" className="font-semibold text-foreground">
          {swatch.name}
        </p>
        <CopyButton value={swatch.hex} labels={labels} className="mt-1" />
        <p className="mt-1 text-xs text-muted-foreground tabular-nums">{rgbText(swatch.rgb)}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{use}</p>
      </div>
    </li>
  )
}

/** A gradient as a wide bar, with both of its stops to copy. */
function GradientCard({
  gradient,
  use,
  labels,
}: {
  gradient: (typeof gradients)[number]
  use: string
  labels: CopyButtonLabels
}) {
  const t = copy().brand.colors
  const stops = [
    { label: t.from, ...gradient.from },
    { label: t.to, ...gradient.to },
  ]
  return (
    <li className="overflow-hidden rounded-xl border bg-card/30">
      <div aria-hidden="true" className="h-16" style={{ backgroundImage: gradientCss(gradient) }} />
      <div className="p-4 sm:p-5">
        <p lang="en" translate="no" className="font-semibold text-foreground">
          {gradient.name}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{use}</p>
        <ul className="mt-4 space-y-2">
          {stops.map((stop) => (
            <li key={stop.label} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="w-16 shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {stop.label}
              </span>
              <CopyButton value={stop.hex} labels={labels} />
              <span className="text-xs text-muted-foreground tabular-nums">{rgbText(stop.rgb)}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

const swatchGrid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'

/** Part 2: the logo's colors, the two gradients and the interface palette, as swatches with their hex ready to copy. */
export function ColorSection() {
  const t = copy().brand.colors
  const labels: CopyButtonLabels = { copy: t.copy, copied: t.copied, copyFailed: t.copyFailed }

  return (
    <BrandSection id="colors" number="2" title={t.heading} intro={t.intro}>
      <SubSection title={t.logoHeading}>
        <Prose>{t.logoIntro}</Prose>
        <ul className={swatchGrid}>
          {logoColors.map((swatch) => (
            <SwatchCard key={swatch.id} swatch={swatch} use={t.uses[swatch.id]} labels={labels} />
          ))}
        </ul>
      </SubSection>

      <SubSection title={t.gradientsHeading}>
        <Prose>{t.gradientsIntro}</Prose>
        <ul className="grid gap-4 md:grid-cols-2">
          {gradients.map((gradient) => (
            <GradientCard
              key={gradient.id}
              gradient={gradient}
              use={t.gradientUses[gradient.id]}
              labels={labels}
            />
          ))}
        </ul>
      </SubSection>

      <SubSection title={t.interfaceHeading}>
        <Prose>{t.interfaceIntro}</Prose>
        <ul className={swatchGrid}>
          {interfaceColors.map((swatch) => (
            <SwatchCard
              key={swatch.id}
              swatch={swatch}
              use={t.uses[swatch.id]}
              labels={labels}
            />
          ))}
        </ul>
      </SubSection>

      <SubSection title={t.rulesHeading}>
        <ol className="max-w-2xl space-y-3">
          {t.rules.map((rule, index) => (
            <li key={rule} className="flex gap-4 leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="w-4 shrink-0 font-serif text-xl leading-snug text-link italic">
                {index + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </SubSection>
    </BrandSection>
  )
}

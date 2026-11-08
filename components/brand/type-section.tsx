import { BrandSection } from '@/components/brand/brand-section'
import { WithEnglish } from '@/components/brand/with-english'
import { siteConfig } from '@/config/site'
import { subline } from '@/data/brand'
import { copy } from '@/i18n/copy'
import { cn } from '@/lib/utils'

interface FaceProps {
  name: string
  role: string
  use: React.ReactNode
  size: string
  /** The font class the sample is set in; a face the site does not load has none, and says so instead. */
  sample?: { className: string }
  noSample?: string
}

/**
 * One typeface: its job, a sample set in it, and when to use it. The sample is
 * the slogan, which is English in every language, so it is marked as such.
 */
function Face({ name, role, use, size, sample, noSample }: FaceProps) {
  return (
    <li className="flex flex-col rounded-2xl border bg-card/30 p-6">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{role}</p>
      <h3 lang="en" translate="no" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
        {name}
      </h3>
      {sample ? (
        <div className="mt-6 border-y py-6">
          <p aria-hidden="true" className={cn('text-7xl leading-none text-foreground', sample.className)}>
            Aa
          </p>
          <p lang="en" className={cn('mt-5 text-2xl leading-snug text-foreground', sample.className)}>
            {siteConfig.slogan}
          </p>
        </div>
      ) : (
        <p className="mt-6 flex-none rounded-lg border border-dashed px-4 py-6 text-sm leading-relaxed text-muted-foreground">
          {noSample}
        </p>
      )}
      <p className="mt-6 leading-relaxed text-foreground">{use}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{size}</p>
    </li>
  )
}

/**
 * Part 3: the three typefaces, each with a sample and what it is for. Geist
 * and Instrument Serif are the two the site loads. Geist Mono is not one of
 * them (it would be a third font file on every page), so it is described and
 * not shown. The serif is only loaded in italic here (app/[locale]/layout.tsx),
 * which is how the site sets it.
 */
export function TypeSection() {
  const t = copy().brand.type
  return (
    <BrandSection id="type" number="3" title={t.heading} intro={t.intro}>
      <ul className="grid gap-5 lg:grid-cols-3">
        <Face name="Geist" role={t.sans.role} use={t.sans.use} size={t.sans.size} sample={{ className: 'font-sans font-semibold' }} />
        <Face
          name="Instrument Serif"
          role={t.serif.role}
          use={<WithEnglish text={t.serif.use} english={[subline]} />}
          size={t.serif.size}
          sample={{ className: 'font-serif italic' }}
        />
        <Face name="Geist Mono" role={t.mono.role} use={t.mono.use} size={t.mono.size} noSample={t.mono.noSample} />
      </ul>
      <ul className="max-w-2xl space-y-1.5 text-muted-foreground">
        {t.rules.map((rule) => (
          <li key={rule} className="flex gap-3 leading-relaxed">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-link" />
            {rule}
          </li>
        ))}
      </ul>
    </BrandSection>
  )
}

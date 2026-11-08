import { Check, X } from 'lucide-react'
import { BrandPicture, BrandSection, Prose } from '@/components/brand/brand-section'
import { pictures, tiles } from '@/data/brand'
import { copy } from '@/i18n/copy'

/** The guide's rules for the logo, as two short lists. Each is headed by its word and each line carries an icon: right and wrong never differ by color alone. */
function Verdict({ verdict, heading, items }: { verdict: 'do' | 'dont'; heading: string; items: readonly string[] }) {
  const Icon = verdict === 'do' ? Check : X
  return (
    <div data-tone={verdict === 'do' ? 'good' : 'critical'} className="rounded-2xl border bg-card/30 p-5 sm:p-6">
      <h3 className="font-semibold text-foreground">{heading}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
            <Icon aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-(--tone)" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Part 5: the guide's do and don't, in words and in its diagram. The diagram
 * is six pictures, three that are right and three that are not, each with its
 * label written under it in the page's language rather than baked into the
 * picture, so every language has them.
 */
export function DosSection() {
  const t = copy().brand.dos
  // The six pictures are laid out three across at the size they were drawn for, on every screen that has the room.
  const width = pictures.doOriginal.width * 3 + 16 * 2

  return (
    <BrandSection id="dos-and-donts" number="5" title={t.heading} intro={t.intro}>
      <div className="grid gap-5 md:grid-cols-2">
        <Verdict verdict="do" heading={t.doHeading} items={t.doItems} />
        <Verdict verdict="dont" heading={t.dontHeading} items={t.dontItems} />
      </div>

      {/* The rule that matters most, beside the pictures of it on a wide screen and under them on a phone. */}
      <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-12">
        <ul style={{ maxWidth: width }} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tiles.map((tile) => {
            const Icon = tile.verdict === 'do' ? Check : X
            return (
              <li key={tile.id} data-tone={tile.verdict === 'do' ? 'good' : 'critical'}>
                <figure>
                  <div className="overflow-hidden rounded-xl border bg-white">
                    <BrandPicture id={tile.picture} alt={t.alt[tile.id]} />
                  </div>
                  <figcaption className="mt-2 flex items-start gap-2 text-sm leading-snug">
                    <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-(--tone)" />
                    <span>
                      <span className="font-semibold text-foreground">
                        {tile.verdict === 'do' ? t.doHeading : t.dontHeading}
                      </span>{' '}
                      <span className="text-muted-foreground">{t.tiles[tile.id]}</span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
        <Prose className="border-l-2 border-primary/30 pl-5">{t.rebuild}</Prose>
      </div>
    </BrandSection>
  )
}

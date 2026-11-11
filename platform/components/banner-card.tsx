import Image from 'next/image'
import { cn } from '../lib/cn'

/** Two letters for the round picture when there is no image: the first letters of the first two words. */
export function initialsOf(name: string): string {
  const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  const letters = words.length > 1 ? words.slice(0, 2).map((word) => [...word][0]) : [...(words[0] ?? '?')].slice(0, 2)
  return letters.join('').toLocaleUpperCase()
}

type FeaturedProps =
  | { featured?: false; featuredLabel?: never }
  | {
      /** Adds the primary-tinted border and the badge. */
      featured: true
      /** The badge's word, for example "Featured". */
      featuredLabel: string
    }

export type BannerCardProps = FeaturedProps & {
  /** The name, set as the card's heading. */
  name: string
  /** Makes the heading's id (and the card's accessible name) unique on the page. */
  headingId: string
  /** The heading's level: 3 where the cards sit under a section's own heading. */
  headingLevel?: 2 | 3
  /** One line about it. Clamped to two lines. */
  line?: string
  /** The language of `line`, when it differs from the page's. */
  lineLang?: string
  /** The 3:1 banner. Without one a plain branded banner of the same shape shows. */
  bannerSrc?: string
  /** The `sizes` hint for the banner image. */
  bannerSizes?: string
  /** The round picture. Without one the initials of the name show on the brand colour. */
  pictureSrc?: string
  /** Between the line and the actions: a row of icon links. */
  meta?: React.ReactNode
  /** The bottom of the card: the thing to do or check. */
  actions?: React.ReactNode
  className?: string
}

/**
 * The one card shape: a 3:1 banner, a round picture overlapping it, the
 * name, one line, and what you can do. Used for partners, games, services,
 * people and guide groups. Both pictures are decorative here, because the
 * name is written next to them.
 */
export function BannerCard({
  name,
  headingId,
  headingLevel = 2,
  line,
  lineLang,
  bannerSrc,
  bannerSizes = '(min-width: 64rem) 22rem, (min-width: 40rem) 50vw, 100vw',
  pictureSrc,
  featured,
  featuredLabel,
  meta,
  actions,
  className,
}: BannerCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border bg-card/20',
        featured && 'border-primary/40 bg-primary/[0.04]',
        className,
      )}
    >
      {/* overflow-hidden holds the box at 3:1 when a banner is a little taller than that. */}
      <div className="relative aspect-[3/1] overflow-hidden bg-card">
        {bannerSrc ? (
          <Image src={bannerSrc} alt="" width={1500} height={500} sizes={bannerSizes} className="size-full object-cover" />
        ) : (
          <div
            aria-hidden="true"
            data-plain-banner=""
            className="size-full bg-linear-to-br from-primary/40 via-primary/15 to-card"
          />
        )}
        {featured && (
          <span className="absolute top-3 right-3 rounded-full border border-primary/40 bg-background/85 px-2.5 py-0.5 text-xs font-medium text-foreground">
            {featuredLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        {pictureSrc ? (
          <Image
            src={pictureSrc}
            alt=""
            width={256}
            height={256}
            className="relative -mt-8 size-16 rounded-full bg-card object-cover text-xs ring-4 ring-background"
          />
        ) : (
          <span
            aria-hidden="true"
            className="relative -mt-8 flex size-16 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-4 ring-background select-none"
          >
            <span className="text-[length:1.5em] leading-none">{initialsOf(name)}</span>
          </span>
        )}
        <Heading id={headingId} className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          {name}
        </Heading>
        {line && (
          <p lang={lineLang} className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {line}
          </p>
        )}

        {meta}

        {actions && <div className="mt-auto pt-5">{actions}</div>}
      </div>
    </article>
  )
}

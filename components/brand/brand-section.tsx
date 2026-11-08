import Image from 'next/image'
import { cn } from '@/lib/utils'
import { pictures, type PictureId } from '@/data/brand'

interface BrandSectionProps {
  /** The anchor, and what the page's own links point at. */
  id: string
  /** The serif numeral before the heading, as on the legal documents. */
  number: string
  title: string
  intro?: React.ReactNode
  children: React.ReactNode
}

/** One numbered part of the brand kit page: a heading, a line of intro, and what the part holds. */
export function BrandSection({ id, number, title, intro, children }: BrandSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="pt-16 md:pt-24">
      <h2
        id={`${id}-heading`}
        className="flex items-baseline gap-3 border-b pb-4 text-3xl font-bold tracking-[-0.03em] text-balance break-words hyphens-auto text-foreground md:text-4xl"
      >
        <span aria-hidden="true" className="font-serif text-3xl font-normal text-link italic tabular-nums md:text-4xl">
          {number}
        </span>
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{intro}</p>}
      <div className="mt-10 space-y-14 md:space-y-16">{children}</div>
    </section>
  )
}

interface SubSectionProps {
  id?: string
  title: string
  children: React.ReactNode
}

/** A heading inside a part, with the text and pictures under it. */
export function SubSection({ id, title, children }: SubSectionProps) {
  return (
    <div id={id}>
      <h3 className="text-xl font-semibold tracking-tight text-balance break-words hyphens-auto text-foreground md:text-2xl">
        {title}
      </h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}

/** A paragraph of running text, held to a readable width. */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('max-w-2xl leading-relaxed text-pretty text-muted-foreground', className)}>{children}</p>
}

/**
 * One of the page's pictures, at the size it shows (data/brand.ts): the file
 * is twice that, and the size is held on the picture itself, so it never
 * grows past its sharp size and the page does not move when it loads. Always
 * lazy: nothing on this page is the first thing a visitor sees.
 */
export function BrandPicture({ id, alt, className }: { id: PictureId; alt: string; className?: string }) {
  const { src, width, height } = pictures[id]
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      style={{ maxWidth: width }}
      className={cn('h-auto w-full', className)}
    />
  )
}

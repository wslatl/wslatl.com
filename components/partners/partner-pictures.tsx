import Image from 'next/image'
import { partnerInitials } from '@/lib/partners'
import { cn } from '@/lib/utils'

/**
 * A partner's round picture, or their initials on the brand color when they
 * gave none. `className` sets the size and position, the same for both.
 * `alt` empty means the name is written next to it (a card), so the circle
 * is hidden from screen readers; otherwise it is announced as a picture.
 */
export function PartnerAvatar({
  name,
  src,
  alt,
  className,
  loading,
}: {
  name: string
  src?: string
  alt: string
  className?: string
  loading?: 'eager'
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={256}
        height={256}
        loading={loading}
        className={cn('relative rounded-full bg-card object-cover ring-4 ring-background', className)}
      />
    )
  }
  return (
    <span
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn(
        'relative flex items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground ring-4 ring-background select-none',
        className,
      )}
    >
      <span aria-hidden="true" className="text-[length:1.5em] leading-none">
        {partnerInitials(name)}
      </span>
    </span>
  )
}

/** A partner's wide banner, or a plain branded one of the same shape when they gave none. */
export function PartnerBanner({
  src,
  alt,
  sizes,
  preload,
}: {
  src?: string
  alt: string
  sizes: string
  preload?: boolean
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1500}
        height={500}
        preload={preload}
        sizes={sizes}
        className="size-full object-cover"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      data-plain-banner=""
      className="size-full bg-linear-to-br from-primary/40 via-primary/15 to-card"
    />
  )
}

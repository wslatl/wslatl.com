import { cn } from '@/lib/utils'

/**
 * The WSLATL mark as the brand kit ships it (public/brand/, see Images in
 * README.md), at 36px: the kit asks for 32 to 40 in a header, and for the
 * mark once per page, near the top. Decorative: the link around it carries
 * the name.
 */
export function Logo({ className }: { className?: string }) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- images.unoptimized: the file is exported at the size it shows
    <img src="/brand/wslatl-mark.webp" alt="" width={36} height={36} className={cn('size-9', className)} />
  )
}

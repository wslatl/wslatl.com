import { cn } from '@/lib/utils'

/**
 * The WSLATL mark as the brand kit ships it (public/brand/, see Images in
 * README.md), at 32px: the smallest the kit allows in a header (32 to 40),
 * and the kit shows the mark once per page, near the top. Decorative: the
 * link around it carries the name.
 */
export function Logo({ className }: { className?: string }) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- images.unoptimized: the file is exported at the size it shows
    <img src="/brand/wslatl-mark.webp" alt="" width={32} height={32} className={cn('size-8', className)} />
  )
}

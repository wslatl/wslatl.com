import { cn } from '@/lib/utils'

interface WordmarkProps {
  className?: string
  /** Classes for the "WSLATL" text, e.g. to hide it when space is tight. */
  textClassName?: string
}

/** The WSLATL mark (three rising bars) with the name set beside it. */
export function Wordmark({ className, textClassName }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {/* oxlint-disable-next-line nextjs/no-img-element -- tiny static SVG, nothing for next/image to optimize */}
      <img src="/favicon.svg" alt="" width={28} height={28} className="size-7" />
      <span className={cn('text-[15px] font-semibold tracking-[0.14em] text-foreground', textClassName)}>WSLATL</span>
    </span>
  )
}

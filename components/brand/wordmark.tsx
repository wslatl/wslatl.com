import { cn } from '@/lib/utils'

interface WordmarkProps {
  className?: string
  /** Hide the "WSLATL" text and show the mark alone. */
  markOnly?: boolean
}

/** The WSLATL mark (three rising bars) with the name set beside it. */
export function Wordmark({ className, markOnly = false }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, nothing for next/image to optimize */}
      <img src="/favicon.svg" alt="" width={28} height={28} className="size-7" />
      {!markOnly && (
        <span className="text-[15px] font-semibold tracking-[0.14em] text-foreground">WSLATL</span>
      )}
    </span>
  )
}

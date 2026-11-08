import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * How the admin shows a state: always in words and in colour together, as
 * the brand kit asks, so nobody has to tell amber from red. The colours are
 * the kit's status set (app/globals.css); info is the link blue.
 */
export type Tone = 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, { icon: LucideIcon; text: string; border: string; fill: string }> = {
  success: { icon: CircleCheck, text: 'text-success', border: 'border-success/40', fill: 'bg-success/5' },
  warning: { icon: TriangleAlert, text: 'text-warning', border: 'border-warning/40', fill: 'bg-warning/5' },
  // The fill stays at 5%: any stronger and the red title drops under 4.5:1.
  danger: { icon: CircleAlert, text: 'text-danger', border: 'border-danger/40', fill: 'bg-danger/5' },
  info: { icon: Info, text: 'text-link', border: 'border-link/40', fill: 'bg-link/5' },
}

/**
 * A message, titled with its state in a word or three ("Failed", "Wrong
 * password"). The icon and the title take the state's colour, the message
 * stays in Paper. busy turns the icon into a spinner.
 */
export function Notice({
  tone,
  title,
  busy = false,
  className,
  children,
}: {
  tone: Tone
  title?: React.ReactNode
  busy?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const { icon, text, border, fill } = tones[tone]
  const Mark = busy ? LoaderCircle : icon
  return (
    <div className={cn('flex gap-3 rounded-lg border px-3.5 py-3 text-sm leading-relaxed', border, fill, className)}>
      <Mark aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', text, busy && 'animate-spin')} />
      <div className="min-w-0 break-words">
        {title && <p className={cn('font-semibold', text)}>{title}</p>}
        {children && <p>{children}</p>}
      </div>
    </div>
  )
}

/** A state beside a heading, as a dot and a word in the state's colour. */
export function Badge({ tone, children }: { tone: Tone | 'neutral'; children: React.ReactNode }) {
  const look = tone === 'neutral' ? 'border-input/60 text-muted-foreground' : cn(tones[tone].border, tones[tone].text)
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', look)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

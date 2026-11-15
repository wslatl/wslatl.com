import { CircleCheck, CircleDashed, CircleX, Info, TriangleAlert } from 'lucide-react'
import { cn } from '../lib/cn'

/**
 * `neutral` is a state with nothing to say yet, such as a location with no
 * live data: grey, with a dashed circle, never a colour that reads as good
 * or bad. Its usual word is `platform.status.noData` in the app's messages.
 */
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const tones = {
  success: { classes: 'border-success/40 bg-success/10 text-success', Icon: CircleCheck },
  warning: { classes: 'border-warning/40 bg-warning/10 text-warning', Icon: TriangleAlert },
  danger: { classes: 'border-danger/40 bg-danger/10 text-danger', Icon: CircleX },
  info: { classes: 'border-info/40 bg-info/10 text-info', Icon: Info },
  neutral: { classes: 'border-input bg-muted/40 text-muted-foreground', Icon: CircleDashed },
} as const

export interface StatusBadgeProps {
  tone: StatusTone
  /** The state in words, for example "Operational". A state is never shown in colour alone. */
  children: React.ReactNode
  className?: string
}

/** A status in a rounded badge: a colour, an icon and always a word. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  const { classes, Icon } = tones[tone]

  return (
    <span
      data-tone={tone}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        classes,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {children}
    </span>
  )
}

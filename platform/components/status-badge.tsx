import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import { cn } from '../lib/cn'

export type StatusTone = 'success' | 'warning' | 'danger' | 'info'

const tones = {
  success: { classes: 'border-success/40 bg-success/10 text-success', Icon: CircleCheck },
  warning: { classes: 'border-warning/40 bg-warning/10 text-warning', Icon: TriangleAlert },
  danger: { classes: 'border-danger/40 bg-danger/10 text-danger', Icon: CircleX },
  info: { classes: 'border-info/40 bg-info/10 text-info', Icon: Info },
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

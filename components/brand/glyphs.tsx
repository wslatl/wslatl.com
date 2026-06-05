import { cn } from '@/lib/utils'

interface GlyphProps {
  className?: string
  strokeWidth?: number
}

export function HeartGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 8.4a4.3 4.3 0 0 1 7.5 1.9c0 5.6-7.5 10.2-7.5 10.2z" />
      <path d="M9.5 10.5l1.5 1.5 3-3" opacity="0.5" />
    </svg>
  )
}

export function ShieldGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <path d="M12 3l8 3v6c0 4.8-3.2 8.4-8 9.5-4.8-1.1-8-4.7-8-9.5V6l8-3z" />
      <path d="M8.5 12l2.5 2.5L15.5 10" opacity="0.6" />
    </svg>
  )
}

export function NodesGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7.5 7.5L11 16.5M16.5 7.5L13 16.5M8 6h8" opacity="0.5" />
    </svg>
  )
}

export function ServerStackGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <circle cx="7" cy="7" r="0.6" fill="currentColor" />
      <circle cx="7" cy="17" r="0.6" fill="currentColor" />
      <path d="M11 7h6M11 17h6" opacity="0.5" />
    </svg>
  )
}

export function ControllerGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <path d="M6 8h12a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3 3 3 0 0 1-2.6-1.5L14 12.5h-4l-1.4 2A3 3 0 0 1 6 16a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3z" />
      <path d="M8 11v2M7 12h2" opacity="0.6" />
      <circle cx="16" cy="11.5" r="0.6" fill="currentColor" opacity="0.6" />
      <circle cx="17.5" cy="13" r="0.6" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function LayersGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" opacity="0.55" />
      <path d="M3 17l9 5 9-5" opacity="0.3" />
    </svg>
  )
}

export function GlobeGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" opacity="0.55" />
    </svg>
  )
}

export function SupportGlyph({ className, strokeWidth = 1.4 }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden
    >
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M11 18a1 1 0 0 0 2 0v-2h-2v2z" />
      <path d="M16 9.5l1.5 1.5M19 8l1 1" opacity="0.45" />
    </svg>
  )
}

export function MissouriGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 16"
      fill="currentColor"
      className={cn(className)}
      aria-hidden
    >
      <path d="M2 4l3-1 3 1 2-1 3 1 4-1 3 1 2 1v8l-2 1-3-1-4 1-3-1-2 1-3-1-3 1V4z" opacity="0.7" />
    </svg>
  )
}

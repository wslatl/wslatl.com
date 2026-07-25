'use client'

import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function AnimatedBackground() {
  const reduced = useReducedMotion()
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 bg-background overflow-hidden pointer-events-none"
    >
      {/* Single slow indigo wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(59, 130, 246, 0.10) 0%, transparent 70%)',
          animation: reduced ? undefined : 'float 26s ease-in-out infinite',
        }}
      />
      {/* Subtle vignette from the bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 50% at 50% 100%, rgba(15, 23, 42, 0.55) 0%, transparent 65%)',
        }}
      />
      {/* Faint dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
    </div>
  )
}

import { cn } from '../lib/cn'

/**
 * The page's <main> landmark and the target of the skip link. tabIndex -1
 * lets the skip link move focus here (not just scroll), so the next Tab
 * lands on the first link in the page content in every browser and screen
 * readers announce the jump.
 */
export function Main({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className={cn('outline-none', className)}>
      {children}
    </main>
  )
}

/** The "Skip to main content" link. Put it first in <body>; it shows on keyboard focus. */
export function SkipLink({ children }: { children: React.ReactNode }) {
  return (
    <a href="#main-content" className="skip-link">
      {children}
    </a>
  )
}

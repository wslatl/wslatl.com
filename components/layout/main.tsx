import { cn } from '@/lib/utils'

/**
 * The page's <main> landmark and the target of the "Skip to main content"
 * link. tabIndex -1 lets the skip link actually move focus here (not just
 * scroll), so the next Tab lands on the first link in the page content in
 * every browser and screen readers announce the jump.
 */
export function Main({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className={cn('outline-none', className)}>
      {children}
    </main>
  )
}

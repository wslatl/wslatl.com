import { cn } from '../../lib/cn'

/**
 * The one card the admin's sign-in page, its 404 and its crash page sit on:
 * alone in the middle of the page, with the brand gradient only as the bar
 * along its top edge. An app with its own accounts puts its own sign-in
 * form on it too, so every sign-in looks the same.
 */
export function AdminCard({ centered = false, children }: { centered?: boolean; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div
        className={cn(
          'w-full max-w-sm overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/50',
          centered && 'text-center',
        )}
      >
        <div aria-hidden="true" className="brand-bar" />
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </main>
  )
}

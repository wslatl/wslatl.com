'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * When an admin page crashes. It says so plainly and offers another try. What
 * went wrong stays in the server's console, not on the page.
 */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card text-center shadow-2xl shadow-black/50">
        <div aria-hidden="true" className="brand-bar" />
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This page hit an error. Try again, and if it keeps happening, the server console has the details.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to the admin</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

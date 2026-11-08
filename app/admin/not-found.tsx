import type { Metadata } from 'next'
import Link from 'next/link'
import { TabTitle } from '@/components/layout/tab-title'

const title = 'Page not found'

export const metadata: Metadata = { title: { absolute: title } }

/**
 * The same plain 404 whether the admin is switched off or the page does not
 * exist, so it says nothing about which. The sign-in page's card, and the
 * same page as the knowledge base's admin.
 */
export default function AdminNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <TabTitle title={title} />
      <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card text-center shadow-2xl shadow-black/50">
        <div aria-hidden="true" className="brand-bar" />
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">There is nothing at this address.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-link underline underline-offset-4 hover:text-foreground">
            Go to wslatl.com
          </Link>
        </div>
      </div>
    </main>
  )
}

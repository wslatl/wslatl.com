// app/admin/not-found.tsx: export { default, metadata } from '@/platform/admin/pages/not-found'
import type { Metadata } from 'next'
import Link from 'next/link'
import { app } from '../app'
import { AdminCard } from '../components/card'
import { TabTitle } from '../components/tab-title'

const title = 'Page not found'

export const metadata: Metadata = { title: { absolute: title } }

/**
 * The same plain 404 whether the admin is switched off or the page does not
 * exist, so it says nothing about which. The sign-in page's card.
 */
export default function AdminNotFound() {
  return (
    <AdminCard centered>
      <TabTitle title={title} />
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">There is nothing at this address.</p>
      <Link href="/" className="mt-6 inline-block text-sm text-link underline underline-offset-4 hover:text-foreground">
        Go to {app.host}
      </Link>
    </AdminCard>
  )
}

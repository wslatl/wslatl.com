// app/admin/not-found.tsx: export { default, generateMetadata } from '@/platform/admin/pages/not-found'
// (A file from kit v0.1 that re-exports `metadata` still builds, with the title in English.)
import type { Metadata } from 'next'
import Link from 'next/link'
import { app, admin } from '../app'
import { AdminCard } from '../components/card'
import { TabTitle } from '../components/tab-title'
import { adminText } from '../server/text'

/** The English title, for an app/admin/not-found.tsx from kit v0.1. Re-export generateMetadata instead. */
export const metadata: Metadata = { title: { absolute: 'Page not found' } }

/** The tab's title, in the admin's language. */
export async function generateMetadata(): Promise<Metadata> {
  const t = adminText(await admin.locale())
  return { title: { absolute: t('notFound.title') } }
}

/**
 * The same plain 404 whether the admin is switched off or the page does not
 * exist, so it says nothing about which. The sign-in page's card, in the
 * language of the admin's language cookie, or English: nothing here asks
 * who is signed in.
 */
export default async function AdminNotFound() {
  const t = adminText(await admin.locale())
  const title = t('notFound.title')
  return (
    <AdminCard centered>
      <TabTitle title={title} />
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t('notFound.body')}</p>
      <Link href="/" className="mt-6 inline-block text-sm text-link underline underline-offset-4 hover:text-foreground">
        {t('notFound.goTo', { host: app.host })}
      </Link>
    </AdminCard>
  )
}

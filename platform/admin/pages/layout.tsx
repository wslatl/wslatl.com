// app/admin/layout.tsx, after the app's own stylesheet:
//   import '../globals.css'
//   export { default, metadata, viewport } from '@/platform/admin/pages/layout'
// An app whose check is its own makes the layout from its own admin, so the
// page's language can be the signed-in account's own (README.md):
//   import { admin } from '@/lib/admin'
//   import { adminLayout } from '@/platform/admin/pages/layout'
//   export { metadata, viewport } from '@/platform/admin/pages/layout'
//   export default adminLayout(admin)
import type { Metadata, Viewport } from 'next'
import { adminMessages } from '../../i18n/messages'
import type { Admin } from '../admin'
import { admin, app } from '../app'
import { AdminRoot } from '../components/root'

/**
 * The admin's root layout, beside the public site's. Never indexed: this
 * meta tag, the X-Robots-Tag header (next.mjs) and the routes' own headers
 * all say so, and the sitemap leaves the admin out. Its pages are rendered
 * on every request, since each reads the session cookie and .env. Every
 * page's own title is whole, in the admin's language (admin.titled); the
 * template is only for a page that gives none.
 */
export const metadata: Metadata = {
  title: { default: 'Admin', template: `%s | ${app.brand} admin` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  // A link out of the admin never tells the other site where it came from.
  referrer: 'no-referrer',
}

export const viewport: Viewport = {
  themeColor: '#0073c7',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

/**
 * The admin's <html>, in the admin's language (admin.locale), with the
 * admin's words for its client components. It lives here, and not on the
 * admin itself, so that only the layout loads the admin's fonts.
 */
export function adminLayout(target: Admin) {
  return async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const locale = await target.locale()
    return (
      <AdminRoot locale={locale} messages={adminMessages(locale)}>
        {children}
      </AdminRoot>
    )
  }
}

/** On the shared password: the language cookie's language, or English. */
export default adminLayout(admin)

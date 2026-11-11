// app/admin/layout.tsx, after the app's own stylesheet:
//   import '../globals.css'
//   export { default, metadata, viewport } from '@/platform/admin/pages/layout'
import type { Metadata, Viewport } from 'next'
import { app } from '../app'
import { AdminRoot } from '../components/root'

/**
 * The admin's root layout, beside the public site's. Never indexed: this
 * meta tag, the X-Robots-Tag header (next.mjs) and the routes' own headers
 * all say so, and the sitemap leaves the admin out. Its pages are rendered
 * on every request, since each reads the session cookie and .env.
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

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminRoot>{children}</AdminRoot>
}

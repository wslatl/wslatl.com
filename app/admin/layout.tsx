import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { siteConfig } from '@/config/site'
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

/**
 * The admin's own root layout, beside app/[locale]: English only, outside
 * the languages (proxy.ts never gives /admin one), and rendered on every
 * request, since every page here reads the session cookie and .env. The
 * site's look comes from the same stylesheet; nothing else from the public
 * layout (header, structured data) belongs here.
 *
 * Never indexed: this meta tag and the X-Robots-Tag header (next.config.mjs)
 * both say so, and the sitemap leaves it out. The README's "Admin and
 * updates" has the rest.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { default: 'Admin', template: `%s | ${siteConfig.brand} admin` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  )
}

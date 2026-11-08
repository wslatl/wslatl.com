import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { siteConfig } from '@/config/site'
import '../globals.css'
import './admin.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
// Release tags, commits and the updater log. The login page shows none, so
// the font is not preloaded, and until it arrives the system's own
// monospace stands in rather than a stretched Arial.
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
})

/**
 * The admin's own root layout, beside app/[locale]: English only, outside
 * the languages (proxy.ts never gives /admin one), and rendered on every
 * request, since every page here reads the session cookie and .env. The
 * site's stylesheet is shared, with the brand kit's own colours on top
 * (admin.css); nothing else from the public layout (header, structured
 * data) belongs here.
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
    <html lang="en" className={`dark admin ${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  )
}

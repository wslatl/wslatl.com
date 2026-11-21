import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { isLocale, locales, openGraphLocales } from '@/i18n/config'
import { getLocale, setLocale } from '@/i18n/locale'
import { words } from '@/i18n/words'
import { ogImage } from '@/lib/metadata'
import { SkipLink } from '@/platform/components/main'
import { fontClassNames } from '@/platform/fonts'
import '../globals.css'

// Only a fallback: every page sets its own title and description.
const title = `${siteConfig.brand}: Game Server, VPS and Dedicated Hosting in Missouri`
const description =
  'WSLATL is a small, application-only hosting company in Missouri: game servers, VPS, dedicated servers and web hosting, and we actually pick up.'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: `%s | ${siteConfig.brand}`,
  },
  description,
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Google shows the favicon beside every result. It takes PNG or ICO (not
  // SVG), square and larger than 48px, so the 192px PNG is listed for it; the
  // ICO holds the brand kit's own 16, 32 and 48px marks for browser tabs. The
  // mark's colours read on light and dark alike, so these are transparent.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: openGraphLocales.en,
    siteName: siteConfig.brand,
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: ogImage.url, alt: ogImage.alt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * This one setting covers every route below, which is why the pages do not
 * repeat it: the framework reads it from the top of the tree. Left false, it
 * rejects any address whose parameters were not built ahead of time (an
 * unknown game, a mistyped document) before the page can run, answering with
 * its own bare 404 page and logging an error for every bot that probes one.
 * True lets the page run and call notFound(), which is what renders ours.
 *
 * Nothing renders under a made-up language: proxy.ts gives every request a
 * real one before it reaches a route (i18n/routing.ts), and the layout below
 * answers 404 for any that still gets through.
 */
export const dynamicParams = true

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  // The brand blue, matching --primary. Discord and Slack colour the strip
  // down the side of a shared link with this, so near-black read as a fault
  // rather than as a choice.
  themeColor: siteConfig.themeColor,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // A language that is not ours is a 404, never a page: rendered, it would be
  // a copy of a real page with its own canonical address. proxy.ts should
  // never let one through, so this is the backstop if a path skips it. The
  // framework's own 404 answers here, since ours lives inside this layout.
  const requested = (await params).locale
  if (!isLocale(requested)) notFound()
  // Set before anything below renders: every Server Component under here
  // reads the language from this (i18n/locale.ts).
  setLocale(requested)
  const locale = getLocale()
  const t = words()

  return (
    // The kit's three typefaces (Geist, Geist Mono and Instrument Serif), by
    // the names its stylesheet reads.
    <html lang={locale} className={fontClassNames}>
      <body className="relative isolate min-h-dvh font-sans antialiased">
        <SkipLink>{t('header.skipToContent')}</SkipLink>
        {/* The blue wash at the top of every page. Static, so it costs nothing to scroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(0_121_206/0.13)_0%,transparent_70%)]"
        />
        {children}
      </body>
    </html>
  )
}

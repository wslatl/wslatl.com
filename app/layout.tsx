import type { Metadata, Viewport } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import { JsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'
import { shortLinks } from '@/config/links'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
// The serif is only ever set in italic (slogan, page titles, quotes), so the
// upright face is not loaded at all.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-serif',
})

const title = 'Cheap VPS & Game Server Hosting | WSLATL LLC'
const description =
  'Affordable VPS hosting, game server hosting (Minecraft, Rust, ARK, FiveM & more), and dedicated servers with DDoS protection and NVMe storage. Missouri-based, and we actually pick up.'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: '%s | WSLATL LLC',
  },
  description,
  applicationName: siteConfig.name,
  keywords: [
    'WSLATL',
    'cheap VPS hosting',
    'game server hosting',
    'Minecraft server hosting',
    'dedicated server hosting',
    'Missouri hosting',
    'DDoS protected hosting',
    'NVMe VPS',
    'Pterodactyl hosting',
    'private hosting',
    'application-only hosting',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
    title,
    description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WSLATL LLC: hosting that actually gives a damn',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
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

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/logo.png`,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'MO',
    addressCountry: 'US',
  },
  // Profiles by their real addresses: search engines match these, not redirects.
  sameAs: [shortLinks.discord.url, shortLinks.trustpilot.url, shortLinks.github.url],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${instrumentSerif.variable}`}>
      <body className="relative isolate min-h-dvh font-sans antialiased">
        <JsonLd data={organizationJsonLd} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
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

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { AnimatedBackground } from '@/components/brand/animated-background'
import { ScrollProgress } from '@/components/brand/scroll-progress'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const siteUrl = 'https://wslatl.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Cheap VPS & Game Server Hosting | WSLATL LLC',
    template: '%s | WSLATL LLC',
  },
  description:
    'Affordable VPS hosting, game server hosting (Minecraft, Rust, ARK, FiveM & more), and dedicated servers with DDoS protection and NVMe storage. Missouri-based, and we actually pick up.',
  applicationName: 'WSLATL LLC',
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
  authors: [{ name: 'WSLATL LLC' }],
  creator: 'WSLATL LLC',
  publisher: 'WSLATL LLC',
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
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'WSLATL LLC',
    title: 'Cheap VPS & Game Server Hosting | WSLATL LLC',
    description:
      'Affordable VPS hosting, game server hosting (Minecraft, Rust, ARK, FiveM & more), and dedicated servers with DDoS protection and NVMe storage. Missouri-based, and we actually pick up.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WSLATL LLC - Cheap VPS & Game Server Hosting',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cheap VPS & Game Server Hosting | WSLATL LLC',
    description:
      'Affordable VPS hosting, game server hosting (Minecraft, Rust, ARK, FiveM & more), and dedicated servers with DDoS protection and NVMe storage.',
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
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WSLATL LLC',
  url: siteUrl,
  logo: `${siteUrl}/favicon.png`,
  description:
    'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting.',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'MO',
    addressCountry: 'US',
  },
  sameAs: ['https://discord.gg/3eKawhSbAF'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="font-sans antialiased noise-overlay">
        {/* Static, hand-authored content only (see organizationJsonLd above) - never
            user input - so this is JSON-LD structured data, not an XSS surface. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollProgress />
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}

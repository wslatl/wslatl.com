import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { AnimatedBackground } from '@/components/animated-background'
import { ScrollProgress } from '@/components/scroll-progress'
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
    default: 'WSLATL LLC | Private Hosting, Personal Service',
    template: '%s | WSLATL LLC',
  },
  description:
    'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting. We treat every client like family.',
  applicationName: 'WSLATL LLC',
  keywords: [
    'WSLATL',
    'private hosting',
    'Missouri hosting',
    'dedicated servers',
    'game hosting',
    'Pterodactyl',
    'VPS hosting',
    'web hosting',
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
    title: 'WSLATL LLC | Private Hosting, Personal Service',
    description:
      'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting. We treat every client like family.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WSLATL LLC — Private Hosting, Personal Service',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WSLATL LLC | Private Hosting, Personal Service',
    description:
      'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting. We treat every client like family.',
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
        <ScrollProgress />
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}

/**
 * @type {import('next').NextConfig}
 */

const legalSlugs = [
  'privacy',
  'terms',
  'acceptable-use',
  'refund',
  'sla',
  'dmca',
  'abuse',
  'account-credit',
  'subprocessors',
  'backups',
]

// React needs eval() in development for its debugging tools. Production
// never does, so it only gets 'unsafe-eval' while running `next dev`.
const isDev = process.env.NODE_ENV === 'development'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
]

const nextConfig = {
  poweredByHeader: false,
  images: {
    // Every image in /public is already exported at its display size (see
    // README), so there is nothing left for a runtime optimizer to do.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // Legal documents moved from the site root to /legal on 2026-09-19. Old
      // links live on in emails, forms, the billing portal, and search results,
      // so every old path keeps working. tests/links.test.ts checks this list
      // covers every document in data/legal.ts.
      ...legalSlugs.map((slug) => ({ source: `/${slug}`, destination: `/legal/${slug}`, permanent: true })),
      // This page always described BeamMP; the old slug was a leftover.
      { source: '/games/rust-console', destination: '/games/beammp', permanent: true },
      // Neither game can be hosted by a third party (EA runs Battlefield 2042
      // Portal servers; Hell Let Loose servers are only rented through its
      // licensed partners), so their pages are gone.
      { source: '/games/battlefield-2042-portal', destination: '/games', permanent: true },
      { source: '/games/hell-let-loose', destination: '/games', permanent: true },
    ]
  },
}

export default nextConfig

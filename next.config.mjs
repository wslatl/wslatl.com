import { execFileSync } from 'node:child_process'
import shortLinks from './config/links.json' with { type: 'json' }
import { parseVersion } from './scripts/updater/release.mjs'

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
    value: 'camera=(), microphone=(), geolocation=()',
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

// The admin is for the owner only: never indexed, wherever a link to it
// turns up. Its pages also carry a robots meta tag. robots.txt leaves it
// out on purpose: a disallowed page is never fetched, so its noindex would
// never be seen.
const adminHeaders = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]

/**
 * What this build is, for the admin dashboard (lib/admin/build-info.ts): the
 * release the updater built it from, SITE_RELEASE, and its commit,
 * SITE_COMMIT. A downloaded release has no git history, so the updater
 * (scripts/serve.mjs) passes both; a build from a git checkout asks git for
 * the commit. A folder uploaded by hand has no release, and the dashboard
 * says so. Only server code in lib/admin reads them.
 */
function siteRelease() {
  const tag = process.env.SITE_RELEASE ?? ''
  return parseVersion(tag) ? tag : ''
}

function siteCommit() {
  if (/^[0-9a-f]{40}$/.test(process.env.SITE_COMMIT ?? '')) return process.env.SITE_COMMIT
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

/** @satisfies {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // This folder, always. The updater builds each release in a folder inside
  // the uploaded copy of the site, and Next would otherwise take the outer
  // package-lock.json as the workspace root (and warn about it).
  turbopack: {
    root: import.meta.dirname,
  },
  env: {
    SITE_RELEASE: siteRelease(),
    SITE_COMMIT: siteCommit(),
  },
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
      { source: '/admin', headers: adminHeaders },
      { source: '/admin/:path*', headers: adminHeaders },
    ]
  },
  async redirects() {
    const moved = [
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
      // The old logo's SVG icon went with it on 2026-11-07. The new logo ships
      // as pictures only, so anything that kept the address gets the PNG icon.
      { source: '/favicon.svg', destination: '/icon-192.png', permanent: true },
    ]
    return [
      ...moved,
      // The same moves under /en, straight to where they end: otherwise
      // /en/privacy goes to /privacy and only then to /legal/privacy, a chain
      // search engines follow less willingly than one hop.
      ...moved.map((rule) => ({ ...rule, source: `/en${rule.source}` })),
      // English is served at the plain paths (proxy.ts rewrites them),
      // so /en/... would be a second address for the same page.
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      // Short links: /billing, /discord, and the rest. Every page links to
      // these paths instead of the panel or profile itself, so a destination
      // changes in config/links.json alone. Temporary on purpose: browsers
      // cache permanent redirects and would keep using an old destination.
      ...Object.values(shortLinks).map(({ path, url }) => ({ source: path, destination: url, permanent: false })),
    ]
  },
}

export default nextConfig

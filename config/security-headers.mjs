// The security headers, in one place. next.config.mjs sends securityHeaders
// with every response, the public Content Security Policy with every one
// outside the admin, and proxy.ts gives the admin its own, stricter policy.
//
// Two policies, because there are two kinds of page:
//
//   - Every public page is built ahead of time, the same for everyone, and
//     Next writes each page's data into it as inline scripts. A nonce has to
//     be new for every request, which a page built once cannot be, so the
//     public policy allows inline scripts. No public page shows anything a
//     visitor sent, or anything from outside this repository.
//   - The admin's pages are rendered for each request, hold the session, and
//     show text from GitHub (the release notes). Each one gets a fresh nonce
//     (proxy.ts), and only the scripts that carry it run: no 'unsafe-inline'
//     for scripts or styles. tests/http and the ZAP scan in
//     .github/workflows/security.yml check both.
//
// React needs eval() in development for its debugging tools. Production never
// does, so `dev` adds 'unsafe-eval' only while running `next dev`. Nothing in
// here reads the environment: next.config.mjs and proxy.ts pass `dev` in.

/** Sent with every response, the admin's included. */
export const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Two years, every subdomain, and ready for the browsers' preload list.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

/**
 * The policy of every page outside the admin.
 * @param {{ dev?: boolean }} [options]
 */
export function publicPolicy({ dev = false } = {}) {
  return [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

/**
 * The admin's policy. With a nonce, the inline scripts that carry it run and
 * no others do; without one (the 405 answer, which is no page), none at all.
 * Its pages have no inline styles, so none are allowed, apart from in
 * development, where Next adds its own.
 * @param {{ nonce?: string, dev?: boolean }} [options]
 */
export function adminPolicy({ nonce, dev = false } = {}) {
  const scripts = ["'self'", nonce && `'nonce-${nonce}'`, dev && "'unsafe-eval'"].filter(Boolean).join(' ')
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `style-src 'self'${dev ? " 'unsafe-inline'" : ''}`,
    `script-src ${scripts}`,
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

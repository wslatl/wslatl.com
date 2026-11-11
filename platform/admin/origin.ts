/**
 * Whether the page that sent a request is on this same site: the browser
 * says so in Origin, and in Sec-Fetch-Site when it sends one. Next checks its
 * own Server Actions the same way. Plain, with no server-only import, so the
 * app's proxy.ts can use it as well as the admin's routes.
 */
export function sameOrigin(headers: Headers): boolean {
  const fetchSite = headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') return false
  const origin = headers.get('origin')
  const host = (headers.get('x-forwarded-host')?.split(',')[0] ?? headers.get('host'))?.trim().toLowerCase()
  if (!origin || !host || origin === 'null') return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

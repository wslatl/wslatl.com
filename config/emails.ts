import 'server-only'

/**
 * WSLATL's email addresses. Never render one directly: use
 * <Email name="support" /> from components/ui/email.tsx, which sends the
 * address to the browser scrambled and only rebuilds it once a person is
 * using the page. Scrapers that read the HTML get a button, not an address.
 *
 * The server-only import fails the build if a Client Component imports this
 * file, since that would put every address in a JavaScript bundle as written.
 */
export const emails = {
  support: 'support@wslatl.com',
  info: 'info@wslatl.com',
  abuse: 'abuse@wslatl.com',
  dmca: 'dmca@wslatl.com',
} as const

export type EmailName = keyof typeof emails

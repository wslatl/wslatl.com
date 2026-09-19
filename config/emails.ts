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
  /** The main address. Everything else forwards here. */
  support: 'support@wslatl.com',
  /** The friendlier general address, offered alongside support. */
  hello: 'hello@wslatl.com',
  /** Abuse reports, the address other network operators expect (RFC 2142). */
  abuse: 'abuse@wslatl.com',
  /** Copyright notices, named in the DMCA Policy as the agent's address. */
  dmca: 'dmca@wslatl.com',
} as const

export type EmailName = keyof typeof emails

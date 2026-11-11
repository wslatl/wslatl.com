/**
 * Cleaning for everything that goes into an email: words, links and
 * addresses of pictures. Nothing here is specific to HTML or to plain text.
 */

// Control characters, zero-width characters, and the marks that flip the
// direction of text. None belongs in an email's words.
// oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
const UNDRAWABLE = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g

/**
 * One line of words, safe to put anywhere in the layout.
 *
 * Control and direction-changing characters are removed and every run of
 * white space becomes one space, so no field can start a new line, a new
 * header or a new paragraph. The brand writes with no em dash, no en dash and
 * no middle dot, so a dash becomes a spaced hyphen and a middle dot becomes a
 * comma, even in a word the layout was handed (an incident title typed into
 * an admin page, say).
 */
export function clean(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(UNDRAWABLE, '')
    .replace(/\s*[\u2012-\u2015]\s*/g, ' - ')
    .replace(/\u2212/g, '-')
    .replace(/\s*[\u00b7\u2219\u22c5\u30fb]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Escapes a text for HTML, both between tags and inside a quoted attribute. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Raised for a link or picture address the layout will not put in an email. */
export class EmailLinkError extends Error {
  constructor(what: string, reason: string) {
    super(`The ${what} cannot be used in an email: ${reason}`)
    this.name = 'EmailLinkError'
  }
}

const MAX_URL = 2048

/**
 * An address as it may appear in a link: the browser's own reading of it, so
 * odd characters are percent-encoded, or an error.
 *
 * Links may be https, http or mailto. A picture may also be a `cid:` address,
 * for a picture attached to the message and not fetched from the web, which is
 * what the brand guide asks for. Anything else, such as javascript: or data:,
 * a web address with a name and password in it, or an address with white space
 * or a control character in it, is refused rather than quietly dropped, so a
 * mistake shows up in the first test and not in a client's inbox.
 */
export function safeUrl(value: unknown, what: string, allowed: readonly string[]): string {
  if (typeof value !== 'string' || value.trim() === '') throw new EmailLinkError(what, 'it is empty')
  const text = value.trim()
  if (text.length > MAX_URL) throw new EmailLinkError(what, 'it is too long')
  // oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
  if (/[\s\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/.test(text)) {
    throw new EmailLinkError(what, 'it has white space or a control character in it')
  }
  let url: URL
  try {
    url = new URL(text)
  } catch {
    throw new EmailLinkError(what, 'it is not a full address')
  }
  if (!allowed.includes(url.protocol)) throw new EmailLinkError(what, `${url.protocol} addresses are not allowed`)
  if (url.username || url.password) throw new EmailLinkError(what, 'it has a name or password in it')
  if (url.protocol !== 'cid:' && url.protocol !== 'mailto:' && !url.hostname) throw new EmailLinkError(what, 'it has no host')
  return url.href
}

export const LINK_PROTOCOLS = ['https:', 'http:', 'mailto:'] as const
export const IMAGE_PROTOCOLS = ['https:', 'http:', 'cid:'] as const

import { IMAGE_PROTOCOLS, LINK_PROTOCOLS, clean, escapeHtml, safeUrl } from './text'

/**
 * The one layout every WSLATL email uses: status invites, subscribe
 * confirmations and incident emails, the notification gateway's sign-in code
 * and unsubscribe footers.
 *
 * It follows the brand guide: facts first, no marketing copy, no slogan, and
 * a sign-off with a name, a role and a direct link. It is dark on purpose,
 * like every WSLATL page. It is a table with inline styles, so it holds up in
 * Gmail, Outlook and Apple Mail, and it names no web font: Geist is tried
 * first for people who have it installed, then the system fonts.
 */

// The brand colours. See the brand guide, section 4.
const PAGE = '#050505'
const INK = '#0F090B'
const LINE = '#262021'
const PAPER = '#F1EDEE'
const MUTED = '#9A8A8F'
const PRIMARY = '#0079CE'
const LINK = '#48C5FF'
const ON_PRIMARY = '#FFFFFF'

const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"

export interface EmailLink {
  label: string
  /** An https, http or mailto address. Anything else is refused. */
  url: string
}

export interface EmailRow {
  label: string
  value: string
  /** Set the value in the monospace face: a code, an address, an ID or an amount. */
  mono?: boolean
}

export interface EmailParts {
  /** The message's language, such as `en`. Defaults to `en`. */
  lang?: string
  /** The page title some clients show. Defaults to the heading. */
  title?: string
  /** The line an inbox shows beside the subject. Say the fact here, not a greeting. */
  preheader: string
  /**
   * The real logo artwork, as an address of a picture: the shipped lockup,
   * never typed text. Use a `cid:` address for a picture attached to the
   * message, which the brand guide prefers to a link to the web.
   */
  logo: {
    url: string
    /** Read out when the picture is not shown. */
    alt: string
    /** Drawn size in pixels. The lockup is 3.5 times as wide as it is tall. Defaults to 140 by 40. */
    width?: number
    height?: number
  }
  heading: string
  paragraphs: string[]
  /** A code to type in, such as a sign-in code, set large. */
  code?: string
  /** Facts as label and value pairs: dates, amounts, IDs, the service affected. */
  rows?: EmailRow[]
  /** The one thing to do. */
  button?: { label: string; url: string }
  /**
   * The brand guide's sign-off: the mark at 32px, then the name, then the
   * role, then a direct Discord or email link. No slogan.
   */
  signOff?: {
    name: string
    role: string
    link: EmailLink
    /** The mark, drawn at 32 by 32 pixels. Leave out for a sign-off without it. */
    markUrl?: string
  }
  /** Small print at the bottom: why this was sent, and links such as unsubscribe. */
  footer?: (string | EmailLink)[]
}

export interface RenderedEmail {
  html: string
  text: string
}

const LANG = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/

function size(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 600 ? (value as number) : fallback
}

/** A link's words and address, both cleaned, the address refused unless it is one a link may have. */
const link = (value: EmailLink, what: string) => ({
  label: clean(value.label) || clean(value.url),
  url: safeUrl(value.url, what, LINK_PROTOCOLS),
})

/** Everything cleaned, escaped and checked once, so the HTML and the text are built from the same facts. */
function prepare(parts: EmailParts) {
  const heading = clean(parts.heading)
  return {
    lang: typeof parts.lang === 'string' && LANG.test(parts.lang) ? parts.lang : 'en',
    title: clean(parts.title) || heading,
    preheader: clean(parts.preheader),
    logo: {
      url: safeUrl(parts.logo?.url, 'logo address', IMAGE_PROTOCOLS),
      alt: clean(parts.logo?.alt),
      width: size(parts.logo?.width, 140),
      height: size(parts.logo?.height, 40),
    },
    heading,
    paragraphs: (parts.paragraphs ?? []).map(clean).filter(Boolean),
    code: clean(parts.code),
    rows: (parts.rows ?? [])
      .map((row) => ({ label: clean(row.label), value: clean(row.value), mono: row.mono === true }))
      .filter((row) => row.label || row.value),
    button: parts.button ? link(parts.button, 'button address') : undefined,
    signOff: parts.signOff
      ? {
          name: clean(parts.signOff.name),
          role: clean(parts.signOff.role),
          link: link(parts.signOff.link, 'sign-off link'),
          markUrl: parts.signOff.markUrl ? safeUrl(parts.signOff.markUrl, 'mark address', IMAGE_PROTOCOLS) : undefined,
        }
      : undefined,
    footer: (parts.footer ?? [])
      .map((line) => (typeof line === 'string' ? clean(line) : link(line, 'footer link')))
      .filter((line) => (typeof line === 'string' ? line !== '' : true)),
  }
}

type Prepared = ReturnType<typeof prepare>

const e = escapeHtml

function anchor(url: string, label: string, extra = ''): string {
  return `<a href="${e(url)}" style="color:${LINK};text-decoration:underline;${extra}">${e(label)}</a>`
}

function renderHtml(m: Prepared): string {
  const body: string[] = []

  body.push(
    `<h1 style="margin:0 0 16px;font-family:${SANS};font-size:24px;line-height:32px;font-weight:600;color:${PAPER};">${e(m.heading)}</h1>`,
  )
  for (const paragraph of m.paragraphs) {
    body.push(
      `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:25px;color:${PAPER};">${e(paragraph)}</p>`,
    )
  }

  if (m.code) {
    body.push(
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr>` +
        `<td bgcolor="#1A1416" style="background-color:#1A1416;border:1px solid ${LINE};border-radius:8px;padding:14px 24px;font-family:${MONO};font-size:32px;line-height:40px;letter-spacing:6px;font-weight:600;color:${PAPER};">${e(m.code)}</td>` +
        `</tr></table>`,
    )
  }

  if (m.rows.length > 0) {
    const rows = m.rows
      .map(
        (row) =>
          `<tr>` +
          `<td valign="top" width="38%" style="padding:10px 12px 10px 0;border-top:1px solid ${LINE};font-family:${SANS};font-size:14px;line-height:21px;color:${MUTED};">${e(row.label)}</td>` +
          `<td valign="top" style="padding:10px 0;border-top:1px solid ${LINE};font-family:${row.mono ? MONO : SANS};font-size:15px;line-height:21px;color:${PAPER};word-break:break-word;">${e(row.value)}</td>` +
          `</tr>`,
      )
      .join('')
    body.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;border-bottom:1px solid ${LINE};">${rows}</table>`,
    )
  }

  if (m.button) {
    const href = e(m.button.url)
    const label = e(m.button.label)
    const width = Math.min(480, 56 + m.button.label.length * 9)
    body.push(
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 12px;"><tr><td>` +
        `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:${width}px;" arcsize="17%" stroke="f" fillcolor="${PRIMARY}"><w:anchorlock/><center style="color:${ON_PRIMARY};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${label}</center></v:roundrect><![endif]-->` +
        `<!--[if !mso]><!-->` +
        `<a href="${href}" style="display:inline-block;background-color:${PRIMARY};border-radius:8px;padding:14px 28px;font-family:${SANS};font-size:16px;line-height:20px;font-weight:600;color:${ON_PRIMARY};text-decoration:none;">${label}</a>` +
        `<!--<![endif]-->` +
        `</td></tr></table>`,
      // The address in full, for a client that blocks buttons or a reader who wants to check it.
      `<p style="margin:0 0 24px;font-family:${SANS};font-size:13px;line-height:20px;color:${MUTED};word-break:break-all;">${anchor(m.button.url, m.button.url)}</p>`,
    )
  }

  if (m.signOff) {
    const s = m.signOff
    const mark = s.markUrl
      ? `<td valign="top" width="44" style="padding:0 12px 0 0;"><img src="${e(s.markUrl)}" width="32" height="32" alt="" style="display:block;width:32px;height:32px;border:0;outline:none;"></td>`
      : ''
    body.push(
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0;"><tr>${mark}` +
        `<td valign="top" style="font-family:${SANS};font-size:15px;line-height:21px;color:${PAPER};">` +
        `<strong style="font-weight:600;color:${PAPER};">${e(s.name)}</strong><br>` +
        `<span style="color:${MUTED};">${e(s.role)}</span><br>` +
        `${anchor(s.link.url, s.link.label)}` +
        `</td></tr></table>`,
    )
  }

  const footer =
    m.footer.length > 0
      ? `<tr><td class="px" bgcolor="${INK}" style="background-color:${INK};padding:20px 40px 28px;border-top:1px solid ${LINE};">` +
        m.footer
          .map(
            (line) =>
              `<p style="margin:0 0 6px;font-family:${SANS};font-size:13px;line-height:20px;color:${MUTED};">${
                typeof line === 'string' ? e(line) : anchor(line.url, line.label)
              }</p>`,
          )
          .join('') +
        `</td></tr>`
      : ''

  const filler = '&#847;&zwnj;&nbsp;'.repeat(40)

  return (
    `<!doctype html>\n` +
    `<html lang="${e(m.lang)}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n` +
    `<head>\n` +
    `<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    `<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n` +
    `<meta name="color-scheme" content="dark">\n` +
    `<meta name="supported-color-schemes" content="dark">\n` +
    `<title>${e(m.title)}</title>\n` +
    `<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->\n` +
    `<style>\n` +
    `:root{color-scheme:dark;supported-color-schemes:dark}\n` +
    `body{margin:0;padding:0;background-color:${PAGE}}\n` +
    `a{color:${LINK}}\n` +
    `@media (max-width:620px){.px{padding-left:24px!important;padding-right:24px!important}.outer{padding:16px 8px!important}}\n` +
    `</style>\n` +
    `</head>\n` +
    `<body style="margin:0;padding:0;background-color:${PAGE};" bgcolor="${PAGE}">\n` +
    `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${PAGE};opacity:0;">${e(m.preheader)}${filler}</div>\n` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAGE}" style="background-color:${PAGE};"><tr>` +
    `<td class="outer" align="center" bgcolor="${PAGE}" style="background-color:${PAGE};padding:32px 16px;">\n` +
    `<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\n` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK}" style="max-width:600px;background-color:${INK};border:1px solid ${LINE};border-radius:16px;border-collapse:separate;">\n` +
    `<tr><td class="px" bgcolor="${INK}" style="background-color:${INK};padding:32px 40px 8px;">` +
    `<img src="${e(m.logo.url)}" width="${m.logo.width}" height="${m.logo.height}" alt="${e(m.logo.alt)}" style="display:block;width:${m.logo.width}px;height:${m.logo.height}px;border:0;outline:none;color:${PAPER};font-family:${SANS};font-size:16px;">` +
    `</td></tr>\n` +
    `<tr><td class="px" bgcolor="${INK}" style="background-color:${INK};padding:24px 40px 32px;">\n` +
    body.join('\n') +
    `\n</td></tr>\n` +
    footer +
    `\n</table>\n` +
    `<!--[if mso]></td></tr></table><![endif]-->\n` +
    `</td></tr></table>\n` +
    `</body>\n` +
    `</html>\n`
  )
}

function renderText(m: Prepared): string {
  const blocks: string[] = [m.heading, ...m.paragraphs]

  if (m.code) blocks.push(`    ${m.code}`)
  if (m.rows.length > 0) blocks.push(m.rows.map((row) => `${row.label}: ${row.value}`).join('\n'))
  if (m.button) blocks.push(`${m.button.label}:\n${m.button.url}`)
  if (m.signOff) blocks.push(`${m.signOff.name}\n${m.signOff.role}\n${m.signOff.link.label}: ${m.signOff.link.url}`)
  if (m.footer.length > 0) {
    blocks.push(
      '--\n' + m.footer.map((line) => (typeof line === 'string' ? line : `${line.label}: ${line.url}`)).join('\n'),
    )
  }

  return blocks.join('\n\n') + '\n'
}

/**
 * Builds one email from plain parts. Returns the HTML and a plain-text
 * version that reads well on its own, to send together as the two
 * alternatives of one message.
 *
 * Every word is escaped for HTML, cleaned of anything that could start a new
 * line or flip the text's direction, and has any em dash, en dash or middle
 * dot changed, because the brand writes with none. A link or picture address
 * that is not https, http, mailto (or `cid:` for a picture) throws an
 * EmailLinkError rather than being dropped without a word.
 */
export function renderEmail(parts: EmailParts): RenderedEmail {
  const prepared = prepare(parts)
  return { html: renderHtml(prepared), text: renderText(prepared) }
}

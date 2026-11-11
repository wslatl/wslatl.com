/**
 * Plain-text helpers for the words on a share card. They are small and have
 * no dependencies, so the checks on hostile input can be tested without
 * drawing anything.
 */

/** The most characters looked at, however long the text given is. Keeps every later step cheap. */
const LOOK_AT = 2000

// Control characters, zero-width characters, and the marks that flip the
// direction of text. None can be drawn usefully and the last group can make
// a card read backwards.
// oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
const UNDRAWABLE = /[\u0000-\u0008\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g

// White space, except the no-break spaces (U+00A0, U+2007 and U+202F). Those
// hold a word to the next one, as French holds a number to its % sign; made a
// plain space, they would let a card break the line between the two.
const BREAKING_SPACE = /[^\S\u00a0\u2007\u202f]+/g

/** One line of text: undrawable characters removed, every run of white space made a single space, and no-break spaces kept. */
export function oneLine(text: unknown): string {
  if (typeof text !== 'string') return ''
  return text.slice(0, LOOK_AT).replace(UNDRAWABLE, '').replace(BREAKING_SPACE, ' ').trim()
}

/** Cuts a text that is longer than the card has room for at a word, with an ellipsis. */
export function clampText(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text
    .slice(0, max)
    .replace(/[\ud800-\udbff]$/, '')
    .replace(/\s+\S*$/, '')
    .replace(/[\s,;:]+$/, '')
  return `${cut}\u2026`
}

/**
 * Ties the last two words together with a no-break space, so a text never
 * ends on a word alone on its line: a title breaks before "from $8.18/mo"
 * rather than leaving the price by itself. A text of two words keeps its one
 * place to break: tied, two words too wide for one line could not break at
 * all.
 */
export function tieEnd(text: string): string {
  if (text.trim().split(/\s+/).length < 3) return text
  return text.replace(/ (\S+)$/, '\u00a0$1')
}

/** An address as the card shows it: no scheme, no trailing slash, and short. */
export function cardAddress(address: unknown): string {
  return clampText(oneLine(address).replace(/^https?:\/\//i, '').replace(/\/+$/, ''), 60)
}

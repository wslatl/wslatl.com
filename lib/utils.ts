import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Letters that are their own character rather than a letter plus an accent,
 * so NFKD leaves them whole and they would otherwise become a hyphen:
 * "Kontoschlie\u00dfung" turned into "kontoschlie-ung".
 */
const standaloneLetters: [RegExp, string][] = [
  [/\u00df/g, 'ss'],
  [/\u00e6/g, 'ae'],
  [/\u0153/g, 'oe'],
  [/\u00f8/g, 'o'],
  [/\u0111|\u00f0/g, 'd'],
  [/\u0142/g, 'l'],
  [/\u00fe/g, 'th'],
]

/**
 * Lowercase with the accents taken off: "Construcci\u00f3n" -> "construccion",
 * "\u00dcberleben" -> "uberleben". Lets text in any of the site's languages be
 * matched, or turned into an anchor, using plain a-z.
 */
export function foldText(text: string): string {
  let out = text.toLowerCase()
  for (const [letter, replacement] of standaloneLetters) out = out.replace(letter, replacement)
  return out.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

/** "Who We Are" -> "who-we-are". For heading anchors. */
export function slugify(text: string): string {
  return foldText(text)
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

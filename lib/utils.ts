import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "Who We Are" -> "who-we-are". For heading anchors. */
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

export function slugify(text: string): string {
  let out = text.toLowerCase()
  for (const [letter, replacement] of standaloneLetters) out = out.replace(letter, replacement)
  return out
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

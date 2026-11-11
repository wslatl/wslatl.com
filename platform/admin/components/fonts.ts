import { Geist, Geist_Mono } from 'next/font/google'

/**
 * The admin's two faces, with the variable names tokens.css reads. Geist
 * Mono is for release tags, commits and the updater log. The sign-in page
 * shows none, so it is not preloaded, and until it arrives the system's own
 * monospace stands in rather than a stretched Arial.
 */
export const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
})

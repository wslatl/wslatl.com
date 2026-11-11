import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'

/*
 * The three typefaces, with the variable names tokens.css expects. Import
 * `fontClassNames` in the root layout and put it on <html>:
 *
 *   <html lang="en" className={fontClassNames}>
 */
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
// Mono is set only for codes and values on a few pages, so it is not
// preloaded on every page: the browser fetches it where a page uses it.
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', preload: false })
// The serif is only ever set in italic (page titles, quotes), so the upright
// face is not loaded at all.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-serif',
})

export { geist, geistMono, instrumentSerif }

/** The class names of all three fonts, for <html>. */
export const fontClassNames = `${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`

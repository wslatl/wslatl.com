import type { Locale } from '@/i18n/config'

/**
 * The words on the error boundary. It runs in the browser and is loaded with
 * every page, so it keeps its own small set of strings instead of pulling in
 * the full dictionaries (i18n/copy/).
 */
export interface ErrorCopy {
  heading: string
  bodyPrefix: string
  discordLink: string
  bodySuffix: string
  tryAgain: string
  home: string
  newTab: string
}

const english: ErrorCopy = {
  heading: 'Something broke on our end.',
  bodyPrefix: 'This page failed to load. Try again, and if it keeps happening,',
  discordLink: 'let us know on Discord',
  bodySuffix: 'so we can fix it.',
  tryAgain: 'Try again',
  home: 'Go to the home page',
  newTab: ' (opens in a new tab)',
}

export const errorCopy: Record<Locale, ErrorCopy> = {
  en: english,
  es: english,
  fr: english,
  de: english,
  pt: english,
}

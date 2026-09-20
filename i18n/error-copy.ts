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

export const errorCopy: Record<Locale, ErrorCopy> = {
  en: {
    heading: 'Something broke on our end.',
    bodyPrefix: 'This page failed to load. Try again, and if it keeps happening,',
    discordLink: 'let us know on Discord',
    bodySuffix: 'so we can fix it.',
    tryAgain: 'Try again',
    home: 'Go to the home page',
    newTab: ' (opens in a new tab)',
  },
  es: {
    heading: 'Algo falló de nuestro lado.',
    bodyPrefix: 'Esta página no se pudo cargar. Inténtalo de nuevo y, si sigue pasando,',
    discordLink: 'avísanos en Discord',
    bodySuffix: 'para que lo arreglemos.',
    tryAgain: 'Intentar de nuevo',
    home: 'Ir a la página de inicio',
    newTab: ' (se abre en una pestaña nueva)',
  },
  fr: {
    heading: 'Quelque chose a cassé de notre côté.',
    bodyPrefix: "Cette page n'a pas pu se charger. Réessayez, et si cela continue,",
    discordLink: 'dites-le nous sur Discord',
    bodySuffix: 'pour que nous puissions la réparer.',
    tryAgain: 'Réessayer',
    home: "Aller à la page d'accueil",
    newTab: ' (ouvre un nouvel onglet)',
  },
  de: {
    heading: 'Bei uns ist etwas schiefgelaufen.',
    bodyPrefix: 'Diese Seite konnte nicht geladen werden. Versuch es noch einmal, und wenn es weiter passiert,',
    discordLink: 'sag uns auf Discord Bescheid',
    bodySuffix: 'damit wir es beheben können.',
    tryAgain: 'Noch einmal versuchen',
    home: 'Zur Startseite',
    newTab: ' (wird in einem neuen Tab geöffnet)',
  },
  pt: {
    heading: 'Algo quebrou do nosso lado.',
    bodyPrefix: 'Esta página não carregou. Tente de novo e, se continuar acontecendo,',
    discordLink: 'avise a gente no Discord',
    bodySuffix: 'para que possamos corrigir.',
    tryAgain: 'Tentar de novo',
    home: 'Ir para a página inicial',
    newTab: ' (abre em uma nova aba)',
  },
}

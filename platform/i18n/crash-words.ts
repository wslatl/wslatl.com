import type { Locale } from './config'

/**
 * The crash page's words in the five languages, for the two error pages
 * that are Client Components in every page's script: app/[locale]/error.tsx
 * and app/global-error.tsx. The last renders with no layout, so with no
 * messages and no provider. Reading the messages there would put a whole
 * language file in every reader's script, the admin's words with it, so
 * these few are kept here as plain text. They are a copy of `errors.crash`
 * in messages/<locale>.json, which stays the source: a test fails the
 * moment the two differ.
 *
 * `body` holds one <link> around the words that ask for help, as the
 * message does. linkParts splits it without an ICU runtime:
 *
 *   const { before, link, after } = linkParts(crashWords[locale].body)
 *   <GlobalErrorPage ...>{before}<a href="/discord" style={globalErrorLinkStyle}>{link}</a>{after}</GlobalErrorPage>
 */
export type CrashWords = { title: string; heading: string; body: string; retry: string; home: string; reference: string; discord: string }

export const crashWords: Readonly<Record<Locale, CrashWords>> = Object.freeze({
  en: {
    title: 'Something went wrong',
    heading: 'Something broke on our end.',
    body: 'This page failed to load. Try again, and if it keeps happening, <link>let us know</link> so we can fix it.',
    retry: 'Try again',
    home: 'Go to the home page',
    reference: 'Reference code',
    discord: 'Ask in Discord',
  },
  es: {
    title: 'Algo salió mal',
    heading: 'Algo falló de nuestro lado.',
    body: 'Esta página no se pudo cargar. Inténtalo de nuevo y, si sigue pasando, <link>avísanos</link> para que lo arreglemos.',
    retry: 'Intentar de nuevo',
    home: 'Ir a la página de inicio',
    reference: 'Código de referencia',
    discord: 'Preguntar en Discord',
  },
  fr: {
    title: 'Un problème est survenu',
    heading: 'Quelque chose a cassé de notre côté.',
    body: "Cette page n'a pas pu se charger. Réessayez et, si le problème persiste, <link>prévenez-nous</link> pour que nous le corrigions.",
    retry: 'Réessayer',
    home: "Aller à la page d'accueil",
    reference: 'Code de référence',
    discord: 'Demander sur Discord',
  },
  de: {
    title: 'Etwas ist schiefgelaufen',
    heading: 'Bei uns ist etwas schiefgelaufen.',
    body: 'Diese Seite konnte nicht geladen werden. Versuch es noch einmal, und wenn es weiter passiert, <link>sag uns Bescheid</link>, damit wir es beheben können.',
    retry: 'Noch einmal versuchen',
    home: 'Zur Startseite',
    reference: 'Referenzcode',
    discord: 'Auf Discord fragen',
  },
  pt: {
    title: 'Algo deu errado',
    heading: 'Algo quebrou do nosso lado.',
    body: 'Esta página não carregou. Tente de novo e, se continuar acontecendo, <link>avise a gente</link> para corrigirmos.',
    retry: 'Tentar de novo',
    home: 'Ir para a página inicial',
    reference: 'Código de referência',
    discord: 'Perguntar no Discord',
  },
})

/** A sentence with one <link> in it, split around the link's words. With no link, it is all `before`. */
export function linkParts(text: string): { before: string; link: string; after: string } {
  const match = /^([^]*?)<link>([^]*?)<\/link>([^]*)$/.exec(text)
  return match ? { before: match[1], link: match[2], after: match[3] } : { before: text, link: '', after: '' }
}

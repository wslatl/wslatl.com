/**
 * The languages the site is published in, from the kit (platform/i18n),
 * which every WSLATL site shares.
 *
 * English keeps the plain URLs it has always had (/pricing, /legal/terms),
 * and every other language sits under its own prefix (/es/pricing). That way
 * no existing link, bookmark, or search result moves, and each page can point
 * search engines at its translations with hreflang.
 *
 * localePath('es', '/pricing') is '/es/pricing', English paths come back as
 * they are, and an #anchor stays at the end; stripLocale takes a language
 * back off a path. localeNames names each language in itself, which is what
 * a language picker shows.
 */
export {
  defaultLocale,
  isLocale,
  languageTag,
  localeNames,
  localePath,
  locales,
  openGraphLocales,
  stripLocale,
  type Locale,
} from '@/platform/i18n/config'

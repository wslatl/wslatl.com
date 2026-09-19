import type { Locale } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'
import { en, type Copy } from '@/i18n/copy/en'
import { es } from '@/i18n/copy/es'
import { fr } from '@/i18n/copy/fr'
import { de } from '@/i18n/copy/de'
import { pt } from '@/i18n/copy/pt'

const copies: Record<Locale, Copy> = { en, es, fr, de, pt }

/** The site's own words, in the language of the page being rendered. */
export function copy(): Copy {
  return copies[getLocale()]
}

/** The same, for a language other than the one being rendered. */
export function copyFor(locale: Locale): Copy {
  return copies[locale]
}

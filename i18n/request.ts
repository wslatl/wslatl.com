import { locale } from 'next/root-params'
import { createRequestConfig } from '@/platform/i18n/request'

/**
 * next-intl's request config (next.config.mjs points its plugin here), from
 * the kit: the page's language from its [locale], the site's words in that
 * language over the English ones, and the kit's own public words under
 * `platform`. The site reads its words through i18n/words.ts, on the same
 * messages; this is what next-intl's own server functions read, should a
 * page or route ever call them.
 */
export default createRequestConfig({
  rootLocale: locale,
  messages: (language) => import(`../messages/${language}.json`),
})

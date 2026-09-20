import NextLink from 'next/link'
import { localePath } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'

/**
 * A link inside a legal document. Documents cross-reference each other by
 * the paths in siteConfig (/legal/terms), which carry no language, so a
 * reader of the Spanish Refund Policy would otherwise be dropped into the
 * English Terms. This adds the language of the page being read.
 *
 * Documents import this instead of next/link; everything else is the same.
 */
export function Link({ href, children, ...props }: React.ComponentProps<typeof NextLink>) {
  const target = typeof href === 'string' ? localePath(getLocale(), href) : href
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  )
}

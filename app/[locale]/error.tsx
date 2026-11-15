'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale, localePath } from '@/i18n/config'
import { errorCopy } from '@/i18n/error-copy'
import { crashWords } from '@/platform/i18n/crash-words'
import { Button } from '@/platform/components/button'
import { ErrorPage, errorLinkClassName } from '@/platform/components/error-page'

/**
 * Last-resort boundary for a render error, on the kit's crash page. Every
 * page is static, so this should never show, but if it does it keeps the
 * visitor on the site, in their own language: the language is read from the
 * URL, since a boundary this deep gets no props.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const first = usePathname().split('/')[1]
  const locale = isLocale(first) ? first : defaultLocale
  const t = errorCopy[locale]
  // The reference code and the Discord button in the kit's crash words, the
  // same on every WSLATL site (platform/i18n/crash-words.ts).
  const kit = crashWords[locale]
  // The digest finds the error in the server's log; the error's own message
  // can hold whatever the page was working with, so it is never shown.
  const reference = typeof error.digest === 'string' && /^[\w-]{1,64}$/.test(error.digest) ? error.digest : undefined

  return (
    <ErrorPage
      variant="crash"
      code={reference && `${kit.reference}: ${reference}`}
      heading={t.heading}
      actions={
        <>
          <Button type="button" onClick={reset}>
            {t.tryAgain}
          </Button>
          <Button asChild variant="outline">
            <Link href={localePath(locale, '/')}>{t.home}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
              {kit.discord}
              <span className="sr-only">{t.newTab}</span>
            </a>
          </Button>
        </>
      }
    >
      {t.bodyPrefix}{' '}
      <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className={errorLinkClassName}>
        {t.discordLink}
        <span className="sr-only">{t.newTab}</span>
      </a>{' '}
      {t.bodySuffix}
    </ErrorPage>
  )
}

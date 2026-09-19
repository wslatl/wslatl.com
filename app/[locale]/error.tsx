'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale, localePath } from '@/i18n/config'
import { errorCopy } from '@/i18n/error-copy'

/**
 * Last-resort boundary for a render error. Every page is static, so this
 * should never show, but if it does it keeps the visitor on the site, in
 * their own language: the language is read from the URL, since a boundary
 * this deep gets no props.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const first = usePathname().split('/')[1]
  const locale = isLocale(first) ? first : defaultLocale
  const t = errorCopy[locale]

  return (
    <Main className="shell pt-24 pb-24">
      <h1 className="font-serif text-5xl text-foreground italic">{t.heading}</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        {t.bodyPrefix}{' '}
        <a
          href={siteConfig.links.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline underline-offset-4 hover:text-foreground"
        >
          {t.discordLink}
          <span className="sr-only">{t.newTab}</span>
        </a>{' '}
        {t.bodySuffix}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          {t.tryAgain}
        </Button>
        <Button asChild variant="outline">
          <Link href={localePath(locale, '/')}>{t.home}</Link>
        </Button>
      </div>
    </Main>
  )
}

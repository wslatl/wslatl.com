'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale, localePath } from '@/i18n/config'
import { errorCopy } from '@/i18n/error-copy'
import './globals.css'

/**
 * The last resort: a crash in a root layout takes the layout with it, so this
 * page brings its own <html> and <body>. Every other crash is caught nearer
 * the page (app/[locale]/error.tsx, app/admin/error.tsx). The language comes
 * from the address, and the admin has none, so it reads as English.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const first = usePathname()?.split('/')[1]
  const locale = first && isLocale(first) ? first : defaultLocale
  const t = errorCopy[locale]

  return (
    <html lang={locale} className="dark">
      <head>
        <title>{`${t.heading} | ${siteConfig.brand}`}</title>
      </head>
      <body className="grid min-h-dvh place-items-center bg-background px-4 py-12 font-sans text-foreground antialiased">
        <main className="max-w-xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{t.heading}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={reset}>
              {t.tryAgain}
            </Button>
            {/* A plain link, not next/link: the layout that would carry a client-side move is the thing that crashed. */}
            <Button asChild variant="outline">
              <a href={localePath(locale, '/')}>{t.home}</a>
            </Button>
          </div>
        </main>
      </body>
    </html>
  )
}

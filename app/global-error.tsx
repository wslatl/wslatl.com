'use client'

import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { defaultLocale, isLocale, localePath } from '@/i18n/config'
import { errorCopy } from '@/i18n/error-copy'
import { GlobalErrorPage, globalErrorLinkStyle } from '@/platform/components/global-error-page'

/**
 * The last resort: a crash in a root layout takes the layout with it, so the
 * kit's page brings its own <html> and <body>, styled inline because the
 * stylesheet may be gone too. Every other crash is caught nearer the page
 * (app/[locale]/error.tsx, app/admin/error.tsx). The language comes from the
 * address, and the admin has none, so it reads as English.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const first = usePathname()?.split('/')[1]
  const locale = first && isLocale(first) ? first : defaultLocale
  const t = errorCopy[locale]

  return (
    <GlobalErrorPage
      lang={locale}
      title={`${t.heading} | ${siteConfig.brand}`}
      heading={t.heading}
      retryLabel={t.tryAgain}
      onRetry={reset}
      homeHref={localePath(locale, '/')}
      homeLabel={t.home}
    >
      {t.bodyPrefix}{' '}
      <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" style={globalErrorLinkStyle}>
        {t.discordLink}
        <span
          // The page's stylesheet may be gone, so the words are hidden the way sr-only hides them, inline.
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
        >
          {t.newTab}
        </span>
      </a>{' '}
      {t.bodySuffix}
    </GlobalErrorPage>
  )
}

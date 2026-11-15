'use client'

import Link from 'next/link'
import { Button } from '../../components/button'
import { useAdminText } from './admin-text'
import { AdminCard } from './card'

/**
 * The code Next gives an error from the server, which the server's log
 * prints beside the real message. Whatever a page throws reaches here, so
 * it may not be an Error at all.
 */
export function errorReference(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('digest' in error)) return undefined
  return typeof error.digest === 'string' && /^[\w-]{1,64}$/.test(error.digest) ? error.digest : undefined
}

/**
 * When an admin page crashes: the same card as sign-in and the 404, since a
 * crash in the signed-in layout takes the header with it. It says so
 * plainly and offers another try, in the admin's language. The error's own
 * message can hold whatever the page was working with, so it stays in the
 * server's log, and the page shows the reference that finds it there. retry
 * asks the server for the page again rather than drawing the same failed
 * one.
 */
export function ErrorScreen({ error, retry }: { error: unknown; retry: () => void }) {
  const { t } = useAdminText()
  const reference = errorReference(error)
  return (
    <AdminCard centered>
      <title>{t('crash.title')}</title>
      <h1 className="text-2xl font-semibold tracking-tight">{t('crash.title')}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t('crash.body')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => retry()}>
          {t('crash.retry')}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">{t('crash.back')}</Link>
        </Button>
      </div>
      {reference && <p className="mt-6 font-mono text-xs break-all text-muted-foreground">{t('crash.reference', { reference })}</p>}
    </AdminCard>
  )
}

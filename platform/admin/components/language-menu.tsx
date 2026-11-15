'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Check, Languages } from 'lucide-react'
import { buttonVariants } from '../../components/button'
import { localeNames, locales, type Locale } from '../../i18n/config'
import { cn } from '../../lib/cn'
import { useAdminText } from './admin-text'

/**
 * The admin's language, picked from the five, each named in itself. The
 * admin's addresses never change with it: the choice goes to
 * /admin/api/language, which sets the admin's language cookie (and keeps it
 * for the account, for an app whose accounts keep one), and the page is
 * drawn again in the new language. `menu` is the button and list in the
 * admin's header; `row` is the five in a row, for the sign-in card.
 */
export function LanguageMenu({ variant = 'menu', className }: { variant?: 'menu' | 'row'; className?: string }) {
  const { locale, t } = useAdminText()
  const router = useRouter()
  const menuRef = useRef<HTMLDetailsElement>(null)
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState('')

  const close = () => {
    if (menuRef.current) menuRef.current.open = false
  }

  async function choose(next: Locale) {
    if (next === locale) return close()
    setBusy(true)
    setFailure('')
    try {
      const response = await fetch('/admin/api/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: next }),
      })
      if (!response.ok) {
        // The route's own words when it gives some, already in the admin's
        // language: why this account's language cannot change here, say.
        const said: unknown = await response.json().then(
          (body: { error?: unknown } | null) => body?.error,
          () => undefined,
        )
        setFailure(typeof said === 'string' && said ? said : t('language.failed'))
        return
      }
      close()
      router.refresh()
    } catch {
      setFailure(t('language.failed'))
    } finally {
      setBusy(false)
    }
  }

  const choices = (itemClassName: string) =>
    locales.map((code) => (
      <li key={code}>
        <button
          type="button"
          lang={code}
          disabled={busy}
          aria-current={code === locale ? 'true' : undefined}
          onClick={() => choose(code)}
          className={itemClassName}
        >
          {localeNames[code]}
          {variant === 'menu' && code === locale && <Check aria-hidden="true" className="size-4 shrink-0 text-link" />}
        </button>
      </li>
    ))

  // Always in the page, so a screen reader hears a failed change as it happens.
  const problem = (where: string) => (
    <p role="alert" className={cn('text-xs font-medium text-danger empty:hidden', where)}>
      {failure}
    </p>
  )

  if (variant === 'row') {
    return (
      <div className={className}>
        <ul aria-label={t('language.group')} className="flex flex-wrap justify-center gap-x-1 gap-y-1">
          {choices(
            'rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50 aria-[current]:text-foreground',
          )}
        </ul>
        {problem('mt-2 text-center')}
      </div>
    )
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Escape and a move of focus out of the open menu reach it from the summary and the buttons inside, which are the interactive elements; it only closes the menu again
    <details
      ref={menuRef}
      className={cn('relative', className)}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null
        if (!next || !e.currentTarget.contains(next)) e.currentTarget.open = false
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && menuRef.current?.open) {
          menuRef.current.open = false
          menuRef.current.querySelector('summary')?.focus()
        }
      }}
    >
      <summary
        aria-label={t('language.label', { language: localeNames[locale] })}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'cursor-pointer list-none [&::-webkit-details-marker]:hidden')}
      >
        <Languages aria-hidden="true" />
        <span aria-hidden="true" className="hidden sm:inline">
          {localeNames[locale]}
        </span>
      </summary>
      <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl">
        <ul>
          {choices(
            'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50 aria-[current]:text-foreground',
          )}
        </ul>
        {problem('px-3 pt-1 pb-1.5')}
      </div>
    </details>
  )
}

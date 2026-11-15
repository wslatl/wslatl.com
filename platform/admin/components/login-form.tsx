'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Button } from '../../components/button'
import { englishText, type AdminText } from '../text'
import { useAdminText } from './admin-text'
import { formatWait } from './format'
import { Notice } from './notice'

export type LoginProblem = { title: string; detail: string }

/**
 * What a refused sign-in says, from what /admin/api/login answered: its
 * status, its Retry-After header and its own message, in the admin's
 * language (English unless its words are given). After too many attempts
 * it says how long is left.
 */
export function loginProblem(status: number, retryAfter: string | null, said: string, t: AdminText = englishText): LoginProblem {
  if (status === 401) return { title: t('signIn.wrong.title'), detail: t('signIn.wrong.detail') }
  if (status === 429) {
    // Too many attempts, from this address or from everyone: Retry-After says for how long.
    const wait = formatWait(retryAfter, t)
    return { title: t('signIn.tooMany.title'), detail: wait ? t('signIn.tooMany.wait', { wait }) : said || t('signIn.tooMany.later') }
  }
  return { title: t('signIn.failed.title'), detail: said || t('signIn.failed.status', { status: String(status) }) }
}

/**
 * Sends the password as JSON, which is all /admin/api/login accepts. The
 * form also names that route and POST, so if the script never loads, a
 * submit still sends the password in a request body (and is refused)
 * rather than putting it in the address bar, the history and the logs.
 */
export function LoginForm() {
  const router = useRouter()
  const { t } = useAdminText()
  const field = useRef<HTMLInputElement>(null)
  const [problem, setProblem] = useState<LoginProblem | null>(null)
  const [busy, setBusy] = useState(false)

  function fail(next: LoginProblem) {
    setProblem(next)
    setBusy(false)
    // Back in the field with its text selected, ready to type it again.
    field.current?.focus()
    field.current?.select()
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setProblem(null)
    const password = new FormData(event.currentTarget).get('password')
    let response: Response
    try {
      response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
    } catch {
      fail({ title: t('signIn.unreachable.title'), detail: t('signIn.unreachable.detail') })
      return
    }
    if (response.ok) {
      router.replace('/admin')
      return
    }
    const body = await response.json().catch(() => ({}))
    fail(loginProblem(response.status, response.headers.get('retry-after'), typeof body.error === 'string' ? body.error : '', t))
  }

  return (
    <form action="/admin/api/login" method="post" onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-password" className="text-sm font-medium">
          {t('signIn.password')}
        </label>
        <input
          ref={field}
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? 'admin-login-problem' : undefined}
          className="mt-1.5 block h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground transition-colors hover:border-muted-foreground focus-visible:border-ring aria-invalid:border-danger"
        />
      </div>
      {/* Always in the page, so a screen reader announces each problem as it appears. */}
      <div id="admin-login-problem" role="alert">
        {problem && (
          <Notice tone="danger" title={problem.title}>
            {problem.detail}
          </Notice>
        )}
      </div>
      <Button type="submit" disabled={busy} className="h-11 w-full">
        {busy && <LoaderCircle aria-hidden="true" className="animate-spin" />}
        {busy ? t('signIn.busy') : t('signIn.submit')}
      </Button>
    </form>
  )
}

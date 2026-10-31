'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Sends the password as JSON, which is all /admin/api/login accepts. The
 * form also names that route and POST, so if the script never loads, a
 * submit still sends the password in a request body (and is refused)
 * rather than putting it in the address bar.
 */
export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const password = new FormData(event.currentTarget).get('password')
    try {
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (response.ok) {
        router.replace('/admin')
        return
      }
      const body = await response.json().catch(() => ({}))
      setError(body.error ?? `Login failed (${response.status}).`)
    } catch {
      setError('Could not reach the server.')
    }
    setBusy(false)
  }

  return (
    <form action="/admin/api/login" method="post" onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
      </div>
      <p role="alert" className="min-h-5 text-sm text-red-400">
        {error}
      </p>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Checking' : 'Log in'}
      </Button>
    </form>
  )
}

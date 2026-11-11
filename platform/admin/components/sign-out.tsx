'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '../../components/button'

/**
 * Posts to the sign-out route, then goes to the sign-in page. Both
 * addresses come from the app's check: the kit's own routes for the shared
 * password, the app's for its own accounts.
 */
export function SignOut({ action = '/admin/api/logout', then = '/admin/login' }: { action?: string; then?: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function signOut() {
    setBusy(true)
    await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {})
    router.replace(then)
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={signOut} disabled={busy}>
      <LogOut aria-hidden="true" />
      {busy ? 'Signing out' : 'Sign out'}
    </Button>
  )
}

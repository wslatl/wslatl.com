'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SignOut() {
  const router = useRouter()

  async function signOut() {
    await fetch('/admin/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(
      () => {},
    )
    router.replace('/admin/login')
  }

  return (
    <Button variant="ghost" size="sm" onClick={signOut}>
      <LogOut aria-hidden="true" />
      Log out
    </Button>
  )
}

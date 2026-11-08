import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { connection } from 'next/server'
import { LoginForm } from '@/components/admin/login-form'
import { Logo } from '@/components/brand/logo'
import { adminEnabled, signedInPage } from '@/lib/admin/auth'

export const metadata: Metadata = { title: 'Sign in' }

export default async function AdminLoginPage() {
  // Rendered per request, always: .env is read now, never at build time.
  await connection()
  const settings = adminEnabled()
  if (!settings) notFound()
  if (await signedInPage(settings)) redirect('/admin')

  // The mark once, on the card's solid surface, with the gradient only as
  // the bar along the card's top edge.
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/50">
        <div aria-hidden="true" className="brand-bar" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Sign in to update the site.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}

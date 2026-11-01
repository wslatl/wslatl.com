import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { connection } from 'next/server'
import { LoginForm } from '@/components/admin/login-form'
import { siteConfig } from '@/config/site'
import { adminEnabled, signedInPage } from '@/lib/admin/auth'

export const metadata: Metadata = { title: 'Log in' }

export default async function AdminLoginPage() {
  // Rendered per request, always: .env is read now, never at build time.
  await connection()
  const settings = adminEnabled()
  if (!settings) notFound()
  if (await signedInPage(settings)) redirect('/admin')

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{siteConfig.brand}</p>
        <h1 className="mt-1 text-xl font-semibold">Admin</h1>
        <LoginForm />
      </div>
    </main>
  )
}

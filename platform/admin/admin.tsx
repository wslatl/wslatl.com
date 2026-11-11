import 'server-only'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { connection } from 'next/server'
import type { PlatformConfig } from '../config.mjs'
import { AdminShell } from './components/admin-shell'
import { AdminCard } from './components/card'
import { LoginForm } from './components/login-form'
import { Logo } from '../components/logo'
import { Updates } from './components/updates'
import type { AdminAuth } from './server/auth'
import { adminCore, type AdminCore, type AdminSettings, type SignedIn } from './server/core'
import { bare, checkPost, checkRead, json } from './server/request'
import { adminRoutes, type AdminRoutes } from './server/routes'

/**
 * One app's admin: its settings and check, its JSON routes, and the pages
 * that need someone signed in. The ready-made files under pages/ and
 * routes/ are this, made from the app's platform.config.mjs and the shared
 * password (app.ts). An app whose check is its own makes its own once:
 *
 *   export const admin = createAdmin({ config, auth: staffCheck })
 *
 * and its files under app/admin/ use that instead (README.md).
 */
export type Admin = AdminCore & {
  routes: AdminRoutes
  /**
   * For any page that needs someone signed in, first thing: a 404 while the
   * admin is off, the sign-in page when nobody is signed in, and otherwise
   * who it is. Each page calls it, since moving between pages does not run
   * their layout again.
   */
  signedInPage(): Promise<{ user: SignedIn; settings: AdminSettings }>
  /**
   * The same for one of the app's own JSON routes that reads (a GET): who
   * it is, or the answer to send instead, in this order: a 404 while the
   * admin is off, whatever is sent; a 403 for a read another site asked for;
   * a 401 when nobody is signed in.
   */
  signedInRoute(request: Request): Promise<{ user: SignedIn; settings: AdminSettings } | { response: Response }>
  /**
   * The same for one of the app's own JSON routes that takes a POST, in one
   * call and in this order: a 404 while the admin is off, whatever is sent,
   * so a switched-off admin gives nothing away; then checkPost
   * (server/request.ts): from a page on this site, as JSON, an object, and
   * at most maxBytes (4 KB unless the route says more); then a 401 when
   * nobody is signed in. Hands back the body with who it is. Never call
   * checkPost before it: on its own it answers a malformed request with a
   * 403, 415 or 413 even while the admin is off.
   */
  signedInPost(
    request: Request,
    options?: { maxBytes?: number },
  ): Promise<{ user: SignedIn; settings: AdminSettings; body: Record<string, unknown> } | { response: Response }>
  /** The header and main area, for a layout around signed-in pages. It checks who is signed in first. */
  SignedInLayout(props: { children: React.ReactNode }): Promise<React.JSX.Element>
  /** The Updates page, and its tab title. */
  Updates(): Promise<React.JSX.Element>
  updatesMetadata(): Promise<Metadata>
  /** The shared password's sign-in page, and its tab title. A 404 for an app whose check is its own. */
  SignIn(): Promise<React.JSX.Element>
  signInMetadata(): Promise<Metadata>
}

/** A tab title that only exists while the admin is on, so a 404 never says what the page would have been. */
const titled = (title: string, ready: () => Promise<boolean>) => async (): Promise<Metadata> => {
  await connection()
  if (!(await ready())) notFound()
  return { title }
}

export function createAdmin({ config, auth }: { config: PlatformConfig; auth: AdminAuth | null }): Admin {
  const core = adminCore(config, auth)
  const { app } = core

  async function signedInPage() {
    // Rendered per request, always: .env is read now, never at build time.
    await connection()
    const settings = await core.settings()
    if (!settings) notFound()
    const user = await core.user(await headers())
    if (!user) redirect(core.signInPath)
    return { user, settings }
  }

  const isOn = async () => (await core.settings()) !== null
  const sharedPasswordOn = async () => core.auth?.kind === 'password' && (await isOn())

  return {
    ...core,
    routes: adminRoutes(core),
    signedInPage,

    async signedInRoute(request) {
      const settings = await core.settings()
      if (!settings) return { response: bare(404) }
      const foreign = checkRead(request)
      if (foreign) return { response: foreign }
      const user = await core.user(request.headers)
      if (!user) return { response: json({ error: 'Sign in again.' }, { status: 401 }) }
      return { user, settings }
    },

    async signedInPost(request, options = {}) {
      const settings = await core.settings()
      if (!settings) return { response: bare(404) }
      const check = await checkPost(request, options)
      if (!check.ok) return { response: check.response }
      const user = await core.user(request.headers)
      if (!user) return { response: json({ error: 'Sign in again.' }, { status: 401 }) }
      return { user, settings, body: check.body }
    },

    async SignedInLayout({ children }) {
      await signedInPage()
      return (
        <AdminShell brand={app.brand} nav={app.nav} wide={app.wide} signOutPath={core.signOutPath} signInPath={core.signInPath}>
          {children}
        </AdminShell>
      )
    },

    async Updates() {
      const { user, settings } = await signedInPage()
      return <Updates github={settings.github} updatesOff={settings.updatesOff} mayUpdate={user.mayUpdate} />
    },
    updatesMetadata: titled('Updates', isOn),

    async SignIn() {
      await connection()
      if (!(await sharedPasswordOn())) notFound()
      if (await core.user(await headers())) redirect('/admin')
      // The mark once, on the card's solid surface, with the gradient only
      // as the bar along the card's top edge.
      return (
        <AdminCard>
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="sr-only">{`${app.brand} `}</span>Admin
            </h1>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{app.signInText}</p>
          <LoginForm />
        </AdminCard>
      )
    },
    signInMetadata: titled('Sign in', sharedPasswordOn),
  }
}

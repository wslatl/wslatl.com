import 'server-only'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'
import { navProblems, type PlatformConfig } from '../config.mjs'
import { textIn, type Locale, type LocalizedText } from '../i18n/config'
import { adminMessages } from '../i18n/messages'
import { AdminShell } from './components/admin-shell'
import { AdminTextProvider } from './components/admin-text'
import { AdminCard } from './components/card'
import { LanguageMenu } from './components/language-menu'
import { LoginForm } from './components/login-form'
import { Logo } from '../components/logo'
import { hidden } from './components/tags'
import { Updates } from './components/updates'
import type { AdminAuth } from './server/auth'
import { navIn, type NavEntry } from './nav'
import { adminCore, linksIn, type AdminCore, type AdminSettings, type SignedIn } from './server/core'
import { chooseAdminLocale, cookieLocale, requestLocale } from './server/locale'
import { adminLog, bare, checkPost, checkRead, signInAgain } from './server/request'
import { adminRoutes, type AdminRoutes } from './server/routes'
import type { Env } from './server/settings'
import { adminText } from './server/text'

/**
 * One app's admin: its settings and check, its JSON routes, and the pages
 * that need someone signed in, in the admin's language. The ready-made
 * files under pages/ and routes/ are this, made from the app's
 * platform.config.mjs and the shared password (app.ts). An app whose check
 * is its own makes its own once:
 *
 *   export const admin = createAdmin({ config, auth: staffCheck })
 *
 * and its files under app/admin/ use that instead (README.md).
 */
export type Admin = AdminCore & {
  routes: AdminRoutes
  /**
   * The admin's language for the request being rendered: the signed-in
   * account's own, for an app whose check keeps one, then the admin's
   * language cookie, then English (server/locale.ts).
   */
  locale(): Promise<Locale>
  /**
   * For any page that needs someone signed in, first thing: a 404 while the
   * admin is off, the sign-in page when nobody is signed in, and otherwise
   * who it is and the admin's language. Each page calls it, since moving
   * between pages does not run their layout again.
   */
  signedInPage(): Promise<{ user: SignedIn; settings: AdminSettings; locale: Locale }>
  /**
   * The same for one of the app's own JSON routes that reads (a GET): who
   * it is, or the answer to send instead, in this order: a 404 while the
   * admin is off, whatever is sent; a 403 for a read another site asked for;
   * a 401 when nobody is signed in.
   */
  signedInRoute(request: Request): Promise<{ user: SignedIn; settings: AdminSettings; locale: Locale } | { response: Response }>
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
  ): Promise<{ user: SignedIn; settings: AdminSettings; locale: Locale; body: Record<string, unknown> } | { response: Response }>
  /** The header and main area, for a layout around signed-in pages. It checks who is signed in first. */
  SignedInLayout(props: { children: React.ReactNode }): Promise<React.JSX.Element>
  /**
   * The tab title for one of the app's own admin pages, as the kit's pages
   * title theirs: `export const generateMetadata = admin.titled('Guides')`,
   * or with the words in each language, `admin.titled({ en: 'Guides', es: 'Guías', ... })`.
   * While the admin is off it is a 404, so a page never gives away what it
   * would have been called.
   */
  titled(title: LocalizedText): () => Promise<Metadata>
  /** The Updates page, and its tab title. */
  Updates(): Promise<React.JSX.Element>
  updatesMetadata(): Promise<Metadata>
  /** The shared password's sign-in page, and its tab title. A 404 for an app whose check is its own. */
  SignIn(): Promise<React.JSX.Element>
  signInMetadata(): Promise<Metadata>
}

/**
 * What an app's navFor hook is asked: who is signed in, and the server's
 * settings (process.env), so a page can be left out because of either.
 */
export type NavContext = { user: SignedIn; env: Env }

export type CreateAdminOptions = {
  config: PlatformConfig
  auth: AdminAuth | null
  /**
   * The sidebar's pages for one request, when they depend on it: a page
   * left out (Docker, when there is no Docker socket), a count beside one
   * (open incidents). Return the same shapes as admin.nav, with the
   * addition of `badge` on a page. Left out, every request gets
   * admin.nav. It runs on every page, so keep it quick: a count from one
   * indexed query, not a scan. Should it throw, or hand back something that
   * is not a nav, the admin logs why and shows admin.nav instead.
   */
  navFor?: (context: NavContext) => readonly NavEntry[] | Promise<readonly NavEntry[]>
  /** The app's version, at the foot of the sidebar, such as "v1.4.2": text, or a function that gives it. */
  version?: string | (() => string | null | Promise<string | null>)
}

export function createAdmin({ config, auth, navFor, version }: CreateAdminOptions): Admin {
  const core = adminCore(config, auth)
  const { app } = core

  /**
   * Only an app's own check can keep a language per account, and only once
   * the admin is on: its user() is never asked before then. The shared
   * password keeps none, so its admin goes straight to the cookie.
   */
  async function localeFor(requestHeaders: Headers): Promise<Locale> {
    if (auth?.kind !== 'custom') return requestLocale(requestHeaders)
    const user = (await core.settings()) ? await core.user(requestHeaders) : null
    return chooseAdminLocale(user?.locale, cookieLocale(requestHeaders))
  }

  // Once per request, however many of the layouts, pages and titles ask.
  const locale = cache(async () => localeFor(await headers()))

  async function signedInPage() {
    // Rendered per request, always: .env is read now, never at build time.
    await connection()
    const settings = await core.settings()
    if (!settings) notFound()
    const requestHeaders = await headers()
    const user = await core.user(requestHeaders)
    if (!user) redirect(core.signInPath)
    return { user, settings, locale: chooseAdminLocale(user.locale, cookieLocale(requestHeaders)) }
  }

  /** The pages for this request: the app's navFor, or admin.nav, which is also what stands in for a navFor that fails. */
  async function navForRequest(user: SignedIn): Promise<readonly NavEntry[]> {
    if (!navFor) return app.nav
    try {
      const nav = await navFor({ user, env: process.env })
      const problems = navProblems(nav, { where: 'navFor', badge: true })
      if (problems.length === 0) return nav
      adminLog(`navFor gave a nav the admin cannot show, so admin.nav is shown instead. ${problems.join(' ')}`)
    } catch (error) {
      adminLog(`navFor failed (${error instanceof Error ? error.message : 'no reason given'}), so admin.nav is shown instead.`)
    }
    return app.nav
  }

  const isOn = async () => (await core.settings()) !== null
  const sharedPasswordOn = async () => core.auth?.kind === 'password' && (await isOn())

  /** A tab title that only exists while the admin is on, so a 404 never says what the page would have been. */
  const titled = (title: LocalizedText | ((t: ReturnType<typeof adminText>) => string), ready: () => Promise<boolean>) => async (): Promise<Metadata> => {
    await connection()
    if (!(await ready())) notFound()
    const language = await locale()
    const t = adminText(language)
    const page = typeof title === 'function' ? title(t) : textIn(title, language)
    return { title: { absolute: t('tabTitle', { page, brand: app.brand }) } }
  }

  return {
    ...core,
    routes: adminRoutes(core),
    locale,
    signedInPage,
    titled: (title) => titled(title, isOn),

    async signedInRoute(request) {
      const settings = await core.settings()
      if (!settings) return { response: bare(404) }
      const foreign = checkRead(request)
      if (foreign) return { response: foreign }
      const user = await core.user(request.headers)
      if (!user) return { response: signInAgain(request) }
      return { user, settings, locale: chooseAdminLocale(user.locale, cookieLocale(request.headers)) }
    },

    async signedInPost(request, options = {}) {
      const settings = await core.settings()
      if (!settings) return { response: bare(404) }
      const check = await checkPost(request, options)
      if (!check.ok) return { response: check.response }
      const user = await core.user(request.headers)
      if (!user) return { response: signInAgain(request) }
      return { user, settings, locale: chooseAdminLocale(user.locale, cookieLocale(request.headers)), body: check.body }
    },

    async SignedInLayout({ children }) {
      const { user, locale: language } = await signedInPage()
      const pages = navIn(await navForRequest(user), language)
      const shown = typeof version === 'function' ? await version() : version
      // Its own words for its client components, in the language just
      // chosen, whatever the root layout around it chose.
      return (
        <AdminTextProvider locale={language} messages={adminMessages(language)}>
          <AdminShell
            brand={app.brand}
            name={app.name}
            nav={pages}
            version={shown}
            wide={app.wide}
            signOutPath={core.signOutPath}
            signInPath={core.signInPath}
            locale={language}
          >
            {children}
          </AdminShell>
        </AdminTextProvider>
      )
    },

    async Updates() {
      const { user, settings, locale: language } = await signedInPage()
      // The reasons in the admin's language; the log has them in English.
      const updatesOff = settings.github ? [] : core.updatesOffIn(language)
      return (
        <Updates
          github={settings.github}
          updatesOff={updatesOff}
          mayUpdate={user.mayUpdate}
          links={linksIn(app.updateLinks, language)}
          locale={language}
        />
      )
    },
    updatesMetadata: titled((t) => t('updates.title'), isOn),

    async SignIn() {
      await connection()
      if (!(await sharedPasswordOn())) notFound()
      if (await core.user(await headers())) redirect('/admin')
      const language = await locale()
      const t = adminText(language)
      // The mark once, on the card's solid surface, with the gradient only
      // as the bar along the card's top edge.
      return (
        <AdminCard>
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl font-semibold tracking-tight">
              {t.rich('heading', { brand: app.brand, hidden })}
            </h1>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{app.signInText === null ? t('signIn.text') : textIn(app.signInText, language)}</p>
          <LoginForm />
          <LanguageMenu variant="row" className="mt-6 border-t pt-4" />
        </AdminCard>
      )
    },
    signInMetadata: titled((t) => t('signIn.title'), sharedPasswordOn),
  }
}

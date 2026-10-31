import 'server-only'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { adminSettings, type AdminSettings } from '@/lib/admin/settings'
import { readSession, SESSION_COOKIE } from '@/lib/admin/session'
import { adminLog } from '@/lib/admin/request'

export type EnabledSettings = Extract<AdminSettings, { enabled: true }>

// On globalThis, because Next may load this module more than once in one server.
const logged = Symbol.for('wslatl.admin.problemsLogged')
const store = globalThis as typeof globalThis & { [logged]?: string }

/**
 * The admin's settings, or null when the admin is off. Off means a 404 on
 * every /admin page and route, never a page that explains why: the reasons
 * go to the server log, once, where only the owner sees them.
 */
export function adminEnabled(): EnabledSettings | null {
  const settings = adminSettings()
  if (settings.enabled) return settings
  const problems = settings.problems.join('; ')
  if (store[logged] !== problems) {
    store[logged] = problems
    adminLog(`admin is off: ${problems}`)
  }
  return null
}

/** For route handlers. */
export function signedIn(request: NextRequest, settings: EnabledSettings): boolean {
  return readSession(request.cookies.get(SESSION_COOKIE)?.value, settings)
}

/** For pages. */
export async function signedInPage(settings: EnabledSettings): Promise<boolean> {
  return readSession((await cookies()).get(SESSION_COOKIE)?.value, settings)
}

export function notFoundResponse(): Response {
  return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
}

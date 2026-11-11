import type { NextRequest } from 'next/server'
import { adminEnabled, notFoundResponse } from '@/lib/admin/auth'
import { adminLog, checkPost, clientIp, json } from '@/lib/admin/request'
import { endSession, SESSION_COOKIE, sessionCookie } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

/** Ends the session for good (a copy of the cookie stops working too), and clears the cookie. */
export async function POST(request: NextRequest) {
  const settings = adminEnabled()
  if (!settings) return notFoundResponse()
  const check = await checkPost(request)
  if (!check.ok) return check.response
  if (endSession(request.cookies.get(SESSION_COOKIE)?.value, settings)) adminLog(`logout from ${clientIp(request.headers)}`)
  const response = json({ ok: true })
  response.cookies.set(sessionCookie('', 0))
  return response
}

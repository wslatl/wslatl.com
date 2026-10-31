import type { NextRequest } from 'next/server'
import { adminEnabled, notFoundResponse, signedIn } from '@/lib/admin/auth'
import { adminLog, checkPost, clientIp, json } from '@/lib/admin/request'
import { sessionCookie } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const settings = adminEnabled()
  if (!settings) return notFoundResponse()
  const check = await checkPost(request)
  if (!check.ok) return check.response
  if (signedIn(request, settings)) adminLog(`logout from ${clientIp(request.headers)}`)
  const response = json({ ok: true })
  response.cookies.set(sessionCookie('', 0))
  return response
}

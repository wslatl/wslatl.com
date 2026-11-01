import type { NextRequest } from 'next/server'
import { adminEnabled, notFoundResponse, signedIn } from '@/lib/admin/auth'
import { adminLog, checkPost, clientIp, json } from '@/lib/admin/request'
import { requestUpdate, updaterStatus } from '@/lib/admin/updater'

export const dynamic = 'force-dynamic'

/** What the updater is doing; the dashboard polls this while an update runs. */
export async function GET(request: NextRequest) {
  const settings = adminEnabled()
  if (!settings) return notFoundResponse()
  if (!signedIn(request, settings)) return json({ error: 'Log in again.' }, { status: 401 })
  return json(await updaterStatus())
}

/** Asks the supervisor to install the latest release, when it is newer than the installed one. */
export async function POST(request: NextRequest) {
  const settings = adminEnabled()
  if (!settings) return notFoundResponse()
  const check = await checkPost(request)
  if (!check.ok) return check.response
  if (!signedIn(request, settings)) return json({ error: 'Log in again.' }, { status: 401 })

  const ip = clientIp(request.headers)
  const result = await requestUpdate(ip)
  if (!result.ok) return json({ error: result.error }, { status: result.status })
  adminLog(`update requested from ${ip}`)
  return json({ ok: true }, { status: 202 })
}

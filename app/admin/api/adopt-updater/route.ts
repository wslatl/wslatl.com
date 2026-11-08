import type { NextRequest } from 'next/server'
import { adoptUpdater } from '@/lib/admin/adopt-updater'
import { adminEnabled, notFoundResponse, signedIn } from '@/lib/admin/auth'
import { adminLog, checkPost, clientIp, json } from '@/lib/admin/request'

export const dynamic = 'force-dynamic'

/** Copies the live release's updater over the uploaded folder's: the button on the dashboard's notice. */
export async function POST(request: NextRequest) {
  const settings = adminEnabled()
  if (!settings) return notFoundResponse()
  const check = await checkPost(request)
  if (!check.ok) return check.response
  if (!signedIn(request, settings)) return json({ error: 'Log in again.' }, { status: 401 })

  const ip = clientIp(request.headers)
  const result = await adoptUpdater()
  if (!result.ok) {
    adminLog(`copying the updater failed, requested from ${ip}: ${result.error}`)
    return json({ error: result.error }, { status: result.status })
  }
  adminLog(`updater copied from ${result.tag}, requested from ${ip}`)
  return json({ ok: true })
}

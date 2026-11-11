import type { NextRequest } from 'next/server'
import { adminEnabled, notFoundResponse } from '@/lib/admin/auth'
import { createDevice, DEVICE_COOKIE, deviceCookie, readDevice } from '@/lib/admin/device'
import { verifyPassword } from '@/lib/admin/password'
import { loginLimits } from '@/lib/admin/rate-limit'
import { adminLog, checkPost, clientIp, json, limitKey } from '@/lib/admin/request'
import { createSession, sessionCookie } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const settings = adminEnabled()
  if (!settings) return notFoundResponse()
  const check = await checkPost(request)
  if (!check.ok) return check.response

  // Counted before the password is checked, so a burst is refused at once. A
  // browser that signed in here before, with a device cookie the site signed,
  // is counted on its own (lib/admin/device.ts), so a flood of guesses that
  // fills the shared limit cannot keep it out. Any other cookie counts as none.
  const ip = clientIp(request.headers)
  const key = limitKey(ip)
  const limits = loginLimits()
  const device = readDevice(request.cookies.get(DEVICE_COOKIE)?.value, settings)
  const allowed = device ? limits.perDevice.hit(device) : limits.perIp.hit(key) && limits.overall.hit('all')
  if (!allowed) {
    adminLog(`login refused (too many attempts) from ${ip}${device ? ', a browser that signed in before' : ''}`)
    const wait = device
      ? limits.perDevice.retryAfterSeconds(device)
      : Math.max(limits.perIp.retryAfterSeconds(key), limits.overall.retryAfterSeconds('all'))
    return json(
      { error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(wait) } },
    )
  }

  const given = (check.body as { password?: unknown }).password
  const password = typeof given === 'string' && given.length <= 1024 ? given : ''
  const correct = password ? await limits.check(() => verifyPassword(password, settings.passwordHash)) : false
  if (correct === null) {
    return json({ error: 'Busy. Try again in a moment.' }, { status: 429, headers: { 'Retry-After': '2' } })
  }
  if (!correct) {
    adminLog(`login failed from ${ip}`)
    return json({ error: 'That password is not right.' }, { status: 401 })
  }

  // The owner's own logins never use up a limit.
  if (device) {
    limits.perDevice.reset(device)
  } else {
    limits.perIp.reset(key)
    limits.overall.refund('all')
  }
  adminLog(`login from ${ip}`)
  const response = json({ ok: true })
  response.cookies.set(sessionCookie(createSession(settings)))
  // A fresh device cookie at every sign-in, good for another 180 days.
  response.cookies.set(deviceCookie(createDevice(settings)))
  return response
}

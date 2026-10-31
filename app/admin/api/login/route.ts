import type { NextRequest } from 'next/server'
import { adminEnabled, notFoundResponse } from '@/lib/admin/auth'
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

  // Counted before the password is checked, so a burst is refused at once.
  const ip = clientIp(request.headers)
  const key = limitKey(ip)
  const limits = loginLimits()
  if (!limits.perIp.hit(key) || !limits.overall.hit('all')) {
    adminLog(`login refused (too many attempts) from ${ip}`)
    const wait = Math.max(limits.perIp.retryAfterSeconds(key), limits.overall.retryAfterSeconds('all'))
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

  limits.perIp.reset(key)
  adminLog(`login from ${ip}`)
  const response = json({ ok: true })
  response.cookies.set(sessionCookie(createSession(settings)))
  return response
}

import 'server-only'
import { adoptUpdater } from './adopt-updater'
import type { AdminCore, AdminSettings, SignedIn } from './core'
import { createDevice, DEVICE_COOKIE, deviceCookie, readDevice } from './device'
import { verifyPassword } from './password'
import { adminLimits } from './rate-limit'
import { adminLog, bare, checkPost, checkRead, clientIp, json, limitKey, readCookie, whoFrom } from './request'
import { createSession, endSession, SESSION_COOKIE, sessionCookie } from './session'
import { signInSettings } from './settings'
import { requestUpdate, updaterStatus } from './updater'

/**
 * The admin's JSON routes, made for one app's admin. Each one answers 404
 * while the admin is off, whatever is sent. Every POST then checks where it
 * came from (checkPost), and every GET that reads anything (checkRead),
 * before it reads a cookie or acts on anything. The sign-in and sign-out
 * routes are the shared password's alone; an app with its own accounts
 * keeps its own. The update and adopt-updater routes need the GitHub
 * settings as well: while one is missing or broken they say so, and why, to
 * whoever is signed in, with a 503, and do nothing.
 */
export type Handler = (request: Request) => Promise<Response>

export type AdminRoutes = {
  /** POST /admin/api/login: the shared password, for a session cookie. */
  login: { GET: Handler; POST: Handler }
  /** POST /admin/api/logout: ends the shared password's session on the server, so a copy of its cookie stops working too. */
  logout: { GET: Handler; POST: Handler }
  /** GET and POST /admin/api/update: what the updater is doing, and asking it to install the latest release. */
  update: { GET: Handler; POST: Handler }
  /** POST /admin/api/adopt-updater: copies the live release's updater over the uploaded folder's. */
  adoptUpdater: { GET: Handler; POST: Handler }
}

/** Who asked, for the log and the update request: the address alone for the shared password, the account and address otherwise. */
function asker(core: AdminCore, user: SignedIn, request: Request): string {
  const from = whoFrom(request.headers)
  return core.auth?.kind === 'password' ? from : `${user.name} from ${from}`
}

const maxPasswordLength = 1024

/** The answer while updates are off: why, one sentence for each setting, never its value. Null while they are on. */
function updatesOffAnswer(settings: AdminSettings): Response | null {
  if (settings.updatesOff.length === 0) return null
  return json({ error: `Updates are off. ${settings.updatesOff.join(' ')}` }, { status: 503 })
}

export function adminRoutes(core: AdminCore): AdminRoutes {
  const passwordOnly = () => core.auth?.kind === 'password'

  /** GET on a route that only takes POST: 404 while the admin is off, as everywhere, and 405 once it is on. */
  const postOnly = (shared: boolean): Handler => async () => {
    if (!(await core.settings()) || (shared && !passwordOnly())) return bare(404)
    return bare(405, { Allow: 'POST' })
  }

  /** Signed in, and allowed to change something: the user, or the answer to send instead. */
  async function mayChange(request: Request): Promise<{ user: SignedIn } | { response: Response }> {
    const user = await core.user(request.headers)
    if (!user) return { response: json({ error: 'Sign in again.' }, { status: 401 }) }
    if (!user.mayUpdate) return { response: json({ error: 'This account may not install updates.' }, { status: 403 }) }
    return { user }
  }

  return {
    login: {
      GET: postOnly(true),
      async POST(request) {
        if (!(await core.settings()) || !passwordOnly()) return bare(404)
        const check = await checkPost(request)
        if (!check.ok) return check.response
        const { keys } = signInSettings(process.env)
        if (!keys) return bare(404)

        // Counted before the password is checked, so a burst is refused at
        // once. A browser that signed in here before, with a device cookie
        // the site signed (device.ts), is counted on its own, so a flood of
        // guesses that fills everyone's limit cannot keep it out. Any other
        // cookie counts as none, and its attempt is counted by Cloudflare's
        // address and against everyone's limit.
        const ip = clientIp(request.headers)
        const who = whoFrom(request.headers)
        const key = limitKey(ip)
        const limits = adminLimits()
        const device = readDevice(readCookie(request.headers.get('cookie'), DEVICE_COOKIE), keys)
        const wait = device
          ? limits.perDevice.retryAfter(device)
          : Math.max(limits.perAddress.retryAfter(key), limits.everyone.retryAfter('all'))
        if (wait > 0) {
          adminLog(`login refused (too many attempts) from ${who}${device ? ', a browser that signed in before' : ''}`)
          return json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429, headers: { 'Retry-After': String(wait) } })
        }
        if (device) {
          limits.perDevice.hit(device)
        } else {
          limits.perAddress.hit(key)
          limits.everyone.hit('all')
        }

        const given = check.body.password
        const password = typeof given === 'string' && given.length <= maxPasswordLength ? given : ''
        const correct = password ? await limits.check(() => verifyPassword(password, keys.passwordHash)) : false
        if (correct === null) {
          return json({ error: 'Busy. Try again in a moment.' }, { status: 429, headers: { 'Retry-After': '2' } })
        }
        if (!correct) {
          adminLog(`login failed from ${who}`)
          return json({ error: 'That password is not right.' }, { status: 401 })
        }

        // The owner's own sign-ins never use up a limit.
        if (device) {
          limits.perDevice.reset(device)
        } else {
          limits.perAddress.reset(key)
          limits.everyone.forget('all')
        }
        adminLog(`login from ${who}`)
        const response = json({ ok: true })
        response.cookies.set(sessionCookie(createSession(keys)))
        // A fresh device cookie at every sign-in, good for another 180 days.
        response.cookies.set(deviceCookie(createDevice(keys)))
        return response
      },
    },

    logout: {
      GET: postOnly(true),
      /**
       * Ends the session for good, so a copy of the cookie stops working too
       * (ended-sessions.ts), and clears the cookie. The device cookie stays.
       */
      async POST(request) {
        if (!(await core.settings()) || !passwordOnly()) return bare(404)
        const check = await checkPost(request)
        if (!check.ok) return check.response
        const { keys } = signInSettings(process.env)
        if (!keys) return bare(404)
        if (endSession(readCookie(request.headers.get('cookie'), SESSION_COOKIE), keys)) adminLog(`logout from ${whoFrom(request.headers)}`)
        const response = json({ ok: true })
        response.cookies.set(sessionCookie('', 0))
        return response
      },
    },

    update: {
      /** What the updater is doing. The Updates page asks every two seconds while an update runs. */
      async GET(request) {
        const settings = await core.settings()
        if (!settings) return bare(404)
        const foreign = checkRead(request)
        if (foreign) return foreign
        if (!(await core.user(request.headers))) return json({ error: 'Sign in again.' }, { status: 401 })
        return updatesOffAnswer(settings) ?? json(await updaterStatus())
      },
      /** Asks the supervisor to install the latest release, when it is newer than the installed one. */
      async POST(request) {
        const settings = await core.settings()
        if (!settings) return bare(404)
        const check = await checkPost(request)
        if (!check.ok) return check.response
        const allowed = await mayChange(request)
        if ('response' in allowed) return allowed.response
        const off = updatesOffAnswer(settings)
        if (off) return off

        const by = asker(core, allowed.user, request)
        const result = await requestUpdate(by)
        if (!result.ok) return json({ error: result.error }, { status: result.status })
        adminLog(`update requested ${core.auth?.kind === 'password' ? 'from' : 'by'} ${by}`)
        return json({ ok: true }, { status: 202 })
      },
    },

    adoptUpdater: {
      GET: postOnly(false),
      async POST(request) {
        const settings = await core.settings()
        if (!settings) return bare(404)
        const check = await checkPost(request)
        if (!check.ok) return check.response
        const allowed = await mayChange(request)
        if ('response' in allowed) return allowed.response
        // Before the hour's presses are counted: a press that copies nothing uses none.
        const off = updatesOffAnswer(settings)
        if (off) return off

        const wait = adminLimits().adopt.hit('all')
        if (wait > 0) {
          return json(
            { error: 'That is a lot of copies in an hour. Try again later.' },
            { status: 429, headers: { 'Retry-After': String(wait) } },
          )
        }
        const by = asker(core, allowed.user, request)
        const result = await adoptUpdater()
        if (!result.ok) {
          adminLog(`copying the updater failed, requested ${core.auth?.kind === 'password' ? 'from' : 'by'} ${by}: ${result.error}`)
          return json({ error: result.error }, { status: result.status })
        }
        adminLog(`updater copied from ${result.tag}, requested ${core.auth?.kind === 'password' ? 'from' : 'by'} ${by}`)
        return json({ ok: true })
      },
    },
  }
}

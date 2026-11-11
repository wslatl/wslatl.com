import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode } from 'react'
import { prerender } from 'react-dom/static'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { admin as kitAdmin } from '@/platform/admin/app'
import { type Admin, get, logsOf, makeAdmin, paths, post, setUp, signIn, tearDown, wholeResponse } from './site'

/**
 * The GitHub token, the password, its hash and the session secret live in
 * .env and never leave the server: not in an answer, not in a header, not
 * in the log. tests/http checks the same against a build and its log, and
 * scripts/scan-build.mjs checks the build itself.
 */
vi.mock('server-only', () => ({}))
vi.setConfig({ testTimeout: 30_000 })

// The Updates page, rendered as Next renders it for a request: the request's
// headers (its cookie) from next/headers, and the router the page's panel uses.
const incoming = vi.hoisted(() => ({ headers: new Headers() }))
vi.mock('next/headers', () => ({ headers: async () => incoming.headers }))
vi.mock('next/server', async (original) => ({ ...(await original<typeof import('next/server')>()), connection: async () => {} }))
vi.mock('next/navigation', async (original) => ({
  ...(await original<typeof import('next/navigation')>()),
  useRouter: () => ({ replace: () => {}, refresh: () => {} }),
}))

async function html(node: ReactNode): Promise<string> {
  const { prelude } = await prerender(node)
  return new Response(prelude).text()
}

let admin: Admin
beforeAll(() => {
  admin = makeAdmin()
})
beforeEach(() => setUp(admin))
afterAll(() => tearDown(admin))

function expectNoSecret(text: string, what: string) {
  for (const secret of admin.secrets) expect(text.includes(secret), `${what} holds a secret`).toBe(false)
}

describe('every answer the admin gives', () => {
  it('holds no secret, signed in or not, right or wrong, and neither does the log', async () => {
    const { result: answers, logs } = await logsOf(async () => {
      const cookie = await signIn(admin)
      // The updater's state, which the status route sends on as it is.
      writeFileSync(join(admin.updaterDir, 'state.json'), JSON.stringify({ status: 'idle', current: null, log: ['ok'], message: 'ok' }))
      // One after another: two password checks at once would turn the rest away as busy.
      const sent: Response[] = []
      for (const send of [
        () => post(paths.login, { password: admin.password }),
        () => post(paths.login, { password: `${admin.password}x` }),
        () => post(paths.login, { password: admin.passwordHash }),
        () => post(paths.login, { password: admin.secret }, { 'cf-connecting-ip': '198.51.100.8' }),
        () => post(paths.login, '{"password":'),
        () => post(paths.login, { password: admin.password }, { origin: 'https://evil.example' }),
        () => get(paths.update, { cookie }),
        () => get(paths.update),
        () => post(paths.update, {}, { cookie }),
        () => post(paths.update, {}),
        () => post(paths.adoptUpdater, {}, { cookie }),
        () => post(paths.adoptUpdater, {}),
        () => post(paths.logout, {}, { cookie }),
        () => get(`${paths.shareCard}?path=/pricing&locale=xx`),
        () => get(paths.companyProfile),
      ]) {
        sent.push(await send())
      }
      return sent
    })
    for (const answer of answers) expectNoSecret(await wholeResponse(answer), `${answer.status} ${answer.url}`)
    expectNoSecret(logs, 'the log')
    // The log does say what happened, with the address and nothing more.
    expect(logs).toMatch(/\[admin\] login from 198\.51\.100\.7/)
    expect(logs).toMatch(/\[admin\] login failed from 198\.51\.100\.7/)
  })

  it('says only which setting is wrong when one is, never its value', async () => {
    // What signing in needs: the whole admin is off, every address a 404.
    for (const [name, value] of [
      ['ADMIN_SESSION_SECRET', admin.secret.slice(0, 31)],
      ['ADMIN_PASSWORD_HASH', `${admin.passwordHash}:x`],
    ] as const) {
      setUp(admin, { [name]: value })
      const { result, logs } = await logsOf(() => post(paths.login, { password: admin.password }))
      expect(result.status, name).toBe(404)
      expect(logs, name).toContain(name)
      expectNoSecret(logs, `the log for a bad ${name}`)
      expect(logs.includes(value), name).toBe(false)
    }
    // What updating needs: signing in still works, and updates are off.
    // The update route says which setting, to whoever is signed in, and
    // neither it nor the log says what the setting holds.
    for (const [name, value] of [
      ['GITHUB_API_URL', `http://${admin.token}.example`],
      ['GITHUB_REPO', `../${admin.token}`],
    ] as const) {
      setUp(admin, { [name]: value })
      const { result, logs } = await logsOf(async () => {
        const cookie = await signIn(admin)
        return post(paths.update, {}, { cookie })
      })
      expect(result.status, name).toBe(503)
      const answer = await wholeResponse(result)
      expect(answer, name).toContain(name)
      expect(answer.includes(value), name).toBe(false)
      expectNoSecret(answer, `the answer for a bad ${name}`)
      expect(logs, name).toContain(name)
      expectNoSecret(logs, `the log for a bad ${name}`)
      expect(logs.includes(value), name).toBe(false)
    }
  })

  it('turns updating off rather than send the token anywhere but GitHub over HTTPS', async () => {
    for (const api of ['http://api.github.com', 'http://192.0.2.1:8080', 'ftp://api.github.com', 'not an address']) {
      setUp(admin, { GITHUB_API_URL: api })
      // Nobody signed in: as anywhere, nothing but a 401.
      expect((await get(paths.update, { cookie: '__Host-wslatl_admin=x.y' })).status, api).toBe(401)
      // Signed in: updates are off, and say so.
      const cookie = await signIn(admin)
      for (const answer of [await get(paths.update, { cookie }), await post(paths.update, {}, { cookie }), await post(paths.adoptUpdater, {}, { cookie })]) {
        expect(answer.status, api).toBe(503)
        expect(await answer.text(), api).toContain('GITHUB_API_URL')
      }
    }
  })

  it('has the Updates page, the one thing that sends the token, ask GitHub over HTTPS and nothing else', async () => {
    // Every request the page makes is caught here and answered as GitHub
    // would for a repository with no releases: nothing leaves the machine.
    const fetches = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('{"message":"Not Found"}', { status: 404 }))
    const asked = () => fetches.mock.calls.map(([url, init]) => ({ url: String(url), auth: new Headers(init?.headers).get('authorization') }))
    try {
      // With the settings right, the page does ask, with the token, and only
      // GitHub's API: which shows this test would see a request that went
      // anywhere else.
      setUp(admin)
      incoming.headers = new Headers({ cookie: await signIn(admin) })
      await html(await kitAdmin.Updates())
      expect(asked().length).toBeGreaterThan(0)
      for (const { url, auth } of asked()) {
        expect(url).toMatch(/^https:\/\/api\.github\.com\/repos\/wslatl\/wslatl\.com(\/|$)/)
        expect(auth).toBe(`Bearer ${admin.token}`)
      }
      // With any address but GitHub's over HTTPS, it says updates are off,
      // and asks nobody anything.
      for (const api of ['http://api.github.com', 'http://192.0.2.1:8080', 'ftp://api.github.com', 'not an address', `https://${admin.token}@api.github.com`]) {
        fetches.mockClear()
        setUp(admin, { GITHUB_API_URL: api })
        incoming.headers = new Headers({ cookie: await signIn(admin) })
        const page = await html(await kitAdmin.Updates())
        expect(page, api).toContain('Updates are off')
        expect(page.includes(admin.token), api).toBe(false)
        expect(asked(), api).toEqual([])
      }
    } finally {
      fetches.mockRestore()
      incoming.headers = new Headers()
    }
  })
})

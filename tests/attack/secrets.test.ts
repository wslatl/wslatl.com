import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Admin, get, logsOf, makeAdmin, paths, post, setUp, signIn, tearDown, wholeResponse } from './site'

/**
 * The GitHub token, the password, its hash and the session secret live in
 * .env and never leave the server: not in an answer, not in a header, not
 * in the log. tests/http checks the same against a build and its log, and
 * scripts/scan-build.mjs checks the build itself.
 */
vi.mock('server-only', () => ({}))
vi.setConfig({ testTimeout: 30_000 })

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
    const fetches = vi.spyOn(globalThis, 'fetch')
    try {
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
      // And the token went nowhere.
      expect(fetches).not.toHaveBeenCalled()
    } finally {
      fetches.mockRestore()
    }
  })
})

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Admin, adminRoutes, fromThisSite, makeAdmin, paths, post, restart, send, setUp, signIn, tearDown } from './site'

/**
 * Every admin route, attacked the ways a browser on another site, or a
 * script with no session, can: no cookie, a forged origin, the wrong method,
 * a Server Action, and requests at the same moment.
 */
vi.mock('server-only', () => ({}))
// Signing in runs a deliberately slow scrypt.
vi.setConfig({ testTimeout: 30_000 })

let admin: Admin
let cookie = ''
beforeAll(() => {
  admin = makeAdmin()
})
beforeEach(async () => {
  setUp(admin)
  vi.spyOn(console, 'log').mockImplementation(() => {})
  cookie = await signIn(admin)
})
afterAll(() => tearDown(admin))

const requestFile = () => join(admin.updaterDir, 'request.json')

/**
 * Sends method to path as if from a page on this site, signed in, with these
 * headers on top. A header given as '' is left out altogether.
 */
function call(path: string, method: string, headers: Record<string, string> = {}, body: string | undefined = '{}') {
  const withBody = method !== 'GET' && method !== 'HEAD'
  const sent = Object.fromEntries(Object.entries({ ...fromThisSite(), cookie, ...headers }).filter(([, value]) => value !== ''))
  return send(path, { method, headers: sent, body: withBody ? body : undefined })
}

describe('a request with no session', () => {
  it('reads and changes nothing', async () => {
    for (const [path, method] of [
      [paths.update, 'GET'],
      [paths.update, 'POST'],
      [paths.adoptUpdater, 'POST'],
    ]) {
      const response = await call(path, method, { cookie: '' })
      expect(response.status, `${method} ${path}`).toBe(401)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(await response.json()).toEqual({ error: 'Sign in again.' })
    }
    expect(existsSync(requestFile())).toBe(false)
  })
})

describe('a request from another site (CSRF)', () => {
  // What a page elsewhere can make a browser send. None of these is a page
  // on this site, even with the owner's cookie sent along.
  const foreign: [string, Record<string, string>][] = [
    ['another site', { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }],
    ['another site, Sec-Fetch-Site left out', { origin: 'https://evil.example', 'sec-fetch-site': '' }],
    ['a look-alike host', { origin: 'https://wslatl.com.evil.example' }],
    ['a look-alike path', { origin: 'https://evil.example/wslatl.com' }],
    ['another port', { origin: 'https://wslatl.com:8443' }],
    ['a sandboxed frame', { origin: 'null' }],
    ['no Origin at all', { origin: '' }],
    ['another site under wslatl.com', { origin: 'https://knowledge.wslatl.com', 'sec-fetch-site': 'same-site' }],
    ['this origin, but the browser says another site sent it', { 'sec-fetch-site': 'cross-site' }],
    ['this origin, but from a sibling site', { 'sec-fetch-site': 'same-site' }],
    ['an Origin that is no address', { origin: 'wslatl.com' }],
  ]

  it('is refused by every POST route, before it does anything', async () => {
    for (const { path } of adminRoutes) {
      for (const [what, headers] of foreign) {
        const response = await call(path, 'POST', headers, path === paths.login ? JSON.stringify({ password: admin.password }) : '{}')
        expect(response.status, `${path}: ${what}`).toBe(403)
        expect(response.headers.get('set-cookie'), `${path}: ${what}`).toBeNull()
      }
    }
    expect(existsSync(requestFile())).toBe(false)
    // Still signed in: a forged sign-out did not end the session.
    expect((await call(paths.update, 'GET', { origin: '' })).status).toBe(200)
  })

  it('is refused by the status route too, though it could never read the answer', async () => {
    for (const [what, headers] of foreign.filter(([, sent]) => sent.origin !== '')) {
      expect((await call(paths.update, 'GET', headers)).status, what).toBe(403)
    }
    // Typed into the address bar, or fetched by the dashboard itself.
    expect((await call(paths.update, 'GET', { origin: '', 'sec-fetch-site': 'none' })).status).toBe(200)
    expect((await call(paths.update, 'GET', { origin: '' })).status).toBe(200)
  })

  it('cannot get in as a form, plain text or anything else a page elsewhere may send without asking', async () => {
    for (const type of ['application/x-www-form-urlencoded', 'multipart/form-data; boundary=x', 'text/plain', 'application/json, text/plain', '']) {
      for (const { path } of adminRoutes) {
        const response = await call(path, 'POST', { 'content-type': type }, `password=${encodeURIComponent(admin.password)}`)
        expect(response.status, `${path}: ${type}`).toBe(415)
      }
    }
  })
})

describe('the wrong method', () => {
  it('gets a 405 from every admin route, saying what it takes', async () => {
    for (const { path, methods } of adminRoutes) {
      for (const method of ['PUT', 'PATCH', 'DELETE', 'OPTIONS', 'PROPFIND', 'GET', 'POST']) {
        if ((methods as readonly string[]).includes(method)) continue
        const response = await call(path, method)
        expect(response.status, `${method} ${path}`).toBe(405)
      }
      const put = await call(path, 'PUT')
      expect(put.headers.get('allow')).toBe('GET, HEAD, POST')
    }
  })

  it('is not slipped past with a method override header', async () => {
    for (const header of ['x-http-method-override', 'x-http-method', 'x-method-override']) {
      const response = await call(paths.update, 'GET', { [header]: 'POST' })
      expect(response.status).toBe(200)
      expect(existsSync(requestFile())).toBe(false)
    }
  })

  it('gets a 405 for anything that names a Server Action, on every admin route and method', async () => {
    for (const { path } of adminRoutes) {
      for (const method of ['GET', 'POST']) {
        for (const action of ['x', '0'.repeat(40), '7f'.repeat(21)]) {
          const response = await call(path, method, { 'next-action': action })
          expect(response.status, `${method} ${path} ${action}`).toBe(405)
        }
      }
    }
    expect(existsSync(requestFile())).toBe(false)
  })
})

describe('asking for an update', () => {
  it('takes nothing from the request: no tag, path or name in the body reaches the updater', async () => {
    // Written out by hand, since an object literal would take __proto__ as its prototype.
    const hostile =
      '{"tag":"../../../../etc/passwd","by":"v1.0.0/../../x","requestedAt":"x","__proto__":{"by":"polluted"},"constructor":{"prototype":{"by":"polluted"}},"path":"C:\\\\Windows"}'
    const response = await post(paths.update, hostile, { cookie })
    expect(response.status).toBe(202)
    const asked = JSON.parse(readFileSync(requestFile(), 'utf8'))
    expect(Object.keys(asked).toSorted()).toEqual(['by', 'requestedAt'])
    expect(asked.by).toBe('198.51.100.7')
    expect(Date.parse(asked.requestedAt)).not.toBeNaN()
    expect(readdirSync(admin.updaterDir)).toEqual(['request.json'])
    expect(({} as { by?: string }).by).toBeUndefined()
  })

  it('happens once when the button is pressed many times at the same moment', async () => {
    const answers = await Promise.all(Array.from({ length: 12 }, () => post(paths.update, {}, { cookie })))
    const statuses = answers.map((answer) => answer.status).toSorted()
    expect(statuses).toEqual([202, ...Array(11).fill(409)])
  })

  it('is refused while an update runs', async () => {
    for (const status of ['downloading', 'installing', 'building', 'checking', 'swapping']) {
      writeFileSync(join(admin.updaterDir, 'state.json'), JSON.stringify({ status, log: [] }))
      expect((await post(paths.update, {}, { cookie })).status, status).toBe(409)
    }
    expect(existsSync(requestFile())).toBe(false)
  })
})

const release = () => join(admin.updaterDir, 'releases', 'v1.2.0')
const uploaded = (file: string) => join(admin.siteDir, 'scripts', file)
const write = (file: string, text: string) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
}
const state = (current: object | null) => writeFileSync(join(admin.updaterDir, 'state.json'), JSON.stringify({ status: 'idle', current, log: [] }))

describe('copying the updater over', () => {
  beforeEach(() => {
    // A release the updater installed: built, with its own updater.
    write(join(release(), '.next', 'BUILD_ID'), 'build')
    write(join(release(), 'scripts', 'serve.mjs'), 'new serve')
    write(join(release(), 'scripts', 'updater', 'lib.mjs'), 'new lib')
    write(uploaded('serve.mjs'), 'old serve')
    write(uploaded('updater/lib.mjs'), 'old lib')
    state({ tag: 'v1.2.0', sha: 'a'.repeat(40), name: 'v1.2.0', publishedAt: '', deployedAt: '' })
  })

  it('refuses a release whose name could reach outside the releases folder, or is no version', async () => {
    // Folders a bad name would point at, each holding an updater to copy.
    write(join(admin.siteDir, 'evil', 'scripts', 'serve.mjs'), 'evil serve')
    for (const tag of [
      '../../evil',
      '../../../../../../evil',
      'v1.2.0/../../../evil',
      'v1.2.0\\..\\..\\..\\evil',
      '..',
      '.',
      '',
      '/',
      'C:\\evil',
      'v1.2.0\u0000',
      'v1.2.0 ',
      ' v1.2.0',
      'v1.2.0\n',
      'v1.2',
      'V1.2.0',
      'v01.2.0',
      'v1.2.0-rc.1',
      'v１.２.０',
    ]) {
      state({ tag, sha: 'a'.repeat(40) })
      // As after a restart, so the hour's limit on copies (below) stays out of it.
      restart()
      const response = await post(paths.adoptUpdater, {}, { cookie })
      expect(response.status, JSON.stringify(tag)).toBe(409)
      expect(readFileSync(uploaded('serve.mjs'), 'utf8')).toBe('old serve')
    }
    for (const current of [null, 42, 'v1.2.0', { tag: 7 }, { tag: ['v1.2.0'] }, { tag: { toString: 'v1.2.0' } }]) {
      state(current as object)
      restart()
      expect((await post(paths.adoptUpdater, {}, { cookie })).status, JSON.stringify(current)).toBe(409)
    }
    expect(readFileSync(uploaded('serve.mjs'), 'utf8')).toBe('old serve')
  })

  it('copies at most ten times an hour, whoever asks', async () => {
    const statuses: number[] = []
    for (let press = 0; press < 12; press++) statuses.push((await post(paths.adoptUpdater, {}, { cookie })).status)
    expect(statuses.slice(0, 10).every((status) => status === 200)).toBe(true)
    expect(statuses.slice(10)).toEqual([429, 429])
  })

  it('copies one at a time when pressed again and again, and keeps the old files as the backup', async () => {
    const answers = await Promise.all([1, 2, 3, 4].map(() => post(paths.adoptUpdater, {}, { cookie })))
    // Each press either copies (or finds it copied) or is told a copy is
    // running; none fails half way, as two copies at once could.
    const statuses = answers.map((answer) => answer.status)
    expect(statuses).toContain(200)
    expect(statuses.every((status) => status === 200 || status === 409)).toBe(true)
    expect(readFileSync(uploaded('serve.mjs'), 'utf8')).toBe('new serve')
    expect(readFileSync(join(admin.updaterDir, 'updater-backup', 'serve.mjs'), 'utf8')).toBe('old serve')
    expect(readFileSync(join(admin.updaterDir, 'updater-backup', 'updater', 'lib.mjs'), 'utf8')).toBe('old lib')
  })

  it('is refused while an update waits or runs', async () => {
    writeFileSync(requestFile(), '{}')
    expect((await post(paths.adoptUpdater, {}, { cookie })).status).toBe(409)
    expect(readFileSync(uploaded('serve.mjs'), 'utf8')).toBe('old serve')
  })
})

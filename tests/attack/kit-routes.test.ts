import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import fsPromises from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Admin, adminRoutes, deviceFrom, fromThisSite, makeAdmin, paths, post, send, setUp, signIn, signInFully, tearDown } from './site'

/**
 * Canaries for the kit's admin routes (platform/admin/server/routes.ts and
 * adopt-updater.ts), sent through this site the way a visitor sends them:
 * a switched-off admin gives nothing away on any route, the owner's own
 * sign-ins leave the limit everyone shares alone, and "Copy the new
 * updater" writes only beside an .updater folder, takes away what the
 * release dropped, and never leaves half a copy behind.
 */
vi.mock('server-only', () => ({}))
// Signing in runs a deliberately slow scrypt.
vi.setConfig({ testTimeout: 30_000 })

let admin: Admin
beforeAll(() => {
  admin = makeAdmin()
})
beforeEach(() => {
  setUp(admin)
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())
afterAll(() => tearDown(admin))

const from = (ip: string) => ({ 'cf-connecting-ip': ip })

const salt = Buffer.alloc(16, 7).toString('base64url')
const key = Buffer.alloc(32, 9).toString('base64url')
/** What signing in needs, missing or broken: each turns the whole admin off. */
const off: Record<string, string>[] = [
  { ADMIN_PASSWORD_HASH: '' },
  { ADMIN_PASSWORD_HASH: 'not a hash' },
  { ADMIN_PASSWORD_HASH: `scrypt:1048576:8:1:${salt}:${key}` },
  { ADMIN_SESSION_SECRET: '' },
  { ADMIN_SESSION_SECRET: 'shorter than thirty-two' },
]
/** Every admin route, with both methods each one exports. */
const every = adminRoutes.flatMap(({ path }) => ['GET', 'POST'].map((method) => ({ path, method })))

/** Sends one request, and says what about its answer gives the admin away, or '' when nothing does. */
async function givesAway(path: string, method: string, headers: Record<string, string>, body?: string): Promise<string> {
  const response = await send(path, { method, headers, body: method === 'POST' ? body : undefined })
  const text = await response.text()
  if (response.status !== 404) return `${method} ${path} answered ${response.status}`
  if (response.headers.get('set-cookie') !== null) return `${method} ${path} set a cookie`
  if (text !== '') return `${method} ${path} said ${text.slice(0, 60)}`
  return ''
}

describe('an admin that is off', () => {
  it('answers 404 on every admin route and method, to the owner signed in as much as to anyone', async () => {
    const cookie = await signIn(admin)
    expect(every).toHaveLength(8)
    for (const settings of off) {
      setUp(admin, settings)
      for (const { path, method } of every) {
        for (const headers of [{ ...fromThisSite(), cookie }, fromThisSite()]) {
          expect(await givesAway(path, method, headers, '{}'), JSON.stringify(settings)).toBe('')
        }
      }
    }
    expect(existsSync(join(admin.updaterDir, 'request.json'))).toBe(false)
  })

  it('answers that 404 before it looks at where a request came from or what it holds', async () => {
    const cookie = await signIn(admin)
    const site = { ...fromThisSite(), cookie }
    const requests: [string, Record<string, string>, string][] = [
      ['from another site', { ...site, origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }, '{}'],
      ['from a sibling site', { ...site, origin: 'https://knowledge.wslatl.com', 'sec-fetch-site': 'same-site' }, '{}'],
      ['with no Origin', Object.fromEntries(Object.entries(site).filter(([name]) => name !== 'origin')), '{}'],
      ['as a form', { ...site, 'content-type': 'application/x-www-form-urlencoded' }, 'password=x'],
      ['as plain text', { ...site, 'content-type': 'text/plain' }, '{}'],
      ['too big', site, JSON.stringify({ pad: 'y'.repeat(5000) })],
      ['saying it is too big', { ...site, 'content-length': '100000' }, '{}'],
      ['as broken JSON', site, '{"password":'],
      ['as JSON that is no object', site, '[]'],
    ]
    for (const settings of off) {
      setUp(admin, settings)
      for (const { path, method } of every) {
        for (const [what, headers, body] of requests) {
          expect(await givesAway(path, method, headers, body), `${what}, ${JSON.stringify(settings)}`).toBe('')
        }
      }
    }
  })
})

/**
 * Attempts with no password, each from an address of its own: every one
 * counts against the limit everyone shares, and none runs scrypt.
 */
async function guesses(count: number) {
  for (let i = 0; i < count; i++) expect((await post(paths.login, {}, from(`198.18.0.${i + 1}`))).status).toBe(401)
}

describe('the owner signing in', () => {
  it('takes a sign-in with the right password back off the limit everyone shares', async () => {
    await guesses(29)
    expect((await post(paths.login, { password: admin.password }, from('198.18.1.1'))).status).toBe(200)
    // Had it counted, this would be the thirty-first attempt.
    expect((await post(paths.login, {}, from('198.18.1.2'))).status).toBe(401)
    expect((await post(paths.login, {}, from('198.18.1.3'))).status).toBe(429)
  })

  it("counts a browser with a device cookie the site signed against that browser alone, never the shared limit", async () => {
    const { device } = await signInFully(admin, from('198.18.2.1'))
    expect(device).toMatch(/^admin_device=.+/)
    setUp(admin)
    // The owner's browser: four attempts with no password, then the right one.
    for (let i = 0; i < 4; i++) expect((await post(paths.login, {}, { ...from(`198.18.3.${i + 1}`), cookie: device })).status).toBe(401)
    const signedIn = await post(paths.login, { password: admin.password }, { ...from('198.18.3.9'), cookie: device })
    expect(signedIn.status).toBe(200)
    expect(deviceFrom(signedIn)).toMatch(/^admin_device=.+/)
    // Everyone else still has all thirty.
    await guesses(30)
    expect((await post(paths.login, {}, from('198.18.4.1'))).status).toBe(429)
  })
})

const write = (file: string, text: string) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
}

/** The uploaded folder's scripts/, where the updater runs from. */
const scripts = () => join(admin.siteDir, 'scripts')

/** An installed release, built, that brings a new updater, inside the updater folder dir. */
function installedRelease(dir: string) {
  const release = join(dir, 'releases', 'v1.2.0')
  write(join(release, '.next', 'BUILD_ID'), 'build')
  write(join(release, 'scripts', 'serve.mjs'), 'new serve')
  write(join(release, 'scripts', 'updater', 'lib.mjs'), 'new lib')
  write(join(release, 'scripts', 'updater', 'added.mjs'), 'a file the release adds')
  write(join(release, 'scripts', 'updater', 'nested', 'deep.mjs'), 'a nested file the release adds')
  const current = { tag: 'v1.2.0', sha: 'a'.repeat(40), name: 'v1.2.0', publishedAt: '', deployedAt: '' }
  write(join(dir, 'state.json'), JSON.stringify({ status: 'idle', current, log: [] }))
}

/** Every file in the uploaded folder's scripts/, with what it holds. */
const uploaded = () =>
  Object.fromEntries(
    readdirSync(scripts(), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => [relative(scripts(), join(entry.parentPath, entry.name)).replaceAll('\\', '/'), readFileSync(join(entry.parentPath, entry.name), 'utf8')]),
  )

describe('copying the updater over', () => {
  const before = {
    'serve.mjs': 'old serve',
    'updater/lib.mjs': 'old lib',
    'updater/gone.mjs': 'a file the release dropped',
    'updater/nested/old.mjs': 'a nested file the release dropped',
    'keep-old-assets.mjs': 'not part of the updater',
  }

  let cookie = ''
  beforeEach(async () => {
    rmSync(scripts(), { recursive: true, force: true })
    for (const [name, text] of Object.entries(before)) write(join(scripts(), name), text)
    installedRelease(admin.updaterDir)
    cookie = await signIn(admin)
  })

  const press = () => post(paths.adoptUpdater, {}, { cookie })

  it('refuses an UPDATER_DIR that is not named .updater, and copies nothing', async () => {
    for (const name of ['updater', '.updater-old', '.updater.bak', 'releases']) {
      // The same layout, in a folder that is not the supervisor's.
      const elsewhere = join(admin.siteDir, name)
      installedRelease(elsewhere)
      setUp(admin, { UPDATER_DIR: elsewhere })
      const response = await press()
      expect(response.status, name).toBe(503)
      expect(uploaded(), name).toEqual(before)
      rmSync(elsewhere, { recursive: true, force: true })
    }
  })

  it('takes away the updater files the new release dropped, and nothing else in scripts/', async () => {
    expect((await press()).status).toBe(200)
    expect(uploaded()).toEqual({
      'serve.mjs': 'new serve',
      'updater/lib.mjs': 'new lib',
      'updater/added.mjs': 'a file the release adds',
      'updater/nested/deep.mjs': 'a nested file the release adds',
      'keep-old-assets.mjs': 'not part of the updater',
    })
  })

  it('leaves no half-copied file, and the old updater as it was, when copying fails part of the way', async () => {
    const realCopy = fsPromises.copyFile
    let staged = 0
    vi.spyOn(fsPromises, 'copyFile').mockImplementation(async (source, target, mode) => {
      if (String(target).endsWith('.tmp') && ++staged === 2) throw Object.assign(new Error('ENOSPC: no space left on device, copyfile'), { code: 'ENOSPC' })
      return realCopy(source, target, mode)
    })
    const response = await press()
    expect(response.status).toBe(500)
    expect((await response.json()).error).toMatch(/^Could not copy the updater: ENOSPC/)
    expect(staged).toBe(2)
    expect(uploaded()).toEqual(before)
  })

  it('leaves no half-moved updater, and the old one as it was, when moving the new files in fails part of the way', async () => {
    const realRename = fsPromises.rename
    let moved = 0
    vi.spyOn(fsPromises, 'rename').mockImplementation(async (source, target) => {
      if (++moved === 2) throw Object.assign(new Error('EPERM: operation not permitted, rename'), { code: 'EPERM' })
      return realRename(source, target)
    })
    const response = await press()
    expect(response.status).toBe(500)
    expect(moved).toBe(2)
    expect(uploaded()).toEqual(before)
  })
})

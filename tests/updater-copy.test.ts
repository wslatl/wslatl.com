import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { NextRequest } from 'next/server'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import * as adopt from '@/app/admin/api/adopt-updater/route'
import { hashPassword } from '@/platform/admin/server/password'
import { adminLimitsKey } from '@/platform/admin/server/rate-limit'
import { createSession, SESSION_COOKIE } from '@/platform/admin/server/session'
import { supervisorChanged } from '../scripts/updater/lib.mjs'

/**
 * "Copy the new updater" (the admin, platform/admin/) and the supervisor
 * (scripts/serve.mjs and scripts/updater/) are both the kit's, and they have
 * to agree: once the admin has copied a release's updater over, the
 * supervisor must stop saying the release brings a new one, or the notice
 * would never go away. The kit's own tests check each side alone; this
 * checks the two together, as this site runs them.
 */
vi.mock('server-only', () => ({}))

const password = 'the admin test password'
const secret = 's'.repeat(40)
let passwordHash = ''
let root = ''
let release = ''

const write = (file: string, text: string) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
}
const read = (file: string) => readFileSync(join(root, file), 'utf8')

/** The owner pressing the button, signed in, from the Updates page. */
function press() {
  const session = createSession({ secret, passwordHash })
  return adopt.POST(
    new NextRequest('https://wslatl.com/admin/api/adopt-updater', {
      method: 'POST',
      headers: {
        host: 'wslatl.com',
        origin: 'https://wslatl.com',
        'content-type': 'application/json',
        'cf-connecting-ip': '10.0.0.1',
        cookie: `${SESSION_COOKIE}=${session}`,
      },
      body: '{}',
    }),
  )
}

beforeAll(async () => {
  passwordHash = await hashPassword(password)
})

beforeEach(() => {
  // The uploaded folder, with the supervisor's folder in it, as npm run serve has them.
  root = mkdtempSync(join(tmpdir(), 'updater-copy-'))
  const dir = join(root, '.updater')
  release = join(dir, 'releases', 'v1.2.0')
  vi.stubEnv('ADMIN_PASSWORD_HASH', passwordHash)
  vi.stubEnv('ADMIN_SESSION_SECRET', secret)
  vi.stubEnv('GITHUB_TOKEN', 'test-token')
  vi.stubEnv('UPDATER_DIR', dir)
  delete (globalThis as { [adminLimitsKey]?: unknown })[adminLimitsKey]
  vi.spyOn(console, 'log').mockImplementation(() => {})
  // The installed release, built, bringing a new updater.
  write(join(release, '.next', 'BUILD_ID'), 'build')
  write(join(release, 'scripts', 'serve.mjs'), 'new serve')
  write(join(release, 'scripts', 'updater', 'lib.mjs'), 'new lib')
  write(join(release, 'scripts', 'updater', 'dev-files.mjs'), 'new file')
  write(join(root, 'scripts', 'serve.mjs'), 'old serve')
  write(join(root, 'scripts', 'updater', 'lib.mjs'), 'old lib')
  write(join(root, 'scripts', 'updater', 'gone.mjs'), 'not in the release')
  const current = { tag: 'v1.2.0', sha: 'a'.repeat(40), name: 'v1.2.0', publishedAt: '', deployedAt: '' }
  writeFileSync(join(dir, 'state.json'), JSON.stringify({ status: 'idle', current, log: [] }))
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  rmSync(root, { recursive: true, force: true })
})

describe('copying the updater over from the live release', () => {
  it('leaves the uploaded folder matching the release, so the supervisor stops asking', async () => {
    expect(supervisorChanged(root, release)).toBe(true)
    expect((await press()).status).toBe(200)
    expect(read('scripts/serve.mjs')).toBe('new serve')
    expect(read('scripts/updater/lib.mjs')).toBe('new lib')
    expect(read('scripts/updater/dev-files.mjs')).toBe('new file')
    expect(supervisorChanged(root, release)).toBe(false)
  })

  it('still agrees with the supervisor after a second press', async () => {
    expect((await press()).status).toBe(200)
    expect((await press()).status).toBe(200)
    expect(supervisorChanged(root, release)).toBe(false)
  })
})

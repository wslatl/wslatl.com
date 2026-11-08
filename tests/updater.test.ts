import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanUpAtStart,
  crashWatchSince,
  emptyState,
  liveDir,
  pruneReleases,
  readState,
  recoverState,
  releaseDir,
  rollBack,
  runUpdate,
  stateIsDamaged,
  supervisorChanged,
  syncUploadedVersion,
  updaterPaths,
  writeState,
} from '../scripts/updater/lib.mjs'
import { isNewer, parseVersion } from '../scripts/updater/release.mjs'

const sha = (c: string) => c.repeat(40)
// The releases these tests publish, and the commit each tag points at.
const commits: Record<string, string> = {
  'v1.0.0': sha('a'),
  // A release needs no commit of its own: v1.0.1 tags v1.0.0's commit.
  'v1.0.1': sha('a'),
  'v1.1.0': sha('b'),
  'v1.2.0': sha('c'),
  'v1.3.0': sha('d'),
  'v1.9.0': sha('e'),
  'v1.10.0': sha('f'),
}
const published = (tag: string, extra: Partial<{ draft: boolean; prerelease: boolean }> = {}) => ({
  tag,
  name: `Release ${tag}`,
  publishedAt: '2026-10-31T12:00:00Z',
  draft: false,
  prerelease: false,
  ...extra,
})
const installed = (tag: string) => ({
  tag,
  sha: commits[tag],
  name: `Release ${tag}`,
  publishedAt: '2026-10-30T12:00:00Z',
  deployedAt: '2026-10-30T13:00:00Z',
})

let root = ''
let paths: ReturnType<typeof updaterPaths>

function file(path: string, text = path) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, text)
}

/** The site runs release `tag`, built in its own folder. */
function live(tag: string) {
  writeState(paths, { ...emptyState(), current: installed(tag) })
  file(join(releaseDir(paths, tag), '.next', 'BUILD_ID'))
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'updater-'))
  paths = updaterPaths(root)
  // What the owner uploaded by hand: the site, its build, the settings and
  // the kept assets.
  file(join(root, 'package.json'), '{}')
  file(join(root, '.next', 'BUILD_ID'), 'root-build')
  file(join(root, '.next', 'static', 'chunks', 'live.js'))
  file(join(root, '.env'), 'ADMIN_SESSION_SECRET=keep-me')
  file(join(root, '.next-static-history', 'chunks', 'old.js'))
  mkdirSync(paths.dir, { recursive: true })
})

afterEach(() => rmSync(root, { recursive: true, force: true }))

type Deps = Parameters<typeof runUpdate>[0]['deps']
type Env = Record<string, string | undefined>

function fakeDeps(overrides: Partial<Deps> = {}) {
  const calls = {
    npm: [] as { args: string[]; cwd: string; env: Env }[],
    resolved: [] as string[],
    downloaded: [] as string[],
    switched: [] as string[],
    trials: [] as string[],
  }
  const deps: Deps = {
    latest: async () => published('v1.1.0'),
    resolve: async (tag: string) => {
      calls.resolved.push(tag)
      return commits[tag]
    },
    download: async (commit: string, dest: string) => {
      calls.downloaded.push(commit)
      file(join(dest, 'package.json'), '{}')
    },
    npm: async (args: string[], { cwd, env, onLine }: { cwd: string; env: Env; onLine: (line: string) => void }) => {
      calls.npm.push({ args, cwd, env })
      onLine(`npm ${args.join(' ')} output`)
      if (args[1] === 'build') file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
    },
    trial: async (dir: string) => {
      calls.trials.push(dir)
      return true
    },
    switchTo: async (dir: string) => {
      calls.switched.push(dir)
      return true
    },
    print: () => {},
    ...overrides,
  }
  return { deps, calls }
}

const baseEnv = { PATH: '/usr/bin', ADMIN_SESSION_SECRET: 'from-the-panel', GITHUB_TOKEN: 'token', npm_execpath: 'npm-cli.js' }
const secretNames = ['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN']
const update = (deps: Deps) => runUpdate({ paths, deps, baseEnv, secretNames })

describe('version tags', () => {
  it('are vMAJOR.MINOR.PATCH and nothing else', () => {
    expect(parseVersion('v1.4.0')).toEqual([1, 4, 0])
    expect(parseVersion('v0.0.1')).toEqual([0, 0, 1])
    expect(parseVersion('v12.0.10')).toEqual([12, 0, 10])
    for (const tag of ['1.4.0', 'v1.4', 'v1.4.0.1', 'v1.4.0-rc.1', 'V1.4.0', 'v01.4.0', 'v1.4.0 ', 'release-5', '']) {
      expect(parseVersion(tag), tag).toBeNull()
    }
  })

  it('compare as numbers, so v1.10.0 is newer than v1.9.0', () => {
    expect(isNewer('v1.10.0', 'v1.9.0')).toBe(true)
    expect(isNewer('v2.0.0', 'v1.99.99')).toBe(true)
    expect(isNewer('v1.0.1', 'v1.0.0')).toBe(true)
    expect(isNewer('v1.9.0', 'v1.10.0')).toBe(false)
    expect(isNewer('v1.4.0', 'v1.4.0')).toBe(false)
    expect(isNewer('v1.4.0', 'nonsense')).toBe(false)
  })
})

describe('an update that works', () => {
  it('builds the latest release beside the live site, switches to it, and records it', async () => {
    const { deps, calls } = fakeDeps()
    const state = await update(deps)
    const release = releaseDir(paths, 'v1.1.0')

    expect(release).toBe(join(root, '.updater', 'releases', 'v1.1.0'))
    expect(calls.npm.map((call) => call.args.join(' '))).toEqual([
      'ci --include=dev --ignore-scripts --no-audit --no-fund',
      'run build',
      'prune --omit=dev --ignore-scripts --no-audit --no-fund',
    ])
    expect(calls.npm.every((call) => call.cwd === release)).toBe(true)
    expect(calls.trials).toEqual([release])
    expect(calls.switched).toEqual([release])
    expect(state).toMatchObject({
      status: 'idle',
      current: { tag: 'v1.1.0', sha: sha('b'), name: 'Release v1.1.0', publishedAt: '2026-10-31T12:00:00Z', deployedAt: expect.any(String) },
      previous: null,
      steps: { download: 'done', install: 'done', build: 'done', prune: 'done', check: 'done', switch: 'done' },
      message: 'Installed v1.1.0 (commit bbbbbbb).',
    })
    expect(readState(paths)).toEqual(state)
    expect(liveDir(paths, state)).toBe(release)
    expect(state.log).toContain('npm run build output')
  })

  it('builds exactly the commit the tag pointed at when the update started', async () => {
    // A tag moved during the update must not swap in other code: the tag is
    // resolved once, and only the commit is used after that.
    let asked = 0
    const { deps, calls } = fakeDeps({
      resolve: async () => (++asked === 1 ? sha('b') : sha('9')),
    })
    const state = await update(deps)
    expect(asked).toBe(1)
    expect(calls.downloaded).toEqual([sha('b')])
    expect(calls.npm[1].env.SITE_COMMIT).toBe(sha('b'))
    expect(state.current?.sha).toBe(sha('b'))
  })

  it('gives the build its release, its commit and the shared asset history, and keeps every secret out of npm', async () => {
    const { deps, calls } = fakeDeps()
    await update(deps)
    for (const { env } of calls.npm) {
      for (const name of secretNames) expect(env[name], name).toBeUndefined()
      expect(env.PATH).toBe('/usr/bin')
    }
    expect(calls.npm[1].env).toMatchObject({
      SITE_RELEASE: 'v1.1.0',
      SITE_COMMIT: sha('b'),
      STATIC_HISTORY_DIR: join(root, '.next-static-history'),
    })
  })

  it('prunes the release after its build and before its trial start, which sees it pruned', async () => {
    const order: string[] = []
    const envs: Record<string, Env> = {}
    const seen: Record<string, Record<string, boolean>> = {}
    let stepsAtTrial = {}
    const watched = ['tests', '.github', 'eslint.config.mjs', '.next/cache', 'node_modules/vitest', '.next/BUILD_ID', 'node_modules/next', 'next.config.mjs', 'scripts/serve.mjs']
    const look = (dir: string) => Object.fromEntries(watched.map((path) => [path, existsSync(join(dir, path))]))
    const { deps } = fakeDeps({
      download: async (_commit, dest) => {
        for (const path of ['package.json', 'next.config.mjs', 'scripts/serve.mjs', 'tests/site.test.ts', '.github/workflows/ci.yml', 'eslint.config.mjs']) {
          file(join(dest, path))
        }
      },
      npm: async (args, { cwd, env }) => {
        order.push(`npm ${args[0]}`)
        envs[args[0]] = env
        if (args[0] === 'ci') for (const name of ['next', 'vitest']) file(join(cwd, 'node_modules', name, 'package.json'), '{}')
        if (args[1] === 'build') {
          seen.build = look(cwd)
          file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
          file(join(cwd, '.next', 'cache', 'turbopack', 'entry'))
        }
        if (args[0] === 'prune') {
          seen.prune = look(cwd)
          // What npm prune --omit=dev does here: vitest is a devDependency.
          rmSync(join(cwd, 'node_modules', 'vitest'), { recursive: true })
        }
      },
      trial: async (dir) => {
        order.push('trial')
        seen.trial = look(dir)
        stepsAtTrial = readState(paths).steps
        return true
      },
    })
    const state = await update(deps)

    expect(order).toEqual(['npm ci', 'npm run', 'npm prune', 'trial'])
    // The build has every file. The files go before npm prune, the devDependencies with it.
    expect(seen.build).toMatchObject({ tests: true, '.github': true, 'eslint.config.mjs': true })
    expect(seen.prune).toMatchObject({ tests: false, '.github': false, 'eslint.config.mjs': false, '.next/cache': false, 'node_modules/vitest': true })
    expect(seen.trial).toEqual({
      tests: false,
      '.github': false,
      'eslint.config.mjs': false,
      '.next/cache': false,
      'node_modules/vitest': false,
      '.next/BUILD_ID': true,
      'node_modules/next': true,
      'next.config.mjs': true,
      'scripts/serve.mjs': true,
    })
    expect(stepsAtTrial).toMatchObject({ build: 'done', prune: 'done', check: 'running' })
    expect(envs.prune).toEqual(envs.ci)
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' }, steps: { prune: 'done', check: 'done', switch: 'done' } })
    expect(state.log).toContain('Deleted what production never uses: tests, .github, eslint.config.mjs, .next/cache')
  })

  it('compares versions as numbers', async () => {
    live('v1.9.0')
    const { deps, calls } = fakeDeps({ latest: async () => published('v1.10.0') })
    const state = await update(deps)
    expect(calls.resolved).toEqual(['v1.10.0'])
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.10.0' }, previous: { tag: 'v1.9.0' } })
  })

  it('hands the live build files to the new build, so the history step keeps them', async () => {
    const seen: string[] = []
    const { deps } = fakeDeps({
      npm: async (args, { cwd }) => {
        if (args[1] === 'build') seen.push(...readdirSync(join(cwd, '.next', 'static', 'chunks')))
      },
    })
    await update(deps)
    expect(seen).toEqual(['live.js'])
  })

  it('hands over none of the old files put back after the live build, so the history can let them go', async () => {
    // Put back by the uploaded folder's build, and listed by it (scripts/keep-old-assets.mjs).
    file(join(root, '.next', 'static', 'chunks', 'put-back.js'))
    file(join(root, '.next', 'restored-assets.json'), JSON.stringify(['chunks/put-back.js']))
    const seen: string[] = []
    const { deps } = fakeDeps({
      npm: async (args, { cwd }) => {
        if (args[1] === 'build') seen.push(...readdirSync(join(cwd, '.next', 'static', 'chunks')))
      },
    })
    await update(deps)
    expect(seen).toEqual(['live.js'])
  })

  it('never touches .env, the asset history or the folder the owner uploaded', async () => {
    const { deps } = fakeDeps()
    await update(deps)
    expect(readFileSync(join(root, '.env'), 'utf8')).toBe('ADMIN_SESSION_SECRET=keep-me')
    expect(existsSync(join(root, '.next-static-history', 'chunks', 'old.js'))).toBe(true)
    expect(readFileSync(join(root, '.next', 'BUILD_ID'), 'utf8')).toBe('root-build')
  })

  it('keeps the current and previous releases and removes older ones', async () => {
    for (const tag of ['v1.1.0', 'v1.2.0', 'v1.3.0']) {
      const { deps } = fakeDeps({ latest: async () => published(tag) })
      await update(deps)
    }
    const state = readState(paths)
    expect(state.current?.tag).toBe('v1.3.0')
    expect(state.previous?.tag).toBe('v1.2.0')
    expect(readdirSync(paths.releases).toSorted()).toEqual(['v1.2.0', 'v1.3.0'])
  })

  it('removes the previous release before building, so at most three copies of the site are on the disk', async () => {
    for (const tag of ['v1.1.0', 'v1.2.0']) {
      const { deps } = fakeDeps({ latest: async () => published(tag) })
      await update(deps)
    }
    const seen: string[] = []
    const { deps } = fakeDeps({
      latest: async () => published('v1.3.0'),
      npm: async (args, { cwd }) => {
        if (args[1] === 'build') {
          seen.push(...readdirSync(paths.releases).toSorted())
          file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
        }
      },
    })
    const state = await update(deps)
    // v1.1.0 (previous) is gone while v1.3.0 builds; v1.2.0 (live) stays.
    expect(seen).toEqual(['v1.2.0', 'v1.3.0'])
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.3.0' }, previous: { tag: 'v1.2.0' } })
  })

  it('builds a release that points at the live release\'s commit in a folder of its own', async () => {
    // Folders named by commit put v1.0.1 in the folder v1.0.0 was serving
    // from, and the update deleted it before downloading.
    live('v1.0.0')
    const liveBuild = join(releaseDir(paths, 'v1.0.0'), '.next', 'BUILD_ID')
    const seen: { cwd: string; liveStillThere: boolean }[] = []
    const { deps } = fakeDeps({
      latest: async () => published('v1.0.1'),
      npm: async (args, { cwd }) => {
        if (args[1] !== 'build') return
        seen.push({ cwd, liveStillThere: existsSync(liveBuild) })
        file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
      },
    })
    const state = await update(deps)
    expect(seen).toEqual([{ cwd: releaseDir(paths, 'v1.0.1'), liveStillThere: true }])
    expect(state).toMatchObject({
      status: 'idle',
      current: { tag: 'v1.0.1', sha: sha('a') },
      previous: { tag: 'v1.0.0', sha: sha('a') },
    })
    expect(readdirSync(paths.releases).toSorted()).toEqual(['v1.0.0', 'v1.0.1'])
  })

  it('forgets a release whose build is gone, so a failed build of the same tag is never served', async () => {
    // v1.1.0 is recorded as installed, but its build has gone, so the site
    // runs from the uploaded folder. Installing v1.1.0 again fails its trial.
    writeState(paths, { ...emptyState(), current: installed('v1.1.0') })
    mkdirSync(releaseDir(paths, 'v1.1.0'), { recursive: true })
    const { deps } = fakeDeps({ trial: async () => false })
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'failed', current: null })
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
    // The next start serves the uploaded folder, not the failed build.
    expect(liveDir(paths, recoverState(paths))).toBe(root)
  })

  it('installs the latest release over a folder uploaded by hand, and over a live release whose folder is gone', async () => {
    writeState(paths, { ...emptyState(), current: installed('v1.1.0') })
    const { deps } = fakeDeps()
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' } })
    expect(existsSync(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'))).toBe(true)
  })

  it('keeps going when the server log cannot be written', async () => {
    const { deps } = fakeDeps({
      print: () => {
        throw new Error('stdout closed')
      },
    })
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' } })
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(true)
  })

  it('takes the request only once it has said it is busy', async () => {
    writeFileSync(paths.request, '{}')
    const states: string[] = []
    const { deps } = fakeDeps({
      latest: async () => {
        states.push(`${readState(paths).status} ${existsSync(paths.request)}`)
        return published('v1.1.0')
      },
    })
    await update(deps)
    expect(states).toEqual(['downloading false'])
  })
})

describe('the folder actually served', () => {
  it('removes every release but the live one before building, the one a crash took back out too', async () => {
    // After a crash rollback: v1.0.0 runs again, v1.1.0's folder is still there.
    live('v1.0.0')
    file(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'))
    writeState(paths, { ...readState(paths), withdrawn: ['v1.1.0'] })
    const seen: string[] = []
    const { deps } = fakeDeps({
      latest: async () => published('v1.2.0'),
      npm: async (args, { cwd }) => {
        if (args[1] !== 'build') return
        seen.push(...readdirSync(paths.releases).toSorted())
        file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
      },
    })
    const state = await update(deps)
    expect(seen).toEqual(['v1.0.0', 'v1.2.0'])
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.2.0' }, previous: { tag: 'v1.0.0' }, withdrawn: [] })
  })

  it('does not install again the release a crash took back out', async () => {
    live('v1.0.0')
    writeState(paths, { ...readState(paths), withdrawn: ['v1.1.0'] })
    const { deps, calls } = fakeDeps()
    const state = await update(deps)
    expect(state.message).toBe('v1.1.0 was taken back out after it kept stopping, so it is not installed again. Publish the fix as a newer release.')
    expect(calls.resolved).toEqual([])
    expect(calls.npm).toEqual([])
  })

  it('goes back to the folder served, and keeps it, when the state was lost', async () => {
    // v1.0.0 runs, but state.json was lost: nothing names it.
    file(join(releaseDir(paths, 'v1.0.0'), '.next', 'BUILD_ID'))
    const tried: string[] = []
    const { deps } = fakeDeps({
      switchTo: async (dir) => {
        tried.push(dir)
        return dir === releaseDir(paths, 'v1.0.0')
      },
    })
    const state = await runUpdate({ paths, deps, baseEnv, secretNames, serving: releaseDir(paths, 'v1.0.0') })
    expect(tried).toEqual([releaseDir(paths, 'v1.1.0'), releaseDir(paths, 'v1.0.0')])
    expect(state.status).toBe('rolled-back')
    expect(existsSync(join(releaseDir(paths, 'v1.0.0'), '.next', 'BUILD_ID'))).toBe(true)
  })

  it('never builds into the folder being served, which a lost state could make look new', async () => {
    file(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'), 'live-build')
    const { deps, calls } = fakeDeps()
    const state = await runUpdate({ paths, deps, baseEnv, secretNames, serving: releaseDir(paths, 'v1.1.0') })
    expect(state.message).toBe('v1.1.0 is the release already running, so nothing was installed.')
    expect(calls.npm).toEqual([])
    expect(readFileSync(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'), 'utf8')).toBe('live-build')
  })

  it('counts the release before as installed when that is the folder served', async () => {
    // A rollback that could not be recorded: the state still names v1.1.0,
    // but v1.0.0 is what runs.
    installedPair()
    const { deps, calls } = fakeDeps({ latest: async () => published('v1.1.0') })
    const state = await runUpdate({ paths, deps, baseEnv, secretNames, serving: releaseDir(paths, 'v1.0.0') })
    expect(calls.resolved).toEqual(['v1.1.0'])
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' }, previous: { tag: 'v1.0.0' } })
  })
})

describe('the crash watch across a restart', () => {
  const window = 10 * 60_000

  it('is kept for a release an update installed, for the rest of its ten minutes', async () => {
    const { deps } = fakeDeps()
    const state = await update(deps)
    const since = Date.parse(String(state.watchSince))
    expect(Number.isFinite(since)).toBe(true)
    const dir = releaseDir(paths, 'v1.1.0')
    expect(crashWatchSince(paths, state, dir, window, since + 60_000)).toBe(since)
    expect(crashWatchSince(paths, state, dir, window, since + window)).toBeNull()
    // Not when something else is what runs.
    expect(crashWatchSince(paths, state, root, window, since + 60_000)).toBeNull()
  })

  it('is never armed for a release a rollback went back to', async () => {
    // v1.1.0 kept stopping and the site went back to v1.0.0. A restart a few
    // minutes later used to watch v1.0.0 as if just installed, and three of
    // its stops then took the site to the uploaded folder.
    installedPair()
    writeState(paths, { ...readState(paths), watchSince: new Date().toISOString() })
    await rollBack({ paths, deps: rollbackDeps(async () => true), reason: 'It kept stopping.', crashed: true })
    const state = readState(paths)
    expect(state.watchSince).toBeNull()
    expect(crashWatchSince(paths, state, releaseDir(paths, 'v1.0.0'), window)).toBeNull()
  })

  it('forgets only the withdrawn releases older than one it installs', async () => {
    live('v1.0.0')
    writeState(paths, { ...readState(paths), withdrawn: ['v1.1.0', 'v1.3.0'] })
    const { deps } = fakeDeps({ latest: async () => published('v1.2.0') })
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.2.0' }, withdrawn: ['v1.3.0'] })
  })
})

describe('what an update leaves behind', () => {
  it('keeps npm\'s cache under .updater/ and removes it afterwards, however the update ends', async () => {
    for (const fails of [false, true]) {
      const caches: string[] = []
      const { deps } = fakeDeps({
        npm: async (args, { cwd, env }) => {
          caches.push(String(env.npm_config_cache))
          mkdirSync(String(env.npm_config_cache), { recursive: true })
          if (args[1] === 'build') {
            if (fails) throw new Error('npm run build failed (exit code 1).')
            file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
          }
        },
      })
      await update(deps)
      expect(new Set(caches)).toEqual(new Set([join(root, '.updater', 'npm-cache')]))
      expect(existsSync(join(root, '.updater', 'npm-cache')), `fails: ${fails}`).toBe(false)
      rmSync(paths.releases, { recursive: true, force: true })
      writeState(paths, emptyState())
    }
  })

  it('tries the last state write again once the npm cache has freed some room', async () => {
    // A full disk at the moment of the switch: the success could not be written.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {
      // The room the npm cache frees, as it were.
      if (existsSync(paths.state) && statSync(paths.state).isDirectory()) rmSync(paths.state, { recursive: true })
    })
    const { deps } = fakeDeps({
      switchTo: async () => {
        rmSync(paths.state, { force: true })
        mkdirSync(paths.state)
        return true
      },
    })
    await update(deps)
    error.mockRestore()
    expect(readState(paths)).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' } })
  })

  it('says so loudly when the last state cannot be written at all', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const lines: string[] = []
    const { deps } = fakeDeps({
      print: (line: string) => lines.push(line),
      switchTo: async () => {
        rmSync(paths.state, { force: true })
        mkdirSync(paths.state)
        return true
      },
    })
    await update(deps)
    error.mockRestore()
    expect(lines.at(-1)).toMatch(/Could not save the updater's state .*is the disk full/)
  })

  it('ignores lines from a build that outlived its update, so they never overwrite a later state', async () => {
    let late: ((line: string) => void) | undefined
    const { deps } = fakeDeps({
      npm: async (args, { onLine }) => {
        late = onLine
        if (args[1] === 'build') throw new Error('npm run build took longer than 15 minutes and was stopped.')
      },
    })
    await update(deps)
    // A later update finished since; then a straggling line arrives.
    const later = { ...emptyState(), current: installed('v1.1.0'), message: 'Installed v1.1.0.' }
    writeState(paths, later)
    late?.('a late line from the old build')
    expect(readState(paths)).toEqual(later)
  })

  it('rolls back when the switch itself throws, rather than leaving nothing running', async () => {
    live('v1.0.0')
    const tried: string[] = []
    const { deps } = fakeDeps({
      switchTo: async (dir) => {
        tried.push(dir)
        if (dir === releaseDir(paths, 'v1.1.0')) throw new Error('spawn EAGAIN')
        return true
      },
    })
    const state = await update(deps)
    expect(tried).toEqual([releaseDir(paths, 'v1.1.0'), releaseDir(paths, 'v1.0.0')])
    expect(state).toMatchObject({ status: 'rolled-back', current: { tag: 'v1.0.0' } })
    expect(state.log.join('\n')).toContain('The switch failed: spawn EAGAIN')
  })
})

/** v1.1.0 is live and v1.0.0 is the release before it, both built. */
function installedPair() {
  writeState(paths, { ...emptyState(), current: installed('v1.1.0'), previous: installed('v1.0.0') })
  file(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'))
  file(join(releaseDir(paths, 'v1.0.0'), '.next', 'BUILD_ID'))
}

const rollbackDeps = (switchTo: (dir: string) => Promise<boolean>) => ({ switchTo, print: () => {} })

describe('going back to the release before', () => {

  it('switches to the previous release and records it as installed', async () => {
    installedPair()
    const tried: string[] = []
    const result = await rollBack({ paths, deps: rollbackDeps(async (dir) => (tried.push(dir), true)), reason: 'Rolled back from the console.' })
    expect(result).toEqual({ ok: true, message: 'Rolled back from the console. The site went back to v1.0.0.' })
    expect(tried).toEqual([releaseDir(paths, 'v1.0.0')])
    expect(readState(paths)).toMatchObject({ status: 'rolled-back', current: { tag: 'v1.0.0' }, previous: null })
    expect(liveDir(paths, readState(paths))).toBe(releaseDir(paths, 'v1.0.0'))
  })

  it('goes back to the uploaded folder only on purpose, since it may be much older', async () => {
    // After an update the release before is gone: only the uploaded folder is left.
    live('v1.1.0')
    const switches: string[] = []
    const refused = await rollBack({ paths, deps: rollbackDeps(async (dir) => (switches.push(dir), true)), reason: 'Rolled back from the console.' })
    expect(refused.ok).toBe(false)
    expect(refused.message).toMatch(/rollback upload/)
    expect(switches).toEqual([])

    const result = await rollBack({ paths, deps: rollbackDeps(async () => true), reason: 'Crashed.', allowUpload: true })
    expect(result.message).toBe('Crashed. With no release before it left, the site went back to the uploaded folder, which may be older than the last release.')
    expect(readState(paths).current).toBeNull()
  })

  it('keeps the live release, and the state as it was, when the older one does not answer', async () => {
    installedPair()
    const before = readState(paths)
    const tried: string[] = []
    const result = await rollBack({
      paths,
      deps: rollbackDeps(async (dir) => (tried.push(dir), dir === releaseDir(paths, 'v1.1.0'))),
      reason: 'Rolled back from the console.',
    })
    expect(result.ok).toBe(false)
    expect(result.message).toMatch(/v1.0.0 did not answer, so v1.1.0 is still live/)
    expect(tried).toEqual([releaseDir(paths, 'v1.0.0'), releaseDir(paths, 'v1.1.0')])
    // Recorded only once the older release answers: nothing was.
    expect(readState(paths)).toEqual(before)
  })

  it('remembers a release a crash took back out, and clears the steps of the update that installed it', async () => {
    installedPair()
    writeState(paths, {
      ...readState(paths),
      steps: { download: 'done', install: 'done', build: 'done', check: 'done', switch: 'done' },
      startedAt: '2026-10-31T12:00:00Z',
      log: ['npm run build output'],
    })
    await rollBack({ paths, deps: rollbackDeps(async () => true), reason: 'It kept stopping.', crashed: true })
    expect(readState(paths)).toMatchObject({
      status: 'rolled-back',
      current: { tag: 'v1.0.0' },
      withdrawn: ['v1.1.0'],
      watchSince: null,
      steps: { download: 'pending', switch: 'pending' },
      startedAt: null,
      log: [],
    })
  })

  it('remembers every release a crash took back out, not only the last', async () => {
    installedPair()
    writeState(paths, { ...readState(paths), withdrawn: ['v1.2.0'] })
    await rollBack({ paths, deps: rollbackDeps(async () => true), reason: 'It kept stopping.', crashed: true })
    expect(readState(paths).withdrawn).toEqual(['v1.2.0', 'v1.1.0'])
  })

  it('remembers nothing after a rollback from the console', async () => {
    installedPair()
    await rollBack({ paths, deps: rollbackDeps(async () => true), reason: 'Rolled back from the console.' })
    expect(readState(paths).withdrawn ?? []).toEqual([])
  })

  it('goes back from the folder actually served, which a stale state may not name', async () => {
    installedPair()
    // The state says v1.1.0 runs, but the supervisor serves the uploaded folder.
    const result = await rollBack({ paths, deps: rollbackDeps(async () => true), reason: 'x', serving: root })
    expect(result.ok).toBe(false)
    expect(result.message).toMatch(/does not run an installed release/)
  })

  it('does nothing during an update, or when the uploaded folder is what runs', async () => {
    installedPair()
    writeState(paths, { ...readState(paths), status: 'building' })
    const switches: string[] = []
    const busy = await rollBack({ paths, deps: rollbackDeps(async (dir) => (switches.push(dir), true)), reason: 'x' })
    expect(busy.ok).toBe(false)
    writeState(paths, emptyState())
    const fromRoot = await rollBack({ paths, deps: rollbackDeps(async (dir) => (switches.push(dir), true)), reason: 'x' })
    expect(fromRoot.message).toMatch(/nothing to go back to/)
    expect(switches).toEqual([])
  })
})

describe('nothing to install', () => {
  it('when no release is published yet', async () => {
    const { deps, calls } = fakeDeps({ latest: async () => null })
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'idle', steps: { download: 'skipped', build: 'skipped' } })
    expect(state.message).toBe('No releases published yet, so there is nothing to install.')
    expect(calls.resolved).toEqual([])
    expect(calls.npm).toEqual([])
  })

  it('when the release on offer is a draft or a pre-release', async () => {
    for (const extra of [{ draft: true }, { prerelease: true }]) {
      const { deps, calls } = fakeDeps({ latest: async () => published('v1.1.0', extra) })
      const state = await update(deps)
      expect(state.status, JSON.stringify(extra)).toBe('failed')
      expect(state.message).toMatch(/draft or a pre-release/)
      expect(calls.resolved).toEqual([])
      expect(calls.npm).toEqual([])
    }
  })

  it('when the tag is not a version, and says what form it needs', async () => {
    for (const tag of ['1.1.0', 'v1.1', 'v1.1.0-rc.1', 'latest']) {
      const { deps, calls } = fakeDeps({ latest: async () => published(tag) })
      const state = await update(deps)
      expect(state.status, tag).toBe('failed')
      expect(state.message).toContain('vMAJOR.MINOR.PATCH')
      expect(calls.resolved).toEqual([])
      expect(calls.npm).toEqual([])
    }
  })

  it('when the latest release is the one installed', async () => {
    live('v1.1.0')
    const { deps, calls } = fakeDeps()
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' }, message: 'Already on v1.1.0, the latest release.' })
    expect(calls.resolved).toEqual([])
    expect(calls.npm).toEqual([])
  })

  it('when the release marked latest is older than the installed one', async () => {
    live('v1.2.0')
    const { deps, calls } = fakeDeps({ latest: async () => published('v1.1.0') })
    const state = await update(deps)
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.2.0' } })
    expect(state.message).toBe('The latest release, v1.1.0, is older than v1.2.0, so nothing was installed.')
    expect(calls.npm).toEqual([])
  })
})

/** An update from live release v1.0.0 to v1.1.0, with some of its steps failing. */
async function failing(overrides: Partial<Deps>) {
  live('v1.0.0')
  const { deps, calls } = fakeDeps(overrides)
  const state = await update(deps)
  return { state, calls }
}

describe('an update that fails', () => {

  it('leaves the site alone when GitHub cannot be reached', async () => {
    const { state, calls } = await failing({
      latest: async () => {
        throw new Error('GitHub answered 401')
      },
    })
    expect(state).toMatchObject({ status: 'failed', current: { tag: 'v1.0.0' }, steps: { download: 'failed', build: 'skipped' } })
    expect(state.message).toContain('GitHub answered 401')
    expect(calls.switched).toEqual([])
  })

  it('leaves the site alone and cleans up when the build fails', async () => {
    const { state, calls } = await failing({
      npm: async (args) => {
        if (args[1] === 'build') throw new Error('npm run build failed with exit code 1')
      },
    })
    expect(state).toMatchObject({
      status: 'failed',
      current: { tag: 'v1.0.0' },
      steps: { download: 'done', install: 'done', build: 'failed', prune: 'skipped', check: 'skipped', switch: 'skipped' },
    })
    expect(state.message).toMatch(/build failed/)
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
    expect(existsSync(releaseDir(paths, 'v1.0.0'))).toBe(true)
    expect(calls.trials).toEqual([])
    expect(calls.switched).toEqual([])
  })

  it('leaves the site alone and cleans up when npm prune fails', async () => {
    const { state, calls } = await failing({
      npm: async (args, { cwd }) => {
        if (args[1] === 'build') file(join(cwd, '.next', 'BUILD_ID'), 'new-build')
        if (args[0] === 'prune') throw new Error('npm prune --omit=dev --ignore-scripts --no-audit --no-fund failed (exit code 1).')
      },
    })
    expect(state).toMatchObject({
      status: 'failed',
      current: { tag: 'v1.0.0' },
      steps: { build: 'done', prune: 'failed', check: 'skipped', switch: 'skipped' },
    })
    expect(state.message).toMatch(/npm prune .* failed/)
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
    expect(calls.trials).toEqual([])
    expect(calls.switched).toEqual([])
  })

  it('never stops the live site for a build that does not start', async () => {
    const { state, calls } = await failing({ trial: async () => false })
    expect(state).toMatchObject({ status: 'failed', current: { tag: 'v1.0.0' }, steps: { check: 'failed', switch: 'skipped' } })
    expect(state.message).toBe('The new build did not start on its trial run, so the site stays on v1.0.0.')
    expect(calls.switched).toEqual([])
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
  })

  it('goes back to the release it had when the new one fails after the switch', async () => {
    const tried: string[] = []
    const { state } = await failing({
      switchTo: async (dir) => {
        tried.push(dir)
        return dir === releaseDir(paths, 'v1.0.0')
      },
    })
    expect(tried).toEqual([releaseDir(paths, 'v1.1.0'), releaseDir(paths, 'v1.0.0')])
    expect(state).toMatchObject({ status: 'rolled-back', current: { tag: 'v1.0.0' }, steps: { switch: 'failed' } })
    expect(state.message).toBe('The new build stopped answering after the switch, so the site went back to v1.0.0.')
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
  })

  it('goes back to the uploaded folder when the very first update fails after the switch', async () => {
    const tried: string[] = []
    const { deps } = fakeDeps({
      switchTo: async (dir) => {
        tried.push(dir)
        return dir === root
      },
    })
    const state = await update(deps)
    expect(tried).toEqual([releaseDir(paths, 'v1.1.0'), root])
    expect(state.status).toBe('rolled-back')
    expect(liveDir(paths, state)).toBe(root)
  })

  it('refuses to start a second update while one runs', async () => {
    writeState(paths, { ...emptyState(), status: 'building' })
    const { deps, calls } = fakeDeps()
    const state = await update(deps)
    expect(state.status).toBe('building')
    expect(calls.npm).toEqual([])
  })
})

describe('starting up', () => {
  it('marks an update cut short by a restart as failed, and removes its half-built release later', async () => {
    writeState(paths, {
      ...emptyState(),
      status: 'building',
      current: installed('v1.0.0'),
      target: { tag: 'v1.1.0', sha: sha('b'), name: 'New', publishedAt: '2026-10-31T12:00:00Z' },
      steps: { download: 'done', install: 'done', build: 'running', check: 'pending', switch: 'pending' },
    })
    mkdirSync(releaseDir(paths, 'v1.0.0'), { recursive: true })
    mkdirSync(releaseDir(paths, 'v1.1.0'), { recursive: true })
    writeFileSync(join(paths.dir, 'state.json.1056.tmp'), '{')
    const state = recoverState(paths)
    expect(readdirSync(paths.dir).filter((name) => name.endsWith('.tmp'))).toEqual([])
    expect(state).toMatchObject({ status: 'failed', steps: { build: 'failed', check: 'skipped' }, current: { tag: 'v1.0.0' } })
    expect(state.message).toMatch(/restarted/)
    // Left for after the site has started, since deleting it can take a while.
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(true)
    await pruneReleases(paths, state)
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
    expect(existsSync(releaseDir(paths, 'v1.0.0'))).toBe(true)
  })

  it('serves the uploaded folder until there is a release, or when the release is gone', () => {
    expect(liveDir(paths, emptyState())).toBe(root)
    const state = { ...emptyState(), current: installed('v1.0.0') }
    expect(liveDir(paths, state)).toBe(root)
    file(join(releaseDir(paths, 'v1.0.0'), '.next', 'BUILD_ID'))
    expect(liveDir(paths, state)).toBe(releaseDir(paths, 'v1.0.0'))
  })

  it('never throws when the state file cannot be written, so the site keeps running', () => {
    // Windows refused a rename over state.json while /admin was reading it,
    // and the throw took the supervisor and the site down with it.
    mkdirSync(paths.state, { recursive: true })
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(writeState(paths, emptyState())).toBe(false)
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Could not write'))
    error.mockRestore()
  })

  it('leaves state.json as it was when the new state cannot even be written', () => {
    // A full disk: the temporary file fails, and writing in place would
    // have truncated the good state.json.
    writeFileSync(paths.state, JSON.stringify({ ...emptyState(), current: installed('v1.0.0') }))
    mkdirSync(`${paths.state}.${process.pid}.tmp`)
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(writeState(paths, emptyState())).toBe(false)
    expect(readState(paths).current?.tag).toBe('v1.0.0')
    error.mockRestore()
  })

  it('keeps every release when state.json is damaged, since it no longer says which one is live', async () => {
    live('v1.0.0')
    file(join(releaseDir(paths, 'v1.1.0'), '.next', 'BUILD_ID'))
    writeFileSync(paths.state, '')
    expect(stateIsDamaged(paths)).toBe(true)
    const lines: string[] = []
    await cleanUpAtStart(paths, recoverState(paths), (line: string) => lines.push(line))
    expect(readdirSync(paths.releases).toSorted()).toEqual(['v1.0.0', 'v1.1.0'])
    expect(lines.join('\n')).toMatch(/damaged/)
    // A readable one is cleaned up as usual.
    live('v1.1.0')
    expect(stateIsDamaged(paths)).toBe(false)
    await cleanUpAtStart(paths, readState(paths), () => {})
    expect(readdirSync(paths.releases)).toEqual(['v1.1.0'])
  })

  it('removes an npm cache left by an update the server was stopped in', async () => {
    mkdirSync(join(paths.dir, 'npm-cache', '_cacache'), { recursive: true })
    await cleanUpAtStart(paths, readState(paths), () => {})
    expect(existsSync(join(paths.dir, 'npm-cache'))).toBe(false)
  })

  it('reads a missing or broken state file as a fresh one', () => {
    expect(readState(paths)).toEqual(emptyState())
    writeFileSync(paths.state, '{not json')
    expect(readState(paths)).toEqual(emptyState())
  })
})

function copy(base: string, files: Record<string, string>) {
  for (const [name, text] of Object.entries(files)) file(join(base, name), text)
}

describe('noticing that the updater itself changed', () => {
  const updater = {
    'scripts/serve.mjs': 'serve\n',
    'scripts/updater/lib.mjs': 'lib\n',
    'scripts/updater/release.mjs': 'release\n',
  }

  it('compares serve.mjs and every file in scripts/updater/, line endings aside', () => {
    const release = releaseDir(paths, 'v1.1.0')
    copy(root, updater)
    copy(release, Object.fromEntries(Object.entries(updater).map(([name, text]) => [name, text.replaceAll('\n', '\r\n')])))
    expect(supervisorChanged(root, release)).toBe(false)
    expect(supervisorChanged(root, root)).toBe(false)

    // Only the version rule changed: the dashboard and the supervisor would disagree.
    copy(release, { 'scripts/updater/release.mjs': 'release, changed\n' })
    expect(supervisorChanged(root, release)).toBe(true)
  })

  it('notices a file added to scripts/updater/ in the release', () => {
    const release = releaseDir(paths, 'v1.1.0')
    copy(root, updater)
    copy(release, { ...updater, 'scripts/updater/new.mjs': 'new\n' })
    expect(supervisorChanged(root, release)).toBe(true)
  })
})

/** A print function, and what it was given. */
function printer() {
  const printed: string[] = []
  return { printed, print: (line: string) => printed.push(line) }
}

describe('the version in the uploaded folder', () => {
  const uploaded = '{\r\n  "name": "site",\r\n  "version": "0.3.0",\r\n  "scripts": { "start": "next start -p 25586" }\r\n}\r\n'

  it('follows the live release, and nothing else in the file changes', () => {
    const release = releaseDir(paths, 'v1.3.0')
    copy(root, { 'package.json': uploaded })
    copy(release, { 'package.json': '{ "name": "site", "version": "1.3.0" }' })
    const { printed, print } = printer()
    syncUploadedVersion(root, release, print)
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(uploaded.replace('0.3.0', '1.3.0'))
    expect(printed).toEqual(["The uploaded folder's package.json now says version 1.3.0."])
    expect(readdirSync(root).filter((name) => name.endsWith('.tmp'))).toEqual([])
  })

  it('takes the version from the top of the file, not from something nested that comes first', () => {
    const release = releaseDir(paths, 'v1.3.0')
    const nestedFirst = '{\n  "engines": { "version": "9.9.9" },\n  "version": "0.3.0"\n}\n'
    copy(root, { 'package.json': nestedFirst })
    copy(release, { 'package.json': '{ "version": "1.3.0" }' })
    syncUploadedVersion(root, release, () => {})
    expect(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))).toEqual({ engines: { version: '9.9.9' }, version: '1.3.0' })
  })

  it('leaves the file alone when it already matches, or when the uploaded folder is what serves', () => {
    const release = releaseDir(paths, 'v1.3.0')
    copy(root, { 'package.json': uploaded })
    copy(release, { 'package.json': '{ "version": "0.3.0" }' })
    const { printed, print } = printer()
    syncUploadedVersion(root, release, print)
    syncUploadedVersion(root, root, print)
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(uploaded)
    expect(printed).toEqual([])
  })

  it('never stops the supervisor: a file that is missing or broken is logged and left', () => {
    const release = releaseDir(paths, 'v1.3.0')
    const { printed, print } = printer()
    syncUploadedVersion(root, release, print)
    expect(printed).toEqual([expect.stringMatching(/^Could not update the version in the uploaded folder's package\.json: /)])

    copy(root, { 'package.json': 'not json' })
    copy(release, { 'package.json': '{ "version": "1.3.0" }' })
    syncUploadedVersion(root, release, print)
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe('not json')
    expect(printed).toHaveLength(2)
  })

  it('refuses a version that is not a plain version number', () => {
    const release = releaseDir(paths, 'v1.3.0')
    copy(root, { 'package.json': uploaded })
    copy(release, { 'package.json': '{ "version": "1.3.0\\", \\"evil\\": \\"x" }' })
    const { printed, print } = printer()
    syncUploadedVersion(root, release, print)
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(uploaded)
    expect(printed).toHaveLength(1)
  })
})

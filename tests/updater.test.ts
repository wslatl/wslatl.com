import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  emptyState,
  liveDir,
  pruneReleases,
  readState,
  recoverState,
  releaseDir,
  runUpdate,
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
    expect(calls.npm.map((call) => call.args.join(' '))).toEqual(['ci --include=dev --ignore-scripts --no-audit --no-fund', 'run build'])
    expect(calls.npm.every((call) => call.cwd === release)).toBe(true)
    expect(calls.trials).toEqual([release])
    expect(calls.switched).toEqual([release])
    expect(state).toMatchObject({
      status: 'idle',
      current: { tag: 'v1.1.0', sha: sha('b'), name: 'Release v1.1.0', publishedAt: '2026-10-31T12:00:00Z', deployedAt: expect.any(String) },
      previous: null,
      steps: { download: 'done', install: 'done', build: 'done', check: 'done', switch: 'done' },
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
      steps: { download: 'done', install: 'done', build: 'failed', check: 'skipped', switch: 'skipped' },
    })
    expect(state.message).toMatch(/build failed/)
    expect(existsSync(releaseDir(paths, 'v1.1.0'))).toBe(false)
    expect(existsSync(releaseDir(paths, 'v1.0.0'))).toBe(true)
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

  it('reads a missing or broken state file as a fresh one', () => {
    expect(readState(paths)).toEqual(emptyState())
    writeFileSync(paths.state, '{not json')
    expect(readState(paths)).toEqual(emptyState())
  })
})

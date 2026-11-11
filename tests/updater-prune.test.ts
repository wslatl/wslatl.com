import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { devOnlyPaths, plainPath, removeDevFiles } from '../scripts/updater/dev-files.mjs'
import { cleanUpAtStart, emptyState, readState, releaseDir, runUpdate, updaterPaths, writeState } from '../scripts/updater/lib.mjs'

// Deletes that fail: rm throws for each path in here, as it can on Windows
// while another program holds a file open.
const refused = vi.hoisted(() => new Set<string>())
vi.mock('node:fs/promises', async (importOriginal) => {
  const real = await importOriginal<typeof import('node:fs/promises')>()
  return {
    ...real,
    rm: async (...args: Parameters<typeof real.rm>) => {
      if (refused.has(String(args[0]))) throw Object.assign(new Error(`EBUSY: resource busy or locked, rm '${args[0]}'`), { code: 'EBUSY' })
      return real.rm(...args)
    },
  }
})

// Windows makes a link to a file only in Developer Mode or for an
// administrator. A link to a folder can always be made, as a junction.
const fileLinks = (() => {
  const probe = mkdtempSync(join(tmpdir(), 'updater-prune-link-'))
  try {
    writeFileSync(join(probe, 'file'), '')
    symlinkSync(join(probe, 'file'), join(probe, 'link'), 'file')
    return true
  } catch {
    return false
  } finally {
    rmSync(probe, { recursive: true, force: true })
  }
})()

let base = ''
let dir = ''

function file(path: string, text = path) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, text)
}

beforeEach(() => {
  // The folder cleaned is site/; everything else in base is outside it.
  base = mkdtempSync(join(tmpdir(), 'updater-prune-'))
  dir = join(base, 'site')
  mkdirSync(dir)
  refused.clear()
})

afterEach(() => rmSync(base, { recursive: true, force: true }))

// One file for each listed path: in it for a folder, the path itself otherwise.
const folders = ['tests', '.github', '.vscode', 'coverage', 'lighthouse-reports', '.next/cache']
const devFiles = devOnlyPaths.map((path) => (folders.includes(path) ? `${path}/entry` : path))

// What the running site and the updater read in a release.
const read = [
  '.next/BUILD_ID',
  '.next/server/app/index.html',
  '.next/static/chunks/main.js',
  'public/og-image.png',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'config/links.json',
  'config/security-headers.mjs',
  'node_modules/next/package.json',
  'scripts/serve.mjs',
  'scripts/updater/lib.mjs',
  'scripts/updater/github.mjs',
]

const gone = (path: string) => {
  try {
    lstatSync(path)
    return false
  } catch {
    return true
  }
}

/** A path beside the folder cleaned, never in it. */
const outside = (...names: string[]) => join(base, 'outside', ...names)

const busy = (path: string) => `EBUSY: resource busy or locked, rm '${path}'`

describe('the list of what production never uses', () => {
  it('names fixed paths inside the folder: no pattern, nothing absolute, no way out', () => {
    for (const path of devOnlyPaths) expect(plainPath(path), path).toBe(true)
    for (const path of ['../tests', '/tests', 'C:/tests', 'tests/../..', 'vitest.config.*', 'tests/**', '', '.', '..', 'tests//x', 'tests\\x', ' tests']) {
      expect(plainPath(path), path).toBe(false)
    }
  })

  it('holds nothing the running site or the updater reads, nor a folder around one', () => {
    for (const path of devOnlyPaths) expect(read.filter((kept) => kept === path || kept.startsWith(`${path}/`)), path).toEqual([])
  })
})

describe('deleting it from a folder', () => {
  it('deletes each listed path, and keeps everything else', async () => {
    for (const path of [...devFiles, ...read, 'app/page.tsx']) file(join(dir, path))
    const lines: string[] = []
    expect(await removeDevFiles(dir, (line) => lines.push(line))).toEqual([...devOnlyPaths])
    for (const path of devOnlyPaths) expect(gone(join(dir, path)), path).toBe(true)
    for (const path of [...read, 'app/page.tsx']) expect(readFileSync(join(dir, path), 'utf8'), path).toBe(join(dir, path))
    expect(lines).toEqual([])
  })

  it('deletes only what is there, and says nothing when nothing is', async () => {
    file(join(dir, 'package.json'))
    file(join(dir, 'tests', 'site.test.ts'))
    const lines: string[] = []
    expect(await removeDevFiles(dir, (line) => lines.push(line))).toEqual(['tests'])
    expect(await removeDevFiles(dir, (line) => lines.push(line))).toEqual([])
    expect(lines).toEqual([])
  })

  it('leaves the paths in keep, and all they hold', async () => {
    for (const path of devFiles) file(join(dir, path))
    expect(await removeDevFiles(dir, () => {}, ['.next', 'tests'])).toEqual(devOnlyPaths.filter((path) => path !== 'tests' && path !== '.next/cache'))
    expect(existsSync(join(dir, 'tests', 'entry'))).toBe(true)
    expect(existsSync(join(dir, '.next', 'cache', 'entry'))).toBe(true)
  })
})

describe('outside the folder', () => {
  it('touches nothing beside it that has a listed name', async () => {
    for (const path of devFiles) {
      file(join(dir, path))
      file(join(base, path))
    }
    await removeDevFiles(dir, () => {})
    for (const path of devFiles) expect(existsSync(join(base, path)), path).toBe(true)
  })

  it('deletes a link in a listed folder\'s place, never what it points at', async () => {
    file(outside('tests', 'keep.ts'))
    symlinkSync(outside('tests'), join(dir, 'tests'), 'junction')
    expect(await removeDevFiles(dir, () => {})).toEqual(['tests'])
    expect(gone(join(dir, 'tests'))).toBe(true)
    expect(readFileSync(outside('tests', 'keep.ts'), 'utf8')).toBe(outside('tests', 'keep.ts'))
  })

  it.skipIf(!fileLinks)('deletes a link in a listed file\'s place, never the file', async () => {
    file(outside('lychee.toml'))
    symlinkSync(outside('lychee.toml'), join(dir, 'lychee.toml'), 'file')
    expect(await removeDevFiles(dir, () => {})).toEqual(['lychee.toml'])
    expect(gone(join(dir, 'lychee.toml'))).toBe(true)
    expect(readFileSync(outside('lychee.toml'), 'utf8')).toBe(outside('lychee.toml'))
  })

  it('leaves a listed path alone when a folder on its way is a link', async () => {
    // .next is a link out of the folder, so .next/cache is the outside folder's.
    file(outside('.next', 'cache', 'keep'))
    symlinkSync(outside('.next'), join(dir, '.next'), 'junction')
    const lines: string[] = []
    expect(await removeDevFiles(dir, (line) => lines.push(line))).toEqual([])
    expect(existsSync(outside('.next', 'cache', 'keep'))).toBe(true)
    expect(lines).toEqual(['Left .next/cache alone: .next is a link, and links are never followed.'])
  })

  it('deletes a link inside a listed folder as a link', async () => {
    file(join(dir, 'tests', 'site.test.ts'))
    file(outside('keep'))
    symlinkSync(outside(), join(dir, 'tests', 'fixtures'), 'junction')
    await removeDevFiles(dir, () => {})
    expect(gone(join(dir, 'tests'))).toBe(true)
    expect(existsSync(outside('keep'))).toBe(true)
  })
})

describe('a delete that fails', () => {
  it('is logged, and everything else still goes', async () => {
    for (const path of devFiles) file(join(dir, path))
    refused.add(join(dir, 'tests'))
    const lines: string[] = []
    const removed = await removeDevFiles(dir, (line) => lines.push(line))
    expect(lines).toEqual([`Could not delete tests: ${busy(join(dir, 'tests'))}`])
    expect(removed).toEqual(devOnlyPaths.filter((path) => path !== 'tests'))
    expect(existsSync(join(dir, 'tests', 'entry'))).toBe(true)
  })

  it('carries on when even the log cannot be written', async () => {
    file(join(dir, 'tests', 'entry'))
    file(join(dir, 'lychee.toml'))
    refused.add(join(dir, 'tests'))
    const removed = await removeDevFiles(dir, () => {
      throw new Error('stdout closed')
    })
    expect(removed).toEqual(['lychee.toml'])
  })

  it('never stops an update', async () => {
    const paths = updaterPaths(dir)
    file(join(dir, 'package.json'))
    const release = releaseDir(paths, 'v1.1.0')
    refused.add(join(release, 'tests'))
    const trials: string[] = []
    const state = await runUpdate({
      paths,
      deps: {
        latest: async () => ({ tag: 'v1.1.0', name: 'v1.1.0', publishedAt: '2026-11-07T12:00:00Z', draft: false, prerelease: false }),
        resolve: async () => 'b'.repeat(40),
        download: async (_sha, dest) => {
          for (const path of ['package.json', ...devFiles]) file(join(dest, path))
        },
        npm: async (args, { cwd }) => {
          if (args[1] === 'build') file(join(cwd, '.next', 'BUILD_ID'))
        },
        trial: async (folder) => (trials.push(folder), true),
        switchTo: async () => true,
        print: () => {},
      },
      baseEnv: {},
      secretNames: [],
    })
    expect(state).toMatchObject({ status: 'idle', current: { tag: 'v1.1.0' }, steps: { prune: 'done', check: 'done', switch: 'done' } })
    expect(state.log).toContain(`Could not delete tests: ${busy(join(release, 'tests'))}`)
    expect(trials).toEqual([release])
    expect(existsSync(join(release, '.github'))).toBe(false)
  })

  it('never stops the start-up', async () => {
    const paths = updaterPaths(dir)
    file(join(dir, 'tests', 'site.test.ts'))
    file(join(dir, 'eslint.config.mjs'))
    // A release no state names, which the start-up still removes.
    file(join(releaseDir(paths, 'v0.9.0'), '.next', 'BUILD_ID'))
    refused.add(join(dir, 'tests'))
    const lines: string[] = []
    await cleanUpAtStart(paths, readState(paths), (line) => lines.push(line))
    expect(lines).toEqual([
      `Could not delete tests: ${busy(join(dir, 'tests'))}`,
      'Deleted from the uploaded folder what production never uses: eslint.config.mjs',
    ])
    expect(existsSync(releaseDir(paths, 'v0.9.0'))).toBe(false)
  })
})

describe('starting up', () => {
  it('cleans the uploaded folder, never its packages, build, settings, asset history, scripts or releases', async () => {
    const paths = updaterPaths(dir)
    const untouched = [
      'node_modules/vitest/package.json',
      'node_modules/eslint/package.json',
      '.next/BUILD_ID',
      '.next/cache/turbopack/entry',
      '.env',
      '.next-static-history/chunks/old.js',
      'scripts/serve.mjs',
      'scripts/updater/lib.mjs',
      '.updater/releases/v1.0.0/.next/BUILD_ID',
      '.updater/releases/v1.0.0/tests/site.test.ts',
      'app/page.tsx',
      'package.json',
    ]
    for (const path of [...devFiles, ...untouched]) file(join(dir, path))
    writeState(paths, { ...emptyState(), current: { tag: 'v1.0.0', sha: 'a'.repeat(40), name: 'v1.0.0', publishedAt: '', deployedAt: '' } })
    const lines: string[] = []
    await cleanUpAtStart(paths, readState(paths), (line) => lines.push(line))
    const deleted = devOnlyPaths.filter((path) => path !== '.next/cache')
    for (const path of deleted) expect(gone(join(dir, path)), path).toBe(true)
    for (const path of untouched) expect(readFileSync(join(dir, path), 'utf8'), path).toBe(join(dir, path))
    expect(lines).toEqual([`Deleted from the uploaded folder what production never uses: ${deleted.join(', ')}`])
  })

  it('leaves a git checkout alone, with .git as a folder or as a worktree file', async () => {
    for (const git of ['.git/HEAD', '.git']) {
      rmSync(dir, { recursive: true, force: true })
      for (const path of [...devFiles, git]) file(join(dir, path))
      const paths = updaterPaths(dir)
      const lines: string[] = []
      await cleanUpAtStart(paths, readState(paths), (line) => lines.push(line))
      for (const path of devFiles) expect(existsSync(join(dir, path)), `${git}: ${path}`).toBe(true)
      expect(lines).toEqual(['The uploaded folder is a git checkout, so its tests and dev configs were left alone. Releases are still pruned.'])
    }
  })
})

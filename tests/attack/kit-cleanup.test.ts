import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { devOnlyPaths, removeDevFiles } from '../../scripts/updater/dev-files.mjs'
import { cleanUpAtStart, emptyState, pruneReleases, readState, releaseDir, updaterPaths, writeState } from '../../scripts/updater/lib.mjs'

/**
 * Canaries for the kit's clean-up (scripts/updater/dev-files.mjs and the
 * release pruning in scripts/updater/lib.mjs), which deletes folders on the
 * live server at every start and every update. Whatever links a release or
 * the uploaded folder holds, it deletes a link as a link, never follows one,
 * and never deletes anything outside the folder it cleans. Links to folders
 * are junctions, which Windows makes without special rights.
 */
// Deleting many small files is slow on a busy disk.
vi.setConfig({ testTimeout: 30_000 })

// Windows makes a link to a file only in Developer Mode or for an administrator.
const fileLinks = (() => {
  const probe = mkdtempSync(join(tmpdir(), 'kit-cleanup-probe-'))
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
/** The folder cleaned. Everything else in base is outside it. */
let dir = ''

function file(path: string, text = path) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, text)
}

const outside = (...names: string[]) => join(base, 'outside', ...names)
const link = (target: string, path: string) => {
  mkdirSync(join(path, '..'), { recursive: true })
  symlinkSync(target, path, 'junction')
}
const gone = (path: string) => {
  try {
    lstatSync(path)
    return false
  } catch {
    return true
  }
}

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'kit-cleanup-'))
  dir = join(base, 'site')
  mkdirSync(dir)
})

afterEach(() => rmSync(base, { recursive: true, force: true, maxRetries: 3 }))

describe('deleting what production never uses', () => {
  it('deletes a link that stands where a listed folder would, never what it points at', async () => {
    file(outside('tests', 'keep.ts'), 'outside')
    link(outside('tests'), join(dir, 'tests'))
    expect(await removeDevFiles(dir, () => {})).toEqual(['tests'])
    expect(gone(join(dir, 'tests'))).toBe(true)
    expect(readFileSync(outside('tests', 'keep.ts'), 'utf8')).toBe('outside')
  })

  it('leaves a listed path alone when a folder on its way is a link', async () => {
    // .next is a link out of the folder, so .next/cache is the other folder's.
    file(outside('.next', 'cache', 'keep'), 'outside')
    link(outside('.next'), join(dir, '.next'))
    const lines: string[] = []
    expect(await removeDevFiles(dir, (line) => lines.push(line))).toEqual([])
    expect(readFileSync(outside('.next', 'cache', 'keep'), 'utf8')).toBe('outside')
    expect(lines).toEqual(['Left .next/cache alone: .next is a link, and links are never followed.'])
  })

  it('deletes a link inside a listed folder as a link, never what it points at', async () => {
    file(join(dir, 'tests', 'site.test.ts'))
    file(outside('keep'), 'outside')
    link(outside(), join(dir, 'tests', 'fixtures'))
    expect(await removeDevFiles(dir, () => {})).toEqual(['tests'])
    expect(gone(join(dir, 'tests'))).toBe(true)
    expect(readFileSync(outside('keep'), 'utf8')).toBe('outside')
  })

  it.skipIf(!fileLinks)('deletes a link that stands where a listed file would, never the file', async () => {
    file(outside('lychee.toml'), 'outside')
    symlinkSync(outside('lychee.toml'), join(dir, 'lychee.toml'), 'file')
    expect(await removeDevFiles(dir, () => {})).toEqual(['lychee.toml'])
    expect(gone(join(dir, 'lychee.toml'))).toBe(true)
    expect(readFileSync(outside('lychee.toml'), 'utf8')).toBe('outside')
  })

  it('touches nothing beside the folder, even with a listed name', async () => {
    for (const path of devOnlyPaths) {
      file(join(dir, path, 'entry'))
      file(join(base, path, 'entry'), 'beside')
    }
    await removeDevFiles(dir, () => {})
    for (const path of devOnlyPaths) {
      expect(gone(join(dir, path)), path).toBe(true)
      expect(readFileSync(join(base, path, 'entry'), 'utf8'), path).toBe('beside')
    }
  })

  it("never deletes what the uploaded folder keeps: its packages, build, settings, asset history, scripts and releases", async () => {
    const paths = updaterPaths(dir)
    const kept = [
      'node_modules/next/package.json',
      '.next/BUILD_ID',
      '.next/cache/turbopack/entry',
      '.env',
      '.next-static-history/chunks/old.js',
      'scripts/serve.mjs',
      'scripts/updater/lib.mjs',
      '.updater/releases/v1.0.0/.next/BUILD_ID',
      '.updater/releases/v1.0.0/tests/site.test.ts',
      'package.json',
    ]
    for (const path of kept) file(join(dir, path))
    for (const path of devOnlyPaths.filter((each) => !each.startsWith('.next/'))) file(join(dir, path, 'entry'))
    writeState(paths, { ...emptyState(), current: { tag: 'v1.0.0', sha: 'a'.repeat(40), name: 'v1.0.0', publishedAt: '', deployedAt: '' } })
    await cleanUpAtStart(paths, readState(paths), () => {})
    for (const path of kept) expect(readFileSync(join(dir, path), 'utf8'), path).toBe(join(dir, path))
    for (const path of devOnlyPaths.filter((each) => !each.startsWith('.next/'))) expect(gone(join(dir, path)), path).toBe(true)
  })
})

describe('removing old releases', () => {
  it('removes a release as a folder, never what a link in it points at, and keeps the live, previous and served ones', async () => {
    const paths = updaterPaths(dir)
    const release = (tag: string) => releaseDir(paths, tag)
    file(outside('shared', 'package.json'), 'a package linked into a release, as npm links a workspace')
    file(outside('elsewhere', 'keep'), 'a folder a release name links to')
    // An old release whose node_modules holds a link out of it.
    file(join(release('v0.8.0'), '.next', 'BUILD_ID'))
    link(outside('shared'), join(release('v0.8.0'), 'node_modules', 'shared'))
    // A link in the releases folder itself, named like a release.
    link(outside('elsewhere'), release('v0.9.0'))
    for (const tag of ['v1.0.0', 'v1.1.0', 'v1.2.0']) file(join(release(tag), '.next', 'BUILD_ID'), tag)
    file(join(paths.dir, 'ended-sessions.json'), '{}')
    const state = { ...emptyState(), current: { tag: 'v1.1.0', sha: 'b'.repeat(40), name: 'v1.1.0', publishedAt: '', deployedAt: '' }, previous: { tag: 'v1.0.0', sha: 'a'.repeat(40), name: 'v1.0.0', publishedAt: '', deployedAt: '' } }
    writeState(paths, state)

    await pruneReleases(paths, readState(paths), [release('v1.2.0')])

    expect(readdirSync(paths.releases).toSorted()).toEqual(['v1.0.0', 'v1.1.0', 'v1.2.0'])
    expect(readFileSync(outside('shared', 'package.json'), 'utf8')).toBe('a package linked into a release, as npm links a workspace')
    expect(readFileSync(outside('elsewhere', 'keep'), 'utf8')).toBe('a folder a release name links to')
    expect(existsSync(join(paths.dir, 'ended-sessions.json'))).toBe(true)
    for (const tag of ['v1.0.0', 'v1.1.0', 'v1.2.0']) expect(readFileSync(join(release(tag), '.next', 'BUILD_ID'), 'utf8')).toBe(tag)
  })
})

#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { checkApp } from './check.mjs'
import {
  contentHash,
  destinationFor,
  MANIFEST,
  manifestJson,
  onDisk,
  readIfPresent,
  readManifest,
  VERSION_FILE,
} from './manifest.mjs'

/** A kit version is always a release tag. */
export const versionPattern = /^v\d+\.\d+\.\d+$/

/**
 * One version of the kit, read straight from its tag in the kit's git
 * clone, so whatever is checked out there does not matter. Only the files
 * the kit ships come back, keyed by where they land in an app.
 * @param {string} kitRoot
 * @param {string} version
 * @returns {{ commit: string, files: Map<string, Buffer> }}
 */
export function readKitVersion(kitRoot, version) {
  /** @type {import('node:child_process').StdioOptions} */
  const stdio = ['ignore', 'pipe', 'pipe']
  const maxBuffer = 256 * 1024 * 1024
  /** @param {string[]} args */
  const text = (args) => execFileSync('git', ['-C', kitRoot, ...args], { maxBuffer, stdio, encoding: 'utf8' })
  /** @param {string[]} args */
  const bytes = (args) => execFileSync('git', ['-C', kitRoot, ...args], { maxBuffer, stdio, encoding: 'buffer' })

  let commit
  try {
    commit = text(['rev-parse', '--verify', '--quiet', `refs/tags/${version}^{commit}`]).trim()
  } catch {
    throw new Error(`The kit at ${kitRoot} has no tag ${version}. Run "git fetch --tags" there, or check the version.`)
  }
  /** @type {Map<string, Buffer>} */
  const files = new Map()
  for (const name of text(['ls-tree', '-r', '-z', '--name-only', commit]).split('\0')) {
    const destination = name ? destinationFor(name) : null
    if (destination) files.set(destination, bytes(['show', `${commit}:${name}`]))
  }
  return { commit, files }
}

/**
 * Removes folders left empty under the kit's places after files went away.
 * @param {string} appRoot
 * @param {string[]} removed app paths
 */
async function pruneEmptyFolders(appRoot, removed) {
  const folders = new Set(removed.map((path) => path.split('/').slice(0, -1).join('/')).filter(Boolean))
  const deepestFirst = [...folders].toSorted((a, b) => b.split('/').length - a.split('/').length)
  for (const folder of deepestFirst) {
    const path = onDisk(appRoot, folder)
    const entries = await readdir(path).catch(() => null)
    if (entries && entries.length === 0) await rm(path, { recursive: true, force: true })
  }
}

/**
 * Puts one kit version into an app. Writes every file where it belongs,
 * removes the ones the previous version had and this one does not, and
 * records the hash of each so `platform:check` can tell when a copy was
 * edited. Refuses to overwrite a kit file the app has changed, unless
 * forced, so nobody's change disappears quietly.
 * @param {{ appRoot: string, version: string, commit: string, files: Map<string, Buffer>, force?: boolean }} options
 * @returns {Promise<{ written: string[], removed: string[], replaced: string[] }>}
 */
export async function placeKit({ appRoot, version, commit, files, force = false }) {
  if (!versionPattern.test(version)) {
    throw new Error(`"${version}" is not a kit version. Use its tag, for example v0.1.0.`)
  }
  const previous = await readManifest(appRoot)
  const previousFiles = previous?.files ?? {}

  /** @type {string[]} */
  const edited = []
  for (const [path, hash] of Object.entries(previousFiles)) {
    const current = await readIfPresent(onDisk(appRoot, path))
    if (current !== null && contentHash(current) !== hash) edited.push(path)
  }
  if (edited.length > 0 && !force) {
    throw new Error(
      `These kit files were edited in the app and would be overwritten:\n  ${edited.join('\n  ')}\n` +
        'Move the change into the kit, or run the sync again with --force to drop it.',
    )
  }

  /** @type {string[]} */
  const replaced = []
  if (!previous) {
    for (const path of files.keys()) {
      if ((await readIfPresent(onDisk(appRoot, path))) !== null) replaced.push(path)
    }
  }

  /** @type {Record<string, string>} */
  const hashes = {}
  for (const [path, bytes] of files) {
    const target = onDisk(appRoot, path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, bytes)
    hashes[path] = contentHash(bytes)
  }

  const removed = Object.keys(previousFiles).filter((path) => !files.has(path))
  for (const path of removed) await rm(onDisk(appRoot, path), { force: true })
  await pruneEmptyFolders(appRoot, removed)

  await writeFile(onDisk(appRoot, VERSION_FILE), `${version}\n`)
  await writeFile(onDisk(appRoot, MANIFEST), manifestJson(version, commit, hashes))
  return { written: [...files.keys()], removed, replaced }
}

/**
 * Files in the kit's folders that the kit does not own, such as an app's
 * own old updater scripts. Reported, never deleted.
 * @param {string} appRoot
 * @param {Map<string, Buffer>} files
 * @returns {Promise<string[]>}
 */
export async function strayFiles(appRoot, files) {
  /** @type {string[]} */
  const stray = []
  const entries = await readdir(join(appRoot, 'scripts', 'updater'), { recursive: true, withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const relative = join(entry.parentPath, entry.name).slice(join(appRoot).length + 1).split('\\').join('/')
    if (!files.has(relative)) stray.push(relative)
  }
  return stray.toSorted()
}

/** @param {string[]} argv */
async function main(argv) {
  const args = argv.slice(2)
  const version = args.find((arg) => versionPattern.test(arg))
  const kitAt = args.indexOf('--kit')
  const appRoot = process.cwd()
  const kitRoot = resolve(kitAt >= 0 && args[kitAt + 1] ? args[kitAt + 1] : join(appRoot, '..', 'platform'))
  if (!version) {
    console.error('Usage: npm run platform:sync -- v0.1.0 [--kit <path to the kit clone>] [--force]')
    process.exitCode = 2
    return
  }

  const { commit, files } = readKitVersion(kitRoot, version)
  const { written, removed, replaced } = await placeKit({ appRoot, version, commit, files, force: args.includes('--force') })
  console.log(`Kit ${version} is in place: ${written.length} files written, ${removed.length} removed.`)
  if (replaced.length > 0) {
    console.log(`This was the first sync, so it replaced the app's own copies of:\n  ${replaced.join('\n  ')}`)
  }
  const stray = await strayFiles(appRoot, files)
  if (stray.length > 0) {
    console.log(`These sit in the kit's folders but are not part of it. Delete them if nothing else uses them:\n  ${stray.join('\n  ')}`)
  }
  const { problems } = await checkApp(appRoot)
  if (problems.length > 0) {
    console.log(`Still to do before platform:check passes:\n- ${problems.join('\n- ')}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv).catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}

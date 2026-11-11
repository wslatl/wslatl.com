#!/usr/bin/env node
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { contentHash, MANIFEST, onDisk, readIfPresent, readManifest, VERSION_FILE } from './manifest.mjs'
import { versionProblems } from './versions.mjs'

/**
 * Every file under a folder, as app paths with forward slashes.
 * @param {string} folder on disk
 * @param {string} prefix the folder as an app path, such as "platform"
 * @returns {Promise<string[]>}
 */
async function listFiles(folder, prefix) {
  /** @type {string[]} */
  const found = []
  let entries
  try {
    entries = await readdir(folder, { withFileTypes: true })
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT') return found
    throw error
  }
  for (const entry of entries) {
    const path = `${prefix}/${entry.name}`
    if (entry.isDirectory()) found.push(...(await listFiles(join(folder, entry.name), path)))
    else found.push(path)
  }
  return found
}

/**
 * @param {string} path
 * @returns {Promise<any>} the parsed file, or null when it is not there
 */
async function readJson(path) {
  const bytes = await readIfPresent(path)
  return bytes === null ? null : JSON.parse(bytes.toString('utf8'))
}

/**
 * Whether an app's copy of the kit is exactly the version it says it is,
 * and whether its packages meet the kit's floors. Each problem comes back
 * as one plain sentence, so CI can print them as they are.
 * @param {string} appRoot
 * @returns {Promise<{ version: string | null, files: number, problems: string[] }>}
 */
export async function checkApp(appRoot) {
  const manifest = await readManifest(appRoot)
  if (!manifest) {
    return {
      version: null,
      files: 0,
      problems: [`There is no ${MANIFEST}. Run "npm run platform:sync -- <version>" first.`],
    }
  }
  /** @type {string[]} */
  const problems = []
  for (const [path, hash] of Object.entries(manifest.files)) {
    const bytes = await readIfPresent(onDisk(appRoot, path))
    if (bytes === null) problems.push(`${path} is missing.`)
    else if (contentHash(bytes) !== hash) problems.push(`${path} was edited in the app. Change the kit instead, then sync.`)
  }
  for (const path of await listFiles(join(appRoot, 'platform'), 'platform')) {
    if (path === MANIFEST || path === VERSION_FILE || path in manifest.files) continue
    problems.push(`${path} is not part of kit ${manifest.version}. Only the kit's own files belong in platform/.`)
  }
  const recorded = (await readIfPresent(onDisk(appRoot, VERSION_FILE)))?.toString('utf8').trim()
  if (recorded !== manifest.version) {
    problems.push(`${VERSION_FILE} says "${recorded ?? ''}" but the manifest is for ${manifest.version}. Sync again.`)
  }
  const floors = await readJson(join(appRoot, 'platform', 'versions.json'))
  const pkg = await readJson(join(appRoot, 'package.json'))
  if (floors && pkg) {
    const nvmrc = await readIfPresent(join(appRoot, '.nvmrc'))
    problems.push(...versionProblems(floors, pkg, nvmrc === null ? null : nvmrc.toString('utf8')))
  }
  return { version: manifest.version, files: Object.keys(manifest.files).length, problems }
}

async function main() {
  const { version, files, problems } = await checkApp(process.cwd())
  if (problems.length === 0) {
    console.log(`Kit ${version}: all ${files} files match, and the packages meet the kit's versions.`)
    return
  }
  console.error(`Kit ${version ?? '(none)'}: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`)
  for (const problem of problems) console.error(`- ${problem}`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}

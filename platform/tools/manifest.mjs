import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Written by the sync, never shipped by the kit itself. Paths are relative to the app. */
export const MANIFEST = 'platform/MANIFEST.json'
export const VERSION_FILE = 'platform/VERSION'

/**
 * Where each part of the kit repo lands in an app. A `from` ending in a
 * slash is a folder; anything else is one file. The supervisor keeps the
 * paths it has always had, because the copy already installed on each
 * server looks for them there.
 */
const placements = Object.freeze([
  Object.freeze({ from: 'kit/', to: 'platform/' }),
  Object.freeze({ from: 'updater/serve.mjs', to: 'scripts/serve.mjs' }),
  Object.freeze({ from: 'updater/updater/', to: 'scripts/updater/' }),
  Object.freeze({ from: 'versions.json', to: 'platform/versions.json' }),
])

/**
 * Where a file of the kit repo lands in an app, or null when the kit does
 * not ship it (its tests, its own tooling, READMEs outside `kit/`).
 * @param {string} kitPath relative to the kit repo, with forward slashes
 * @returns {string | null}
 */
export function destinationFor(kitPath) {
  for (const { from, to } of placements) {
    const isFolder = from.endsWith('/')
    const hit = isFolder ? kitPath.startsWith(from) && kitPath.length > from.length : kitPath === from
    if (!hit) continue
    const destination = isFolder ? to + kitPath.slice(from.length) : to
    return destination === MANIFEST || destination === VERSION_FILE ? null : destination
  }
  return null
}

/**
 * The bytes with every CRLF turned into LF. A Windows checkout with
 * `core.autocrlf` writes CRLF, CI writes LF, and both must hash the same.
 * @param {Buffer} bytes
 * @returns {Buffer}
 */
export function withLf(bytes) {
  if (!bytes.includes(13)) return bytes
  const out = Buffer.allocUnsafe(bytes.length)
  let length = 0
  for (let index = 0; index < bytes.length; index++) {
    if (bytes[index] === 13 && bytes[index + 1] === 10) continue
    out[length++] = bytes[index]
  }
  return out.subarray(0, length)
}

/**
 * The hash the manifest records. Text is hashed with LF line endings;
 * a file with a NUL byte in its first 8,000 bytes counts as binary (the
 * same test git uses) and is hashed exactly as it is.
 * @param {Buffer} bytes
 * @returns {string}
 */
export function contentHash(bytes) {
  const binary = bytes.subarray(0, 8000).includes(0)
  return createHash('sha256')
    .update(binary ? bytes : withLf(bytes))
    .digest('hex')
}

/**
 * @typedef {object} Manifest
 * @property {string} version the kit's tag, such as "v0.1.0"
 * @property {string} commit the commit that tag points at
 * @property {Record<string, string>} files every file the kit owns in the app, by path, with its hash
 */

/**
 * The app's manifest, or null before the first sync. On disk each file's
 * hash sits under "sha256" (manifestJson); kit v0.1.2 and older wrote the
 * hash as the path's value, and both read the same.
 * @param {string} appRoot
 * @returns {Promise<Manifest | null>}
 */
export async function readManifest(appRoot) {
  let text
  try {
    text = await readFile(join(appRoot, ...MANIFEST.split('/')), 'utf8')
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT') return null
    throw error
  }
  const manifest = JSON.parse(text)
  /** @type {Record<string, string>} */
  const files = {}
  for (const [path, entry] of Object.entries(manifest?.files ?? {})) {
    const hash = typeof entry === 'string' ? entry : entry?.sha256
    if (typeof hash !== 'string') throw new Error(`${MANIFEST} has no hash for ${path}. Sync the kit again to write a new one.`)
    files[path] = hash
  }
  return { ...manifest, files }
}

/**
 * The manifest as written to disk: files sorted by path, so a sync that
 * changes nothing leaves the file exactly as it was. Each hash goes on a
 * line of its own, under "sha256", and never on the line of its path:
 * secret scanners such as gitleaks take a long hex value right after a
 * name with password, auth or token in it for a key, and some of the kit's
 * file names have those words in them.
 * @param {string} version
 * @param {string} commit
 * @param {Record<string, string>} files
 * @returns {string}
 */
export function manifestJson(version, commit, files) {
  const sorted = Object.fromEntries(
    Object.entries(files)
      .toSorted(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([path, sha256]) => [path, { sha256 }]),
  )
  return `${JSON.stringify({ version, commit, files: sorted }, null, 2)}\n`
}

/**
 * A file's bytes, or null when it is not there.
 * @param {string} path
 * @returns {Promise<Buffer | null>}
 */
export async function readIfPresent(path) {
  try {
    return await readFile(path)
  } catch (error) {
    const code = /** @type {NodeJS.ErrnoException} */ (error).code
    if (code === 'ENOENT' || code === 'ENOTDIR') return null
    throw error
  }
}

/**
 * An app path with forward slashes, as a path on this machine.
 * @param {string} appRoot
 * @param {string} path
 * @returns {string}
 */
export const onDisk = (appRoot, path) => join(appRoot, ...path.split('/'))

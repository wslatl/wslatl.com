// The supervisor's side of GitHub (scripts/serve.mjs): which release is the
// latest, which commit its tag points at, and that commit's files. Kept
// apart so the tests can drive it against a stand-in for GitHub.
//
// A download is checked before anything is built from it. The updater
// unpacks it itself (scripts/updater/tarball.mjs), taking only plain files
// and folders inside the release. Then every file in it has to be one that
// GitHub's own record of the commit lists, with the same contents, and
// every file that record lists has to be there. The record (the commit's
// tree, from the API) and the archive (from GitHub's download servers) come
// by different routes, so an archive changed on the way, or served from a
// cache that went wrong, is refused, as is one with a file added (an .npmrc
// pointing npm elsewhere, say) or left out.
//
// The token goes only to the API address in the settings, which must be
// HTTPS (plain HTTP only to this same machine, for the tests). When GitHub
// sends the download on to another address, fetch drops the Authorization
// header there, as the Fetch standard says it must.
import { createHash } from 'node:crypto'
import { closeSync, constants, mkdirSync, openSync, readdirSync, readFileSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { tarLimits, unpackTarball } from './tarball.mjs'

/**
 * owner/name as GitHub allows them: an owner of letters, digits and inner
 * hyphens, at most 39 characters, and a name that is neither . nor .., which
 * would walk the API address up a level. The same rule as repoPattern in
 * platform/config.mjs, which the admin holds GITHUB_REPO to, and a test
 * holds the two together. Kept here as well because the updater cannot
 * reach the kit's folder from scripts/.
 */
export const repoPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/(?!\.{1,2}$)[\w.-]{1,100}$/

/**
 * Why the API address cannot be used, or '' when it can: HTTPS, or plain
 * HTTP to this machine only, so the token never travels in the clear, and
 * nothing after the host but a path.
 * @param {string} value
 */
export function apiAddressProblem(value) {
  /** @type {URL} */
  let url
  try {
    url = new URL(value)
  } catch {
    return 'GITHUB_API_URL is not an https address.'
  }
  const here = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && here)) return 'GITHUB_API_URL is not an https address.'
  if (url.username || url.password || url.search || url.hash) return 'GITHUB_API_URL must be a plain address, with nothing after the host but a path.'
  return ''
}

/**
 * Git's own name for a file's contents (git hash-object): SHA-1 over
 * "blob <size>\0" and the bytes. It is what a commit's tree lists for each file.
 * @param {Buffer} content
 */
export function gitBlobSha(content) {
  return createHash('sha1').update(`blob ${content.length}\0`).update(content).digest('hex')
}

/**
 * Every file and link under dir, as paths relative to it with forward
 * slashes. A link is listed as itself and never followed.
 * @param {string} dir
 * @param {string} [prefix]
 * @returns {string[]}
 */
export function filesIn(dir, prefix = '') {
  return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    return entry.isDirectory() ? filesIn(dir, path) : [path]
  })
}

/**
 * What git stores for a file: its bytes, or for a link, where it points. The
 * file is opened without following a link (O_NOFOLLOW, where the system has
 * it), and read through what was opened, so nothing can swap it between a
 * look and a read.
 * @param {string} path
 * @returns {Buffer}
 */
function contentOf(path) {
  /** @type {number} */
  let fd
  try {
    fd = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0))
  } catch (error) {
    // ELOOP: a link, which git stores as the path it points to.
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ELOOP') return Buffer.from(readlinkSync(path))
    throw error
  }
  try {
    return readFileSync(fd)
  } finally {
    closeSync(fd)
  }
}

/**
 * @typedef {{ path: string, mode: string, type: string, sha: string }} TreeEntry
 */

/**
 * How the files in dir differ from a commit's tree, as GitHub's API lists
 * it: one line per file, none when they match. Only files are compared
 * (folders and submodules are not files to git), by what each holds; the
 * permission bits are not.
 * @param {string} dir
 * @param {TreeEntry[]} entries
 * @returns {string[]}
 */
export function treeDifferences(dir, entries) {
  const blobs = entries.filter((entry) => entry?.type === 'blob' && typeof entry.path === 'string' && typeof entry.sha === 'string')
  const listed = new Map(blobs.map((entry) => [entry.path, entry]))
  /** @type {string[]} */
  const problems = []
  const seen = new Set()
  for (const path of filesIn(dir)) {
    const entry = listed.get(path)
    if (!entry) {
      problems.push(`${path} is not in the commit`)
      continue
    }
    seen.add(path)
    if (gitBlobSha(contentOf(join(dir, ...path.split('/')))) !== entry.sha) problems.push(`${path} differs from the commit`)
  }
  for (const path of listed.keys()) if (!seen.has(path)) problems.push(`${path} is missing`)
  return problems
}

const short = (/** @type {string} */ sha) => sha.slice(0, 7)

/** Text from GitHub for the log: one line, without control characters, and not too long. @param {unknown} value @param {number} most */
// oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
const plain = (value, most) => String(value ?? '').replaceAll(/[\u0000-\u001f\u007f]+/g, ' ').slice(0, most)

/**
 * @param {{ token: string, repo: string, api: string, maxDownloadBytes?: number }} options
 *   api without a slash at the end; maxDownloadBytes for the tests, the
 *   download limit of scripts/updater/tarball.mjs otherwise
 */
export function gitHub({ token, repo, api, maxDownloadBytes = tarLimits.downloadBytes }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'wslatl-updater',
  }
  const limits = Object.freeze({ ...tarLimits, downloadBytes: maxDownloadBytes })

  /** @param {number} status */
  function problem(status) {
    if (status === 401) return 'GitHub refused the token (401). Check GITHUB_TOKEN in .env.'
    if (status === 403 || status === 429) return `GitHub refused the request (${status}): the token may lack Contents read access, or the rate limit was reached.`
    if (status === 404) return `GitHub could not find ${repo} (404). Check GITHUB_REPO and that the token can read it.`
    return `GitHub answered ${status}.`
  }

  /** @param {string} path @param {number} [timeoutMs] */
  function get(path, timeoutMs = 30_000) {
    return fetch(`${api}/repos/${repo}${path}`, { headers, signal: AbortSignal.timeout(timeoutMs) })
  }

  /** GitHub's latest release (never a draft or a pre-release), or null when there is none. */
  async function latest() {
    const response = await get('/releases/latest')
    if (response.status === 404) {
      await response.body?.cancel()
      // No release yet, or no repository at all: only the second is an error.
      const found = await get('')
      await found.body?.cancel()
      if (found.ok) return null
      throw new Error(problem(found.status))
    }
    if (!response.ok) {
      await response.body?.cancel()
      throw new Error(problem(response.status))
    }
    const body = await response.json()
    return {
      tag: plain(body.tag_name, 100),
      name: plain(body.name || body.tag_name, 200),
      publishedAt: plain(body.published_at, 40),
      draft: Boolean(body.draft),
      prerelease: Boolean(body.prerelease),
    }
  }

  /**
   * The commit a tag points at, right now. Asked for as tags/<tag>, so a
   * branch that happens to share the tag's name can never be taken for it.
   * @param {string} tag
   */
  async function resolve(tag) {
    const response = await get(`/commits/tags/${encodeURIComponent(tag)}`)
    if (!response.ok) {
      await response.body?.cancel()
      throw new Error(response.status === 404 ? `GitHub could not find the commit of ${tag} (404).` : problem(response.status))
    }
    return String((await response.json()).sha ?? '')
  }

  /**
   * GitHub's record of a commit's files: its tree, with the git hash of
   * every file.
   * @param {string} sha
   * @returns {Promise<TreeEntry[]>}
   */
  async function tree(sha) {
    const commitResponse = await get(`/git/commits/${sha}`)
    if (!commitResponse.ok) {
      await commitResponse.body?.cancel()
      throw new Error(problem(commitResponse.status))
    }
    const commit = await commitResponse.json()
    const treeSha = String(commit?.tree?.sha ?? '')
    if (commit?.sha !== sha || !/^[0-9a-f]{40}$/.test(treeSha)) {
      throw new Error(`GitHub's record of commit ${short(sha)} names another commit, so nothing was installed.`)
    }
    const treeResponse = await get(`/git/trees/${treeSha}?recursive=1`, 60_000)
    if (!treeResponse.ok) {
      await treeResponse.body?.cancel()
      throw new Error(problem(treeResponse.status))
    }
    const listing = await treeResponse.json()
    // A tree too big for one answer comes back cut short, and then not every
    // file could be checked.
    if (listing?.truncated !== false || !Array.isArray(listing.tree)) {
      throw new Error(`GitHub listed only part of the files of commit ${short(sha)}, so the download cannot be checked, and nothing was installed.`)
    }
    return listing.tree
  }

  /**
   * The commit's files into dest, an empty folder: GitHub's record of the
   * commit first, then the download, unpacked here and never through the
   * system's tar (scripts/updater/tarball.mjs), then every file checked
   * against the record.
   * @param {string} sha
   * @param {string} dest
   */
  async function download(sha, dest) {
    const entries = await tree(sha)
    const response = await fetch(`${api}/repos/${repo}/tarball/${sha}`, { headers, signal: AbortSignal.timeout(300_000) })
    if (!response.ok || !response.body) {
      await response.body?.cancel()
      throw new Error(problem(response.status))
    }
    const size = Number(response.headers.get('content-length'))
    if (size > limits.downloadBytes) {
      await response.body.cancel()
      throw new Error(`The download is larger than ${limits.downloadBytes / 1024 / 1024} MB.`)
    }
    mkdirSync(dest, { recursive: true })
    await unpackTarball(Readable.fromWeb(/** @type {import('node:stream/web').ReadableStream} */ (response.body)), dest, limits)
    const differences = treeDifferences(dest, entries)
    if (differences.length > 0) {
      const more = differences.length > 5 ? `, and ${differences.length - 5} more` : ''
      throw new Error(
        `The download does not match commit ${short(sha)} as GitHub records it, so nothing was installed: ${differences.slice(0, 5).join('; ')}${more}.`,
      )
    }
  }

  return { latest, resolve, download }
}

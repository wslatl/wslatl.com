// The supervisor's side of GitHub (scripts/serve.mjs): which release is the
// latest, which commit its tag points at, and that commit's files. Kept
// apart so the tests can drive it against a stand-in for GitHub
// (tests/attack/download.test.ts).
//
// A download is checked before anything is built from it: every file in it
// has to be one GitHub's own record of the commit lists, with the same
// contents, and every file that record lists has to be there. The record
// (the commit's tree, from the API) and the archive (from GitHub's download
// servers) come by different routes, so an archive changed on the way, or
// served from a cache that went wrong, is refused, as is one with a file
// added (a .npmrc pointing npm elsewhere, say) or left out.
//
// The token goes only to the API address in the settings, which must be
// HTTPS (plain HTTP only to this same machine, for the tests). When GitHub
// sends the download on to another address, fetch drops the Authorization
// header there, as the Fetch standard says it must.
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

/**
 * owner/name as GitHub allows them: an owner of letters, digits and inner
 * hyphens, and a name that is neither . nor .., which would walk the API
 * address up a level. The same rule as lib/admin/settings.ts.
 */
export const repoPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/(?!\.{1,2}$)[\w.-]+$/

/**
 * Why the API address cannot be used, or '' when it can: HTTPS, or HTTP to
 * this machine only. The same rule as lib/admin/settings.ts.
 * @param {string} value
 */
export function apiAddressProblem(value) {
  try {
    const url = new URL(value)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (url.protocol === 'https:' || (url.protocol === 'http:' && local)) return ''
  } catch {
    // Not an address at all.
  }
  return 'GITHUB_API_URL is not an https address'
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
 * @returns {string[]}
 */
export function filesIn(dir, prefix = '') {
  return readdirSync(join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    return entry.isDirectory() ? filesIn(dir, path) : [path]
  })
}

/**
 * @typedef {{ path: string, mode: string, type: string, sha: string }} TreeEntry
 */

/**
 * How the files in dir differ from a commit's tree, as GitHub's API lists
 * it: one line per file, none when they match. A link's contents are where
 * it points, as git stores it. The permission bits are not compared, only
 * what each file holds.
 * @param {string} dir
 * @param {TreeEntry[]} entries
 * @returns {string[]}
 */
export function treeDifferences(dir, entries) {
  const listed = new Map(entries.filter((entry) => entry.type === 'blob').map((entry) => [entry.path, entry]))
  const problems = []
  const seen = new Set()
  for (const path of filesIn(dir)) {
    const entry = listed.get(path)
    if (!entry) {
      problems.push(`${path} is not in the commit`)
      continue
    }
    seen.add(path)
    const full = join(dir, ...path.split('/'))
    const content = lstatSync(full).isSymbolicLink() ? Buffer.from(readlinkSync(full)) : readFileSync(full)
    if (gitBlobSha(content) !== entry.sha) problems.push(`${path} differs from the commit`)
  }
  for (const path of listed.keys()) if (!seen.has(path)) problems.push(`${path} is missing`)
  return problems
}

const short = (/** @type {string} */ sha) => sha.slice(0, 7)

/**
 * @param {{
 *   token: string,
 *   repo: string,
 *   api: string,
 *   onSpawn?: (child: import('node:child_process').ChildProcess) => void,
 *   maxDownloadBytes?: number,
 * }} options
 */
export function gitHub({ token, repo, api, onSpawn = () => {}, maxDownloadBytes = 500 * 1024 * 1024 }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'wslatl-updater',
  }

  /** @param {number} status */
  function problem(status) {
    if (status === 401) return 'GitHub refused the token (401). Check GITHUB_TOKEN in .env.'
    if (status === 403 || status === 429) return `GitHub refused the request (${status}): the token may lack Contents read access, or the rate limit was reached.`
    if (status === 404) return `GitHub could not find ${repo} (404). Check GITHUB_REPO and that the token can read it.`
    return `GitHub answered ${status}.`
  }

  /** @param {string} path */
  function get(path, timeoutMs = 30_000) {
    return fetch(`${api}/repos/${repo}${path}`, { headers, signal: AbortSignal.timeout(timeoutMs) })
  }

  /** GitHub's latest release (never a draft or a pre-release), or null when there is none. */
  async function latest() {
    const response = await get('/releases/latest')
    if (response.status === 404) {
      // No release yet, or no repository at all: only the second is an error.
      const found = await get('')
      if (found.ok) return null
      throw new Error(problem(found.status))
    }
    if (!response.ok) throw new Error(problem(response.status))
    const body = await response.json()
    return {
      tag: String(body.tag_name ?? ''),
      name: String(body.name || body.tag_name || ''),
      publishedAt: String(body.published_at ?? ''),
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
    if (!response.ok) throw new Error(response.status === 404 ? `GitHub could not find the commit of ${tag} (404).` : problem(response.status))
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
    if (!commitResponse.ok) throw new Error(problem(commitResponse.status))
    const commit = await commitResponse.json()
    const treeSha = String(commit?.tree?.sha ?? '')
    if (commit?.sha !== sha || !/^[0-9a-f]{40}$/.test(treeSha)) throw new Error(`GitHub's record of commit ${short(sha)} names another commit, so nothing was installed.`)
    const treeResponse = await get(`/git/trees/${treeSha}?recursive=1`)
    if (!treeResponse.ok) throw new Error(problem(treeResponse.status))
    const listing = await treeResponse.json()
    // A tree too big for one answer comes back cut short, and then not every
    // file could be checked.
    if (listing?.truncated !== false || !Array.isArray(listing.tree)) {
      throw new Error(`GitHub listed only part of the files of commit ${short(sha)}, so the download cannot be checked, and nothing was installed.`)
    }
    return listing.tree
  }

  /**
   * The commit's files into dest, an empty folder, through the system tar
   * reading from stdin, then checked against GitHub's record of the commit.
   * @param {string} sha
   * @param {string} dest
   */
  async function download(sha, dest) {
    const entries = await tree(sha)
    const response = await fetch(`${api}/repos/${repo}/tarball/${sha}`, { headers, signal: AbortSignal.timeout(300_000) })
    if (!response.ok || !response.body) throw new Error(problem(response.status))
    mkdirSync(dest, { recursive: true })
    const tar = spawn('tar', ['-xzf', '-', '--strip-components=1'], { cwd: dest, stdio: ['pipe', 'ignore', 'pipe'] })
    onSpawn(tar)
    let errors = ''
    tar.stderr.on('data', (chunk) => (errors += chunk))
    const exited = new Promise((done, fail) => {
      tar.once('error', (error) => fail(new Error(`Could not run tar (${error.message}).`)))
      tar.once('exit', (code) => (code === 0 ? done(undefined) : fail(new Error(`tar failed: ${errors.trim().slice(0, 300) || `exit code ${code}`}`))))
    })
    let size = 0
    const limit = new Transform({
      transform(chunk, _encoding, done) {
        size += chunk.length
        done(size > maxDownloadBytes ? new Error(`The download is larger than ${Math.round(maxDownloadBytes / 1024 / 1024)} MB.`) : null, chunk)
      },
    })
    try {
      await Promise.all([pipeline(Readable.fromWeb(/** @type {any} */ (response.body)), limit, tar.stdin), exited])
    } catch (error) {
      // tar is stopped, and gone, before the release folder is cleared away.
      tar.kill()
      await exited.catch(() => {})
      throw error
    }
    if (!existsSync(join(dest, 'package.json'))) throw new Error('The download has no package.json.')
    const differences = treeDifferences(dest, entries)
    if (differences.length) {
      const more = differences.length > 5 ? `, and ${differences.length - 5} more` : ''
      throw new Error(
        `The download does not match commit ${short(sha)} as GitHub records it, so nothing was installed: ${differences.slice(0, 5).join('; ')}${more}.`,
      )
    }
  }

  return { latest, resolve, download }
}

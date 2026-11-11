import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiAddressProblem, gitBlobSha, gitHub } from '../../scripts/updater/github.mjs'
import { emptyState, readState, releaseDir, runUpdate, updaterPaths, writeState } from '../../scripts/updater/lib.mjs'
import { archiveOf, type Commit, fakeGitHub, type FakeGitHub, folderOf } from './fake-github'

/**
 * What the updater downloads before it builds anything: the release GitHub
 * names, the commit its tag points at, and that commit's files, every one
 * checked against GitHub's own record of the commit. A release that does not
 * match is never built, and the token goes to GitHub's API alone.
 */
const repo = 'wslatl/wslatl.com'
const token = `canary-updater-token-${randomBytes(12).toString('hex')}`
const sha = 'c0ffee'.padEnd(40, '0')
const files = {
  'package.json': '{"name":"site","version":"9.9.9"}\n',
  'app/page.tsx': 'export default function Page() { return null }\n',
  'scripts/serve.mjs': '// the supervisor\n',
  'public/logo.png': Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3, 255]),
}
const commit: Commit = { sha, treeSha: 'abcdef'.padEnd(40, '1'), files }

let github: FakeGitHub
let work = ''
let dest = ''
const client = (options: Partial<Parameters<typeof gitHub>[0]> = {}) => gitHub({ token, repo, api: github.api, ...options })

beforeEach(async () => {
  github = await fakeGitHub(repo, [commit], { tag_name: 'v9.9.9', name: 'v9.9.9', published_at: '2026-11-10T00:00:00Z', draft: false, prerelease: false })
  work = mkdtempSync(join(tmpdir(), 'attack-download-'))
  dest = join(work, 'site', '.updater', 'releases', 'v9.9.9')
  mkdirSync(dest, { recursive: true })
})

afterEach(async () => {
  await github.close()
  rmSync(work, { recursive: true, force: true, maxRetries: 3 })
})

const git = (...args: string[]) => spawnSync('git', args, { cwd: join(__dirname, '..', '..'), maxBuffer: 256 * 1024 * 1024 })
const inRepository = git('rev-parse', 'HEAD').status === 0

/** Everything outside the release folder, which a download must never touch. */
const outside = () =>
  readdirSync(work, { recursive: true })
    .map(String)
    .filter((path) => !path.startsWith(join('site', '.updater', 'releases', 'v9.9.9')))
    .toSorted()
const untouched = [join('site'), join('site', '.updater'), join('site', '.updater', 'releases')].toSorted()

describe('a download that matches GitHub\'s record of the commit', () => {
  it('is unpacked and accepted', async () => {
    github.archive(sha, archiveOf(sha, files))
    await client().download(sha, dest)
    expect(readFileSync(join(dest, 'package.json'), 'utf8')).toBe(files['package.json'])
    expect(readFileSync(join(dest, 'public', 'logo.png'))).toEqual(files['public/logo.png'])
  })

  // Needs git and this checkout, which CI and a clone both have.
  it.skipIf(!inRepository)('is accepted for this very repository, archived by git exactly as GitHub archives it', async () => {
    const headSha = git('rev-parse', 'HEAD').stdout.toString().trim()
    // Line endings as stored: GitHub's servers never convert them.
    const archive = git('-c', 'core.autocrlf=false', 'archive', '--format=tar.gz', `--prefix=${folderOf(headSha)}`, 'HEAD')
    const listing = git('ls-tree', '-r', '-z', 'HEAD')
    expect(archive.status, archive.stderr.toString()).toBe(0)
    const tree = listing.stdout
      .toString()
      .split('\0')
      .filter(Boolean)
      .map((line) => {
        const [meta, path] = line.split('\t')
        const [mode, type, object] = meta.split(' ')
        return { path, mode, type, sha: object }
      })
    expect(tree.length).toBeGreaterThan(100)
    const treeSha = git('rev-parse', 'HEAD^{tree}').stdout.toString().trim()
    github.answer(`/repos/${repo}/git/commits/${headSha}`, { status: 200, body: { sha: headSha, tree: { sha: treeSha } } })
    github.answer(`/repos/${repo}/git/trees/${treeSha}?recursive=1`, { status: 200, body: { sha: treeSha, truncated: false, tree } })
    github.answer(`/repos/${repo}/tarball/${headSha}`, { status: 302, headers: { location: `${github.downloadsAt}/archive/${headSha}` } })
    github.archive(headSha, archive.stdout)
    await client().download(headSha, dest)
    expect(existsSync(join(dest, 'package.json'))).toBe(true)
    expect(existsSync(join(dest, 'scripts', 'serve.mjs'))).toBe(true)
  }, 60_000)

  it('names files the way git does', () => {
    // git hash-object of these exact bytes.
    expect(gitBlobSha(Buffer.from(''))).toBe('e69de29bb2d1d6434b8b29ae775ad8c2e48c5391')
    expect(gitBlobSha(Buffer.from('hello\n'))).toBe('ce013625030ba8dba906f756967f9e9ca394464a')
  })
})

/** What the download of this archive is refused with, once it has touched nothing outside its folder. */
async function refusal(archive: Buffer): Promise<string> {
  github.archive(sha, archive)
  const message = await client()
    .download(sha, dest)
    .then(
      () => 'accepted',
      (error: Error) => error.message,
    )
  return outside().join() === untouched.join() ? message : `${message}, and it wrote outside its folder`
}

describe('a download that does not match', () => {
  it('is refused when one file was changed on the way', async () => {
    const changed = archiveOf(sha, { ...files, 'app/page.tsx': 'export default function Page() { steal() }\n' })
    expect(await refusal(changed)).toMatch(/^The download does not match commit c0ffee0 .*app\/page\.tsx differs from the commit\.$/)
  })

  it('is refused when it brings a file the commit does not have, such as an .npmrc', async () => {
    const added = archiveOf(sha, { ...files, '.npmrc': 'registry=https://evil.example/\n' })
    expect(await refusal(added)).toMatch(/\.npmrc is not in the commit\.$/)
  })

  it('is refused when it leaves a file out', async () => {
    const { 'app/page.tsx': _left, ...fewer } = files
    expect(await refusal(archiveOf(sha, fewer))).toMatch(/app\/page\.tsx is missing\.$/)
  })

  it('is refused when it holds a link the commit does not have', async () => {
    const link = { name: `${folderOf(sha)}evil-link`, type: '2' as const, linkname: '/etc/passwd' }
    // tar may refuse to make the link (Windows), or make it and leave it to the check.
    expect(await refusal(archiveOf(sha, files, [link]))).toMatch(/^(?:tar failed: [\s\S]*|[\s\S]*evil-link is not in the commit\.)$/)
  })

  it('never writes outside its folder, whatever names the archive uses', async () => {
    const absolute = `/tmp/escaped-${process.pid}-${Date.now()}.txt`
    const escapes = [
      { name: `${folderOf(sha)}../../escaped.txt`, content: 'out' },
      { name: `${folderOf(sha)}x/../../../escaped.txt`, content: 'out' },
      { name: absolute, content: 'out' },
    ]
    // tar refuses the names, or leaves them inside, where the check refuses them.
    expect(await refusal(archiveOf(sha, files, escapes))).toMatch(/^(?:tar failed: [\s\S]*|The download does not match commit [\s\S]* is not in the commit[\s\S]*)$/)
    expect(existsSync(absolute)).toBe(false)
  })

  it('is refused when GitHub could only list part of the commit', async () => {
    github.answer(`/repos/${repo}/git/trees/${commit.treeSha}?recursive=1`, { status: 200, body: { truncated: true, tree: [] } })
    github.archive(sha, archiveOf(sha, files))
    await expect(client().download(sha, dest)).rejects.toThrow(/listed only part/)
    expect(readdirSync(dest)).toEqual([])
  })

  it('is refused when GitHub\'s record names another commit', async () => {
    github.answer(`/repos/${repo}/git/commits/${sha}`, { status: 200, body: { sha: 'f'.repeat(40), tree: { sha: commit.treeSha } } })
    await expect(client().download(sha, dest)).rejects.toThrow(/names another commit/)
  })

  it('is refused when it is larger than the limit', async () => {
    // Random, so it stays large once compressed: the limit counts what arrives.
    github.archive(sha, archiveOf(sha, { ...files, 'big.bin': randomBytes(200_000) }))
    await expect(client({ maxDownloadBytes: 1000 }).download(sha, dest)).rejects.toThrow(/larger than/)
  })
})

describe('the token', () => {
  it('goes to the API address alone: never to the address a download is sent on to', async () => {
    github.archive(sha, archiveOf(sha, files))
    await client().download(sha, dest)
    expect(github.seen.length).toBeGreaterThan(0)
    for (const request of github.seen) expect(request.authorization, request.path).toBe(`Bearer ${token}`)
    expect(github.downloadsSeen.length).toBe(1)
    expect(github.downloadsSeen[0].authorization).toBeUndefined()
  })

  it('never turns up in what the updater says when GitHub refuses or fails', async () => {
    for (const status of [401, 403, 404, 429, 500, 502]) {
      github.answer(`/repos/${repo}/releases/latest`, { status, body: { message: `failed with ${token}` } })
      github.answer(`/repos/${repo}`, { status, body: { message: token } })
      github.answer(`/repos/${repo}/commits/tags/v9.9.9`, { status, body: { message: token } })
      github.answer(`/repos/${repo}/git/commits/${sha}`, { status, body: { message: token } })
      const errors = await Promise.all([client().latest(), client().resolve('v9.9.9'), client().download(sha, dest)].map((p) => p.then(() => '', (error: Error) => error.message)))
      for (const message of errors) {
        expect(message, String(status)).not.toBe('')
        expect(message).not.toContain(token)
      }
    }
  })

  it('is never sent over plain HTTP to another machine', () => {
    for (const api of ['http://api.github.com', 'http://192.0.2.1', 'http://localhost.evil.example', 'ftp://api.github.com', 'file:///etc', 'api.github.com', '']) {
      expect(apiAddressProblem(api), api).not.toBe('')
    }
    for (const api of ['https://api.github.com', 'https://github.example.com/api/v3', 'http://127.0.0.1:4010', 'http://localhost:4010', 'http://[::1]:4010']) {
      expect(apiAddressProblem(api), api).toBe('')
    }
  })
})

describe('the commit a tag points at', () => {
  it('is asked for as a tag, so a branch with the same name is never taken for it', async () => {
    github.answer(`/repos/${repo}/commits/tags/v9.9.9`, { status: 200, body: { sha } })
    github.answer(`/repos/${repo}/commits/v9.9.9`, { status: 200, body: { sha: 'b'.repeat(40) } })
    expect(await client().resolve('v9.9.9')).toBe(sha)
  })
})

describe('the tag of the latest release', () => {
  // Whoever can publish a release names its tag, and the tag becomes a
  // folder name. Anything but a version is refused before GitHub is asked
  // for a commit, and nothing is created anywhere.
  const hostile = [
    '../../../../../tmp/evil',
    'v1.2.3/../../../evil',
    'v1.2.3\\..\\..\\evil',
    '..',
    '/etc',
    'C:\\Windows',
    'v1.2.3\u0000',
    'v1.2.3 ',
    'v1.2.3\n',
    'v1.2.3%2F..%2F..',
    'v1.2.3;rm -rf /',
    'v1.2.3$(touch /tmp/x)',
    'v1.2.3`id`',
    'v１.２.３',
    'v1.2.3-rc.1',
    'V1.2.3',
    'v01.2.3',
    'x'.repeat(5000),
    '',
  ]

  it('is refused unless it is a version, before any commit is looked up or downloaded', async () => {
    const root = join(work, 'another-site')
    const paths = updaterPaths(root)
    mkdirSync(paths.dir, { recursive: true })
    for (const tag of hostile) {
      writeState(paths, emptyState())
      const asked: string[] = []
      const state = await runUpdate({
        paths,
        baseEnv: {},
        secretNames: [],
        deps: {
          latest: async () => ({ tag, name: tag, publishedAt: '', draft: false, prerelease: false }),
          resolve: async (value: string) => {
            asked.push(`resolve ${value}`)
            return sha
          },
          download: async (value: string) => {
            asked.push(`download ${value}`)
          },
          npm: async () => {
            asked.push('npm')
          },
          trial: async () => true,
          switchTo: async () => true,
          print: () => {},
        },
      })
      expect(state.status, JSON.stringify(tag).slice(0, 40)).toBe('failed')
      expect(state.message).toMatch(/not vMAJOR\.MINOR\.PATCH/)
      expect(asked).toEqual([])
      expect(readState(paths).current).toBeNull()
    }
    expect(existsSync(paths.releases) ? readdirSync(paths.releases) : []).toEqual([])
    expect(releaseDir(paths, 'v1.2.3')).toBe(join(paths.releases, 'v1.2.3'))
  })
})

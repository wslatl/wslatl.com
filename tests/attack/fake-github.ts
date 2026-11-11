import { createServer, type IncomingMessage, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { gzipSync } from 'node:zlib'
import { gitBlobSha } from '../../scripts/updater/github.mjs'

/**
 * A stand-in for GitHub on this machine, for the updater's attack tests: the
 * API (releases, tags, commits, trees) on one address, and the download
 * server it sends archives on to on another, the way api.github.com sends
 * them on to codeload.github.com. Both note every request they get, with
 * the Authorization header it carried.
 */
export type Seen = { path: string; authorization: string | undefined }

export type Commit = {
  sha: string
  treeSha: string
  /** The files of the commit, by path. */
  files: Record<string, string | Buffer>
}

type Answer = { status: number; body?: unknown; headers?: Record<string, string> }

export type FakeGitHub = {
  api: string
  /** The download server's address, where the API sends archives on to. */
  downloadsAt: string
  seen: Seen[]
  downloadsSeen: Seen[]
  /** The answer for one path, in place of what the stand-in would give. */
  answer: (path: string, reply: Answer | ((request: IncomingMessage) => Answer)) => void
  /** Serve this archive for the commit's download. */
  archive: (sha: string, bytes: Buffer) => void
  close: () => Promise<void>
}

function listen(server: Server): Promise<string> {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${(server.address() as AddressInfo).port}`)))
}

/** The tree GitHub's API lists for a commit's files. */
export function treeOf(files: Record<string, string | Buffer>) {
  return Object.entries(files).map(([path, content]) => ({
    path,
    mode: '100644',
    type: 'blob',
    sha: gitBlobSha(Buffer.from(content)),
    size: Buffer.byteLength(content),
  }))
}

export async function fakeGitHub(repo: string, commits: Commit[] = [], latest: object | null = null): Promise<FakeGitHub> {
  const seen: Seen[] = []
  const downloadsSeen: Seen[] = []
  const answers = new Map<string, Answer | ((request: IncomingMessage) => Answer)>()
  const archives = new Map<string, Buffer>()

  const downloads = createServer((request, response) => {
    downloadsSeen.push({ path: request.url ?? '', authorization: request.headers.authorization })
    const bytes = archives.get((request.url ?? '').replace(/^\/archive\//, ''))
    if (!bytes) return response.writeHead(404).end()
    response.writeHead(200, { 'content-type': 'application/x-gzip' }).end(bytes)
  })
  const downloadsAt = await listen(downloads)

  const api = createServer((request, response) => {
    const path = request.url ?? ''
    seen.push({ path, authorization: request.headers.authorization })
    const given = answers.get(path)
    const reply = (answer: Answer) => {
      response.writeHead(answer.status, { 'content-type': 'application/json', ...answer.headers })
      response.end(answer.body === undefined ? '' : JSON.stringify(answer.body))
    }
    if (given) return reply(typeof given === 'function' ? given(request) : given)
    const base = `/repos/${repo}`
    if (path === base) return reply({ status: 200, body: { full_name: repo } })
    if (path === `${base}/releases/latest`) return reply(latest ? { status: 200, body: latest } : { status: 404, body: { message: 'Not Found' } })
    for (const commit of commits) {
      if (path === `${base}/git/commits/${commit.sha}`) return reply({ status: 200, body: { sha: commit.sha, tree: { sha: commit.treeSha } } })
      if (path === `${base}/git/trees/${commit.treeSha}?recursive=1`) {
        return reply({ status: 200, body: { sha: commit.treeSha, truncated: false, tree: treeOf(commit.files) } })
      }
      // As GitHub does: the archive itself comes from another address.
      if (path === `${base}/tarball/${commit.sha}`) return reply({ status: 302, headers: { location: `${downloadsAt}/archive/${commit.sha}` } })
    }
    reply({ status: 404, body: { message: 'Not Found' } })
  })
  const apiAt = await listen(api)

  return {
    api: apiAt,
    downloadsAt,
    seen,
    downloadsSeen,
    answer: (path, reply) => answers.set(path, reply),
    archive: (sha, bytes) => archives.set(sha, bytes),
    close: () => Promise.all([api, downloads].map((server) => new Promise<void>((resolve) => server.close(() => resolve())))).then(() => {}),
  }
}

type Entry = { name: string; content?: string | Buffer; type?: '0' | '2' | '5' | 'g'; linkname?: string }

/** A number as a tar header holds it: octal, padded, ending in NUL. */
const octal = (value: number, length: number) => `${value.toString(8).padStart(length - 1, '0')}\0`

/** One tar entry, ustar, with its header. */
function entry({ name, content = '', type = '0', linkname = '' }: Entry): Buffer {
  const data = Buffer.from(content)
  const header = Buffer.alloc(512)
  let base = name
  let prefix = ''
  if (Buffer.byteLength(name) > 100) {
    const cut = name.lastIndexOf('/', 155)
    prefix = name.slice(0, cut)
    base = name.slice(cut + 1)
  }
  header.write(base, 0, 100)
  header.write(octal(type === '5' ? 0o755 : 0o644, 8), 100)
  header.write(octal(0, 8), 108)
  header.write(octal(0, 8), 116)
  header.write(octal(data.length, 12), 124)
  header.write(octal(1_700_000_000, 12), 136)
  header.write('        ', 148)
  header.write(type, 156)
  header.write(linkname, 157, 100)
  header.write('ustar\0', 257)
  header.write('00', 263)
  header.write(prefix, 345, 155)
  let sum = 0
  for (const byte of header) sum += byte
  header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148)
  return Buffer.concat([header, data, Buffer.alloc((512 - (data.length % 512)) % 512)])
}

/** A pax record, "<length> key=value\n", its length counting itself. */
function paxRecord(key: string, value: string): string {
  const body = ` ${key}=${value}\n`
  let length = body.length + 2
  while (`${length}${body}`.length !== length) length++
  return `${length}${body}`
}

/**
 * An archive the way GitHub makes one (git archive): a global header naming
 * the commit, then every file under one folder named for the repository and
 * commit, which the updater strips. extra entries go in as they are.
 */
export function archiveOf(sha: string, files: Record<string, string | Buffer>, extra: Entry[] = []): Buffer {
  const folder = `wslatl-wslatl.com-${sha.slice(0, 7)}/`
  const directories = new Set<string>()
  for (const path of Object.keys(files)) {
    const parts = path.split('/')
    for (let i = 1; i < parts.length; i++) directories.add(`${parts.slice(0, i).join('/')}/`)
  }
  return gzipSync(
    Buffer.concat([
      entry({ name: 'pax_global_header', type: 'g', content: paxRecord('comment', sha) }),
      entry({ name: folder, type: '5' }),
      ...[...directories].toSorted().map((dir) => entry({ name: `${folder}${dir}`, type: '5' })),
      ...Object.entries(files).map(([path, content]) => entry({ name: `${folder}${path}`, content })),
      ...extra.map(entry),
      Buffer.alloc(1024),
    ]),
  )
}

export const folderOf = (sha: string) => `wslatl-wslatl.com-${sha.slice(0, 7)}/`

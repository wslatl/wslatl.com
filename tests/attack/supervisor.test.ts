import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { freePort } from '../../scripts/updater/process.mjs'
import { archiveOf, fakeGitHub, type FakeGitHub } from './fake-github'

/**
 * The real supervisor (scripts/serve.mjs) asked to update from a stand-in
 * for GitHub that serves a release whose archive was changed on the way.
 * It must refuse it at the download, leave the site as it was, and never
 * print its token, whatever GitHub answers.
 */
const repoRoot = join(__dirname, '..', '..')
const repo = 'wslatl/wslatl.com'
const token = `canary-supervisor-token-${process.pid}-${Date.now()}`
const sha = 'deadbeef'.padEnd(40, '0')
const files = { 'package.json': '{"name":"site","version":"9.9.9"}\n', 'app/page.tsx': 'export default function Page() { return null }\n' }

let site = ''
let github: FakeGitHub
let supervisor: ChildProcess | null = null
const output: string[] = []

function standInSite() {
  site = mkdtempSync(join(tmpdir(), 'attack-supervisor-'))
  mkdirSync(join(site, 'scripts', 'updater'), { recursive: true })
  copyFileSync(join(repoRoot, 'scripts', 'serve.mjs'), join(site, 'scripts', 'serve.mjs'))
  for (const name of readdirSync(join(repoRoot, 'scripts', 'updater'))) {
    copyFileSync(join(repoRoot, 'scripts', 'updater', name), join(site, 'scripts', 'updater', name))
  }
  writeFileSync(join(site, 'package.json'), JSON.stringify({ name: 'stand-in', private: true, version: '1.0.0', scripts: { build: 'node build.cjs' } }))
  writeFileSync(join(site, 'build.cjs'), "require('node:fs').mkdirSync('.next', { recursive: true }); require('node:fs').writeFileSync('.next/BUILD_ID', 'x')\n")
  mkdirSync(join(site, 'node_modules', 'next', 'dist', 'bin'), { recursive: true })
  writeFileSync(
    join(site, 'node_modules', 'next', 'dist', 'bin', 'next'),
    "require('node:http').createServer((q, s) => s.end('ok')).listen(Number(process.argv[process.argv.indexOf('-p') + 1]))\n",
  )
}

async function waitFor(test: () => boolean, ms = 45_000) {
  const deadline = Date.now() + ms
  while (!test()) {
    if (Date.now() > deadline) throw new Error(`Timed out. The supervisor said:\n${output.join('\n')}`)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

async function start(env: Record<string, string>) {
  const port = await freePort()
  supervisor = spawn(process.execPath, [join(site, 'scripts', 'serve.mjs')], {
    cwd: site,
    env: { ...process.env, PORT: String(port), SERVER_PORT: '', ...env },
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  for (const stream of [supervisor.stdout, supervisor.stderr]) {
    stream?.on('data', (chunk: Buffer) => output.push(...chunk.toString().split(/\r?\n/).filter(Boolean)))
  }
  await waitFor(() => output.some((line) => line.includes('Starting the site on port')))
}

const said = (text: string) => output.some((line) => line.includes(text))
/** What the dashboard does when Install is pressed: the supervisor takes it once its start-up is done. */
const pressInstall = () => writeFileSync(join(site, '.updater', 'request.json'), JSON.stringify({ requestedAt: new Date().toISOString(), by: 'test' }))
const state = () => {
  try {
    return JSON.parse(readFileSync(join(site, '.updater', 'state.json'), 'utf8'))
  } catch {
    return {}
  }
}

beforeEach(async () => {
  output.length = 0
  standInSite()
  github = await fakeGitHub(repo, [{ sha, treeSha: 'f00d'.padEnd(40, '2'), files }], {
    tag_name: 'v9.9.9',
    name: 'v9.9.9',
    published_at: '2026-11-10T00:00:00Z',
    draft: false,
    prerelease: false,
  })
  github.answer(`/repos/${repo}/commits/tags/v9.9.9`, { status: 200, body: { sha } })
})

afterEach(async () => {
  if (supervisor?.pid && supervisor.exitCode === null) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(supervisor.pid), '/T', '/F'], { stdio: 'ignore' })
    else supervisor.kill('SIGKILL')
  }
  supervisor = null
  await github.close()
  rmSync(site, { recursive: true, force: true, maxRetries: 5 })
})

describe('the supervisor, asked to install a release that was changed on the way', () => {
  it('refuses it at the download, keeps the site as it was, and never prints the token', async () => {
    github.archive(sha, archiveOf(sha, { ...files, 'app/page.tsx': 'export default function Page() { steal() }\n' }))
    await start({ GITHUB_TOKEN: token, GITHUB_REPO: repo, GITHUB_API_URL: github.api })
    expect(said(`Updates install the latest release of ${repo}.`)).toBe(true)
    pressInstall()
    await waitFor(() => state().status === 'failed')

    expect(state().steps.download).toBe('failed')
    expect(state().message).toMatch(/does not match commit deadbee/)
    expect(state().current).toBeNull()
    // The half-made release is gone, and the uploaded folder still serves.
    await waitFor(() => !existsSync(join(site, '.updater', 'releases', 'v9.9.9')))
    // The tag was asked for as a tag; the token went to the API and nowhere else.
    expect(github.seen.map((request) => request.path)).toContain(`/repos/${repo}/commits/tags/v9.9.9`)
    for (const request of github.seen) expect(request.authorization).toBe(`Bearer ${token}`)
    for (const request of github.downloadsSeen) expect(request.authorization).toBeUndefined()
    expect(output.join('\n')).not.toContain(token)
    expect(readFileSync(join(site, '.updater', 'state.json'), 'utf8')).not.toContain(token)
  }, 90_000)

  it('never prints the token when GitHub refuses it', async () => {
    github.answer(`/repos/${repo}/releases/latest`, { status: 401, body: { message: `Bad credentials: ${token}` } })
    await start({ GITHUB_TOKEN: token, GITHUB_REPO: repo, GITHUB_API_URL: github.api })
    pressInstall()
    await waitFor(() => state().status === 'failed')
    expect(state().message).toMatch(/GitHub refused the token \(401\)/)
    expect(output.join('\n')).not.toContain(token)
  }, 90_000)

  it('keeps updates off, and asks nobody, when the API address is not HTTPS', async () => {
    await start({ GITHUB_TOKEN: token, GITHUB_REPO: repo, GITHUB_API_URL: github.api.replace('127.0.0.1', 'example.invalid') })
    expect(said('Updates are off: GITHUB_API_URL is not an https address.')).toBe(true)
    supervisor?.stdin?.write('update\n')
    await waitFor(() => output.filter((line) => line.includes('Updates are off')).length >= 2)
    expect(github.seen).toEqual([])
    expect(output.join('\n')).not.toContain(token)
  }, 90_000)
})

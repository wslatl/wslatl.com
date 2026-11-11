import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { freePort } from '../../scripts/updater/process.mjs'
import { archiveOf, fakeGitHub, type FakeGitHub } from './fake-github'

/**
 * The kit's real supervisor (scripts/serve.mjs, as this site carries it)
 * installing a release from a stand-in for GitHub, with a stand-in for npm
 * that notes every command it is given, where, and with what settings. One
 * run, from the start-up build to the switch, holds up several canaries:
 * no secret reaches npm or any build, installs run no install scripts, the
 * tag is asked about once, .env and the asset history are left alone, and
 * nothing moves the site, or starts a second update, while one is under way.
 */
const repoRoot = join(__dirname, '..', '..')
const repo = 'wslatl/wslatl.com'
const sha = 'feedface'.padEnd(40, '0')
const canary = (what: string) => `canary-${what}-${randomBytes(9).toString('hex')}`
// The panel's variables, which the supervisor runs with.
const panel = { GITHUB_TOKEN: canary('token'), ADMIN_SESSION_SECRET: canary('panel-session-secret'), SITE_DB_PASSWORD: canary('panel-db-password') }
// What .env holds.
const dotenv = { ADMIN_PASSWORD_HASH: canary('env-password-hash'), SITE_DB_PASSWORD: canary('env-db-password'), MAIL_API_KEY: canary('env-mail-key') }
const secretValues = [...Object.values(panel), ...Object.values(dotenv)]
const envFile = `${Object.entries(dotenv)
  .map(([name, value]) => `${name}=${value}`)
  .join('\n')}\n`
const releaseFiles = { 'package.json': '{"name":"stand-in","version":"9.9.9"}\n', 'app/page.tsx': 'export default function Page() { return null }\n' }
const refusal = 'The site is starting, or an update or a rollback is running; try again when it is done.'

// A `next start` that answers 200, and notes in servers.log in its folder
// whether it is a trial and whether it was given the token.
const nextServer = [
  "const fs = require('node:fs')",
  "const port = Number(process.argv[process.argv.indexOf('-p') + 1])",
  "fs.appendFileSync('servers.log', JSON.stringify({ trial: process.env.PLATFORM_TRIAL === '1', token: process.env.GITHUB_TOKEN ?? null }) + '\\n')",
  "require('node:http').createServer((request, response) => response.end('ok')).listen(port)",
  '',
].join('\n')

// npm, as the supervisor runs it (npm_execpath on this Node): notes every
// command in npm.log beside itself, gives a release its stand-in next on
// npm ci, and builds in two seconds, time enough to type at the console.
const npmCli = [
  "const fs = require('node:fs')",
  "const path = require('node:path')",
  'const args = process.argv.slice(2)',
  "fs.appendFileSync(path.join(__dirname, 'npm.log'), JSON.stringify({ args, cwd: process.cwd(), env: process.env }) + '\\n')",
  'const write = (file, text) => {',
  '  fs.mkdirSync(path.dirname(file), { recursive: true })',
  '  fs.writeFileSync(file, text)',
  '}',
  "if (args[0] === 'ci') write(path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next'), fs.readFileSync(path.join(__dirname, 'next.cjs'), 'utf8'))",
  "if (args[0] === 'run' && args[1] === 'build') {",
  '  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000)',
  "  write(path.join(process.cwd(), '.next', 'BUILD_ID'), 'stand-in build')",
  "  write(path.join(process.cwd(), '.next', 'static', 'chunks', 'page.js'), '')",
  '}',
  '',
].join('\n')

let work = ''
let site = ''
let github: FakeGitHub
let supervisor: ChildProcess | null = null
const output: string[] = []

type NpmCall = { args: string[]; cwd: string; env: Record<string, string> }
/** Every command npm was given so far. A line npm is still writing is read on the next look. */
const npmCalls = (): NpmCall[] =>
  existsSync(join(work, 'npm', 'npm.log'))
    ? readFileSync(join(work, 'npm', 'npm.log'), 'utf8')
        .split('\n')
        .filter(Boolean)
        .flatMap((line) => {
          try {
            return [JSON.parse(line) as NpmCall]
          } catch {
            return []
          }
        })
    : []
const inRelease = (call: NpmCall) => call.cwd.includes(join('.updater', 'releases', 'v9.9.9'))
/** The paths asked of the stand-in GitHub that hold part. */
const asked = (part: string) => github.seen.filter((request) => request.path.includes(part)).map((request) => request.path)
const said = (text: string) => output.filter((line) => line.includes(text)).length
const firstLine = (text: string) => output.findIndex((line) => line.includes(text))
const serversIn = (folder: string) =>
  existsSync(join(folder, 'servers.log'))
    ? readFileSync(join(folder, 'servers.log'), 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as { trial: boolean; token: string | null })
    : []
const state = () => {
  try {
    return JSON.parse(readFileSync(join(site, '.updater', 'state.json'), 'utf8'))
  } catch {
    return {}
  }
}

async function waitFor(test: () => boolean, what: string, ms = 60_000) {
  const deadline = Date.now() + ms
  while (!test()) {
    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${what}. The supervisor said:\n${output.join('\n')}`)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

function write(file: string, text: string) {
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, text)
}

/** The uploaded folder of a site that runs on the kit's supervisor. */
function standInSite() {
  work = mkdtempSync(join(tmpdir(), 'kit-supervisor-'))
  site = join(work, 'site')
  for (const name of ['serve.mjs', ...readdirSync(join(repoRoot, 'scripts', 'updater')).map((each) => join('updater', each))]) {
    mkdirSync(join(site, 'scripts', 'updater'), { recursive: true })
    copyFileSync(join(repoRoot, 'scripts', name), join(site, 'scripts', name))
  }
  write(join(site, 'package.json'), JSON.stringify({ name: 'stand-in', private: true, version: '1.0.0', scripts: { build: 'next build' } }))
  write(join(site, 'node_modules', 'next', 'dist', 'bin', 'next'), nextServer)
  write(join(site, '.env'), envFile)
  write(join(site, '.next-static-history', 'chunks', 'old.js'), 'an asset an old page still asks for')
  write(join(work, 'npm', 'npm-cli.cjs'), npmCli)
  write(join(work, 'npm', 'next.cjs'), nextServer)
}

beforeAll(async () => {
  standInSite()
  github = await fakeGitHub(repo, [{ sha, treeSha: 'beef'.padEnd(40, '3'), files: releaseFiles }], {
    tag_name: 'v9.9.9',
    name: 'v9.9.9',
    published_at: '2026-11-10T00:00:00Z',
    draft: false,
    prerelease: false,
  })
  github.answer(`/repos/${repo}/commits/tags/v9.9.9`, { status: 200, body: { sha } })
  github.archive(sha, archiveOf(sha, releaseFiles))

  const settings: Record<string, string | null> = {
    PORT: String(await freePort()),
    SERVER_PORT: '',
    GITHUB_REPO: repo,
    GITHUB_API_URL: github.api,
    npm_execpath: join(work, 'npm', 'npm-cli.cjs'),
    ...panel,
    // Set in .env alone, or by the supervisor itself.
    ADMIN_PASSWORD_HASH: null,
    MAIL_API_KEY: null,
    UPDATER_DIR: null,
    UPDATE_STEP_MINUTES: null,
  }
  // Windows reads setting names in any case, and npm may have set NPM_EXECPATH.
  const env: Record<string, string | undefined> = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !Object.keys(settings).some((each) => each.toUpperCase() === name.toUpperCase())),
  )
  for (const [name, value] of Object.entries(settings)) if (value !== null) env[name] = value
  supervisor = spawn(process.execPath, [join(site, 'scripts', 'serve.mjs')], {
    cwd: site,
    env: env as NodeJS.ProcessEnv,
    stdio: ['pipe', 'pipe', 'pipe'],
    // A group of its own, so the clean-up can stop everything it started.
    detached: process.platform !== 'win32',
  })
  for (const stream of [supervisor.stdout, supervisor.stderr]) {
    stream?.on('data', (chunk: Buffer) => output.push(...chunk.toString().split(/\r?\n/).filter(Boolean)))
  }

  // While the uploaded folder builds, the console asks to move the site and to update it.
  await waitFor(() => said('running npm run build first') > 0, 'the start-up build')
  supervisor.stdin?.write('restart\nrollback\nupdate\n')
  await waitFor(() => said(refusal) >= 3, 'three refusals')
  await waitFor(() => said('Starting the site on port') > 0, 'the start')

  // The owner presses Install, and asks again at the console while the release builds.
  writeFileSync(join(site, '.updater', 'request.json'), JSON.stringify({ requestedAt: new Date().toISOString(), by: 'test' }))
  await waitFor(() => npmCalls().some((call) => inRelease(call) && call.args[0] === 'run' && call.args[1] === 'build'), "the release's build")
  supervisor.stdin?.write('update\n')
  await waitFor(() => said(refusal) >= 4, 'a fourth refusal')
  await waitFor(() => said('Installed v9.9.9') > 0 || state().status === 'failed' || state().status === 'rolled-back', 'the update to end', 90_000)
  if (state().current?.tag !== 'v9.9.9') throw new Error(`The update did not install v9.9.9: ${state().message}\n${output.join('\n')}`)
}, 150_000)

afterAll(async () => {
  const running = () => supervisor !== null && supervisor.exitCode === null && supervisor.signalCode === null
  const gone = async (ms: number) => {
    const deadline = Date.now() + ms
    while (running() && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 100))
  }
  // Its own stop command first, which stops everything it started.
  if (running()) {
    supervisor?.stdin?.write('stop\n')
    await gone(15_000)
  }
  if (running() && supervisor?.pid) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(supervisor.pid), '/T', '/F'], { stdio: 'ignore' })
    else process.kill(-supervisor.pid, 'SIGKILL')
    await gone(10_000)
  }
  await Promise.race([github?.close(), new Promise((resolve) => setTimeout(resolve, 5000))])
  // A folder a process is still letting go of is no reason to fail the canaries.
  try {
    rmSync(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
  } catch {
    // Left in the system's temporary folder.
  }
}, 60_000)

describe('the real supervisor, installing a release', () => {
  it("gives npm and every build none of the kit's secrets, and nothing set in .env", () => {
    const calls = npmCalls()
    expect(calls.map((call) => `${inRelease(call) ? 'release' : 'uploaded'} ${call.args[0]}`)).toEqual(expect.arrayContaining(['uploaded run', 'release ci', 'release run', 'release prune']))
    for (const call of calls) {
      const seen = JSON.stringify(call.env)
      for (const value of secretValues) expect(seen.includes(value), `npm ${call.args.join(' ')} was given ${value}`).toBe(false)
    }
  })

  it('names every secret and .env setting as empty for the start-up build, so Next cannot read them from .env either', () => {
    const build = npmCalls().find((call) => !inRelease(call) && call.args[0] === 'run' && call.args[1] === 'build')
    expect(build).toBeDefined()
    for (const name of ['ADMIN_PASSWORD_HASH', 'ADMIN_SESSION_SECRET', 'GITHUB_TOKEN', ...Object.keys(dotenv)]) expect(build?.env[name], name).toBe('')
  })

  it('installs and prunes the release with --ignore-scripts', () => {
    const calls = npmCalls().filter(inRelease)
    for (const command of ['ci', 'prune']) {
      const call = calls.find((each) => each.args[0] === command)
      expect(call?.args, command).toContain('--ignore-scripts')
    }
    expect(calls.map((call) => call.args[0])).not.toContain('rebuild')
  })

  it("asks GitHub for the tag's commit once, and downloads that commit", () => {
    expect(asked('/commits/tags/')).toEqual([`/repos/${repo}/commits/tags/v9.9.9`])
    // Its record and its files, of that one commit.
    expect(asked('/git/commits/')).toEqual([`/repos/${repo}/git/commits/${sha}`])
    expect(asked('/tarball/')).toEqual([`/repos/${repo}/tarball/${sha}`])
  })

  it('leaves .env and the asset history as they were', () => {
    expect(readFileSync(join(site, '.env'), 'utf8')).toBe(envFile)
    expect(readFileSync(join(site, '.next-static-history', 'chunks', 'old.js'), 'utf8')).toBe('an asset an old page still asks for')
  })

  it('refuses to move the site while it builds the uploaded folder, then starts it once', () => {
    const started = firstLine('Starting the site on port')
    expect(output.slice(0, started).filter((line) => line.includes(refusal))).toHaveLength(3)
    expect(serversIn(site)).toEqual([{ trial: false, token: panel.GITHUB_TOKEN }])
  })

  it('refuses a second update while one runs', () => {
    expect(said('Update requested')).toBe(1)
    expect(github.seen.filter((request) => request.path.endsWith('/releases/latest'))).toHaveLength(1)
    const requested = firstLine('Update requested')
    const installed = firstLine('Installed v9.9.9')
    const refusals = output.map((line, index) => (line.includes(refusal) ? index : -1)).filter((index) => index > requested && index < installed)
    expect(refusals).toHaveLength(1)
  })

  it('gives the token to the live site alone, never to its trial start', () => {
    expect(serversIn(join(site, '.updater', 'releases', 'v9.9.9'))).toEqual([
      { trial: true, token: null },
      { trial: false, token: panel.GITHUB_TOKEN },
    ])
    expect(output.join('\n')).not.toContain(panel.GITHUB_TOKEN)
  })
})

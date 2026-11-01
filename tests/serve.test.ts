import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { freePort } from '../scripts/updater/process.mjs'

/**
 * The real supervisor (scripts/serve.mjs) against a stand-in site: a build
 * that takes three seconds, and a `next start` that answers 200 and notes
 * every start in servers.log. Updates are off (no token), so only the
 * start-up and the console are exercised.
 */
const repo = join(__dirname, '..')
let site = ''
let supervisor: ChildProcess | null = null
const output: string[] = []

function standInSite() {
  site = mkdtempSync(join(tmpdir(), 'serve-'))
  mkdirSync(join(site, 'scripts', 'updater'), { recursive: true })
  copyFileSync(join(repo, 'scripts', 'serve.mjs'), join(site, 'scripts', 'serve.mjs'))
  for (const name of readdirSync(join(repo, 'scripts', 'updater'))) {
    copyFileSync(join(repo, 'scripts', 'updater', name), join(site, 'scripts', 'updater', name))
  }
  writeFileSync(join(site, 'package.json'), JSON.stringify({ name: 'stand-in', private: true, scripts: { build: 'node build.cjs' } }))
  writeFileSync(
    join(site, 'build.cjs'),
    "setTimeout(() => { require('node:fs').mkdirSync('.next', { recursive: true }); require('node:fs').writeFileSync('.next/BUILD_ID', 'x') }, 3000)\n",
  )
  mkdirSync(join(site, 'node_modules', 'next', 'dist', 'bin'), { recursive: true })
  writeFileSync(
    join(site, 'node_modules', 'next', 'dist', 'bin', 'next'),
    [
      "const fs = require('node:fs')",
      "const port = Number(process.argv[process.argv.indexOf('-p') + 1])",
      "fs.appendFileSync('servers.log', (fs.existsSync('.next/BUILD_ID') ? 'built' : 'not built') + '\\n')",
      "require('node:http').createServer((request, response) => response.end('ok')).listen(port)",
      '',
    ].join('\n'),
  )
}

async function waitFor(test: () => boolean, ms = 30_000) {
  const deadline = Date.now() + ms
  while (!test()) {
    if (Date.now() > deadline) throw new Error(`Timed out. Supervisor said:\n${output.join('\n')}`)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

const said = (text: string) => output.some((line) => line.includes(text))
const servers = () => (existsSync(join(site, 'servers.log')) ? readFileSync(join(site, 'servers.log'), 'utf8').trim().split('\n') : [])

beforeEach(() => {
  output.length = 0
  standInSite()
})

afterEach(() => {
  if (supervisor?.pid && supervisor.exitCode === null) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(supervisor.pid), '/T', '/F'], { stdio: 'ignore' })
    else supervisor.kill('SIGKILL')
  }
  rmSync(site, { recursive: true, force: true, maxRetries: 3 })
})

describe('the supervisor', () => {
  it('lets nothing move the site while it builds the uploaded folder, then starts exactly one server', async () => {
    const port = await freePort()
    supervisor = spawn(process.execPath, [join(site, 'scripts', 'serve.mjs')], {
      cwd: site,
      env: { ...process.env, PORT: String(port), SERVER_PORT: '', GITHUB_TOKEN: '' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    for (const stream of [supervisor.stdout, supervisor.stderr]) {
      stream?.on('data', (chunk: Buffer) => output.push(...chunk.toString().split(/\r?\n/).filter(Boolean)))
    }

    await waitFor(() => said('running npm run build first'))
    // A restart or a rollback during the build used to start a half-built
    // server that kept the port from the real one.
    supervisor.stdin?.write('restart\nrollback\nrollback upload\n')
    await waitFor(() => output.filter((line) => line.includes('The site is starting')).length === 3)

    await waitFor(() => said('Starting the site on port'))
    await waitFor(() => servers().length === 1)
    expect(await (await fetch(`http://127.0.0.1:${port}/`)).text()).toBe('ok')
    // The commands were refused, not queued: still one server, built.
    await new Promise((resolve) => setTimeout(resolve, 1500))
    expect(servers()).toEqual(['built'])

    // Once it is up, a restart works, and stops the old server first.
    await waitFor(() => !said('Could not remove'))
    supervisor.stdin?.write('restart\n')
    await waitFor(() => said('The site answers.'))
    expect(servers()).toEqual(['built', 'built'])

    supervisor.stdin?.write('stop\n')
    await waitFor(() => supervisor?.exitCode !== null)
  }, 60_000)
})

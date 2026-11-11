import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { request as httpRequest } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { freePort } from '../../scripts/updater/process.mjs'
import { adminHash } from '../attack/admin-hash'

/**
 * The real site, built by `npm run build`, run by `next start` on a spare
 * port with admin settings made for this run alone, the way the owner makes
 * them (npm run admin:hash). Everything it prints is kept, so a test can
 * look through the log for what must never be in it.
 */
export const root = join(__dirname, '..', '..')

export type Site = {
  base: string
  password: string
  secrets: string[]
  updaterDir: string
  log: () => string
  stop: () => Promise<void>
}

export function built(): boolean {
  return existsSync(join(root, '.next', 'BUILD_ID'))
}

export async function startSite(env: Record<string, string> = {}): Promise<Site> {
  if (!built()) throw new Error('No build to test. Run npm run build first, then npm run test:http.')
  const password = `http-test-password-${randomBytes(9).toString('base64url')}`
  const { passwordHash, secret } = adminHash(password)
  const token = `canary-http-token-${randomBytes(18).toString('hex')}`
  const folder = mkdtempSync(join(tmpdir(), 'http-site-'))
  const updaterDir = join(folder, '.updater')
  mkdirSync(updaterDir)
  const port = await freePort()
  const settings: Record<string, string> = {
    ADMIN_PASSWORD_HASH: passwordHash,
    ADMIN_SESSION_SECRET: secret,
    GITHUB_TOKEN: token,
    GITHUB_REPO: 'wslatl/wslatl.com',
    UPDATER_DIR: updaterDir,
    ...env,
  }
  const lines: string[] = []
  const child: ChildProcess = spawn(process.execPath, [join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(port)], {
    cwd: root,
    // The settings here win over any .env in the folder, as they do for Next.
    env: { ...process.env, NODE_ENV: 'production', ...settings },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  for (const stream of [child.stdout, child.stderr]) stream?.on('data', (chunk: Buffer) => lines.push(chunk.toString()))
  const base = `http://127.0.0.1:${port}`
  const deadline = Date.now() + 90_000
  for (;;) {
    if (child.exitCode !== null) throw new Error(`next start stopped:\n${lines.join('')}`)
    try {
      const response = await fetch(`${base}/robots.txt`, { signal: AbortSignal.timeout(5000) })
      await response.body?.cancel()
      if (response.ok) break
    } catch {
      // Not listening yet.
    }
    if (Date.now() > deadline) throw new Error(`next start did not answer:\n${lines.join('')}`)
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  return {
    base,
    password,
    secrets: [password, settings.ADMIN_PASSWORD_HASH, settings.ADMIN_SESSION_SECRET, settings.GITHUB_TOKEN],
    updaterDir,
    log: () => lines.join(''),
    stop: async () => {
      if (child.exitCode === null && child.pid) {
        if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
        else child.kill('SIGKILL')
        await new Promise((resolve) => child.once('exit', resolve))
      }
      rmSync(folder, { recursive: true, force: true, maxRetries: 5 })
    },
  }
}

/**
 * A request sent as it is, with any method, even one fetch refuses to send
 * (TRACE), and a path exactly as written.
 */
export function raw(base: string, method: string, path: string, headers: Record<string, string> = {}): Promise<{ status: number; headers: Record<string, string | string[] | undefined>; body: string }> {
  const { hostname, port } = new URL(base)
  return new Promise((resolve, reject) => {
    const request = httpRequest({ hostname, port, method, path, headers, timeout: 20_000 }, (response) => {
      const chunks: Buffer[] = []
      response.on('data', (chunk: Buffer) => chunks.push(chunk))
      response.on('end', () => resolve({ status: response.statusCode ?? 0, headers: response.headers, body: Buffer.concat(chunks).toString('utf8') }))
    })
    request.on('timeout', () => request.destroy(new Error('timed out')))
    request.on('error', reject)
    request.end()
  })
}

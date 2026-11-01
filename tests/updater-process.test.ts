import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { answers, freePort, run } from '../scripts/updater/process.mjs'

let dir = ''

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'updater-process-'))
})

afterEach(() => rmSync(dir, { recursive: true, force: true }))

const node = process.execPath

describe('running a command', () => {
  it('passes its output on line by line and resolves when it succeeds', async () => {
    const lines: string[] = []
    await run(node, ['-e', 'console.log("one"); console.error("two")'], { onLine: (line: string) => lines.push(line) })
    expect(lines.toSorted()).toEqual(['one', 'two'])
  })

  it('rejects with the exit code when it fails', async () => {
    const error = await run(node, ['-e', 'process.exit(3)']).catch((e: Error) => e)
    expect((error as Error).message).toMatch(/exit code 3/)
  })

  it('gives up on it after the time limit', async () => {
    const error = await run(node, ['-e', 'setInterval(() => {}, 1000)'], { timeoutMs: 500 }).catch((e: Error) => e)
    expect((error as Error).message).toMatch(/took longer than 0.5 seconds and was stopped/)
  }, 30_000)

  // npm ci and npm run build start processes of their own: killing npm
  // alone left next build writing into the release folder after its update
  // had given up on it. On Linux, where the site runs, the command leads a
  // process group and the whole group is killed at once; Windows ends the
  // tree with taskkill /T. There the grandchild is detached, since libuv
  // otherwise puts it in a job that dies with its parent, and the test
  // would pass without taskkill.
  it('stops everything it started along with it', async () => {
    const marker = join(dir, 'grandchild-still-running')
    const grandchild = join(dir, 'grandchild.cjs')
    const child = join(dir, 'child.cjs')
    // The grandchild writes the marker 4 s after it starts, if it is still alive.
    writeFileSync(grandchild, "setTimeout(() => require('node:fs').writeFileSync(process.argv[2], 'x'), 4000)\n")
    writeFileSync(
      child,
      [
        "const grandchild = require('node:child_process').spawn(process.execPath, [process.argv[2], process.argv[3]], { stdio: 'ignore', detached: process.platform === 'win32' })",
        "grandchild.once('spawn', () => console.log('grandchild running'))",
        'setInterval(() => {}, 1000)',
        '',
      ].join('\n'),
    )
    const lines: string[] = []
    const error = await run(node, [child, grandchild, marker], { timeoutMs: 2500, onLine: (line: string) => lines.push(line) }).catch(
      (e: Error) => e,
    )
    expect(lines).toContain('grandchild running')
    expect((error as Error).message).toMatch(/took longer than 2.5 seconds and was stopped/)
    await new Promise((resolve) => setTimeout(resolve, 4500))
    expect(existsSync(marker)).toBe(false)
  }, 30_000)
})

describe('waiting for a server', () => {
  it('finds a port nothing listens on', async () => {
    const port = await freePort()
    const server = createServer()
    await new Promise<void>((resolve) => server.listen(port, resolve))
    server.close()
    expect(port).toBeGreaterThan(0)
  })

  it('gives up at once when the server is gone', async () => {
    const started = Date.now()
    expect(await answers(await freePort(), () => true, 60_000)).toBe(false)
    expect(Date.now() - started).toBeLessThan(1000)
  })
})

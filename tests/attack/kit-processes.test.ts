import { EventEmitter } from 'node:events'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer as createHttpServer } from 'node:http'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { busyFlag } from '../../scripts/updater/busy.mjs'
import { liveServer } from '../../scripts/updater/live.mjs'
import { answers, freePort, listens, run } from '../../scripts/updater/process.mjs'

/**
 * Canaries for the processes the kit's supervisor starts
 * (scripts/updater/process.mjs and live.mjs): a step that runs too long is
 * stopped together with everything it started, a trial or a switch counts
 * only while the server started for it still runs, a release that keeps
 * stopping is taken back out instead of being started again, and two live
 * servers never run at once.
 */
let dir = ''
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'kit-processes-'))
})
afterEach(() => rmSync(dir, { recursive: true, force: true, maxRetries: 3 }))

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('a step that runs too long', () => {
  // npm ci and npm run build start processes of their own. The grandchild
  // here writes a line every 100 ms for as long as it runs. On Windows it is
  // detached, since a child left in its parent's job would end with it and
  // the canary would pass without the whole tree being stopped.
  it('is stopped together with everything it started', async () => {
    const beats = join(dir, 'beats')
    const grandchild = join(dir, 'grandchild.cjs')
    const child = join(dir, 'child.cjs')
    writeFileSync(grandchild, "const fs = require('node:fs')\nfs.writeFileSync(process.argv[2] + '.pid', String(process.pid))\nsetInterval(() => fs.appendFileSync(process.argv[2], 'x'), 100)\n")
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
    const error = await run(process.execPath, [child, grandchild, beats], { timeoutMs: 2500, onLine: (line: string) => lines.push(line) }).then(
      () => null,
      (reason: Error) => reason,
    )
    try {
      expect(lines).toContain('grandchild running')
      expect(error?.message).toMatch(/took longer than 2\.5 seconds and was stopped/)
      // Still for a whole second, within ten: the grandchild is gone.
      const size = () => (existsSync(beats) ? readFileSync(beats, 'utf8').length : 0)
      const deadline = Date.now() + 10_000
      let last = size()
      let stillSince = Date.now()
      while (Date.now() - stillSince < 1000) {
        expect(Date.now(), 'the grandchild kept running after its step was stopped').toBeLessThan(deadline)
        await pause(200)
        const now = size()
        if (now !== last) {
          last = now
          stillSince = Date.now()
        }
      }
      expect(last).toBeGreaterThan(0)
    } finally {
      // So a failure here never leaves it running.
      try {
        process.kill(Number(readFileSync(`${beats}.pid`, 'utf8')), 'SIGKILL')
      } catch {
        // Already gone, as it should be.
      }
    }
  }, 30_000)
})

describe('a trial start or a switch', () => {
  it('counts a 200 only while the server started for it is still running', async () => {
    // Something else answers on the port while the server started for it has failed.
    const port = await freePort()
    const other = createHttpServer((_request, response) => response.end('someone else'))
    await new Promise<void>((resolve) => other.listen(port, resolve))
    try {
      let alive = true
      setTimeout(() => (alive = false), 300)
      expect(await answers(port, () => !alive, 10_000)).toBe(false)
      expect(await answers(port, () => true, 10_000)).toBe(false)
      // Spawned only once its port is free: what answers before then is not it.
      expect(await answers(port, () => false, 1500, { started: () => false })).toBe(false)
      expect(await answers(port, () => false, 10_000)).toBe(true)
    } finally {
      other.close()
    }
  }, 30_000)

  it('counts a process beside the website only while it still runs', async () => {
    const port = await freePort()
    const other = createServer((socket) => socket.end())
    await new Promise<void>((resolve) => other.listen(port, resolve))
    try {
      let alive = true
      setTimeout(() => (alive = false), 300)
      expect(await listens([port], () => !alive, { timeoutMs: 10_000 })).toBe(false)
      expect(await listens([port], () => false, { timeoutMs: 10_000 })).toBe(true)
    } finally {
      other.close()
    }
  }, 30_000)
})

/** A stand-in for a `next start` process. */
class FakeChild extends EventEmitter {
  exitCode: number | null = null
  signalCode: string | null = null
  constructor(readonly folder: string) {
    super()
  }
  crash() {
    this.exitCode = 1
    this.emit('exit', 1, null)
  }
}

/** A live server on a clock of its own, whose timers run when the clock is moved on. */
function harness(onCrashLoop: (dir: string) => void = () => {}) {
  let clock = 0
  const timers: { at: number; run: () => void }[] = []
  const started: FakeChild[] = []
  const running = new Set<FakeChild>()
  let mostAtOnce = 0
  const server = liveServer({
    start: (folder: string) => {
      const child = new FakeChild(folder)
      started.push(child)
      running.add(child)
      mostAtOnce = Math.max(mostAtOnce, running.size)
      child.once('exit', () => running.delete(child))
      return child as never
    },
    stop: async (child) => {
      running.delete(child as unknown as FakeChild)
    },
    print: () => {},
    onCrashLoop,
    now: () => clock,
    setTimer: (callback: () => void, ms: number) => {
      const timer = { at: clock + ms, run: callback }
      timers.push(timer)
      return timer
    },
    clearTimer: (timer: unknown) => {
      const index = timers.indexOf(timer as never)
      if (index >= 0) timers.splice(index, 1)
    },
  })
  const advance = (ms: number) => {
    clock += ms
    for (const timer of timers.filter((each) => each.at <= clock)) {
      timers.splice(timers.indexOf(timer), 1)
      timer.run()
    }
  }
  return { server, started, running, timers, advance, mostAtOnce: () => mostAtOnce }
}

/** Lets every pending step of an async function run. */
const settle = () => new Promise((resolve) => setImmediate(resolve))

describe('a release that keeps stopping', () => {
  it('is taken back out on its third stop within ten minutes of its switch, instead of being started again', async () => {
    const loops: string[] = []
    const { server, started, timers, advance } = harness((folder) => loops.push(folder))
    await server.start('/releases/v1.1.0')
    server.watchCrashes()
    for (let i = 0; i < 2; i++) {
      started.at(-1)?.crash()
      advance(60_000)
    }
    expect(loops).toEqual([])
    expect(started).toHaveLength(3)
    started.at(-1)?.crash()
    expect(loops).toEqual(['/releases/v1.1.0'])
    // Not started a fourth time.
    expect(timers).toHaveLength(0)
  })

  it('is started again as usual once its ten minutes are over, and when nothing was switched to', async () => {
    const loops: string[] = []
    const late = harness((folder) => loops.push(folder))
    await late.server.start('/releases/v1.1.0')
    late.server.watchCrashes()
    // Ten minutes, written out: the window the kit promises, not whatever it holds.
    late.advance(10 * 60_000)
    const unwatched = harness((folder) => loops.push(folder))
    await unwatched.server.start('/uploaded')
    for (const { started, advance } of [late, unwatched]) {
      for (let i = 0; i < 3; i++) {
        started.at(-1)?.crash()
        advance(60_000)
      }
      expect(started).toHaveLength(4)
    }
    expect(loops).toEqual([])
  })

  it('goes back once start-up is done, and nothing starts it again behind the rollback, one server at a time', async () => {
    const crashing = '/releases/v1.1.0'
    const older = '/releases/v1.0.0'
    let recorded = crashing
    const portCheck = Promise.withResolvers<void>()
    // The supervisor's wiring (scripts/serve.mjs), its rollback cut down to the switch.
    const { server: live, started, running, advance, mostAtOnce } = harness((folder) => void crashLoop(folder))
    const busy = busyFlag({
      onCrashLoopDue: (folder) => {
        if (live.current?.dir === folder) void crashLoop(folder)
      },
      ensureServing: () => {
        if (!busy.held) live.ensure(recorded)
      },
    })
    async function crashLoop(folder: string) {
      if (!busy.take()) {
        busy.deferCrash(folder)
        await live.start(folder)
        return
      }
      try {
        await live.stop()
        await portCheck.promise
        await live.start(older)
        recorded = older
      } finally {
        busy.release()
      }
    }

    // Start-up holds the flag while its clean-up runs. The release stops
    // three times within ten minutes of being installed.
    await live.start(crashing)
    live.watchCrashes()
    started[0].crash()
    advance(2000)
    started[1].crash()
    advance(4000)
    started[2].crash()
    await settle()
    expect(started.map((child) => child.folder)).toEqual([crashing, crashing, crashing, crashing])
    expect(running.size).toBe(1)

    // Start-up is done: the rollback takes the flag and stops the crashing
    // release, and nothing starts it again meanwhile.
    busy.release()
    expect(busy.held).toBe(true)
    await settle()
    expect(started).toHaveLength(4)
    expect(running.size).toBe(0)

    portCheck.resolve()
    await settle()
    expect(started.map((child) => child.folder)).toEqual([crashing, crashing, crashing, crashing, older])
    expect(recorded).toBe(older)
    expect(busy.held).toBe(false)
    expect(running.size).toBe(1)
    expect(mostAtOnce()).toBe(1)
  })
})

describe('the live server', () => {
  it('is stopped before another is started, so two never share the port', async () => {
    const { server, started, running, mostAtOnce } = harness()
    await server.start('/uploaded')
    await server.start('/releases/v1.1.0')
    await server.start('/releases/v1.1.0')
    expect(started.map((child) => child.folder)).toEqual(['/uploaded', '/releases/v1.1.0', '/releases/v1.1.0'])
    expect(running.size).toBe(1)
    expect(mostAtOnce()).toBe(1)
    // A start while one runs, or is about to be started again, starts nothing.
    expect(server.ensure('/uploaded')).toBe(false)
    expect(running.size).toBe(1)
  })
})

import { EventEmitter } from 'node:events'
import { describe, expect, it } from 'vitest'
import { crashWindowMs, liveServer } from '../scripts/updater/live.mjs'

/** A stand-in for a `next start` process. */
class FakeChild extends EventEmitter {
  exitCode: number | null = null
  signalCode: string | null = null
  constructor(readonly dir: string) {
    super()
  }
  crash() {
    this.exitCode = 1
    this.emit('exit', 1, null)
  }
  failToSpawn() {
    this.emit('error', new Error('spawn EAGAIN'))
  }
}

function harness({ throwOnStart = false } = {}) {
  let clock = 0
  const timers: { at: number; run: () => void }[] = []
  const started: FakeChild[] = []
  const stopped: FakeChild[] = []
  const lines: string[] = []
  const loops: string[] = []
  const server = liveServer({
    start: (dir: string) => {
      if (throwOnStart) throw new Error('spawn ENOMEM')
      const child = new FakeChild(dir)
      started.push(child)
      return child as never
    },
    stop: async (child) => {
      stopped.push(child as unknown as FakeChild)
    },
    print: (line: string) => lines.push(line),
    onCrashLoop: (dir: string) => loops.push(dir),
    now: () => clock,
    setTimer: (run: () => void, ms: number) => {
      const timer = { at: clock + ms, run }
      timers.push(timer)
      return timer
    },
    clearTimer: (timer: unknown) => {
      const index = timers.indexOf(timer as never)
      if (index >= 0) timers.splice(index, 1)
    },
  })
  /** Moves the clock on and runs the timers that are due. */
  const advance = (ms: number) => {
    clock += ms
    for (const timer of timers.filter((t) => t.at <= clock)) {
      timers.splice(timers.indexOf(timer), 1)
      timer.run()
    }
  }
  return { server, started, stopped, lines, loops, timers, advance }
}

describe('the live server', () => {
  it('starts again after it stops, waiting longer each time it stops soon after starting', () => {
    const { server, started, lines, advance } = harness()
    server.start('/site')
    started[0].crash()
    expect(lines.at(-1)).toMatch(/starting it again in 2 s/)
    advance(2000)
    expect(started).toHaveLength(2)
    started[1].crash()
    expect(lines.at(-1)).toMatch(/starting it again in 4 s/)
    advance(4000)
    expect(started.map((child) => child.dir)).toEqual(['/site', '/site', '/site'])
  })

  it('starts again when it fails to start at all, which reports an error and never an exit', () => {
    const { server, started, lines, advance } = harness()
    server.start('/site')
    started[0].failToSpawn()
    expect(lines.at(-1)).toMatch(/could not start: spawn EAGAIN/)
    advance(2000)
    expect(started).toHaveLength(2)
  })

  it('starts again when spawning throws outright', async () => {
    const { server, lines, timers } = harness({ throwOnStart: true })
    server.start('/site')
    await Promise.resolve()
    expect(lines.at(-1)).toMatch(/could not start: spawn ENOMEM/)
    expect(timers).toHaveLength(1)
  })

  it('stays stopped once stopped on purpose', async () => {
    const { server, started, stopped, timers } = harness()
    server.start('/site')
    await server.stop()
    started[0].crash()
    expect(stopped).toEqual([started[0]])
    expect(timers).toHaveLength(0)
    expect(server.idle()).toBe(true)
  })

  it('goes back on the third stop within ten minutes of a switch, instead of starting it again', () => {
    const { server, started, loops, timers, advance } = harness()
    server.start('/releases/v1.1.0')
    server.watchCrashes()
    for (let i = 0; i < 2; i++) {
      started.at(-1)?.crash()
      advance(60_000)
    }
    expect(loops).toEqual([])
    started.at(-1)?.crash()
    expect(loops).toEqual(['/releases/v1.1.0'])
    expect(timers).toHaveLength(0)
  })

  it('counts no stops after the ten minutes, and none without a switch', () => {
    const late = harness()
    late.server.start('/releases/v1.1.0')
    late.server.watchCrashes()
    late.advance(crashWindowMs)
    for (let i = 0; i < 3; i++) {
      late.started.at(-1)?.crash()
      late.advance(60_000)
    }
    expect(late.loops).toEqual([])

    const unwatched = harness()
    unwatched.server.start('/site')
    for (let i = 0; i < 3; i++) {
      unwatched.started.at(-1)?.crash()
      unwatched.advance(60_000)
    }
    expect(unwatched.loops).toEqual([])
  })

  it('starts a server when none is running or about to start, and only then', async () => {
    const { server, started, advance } = harness()
    expect(server.ensure('/site')).toBe(true)
    expect(server.ensure('/site')).toBe(false)
    // A stop with a restart already waiting: nothing to do.
    started[0].crash()
    expect(server.ensure('/site')).toBe(false)
    advance(2000)
    expect(started).toHaveLength(2)
    // Stopped on purpose (a switch that threw half way): started again.
    await server.stop()
    expect(server.ensure('/site')).toBe(true)
    expect(started).toHaveLength(3)
  })
})

import { EventEmitter } from 'node:events'
import { describe, expect, it, vi } from 'vitest'
import { busyFlag } from '../scripts/updater/busy.mjs'
import { liveServer } from '../scripts/updater/live.mjs'

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
}

/** Lets every pending step of an async function run. */
const settle = () => new Promise((resolve) => setImmediate(resolve))

describe('the busy flag', () => {
  it('is held from the start, for start-up, and has one holder at a time', () => {
    const busy = busyFlag({ onCrashLoopDue: vi.fn<(dir: string) => void>(), ensureServing: vi.fn<() => void>() })
    expect(busy.held).toBe(true)
    expect(busy.take()).toBe(false)
    busy.release()
    expect(busy.held).toBe(false)
    expect(busy.take()).toBe(true)
    expect(busy.take()).toBe(false)
  })

  it('makes sure the site serves when it comes free', () => {
    const onCrashLoopDue = vi.fn<(dir: string) => void>()
    const ensureServing = vi.fn<() => void>()
    const busy = busyFlag({ onCrashLoopDue, ensureServing })
    busy.release()
    expect(ensureServing).toHaveBeenCalledTimes(1)
    expect(onCrashLoopDue).not.toHaveBeenCalled()
  })

  it('runs a crash rollback that waited first, and leaves the site to it until it is done', () => {
    const order: string[] = []
    let taken = false
    const busy = busyFlag({
      // As the supervisor's crashLoop does, before its first await.
      onCrashLoopDue: (dir) => {
        order.push(`roll back ${dir}`)
        taken = busy.take()
      },
      ensureServing: () => order.push('ensure serving'),
    })
    busy.deferCrash('/releases/v1.1.0')
    busy.release()
    expect(taken).toBe(true)
    expect(busy.held).toBe(true)
    expect(order).toEqual(['roll back /releases/v1.1.0'])
    // The rollback is done: only now is the site made sure to serve.
    busy.release()
    expect(order).toEqual(['roll back /releases/v1.1.0', 'ensure serving'])
  })

  it('makes sure the site serves when the waiting rollback is not needed any more', () => {
    const order: string[] = []
    // An update replaced the release meanwhile, so nothing takes the flag.
    const busy = busyFlag({
      onCrashLoopDue: (dir) => order.push(`roll back ${dir}`),
      ensureServing: () => order.push('ensure serving'),
    })
    busy.deferCrash('/releases/v1.1.0')
    busy.release()
    expect(busy.held).toBe(false)
    expect(order).toEqual(['roll back /releases/v1.1.0', 'ensure serving'])
  })

  it('runs a waiting rollback once', () => {
    const onCrashLoopDue = vi.fn<(dir: string) => void>()
    const busy = busyFlag({ onCrashLoopDue, ensureServing: vi.fn<() => void>() })
    busy.deferCrash('/releases/v1.1.0')
    busy.release()
    expect(busy.take()).toBe(true)
    busy.release()
    expect(onCrashLoopDue).toHaveBeenCalledTimes(1)
  })
})

describe('a release that keeps stopping while the site starts', () => {
  it('goes back once start-up is done, and nothing starts it again behind the rollback', async () => {
    const crashing = '/releases/v1.1.0'
    const older = '/releases/v1.0.0'
    let clock = 0
    const timers: { at: number; run: () => void }[] = []
    const started: FakeChild[] = []
    const running = new Set<FakeChild>()
    let mostAtOnce = 0
    // The release state.json names as live: the crashing one, until the
    // rollback has the older one answering and records it.
    let recorded = crashing
    // The rollback's port check, between stopping the crashing release and starting the older one.
    const portCheck = Promise.withResolvers<void>()

    // The supervisor's wiring (scripts/serve.mjs), with its rollback cut
    // down to the switch.
    const live = liveServer({
      start: (dir: string) => {
        const child = new FakeChild(dir)
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
      onCrashLoop: (dir: string) => void crashLoop(dir),
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
    const busy = busyFlag({
      onCrashLoopDue: (dir) => {
        if (live.current?.dir === dir) void crashLoop(dir)
      },
      ensureServing,
    })
    function ensureServing() {
      if (busy.held) return
      live.ensure(recorded)
    }
    async function crashLoop(dir: string) {
      if (!busy.take()) {
        busy.deferCrash(dir)
        await live.start(dir)
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
    const advance = (ms: number) => {
      clock += ms
      for (const timer of timers.filter((t) => t.at <= clock)) {
        timers.splice(timers.indexOf(timer), 1)
        timer.run()
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
    // Busy, so it was started again for the moment.
    expect(started.map((child) => child.dir)).toEqual([crashing, crashing, crashing, crashing])
    expect(running.size).toBe(1)

    // Start-up is done. The rollback takes the flag and stops the crashing
    // release; nothing may start it again meanwhile, as an unguarded
    // live.ensure would (nothing is meant to run now).
    busy.release()
    expect(busy.held).toBe(true)
    expect(live.idle()).toBe(true)
    await settle()
    expect(started).toHaveLength(4)
    expect(running.size).toBe(0)

    // The port is free: the older release starts and is recorded, and the
    // flag comes free with the site serving.
    portCheck.resolve()
    await settle()
    expect(started.map((child) => child.dir)).toEqual([crashing, crashing, crashing, crashing, older])
    expect(recorded).toBe(older)
    expect(busy.held).toBe(false)
    expect(running.size).toBe(1)
    expect(mostAtOnce).toBe(1)
  })
})

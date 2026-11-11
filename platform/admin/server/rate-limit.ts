import 'server-only'

/**
 * Attempts counted per key over a sliding window, in memory: one admin, one
 * process, and a restart forgetting the counts only ever helps the person
 * locked out. A sliding window, so nobody gets a fresh allowance at the edge
 * of a fixed one, and the oldest key goes first when a flood of made-up
 * addresses fills the map.
 */
export type RateLimiter = {
  /**
   * Counts an attempt and answers 0, or answers how many seconds until the
   * key may try again without counting anything. The attempt is counted
   * before the work, so a burst of parallel requests is refused at once.
   */
  hit(key: string, now?: number): number
  /** Seconds until the key may try again, 0 when it may try now. */
  retryAfter(key: string, now?: number): number
  /** Takes the latest attempt back off, for one that turned out to be the owner's own. */
  forget(key: string): void
  reset(key: string): void
  size(): number
}

export function rateLimiter({ limit, windowMs, maxKeys = 10_000 }: { limit: number; windowMs: number; maxKeys?: number }): RateLimiter {
  const hits = new Map<string, number[]>()

  const recent = (key: string, now: number) => {
    const times = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
    if (times.length > 0) hits.set(key, times)
    else hits.delete(key)
    return times
  }

  const retryAfter = (key: string, now = Date.now()) => {
    const times = recent(key, now)
    if (times.length < limit) return 0
    return Math.max(1, Math.ceil((times[times.length - limit] + windowMs - now) / 1000))
  }

  return {
    hit(key, now = Date.now()) {
      const wait = retryAfter(key, now)
      if (wait > 0) return wait
      const times = [...recent(key, now), now]
      // Map keeps insertion order, so setting the key again moves it to the
      // end, and the first key is always the one touched longest ago.
      hits.delete(key)
      hits.set(key, times)
      while (hits.size > maxKeys) {
        const oldest = hits.keys().next().value
        if (oldest === undefined) break
        hits.delete(oldest)
      }
      return 0
    },
    retryAfter,
    forget(key) {
      const times = hits.get(key)
      if (!times) return
      times.pop()
      if (times.length === 0) hits.delete(key)
    },
    reset(key) {
      hits.delete(key)
    },
    size: () => hits.size,
  }
}

/** Runs at most `limit` tasks at once. A task over the limit is not run, and gives null. */
export function atMost(limit: number) {
  let running = 0
  return async function run<T>(task: () => Promise<T>): Promise<T | null> {
    if (running >= limit) return null
    running++
    try {
      return await task()
    } finally {
      running--
    }
  }
}

const fifteenMinutes = 15 * 60_000
const anHour = 60 * 60_000

/**
 * A sign-in from a browser with no device cookie the site signed counts
 * against its address and against everyone's limit, which anyone can fill.
 * One with a device cookie (device.ts) counts against that browser alone, so
 * a flood that fills everyone's limit cannot keep the owner out.
 */
export type AdminLimits = {
  /** Sign-ins per address: 5 every 15 minutes. */
  perAddress: RateLimiter
  /** Sign-ins from everyone together: 30 every 15 minutes. */
  everyone: RateLimiter
  /** Sign-ins from one browser that signed in before: 5 every 15 minutes, so a stolen device cookie cannot guess fast. */
  perDevice: RateLimiter
  /** Password checks at once: 2, since each holds 32 MB while scrypt works. */
  check: ReturnType<typeof atMost>
  /** Presses of "Copy the new updater": one does it, so 10 an hour stops a page or script stuck in a loop. */
  adopt: RateLimiter
}

// On globalThis, because Next may load this module more than once in one
// server, and every copy must share the same counts.
export const adminLimitsKey = Symbol.for('wslatl.admin.limits')
const store = globalThis as typeof globalThis & { [adminLimitsKey]?: AdminLimits }

export function adminLimits(): AdminLimits {
  store[adminLimitsKey] ??= {
    perAddress: rateLimiter({ limit: 5, windowMs: fifteenMinutes }),
    everyone: rateLimiter({ limit: 30, windowMs: fifteenMinutes }),
    perDevice: rateLimiter({ limit: 5, windowMs: fifteenMinutes }),
    check: atMost(2),
    adopt: rateLimiter({ limit: 10, windowMs: anHour }),
  }
  return store[adminLimitsKey]
}

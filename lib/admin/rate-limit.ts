import 'server-only'

/**
 * Fixed-window counters, kept in memory: one admin, one process, and a
 * restart forgetting the counts is fine. Each attempt is counted before the
 * password is checked, so a burst of parallel requests is refused at once
 * instead of each starting a 32 MB scrypt first.
 */
export function rateLimiter({ limit, windowMs, maxKeys = 10_000 }: { limit: number; windowMs: number; maxKeys?: number }) {
  const windows = new Map<string, { count: number; resetAt: number }>()

  function forgetOld(now: number) {
    for (const [key, window] of windows) if (window.resetAt <= now) windows.delete(key)
    // Still full (a flood of made-up addresses): drop the oldest. Map keeps
    // insertion order.
    for (const key of windows.keys()) {
      if (windows.size < maxKeys) break
      windows.delete(key)
    }
  }

  return {
    /** Counts an attempt. False when the key has used up its window. */
    hit(key: string, now = Date.now()): boolean {
      const window = windows.get(key)
      if (!window || window.resetAt <= now) {
        if (windows.size >= maxKeys) forgetOld(now)
        windows.set(key, { count: 1, resetAt: now + windowMs })
        return true
      }
      if (window.count >= limit) return false
      window.count++
      return true
    },
    reset(key: string) {
      windows.delete(key)
    },
    retryAfterSeconds(key: string, now = Date.now()): number {
      const window = windows.get(key)
      return window ? Math.max(1, Math.ceil((window.resetAt - now) / 1000)) : 0
    },
    size: () => windows.size,
  }
}

/** Runs at most `limit` tasks at once; a task over the limit is not run and gives null. */
export function oneAtATime(limit: number) {
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

const fifteenMinutes = 15 * 60 * 1000

type LoginLimits = {
  perIp: ReturnType<typeof rateLimiter>
  overall: ReturnType<typeof rateLimiter>
  check: ReturnType<typeof oneAtATime>
}

// On globalThis, because Next may load this module more than once in one
// server, and every copy must share the same counts.
export const loginLimitsKey = Symbol.for('wslatl.admin.loginLimits')
const store = globalThis as typeof globalThis & { [loginLimitsKey]?: LoginLimits }

/** 5 attempts per address and 30 in all per 15 minutes, and 2 password checks at a time. */
export function loginLimits(): LoginLimits {
  store[loginLimitsKey] ??= {
    perIp: rateLimiter({ limit: 5, windowMs: fifteenMinutes }),
    overall: rateLimiter({ limit: 30, windowMs: fifteenMinutes }),
    check: oneAtATime(2),
  }
  return store[loginLimitsKey]
}

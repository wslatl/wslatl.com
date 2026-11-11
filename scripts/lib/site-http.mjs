// Fetch helpers shared by the scripts that check a running copy of the site
// (check-site.mjs, check-seo.mjs).

/** A fetch that resolves paths against `base`, retries once, and gives up after 20 seconds. */
export function makeGet(base) {
  return async function get(path, redirect = 'manual') {
    const url = new URL(path, base)
    for (let attempt = 1; ; attempt++) {
      try {
        return await fetch(url, { redirect, signal: AbortSignal.timeout(20_000) })
      } catch (error) {
        // One retry covers a dropped connection; a second failure is real.
        if (attempt === 2) throw new Error(`${url.pathname}: ${error.cause?.code ?? error.message}`, { cause: error })
      }
    }
  }
}

/**
 * Runs fn over items, a few at a time, so the site sees a gentle trickle. An
 * item whose request fails goes to onError and the rest carry on, so one
 * dropped connection is reported as that one page rather than replacing every
 * result in the group with a single error.
 */
export async function eachLimited(items, fn, onError, limit = 6) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (queue.length) {
        const item = queue.shift()
        try {
          await fn(item)
        } catch (error) {
          onError(item, error)
        }
      }
    }),
  )
}

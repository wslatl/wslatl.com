// Shared by the Updates page and the update panel, on the server and in the
// browser. The time zone is fixed, so both render the same text.
const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Chicago',
})

export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : `${dateTime.format(date)} CT`
}

export const shortSha = (sha: string) => sha.slice(0, 7)

/**
 * A Retry-After header in words, rounded up: "15 minutes" for 900, "2
 * seconds" for 2. Null when it holds no number of seconds (the sign-in route
 * always sends one, but a proxy in between may not).
 */
export function formatWait(retryAfter: string | null): string | null {
  const seconds = Number(retryAfter)
  if (!retryAfter || !Number.isFinite(seconds) || seconds <= 0) return null
  if (seconds < 60) {
    const whole = Math.ceil(seconds)
    return whole === 1 ? '1 second' : `${whole} seconds`
  }
  const minutes = Math.ceil(seconds / 60)
  return minutes === 1 ? '1 minute' : `${minutes} minutes`
}

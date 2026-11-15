// Shared by the Updates page and the update panel, on the server and in the
// browser. The time zone is fixed (../text.ts), so both render the same text.
import { englishText, type AdminText } from '../text'

/** A time as the admin shows it, in its language and US Central time: "Nov 2, 2026, 9:00 AM CT" in English. */
export function formatWhen(iso: string | null | undefined, t: AdminText = englishText): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : t('time.when', { at: date })
}

export const shortSha = (sha: string) => sha.slice(0, 7)

/**
 * A Retry-After header in words, rounded up: "15 minutes" for 900, "2
 * seconds" for 2, in English unless another language's words are given.
 * Null when it holds no number of seconds (the sign-in route always sends
 * one, but a proxy in between may not).
 */
export function formatWait(retryAfter: string | null, t: AdminText = englishText): string | null {
  const seconds = Number(retryAfter)
  if (!retryAfter || !Number.isFinite(seconds) || seconds <= 0) return null
  if (seconds < 60) return t('time.seconds', { count: Math.ceil(seconds) })
  return t('time.minutes', { count: Math.ceil(seconds / 60) })
}

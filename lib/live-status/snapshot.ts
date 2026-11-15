import { locations, type LocationId } from '@/data/locations'

/**
 * What /live-status.json answers, and what the home page's live panel reads
 * from it. Both sides use this file: the route builds the answer from the
 * status page (lib/live-status/source.ts), and the browser checks it here
 * before showing any of it.
 *
 * Only our own words go out: a state per location from the list below and
 * the time of the check. Nothing the status page wrote (monitor names,
 * error messages, addresses) is ever passed on.
 *
 * The functions take the locations to look for, data/locations.ts unless
 * told otherwise, so tests can try them with as many as they like.
 */

/** Where the browser asks. The route is app/live-status.json/route.ts. */
export const liveStatusPath = '/live-status.json'

/**
 * A location's state, as the status page's own overall rule works it out
 * for the servers it lists there (lib/live-status/kuma.ts):
 *
 * up:          every server answered its last check.
 * partial:     some servers did not, or a check failed and is being retried.
 * down:        none did.
 * maintenance: the status page has the location in a maintenance window.
 * unknown:     no recent check to go by, so nothing is claimed.
 */
export const locationStates = ['up', 'partial', 'down', 'maintenance', 'unknown'] as const

export type LocationState = (typeof locationStates)[number]

export interface LiveStatus {
  /**
   * When the oldest of the checks behind the states was made, as an ISO
   * 8601 time: every state shown is at least this recent. Null when there
   * is no check to go by.
   */
  checkedAt: string | null
  locations: Record<LocationId, LocationState>
}

/** The locations to look for, by id. */
type Places = readonly { id: LocationId }[]

/** The answer when nothing is known: every location unknown, and no time. */
export function unknownStatus(places: Places = locations): LiveStatus {
  return {
    checkedAt: null,
    locations: Object.fromEntries(places.map((place) => [place.id, 'unknown'])) as Record<LocationId, LocationState>,
  }
}

/** True when at least one location has a state that is not unknown. */
export function hasLiveData(status: LiveStatus): boolean {
  return Object.values(status.locations).some((state) => state !== 'unknown')
}

const isState = (value: unknown): value is LocationState =>
  typeof value === 'string' && (locationStates as readonly string[]).includes(value)

/** An ISO 8601 time, the only shape the route writes. */
const isoTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/

/**
 * The answer, checked, or null when it is not one: anything that is not an
 * object of the right shape, a time that is not one, a state that is not on
 * the list. A location missing from it is unknown, and anything it holds
 * beyond the locations looked for is left out.
 */
export function readLiveStatus(value: unknown, places: Places = locations): LiveStatus | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  const { checkedAt, locations: states } = value as Record<string, unknown>
  if (checkedAt !== null && (typeof checkedAt !== 'string' || !isoTime.test(checkedAt) || Number.isNaN(Date.parse(checkedAt)))) {
    return null
  }
  if (typeof states !== 'object' || states === null || Array.isArray(states)) return null
  const status = unknownStatus(places)
  for (const place of places) {
    if (!Object.hasOwn(states, place.id)) continue
    const state = (states as Record<string, unknown>)[place.id]
    if (!isState(state)) return null
    status.locations[place.id] = state
  }
  // A state needs a time behind it: without one, nothing is claimed.
  if (checkedAt === null && hasLiveData(status)) return null
  return { ...status, checkedAt }
}

/** How long the browser waits for the route before it shows the panel without live status. */
export const browserTimeoutMs = 6000

/**
 * Asks the route, from the browser. Null when the answer is missing, late,
 * not JSON or not the right shape, so the panel shows its prices without
 * live status rather than anything made up.
 */
export async function loadLiveStatus(fetchImpl: typeof fetch, places: Places = locations, timeoutMs = browserTimeoutMs): Promise<LiveStatus | null> {
  try {
    const response = await fetchImpl(liveStatusPath, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!response.ok) return null
    return readLiveStatus(await response.json(), places)
  } catch {
    return null
  }
}

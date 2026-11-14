import { locations } from '@/data/locations'
import { unknownStatus, type LiveStatus, type LocationState } from '@/lib/live-status/snapshot'

/**
 * Reads the two public answers of the status page, which is Uptime Kuma
 * today: /api/status-page/<slug> lists the groups and the monitors in each,
 * and /api/status-page/heartbeat/<slug> holds each monitor's recent checks.
 * Pure: the same two answers and the same time always give the same states,
 * so tests/live-status.test.ts can feed it any shape at all.
 *
 * Everything in them is treated as untrusted: names are only compared,
 * never passed on, and anything not of the expected shape counts as no data.
 */

/** Kuma's states for one check (src/util.ts in Uptime Kuma). */
const kuma = { down: 0, up: 1, pending: 2, maintenance: 3 } as const

/**
 * The oldest a check may be and still count. Kuma checks every server once a
 * minute, so a check older than this means checks have stopped (the status
 * page itself may be down), and the location is unknown rather than shown
 * as it was then.
 */
export const maxCheckAgeMs = 5 * 60_000

/** One server's last check: its Kuma state, and when it ran, in ms since 1970. */
interface Check {
  status: number
  at: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Group names as the page shows them: Kuma keeps a trailing newline ("Main Infrastructure\n"). */
const sameName = (a: string, b: string) => a.replace(/\s+/g, ' ').trim().toLowerCase() === b.replace(/\s+/g, ' ').trim().toLowerCase()

/**
 * Kuma's time for a check, "2026-11-14 21:03:37", which is UTC, or the same
 * as ISO 8601 with a zone. Null for anything else.
 */
export function parseCheckTime(text: unknown): number | null {
  if (typeof text !== 'string' || text.length > 40) return null
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})?$/.exec(text)
  if (!match) return null
  const [, date, time, fraction = '', zone = 'Z'] = match
  const at = Date.parse(`${date}T${time}${fraction.slice(0, 4)}${zone}`)
  return Number.isFinite(at) ? at : null
}

/** The monitor ids in each group that has one of the names asked for, by that name. */
function monitorsByGroup(page: unknown, names: readonly string[]): Map<string, number[]> | null {
  if (!isRecord(page) || !Array.isArray(page.publicGroupList)) return null
  const found = new Map<string, number[]>()
  for (const group of page.publicGroupList) {
    if (!isRecord(group) || typeof group.name !== 'string' || !Array.isArray(group.monitorList)) continue
    const name = names.find((wanted) => sameName(wanted, group.name as string))
    if (name === undefined) continue
    const ids = group.monitorList.flatMap((monitor) =>
      isRecord(monitor) && Number.isSafeInteger(monitor.id) ? [monitor.id as number] : [],
    )
    found.set(name, [...(found.get(name) ?? []), ...ids])
  }
  return found
}

/** A monitor's latest check that reads as one, or null when it has none. */
function latestCheck(heartbeats: Record<string, unknown>, id: number): Check | null {
  const key = String(id)
  if (!Object.hasOwn(heartbeats, key)) return null
  const list = heartbeats[key]
  if (!Array.isArray(list)) return null
  let latest: Check | null = null
  for (const beat of list) {
    if (!isRecord(beat) || !Number.isSafeInteger(beat.status)) continue
    const at = parseCheckTime(beat.time)
    if (at !== null && (!latest || at > latest.at)) latest = { status: beat.status as number, at }
  }
  return latest
}

/**
 * One location's state from its servers' last checks, by Kuma's own rule
 * for its overall status (src/pages/StatusPage.vue): a server in
 * maintenance makes it maintenance; otherwise it is up when every server is
 * up, down when none is, and partial in between. A server whose last check
 * is too old counts as unknown: alone, it leaves the location unknown, as a
 * location is only up when every server is known to be.
 */
function stateOf(checks: (Check | null)[], now: number): { state: LocationState; oldest: number | null } {
  const recent = checks.filter((check): check is Check => check !== null && Math.abs(now - check.at) <= maxCheckAgeMs)
  // Servers that have been checked, but not lately. A monitor with no
  // checks at all is new or paused, and Kuma leaves it out too.
  const late = checks.filter((check) => check !== null).length - recent.length
  if (recent.length === 0) return { state: 'unknown', oldest: null }
  const oldest = Math.min(...recent.map((check) => check.at))
  if (recent.some((check) => check.status === kuma.maintenance)) return { state: 'maintenance', oldest }
  const up = recent.filter((check) => check.status === kuma.up).length
  if (up === recent.length) return late > 0 ? { state: 'unknown', oldest: null } : { state: 'up', oldest }
  if (up === 0 && late === 0) return { state: 'down', oldest }
  return { state: 'partial', oldest }
}

/**
 * The states of our locations (data/locations.ts) from the status page's
 * two answers, at time `now`. Null when either answer is not the shape Kuma
 * gives, which the caller treats as no data at all. A location whose group
 * is not on the page, or has no recent check, is unknown.
 */
export function statusFromKuma(page: unknown, heartbeats: unknown, now: number): LiveStatus | null {
  const groups = monitorsByGroup(page, locations.map((location) => location.statusGroup))
  if (!groups || !isRecord(heartbeats) || !isRecord(heartbeats.heartbeatList)) return null
  const beats = heartbeats.heartbeatList
  const status = unknownStatus()
  let oldest: number | null = null
  for (const location of locations) {
    const ids = groups.get(location.statusGroup) ?? []
    const { state, oldest: checked } = stateOf(
      ids.map((id) => latestCheck(beats, id)),
      now,
    )
    status.locations[location.id] = state
    if (checked !== null) oldest = oldest === null ? checked : Math.min(oldest, checked)
  }
  return { ...status, checkedAt: oldest === null ? null : new Date(oldest).toISOString() }
}

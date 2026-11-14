/**
 * status.wslatl.com's two public answers, in the shape Uptime Kuma gave them
 * on 2026-11-14 (/api/status-page/wslatl and /api/status-page/heartbeat/wslatl),
 * with the same groups and monitors. Tests build on these rather than on a
 * copy of a live answer, so each one says exactly what it changes.
 */
export const kumaPage = {
  config: {
    slug: 'wslatl',
    title: 'WSLATL LLC',
    description: null,
    icon: '/upload/logo1.png?t=1780171383252',
    autoRefreshInterval: 300,
    theme: 'auto',
    published: true,
    showTags: false,
    customCSS: 'body {\n  \n}\n',
    footerText: null,
    showPoweredBy: true,
    showCertificateExpiry: false,
    showOnlyLastHeartbeat: false,
  },
  incidents: [],
  publicGroupList: [
    {
      id: 2,
      // Kuma keeps the newline typed into the group's name.
      name: 'Main Infrastructure\n',
      weight: 1,
      monitorList: [
        { id: 7, name: 'Main Infrastructure', sendUrl: 0, type: 'group' },
        { id: 10, name: 'Game Panel', sendUrl: 0, type: 'http' },
        { id: 8, name: 'VPS Panel', sendUrl: 0, type: 'http' },
      ],
    },
    {
      id: 3,
      name: 'New York City',
      weight: 2,
      monitorList: [
        { id: 4, name: 'New York City Metro - Budget', sendUrl: 0, type: 'group' },
        { id: 5, name: 'NYC-1', sendUrl: 0, type: 'port' },
        { id: 6, name: 'NYC-1 GAME', sendUrl: 0, type: 'port' },
      ],
    },
    {
      id: 4,
      name: 'Los Angeles',
      weight: 3,
      monitorList: [
        { id: 2, name: 'Los Angeles - Premium', sendUrl: 0, type: 'group' },
        { id: 1, name: 'LA-1', sendUrl: 0, type: 'port' },
        { id: 3, name: 'LA-1 GAME NODE', sendUrl: 0, type: 'port' },
      ],
    },
  ],
  maintenanceList: [],
}

/** The monitors in each location's group, the group's own monitor first. */
export const monitorsAt = { 'los-angeles': [2, 1, 3], 'new-york': [4, 5, 6] } as const

/** Kuma's states for one check. */
export const DOWN = 0
export const UP = 1
export const PENDING = 2
export const MAINTENANCE = 3

/** A time as Kuma writes a check's: UTC, with no zone. */
export const kumaTime = (ms: number) => new Date(ms).toISOString().slice(0, 19).replace('T', ' ')

/** 21:03:37 UTC on 14 November 2026, the last check in the answer this copies. */
export const now = Date.UTC(2026, 10, 14, 21, 3, 37)

export interface Beat {
  status: number
  time: string
  msg: string
  ping: number | null
}

/**
 * A heartbeat answer as of `at`: a hundred checks a minute apart for every
 * monitor, oldest first as Kuma lists them, the last one at `at` with the
 * state `last` gives (up unless it says otherwise).
 */
export function kumaHeartbeats(at = now, last: (id: number) => number = () => UP) {
  const ids = [1, 2, 3, 4, 5, 6, 7, 8, 10]
  const beats = (id: number): Beat[] =>
    Array.from({ length: 100 }, (_, i) => ({
      status: i === 99 ? last(id) : UP,
      time: kumaTime(at - (99 - i) * 60_000),
      msg: '',
      ping: 9,
    }))
  return {
    heartbeatList: Object.fromEntries(ids.map((id) => [String(id), beats(id)])) as Record<string, Beat[]>,
    uptimeList: Object.fromEntries(ids.map((id) => [`${id}_24`, 1])),
  }
}

/** A deep copy to change one thing in. */
export const copyOf = <T>(value: T): T => structuredClone(value)

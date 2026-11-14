'use client'

import { createContext, use, useEffect, useState } from 'react'
import { CircleDashed } from 'lucide-react'
import type { LocationId } from '@/data/locations'
import { hasLiveData, loadLiveStatus, locationStates, type LiveStatus, type LocationState } from '@/lib/live-status/snapshot'
import { cn, fill } from '@/lib/utils'
import { StatusBadge, type StatusTone } from '@/platform/components/status-badge'

/**
 * The only part of the home page's first screen that runs in the browser:
 * it asks /live-status.json once the page is up, again every minute while
 * the page is in view, and puts each location's state into the panel
 * (components/sections/live-panel.tsx).
 *
 * The prerendered page already keeps the room every state can take: each
 * slot holds every word it can show, one on top of the other, and all but
 * the one that applies are hidden. So nothing moves when the answer arrives,
 * in any language. Until then, and when there is no answer, the slots stay
 * empty and the note says so; nothing spins and nothing is made up.
 */

export type LiveState =
  /** Not asked yet: the prerendered page, and the page without JavaScript. */
  | { phase: 'waiting' }
  /** An answer with at least one location's state. */
  | { phase: 'live'; status: LiveStatus }
  /** No answer, a late one, or one with nothing in it. */
  | { phase: 'missing' }

const LiveStatusContext = createContext<LiveState>({ phase: 'waiting' })

/** How often an open page asks again. The route itself asks the status page at most once a minute. */
export const refreshMs = 60_000

/** What an answer means for the panel. */
export function liveStateOf(status: LiveStatus | null): LiveState {
  return status && hasLiveData(status) ? { phase: 'live', status } : { phase: 'missing' }
}

export function LiveStatusProvider({ initial = { phase: 'waiting' }, children }: { initial?: LiveState; children: React.ReactNode }) {
  const [state, setState] = useState<LiveState>(initial)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const status = await loadLiveStatus(window.fetch.bind(window))
      if (mounted) setState(liveStateOf(status))
    }
    void load()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load()
    }, refreshMs)
    return () => {
      mounted = false
      window.clearInterval(timer)
    }
  }, [])

  return <LiveStatusContext value={state}>{children}</LiveStatusContext>
}

const tones: Record<Exclude<LocationState, 'unknown'>, StatusTone> = {
  up: 'success',
  partial: 'warning',
  down: 'danger',
  maintenance: 'info',
}

/**
 * One location's state: the kit's status badge, colour, icon and word.
 * "No data" only when other locations have a state and this one does not;
 * when nothing came, the note under the panel says so once instead.
 */
export function LocationStatus({ location, labels }: { location: LocationId; labels: Record<LocationState, string> }) {
  const live = use(LiveStatusContext)
  const shown = live.phase === 'live' ? live.status.locations[location] : null

  return (
    <span data-live-status={location} className="grid shrink-0 justify-items-end">
      {locationStates.map((state) => (
        <span key={state} data-state={state} className={cn('col-start-1 row-start-1 flex h-6 items-center', state !== shown && 'invisible')}>
          {state === 'unknown' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
              <CircleDashed aria-hidden="true" className="size-3.5" />
              {labels.unknown}
            </span>
          ) : (
            <StatusBadge tone={tones[state]} className="whitespace-nowrap">
              {labels[state]}
            </StatusBadge>
          )}
        </span>
      ))}
    </span>
  )
}

/** The time of a check, as the visitor's clock shows it, in the page's language. */
export function checkTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}

/**
 * The line under the panel: when the states were checked, or that there are
 * none to show. Both take the same room from the start, the longer of the
 * two, so the line never changes height.
 */
export function CheckedNote({ locale, labels }: { locale: string; labels: { checkedAt: string; unavailable: string } }) {
  const live = use(LiveStatusContext)
  const checkedAt = live.phase === 'live' ? live.status.checkedAt : null

  return (
    <span data-live-note="" className="grid">
      <span className={cn('col-start-1 row-start-1', live.phase !== 'missing' && 'invisible')}>{labels.unavailable}</span>
      <span className={cn('col-start-1 row-start-1', checkedAt === null && 'invisible')}>
        {checkedAt !== null && fill(labels.checkedAt, { time: checkTime(checkedAt, locale) })}
      </span>
    </span>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Circle, CircleCheck, CircleMinus, CircleX, LoaderCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatWhen, shortSha } from '@/components/admin/format'
import { Notice, type Tone } from '@/components/admin/notice'
import type { StepId, StepState, UpdaterState, UpdaterStatus } from '@/lib/admin/updater'
import { cn } from '@/lib/utils'

// Types only from lib/admin: it is server-only, so this list repeats the
// supervisor's (scripts/updater/lib.mjs).
const busyStatuses: UpdaterState['status'][] = ['downloading', 'installing', 'building', 'checking', 'swapping']

const steps: { id: StepId; label: string; detail: string }[] = [
  { id: 'download', label: 'Download', detail: 'The release, from GitHub' },
  { id: 'install', label: 'Install', detail: 'npm ci, in a new folder' },
  { id: 'build', label: 'Build', detail: 'npm run build, keeping old assets' },
  { id: 'prune', label: 'Clean up', detail: 'Tests, dev configs and dev packages removed' },
  { id: 'check', label: 'Trial start', detail: 'Must answer before anything changes' },
  { id: 'switch', label: 'Switch', detail: 'Restart on the new build, or roll back' },
]

/** Each step's state as an icon and a word, both in the state's colour. */
const stepLooks: Record<StepState, { word: string; text: string; icon: React.ReactNode }> = {
  pending: { word: 'Waiting', text: 'text-muted-foreground', icon: <Circle aria-hidden="true" /> },
  running: { word: 'Running', text: 'text-link', icon: <LoaderCircle aria-hidden="true" className="animate-spin" /> },
  done: { word: 'Done', text: 'text-success', icon: <CircleCheck aria-hidden="true" /> },
  failed: { word: 'Failed', text: 'text-danger', icon: <CircleX aria-hidden="true" /> },
  skipped: { word: 'Skipped', text: 'text-muted-foreground', icon: <CircleMinus aria-hidden="true" /> },
}

/** How the last update ended. idle is an update that finished without an error, whether it installed anything or not. */
function outcome(status: UpdaterState['status']): { tone: Tone; title: string } {
  if (status === 'failed') return { tone: 'danger', title: 'Failed' }
  if (status === 'rolled-back') return { tone: 'warning', title: 'Rolled back' }
  return { tone: 'success', title: 'Done' }
}

/** The most of the log shown at once. */
const shownLines = 60

const isBusy = (status: UpdaterStatus) =>
  status.pending || (status.state !== null && busyStatuses.includes(status.state.status))

function Steps({ values }: { values: UpdaterState['steps'] }) {
  // Only the steps the supervisor reports. It runs from the uploaded folder
  // and may be older than this dashboard ("The updater itself changed"): one
  // from before the Clean up step never writes it, and showing it as Waiting
  // after a finished update would be wrong.
  const reported = steps.filter((step) => step.id in values)
  return (
    <ol aria-label="Update steps" className="mt-4 divide-y overflow-hidden rounded-lg border bg-background">
      {reported.map((step) => {
        const value = values[step.id]
        const look = stepLooks[value]
        return (
          <li
            key={step.id}
            aria-current={value === 'running' ? 'step' : undefined}
            className={cn('flex items-center gap-3 px-4 py-3', value === 'running' && 'bg-link/5')}
          >
            <span className={cn('shrink-0 [&_svg]:size-5', look.text)}>{look.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{step.label}</span>
              <span className="block text-xs text-muted-foreground">{step.detail}</span>
            </span>
            <span className={cn('shrink-0 text-xs font-semibold', look.text)}>{look.word}</span>
          </li>
        )
      })}
    </ol>
  )
}

function Log({ lines, open }: { lines: string[]; open: boolean }) {
  const shown = lines.slice(-shownLines)
  const count =
    lines.length > shown.length ? `Last ${shown.length} of ${lines.length} lines` : lines.length === 1 ? '1 line' : `${lines.length} lines`
  return (
    <details open={open} className="group mt-4 rounded-lg border bg-background">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
        Updater log
        <span className="ml-auto text-xs font-normal text-muted-foreground">{count}</span>
      </summary>
      {/* Laid out from the bottom (flex-col-reverse), so the newest line, or the error an update stopped on, is
          what shows, and new lines stay in view as they arrive. */}
      <pre
        // Focusable so the keyboard can scroll a long log.
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="flex max-h-80 flex-col-reverse overflow-auto border-t px-4 py-3 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-foreground/90"
      >
        <span>{shown.join('\n')}</span>
      </pre>
    </details>
  )
}

/**
 * `offer` is the release to install, or null when there is none to offer
 * (up to date, nothing published, an older or malformed release); `blocked`
 * then labels the button. `summary` says where the site stands against
 * GitHub's latest release, or is null when GitHub could not be read.
 */
export function UpdatePanel({
  initial,
  offer,
  blocked,
  summary,
}: {
  initial: UpdaterStatus
  offer: string | null
  blocked: string
  summary: string | null
}) {
  const [status, setStatus] = useState(initial)
  const [watching, setWatching] = useState(isBusy(initial))
  const [restarting, setRestarting] = useState(false)
  const [notice, setNotice] = useState<{ tone: Tone; title: string; text: string } | null>(null)
  const busy = isBusy(status)
  const state = status.state

  useEffect(() => {
    if (!watching) return
    let stopped = false
    const timer = setInterval(async () => {
      try {
        const response = await fetch('/admin/api/update', { cache: 'no-store' })
        if (stopped) return
        if (response.status === 401) {
          setNotice({ tone: 'danger', title: 'Signed out', text: 'Your session ran out. Sign in again to see how the update went.' })
          setWatching(false)
          return
        }
        // While the server restarts, Cloudflare answers 502 or the
        // connection drops. Both mean: keep waiting.
        if (!response.ok) throw new Error(String(response.status))
        const next: UpdaterStatus = await response.json()
        if (stopped) return
        setRestarting(false)
        setStatus(next)
        if (!isBusy(next)) {
          setWatching(false)
          // Show the new deployed commit, which the server renders.
          if (next.state?.status === 'idle') setTimeout(() => window.location.reload(), 1500)
        }
      } catch {
        if (!stopped) setRestarting(true)
      }
    }, 2000)
    return () => {
      stopped = true
      clearInterval(timer)
    }
  }, [watching])

  async function update() {
    setNotice(null)
    try {
      const response = await fetch('/admin/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const body = await response.json().catch(() => ({}))
      if (response.status === 401) {
        setNotice({ tone: 'danger', title: 'Signed out', text: 'Your session ran out. Sign in again.' })
        return
      }
      if (!response.ok && response.status !== 409) {
        setNotice({ tone: 'danger', title: 'Could not start', text: body.error ?? `The update could not start (${response.status}).` })
        return
      }
      if (response.status === 409) {
        setNotice({ tone: 'info', title: 'Already running', text: body.error ?? 'An update is already running.' })
      }
      setStatus((current) => ({ ...current, pending: true }))
      setWatching(true)
    } catch {
      setNotice({ tone: 'danger', title: 'No answer', text: 'Could not reach the server.' })
    }
  }

  const showSteps = state !== null && (busy || state.startedAt !== null)
  const waiting = status.pending && !busyStatuses.includes(state?.status ?? 'idle')
  const ended =
    state && state.message && !busy ? { ...outcome(state.status), message: state.message, at: formatWhen(state.finishedAt) } : null

  return (
    <section aria-labelledby="update-heading" className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-1 basis-64">
          <h2 id="update-heading" className="text-base font-semibold">
            Update the site
          </h2>
          {/* Where the site stands against GitHub, which a running update is about to change. */}
          {summary && !busy && <p className="mt-1.5 text-sm">{summary}</p>}
          <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
            Builds the release beside the live site and switches only once it starts. If anything fails, the site
            stays as it is.
          </p>
        </div>
        <Button onClick={update} disabled={!status.available || busy || !offer} variant={offer ? 'default' : 'outline'}>
          <RefreshCw aria-hidden="true" className={busy ? 'animate-spin' : undefined} />
          {busy ? 'Updating' : offer ? `Install ${offer}` : blocked}
        </Button>
      </div>

      {!status.available && (
        <Notice tone="warning" title="Updates are off here" className="mt-4">
          The site was not started with <code className="font-mono">npm run serve</code>, so it cannot update itself.
          See the README, section &ldquo;Admin and updates&rdquo;.
        </Notice>
      )}

      {state?.updaterChanged && (
        <Notice tone="warning" title="The updater itself changed" className="mt-4">
          This release changes the updater, which keeps running from the uploaded folder. Copy{' '}
          <code className="font-mono">serve.mjs</code> and the <code className="font-mono">updater</code> folder from{' '}
          <code className="font-mono break-all">.updater/releases/{state.current?.tag}/scripts/</code> into the
          server&rsquo;s <code className="font-mono">scripts/</code> folder, then restart the server. The README,
          &ldquo;Admin and updates&rdquo;, has the steps.
        </Notice>
      )}

      <div aria-live="polite" className="mt-4 space-y-2 empty:mt-0">
        {notice && (
          <Notice tone={notice.tone} title={notice.title}>
            {notice.text}
          </Notice>
        )}
        {waiting && (
          <Notice tone="info" busy>
            Waiting for the updater to pick up the request.
          </Notice>
        )}
        {restarting && (
          <Notice tone="info" busy>
            The site is restarting. Waiting for it to answer.
          </Notice>
        )}
        {state?.target && busy && (
          <Notice
            tone="info"
            busy
            title={
              <>
                Installing <span className="font-mono">{state.target.tag}</span>
              </>
            }
          >
            Commit <span className="font-mono">{shortSha(state.target.sha)}</span>
          </Notice>
        )}
        {ended && (
          <Notice tone={ended.tone} title={ended.title}>
            {ended.message}
            {ended.at && <span className="text-muted-foreground"> ({ended.at})</span>}
          </Notice>
        )}
      </div>

      {showSteps && <Steps values={state.steps} />}
      {state && state.log.length > 0 && (
        // Open while an update runs, and after one that failed or went back, to show why.
        <Log lines={state.log} open={busy || state.status !== 'idle'} />
      )}
    </section>
  )
}

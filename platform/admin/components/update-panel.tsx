'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Circle, CircleCheck, CircleMinus, CircleX, LoaderCircle, RefreshCw } from 'lucide-react'
import type { StepId, StepState, UpdaterState, UpdaterStatus } from '../server/updater'
import { Button } from '../../components/button'
import { cn } from '../../lib/cn'
import { formatWhen, shortSha } from './format'
import { Notice, type Tone } from './notice'

// Types only from ../server: it never reaches the browser, so this list
// repeats restingStatuses from ../server/updater.ts.
const resting = ['idle', 'failed', 'rolled-back']

const steps: { id: StepId; label: string; detail: string }[] = [
  { id: 'download', label: 'Download', detail: 'The release, from GitHub' },
  { id: 'install', label: 'Install', detail: 'npm ci, in a new folder' },
  { id: 'build', label: 'Build', detail: 'npm run build, keeping old assets' },
  { id: 'prune', label: 'Clean up', detail: 'Tests, dev configs and dev packages removed' },
  { id: 'migrate', label: 'Database', detail: 'A backup first, then the database changes' },
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

const running = (state: UpdaterState | null) => state !== null && !resting.includes(state.status)
const isBusy = (status: UpdaterStatus) => status.pending || running(status.state)

function Steps({ values }: { values: UpdaterState['steps'] }) {
  // Only the steps the supervisor reports. It runs from the uploaded folder
  // and may be older than this page ("The updater itself changed"): one from
  // before the Clean up step never writes it, and showing it as Waiting after
  // a finished update would be wrong.
  const reported = steps.filter((step) => values[step.id] !== undefined)
  return (
    <ol aria-label="Update steps" className="mt-4 divide-y overflow-hidden rounded-lg border bg-background">
      {reported.map((step) => {
        const value = values[step.id] as StepState
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
 * A release changed the updater, which keeps running from the uploaded
 * folder until its files are copied over: the button does that
 * (../server/adopt-updater.ts), and the new files are used from the next
 * restart. This notice goes when the supervisor sees they match, at that
 * restart.
 */
function UpdaterChanged({ tag, mayUpdate }: { tag?: string; mayUpdate: boolean }) {
  const [phase, setPhase] = useState<'ready' | 'copying' | 'copied'>('ready')
  const [error, setError] = useState('')

  async function copyOver() {
    setPhase('copying')
    setError('')
    try {
      const response = await fetch('/admin/api/adopt-updater', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      if (response.ok) {
        setPhase('copied')
        return
      }
      const body = await response.json().catch(() => ({}))
      setError(
        response.status === 401
          ? 'Your session ran out. Sign in again.'
          : typeof body.error === 'string'
            ? body.error
            : `It could not be copied (${response.status}).`,
      )
    } catch {
      setError('Could not reach the server.')
    }
    setPhase('ready')
  }

  if (phase === 'copied') {
    return (
      <Notice tone="success" title="Updater copied" className="mt-4">
        Now restart the server from the panel to finish. This message goes away after the restart.
      </Notice>
    )
  }
  return (
    <Notice tone="warning" title="The updater itself changed" className="mt-4">
      This release changes the updater, which keeps running from the uploaded folder. Press the button to copy the new
      one over from <code className="font-mono break-all">.updater/releases/{tag}/scripts/</code>, then restart the
      server from the panel.
      {error && <span className="mt-2 block font-medium text-danger">{error}</span>}
      {mayUpdate && (
        <Button onClick={copyOver} disabled={phase === 'copying'} size="sm" className="mt-3 flex">
          {phase === 'copying' ? 'Copying' : 'Copy the new updater'}
        </Button>
      )}
    </Notice>
  )
}

/**
 * `offer` is the release to install, or null when there is none to offer
 * (up to date, nothing published, an older or malformed release); `blocked`
 * then labels the button. `summary` says where the site stands against
 * GitHub's latest release, or is null when GitHub could not be read.
 * `mayUpdate` is false for an account that may look but not install.
 */
export function UpdatePanel({
  initial,
  offer,
  blocked,
  summary,
  mayUpdate = true,
}: {
  initial: UpdaterStatus
  offer: string | null
  blocked: string
  summary: React.ReactNode
  mayUpdate?: boolean
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
          // Show the new release and commit, which the server renders.
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
      const said = typeof body.error === 'string' ? body.error : ''
      if (response.status === 401) {
        setNotice({ tone: 'danger', title: 'Signed out', text: 'Your session ran out. Sign in again.' })
        return
      }
      if (!response.ok && response.status !== 409) {
        setNotice({ tone: 'danger', title: 'Could not start', text: said || `The update could not start (${response.status}).` })
        return
      }
      if (response.status === 409) {
        setNotice({ tone: 'info', title: 'Already running', text: said || 'An update is already running.' })
      }
      setStatus((current) => ({ ...current, pending: true }))
      setWatching(true)
    } catch {
      setNotice({ tone: 'danger', title: 'No answer', text: 'Could not reach the server.' })
    }
  }

  const showSteps = state !== null && (busy || state.startedAt !== null)
  const waiting = status.pending && !running(state)
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
          {!mayUpdate && (
            <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">Your account can see updates but not install them.</p>
          )}
        </div>
        <Button
          onClick={update}
          disabled={!status.available || busy || !offer || !mayUpdate}
          variant={offer && mayUpdate ? 'default' : 'outline'}
        >
          <RefreshCw aria-hidden="true" className={busy ? 'animate-spin' : undefined} />
          {busy ? 'Updating' : offer ? `Install ${offer}` : blocked}
        </Button>
      </div>

      {!status.available && (
        <Notice tone="warning" title="Updates are off here" className="mt-4">
          The site was not started with <code className="font-mono">npm run serve</code>, so it cannot update itself.
          Set the server&apos;s startup command to <code className="font-mono">npm run serve</code> and restart it.
        </Notice>
      )}

      {state?.updaterChanged && <UpdaterChanged tag={state.current?.tag} mayUpdate={mayUpdate} />}

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

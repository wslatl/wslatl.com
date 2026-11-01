'use client'

import { useEffect, useState } from 'react'
import { Circle, CircleCheck, CircleMinus, CircleX, LoaderCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatWhen, shortSha } from '@/components/admin/format'
import type { StepId, StepState, UpdaterState, UpdaterStatus } from '@/lib/admin/updater'

// Types only from lib/admin: it is server-only, so this list repeats the
// supervisor's (scripts/updater/lib.mjs).
const busyStatuses: UpdaterState['status'][] = ['downloading', 'installing', 'building', 'checking', 'swapping']

const steps: { id: StepId; label: string; detail: string }[] = [
  { id: 'download', label: 'Download', detail: 'The release, from GitHub' },
  { id: 'install', label: 'Install', detail: 'npm ci, in a new folder' },
  { id: 'build', label: 'Build', detail: 'npm run build, keeping old assets' },
  { id: 'check', label: 'Trial start', detail: 'Must answer before anything changes' },
  { id: 'switch', label: 'Switch', detail: 'Restart on the new build, or roll back' },
]

const stepIcon: Record<StepState, React.ReactNode> = {
  pending: <Circle aria-hidden="true" className="text-muted-foreground" />,
  running: <LoaderCircle aria-hidden="true" className="animate-spin text-link" />,
  done: <CircleCheck aria-hidden="true" className="text-emerald-400" />,
  failed: <CircleX aria-hidden="true" className="text-red-400" />,
  skipped: <CircleMinus aria-hidden="true" className="text-muted-foreground" />,
}

const stepWords: Record<StepState, string> = {
  pending: 'Waiting',
  running: 'Running',
  done: 'Done',
  failed: 'Failed',
  skipped: 'Skipped',
}

const isBusy = (status: UpdaterStatus) =>
  status.pending || (status.state !== null && busyStatuses.includes(status.state.status))

/**
 * `offer` is the release to install, or null when there is none to offer
 * (up to date, nothing published, an older or malformed release); `blocked`
 * then labels the button.
 */
export function UpdatePanel({ initial, offer, blocked }: { initial: UpdaterStatus; offer: string | null; blocked: string }) {
  const [status, setStatus] = useState(initial)
  const [watching, setWatching] = useState(isBusy(initial))
  const [restarting, setRestarting] = useState(false)
  const [error, setError] = useState('')
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
          setError('Your session ran out. Log in again to see how the update went.')
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
    setError('')
    try {
      const response = await fetch('/admin/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const body = await response.json().catch(() => ({}))
      if (response.status === 401) {
        setError('Your session ran out. Log in again.')
        return
      }
      if (!response.ok && response.status !== 409) {
        setError(body.error ?? `The update could not start (${response.status}).`)
        return
      }
      if (response.status === 409) setError(body.error ?? 'An update is already running.')
      setStatus((current) => ({ ...current, pending: true }))
      setWatching(true)
    } catch {
      setError('Could not reach the server.')
    }
  }

  const showSteps = state !== null && (busy || state.startedAt !== null)

  return (
    <section aria-labelledby="update-heading" className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="update-heading" className="text-base font-semibold">
            Update the site
          </h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Builds the release beside the live site and switches only once it starts. If anything fails, the
            site stays as it is.
          </p>
        </div>
        <Button onClick={update} disabled={!status.available || busy || !offer}>
          <RefreshCw aria-hidden="true" className={busy ? 'animate-spin' : undefined} />
          {busy ? 'Updating' : offer ? `Install ${offer}` : blocked}
        </Button>
      </div>

      {!status.available && (
        <p className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          The site was not started with <code>npm run serve</code>, so it cannot update itself. See the README,
          section &ldquo;Admin and updates&rdquo;.
        </p>
      )}

      {state?.updaterChanged && (
        <p className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          This release changes the updater itself, which keeps running from the uploaded folder. Copy{' '}
          <code>scripts/serve.mjs</code> and <code>scripts/updater/</code> from the release folder over the
          uploaded ones, then restart the server. The README, &ldquo;Admin and updates&rdquo;, has the steps.
        </p>
      )}

      <div aria-live="polite" className="mt-4 space-y-2 text-sm">
        {error && <p className="text-red-400">{error}</p>}
        {status.pending && !busyStatuses.includes(state?.status ?? 'idle') && (
          <p className="text-muted-foreground">Waiting for the updater to pick up the request.</p>
        )}
        {restarting && <p className="text-muted-foreground">The site is restarting. Waiting for it to answer.</p>}
        {state?.target && busy && (
          <p>
            Installing <code className="font-mono">{state.target.tag}</code>{' '}
            <span className="text-muted-foreground">(commit {shortSha(state.target.sha)})</span>
          </p>
        )}
        {state?.message && !busy && (
          <p className={state.status === 'idle' ? 'text-emerald-300' : 'text-red-300'}>
            {state.message}
            {state.finishedAt && <span className="text-muted-foreground"> ({formatWhen(state.finishedAt)})</span>}
          </p>
        )}
      </div>

      {showSteps && (
        <ol className="mt-4 grid gap-2 sm:grid-cols-5">
          {steps.map((step) => {
            const value = state.steps[step.id] ?? 'pending'
            return (
              <li key={step.id} className="flex items-start gap-2 rounded-lg border bg-background/40 p-3 sm:flex-col">
                <span className="mt-0.5 sm:mt-0 [&_svg]:size-5">{stepIcon[value]}</span>
                <span>
                  <span className="block text-sm font-medium">{step.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {stepWords[value]}. {step.detail}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      )}

      {state && state.log.length > 0 && (
        <details className="mt-4" open={busy}>
          <summary className="cursor-pointer text-sm text-muted-foreground">Updater log</summary>
          <pre className="mt-2 max-h-80 overflow-auto rounded-md border bg-background p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {state.log.slice(-60).join('\n')}
          </pre>
        </details>
      )}
    </section>
  )
}

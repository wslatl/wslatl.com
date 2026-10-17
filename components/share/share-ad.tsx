'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ShareLabels } from '@/lib/share'
import { cn } from '@/lib/utils'

interface ShareAdProps {
  /** The finished ad, built on the server (lib/share.ts). Preview, copy and share all use this exact text. */
  text: string
  labels: ShareLabels
  /** The copy button: the blue one where the ad is the point of the page, an outline where it sits quietly. */
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
  className?: string
}

const noSubscribe = () => () => {}
const canShareNow = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

/**
 * Copies a Discord ad to the clipboard. A Preview button shows the exact text
 * in a dialog first, and phones that can share get a Share button too. The
 * copy button is the main action. "Copied" is announced to screen readers
 * from a status message, and both words share one cell so the button never
 * changes width.
 */
export function ShareAd({ text, labels, variant = 'outline', size = 'default', className }: ShareAdProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const dialog = useRef<HTMLDialogElement>(null)
  const preText = useRef<HTMLPreElement>(null)
  const titleId = useId()
  const hintId = useId()
  // false on the server and until the page is live, so nothing shifts when the browser turns out to support sharing.
  const canShare = useSyncExternalStore(noSubscribe, canShareNow, () => false)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copyText() {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      // No clipboard here: open the preview with the text selected, so it can be copied by hand.
      if (dialog.current && !dialog.current.open) dialog.current.showModal()
      const selection = window.getSelection()
      if (preText.current && selection) {
        const range = document.createRange()
        range.selectNodeContents(preText.current)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setState('failed')
    }
    timer.current = setTimeout(() => setState('idle'), 2500)
  }

  async function shareText() {
    try {
      await navigator.share({ text })
    } catch {
      // Closing the share sheet is not an error worth showing.
    }
  }

  const copied = state === 'copied'

  return (
    <div className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}>
      <Button type="button" variant={variant} size={size} onClick={copyText}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span className="grid">
          <span className={cn('col-start-1 row-start-1', copied && 'opacity-0')}>{labels.copy}</span>
          <span aria-hidden="true" className={cn('col-start-1 row-start-1', !copied && 'opacity-0')}>
            {labels.copied}
          </span>
        </span>
      </Button>
      <Button type="button" variant="ghost" size={size} onClick={() => dialog.current?.showModal()}>
        {labels.preview}
      </Button>
      {canShare && (
        <Button type="button" variant="ghost" size={size} onClick={shareText}>
          <Share2 aria-hidden="true" />
          {labels.share}
        </Button>
      )}
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an explicit status role is announced more reliably across screen readers than <output>'s implicit one */}
      <p role="status" className="sr-only">
        {state === 'copied' ? labels.copied : state === 'failed' ? labels.copyFailed : ''}
      </p>

      {/* The click only closes on the dim backdrop, as a convenience: Escape and the Close button do the same from the keyboard. */}
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={hintId}
        onClick={(event) => {
          // A click on the dim backdrop lands on the dialog itself, not on its content.
          if (event.target === dialog.current) dialog.current?.close()
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border bg-background p-5 text-foreground backdrop:bg-black/60 sm:p-6"
      >
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {labels.previewTitle}
        </h2>
        <p id={hintId} className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {labels.previewHint}
        </p>
        <pre
          ref={preText}
          // Focusable so the keyboard can scroll a long ad.
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className="mt-4 max-h-[50dvh] overflow-auto rounded-lg border bg-card/40 p-3 font-sans text-sm leading-relaxed break-words whitespace-pre-wrap"
        >
          {text}
        </pre>
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => dialog.current?.close()}>
            {labels.close}
          </Button>
          <Button type="button" onClick={copyText}>
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? labels.copied : labels.copy}
          </Button>
        </div>
      </dialog>
    </div>
  )
}

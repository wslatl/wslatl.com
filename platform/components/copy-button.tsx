'use client'

import { useRef } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from './button'
import { useCopyText } from './use-copy-text'
import { cn } from '../lib/cn'

export interface CopyButtonLabels {
  copy: string
  copied: string
  /** Said when the browser will not copy: the text is selected instead. */
  copyFailed: string
}

export interface CopyButtonProps {
  /** The text that is copied. It is shown beside the button as plain, selectable text. */
  value: string
  labels: CopyButtonLabels
  /** The large one is for a code that is the point of its block. */
  size?: 'sm' | 'lg'
  className?: string
}

/** The large text steps down a size as it gets longer, so most values still sit beside the button. */
function largeTextSize(length: number): string {
  if (length <= 12) return 'text-2xl'
  if (length <= 16) return 'text-xl'
  return 'text-lg'
}

/**
 * A value (a code, a command, an address) with a Copy button. The value is
 * plain text on the page and selects in one tap, so it can be copied with or
 * without JavaScript; the button only saves the reader the selecting. Screen
 * readers hear "Copied" from a status message, and the button keeps its
 * width while its label changes, so nothing around it moves.
 */
export function CopyButton({ value, labels, size = 'sm', className }: CopyButtonProps) {
  const valueRef = useRef<HTMLElement>(null)
  // Without a clipboard the value itself is selected, so the reader can copy it.
  const { state, copy } = useCopyText(valueRef)

  const copied = state === 'copied'

  return (
    // When the value and the button do not fit on one line, the button moves
    // under the value rather than the value breaking in the middle.
    <div className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}>
      <code
        ref={valueRef}
        translate="no"
        className={cn(
          'min-w-0 font-mono font-semibold tracking-wider break-all text-foreground select-all',
          size === 'lg' ? largeTextSize(value.length) : 'text-sm',
        )}
      >
        {value}
      </code>
      <Button
        type="button"
        variant="outline"
        size={size === 'lg' ? 'default' : 'sm'}
        onClick={() => copy(value)}
        className="ml-auto shrink-0"
      >
        {copied ? <Check aria-hidden="true" className="text-link" /> : <Copy aria-hidden="true" />}
        {/* Both words take the same cell, so the button is as wide as the
            longer one in every language. "Copy" stays readable to screen
            readers (opacity, not visibility), so the button's name never
            changes under them; the status message below says "Copied". */}
        <span className="grid">
          <span className={cn('col-start-1 row-start-1', copied && 'opacity-0')}>
            {labels.copy}
            <span className="sr-only"> {value}</span>
          </span>
          <span aria-hidden="true" className={cn('col-start-1 row-start-1', !copied && 'opacity-0')}>
            {labels.copied}
          </span>
        </span>
      </Button>
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an explicit status role is announced more reliably across screen readers than <output>'s implicit one */}
      <p role="status" className="sr-only">
        {state === 'copied' ? labels.copied : state === 'failed' ? labels.copyFailed : ''}
      </p>
    </div>
  )
}

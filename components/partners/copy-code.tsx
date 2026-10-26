'use client'

import { useRef } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyText } from '@/components/ui/use-copy-text'
import { cn } from '@/lib/utils'

export interface CopyCodeLabels {
  copy: string
  copied: string
  /** Said when the browser will not copy: the code is selected instead. */
  copyFailed: string
}

interface CopyCodeProps {
  code: string
  labels: CopyCodeLabels
  /** The profile's referral block uses the large one. */
  size?: 'sm' | 'lg'
  className?: string
}

/** The large code steps down a size as it gets longer, so most codes still sit beside the button. */
function largeCodeSize(length: number): string {
  if (length <= 12) return 'text-2xl'
  if (length <= 16) return 'text-xl'
  return 'text-lg'
}

/**
 * A referral code with a Copy button. The code is plain text on the page
 * (and selects in one tap), so it can be copied with or without JavaScript;
 * the button only saves the reader the selecting. Screen readers hear
 * "Copied" from a status message, and the button keeps its width while its
 * label changes, so nothing around it moves.
 */
export function CopyCode({ code, labels, size = 'sm', className }: CopyCodeProps) {
  const codeRef = useRef<HTMLElement>(null)
  // Without a clipboard the code itself is selected, so the reader can copy it.
  const { state, copy } = useCopyText(codeRef)

  const copied = state === 'copied'

  return (
    // When the code and the button do not fit on one line, the button moves
    // under the code rather than the code breaking in the middle.
    <div className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}>
      <code
        ref={codeRef}
        translate="no"
        className={cn(
          'min-w-0 font-mono font-semibold tracking-wider break-all text-foreground select-all',
          size === 'lg' ? largeCodeSize(code.length) : 'text-sm',
        )}
      >
        {code}
      </code>
      <Button
        type="button"
        variant="outline"
        size={size === 'lg' ? 'default' : 'sm'}
        onClick={() => copy(code)}
        className="ml-auto shrink-0"
      >
        {copied ? (
          <Check aria-hidden="true" className="text-link" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {/* Both words take the same cell, so the button is as wide as the
            longer one in every language. "Copy" stays readable to screen
            readers (opacity, not visibility), so the button's name never
            changes under them; the status message below says "Copied". */}
        <span className="grid">
          <span className={cn('col-start-1 row-start-1', copied && 'opacity-0')}>
            {labels.copy}
            <span className="sr-only"> {code}</span>
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

'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { unscrambleEmail } from '@/lib/email-cipher'
import { getServerSnapshot, getSnapshot, markPresent, subscribe } from '@/lib/presence'
import { cn } from '@/lib/utils'

interface EmailLinkProps {
  /** The address, scrambled by scrambleEmail(). */
  code: string
  className?: string
}

/**
 * Renders a scrambled address as a mailto link once a person is using the
 * page, and as a "Show email address" button until then. Screen reader users
 * browsing the page may never send the input events that reveal it, so the
 * button reveals it too, then moves focus to the link it becomes.
 */
export function EmailLink({ code, className }: EmailLinkProps) {
  const present = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const link = useRef<HTMLAnchorElement>(null)
  const [focusOnReveal, setFocusOnReveal] = useState(false)

  useEffect(() => {
    if (present && focusOnReveal) link.current?.focus()
  }, [present, focusOnReveal])

  if (!present) {
    return (
      <button
        type="button"
        className={cn('email-reveal', className)}
        onClick={() => {
          setFocusOnReveal(true)
          markPresent()
        }}
      >
        Show email address
      </button>
    )
  }

  const address = unscrambleEmail(code)
  return (
    <a ref={link} href={`mailto:${address}`} className={className}>
      {address}
    </a>
  )
}

'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

export type CopyState = 'idle' | 'copied' | 'failed'

interface CopyTextOptions {
  /** Runs before the fallback selection, for example to open the dialog that holds the text. */
  onFail?: () => void
}

/**
 * The copy-to-clipboard behaviour shared by the referral code and the Discord
 * ad buttons. When the browser will not copy (an older browser, or a page not
 * served over https), the element in selectRef is selected instead so the
 * reader can copy it by hand. The state falls back to idle after a moment, so
 * "Copied" does not stay on the button forever.
 */
export function useCopyText(selectRef: RefObject<HTMLElement | null>, { onFail }: CopyTextOptions = {}) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy(text: string) {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      onFail?.()
      const selection = window.getSelection()
      if (selectRef.current && selection) {
        const range = document.createRange()
        range.selectNodeContents(selectRef.current)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setState('failed')
    }
    timer.current = setTimeout(() => setState('idle'), 2500)
  }

  return { state, copy }
}

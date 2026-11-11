'use client'

import { useEffect } from 'react'

/**
 * Puts a page's own title on the browser tab once it has loaded. A 404 is
 * sent as data for the browser to build, and when the browser has built it
 * the tab can fall back to the layout's title, so a missing page would be
 * labelled as some other page.
 */
export function TabTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title
  }, [title])
  return null
}

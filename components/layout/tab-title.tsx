'use client'

import { useEffect } from 'react'

/**
 * Puts a page's own title on the browser tab once it has loaded. A 404 page
 * is sent as data for the browser to build (see app/[locale]/not-found.tsx),
 * and when the browser has built it the tab falls back to the layout's title,
 * so a missing page would be labelled as the home page.
 */
export function TabTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title
  }, [title])
  return null
}

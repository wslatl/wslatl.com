'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const value = max > 0 ? Math.min(1, doc.scrollTop / max) : 0
      setProgress(value)
      frame = 0
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-primary/80 origin-left"
        style={{ transform: `scaleX(${progress})`, transition: 'transform 80ms linear' }}
      />
    </div>
  )
}

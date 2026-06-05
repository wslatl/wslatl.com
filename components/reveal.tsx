'use client'

import { useEffect, useRef, useState, Children, isValidElement, cloneElement } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: React.ReactNode
  delay?: number
  duration?: number
  amount?: number
  className?: string
  as?: React.ElementType
  once?: boolean
  y?: number
}

export function Reveal({
  children,
  delay = 0,
  duration = 700,
  amount = 0.15,
  className,
  as: Comp = 'div',
  once = true,
  y = 20,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: amount, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [amount, once])

  return (
    <Comp
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        'transition-all ease-out will-change-transform',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0',
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      }}
    >
      {children}
    </Comp>
  )
}

type RevealGroupProps = {
  children: React.ReactNode
  step?: number
  baseDelay?: number
  duration?: number
  amount?: number
  className?: string
  y?: number
  as?: React.ElementType
  once?: boolean
}

export function RevealGroup({
  children,
  step = 100,
  baseDelay = 0,
  duration = 700,
  amount = 0.15,
  className,
  y = 20,
  as: Comp = 'div',
  once = true,
}: RevealGroupProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: amount, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [amount, once])

  const wrapped = Children.map(children, (child, idx) => {
    if (!isValidElement(child)) return child
    return cloneElement(child as React.ReactElement<{ style?: React.CSSProperties; className?: string }>, {
      className: cn(
        (child.props as { className?: string }).className,
        'transition-all ease-out will-change-transform',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0',
      ),
      style: {
        ...((child.props as { style?: React.CSSProperties }).style ?? {}),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${baseDelay + idx * step}ms`,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      },
    })
  })

  return (
    <Comp ref={ref as React.Ref<HTMLElement>} className={className}>
      {wrapped}
    </Comp>
  )
}

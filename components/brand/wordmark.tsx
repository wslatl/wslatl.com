import Image from 'next/image'
import { cn } from '@/lib/utils'

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const dimensions = {
  sm: { logo: 28, text: 'text-xs' },
  md: { logo: 36, text: 'text-sm' },
  lg: { logo: 48, text: 'text-base' },
}

export function Wordmark({ size = 'md', showText = true, className = '' }: WordmarkProps) {
  const d = dimensions[size]

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Image
        src="/favicon.png"
        alt={showText ? '' : 'WSLATL'}
        width={d.logo}
        height={d.logo}
        priority
        className="h-auto w-auto"
        style={{ height: d.logo, width: d.logo }}
      />
      {showText && (
        <span
          className={cn(
            d.text,
            'font-semibold tracking-[0.18em] text-foreground uppercase',
          )}
        >
          WSLATL
        </span>
      )}
    </span>
  )
}

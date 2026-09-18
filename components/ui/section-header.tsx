import { cn } from '@/lib/utils'

/** The heading style for every home page section, so they all carry the same weight. */
export const sectionHeadingClass =
  'text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-balance text-foreground md:text-5xl'

interface SectionHeaderProps {
  title: React.ReactNode
  /** Id for the heading, so the section can point `aria-labelledby` at it. */
  id?: string
  children?: React.ReactNode
  className?: string
}

/** Heading and optional intro that opens a page section. */
export function SectionHeader({ title, id, children, className }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <h2 id={id} className={sectionHeadingClass}>
        {title}
      </h2>
      {children && <div className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">{children}</div>}
    </div>
  )
}

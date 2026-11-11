import Link from 'next/link'
import { Main } from './main'

export interface ErrorDestination {
  label: string
  href: string
}

export interface ErrorPageProps {
  /** `notFound` is a 404 with places to go; `crash` is the last-resort boundary. */
  variant: 'notFound' | 'crash'
  /** The h1, set in the serif. */
  heading: string
  /** The sentence or two under it. May hold a link; style that with `errorLinkClassName`. */
  children: React.ReactNode
  /** The small code above the heading, for example "404". */
  code?: string
  /** A 404's list of places to go. */
  destinations?: ErrorDestination[]
  /** The buttons: a way home, a way to ask, "Try again". */
  actions?: React.ReactNode
}

/** The class for a link inside the body text. */
export const errorLinkClassName = 'text-link underline underline-offset-4 hover:text-foreground'

/**
 * The content of the 404 page and of the crash page, with all text passed in.
 * It renders the page's <main>, so put it between the header and footer (a
 * 404) or on its own (a crash, which may be rendered without them).
 */
export function ErrorPage({ variant, heading, children, code, destinations, actions }: ErrorPageProps) {
  const notFound = variant === 'notFound'

  return (
    <Main className={notFound ? 'shell pt-20 pb-10 md:pt-28' : 'shell pt-24 pb-24'}>
      {code && <p className="text-sm font-medium text-link">{code}</p>}
      <h1
        className={
          notFound
            ? 'mt-3 font-serif text-5xl text-foreground italic md:text-6xl'
            : 'font-serif text-5xl text-foreground italic'
        }
      >
        {heading}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{children}</p>
      {destinations && destinations.length > 0 && (
        <ul className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          {destinations.map((d) => (
            <li key={d.href} className="bg-background">
              <Link
                href={d.href}
                className="block p-4 font-medium text-foreground transition-colors hover:bg-card/50 hover:text-link"
              >
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {actions && <div className={notFound ? 'mt-10 flex flex-wrap gap-3' : 'mt-8 flex flex-wrap gap-3'}>{actions}</div>}
    </Main>
  )
}

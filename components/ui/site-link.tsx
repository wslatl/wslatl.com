import Link from 'next/link'
import { isShortLink } from '@/config/links'

/**
 * True for anything that leaves this site: absolute URLs, and short links
 * like /discord, which redirect to another site.
 */
export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href) || isShortLink(href)
}

type SiteLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & { href: string }

/**
 * One link component for internal routes and off-site links. Off-site links
 * (short links included) open in a new tab without leaking `window.opener`,
 * say so to screen readers, and never go through the client-side router.
 */
export function SiteLink({ href, children, ...props }: SiteLinkProps) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

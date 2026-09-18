import Link from 'next/link'

/** True for absolute http(s) URLs, i.e. anything that leaves this site. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

type SiteLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & { href: string }

/**
 * One link component for internal routes, off-site URLs, and mailto links.
 * Off-site links open in a new tab without leaking `window.opener`, and say
 * so to screen readers.
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
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

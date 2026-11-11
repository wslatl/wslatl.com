import Link from 'next/link'

/**
 * True for an absolute address, which leaves this site. An app whose own
 * short links (like /discord) redirect elsewhere marks those items with
 * `external` instead.
 */
export function isExternal(href: string, external?: boolean): boolean {
  return external ?? /^https?:\/\//i.test(href)
}

type SiteLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & {
  href: string
  /** What a screen reader hears after an off-site link, in the page's language. */
  newTab: string
  /** Treat the address as off-site even though it is not an absolute URL. */
  external?: boolean
}

/**
 * One link component for internal routes and off-site links. Off-site links
 * open in a new tab without leaking `window.opener`, say so to screen
 * readers, and never go through the client-side router.
 */
export function SiteLink({ href, newTab, external, children, ...props }: SiteLinkProps) {
  if (isExternal(href, external)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <span className="sr-only">{newTab}</span>
      </a>
    )
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

import { shortLinks, type ShortLinkName } from '@/config/links'
import { siteConfig } from '@/config/site'

const host = new URL(siteConfig.siteUrl).host

/** A short link as it reads in running text, for example wslatl.com/discord. */
export function shortLinkText(name: ShortLinkName): string {
  return `${host}${shortLinks[name].path}`
}

type ShortLinkProps = Omit<React.ComponentProps<'a'>, 'href'> & { name: ShortLinkName }

/**
 * An inline link through one of our short links. It shows the short address
 * (wslatl.com/billing) unless given other text, so the text on the page never
 * goes stale when a destination changes.
 */
export function ShortLink({ name, children, ...props }: ShortLinkProps) {
  return (
    <a href={shortLinks[name].path} target="_blank" rel="noopener noreferrer" {...props}>
      {children ?? shortLinkText(name)}
    </a>
  )
}

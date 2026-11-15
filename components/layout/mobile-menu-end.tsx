'use client'

import { Button } from '@/platform/components/button'

interface MobileMenuEndProps {
  registerHref: string
  /** The header's own words, already in this page's language. */
  labels: {
    getStarted: string
    newTab: string
    reviewNote: string
  }
}

/**
 * Closes the mobile menu the link sits in. Get started opens a new tab, so
 * the page stays where it was, and without this the menu would still cover
 * it when the visitor comes back.
 */
function closeMenu(event: React.MouseEvent<HTMLElement>) {
  event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()
}

/**
 * What the mobile menu has under its list of links (the kit's header puts
 * it there): the way to sign up. The languages come after it, from the
 * kit's own picker (SiteHeader's `languages`).
 */
export function MobileMenuEnd({ registerHref, labels }: MobileMenuEndProps) {
  return (
    <>
      <Button asChild size="lg" className="mt-6 w-full">
        <a href={registerHref} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
          {labels.getStarted}
          <span className="sr-only">{labels.newTab}</span>
        </a>
      </Button>
      <p className="mt-3 text-center text-sm text-muted-foreground">{labels.reviewNote}</p>
    </>
  )
}

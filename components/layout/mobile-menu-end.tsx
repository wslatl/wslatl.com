'use client'

import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { localeNames, localePath, locales, stripLocale, type Locale } from '@/i18n/config'
import { Button } from '@/platform/components/button'

interface MobileMenuEndProps {
  locale: Locale
  discordHref: string
  registerHref: string
  /** The header's own words, already in this page's language. */
  labels: {
    getStarted: string
    newTab: string
    chooseLanguage: string
    reviewNote: string
  }
}

/**
 * Closes the mobile menu a link sits in. The links here open a new tab, so
 * the page stays where it was, and without this the menu would still cover
 * it when the visitor comes back.
 */
function closeMenu(event: React.MouseEvent<HTMLElement>) {
  event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()
}

/**
 * What the mobile menu has under the page links (the kit's header puts it
 * there): Discord, as one more row of the list above, the way to sign up,
 * and the languages, which the narrowest screens have no picker for. It runs
 * in the browser, for the current path the language links keep.
 */
export function MobileMenuEnd({ locale, discordHref, registerHref, labels }: MobileMenuEndProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Its rule on top is the one between the rows of the list above. */}
      <ul className="border-t">
        <li>
          <a
            href={discordHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="flex items-center justify-between py-3.5 text-base font-medium text-foreground"
          >
            Discord
            <span className="sr-only">{labels.newTab}</span>
            <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
          </a>
        </li>
      </ul>
      <Button asChild size="lg" className="mt-6 w-full">
        <a href={registerHref} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
          {labels.getStarted}
          <span className="sr-only">{labels.newTab}</span>
        </a>
      </Button>
      <p className="mt-3 text-center text-sm text-muted-foreground">{labels.reviewNote}</p>

      {/* The picker is hidden on the narrowest screens, so the languages
          are here instead. Plain links: switching language is a fresh
          page in another tree. */}
      <div className="mt-6 border-t pt-4 sm:hidden">
        <p className="text-sm font-semibold text-foreground">{labels.chooseLanguage}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {locales.map((other) => (
            <li key={other}>
              <a
                href={localePath(other, stripLocale(pathname))}
                lang={other}
                hrefLang={other}
                aria-current={other === locale ? 'true' : undefined}
                className="text-muted-foreground aria-[current]:font-medium aria-[current]:text-foreground hover:text-foreground"
              >
                {localeNames[other]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

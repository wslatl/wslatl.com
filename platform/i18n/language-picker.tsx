'use client'

import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { Check, Languages } from 'lucide-react'
import { buttonVariants } from '../components/button'
import { cn } from '../lib/cn'
import { localeNames, localePath, locales, stripLocale, type Locale } from './config'

export interface LanguagePickerProps {
  /** The page's language. */
  locale: Locale
  /**
   * The button's accessible name, with the page's language in it, such as
   * "Language: English": `t('platform.language.label', { language: localeNames[locale] })`.
   */
  label: string
  /** Above the five names, such as "Choose a language": `t('platform.language.heading')`. */
  heading: string
  /**
   * The page's path without its language, when the router's is not it: a
   * 404 the framework renders on its own. Left out, it is the address the
   * page was asked for, with any language taken off.
   */
  path?: string
  /** `menu`, the default, is the button and its list for the header bar; `list` is the plain list for the mobile menu. */
  variant?: 'menu' | 'list'
  className?: string
}

/** The same page in each language, named in itself and marked as that language, with the page's own one marked as current. */
function Choices({ locale, path, mark, className, linkClassName }: { locale: Locale; path: string; mark: boolean; className?: string; linkClassName: string }) {
  return (
    <ul className={className}>
      {locales.map((other) => (
        <li key={other}>
          {/* A plain link: another language is another page, loaded whole, with or without JavaScript. */}
          <a
            href={localePath(other, path)}
            lang={other}
            hrefLang={other}
            aria-current={other === locale ? 'true' : undefined}
            className={linkClassName}
          >
            {localeNames[other]}
            {mark && other === locale && <Check aria-hidden="true" className="size-4 shrink-0 text-link" />}
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * The language picker: links to the same page in each of the five
 * languages, each named in itself. It needs no JavaScript: the menu is a
 * <details> the browser opens and closes, and every choice is a plain link.
 * With script it also closes on Escape and when focus moves out of it, as
 * the header's app switcher does. Give it to SiteHeader as `languages` and
 * it goes in the bar and in the mobile menu, or place it yourself.
 */
export function LanguagePicker({ locale, label, heading, path, variant = 'menu', className }: LanguagePickerProps) {
  const routerPath = usePathname()
  const page = path ?? stripLocale(routerPath ?? '/')
  const menuRef = useRef<HTMLDetailsElement>(null)

  if (variant === 'list') {
    return (
      <div className={className}>
        <p className="text-sm font-semibold text-foreground">{heading}</p>
        <Choices
          locale={locale}
          path={page}
          mark={false}
          className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm"
          linkClassName="text-muted-foreground hover:text-foreground aria-[current]:font-medium aria-[current]:text-foreground"
        />
      </div>
    )
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Escape and a move of focus out of the open menu reach it from the summary and the links inside, which are the interactive elements; it only closes the menu again
    <details
      ref={menuRef}
      className={cn('relative', className)}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null
        if (!next || !e.currentTarget.contains(next)) e.currentTarget.open = false
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && menuRef.current?.open) {
          menuRef.current.open = false
          menuRef.current.querySelector('summary')?.focus()
        }
      }}
    >
      <summary
        aria-label={label}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'cursor-pointer list-none [&::-webkit-details-marker]:hidden',
        )}
      >
        <Languages aria-hidden="true" className="size-[18px]" />
      </summary>
      <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl">
        <p className="px-3 pt-1.5 pb-1 text-xs font-semibold text-muted-foreground">{heading}</p>
        <Choices
          locale={locale}
          path={page}
          mark
          linkClassName="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current]:text-foreground"
        />
      </div>
    </details>
  )
}

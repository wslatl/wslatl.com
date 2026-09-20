'use client'

import { usePathname } from 'next/navigation'
import { Check, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { localeNames, locales, localePath, stripLocale, type Locale } from '@/i18n/config'

/**
 * Switches language without leaving the page: each entry links to the same
 * path under another language. Plain links, so they work without JavaScript
 * once the menu is open, and each is marked with its own lang so a screen
 * reader pronounces the language names properly.
 */
export function LanguagePicker({
  locale,
  label,
  heading,
  className,
}: {
  locale: Locale
  label: string
  heading: string
  className?: string
}) {
  const pathname = usePathname()
  const path = stripLocale(pathname)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className={className} aria-label={`${label}: ${localeNames[locale]}`}>
          <Languages aria-hidden="true" className="size-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{heading}</DropdownMenuLabel>
        {locales.map((other) => (
          <DropdownMenuItem key={other} asChild>
            <a href={localePath(other, path)} lang={other} hrefLang={other} aria-current={other === locale ? 'true' : undefined}>
              {localeNames[other]}
              {other === locale && <Check aria-hidden="true" className="ml-auto size-4 text-link" />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

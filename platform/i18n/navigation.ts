import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * next-intl's navigation, made from the kit's routing, so a link written
 * with a plain path gets the page's language: <Link href="/pricing"> is
 * /pricing on an English page and /es/pricing on a Spanish one.
 *
 * Link, redirect, permanentRedirect and getPathname work in Server and
 * Client Components; usePathname (the path without its language) and
 * useRouter in Client Components only. To change language, use the
 * language picker (language-picker.tsx), whose plain links lead straight to
 * the page in the other language. Link with a `locale` prop always writes
 * the prefix, /en/pricing included, which then costs a redirect to
 * /pricing.
 */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } = createNavigation(routing)

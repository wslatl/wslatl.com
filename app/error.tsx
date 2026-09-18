'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { siteConfig } from '@/config/site'

/**
 * Last-resort boundary for a render error. Every page is static, so this
 * should never show, but if it does it keeps the visitor on the site.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Main className="shell pt-24 pb-24">
      <h1 className="font-serif text-5xl text-foreground italic">Something broke on our end.</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        This page failed to load. Try again, and if it keeps happening,{' '}
        <a
          href={siteConfig.links.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline underline-offset-4 hover:text-foreground"
        >
          let us know on Discord<span className="sr-only"> (opens in a new tab)</span>
        </a>{' '}
        so we can fix it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to the home page</Link>
        </Button>
      </div>
    </Main>
  )
}

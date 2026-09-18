'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * Last-resort boundary for a render error. Every page is static, so this
 * should never show, but if it does it keeps the visitor on the site.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="shell pt-24 pb-24">
      <h1 className="font-serif text-5xl text-foreground italic">Something broke on our end.</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        This page failed to load. Try again, and if it keeps happening, let us know on Discord so we can
        fix it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to the home page</Link>
        </Button>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

const destinations = [
  { label: 'Plans and pricing', href: '/pricing' },
  { label: 'Game server hosting', href: '/games' },
  { label: 'What we host', href: '/#services' },
  { label: 'Legal documents', href: '/legal' },
]

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="shell pt-20 pb-10 md:pt-28">
        <p className="text-sm font-medium text-link">404</p>
        <h1 className="mt-3 font-serif text-5xl text-foreground italic md:text-6xl">This page does not exist.</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          The link may be old, or the address may have a typo. Here is where most people are headed:
        </p>
        <ul className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          {destinations.map((d) => (
            <li key={d.href} className="bg-background">
              <Link href={d.href} className="block p-4 font-medium text-foreground transition-colors hover:bg-card/50 hover:text-link">
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">Back to the home page</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
              Ask us on Discord<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}

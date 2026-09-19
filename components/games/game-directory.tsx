'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { Search } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn, slugify } from '@/lib/utils'

export interface GameListing {
  slug: string
  name: string
  category: string
  tagline: string
  /** RAM for the smallest recommended setup, e.g. "2-4GB". */
  startingRam: string
  /** Formatted monthly price of the smallest plan that fits, if any. */
  fromPrice: string | null
  featured: boolean
}

/** Lowercase, punctuation-insensitive text for matching "counter strike" to "Counter-Strike". */
function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function matches(game: GameListing, query: string) {
  const haystack = normalize(`${game.name} ${game.slug} ${game.category} ${game.tagline}`)
  return haystack.includes(query) || haystack.replace(/ /g, '').includes(query.replace(/ /g, ''))
}

function GameGrid({ games, featured = false }: { games: GameListing[]; featured?: boolean }) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', featured ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
      {games.map((game) => (
        <li key={game.slug}>
          <Link
            href={`/games/${game.slug}`}
            className={cn(
              'group flex h-full flex-col rounded-xl border p-5 transition-colors hover:border-foreground/25 hover:bg-card/50',
              featured ? 'border-primary/30 bg-primary/[0.04]' : 'bg-card/20',
            )}
          >
            <span className={cn('font-semibold text-foreground group-hover:text-link', featured && 'text-lg')}>
              {game.name}
            </span>
            <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{game.tagline}</span>
            <span className="mt-auto flex items-baseline justify-between gap-3 pt-4 text-sm text-muted-foreground tabular-nums">
              <span>{game.startingRam.replace(/GB/g, ' GB')} to start</span>
              {game.fromPrice && (
                <span>
                  from <span className="font-medium text-foreground">{game.fromPrice}</span>/mo
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function GameDirectory({ games, categories }: { games: GameListing[]; categories: string[] }) {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const q = normalize(query)
  const results = q ? games.filter((game) => matches(game, q)) : games

  return (
    <div>
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor={inputId} className="sr-only">
            Search games
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${games.length} games`}
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-base text-foreground placeholder:text-muted-foreground sm:text-sm"
          />
        </div>
        {!q && (
          <nav aria-label="Game categories">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {categories.map((category) => (
                <li key={category}>
                  <a href={`#${slugify(category)}`} className="text-muted-foreground transition-colors hover:text-foreground">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an explicit status role is announced more reliably across screen readers than <output>'s implicit one */}
      <p role="status" className="sr-only">
        {q ? `${results.length} of ${games.length} games match` : ''}
      </p>

      {q ? (
        results.length > 0 ? (
          <div className="mt-8">
            <p className="mb-4 text-sm text-muted-foreground" aria-hidden="true">
              {results.length} of {games.length} games
            </p>
            <GameGrid games={results} />
          </div>
        ) : (
          <div className="mt-8 rounded-xl border bg-card/20 p-8 text-center">
            <p className="font-medium text-foreground">No game matches &ldquo;{query.trim()}&rdquo;.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              If it has a dedicated server, we can almost always run it on the same plans.{' '}
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-link underline underline-offset-4 hover:text-foreground"
              >
                Ask us on Discord<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        )
      ) : (
        <div className="mt-10 space-y-14">
          <section aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="mb-5 text-xl font-semibold tracking-tight text-foreground">
              Featured games
            </h2>
            <GameGrid games={games.filter((g) => g.featured)} featured />
          </section>
          {categories.map((category) => (
            <section key={category} id={slugify(category)} aria-labelledby={`${slugify(category)}-heading`}>
              <h2 id={`${slugify(category)}-heading`} className="mb-5 text-xl font-semibold tracking-tight text-foreground">
                {category}
              </h2>
              <GameGrid games={games.filter((g) => g.category === category)} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

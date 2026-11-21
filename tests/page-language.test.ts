import { describe, expect, it, vi } from 'vitest'
import HomePage, { generateMetadata as homeMetadata } from '@/app/[locale]/page'
import PricingPage, { generateMetadata as pricingMetadata } from '@/app/[locale]/pricing/page'
import GamesPage, { generateMetadata as gamesMetadata } from '@/app/[locale]/games/page'
import GamePage, { generateMetadata as gameMetadata } from '@/app/[locale]/games/[slug]/page'
import LegalIndexPage, { generateMetadata as legalIndexMetadata } from '@/app/[locale]/legal/page'
import LegalPage, { generateMetadata as legalMetadata } from '@/app/[locale]/legal/[slug]/page'
import PartnersPage, { generateMetadata as partnersMetadata } from '@/app/[locale]/partners/page'
import PartnerPage, { generateMetadata as partnerMetadata } from '@/app/[locale]/partners/[slug]/page'
import BrandPage, { generateMetadata as brandMetadata } from '@/app/[locale]/brand/page'
import { partners } from '@/data/partners'

vi.mock('@/components/layout/site-header', () => ({ SiteHeader: () => null }))
vi.mock('@/components/layout/footer', () => ({ Footer: () => null }))
vi.mock('server-only', () => ({}))

/**
 * A page asked for in a language that is not one of the five. The proxy
 * gives every page a real one, but the framework hands /es.rsc, /og.rsc
 * and /_next, which the proxy reads as /es, the share card and Next's own
 * files and so gives no language, to the home page with "es.rsc", "og" or
 * "_next" for its language. The layout answers 404 for that, but a page's
 * metadata runs beside the layout, not after it, and read its words in the
 * made-up language first: a 500, with a stack trace in the log, on every
 * request. Each page and its metadata must be a 404 instead.
 */
type Params = { params: Promise<{ locale: string; slug: string }> }
const pages: [string, (props: Params) => Promise<unknown>, string][] = [
  ['the home page', homeMetadata as never, ''],
  ['the pricing page', pricingMetadata as never, ''],
  ['the games page', gamesMetadata as never, ''],
  ["a game's page", gameMetadata as never, 'minecraft'],
  ['the legal index', legalIndexMetadata as never, ''],
  ['a legal document', legalMetadata as never, 'privacy'],
  ['the partners page', partnersMetadata as never, ''],
  ["a partner's page", partnerMetadata as never, partners[0].slug],
  ['the brand page', brandMetadata as never, ''],
  ['the home page itself', HomePage as never, ''],
  ['the pricing page itself', PricingPage as never, ''],
  ['the games page itself', GamesPage as never, ''],
  ["a game's page itself", GamePage as never, 'minecraft'],
  ['the legal index itself', LegalIndexPage as never, ''],
  ['a legal document itself', LegalPage as never, 'privacy'],
  ['the partners page itself', PartnersPage as never, ''],
  ["a partner's page itself", PartnerPage as never, partners[0].slug],
  ['the brand page itself', BrandPage as never, ''],
]

/** What the framework's notFound() throws, as it tells a 404 from a crash. */
const notFound = (error: unknown) => (error as { digest?: unknown } | null)?.digest === 'NEXT_HTTP_ERROR_FALLBACK;404'

describe('a page in a language that is not one of ours', () => {
  it('is a 404 in its metadata and in itself, never a crash over words that do not exist', async () => {
    for (const [what, render, slug] of pages) {
      for (const locale of ['es.rsc', 'og', '_next', 'admin', 'ES', 'en-US', '__proto__', '']) {
        const thrown = await render({ params: Promise.resolve({ locale, slug }) }).then(
          () => null,
          (error: unknown) => error,
        )
        expect(notFound(thrown), `${what} in "${locale}": ${thrown instanceof Error ? thrown.message : String(thrown)}`).toBe(true)
      }
    }
  })

  it('still renders its metadata in each of the five', async () => {
    for (const locale of ['en', 'es', 'fr', 'de', 'pt']) {
      const metadata = (await homeMetadata({ params: Promise.resolve({ locale }) } as never)) as { title?: unknown }
      expect(metadata.title, locale).toBeTruthy()
    }
  })
})

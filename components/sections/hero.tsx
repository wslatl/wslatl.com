import Link from 'next/link'
import { LivePanel } from '@/components/sections/live-panel'
import { siteConfig } from '@/config/site'
import { localePath } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { Button } from '@/platform/components/button'

/**
 * The first screen: the slogan, one sentence and the two ways in, beside the
 * live panel with each location's state and prices. All of it is in the
 * prerendered page and shows at once: nothing waits on an animation, and
 * only the panel's states arrive later, into room kept for them.
 */
export function Hero() {
  const t = copy().home.hero
  const locale = getLocale()

  return (
    <section
      aria-labelledby="hero-heading"
      className="shell grid gap-12 pt-12 pb-16 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16 lg:pt-24 lg:pb-24"
    >
      <div>
        {/* The slogan is the brand, so it stays in English on every page. Its
            last two words stay together, so "damn." never sits alone. */}
        <h1
          id="hero-heading"
          lang="en"
          className="text-[clamp(2.75rem,9vw,5.25rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance text-foreground lg:text-[clamp(3.5rem,6.2vw,5.25rem)]"
        >
          {t.lineOne}
          <br />
          <span className="font-serif font-normal tracking-[-0.01em] italic">{t.emphasis}</span>{' '}
          {t.lineTwo.replace(/ (?=\S+$)/, '\u00a0')}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">{t.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
              {copy().header.getStarted}
              <span className="sr-only">{copy().header.newTab}</span>
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={localePath(locale, '/pricing')}>{t.seePlans}</Link>
          </Button>
        </div>
      </div>
      <LivePanel />
    </section>
  )
}

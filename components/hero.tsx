import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, UserPlus } from 'lucide-react'
import { DiscordIcon } from '@/components/icons'
import { siteConfig } from '@/config/site'

export function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-24 pb-28 md:pt-32 md:pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full text-center">

        <h1
          className="text-balance text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-bold tracking-[-0.04em] leading-[0.95] mb-7 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          Hosting that
          <br />
          <span className="font-serif italic font-normal gradient-text tracking-[-0.02em]">
            actually
          </span>{' '}
          gives a damn.
        </h1>

        <p
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          We have worked inside hosting companies. We know what goes wrong. WSLATL exists
          to fix that. Dedicated servers, game hosting, VPS, and a team that picks up.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-2.5 justify-center items-center animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Button
            asChild
            size="lg"
            className="gap-2 px-7 h-12 text-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-1 ring-white/5"
          >
            <Link href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
              <UserPlus size={16} />
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 px-7 h-12 text-sm font-semibold border-border/80"
          >
            <Link href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
              <DiscordIcon className="w-4 h-4" />
              Talk to Us on Discord
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="gap-1.5 px-5 h-12 text-sm text-muted-foreground hover:text-foreground"
          >
            <Link href="#services">
              See What We Offer
              <ChevronRight size={15} />
            </Link>
          </Button>
        </div>

        <p
          className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/55 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          Based in Missouri · Private Hosting · WSLATL LLC
        </p>
      </div>
    </section>
  )
}

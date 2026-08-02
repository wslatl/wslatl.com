import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserPlus, ChevronRight } from 'lucide-react'
import { DiscordIcon } from '@/components/brand/icons'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/effects/reveal'

export function CtaBanner() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card/40 p-10 md:p-14 text-center isolate">
          {/* Top accent line that draws across */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* Faint conic backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              background:
                'conic-gradient(from 220deg at 50% 50%, rgba(59,130,246,0.10) 0deg, transparent 120deg, rgba(99,102,241,0.08) 240deg, transparent 360deg)',
              filter: 'blur(40px)',
            }}
          />

          {/* Subtle dot grid */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            }}
          />

          <Reveal>
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-5">
              Ready to get started?
            </p>
            <h2 className="text-balance text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-[1.1] tracking-[-0.03em]">
              A hosting company that treats you like a{' '}
              <span className="font-serif italic font-normal gradient-text">person.</span>
              <br />
              Imagine that.
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto text-base">
              Register your account and an admin will review your application. Once approved, we get you set up fast.
            </p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
              Prefer to talk first? Reach out on Discord and we will walk you through everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="gap-2 px-7 h-12 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-1 ring-white/5"
            >
              <Link href={siteConfig.links.register} target="_blank" rel="noopener noreferrer">
                <UserPlus aria-hidden="true" size={17} />
                Register an Account
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 px-7 h-12 border-border/80"
            >
              <Link href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="w-4 h-4" />
                Join Our Discord
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="gap-1.5 px-5 h-12 text-muted-foreground hover:text-foreground"
            >
              <Link href="#contact">
                Send an Application
                <ChevronRight aria-hidden="true" size={15} />
              </Link>
            </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

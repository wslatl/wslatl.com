import Link from 'next/link'
import { DiscordIcon } from '@/components/brand/icons'
import { Wordmark } from '@/components/brand/wordmark'
import { MissouriGlyph } from '@/components/brand/glyphs'
import { footerColumns } from '@/data/footer'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="relative border-t border-border/80 bg-background/60">
      {/* Top accent line */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-14 md:divide-x md:divide-border/40">

          {/* Brand */}
          <div className="md:pr-8">
            <Wordmark size="lg" showText={false} className="mb-5" />
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">
              Private hosting built on trust and experience. Based in Missouri and serving clients worldwide.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Discord"
              >
                <DiscordIcon className="w-5 h-5" />
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                GitHub
              </Link>
              <Link
                href={siteConfig.links.status}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Status
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="md:px-6">
              <h4 className="font-semibold text-foreground mb-4 text-sm tracking-tight">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 WSLATL LLC. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Link
              href={siteConfig.credits.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {siteConfig.credits.label}
              <span aria-hidden className="ml-1 opacity-70">↗</span>
            </Link>
            <span aria-hidden className="opacity-40">·</span>
            <span className="flex items-center gap-1.5">
              <MissouriGlyph className="w-4 h-3 text-muted-foreground/70" />
              Hand-built in Missouri.
            </span>
            <span aria-hidden className="opacity-40">·</span>
            <Link
              href={siteConfig.trustpilot.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Rate us on Trustpilot ↗
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

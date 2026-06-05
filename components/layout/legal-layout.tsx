import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal } from '@/components/effects/reveal'
import { legalPages } from '@/data/legal'
import { siteConfig } from '@/config/site'

interface LegalLayoutProps {
  title: string
  description: string
  effectiveDate: string
  currentPath: string
  children: React.ReactNode
}

export function LegalLayout({ title, description, effectiveDate, currentPath, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        {/* Legal page switcher */}
        <div className="flex flex-wrap gap-1.5 mb-12 p-1 rounded-full border border-border/70 bg-card/30 w-fit">
          {legalPages.map((page) => {
            const isActive = currentPath === page.href
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
              >
                {page.label}
              </Link>
            )
          })}
        </div>

        {/* Page header */}
        <div className="mb-14 pb-12 border-b border-border/60">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-4 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-primary/60" />
            Legal
          </p>
          <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.05] tracking-[-0.03em]">
            <span className="font-serif italic font-normal text-foreground/95">{title}</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-foreground/60">Effective</span>
              <span className="text-foreground/90 font-medium">{effectiveDate}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-foreground/60">Jurisdiction</span>
              <span className="text-foreground/90 font-medium">WSLATL LLC, Missouri, USA</span>
            </span>
            <Link href={`mailto:${siteConfig.email.support}`} className="hover:text-primary transition-colors">
              {siteConfig.email.support}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-14">
          {children}
        </div>

        {/* Bottom contact strip */}
        <div className="mt-20 pt-12 border-t border-border/60">
          <div className="rounded-2xl border border-border/70 bg-card/30 p-7 md:p-9 text-center relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />
            <p className="font-serif italic text-xl text-foreground mb-2">
              Have questions about this document?
            </p>
            <p className="text-muted-foreground text-sm mb-5">
              We are a small team. You can actually talk to us.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={`mailto:${siteConfig.email.support}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                {siteConfig.email.support}
              </Link>
              <Link
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/70 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium"
              >
                Discord Server &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export function LegalSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Reveal>
      <section className="scroll-mt-24">
        <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-border/40">
          <span className="font-serif italic text-2xl text-primary/80 leading-none tabular-nums">
            {number}
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
            {title}
          </h2>
        </div>
        <div className="space-y-4 text-muted-foreground leading-[1.75] text-[0.9375rem]">
          {children}
        </div>
      </section>
    </Reveal>
  )
}

export function LegalSubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pl-4 sm:pl-5 border-l-2 border-primary/20">
      <h3 className="font-semibold text-foreground mb-3 text-[11px] uppercase tracking-[0.18em] text-primary/90">
        {title}
      </h3>
      <div className="space-y-3 text-muted-foreground text-[0.9375rem] leading-[1.75]">
        {children}
      </div>
    </div>
  )
}

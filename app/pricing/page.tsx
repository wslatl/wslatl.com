import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Pricing } from '@/components/sections/pricing'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Cheap VPS & Game Server Hosting Pricing',
  description:
    'Honest, published pricing for VPS and game server hosting on SATA SSD or NVMe. No renewal price traps - the price you sign up at is the price you keep.',
  alternates: { canonical: `${siteConfig.siteUrl}/pricing` },
  openGraph: {
    title: 'Cheap VPS & Game Server Hosting Pricing | WSLATL LLC',
    description: 'Honest, published pricing for VPS and game server hosting. No renewal price traps.',
    url: `${siteConfig.siteUrl}/pricing`,
  },
}

export default function PricingPage() {
  return (
    <div className="relative min-h-screen page-enter">
      <Header />

      {/* Header and Footer must stay outside <main> so they keep their
          implicit banner/contentinfo landmark roles - a <header>/<footer>
          nested inside <main> loses that role entirely. */}
      <main id="main-content" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-8 md:pb-10 text-center">
          <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.05] tracking-[-0.03em]">
            <span className="font-serif italic font-normal text-foreground/95">Pricing</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Simple plans, honest prices. You apply, we approve you, and most people are up and running the same day.
          </p>
          <p className="mt-6 text-sm text-foreground/80">
            No renewal price traps. The price you sign up at is the price you keep.
          </p>
        </div>

        <Pricing />
      </main>

      <Footer />
    </div>
  )
}

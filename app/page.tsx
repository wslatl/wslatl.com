import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { Clients } from '@/components/sections/clients'
import { Stats } from '@/components/sections/stats'
import { About } from '@/components/sections/about'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Services } from '@/components/sections/services'
import { PricingTeaser } from '@/components/sections/pricing-teaser'
import { Features } from '@/components/sections/features'
import { Reviews } from '@/components/sections/reviews'
import { FAQ } from '@/components/sections/faq'
import { CtaBanner } from '@/components/sections/cta-banner'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/layout/footer'
import { faqs } from '@/data/faqs'

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function Home() {
  return (
    <div className="relative min-h-screen page-enter">
      <Header />

      {/* Static, hand-authored content from data/faqs.ts, never user input - see
          the identical pattern (and the reasoning) on the per-game FAQ blocks. */}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />

      <main id="main-content" className="scroll-mt-20">
        <Hero />
        <Clients />
        <Stats />
        <About />
        <HowItWorks />
        <Services />
        <PricingTeaser />
        <Features />
        <Reviews />
        <FAQ />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

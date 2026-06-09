import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { Clients } from '@/components/sections/clients'
import { Stats } from '@/components/sections/stats'
import { About } from '@/components/sections/about'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Services } from '@/components/sections/services'
import { Features } from '@/components/sections/features'
import { Reviews } from '@/components/sections/reviews'
import { FAQ } from '@/components/sections/faq'
import { CtaBanner } from '@/components/sections/cta-banner'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <main className="relative min-h-screen page-enter">
      <Header />
      <Hero />
      <Clients />
      <Stats />
      <About />
      <HowItWorks />
      <Services />
      <Features />
      <Reviews />
      <FAQ />
      <CtaBanner />
      <Contact />
      <Footer />
    </main>
  )
}

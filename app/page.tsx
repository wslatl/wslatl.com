import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Clients } from '@/components/clients'
import { Stats } from '@/components/stats'
import { About } from '@/components/about'
import { HowItWorks } from '@/components/how-it-works'
import { Services } from '@/components/services'
import { Features } from '@/components/features'
import { FAQ } from '@/components/faq'
import { CtaBanner } from '@/components/cta-banner'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

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
      <FAQ />
      <CtaBanner />
      <Contact />
      <Footer />
    </main>
  )
}

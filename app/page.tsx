import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { Hero } from '@/components/sections/hero'
import { Clients } from '@/components/sections/clients'
import { Services } from '@/components/sections/services'
import { HowItWorks } from '@/components/sections/how-it-works'
import { WhyUs } from '@/components/sections/why-us'
import { About } from '@/components/sections/about'
import { Reviews } from '@/components/sections/reviews'
import { FAQ } from '@/components/sections/faq'
import { Contact } from '@/components/sections/contact'
import { faqs } from '@/data/faqs'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Cheap VPS & Game Server Hosting | WSLATL LLC',
  description:
    'Affordable VPS hosting, game server hosting (Minecraft, Rust, ARK, FiveM & more), and dedicated servers with DDoS protection and NVMe storage. Missouri-based, and we actually pick up.',
  path: '/',
  absoluteTitle: true,
})

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
    <>
      <Header />
      <JsonLd data={faqJsonLd} />
      <main id="main-content">
        <Hero />
        <Clients />
        <Services />
        <HowItWorks />
        <WhyUs />
        <About />
        <Reviews />
        <FAQ faqs={faqs} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

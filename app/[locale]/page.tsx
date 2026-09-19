import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
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
import { pageMetadata } from '@/lib/metadata'
import { Main } from '@/components/layout/main'
import type { Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { localizedFaqs } from '@/i18n/content'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  const t = copy().home
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: '/', absoluteTitle: true, locale })
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const faqs = localizedFaqs()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <SiteHeader />
      <JsonLd data={faqJsonLd} />
      <Main>
        <Hero />
        <Clients />
        <Services />
        <HowItWorks />
        <WhyUs />
        <About />
        <Reviews />
        <FAQ faqs={faqs} />
        <Contact />
      </Main>
      <Footer />
    </>
  )
}

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
import { Partners } from '@/components/sections/partners'
import { FAQ } from '@/components/sections/faq'
import { Contact } from '@/components/sections/contact'
import { pageMetadata } from '@/lib/metadata'
import { homeText } from '@/lib/page-text'
import { siteConfig } from '@/config/site'
import { Main } from '@/components/layout/main'
import { defaultLocale, type Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { localizedFaqs } from '@/i18n/content'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  return pageMetadata({ ...homeText(locale), path: '/', absoluteTitle: true, locale })
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const faqs = localizedFaqs()

  // The name Google shows for the site in results. It reads this from the
  // home page of the domain only, so the language home pages leave it out.
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.siteUrl}/#website`,
    name: siteConfig.brand,
    alternateName: [siteConfig.name, 'wslatl.com'],
    url: siteConfig.siteUrl,
    publisher: { '@id': `${siteConfig.siteUrl}/#organization` },
  }

  return (
    <>
      <SiteHeader />
      {locale === defaultLocale && <JsonLd data={websiteJsonLd} />}
      <Main>
        <Hero />
        <Clients />
        <Services />
        <HowItWorks />
        <WhyUs />
        <About />
        <Reviews />
        <Partners />
        <FAQ faqs={faqs} />
        <Contact />
      </Main>
      <Footer />
    </>
  )
}

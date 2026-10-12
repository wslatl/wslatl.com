import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/components/layout/main'
import { PartnerProfile } from '@/components/partners/partner-profile'
import { partners } from '@/data/partners'
import type { Locale } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { pageMetadata } from '@/lib/metadata'
import { partnerText, referralDiscount } from '@/lib/partners'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

function findPartner(slug: string) {
  return partners.find((partner) => partner.slug === slug)
}

export function generateStaticParams() {
  return partners.map((partner) => ({ slug: partner.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  setLocale(locale)
  const partner = findPartner(slug)
  if (!partner) return {}
  const t = copy().partners.profile

  return pageMetadata({
    title: t.metaTitle(partner.name),
    description: `${partnerText(partner.tagline, locale)} ${t.metaDescription(partner.referralCode, referralDiscount(locale))}`,
    path: `/partners/${partner.slug}`,
    locale,
    // Their banner is the picture a shared link shows, rather than ours.
    image: { url: partner.banner, alt: t.bannerAlt(partner.name) },
  })
}

export default async function PartnerPage({ params }: PageProps) {
  const { locale, slug } = await params
  setLocale(locale)
  const partner = findPartner(slug)
  if (!partner) notFound()

  return (
    <>
      <SiteHeader />
      <Main className="shell">
        <PartnerProfile partner={partner} />
      </Main>
      <Footer />
    </>
  )
}

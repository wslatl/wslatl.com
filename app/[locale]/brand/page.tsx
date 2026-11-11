import type { Metadata } from 'next'
import { BrandHeader, BrandKit } from '@/components/brand/brand-kit'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/platform/components/main'
import { SiteHeader } from '@/components/layout/site-header'
import type { Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { pageMetadata } from '@/lib/metadata'
import { brandText } from '@/lib/page-text'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  return pageMetadata({ ...brandText(locale), path: '/brand', locale })
}

export default async function BrandPage({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)

  return (
    <>
      <SiteHeader />
      <Main className="shell">
        <BrandHeader />
        <BrandKit />
      </Main>
      <Footer />
    </>
  )
}

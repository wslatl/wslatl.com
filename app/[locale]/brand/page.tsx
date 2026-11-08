import type { Metadata } from 'next'
import { BrandHeader, BrandKit } from '@/components/brand/brand-kit'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/components/layout/main'
import { SiteHeader } from '@/components/layout/site-header'
import type { Locale } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { pageMetadata } from '@/lib/metadata'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  const t = copy().brand
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: '/brand', locale })
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

import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { PartnerShowcase } from '@/components/partners/partner-showcase'
import { partners } from '@/data/partners'
import type { Locale } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { pageMetadata } from '@/lib/metadata'
import { partnersPageText } from '@/lib/partners'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  const t = copy().partners
  return pageMetadata({
    title: t.metaTitle,
    // Search results and link previews say what the page says.
    description: partnersPageText(t, partners.length, locale).description,
    path: '/partners',
    locale,
  })
}

export default async function PartnersPage({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const t = copy().partners

  return (
    <>
      <SiteHeader />
      <Main className="shell">
        <PageHeader title={t.heading} breadcrumbs={[]} crumbLabel={t.crumb} path="/partners">
          <p>{partnersPageText(t, partners.length, locale).intro}</p>
        </PageHeader>
        <PartnerShowcase partners={partners} />
      </Main>
      <Footer />
    </>
  )
}

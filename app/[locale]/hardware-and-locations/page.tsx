import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { LocationsDirectory } from '@/components/locations/locations-directory'
import type { Locale } from '@/i18n/config'
import { copy } from '@/i18n/copy'
import { setLocale } from '@/i18n/locale'
import { pageMetadata } from '@/lib/metadata'
import { hardwareText } from '@/lib/page-text'
import { Main } from '@/platform/components/main'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  return pageMetadata({ ...hardwareText(locale), path: '/hardware-and-locations', locale })
}

/**
 * Where the servers are and what they run on: one block per location in
 * data/locations.ts, with its live status, whether we rent or own the
 * hardware, the hardware the site states, and what its plans start at.
 * Prerendered like every public page; only the states load afterwards.
 */
export default async function HardwareAndLocationsPage({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const t = copy().hardware

  return (
    <>
      <SiteHeader />
      <Main className="shell pb-20">
        <PageHeader title={t.heading} breadcrumbs={[]} crumbLabel={t.heading} path="/hardware-and-locations">
          <p>{t.intro}</p>
        </PageHeader>
        <LocationsDirectory />
      </Main>
      <Footer />
    </>
  )
}

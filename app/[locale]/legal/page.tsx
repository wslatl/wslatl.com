import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { legalEffectiveDate } from '@/config/site'
import { pageMetadata } from '@/lib/metadata'
import { Main } from '@/components/layout/main'
import { localePath, type Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { localizedLegalPages } from '@/i18n/content'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setLocale(locale)
  const t = copy().legal
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: '/legal', locale })
}

export default async function LegalIndexPage({ params }: PageProps) {
  const { locale } = await params
  setLocale(locale)
  const t = copy().legal

  return (
    <>
      <SiteHeader />
      <Main className="shell">
        <PageHeader title={t.heading} breadcrumbs={[]} crumbLabel={t.heading} path="/legal">
          <p>{t.intro}</p>
        </PageHeader>

        <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
          {localizedLegalPages().map((doc) => (
            <li key={doc.href} className="bg-background">
              <Link
                href={localePath(locale, doc.href)}
                className="group block h-full p-6 transition-colors hover:bg-card/50"
              >
                <h2 className="font-semibold text-foreground group-hover:text-link">{doc.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{doc.intro}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t.effective} {legalEffectiveDate(doc.key)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Main>
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import { legalContent } from '@/content/legal'
import { legalPageBySlug, legalPages, legalSlug } from '@/data/legal'
import type { Locale } from '@/i18n/config'
import { setLocale } from '@/i18n/locale'
import { localizedLegalPages } from '@/i18n/content'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

/** URL slugs stay English in every language: /es/legal/privacy. */
export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: legalSlug(page) }))
}

/** The document, with its title and summary in the page's language. */
function localizedPage(slug: string) {
  const english = legalPageBySlug(slug)
  return english && localizedLegalPages().find((page) => page.key === english.key)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  setLocale(locale)
  const page = localizedPage(slug)
  return page ? legalMetadata(page, locale) : {}
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { locale, slug } = await params
  setLocale(locale)
  const page = localizedPage(slug)
  if (!page) notFound()
  return <LegalLayout page={page} content={legalContent(locale, page.key)} />
}

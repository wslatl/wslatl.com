import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalLayout, legalMetadata } from '@/components/layout/legal-layout'
import { legalContent } from '@/content/legal'
import { legalPageBySlug, legalPages, legalSlug } from '@/data/legal'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: legalSlug(page) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = legalPageBySlug((await params).slug)
  return page ? legalMetadata(page) : {}
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const page = legalPageBySlug((await params).slug)
  if (!page) notFound()
  return <LegalLayout page={page} content={legalContent[page.key]} />
}

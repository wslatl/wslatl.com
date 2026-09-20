import { Children, isValidElement, type ComponentType, type ReactElement, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import type { LegalPage } from '@/data/legal'
import { legalEffectiveDate, siteConfig } from '@/config/site'
import { formatLegalDate } from '@/i18n/dates'
import { pageMetadata } from '@/lib/metadata'
import { cn, slugify } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import { Email } from '@/components/ui/email'
import { hasTranslation } from '@/content/legal'
import { defaultLocale, localePath, type Locale } from '@/i18n/config'
import { getLocale } from '@/i18n/locale'
import { copy } from '@/i18n/copy'
import { localizedLegalPages } from '@/i18n/content'

export function legalMetadata(page: LegalPage, locale?: Locale) {
  return pageMetadata({ title: page.title, description: page.metaDescription, path: page.href, locale })
}

interface SectionProps {
  number: string
  title: string
  children: ReactNode
}

export function LegalSection({ number, title, children }: SectionProps) {
  const id = slugify(title)
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="flex items-baseline gap-3 border-b pb-3 text-xl font-semibold tracking-tight break-words hyphens-auto text-foreground md:text-2xl"
      >
        <span className="font-serif text-2xl font-normal text-link italic tabular-nums">{number}</span>
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[0.9375rem] leading-[1.75] text-muted-foreground">{children}</div>
    </section>
  )
}

export function LegalSubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-primary/30 pl-4 sm:pl-5">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-4 text-[0.9375rem] leading-[1.75] text-muted-foreground">{children}</div>
    </div>
  )
}

interface TocEntry {
  id: string
  label: string
}

/** Walks a rendered document for its top-level LegalSection headings. */
function tableOfContents(tree: ReactNode): TocEntry[] {
  const entries: TocEntry[] = []
  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return
      const element = child as ReactElement<{ children?: ReactNode } & Partial<SectionProps>>
      if (element.type === LegalSection && element.props.title) {
        entries.push({ id: slugify(element.props.title), label: `${element.props.number}. ${element.props.title}` })
        return
      }
      visit(element.props.children)
    })
  }
  visit(tree)
  return entries
}

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ol className="space-y-1.5 text-sm">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`} className="block py-0.5 text-muted-foreground transition-colors hover:text-foreground">
            {entry.label}
          </a>
        </li>
      ))}
    </ol>
  )
}

function DocList({ current }: { current: string }) {
  const locale = getLocale()
  return (
    <ul className="space-y-1.5 text-sm">
      {localizedLegalPages().map((doc) => {
        const active = doc.href === current
        return (
          <li key={doc.href}>
            <Link
              href={localePath(locale, doc.href)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'block py-0.5 transition-colors',
                active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {doc.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function MobileDisclosure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group rounded-lg border bg-card/30">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t px-4 py-3">{children}</div>
    </details>
  )
}

interface LegalLayoutProps {
  page: LegalPage
  /** The document body, built from LegalSection and LegalSubSection. */
  content: ComponentType
}

export function LegalLayout({ page, content: Content }: LegalLayoutProps) {
  const locale = getLocale()
  const t = copy().legal
  // Content components are plain server components, so rendering one here
  // yields its element tree, which is where the table of contents comes from.
  const body = <Content />
  const toc = tableOfContents((Content as () => ReactNode)())

  return (
    <>
      <SiteHeader />
      <Main className="shell">
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-16">
          {/* The offset lives on the aside, so once the sidebar sticks it sits
              just under the header instead of 6rem down the screen. */}
          <aside className="hidden pt-16 lg:block print:hidden">
            <div className="scroll-quiet scroll-fade sticky top-16 max-h-[calc(100dvh-4rem)] space-y-10 overflow-y-auto pt-8 pb-10">
              <nav aria-label="On this page">
                <p className="mb-3 text-sm font-semibold text-foreground">{t.onThisPage}</p>
                <TocList entries={toc} />
              </nav>
              <nav aria-label="Legal documents">
                <p className="mb-3 text-sm font-semibold text-foreground">{t.documents}</p>
                <DocList current={page.href} />
              </nav>
            </div>
          </aside>

          <div className="max-w-3xl">
            <PageHeader
              title={page.title}
              breadcrumbs={[{ label: t.heading, href: '/legal' }]}
              crumbLabel={page.label}
              path={page.href}
            >
              <p>{page.intro}</p>
            </PageHeader>

            <dl className="-mt-4 mb-10 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">{t.effective}</dt>
                <dd className="font-medium text-foreground">{formatLegalDate(legalEffectiveDate(page.key))}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">{t.jurisdiction}</dt>
                <dd className="font-medium text-foreground">{siteConfig.jurisdiction}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">{t.questions}</dt>
                <dd>
                  <Email name="support" className="font-medium text-link hover:text-foreground" />
                </dd>
              </div>
            </dl>

            <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:hidden print:hidden">
              <MobileDisclosure label={t.onThisPage}>
                <nav aria-label="On this page">
                  <TocList entries={toc} />
                </nav>
              </MobileDisclosure>
              <MobileDisclosure label={t.documents}>
                <nav aria-label="Legal documents">
                  <DocList current={page.href} />
                </nav>
              </MobileDisclosure>
            </div>

            {/* A translation is a courtesy; the English document is the one
                that applies, and it is one click away. A document with no
                translation yet says so, rather than claiming to be one. */}
            {locale !== defaultLocale && (
              <div role="note" className="legal-callout mb-10" data-tone="note">
                <p>
                  {hasTranslation(locale, page.key) ? t.translationNotice : t.notTranslated}{' '}
                  <Link href={localePath(defaultLocale, page.href)} hrefLang={defaultLocale} lang={defaultLocale}>
                    {t.readInEnglish}
                  </Link>
                  .
                </p>
              </div>
            )}

            <div className="legal-body space-y-14 border-t pt-12">{body}</div>

            <aside
              aria-labelledby="legal-questions-heading"
              className="mt-20 rounded-2xl border bg-card/30 p-6 sm:p-8 print:hidden"
            >
              <h2 id="legal-questions-heading" className="text-lg font-semibold text-foreground">
                {t.questionsHeading}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t.questionsBody}
              </p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <Email name="support" className="text-link underline underline-offset-4 hover:text-foreground" />
                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link underline underline-offset-4 hover:text-foreground"
                >
                  {t.askOnDiscord}
                  <span className="sr-only">{copy().header.newTab}</span>
                </a>
              </p>
            </aside>
          </div>
        </div>
      </Main>
      <Footer />
    </>
  )
}

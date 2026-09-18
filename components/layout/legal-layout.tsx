import { Children, isValidElement, type ComponentType, type ReactElement, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { legalPages, type LegalPage } from '@/data/legal'
import { legalEffectiveDate, siteConfig } from '@/config/site'
import { pageMetadata } from '@/lib/metadata'
import { cn, slugify } from '@/lib/utils'
import { Main } from '@/components/layout/main'

export function legalMetadata(page: LegalPage) {
  return pageMetadata({ title: page.title, description: page.metaDescription, path: page.href })
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
        className="flex items-baseline gap-3 border-b pb-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl"
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
      <div className="space-y-3 text-[0.9375rem] leading-[1.75] text-muted-foreground">{children}</div>
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
  return (
    <ul className="space-y-1.5 text-sm">
      {legalPages.map((doc) => {
        const active = doc.href === current
        return (
          <li key={doc.href}>
            <Link
              href={doc.href}
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
  // Content components are plain server components, so rendering one here
  // yields its element tree, which is where the table of contents comes from.
  const body = <Content />
  const toc = tableOfContents((Content as () => ReactNode)())

  return (
    <>
      <Header />
      <Main className="shell">
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-16">
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-16 max-h-[calc(100dvh-4rem)] space-y-10 overflow-y-auto pt-24 pb-10">
              <nav aria-label="On this page">
                <h2 className="mb-3 text-sm font-semibold text-foreground">On this page</h2>
                <TocList entries={toc} />
              </nav>
              <nav aria-label="Legal documents">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Legal documents</h2>
                <DocList current={page.href} />
              </nav>
            </div>
          </aside>

          <div className="max-w-3xl">
            <PageHeader
              title={page.title}
              breadcrumbs={[{ label: 'Legal', href: '/legal' }]}
              crumbLabel={page.label}
            >
              <p>{page.intro}</p>
            </PageHeader>

            <dl className="-mt-4 mb-10 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Effective</dt>
                <dd className="font-medium text-foreground">{legalEffectiveDate(page.key)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Jurisdiction</dt>
                <dd className="font-medium text-foreground">{siteConfig.jurisdiction}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Questions</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email.support}`} className="font-medium text-link hover:text-foreground">
                    {siteConfig.email.support}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:hidden print:hidden">
              <MobileDisclosure label="On this page">
                <nav aria-label="On this page">
                  <TocList entries={toc} />
                </nav>
              </MobileDisclosure>
              <MobileDisclosure label="Legal documents">
                <nav aria-label="Legal documents">
                  <DocList current={page.href} />
                </nav>
              </MobileDisclosure>
            </div>

            <div className="legal-body space-y-14 border-t pt-12">{body}</div>

            <aside
              aria-labelledby="legal-questions-heading"
              className="mt-20 rounded-2xl border bg-card/30 p-6 sm:p-8 print:hidden"
            >
              <h2 id="legal-questions-heading" className="text-lg font-semibold text-foreground">
                Questions about this document?
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We are a small team. You can actually talk to us.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <a href={`mailto:${siteConfig.email.support}`} className="text-link underline underline-offset-4 hover:text-foreground">
                  {siteConfig.email.support}
                </a>
                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link underline underline-offset-4 hover:text-foreground"
                >
                  Ask on Discord<span className="sr-only"> (opens in a new tab)</span>
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

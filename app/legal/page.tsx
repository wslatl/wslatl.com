import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHeader } from '@/components/layout/page-header'
import { legalPages } from '@/data/legal'
import { legalEffectiveDate } from '@/config/site'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Legal',
  description:
    'Every WSLATL LLC policy in one place: privacy, terms of service, acceptable use, refunds, SLA, DMCA, abuse, account credit, subprocessors, and backups.',
  path: '/legal',
})

export default function LegalIndexPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="shell">
        <PageHeader title="Legal" breadcrumbs={[]} crumbLabel="Legal">
          <p>
            Our policies, written to be read. Each one shows the date it took effect, and each one can
            change on its own, so check the date on the document you are relying on.
          </p>
        </PageHeader>

        <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
          {legalPages.map((doc) => (
            <li key={doc.href} className="bg-background">
              <Link href={doc.href} className="group block h-full p-6 transition-colors hover:bg-card/50">
                <h2 className="font-semibold text-foreground group-hover:text-link">{doc.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{doc.intro}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Effective {legalEffectiveDate(doc.key)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}

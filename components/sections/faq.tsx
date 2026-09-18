import { Plus } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { SectionHeader } from '@/components/ui/section-header'
import type { Faq } from '@/data/faqs'
import { cn } from '@/lib/utils'

/**
 * Native <details> disclosures: keyboard and screen reader support for free,
 * no client JavaScript, and find-in-page can open a closed answer.
 */
export function FaqList({ faqs, className }: { faqs: Faq[]; className?: string }) {
  return (
    <div className={cn('divide-y border-y', className)}>
      {faqs.map((faq) => (
        <details key={faq.question} className="faq-item group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
            {faq.question}
            <Plus
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-link transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function FAQ({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-20 md:py-28">
      <div className="shell grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeader id="faq-heading" title="Common questions">
          <p>
            Still not sure?{' '}
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-link underline underline-offset-4 hover:text-foreground"
            >
              Ask us on Discord<span className="sr-only"> (opens in a new tab)</span>
            </a>
            . We are always around.
          </p>
        </SectionHeader>
        <FaqList faqs={faqs} />
      </div>
    </section>
  )
}

'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/effects/reveal'
import { faqs } from '@/data/faqs'

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary"
    >
      <span className="absolute w-4 h-px bg-current" />
      <span
        className={`absolute h-4 w-px bg-current transition-transform duration-300 ${
          open ? 'rotate-90' : 'rotate-0'
        }`}
      />
    </span>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
        open
          ? 'border-primary/30 bg-card/60'
          : 'border-border/70 bg-card/30 hover:border-border'
      }`}
    >
      <button
        type="button"
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="font-medium text-foreground text-sm md:text-base leading-snug">
          {question}
        </span>
        <PlusMinus open={open} />
      </button>
      <div
        id={panelId}
        role="region"
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              FAQ
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              Common{' '}
              <span className="font-serif italic font-normal text-foreground/90">questions.</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Still not sure?{' '}
              <Link
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Ask us on Discord
              </Link>
              . We are always around.
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Reveal key={idx} delay={idx * 80}>
              <FaqItem question={faq.question} answer={faq.answer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

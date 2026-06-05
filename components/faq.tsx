'use client'

import { useState } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/reveal'

const faqs = [
  {
    question: 'How do I get started?',
    answer:
      'Head to billing.wslatl.com/register and sign up for an account. After you register, an admin will review your application and approve it before you can access any services. Once approved, reach out to us on Discord or open a billing ticket and we will get you set up.',
  },
  {
    question: 'What makes you different from the big hosting companies?',
    answer:
      "We are small on purpose. We are a private, application only company based in Missouri. We have worked inside hosting companies and we have seen how clients get ignored. At WSLATL, every client gets direct access to our team every single time. No queues that sit for days and no copy paste replies.",
  },
  {
    question: 'What games do you support for game servers?',
    answer:
      'We run Pterodactyl and support a wide range of games. Minecraft (Java and Bedrock), Rust, CS2, ARK Survival Evolved, Valheim, Terraria, FiveM, and plenty more. If your game is not listed here, just ask us. We can almost always support it.',
  },
  {
    question: 'How fast will you actually respond?',
    answer:
      'Under an hour on Discord during active hours and often faster. We do not have a massive support team. We have a dedicated one. You will always be talking to someone who knows your specific server and setup, not someone reading from a script.',
  },
  {
    question: 'Do you offer managed hosting?',
    answer:
      'Yes. We offer fully managed options where we handle updates, monitoring, and maintenance. We also offer unmanaged options for clients who want full control. We figure out what works best for you during our initial conversation.',
  },
  {
    question: 'Can I upgrade, downgrade, or change things later?',
    answer:
      'Of course. Every client relationship is handled personally so upgrades, plan changes, and migrations are just a Discord message away. We usually get it sorted the same day.',
  },
]

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

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
        open
          ? 'border-primary/30 bg-card/60'
          : 'border-border/70 bg-card/30 hover:border-border'
      }`}
    >
      <button
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-foreground text-sm md:text-base leading-snug">
          {question}
        </span>
        <PlusMinus open={open} />
      </button>
      <div
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

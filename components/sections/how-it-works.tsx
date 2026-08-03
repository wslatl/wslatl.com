import Link from 'next/link'
import { UserPlus, MessageSquare, Rocket } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Reveal, RevealGroup } from '@/components/effects/reveal'

const steps = [
  {
    icon: UserPlus,
    title: 'Register Your Account',
    description:
      'Head to billing.wslatl.com/register and sign up. Once you submit, an admin will review and approve your account before you can access services.',
    cta: { label: 'Go to registration', href: siteConfig.links.register },
  },
  {
    icon: MessageSquare,
    title: 'We Have a Conversation',
    description:
      'After your account is approved, reach out to us on Discord or open a billing ticket. We talk to you about what you need. No automated flow.',
    cta: null,
  },
  {
    icon: Rocket,
    title: 'Your Server Goes Live',
    description:
      'We get you set up, walk you through your panel, and stay available after. Most clients are up and running the same day.',
    cta: null,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Getting Started
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              Three steps.{' '}
              <span className="font-serif italic font-normal text-foreground/90">No fluff.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              We keep it simple on purpose. You should not need a tutorial to get hosted.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Animated dashed connector on desktop */}
          <svg
            aria-hidden
            className="hidden md:block absolute top-[2.4rem] left-0 w-full h-8 pointer-events-none"
            viewBox="0 0 800 32"
            preserveAspectRatio="none"
          >
            <line
              x1="40"
              y1="16"
              x2="760"
              y2="16"
              className="dashed-connector"
              stroke="currentColor"
              strokeWidth="1"
              style={{ color: 'oklch(0.55 0.18 240 / 0.45)' }}
            />
          </svg>

          <RevealGroup as="div" className="grid md:grid-cols-3 gap-10 relative" step={140}>
            {steps.map((step, idx) => {
              const Icon = step.icon
              const num = String(idx + 1).padStart(2, '0')
              return (
                <div
                  key={idx}
                  className="relative flex flex-col items-center text-center px-2"
                >
                  <span
                    aria-hidden
                    className="font-serif italic text-muted-foreground/40 text-2xl mb-2"
                  >
                    {num}
                  </span>
                  <div className="relative mb-5 z-10">
                    <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <Icon aria-hidden="true" className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                  {step.cta && (
                    <Link
                      href={step.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline underline-offset-2 transition-colors"
                    >
                      {step.cta.label} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

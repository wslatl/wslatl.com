import Link from 'next/link'
import { DiscordIcon } from '@/components/brand/icons'
import { Reveal, RevealGroup } from '@/components/effects/reveal'
import { reachOptions } from '@/data/reach-options'

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <Reveal>
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Get In Touch
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.025em]">
              We are{' '}
              <span className="font-serif italic font-normal text-foreground/90">easy</span> to reach.
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Pick whatever way works for you. All roads lead to a real person.
            </p>
          </div>
        </Reveal>

        <RevealGroup as="div" className="grid sm:grid-cols-3 gap-3 mb-6" step={120}>
          {reachOptions.map((option, idx) => {
            const Icon = option.icon
            return (
              <div
                key={idx}
                className="group p-5 rounded-2xl border border-border/70 bg-card/30 hover:bg-card/60 transition-all duration-300 flex flex-col gap-3"
              >
                <div
                  className={`w-11 h-11 rounded-full ring-1 ${option.ring} ${option.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon aria-hidden="true" className={`w-5 h-5 ${option.text}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm mb-1 tracking-tight">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {option.description}
                  </p>
                </div>
                <Link
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                  {option.cta} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )
          })}
        </RevealGroup>

      </div>
    </section>
  )
}

import Image from 'next/image'
import type { ComponentType } from 'react'
import { HeartGlyph, ShieldGlyph, NodesGlyph } from '@/components/brand/glyphs'
import { Reveal, RevealGroup } from '@/components/effects/reveal'
import { team } from '@/data/team'

interface Pillar {
  Glyph: ComponentType<{ className?: string }>
  title: string
  desc: string
}

const pillars: Pillar[] = [
  {
    Glyph: HeartGlyph,
    title: 'Family First',
    desc: "Every client gets our direct attention. We learn your setup, respond fast, and treat your server like it is our own.",
  },
  {
    Glyph: ShieldGlyph,
    title: 'Private by Design',
    desc: "We accept clients personally. That is how we keep the quality of service high and make sure we are actually a good fit.",
  },
  {
    Glyph: NodesGlyph,
    title: 'Industry Veterans',
    desc: "We have worked at hosting companies before. We know the shortcuts they take. We do not take them.",
  },
]

export function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">

          <Reveal>
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-4">
              Who We Are
            </p>
            <h2 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-[-0.025em]">
              We built WSLATL because we got tired of watching hosting{' '}
              <span className="font-serif italic font-normal text-foreground/90">
                companies ignore their clients.
              </span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We have worked inside hosting companies. We have seen how tickets pile up, how
                clients get passed around, how no one actually knows your setup. It is frustrating
                and it is entirely avoidable.
              </p>
              <p>
                So we started WSLATL. Based in Missouri, privately run, and small enough that
                every client actually gets our attention. We are not trying to be the biggest
                hosting company. We are trying to be the one you would actually recommend to a friend.
              </p>
              <p className="text-foreground font-medium">
                Every client here is treated like family. That is the only way we know how to do this.
              </p>
            </div>
          </Reveal>

          <RevealGroup as="div" className="space-y-3" step={120}>
            {pillars.map((p, idx) => {
              const Glyph = p.Glyph
              return (
                <div
                  key={idx}
                  className="group flex gap-4 p-5 rounded-2xl border border-border/70 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:ring-primary/30 transition-all">
                    <Glyph className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 tracking-tight">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </RevealGroup>
        </div>

        {/* Pull quote */}
        <Reveal className="max-w-3xl mx-auto">
          <figure className="relative py-10 pl-8 md:pl-10 border-l-2 border-primary/40">
            <span
              aria-hidden
              className="absolute -left-3 -top-3 text-5xl text-primary/40 font-serif leading-none"
            >
              &ldquo;
            </span>
            <blockquote className="text-2xl md:text-[1.75rem] text-foreground font-serif italic leading-[1.4] tracking-[-0.01em]">
              In the hosting industry it is tough and you have to stand out. We just want to treat
              our clients like family and make sure they get the best experience they can.
            </blockquote>
            <figcaption className="mt-5 text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              The WSLATL Team
            </figcaption>
          </figure>
        </Reveal>

        {/* Team */}
        <div className="mt-20">
          <Reveal>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.22em] text-center mb-8">
              The people behind WSLATL
            </p>
          </Reveal>
          <RevealGroup as="div" className="flex flex-col sm:flex-row gap-5 justify-center max-w-2xl mx-auto" step={150}>
            {team.map((member, idx) => (
              <div
                key={idx}
                className="group flex-1 p-6 rounded-2xl border border-border/70 bg-card/30 text-center hover:bg-card/60 hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all" />
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-inner">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="font-semibold text-foreground text-base mb-0.5 tracking-tight">{member.name}</p>
                <p className="text-primary text-[10px] font-semibold uppercase tracking-[0.18em] mb-3">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

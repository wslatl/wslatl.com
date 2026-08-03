import Image from 'next/image'
import { Reveal } from '@/components/effects/reveal'
import { clients } from '@/data/clients'

/** Repeats the client list 4x to create a seamless infinite-marquee track. */
const SCROLL_REPEATS = 4
const scrollItems = Array.from({ length: SCROLL_REPEATS }, () => clients).flat()

export function Clients() {
  return (
    <section id="clients" className="py-16 scroll-mt-20">
      <Reveal>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
            Trusted by our clients
          </p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </Reveal>

      {/* Screen-reader list of clients, announced once (the marquee below is
          decorative and repeats each logo, so it is hidden from assistive tech). */}
      <ul className="sr-only">
        {clients.map((client) => (
          <li key={client.name}>{client.name}</li>
        ))}
      </ul>

      <Reveal delay={150}>
        <div
          aria-hidden="true"
          className="max-w-5xl mx-auto overflow-hidden marquee-group"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <div
            className="flex items-center gap-14 marquee-track animate-scroll"
            style={{ width: 'max-content' }}
          >
            {scrollItems.map((client, idx) => (
              <div
                key={idx}
                className="marquee-item flex-shrink-0 flex items-center justify-center h-20"
              >
                <Image
                  src={client.logo}
                  alt=""
                  width={client.width}
                  height={client.height}
                  className={`${client.hClass} w-auto object-contain opacity-50 hover:opacity-95 transition-opacity duration-300 grayscale-[0.3] hover:grayscale-0`}
                />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

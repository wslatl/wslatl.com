import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const clients = [
  { name: 'Joes',             logo: '/clients/joes.png',        width: 6250, height: 6250, hClass: 'h-14' },
  { name: 'West Bay Project', logo: '/clients/westbay.png',     width: 955,  height: 261,  hClass: 'h-8'  },
  { name: 'VulnRadar',        logo: '/clients/vulnradar.png',   width: 378,  height: 156,  hClass: 'h-9'  },
  { name: 'HASKINS',          logo: '/clients/haskins.png',     width: 509,  height: 490,  hClass: 'h-14' },
  { name: 'WSLATL',           logo: '/clients/wslatl-main.png', width: 1563, height: 1563, hClass: 'h-12' },
]

const scrollItems = [...clients, ...clients, ...clients, ...clients]

export function Clients() {
  return (
    <section id="clients" className="py-16">
      <Reveal>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
            Trusted by our clients
          </p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div
          className="max-w-5xl mx-auto overflow-hidden marquee-group"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <div
            className="flex items-center gap-14 marquee-track"
            style={{
              animation: 'scroll 60s linear infinite',
              width: 'max-content',
            }}
          >
            {scrollItems.map((client, idx) => (
              <div
                key={idx}
                className="marquee-item flex-shrink-0 flex items-center justify-center h-20"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
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

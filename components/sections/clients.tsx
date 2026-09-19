import Image from 'next/image'
import { Pause } from 'lucide-react'
import { clients } from '@/data/clients'
import { cn } from '@/lib/utils'

/** Two copies make one seamless loop; each copy repeats the list so it is wider than any screen. */
const LOOP_COPIES = 2
const REPEATS_PER_COPY = 2

export function Clients() {
  return (
    <section aria-labelledby="clients-heading" className="marquee shell pb-6">
      <div className="flex items-center justify-center gap-3">
        <h2 id="clients-heading" className="text-sm text-muted-foreground">
          Trusted by our clients
        </h2>
        {/* Moving content needs a way to stop it (WCAG 2.2.2). A checkbox works without JavaScript. */}
        <label className="marquee-toggle inline-flex cursor-pointer items-center rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
          <input type="checkbox" className="sr-only" />
          <Pause aria-hidden="true" className="size-3.5" />
          <span className="sr-only">Pause the scrolling client logos</span>
        </label>
      </div>

      {/* Announced once as a list; the moving strip below is decorative. */}
      <ul className="sr-only">
        {clients.map((client) => (
          <li key={client.name}>{client.name}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="marquee-viewport mt-7 overflow-hidden">
        <div className="marquee-track flex w-max">
          {Array.from({ length: LOOP_COPIES }, (_slot, copy) => (
            <div key={copy} className={cn('flex shrink-0 items-center', copy > 0 && 'marquee-dup')}>
              {Array.from({ length: REPEATS_PER_COPY }, (_set, repeat) =>
                clients.map((client) => (
                  <div
                    key={`${repeat}-${client.name}`}
                    className={cn('flex shrink-0 items-center px-7 sm:px-10', repeat > 0 && 'marquee-dup')}
                  >
                    <Image
                      src={client.logo}
                      alt=""
                      width={client.width}
                      height={client.height}
                      className={cn(client.heightClass, 'w-auto opacity-75 grayscale')}
                    />
                  </div>
                )),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

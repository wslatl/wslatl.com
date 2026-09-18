import Image from 'next/image'
import { clients } from '@/data/clients'
import { cn } from '@/lib/utils'

export function Clients() {
  return (
    <section aria-labelledby="clients-heading" className="shell pb-6">
      <h2 id="clients-heading" className="text-center text-sm text-muted-foreground">
        Trusted by our clients
      </h2>
      <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-16 sm:gap-y-8">
        {clients.map((client) => (
          <li key={client.name}>
            <Image
              src={client.logo}
              alt={client.name}
              width={client.width}
              height={client.height}
              className={cn(client.heightClass, 'w-auto opacity-75 grayscale')}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

import { clients as allClients, type Client } from '@/data/clients'
import { partners as allPartners, type Partner } from '@/data/partners'
import { orderedPartners } from '@/lib/partners'

export type StripEntry = { kind: 'client'; client: Client } | { kind: 'partner'; partner: Partner }

/**
 * The trusted clients strip on the home page (components/sections/clients.tsx):
 * every client in data/clients.ts and every partner in data/partners.ts, so a
 * new partner is in it the day they are added, with no step of its own. A
 * client who is also a partner (Client.partner) shows once, with the client's
 * logo. Clients and partners take turns, so the wordmarks and the partners'
 * pictures are spread along the strip rather than bunched at one end.
 */
export function clientStrip(clients: readonly Client[] = allClients, partners: readonly Partner[] = allPartners): StripEntry[] {
  const linked = new Set(clients.map((client) => client.partner))
  const rest = orderedPartners(partners).filter((partner) => !linked.has(partner.slug))
  const strip: StripEntry[] = []
  for (let at = 0; at < Math.max(clients.length, rest.length); at++) {
    if (at < clients.length) strip.push({ kind: 'client', client: clients[at] })
    if (at < rest.length) strip.push({ kind: 'partner', partner: rest[at] })
  }
  return strip
}

/** An entry's name, as the strip's list for screen readers says it. */
export const stripName = (entry: StripEntry) => (entry.kind === 'client' ? entry.client.name : entry.partner.name)

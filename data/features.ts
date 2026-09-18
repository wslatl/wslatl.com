import { uptimeTarget } from '@/data/sla'
import { siteConfig } from '@/config/site'

export interface Commitment {
  value: string
  detail: string
  href?: string
}

/** Concrete promises, each one backed by a policy page or our own FAQ. */
export const commitments: Commitment[] = [
  {
    value: `${uptimeTarget('vps')} uptime`,
    detail: `Our SLA target on VPS and web hosting (${uptimeTarget('game')} on game servers), with service credits if we miss it.`,
    href: siteConfig.paths.sla,
  },
  {
    value: 'Under an hour',
    detail: 'Typical first reply on Discord during active hours, and often faster.',
  },
  {
    value: 'Same day',
    detail: 'Most servers are live the day your account is approved.',
  },
  {
    value: 'Locked-in price',
    detail: 'The price you sign up at is the price you keep. No renewal traps.',
  },
]

export interface Feature {
  title: string
  description: string
}

export const features: Feature[] = [
  {
    title: 'You talk to a real person. Every time.',
    description:
      'No bot wall and no scripted responses. Open a ticket in your billing portal, ping us on Discord, or DM us directly, and you get someone who knows what they are doing and cares about your server.',
  },
  {
    title: 'We are picky for good reason',
    description:
      'We accept clients on an application basis. That is not gatekeeping. It is how we make sure we can actually serve everyone we take on.',
  },
  {
    title: 'Servers that do not let you down',
    description:
      'NVMe SSDs, high frequency CPUs, and redundant network paths. Built to run hard without cutting corners.',
  },
  {
    title: 'Stay online when it counts',
    description:
      'DDoS mitigation built in from the start. If something tries to knock you offline, we handle it.',
  },
  {
    title: 'Actually fast',
    description:
      'Low latency routing, an optimized stack, and hardware that does not throttle. Your milliseconds matter to us.',
  },
  {
    title: 'We know the inside of hosting',
    description:
      'Our founders worked at hosting companies. We know where things go wrong, and we built WSLATL to avoid all of it.',
  },
]

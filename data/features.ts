import type { LucideIcon } from 'lucide-react'
import { Cpu, ShieldCheck, UserCheck } from 'lucide-react'
import { uptimeTarget } from '@/data/sla'

export interface Commitment {
  value: string
  label: string
}

/** Concrete promises, each backed by a policy page or our own FAQ. Keep labels short and even. */
export const commitments: Commitment[] = [
  { value: uptimeTarget('vps'), label: 'Uptime target on VPS and web hosting' },
  { value: 'Under 1 hr', label: 'Typical first reply on Discord in active hours' },
  { value: 'Same day', label: 'Most servers go live the day you are approved' },
  { value: '30 days', label: 'Written notice before any price increase' },
]

export interface Feature {
  title: string
  description: string
  icon?: LucideIcon
}

/** The lead promise, shown large beside the list. */
export const leadFeature: Feature = {
  title: 'You talk to a real person. Every time.',
  description:
    'No bot wall and no scripted responses. Open a ticket in your billing portal, ping us on Discord, or DM us directly, and you get someone who knows what they are doing and cares about your server.',
}

export const features: Feature[] = [
  {
    title: 'Hardware that holds up',
    icon: Cpu,
    description:
      'NVMe SSDs, high frequency CPUs, redundant network paths, and low latency routing. Built to run hard without cutting corners.',
  },
  {
    title: 'Online when it counts',
    icon: ShieldCheck,
    description:
      'DDoS mitigation built in from the start. If something tries to knock you offline, we handle it.',
  },
  {
    title: 'Picky for good reason',
    icon: UserCheck,
    description:
      'We accept clients on an application basis. That is not gatekeeping. It is how we make sure we can actually serve everyone we take on.',
  },
]

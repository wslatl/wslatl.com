import type { LucideIcon } from 'lucide-react'
import { Cpu, ShieldCheck, UserCheck } from 'lucide-react'
import { uptimeTarget } from '@/data/sla'

export interface Commitment {
  /** Stable key for translations; see i18n/content/types.ts. */
  id: string
  value: string
  label: string
}

/** Concrete promises, each backed by a policy page or our own FAQ. Keep labels short and even. */
export const commitments: Commitment[] = [
  { id: 'uptime', value: uptimeTarget('vps'), label: 'Uptime target on VPS and web hosting' },
  { id: 'reply', value: 'Under 1 hr', label: 'Typical first reply on Discord in active hours' },
  { id: 'live', value: 'Same day', label: 'Most servers go live the day you are approved' },
  { id: 'notice', value: '30 days', label: 'Written notice before any price increase' },
]

export interface Feature {
  /** Stable key for translations; see i18n/content/types.ts. */
  id: string
  title: string
  description: string
  icon?: LucideIcon
}

/** The lead promise, shown large beside the list. */
export const leadFeature: Feature = {
  id: 'real-person',
  title: 'You talk to a real person. Every time.',
  description:
    'Game server plans include always-on DDoS mitigation at no extra cost. VPS, web and game hosting each carry a monthly uptime target, with SLA credits if we miss it.',
}

export const features: Feature[] = [
  {
    id: 'hardware',
    title: 'Hardware that holds up',
    icon: Cpu,
    description:
      'Premium runs on an AMD Ryzen 9 3900X with NVMe drives in RAID 1, in Los Angeles. Budget runs on an Intel Core i7-6700K with SATA SSDs in RAID 1, in New York City: an older, busier CPU, which is why it costs less.',
  },
  {
    id: 'uptime',
    title: 'Online when it counts',
    icon: ShieldCheck,
    description:
      'DDoS mitigation built in from the start. If something tries to knock you offline, we handle it.',
  },
  {
    id: 'application-only',
    title: 'Picky for good reason',
    icon: UserCheck,
    description:
      'We accept clients on an application basis. That is not gatekeeping. It is how we make sure we can actually serve everyone we take on.',
  },
]

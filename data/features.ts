import type { LucideIcon } from 'lucide-react'
import { Lock, Server, Shield, Zap, Star } from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: Lock,
    title: 'We Are Picky For Good Reason',
    description:
      "We accept clients on an application basis. That is not gatekeeping. It is how we make sure we can actually serve everyone we take on.",
  },
  {
    icon: Server,
    title: 'Servers That Do Not Let You Down',
    description:
      'NVMe SSDs, high frequency CPUs, redundant network paths. Built to run hard without cutting corners.',
  },
  {
    icon: Shield,
    title: 'Stay Online When It Counts',
    description:
      'DDoS mitigation built in from the start. If something tries to knock you offline, we handle it.',
  },
  {
    icon: Zap,
    title: 'Actually Fast',
    description:
      'Low latency routing, an optimized stack, and hardware that does not throttle. Your milliseconds matter to us.',
  },
  {
    icon: Star,
    title: 'We Know the Inside of Hosting',
    description:
      "Our founders worked at hosting companies. We know where things go wrong and we built WSLATL to avoid all of it.",
  },
]

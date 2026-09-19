import { siteConfig } from '@/config/site'
import type { EmailName } from '@/config/emails'

interface ReachOptionBase {
  title: string
  description: string
}

/** A way to reach us: a link with its own button text, or one of our emails. */
export type ReachOption = ReachOptionBase & ({ cta: string; href: string } | { email: EmailName })

export const reachOptions: ReachOption[] = [
  {
    title: 'Discord',
    description:
      'Join our server and open a ticket, or DM us directly. This is the fastest way to hear from us.',
    cta: 'Join our Discord',
    href: siteConfig.links.discord,
  },
  {
    title: 'Billing portal ticket',
    description: 'Already a client? Open a ticket in the billing portal. Best for account and billing questions.',
    cta: 'Open a ticket',
    href: siteConfig.links.billing,
  },
  {
    title: 'Email',
    description: 'Prefer email? A person reads every message.',
    email: 'support',
  },
]

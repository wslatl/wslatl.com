import type { ComponentType } from 'react'
import { CreditCard, Mail, MapPin } from 'lucide-react'
import { DiscordIcon } from '@/components/brand/icons'
import { siteConfig } from '@/config/site'

export interface ReachOption {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  cta: string
  href: string
  ring: string
  bg: string
  text: string
}

export const reachOptions: ReachOption[] = [
  {
    icon: CreditCard,
    title: 'Billing Portal Ticket',
    description:
      'Log in to your billing portal and open a support ticket. Great for account or billing questions.',
    cta: 'Open a Ticket',
    href: siteConfig.links.billing,
    ring: 'ring-blue-400/30',
    bg: 'bg-blue-400/10',
    text: 'text-blue-300',
  },
  {
    icon: DiscordIcon,
    title: 'Discord Server',
    description:
      'Join our Discord and open a ticket in the server. This is the fastest way to hear from us.',
    cta: 'Join Discord',
    href: siteConfig.links.discord,
    ring: 'ring-[#5865F2]/40',
    bg: 'bg-[#5865F2]/10',
    text: 'text-[#7d87fa]',
  },
  {
    icon: DiscordIcon,
    title: 'Direct Message Us',
    description:
      'Prefer something more private? DM us directly on Discord and we will get back to you personally.',
    cta: 'Find Us on Discord',
    href: siteConfig.links.discord,
    ring: 'ring-[#5865F2]/40',
    bg: 'bg-[#5865F2]/10',
    text: 'text-[#7d87fa]',
  },
]

/** Extra plain-text reach options for surfaces that just list them. */
export const contactMethods: { icon: ComponentType<{ className?: string }>; label: string; value: string }[] = [
  { icon: Mail,    label: 'Email',    value: siteConfig.email.support },
  { icon: MapPin,  label: 'Based in', value: siteConfig.location },
]

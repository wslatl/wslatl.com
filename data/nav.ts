import type { LucideIcon } from 'lucide-react'
import {
  CreditCard, Gamepad2, Server, LayoutDashboard, HardDrive, UserPlus,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

export interface MainLink {
  label: string
  href: string
  external: boolean
}

export interface LoginLink {
  label: string
  href: string
  icon: LucideIcon
}

export const mainLinks: MainLink[] = [
  { label: 'Home',     href: '/',            external: false },
  { label: 'Services', href: '/#services',   external: false },
  { label: 'Pricing',  href: '/pricing',     external: false },
  { label: 'Games',    href: '/games',       external: false },
  { label: 'About',    href: '/#about',      external: false },
  { label: 'Contact',  href: '/#contact',    external: false },
  { label: 'Status',   href: siteConfig.links.status,  external: true  },
  { label: 'Discord',  href: siteConfig.links.discord, external: true  },
]

export const loginLinks: (LoginLink | null)[] = [
  { label: 'Billing Portal',   href: siteConfig.links.billing,     icon: CreditCard      },
  { label: 'Register',         href: siteConfig.links.register,    icon: UserPlus        },
  null,
  { label: 'Gaming Panel',     href: siteConfig.links.gamingPanel, icon: Gamepad2        },
  { label: 'VPS Panel',        href: siteConfig.links.vpsPanel,    icon: Server          },
  { label: 'Dedicated Portal', href: siteConfig.links.dedicated,   icon: HardDrive       },
  { label: 'cPanel',           href: siteConfig.links.cPanel,      icon: LayoutDashboard },
]

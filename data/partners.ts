import type { Locale } from '@/i18n/config'

/**
 * Words a partner wrote about themselves: English on its own, or English plus
 * any translations they gave us. A language without one shows the English.
 */
export type PartnerText = string | ({ en: string } & Partial<Record<Locale, string>>)

/** The places a partner can link to, in the order the profile shows them. */
export const socialPlatformIds = [
  'discord',
  'youtube',
  'tiktok',
  'twitch',
  'kick',
  'x',
  'instagram',
  'steam',
  'github',
  'website',
] as const

export type SocialPlatform = (typeof socialPlatformIds)[number]

export interface Partner {
  /** The profile's address, /partners/<slug>: lowercase letters, digits and hyphens. */
  slug: string
  /** Their name as they write it. Never translated. */
  name: string
  /** One line under the name, up to 80 characters. */
  tagline: PartnerText
  /** Who they are, up to 600 characters. A blank line (\n\n) starts a new paragraph. */
  description: PartnerText
  /** Square picture, at least 256px across, at /partners/<slug>/<file>. */
  avatar: string
  /**
   * Wide picture about 3:1 (1500x500 is ideal), at /partners/<slug>/<file>.
   * It is also the picture shown when someone shares the profile.
   */
  banner: string
  /** Their code on the billing panel, as it stores it: A to Z and 0 to 9, up to 32 characters. */
  referralCode: string
  /** The month they became a partner, as YYYY-MM. */
  since: string
  /** Games they play, as slugs from data/games.ts. Each links to its page. */
  games?: string[]
  /** Full https links. tests/partners.test.ts checks each one is on its platform's own site. */
  socials: Partial<Record<SocialPlatform, string>>
  /** Shown first, with a "Featured" mark. */
  featured?: boolean
}

/** Longest tagline and description, in characters, in any language. */
export const partnerTextLimits = { tagline: 80, description: 600 } as const

/**
 * A referral code as the billing panel stores it: letters and digits, at
 * most 32, in capitals. The panel would also take an accented letter; this
 * site takes A to Z and 0 to 9 only, so give partners a plain code.
 */
export const referralCodePattern = /^[A-Z0-9]{1,32}$/

/**
 * Official partners, shown on /partners, each with a profile at
 * /partners/<slug>.
 *
 * Add someone ONLY with their written OK to be shown here, and keep that OK
 * (a ticket or a Discord message) in case they ask later. "How to add a
 * partner" in README.md has the steps. The tests check every entry: the
 * links, the pictures, the code and the lengths.
 */
export const partners: Partner[] = []

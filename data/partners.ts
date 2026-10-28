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
  /** Their name as they write it, up to 60 characters. Never translated. */
  name: string
  /** One line under the name, up to 80 characters. */
  tagline: PartnerText
  /** Who they are, up to 600 characters. A blank line (\n\n) starts a new paragraph. */
  description: PartnerText
  /**
   * Square picture, at least 256px across, at /partners/<slug>/<file>. Optional:
   * without one the card and profile show a circle with their initials.
   */
  avatar?: string
  /**
   * Wide picture about 3:1 (1500x500 is ideal), at /partners/<slug>/<file>.
   * It is also the picture shown when someone shares the profile. Optional:
   * without one they get a plain branded banner, and a shared link shows the
   * site's own picture.
   */
  banner?: string
  /**
   * Their code on the billing panel, as it stores it: A to Z and 0 to 9, up to
   * 32 characters. Leave it out for a partner who is not in the referral
   * program or does not want a code shown: they are listed without one, and
   * their profile has no sign-up button or discount line. An empty string is
   * a mistake, not "no code", and fails the checks.
   */
  referralCode?: string
  /** The month they became a partner, as YYYY-MM. */
  since: string
  /**
   * Games they play, in their order. Each is a slug from data/games.ts
   * ('fivem') or a game's name as it is usually written ('Among Us'). One
   * with a page here links to it, in the page's language; any other shows as
   * plain text. A name links by itself once its game gets a page, as long as
   * the page's slug is the name in lowercase with hyphens ('among-us').
   */
  games?: string[]
  /** Full https links. tests/partners.test.ts checks each one is on its platform's own site. */
  socials: Partial<Record<SocialPlatform, string>>
  /** Shown first, with a "Featured" mark. */
  featured?: boolean
}

/**
 * Longest name, tagline and description, in characters, in any language. The
 * name limit keeps a partner's Discord ad (lib/share.ts) inside Discord's
 * 2000 characters, since the name is a line the ad never drops.
 */
export const partnerTextLimits = { name: 60, tagline: 80, description: 600 } as const

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
export const partners: Partner[] = [
  {
    slug: 'vulnradar',
    name: 'VulnRadar',
    tagline: 'Paste a URL, get a website security report in under 3 seconds.',
    description:
      'VulnRadar scans any website for security issues: 905+ checks across headers, TLS, cookies, DNS and exposed secrets, with no agent to install.\n\nEvery finding comes with the evidence behind it and a config fix you can paste into Nginx, Caddy, Express or Next.js. The whole engine is open source under GPL-3.0.',
    avatar: '/partners/vulnradar/avatar.webp',
    banner: '/partners/vulnradar/banner.webp',
    since: '2026-10',
    socials: {
      discord: 'https://discord.com/invite/Y7R6hdGbNe',
      youtube: 'https://www.youtube.com/@VulnRadar',
      tiktok: 'https://www.tiktok.com/@vulnradar',
      instagram: 'https://www.instagram.com/vulnradar/',
      x: 'https://x.com/vulnradardev',
      github: 'https://github.com/VulnRadar',
      website: 'https://vulnradar.dev',
    },
  },
  {
    slug: 'haskins',
    name: 'Haskins',
    tagline: 'Making mods and playing games while serving my community, a great life!',
    description:
      "I'm Russell Haskins, and I go by my last name online. I make scripts, mods and textures, mainly for FiveM, and I take on projects elsewhere too.\n\nI run Sandbox One, a FiveM server full of random modes I felt like making, from races and military ops to VIP protection and runaway aliens.",
    avatar: '/partners/haskins/avatar.webp',
    banner: '/partners/haskins/banner.webp',
    referralCode: 'HASKINSDRAGSHOSE',
    since: '2026-10',
    games: ['fivem', 'minecraft'],
    socials: {
      discord: 'https://discord.com/users/333693993034448896',
    },
  },
  {
    slug: 'last-stop',
    name: 'Last Stop',
    tagline: 'Game nights, art sharing and giveaways in a welcoming Minecraft community.',
    description:
      'Last Stop is a community Discord server built to give every member a great time, with game nights, art sharing and plenty of giveaways.\n\nWe host two Minecraft servers with WSLATL: a regular server and a busier, casual-friendly Lifesteal server. Clear guidelines keep it fun and welcoming, and you can jump straight into the game servers.',
    avatar: '/partners/last-stop/avatar.webp',
    referralCode: 'TLS',
    since: '2026-10',
    games: ['minecraft'],
    socials: {
      discord: 'https://discord.gg/thelaststop',
    },
  },
  {
    slug: 'vsrp',
    name: 'Volunteer State Roleplay',
    tagline: 'Experience Tennessee Roleplay Like Never Before!',
    description:
      "Volunteer State Roleplay (VSRP) is a Tennessee-based FiveM roleplay community focused on a realistic, enjoyable and welcoming experience. Based in Sevier County, Tennessee, we offer law enforcement, fire and EMS, civilian roleplay and more.\n\nOur goal is an active, friendly community where everyone can create their own stories, meet new people and enjoy quality roleplay. Whether you're experienced or just getting started, there's a place for you at VSRP!",
    avatar: '/partners/vsrp/avatar.webp',
    referralCode: 'TNVSRP10',
    since: '2026-10',
    games: ['fivem'],
    socials: {
      discord: 'https://discord.gg/tnvsrp',
      tiktok: 'https://www.tiktok.com/@vsrp_fivem',
    },
  },
  {
    slug: 'nxtlyfe-zsr',
    name: 'NxtLyfe ZSR',
    tagline: 'Zombie Apocalypse Server',
    description:
      'NxtLyfe ZSR is a FiveM community for people who enjoy the thrill. We have custom scripts and immersive gameplay.',
    avatar: '/partners/nxtlyfe-zsr/avatar.webp',
    referralCode: 'NXTLYFEZSR',
    since: '2026-10',
    games: ['fivem'],
    socials: {
      discord: 'https://discord.gg/sseaUasVEt',
    },
  },
  {
    slug: 'cwgaming32',
    name: 'CWGaming32',
    tagline: 'Pacific Coast Roleplay, the best Cali-based FiveM server',
    description:
      'I am a very persistent person who tries hard to do what I can. I develop, code and make things for people and my community.',
    avatar: '/partners/cwgaming32/avatar.webp',
    banner: '/partners/cwgaming32/banner.webp',
    referralCode: 'CWGAMING32',
    since: '2026-10',
    games: ['fivem'],
    socials: {
      discord: 'https://discord.gg/NNgS5c2rb8',
      tiktok: 'https://www.tiktok.com/@cwgaming32',
    },
  },
  {
    slug: 'turtle',
    name: 'Turtle',
    tagline: 'Twitch streamer playing community games with anyone who wants to join',
    description:
      "My name is Turtle, a Twitch streamer who plays mostly community-style games with anyone who wants to join. I've been creating content since 2011 and love making people laugh.",
    avatar: '/partners/turtle/avatar.webp',
    referralCode: 'TURTLE',
    since: '2026-10',
    games: ['fivem', 'Farming Simulator', 'Among Us', 'American Truck Simulator'],
    socials: {
      discord: 'https://discord.gg/TurtleMafia',
      twitch: 'https://www.twitch.tv/turtle821',
      youtube: 'https://www.youtube.com/@Turtle821',
      tiktok: 'https://www.tiktok.com/@notturtle821',
      website: 'https://www.turtlemafia.net',
    },
    featured: true,
  },
]

import { shortLinks } from '@/config/links'
import { referralDiscountPercent } from '@/config/referral'
import { defaultLocale, locales, type Locale } from '@/i18n/config'
import type { Copy } from '@/i18n/copy/en'
import { languageTag } from '@/i18n/dates'
import { partnerImageTypes } from '@/i18n/routing'
import { slugify } from '@/lib/utils'
import {
  partnerTextLimits,
  referralCodePattern,
  socialPlatformIds,
  type Partner,
  type PartnerText,
  type SocialPlatform,
} from '@/data/partners'

/**
 * The billing panel's sign-up page with a partner's code filled in: the
 * "register" destination in config/links.json, plus ?ref=CODE.
 *
 * Built from that file rather than typed out, so it follows the next change
 * there like every other link. It goes to the destination itself rather than
 * through the /register short link because the code has to arrive intact,
 * and a direct link does not depend on a redirect keeping the query.
 */
export function referralSignupUrl(code: string): string {
  const url = new URL(shortLinks.register.url)
  url.searchParams.set('ref', code)
  return url.toString()
}

/** The referral discount as the reader's language writes a percent: "10%", "10 %". */
export function referralDiscount(locale: Locale): string {
  return new Intl.NumberFormat(languageTag(locale), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(referralDiscountPercent / 100)
}

/** True when the partner shows a referral code: the box on their card and the sign-up button on their profile. */
export function hasReferralCode(partner: Partner): partner is Partner & { referralCode: string } {
  return partner.referralCode !== undefined
}

/**
 * What /partners says about itself, in its intro and in search results and
 * link previews. Both come from here, so they cannot disagree: with no
 * partners yet it is the invitation, never a list that is not there.
 *
 * `codeCount` is how many of the partners show a code (all of them unless
 * said otherwise). When none do, the page must not offer a discount that
 * nobody listed can give.
 */
export function partnersPageText(
  t: Copy['partners'],
  partnerCount: number,
  locale: Locale,
  codeCount: number = partnerCount,
) {
  if (partnerCount === 0) return { intro: t.emptyIntro, description: t.emptyMetaDescription }
  if (codeCount === 0) return { intro: t.introNoCodes, description: t.metaDescriptionNoCodes }
  const percent = referralDiscount(locale)
  return { intro: t.intro(percent), description: t.metaDescription(percent) }
}

/**
 * A partner's profile in search results and link previews: their tagline,
 * then either the sign-up offer with their code or, for a partner with no
 * code, a plain line that says nothing about a code or a discount.
 *
 * The tagline only leads when it is in the page's language: an English one in
 * front of a German sentence reads as a mistake and muddles which language
 * the page is in. It ends with a full stop, so the two read as sentences.
 */
export function partnerMetaDescription(partner: Partner, t: Copy['partners']['profile'], locale: Locale): string {
  const about = hasReferralCode(partner)
    ? t.metaDescription(partner.referralCode, referralDiscount(locale))
    : t.metaDescriptionNoCode(partner.name)
  if (partnerTextLang(partner.tagline, locale)) return about
  const tagline = partnerText(partner.tagline, locale).trim()
  return `${/[.!?]$/.test(tagline) ? tagline : `${tagline}.`} ${about}`
}

/** A partner's own words in one language, or the English when they gave none. */
export function partnerText(text: PartnerText, locale: Locale): string {
  if (typeof text === 'string') return text
  return text[locale] ?? text.en
}

/**
 * The lang attribute for partnerText() on a page in `locale`: nothing when
 * the words are in the page's language, 'en' when they fell back to the
 * English, so a screen reader reads them as English.
 */
export function partnerTextLang(text: PartnerText, locale: Locale): Locale | undefined {
  const translated = typeof text === 'string' ? locale === defaultLocale : text[locale] !== undefined
  return translated ? undefined : defaultLocale
}

/** Every language a piece of partner text is written in, as [locale, text] pairs. */
function partnerTextEntries(text: PartnerText): [string, string][] {
  return typeof text === 'string'
    ? [[defaultLocale, text]]
    : Object.entries(text).map(([key, value]) => [key, value ?? ''])
}

/** Up to two capital letters from a name, for the circle shown when a partner has no picture: "Last Stop" is "LS". */
export function partnerInitials(name: string): string {
  const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  const letters = words.length > 1 ? words.slice(0, 2).map((word) => [...word][0]) : [...(words[0] ?? '?')].slice(0, 2)
  return letters.join('').toLocaleUpperCase()
}

/** Featured partners first; otherwise the order data/partners.ts lists them in. */
export function orderedPartners(list: readonly Partner[]): Partner[] {
  return list.filter((partner) => partner.featured).concat(list.filter((partner) => !partner.featured))
}

interface PlatformRule {
  /** The platform's own name. Brand names are the same in every language. */
  name: string
  /** What a valid link looks like, for the error message. */
  expected: string
  /** True for a link to a page on this platform. Protocol and host basics are checked before it. */
  accepts: (url: URL) => boolean
}

const onHost = (url: URL, hosts: readonly string[]) => hosts.includes(url.hostname)
/** One name after the host: /name or /@name, with an optional trailing slash. */
const handlePath = /^\/@?[\w.-]+\/?$/

/**
 * Each platform, with the sites its links may point to. A link elsewhere
 * fails the tests: it is easy to paste the wrong one, and a partner's
 * profile should never send people somewhere they did not expect.
 */
export const socialPlatforms: Record<SocialPlatform, PlatformRule> = {
  discord: {
    name: 'Discord',
    expected: 'https://discord.gg/<invite>, https://discord.com/invite/<invite> or https://discord.com/users/<number>',
    accepts: (url) =>
      (onHost(url, ['discord.gg']) && /^\/[\w-]+\/?$/.test(url.pathname)) ||
      (onHost(url, ['discord.com', 'www.discord.com']) && /^\/(invite\/[\w-]+|users\/\d+)\/?$/.test(url.pathname)),
  },
  youtube: {
    name: 'YouTube',
    expected: 'https://www.youtube.com/@<handle>',
    accepts: (url) =>
      onHost(url, ['youtube.com', 'www.youtube.com']) &&
      /^\/(@[\w.-]+|(c|channel|user)\/[\w.-]+)\/?$/.test(url.pathname),
  },
  tiktok: {
    name: 'TikTok',
    expected: 'https://www.tiktok.com/@<handle>',
    accepts: (url) => onHost(url, ['tiktok.com', 'www.tiktok.com']) && /^\/@[\w.-]+\/?$/.test(url.pathname),
  },
  twitch: {
    name: 'Twitch',
    expected: 'https://www.twitch.tv/<name>',
    accepts: (url) => onHost(url, ['twitch.tv', 'www.twitch.tv']) && handlePath.test(url.pathname),
  },
  kick: {
    name: 'Kick',
    expected: 'https://kick.com/<name>',
    accepts: (url) => onHost(url, ['kick.com', 'www.kick.com']) && handlePath.test(url.pathname),
  },
  x: {
    name: 'X',
    expected: 'https://x.com/<handle> or https://twitter.com/<handle>',
    accepts: (url) =>
      onHost(url, ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']) && handlePath.test(url.pathname),
  },
  instagram: {
    name: 'Instagram',
    expected: 'https://www.instagram.com/<handle>',
    accepts: (url) => onHost(url, ['instagram.com', 'www.instagram.com']) && handlePath.test(url.pathname),
  },
  steam: {
    name: 'Steam',
    expected: 'https://steamcommunity.com/groups/<name>, /id/<name> or /profiles/<number>',
    accepts: (url) => onHost(url, ['steamcommunity.com']) && /^\/(groups|id|profiles)\/[\w-]+\/?$/.test(url.pathname),
  },
  github: {
    name: 'GitHub',
    expected: 'https://github.com/<name>',
    accepts: (url) => onHost(url, ['github.com']) && handlePath.test(url.pathname),
  },
  website: {
    name: 'Website',
    expected: 'an https address with a real domain',
    accepts: (url) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname) && !/^[\d.]+$/.test(url.hostname),
  },
}

/** A platform's name for a label: its own brand name, or "Website" in the reader's language. */
export function platformName(platform: SocialPlatform, t: Copy): string {
  return platform === 'website' ? t.partners.website : socialPlatforms[platform].name
}

/** Why a social link is not acceptable, or null when it is. */
export function socialLinkProblem(platform: SocialPlatform, href: string): string | null {
  const rule = socialPlatforms[platform]
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return `${platform}: ${href} is not a full address (expected ${rule.expected})`
  }
  if (url.protocol !== 'https:') return `${platform}: ${href} is not https`
  // The parser forgives what a browser reads differently in an href:
  // "https:discord.gg/x" parses as discord.gg, but on the page it is a path
  // on our own site. So the text itself must be a plain https:// address.
  if (!href.startsWith('https://') || /[\s\\]/.test(href)) {
    return `${platform}: ${href} must start with https:// and have no spaces or backslashes`
  }
  if (url.username || url.password || url.port) return `${platform}: ${href} carries a login or a port`
  if (!rule.accepts(url)) return `${platform}: ${href} is not ${rule.expected}`
  return null
}

export interface SocialLink {
  platform: SocialPlatform
  /** The address as the check above read it, so the page links to exactly what was checked. */
  href: string
  /** The address without https:// or a trailing slash: youtube.com/@name. */
  display: string
}

/** A partner's links in the order the profile shows them. */
export function socialLinks(partner: Partner): SocialLink[] {
  return socialPlatformIds.flatMap((platform) => {
    const href = partner.socials[platform]
    if (!href) return []
    const url = new URL(href)
    const display = `${url.hostname.replace(/^www\./, '')}${url.pathname}`.replace(/\/$/, '')
    return [{ platform, href: url.href, display }]
  })
}

/**
 * The games a partner plays, in the order they list them. A game with a page
 * here comes from the games the page already has, so it carries its name in
 * that language and its slug for the link. Any other keeps the name as the
 * partner's entry wrote it and has no slug, so it is shown without a link
 * until its game gets a page.
 */
export function partnerGames<Game extends { slug: string; name: string }>(
  partner: Partner,
  games: readonly Game[],
): (Game | { slug: null; name: string })[] {
  return (partner.games ?? []).map((entry) => {
    const slug = slugify(entry)
    return games.find((game) => game.slug === slug) ?? { slug: null, name: entry.trim() }
  })
}

export interface PartnerCheckContext {
  /** Width and height of a file under public/, or null when there is no such image. */
  imageSize: (publicPath: string) => { width: number; height: number } | null
  /** This month as YYYY-MM, so no partner can start in the future. */
  thisMonth: string
}

/**
 * A picture's file name inside its partner's folder, such as avatar.webp:
 * lowercase letters, digits and hyphens, then one of the types the folder
 * serves (i18n/routing.ts). Nothing else gets through, so no backslash, %2F
 * or ".." can point a picture outside the folder.
 */
const imageFileName = new RegExp(`^[a-z0-9]+(-[a-z0-9]+)*\\.(${partnerImageTypes.join('|')})$`)

/**
 * Everything wrong with a list of partners, one line each, so a failing test
 * names every problem at once. tests/partners.test.ts runs it on
 * data/partners.ts.
 */
export function partnerProblems(list: readonly Partner[], context: PartnerCheckContext): string[] {
  const problems: string[] = []
  const seen = { slugs: new Set<string>(), codes: new Set<string>() }

  for (const partner of list) {
    const at = (problem: string) => problems.push(`${partner.slug || '(no slug)'}: ${problem}`)

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(partner.slug)) at('slug must be lowercase letters, digits and hyphens')
    if (seen.slugs.has(partner.slug)) at('slug is used twice')
    seen.slugs.add(partner.slug)

    if (!partner.name.trim() || partner.name !== partner.name.trim()) at('name is empty or has spaces around it')

    // The code is optional. When it is there it has to be a real one; an
    // empty string is a slip, not "no code", so it fails the pattern.
    if (partner.referralCode !== undefined) {
      if (!referralCodePattern.test(partner.referralCode)) {
        at(`referral code "${partner.referralCode}" must be 1 to 32 characters, A to Z and 0 to 9 (or left out)`)
      }
      if (seen.codes.has(partner.referralCode)) at(`referral code ${partner.referralCode} is used twice`)
      seen.codes.add(partner.referralCode)
    }

    if (partner.name.length > partnerTextLimits.name) {
      at(`name is ${partner.name.length} characters, over ${partnerTextLimits.name}`)
    }

    for (const field of ['tagline', 'description'] as const) {
      const entries = partnerTextEntries(partner[field])
      if (!entries.some(([locale]) => locale === defaultLocale)) at(`${field} has no English`)
      for (const [locale, text] of entries) {
        if (!(locales as readonly string[]).includes(locale)) at(`${field} has a language we do not publish: ${locale}`)
        if (!text.trim()) at(`${field} (${locale}) is empty`)
        if (text.length > partnerTextLimits[field]) {
          at(`${field} (${locale}) is ${text.length} characters, over ${partnerTextLimits[field]}`)
        }
      }
    }

    const month = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(partner.since)
    if (!month) at(`since ${partner.since} must be YYYY-MM`)
    else if (partner.since > context.thisMonth) at(`since ${partner.since} is in the future`)

    // A game without a page here is allowed: it shows without a link until it
    // has one. The same game twice (by slug or by name) is a slip.
    const games = partner.games ?? []
    for (const game of games) if (!game.trim() || game.length > 60) at(`game "${game}" must be 1 to 60 characters`)
    if (new Set(games.map(slugify)).size !== games.length) at('a game is listed twice')

    for (const platform of Object.keys(partner.socials) as SocialPlatform[]) {
      const href = partner.socials[platform]
      if (!(socialPlatformIds as readonly string[]).includes(platform)) at(`unknown platform ${platform}`)
      else if (href !== undefined) {
        const problem = socialLinkProblem(platform, href)
        if (problem) at(problem)
      }
    }

    const folder = `/partners/${partner.slug}/`
    for (const [kind, path] of [
      ['avatar', partner.avatar],
      ['banner', partner.banner],
    ] as const) {
      // A picture is optional, but one that is given must pass every check below.
      if (path === undefined) continue
      // A path that fails either check is never looked up, so it cannot reach another file.
      if (!path.startsWith(folder)) {
        at(`${kind} must be in ${folder}`)
        continue
      }
      if (!imageFileName.test(path.slice(folder.length))) {
        at(
          `${kind} ${path} must be a WebP, PNG or JPEG file directly in ${folder}, named in lowercase letters, digits and hyphens`,
        )
        continue
      }
      const size = context.imageSize(path)
      if (!size) {
        at(`${kind} ${path} is missing from public/`)
        continue
      }
      if (kind === 'avatar' && (size.width !== size.height || size.width < 256)) {
        at(`avatar is ${size.width}x${size.height}; it must be square and at least 256px`)
      }
      const ratio = size.width / size.height
      if (kind === 'banner' && (ratio < 2.5 || ratio > 3.5 || size.width < 1200)) {
        at(`banner is ${size.width}x${size.height}; it must be about 3:1 and at least 1200px wide`)
      }
    }
  }

  return problems
}

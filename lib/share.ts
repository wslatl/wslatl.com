import { siteConfig } from '@/config/site'
import { localePath, type Locale } from '@/i18n/config'
import type { Copy } from '@/i18n/copy/en'
import type { Commitment, Feature } from '@/data/features'
import type { Service } from '@/data/services'
import { ramNeedGb, type GameEntry } from '@/data/games'
import type { Partner } from '@/data/partners'
import type { ProductLine } from '@/data/pricing'
import {
  hasReferralCode,
  partnerText,
  referralDiscount,
  socialLinks,
  socialPlatforms,
} from '@/lib/partners'
import { cheapestPlanWithRam, formatPrice, pricingHref, startingPrice } from '@/lib/pricing'

/**
 * Discord-ready ads: plain text, written in Discord's markdown, that a visitor
 * copies and pastes into a channel.
 *
 * Every builder here is pure: it takes the site's words and data as
 * arguments, so a test can build any ad in any language. The pages call them
 * on the server (with the localized data) and hand the finished text to the
 * <ShareAd> button, so what the preview shows is exactly what gets copied.
 *
 * Shape of every ad: a "## " title, short lines, "- " bullets, and the
 * page's full address on a line of its own at the end, so Discord builds a
 * link preview from that page's picture. Other addresses inside an ad are
 * wrapped in <angle brackets>, which tells Discord not to preview them, so
 * they never push the page's own preview out.
 *
 * Wording lives in i18n/copy/*.ts under `share`. Only facts that are already
 * on the site go in: prices come from data/pricing.ts, and a price is only
 * named where the page itself shows one.
 */

/** Discord's limit for one message from a person without Nitro. */
export const discordLimit = 2000

/** The full address of a page in a language: https://wslatl.com/es/pricing. */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${siteConfig.siteUrl}${localePath(locale, path)}`
}

/**
 * Text that came from somebody else (a partner's name or tagline) made safe
 * to paste: no angle brackets (so no <@id> mention can be written), no
 * @everyone or @here, and Discord's own formatting characters shown as typed.
 */
export function plain(text: string): string {
  return text
    .replace(/[<>]/g, '')
    .replace(/@(everyone|here)/gi, '$1')
    .replace(/[\\*_~`|]/g, (char) => `\\${char}`)
    .replace(/^([#>-])/gm, '\\$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Joins an ad together. `lines` are always kept; each of `extras` is added in
 * order only while the whole ad still fits in Discord's limit, so a long
 * list is cut short instead of the message being refused.
 */
function assemble(lines: string[], extras: string[], url: string): string {
  const tail = `\n\n${url}`
  let body = lines.join('\n')
  for (const extra of extras) {
    if (body.length + 1 + extra.length + tail.length <= discordLimit) body += `\n${extra}`
  }
  return body.replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '') + tail
}

const bullet = (text: string) => `- ${text}`

/** The "Why WSLATL" block closing a product ad, or nothing when there are no points. */
function whySection(t: Copy, why: string[]): string[] {
  return why.length > 0 ? ['', `**${t.share.ad.whyHeading}**`, ...why.map(bullet)] : []
}

const perMonth = (price: number, from: (price: string) => string) => from(formatPrice(price))

interface Context {
  t: Copy
  locale: Locale
}

/** What the site says about itself, in the language of the page. Passed in so the builders stay pure. */
export interface SiteContent {
  commitments: Commitment[]
  lead: Feature
  features: Feature[]
  services: Service[]
  games: GameEntry[]
}

/** Short proof points for the end of a product ad: the lead promise, the first-reply time and the price-notice promise. */
export function whyLines(content: Pick<SiteContent, 'commitments' | 'lead'>): string[] {
  const pick = (id: string) => content.commitments.find((item) => item.id === id)
  return [
    content.lead.title,
    ...(['reply', 'notice'] as const).flatMap((id) => {
      const item = pick(id)
      return item ? [`${item.value}: ${item.label}`] : []
    }),
  ]
}

const asSentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`)

/**
 * The ad for the whole company, shared from the footer: a hook, what we
 * offer (with popular games named), why WSLATL, and where to start. About
 * 1,000 to 1,500 characters; the least important lines drop first.
 */
export function homeAd({ t, locale }: Context, content: SiteContent): string {
  const a = t.share.ad
  const from = (price: number) => `${t.pricing.from} ${formatPrice(price)}${t.pricing.perMonth}`
  const service = (id: string) => content.services.find((item) => item.id === id)
  const featured = content.games.filter((game) => game.featured).map((game) => plain(game.name))
  const game = service('game')
  const vps = service('vps')
  const dedicated = service('dedicated')
  const web = service('web')
  const feature = (id: string) => content.features.find((item) => item.id === id)

  const offer = [
    game &&
      bullet(
        `**${game.title}**, ${from(startingPrice('game'))}. ${[...featured.slice(0, 6), a.andMore(Math.max(content.games.length - 6, 0))].join(', ')}. ${game.features.join(', ')}.`,
      ),
    vps && bullet(`**${vps.title}**, ${from(startingPrice('vps'))}. ${vps.features.join(', ')}.`),
    dedicated && bullet(`**${dedicated.title}**: ${dedicated.features.slice(0, 3).join(', ')}.`),
    web && bullet(`**${web.title}**: ${web.features.slice(0, 3).join(', ')}.`),
  ].filter((line): line is string => Boolean(line))

  const why = [
    bullet(`**${content.lead.title}**`),
    ...(['hardware', 'uptime'] as const).flatMap((id) => {
      const item = feature(id)
      return item ? [bullet(`**${item.title}**: ${asSentence(item.description)}`)] : []
    }),
    ...content.commitments.map((item) => bullet(`**${item.value}**: ${item.label}`)),
  ]

  const lines = [
    `## WSLATL: ${a.brandLine}`,
    a.homeIntro(siteConfig.location),
    '',
    `### ${a.offerHeading}`,
    ...offer,
  ]
  const extras = [
    '',
    `### ${a.whyHeading}`,
    ...why,
    '',
    `### ${a.startHeading}`,
    bullet(`${t.footer.links.supportedGames}: <${absoluteUrl(locale, '/games')}>`),
    bullet(`${t.footer.links.vpsPlans}: <${absoluteUrl(locale, pricingHref('vps'))}>`),
    bullet(`${t.footer.links.partners}: <${absoluteUrl(locale, '/partners')}>`),
  ]
  return assemble(lines, extras, absoluteUrl(locale, '/'))
}

/** The ad for one partner: who they are, their code and the deal (only with a code), their links, their profile. */
export function partnerAd(
  { t, locale }: Context,
  partner: Partner,
  gameNames: string[] = [],
): string {
  const a = t.share.ad
  const name = plain(partner.name)
  const lines = [`## ${name}`, a.partnerIntro(name), plain(partnerText(partner.tagline, locale))]
  if (hasReferralCode(partner)) {
    lines.push('', a.partnerCode(partner.referralCode), a.partnerDiscount(referralDiscount(locale)))
  }
  if (gameNames.length > 0) lines.push('', a.partnerGames(gameNames.map(plain).join(', ')))

  const links = socialLinks(partner)
  const extras =
    links.length > 0
      ? [
          '',
          `**${a.findOnline(name)}**`,
          ...links.map((link) =>
            bullet(
              `${link.platform === 'website' ? t.partners.website : socialPlatforms[link.platform].name}: <${link.href}>`,
            ),
          ),
        ]
      : []
  return assemble(lines, extras, absoluteUrl(locale, `/partners/${partner.slug}`))
}

/**
 * The ad for one game page. `game` and `included` are the page's own
 * localized data. The price is the one the page shows: the cheapest game plan
 * that covers the smallest recommended setup.
 */
export function gameAd(
  { t, locale }: Context,
  game: GameEntry,
  included: string[],
  why: string[] = [],
): string {
  const a = t.share.ad
  const entry = cheapestPlanWithRam('game', ramNeedGb(game.recommendedRam[0]))
  const lines = [`## ${t.games.detail.heading(plain(game.name))}`, plain(game.tagline)]
  if (entry) lines.push('', perMonth(entry.plan.price, a.hostingFrom))
  const extras = [
    '',
    `**${t.games.detail.ramHeading(plain(game.name))}**`,
    ...game.recommendedRam.map((row) => bullet(`${plain(row.players)}: ${plain(row.ram)}`)),
    '',
    `**${t.games.detail.included}**`,
    ...included.slice(0, 4).map((item) => bullet(plain(item))),
    ...whySection(t, why),
  ]
  return assemble(lines, extras, absoluteUrl(locale, `/games/${game.slug}`))
}

/** The ad for the games index: the idea (RAM, not a locked package) and a few featured titles. */
export function gamesIndexAd({ t, locale }: Context, games: GameEntry[]): string {
  const a = t.share.ad
  const featured = games.filter((game) => game.featured)
  const lines = [`## ${t.games.heading}`, a.gamesIntro, a.gamesMore(games.length)]
  const extras = featured.length > 0 ? ['', ...featured.map((game) => bullet(plain(game.name)))] : []
  return assemble(lines, extras, absoluteUrl(locale, '/games'))
}

/** The ad for one plan line (VPS or game servers) on /pricing: its starting price and each group's. */
export function productLineAd({ t, locale }: Context, line: ProductLine, why: string[] = []): string {
  const a = t.share.ad
  const from = (price: number) => `${t.pricing.from} ${formatPrice(price)}${t.pricing.perMonth}`
  const lines = [
    `## ${t.pricing.lines[line.id]}`,
    a.pricingIntro,
    '',
    ...line.groups.map((group) =>
      bullet(`${group.label}: ${group.storageType}, ${from(Math.min(...group.plans.map((plan) => plan.price)))}`),
    ),
  ]
  const extras = ['', `**${t.pricing.included}**`, ...line.included.map((item) => bullet(plain(item))), ...whySection(t, why)]
  return assemble(lines, extras, absoluteUrl(locale, pricingHref(line.id)))
}

/** The "Become a partner" ad for /partners, from the partner program text already on that page. */
export function partnersIndexAd({ t, locale }: Context): string {
  const program = t.partners.program
  const percent = referralDiscount(locale)
  const lines = [
    `## ${program.heading}`,
    program.intro,
    '',
    bullet(`**${program.approved.title}**`),
    bullet(`**${program.code.title}**`),
    bullet(`**${program.discount.title(percent)}**`),
    bullet(`**${program.credit.title}**`),
    bullet(`**${program.profile.title}**`),
  ]
  const extras = ['', program.ticketNote]
  return assemble(lines, extras, absoluteUrl(locale, '/partners'))
}

/** The labels the <ShareAd> button needs, in the language of the page. */
export function shareLabels(t: Copy) {
  const s = t.share
  return {
    copy: s.copyAd,
    copied: s.copied,
    copyFailed: s.copyFailed,
    preview: s.preview,
    previewTitle: s.previewTitle,
    previewHint: s.previewHint,
    share: s.nativeShare,
    close: s.close,
  }
}

export type ShareLabels = ReturnType<typeof shareLabels>

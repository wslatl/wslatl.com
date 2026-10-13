import type { Partner } from '@/data/partners'

/**
 * A made-up partner for the tests, so the checks and the cards can be
 * exercised while data/partners.ts is empty. Never move it into the real
 * list: nobody here agreed to be shown on the site.
 */
export const examplePartner: Partner = {
  slug: 'example-creator',
  name: 'Example Creator',
  tagline: 'Survival servers and weekly community events.',
  description: {
    en: 'A made-up partner used by the tests.\n\nIt has two paragraphs, a translation and every kind of link.',
    es: 'Un socio inventado para las pruebas.',
  },
  avatar: '/partners/example-creator/avatar.webp',
  banner: '/partners/example-creator/banner.webp',
  referralCode: 'EXAMPLE10',
  since: '2026-09',
  games: ['minecraft', 'rust'],
  socials: {
    discord: 'https://discord.gg/example',
    youtube: 'https://www.youtube.com/@example',
    tiktok: 'https://www.tiktok.com/@example',
    twitch: 'https://www.twitch.tv/example',
    kick: 'https://kick.com/example',
    x: 'https://x.com/example',
    instagram: 'https://www.instagram.com/example',
    steam: 'https://steamcommunity.com/groups/example',
    github: 'https://github.com/example',
    website: 'https://example.com',
  },
}

/**
 * The same made-up partner with no referral code: not in the referral program,
 * or one who does not want a code shown. The key is absent, as it is in
 * data/partners.ts for such a partner.
 */
export const partnerWithoutCode: Partner = (() => {
  const partner: Partner = { ...examplePartner }
  delete partner.referralCode
  return partner
})()

/** The sizes of the example's pictures, standing in for files in public/. */
export const exampleImages: Record<string, { width: number; height: number }> = {
  '/partners/example-creator/avatar.webp': { width: 512, height: 512 },
  '/partners/example-creator/banner.webp': { width: 1500, height: 500 },
}

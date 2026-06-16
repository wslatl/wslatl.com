export const siteConfig = {
  name: 'WSLATL LLC',
  description: 'Missouri-based private hosting company offering dedicated servers, game hosting, VPS, and web hosting.',
  shortDescription: 'Private hosting, personal service.',
  location: 'Missouri, USA',
  jurisdiction: 'WSLATL LLC, Missouri, USA',
  siteUrl: 'https://wslatl.com',

  links: {
    site:        'https://wslatl.com',
    billing:     'https://billing.wslatl.com',
    register:    'https://billing.wslatl.com/register',
    gamingPanel: 'https://panel.wslatl.com',
    vpsPanel:    'https://vps.wslatl.com',
    cPanel:      'https://r3.directdns.com:2083/',
    dedicated:   'https://dedicated.wslatl.com/',
    discord:     'https://discord.gg/3eKawhSbAF',
    discordVanity: 'https://discord.gg/3eKawhSbAF',
    status:      'https://status.wslatl.com',
    github:      'https://github.com/wslatl',
  },

  paths: {
    privacy:        '/privacy',
    terms:          '/terms',
    acceptableUse:  '/acceptable-use',
    refund:         '/refund',
    contact:        '/#contact',
  },

  email: {
    support: 'support@wslatl.com',
    info:    'info@wslatl.com',
  },

  trustpilot: {
    profileUrl: 'https://www.trustpilot.com/review/wslatl.com',
  },

  credits: {
    label: 'Made by RejectModders',
    href:  'https://rejectmodders.dev',
  },

  /** Shared by all three policy pages. */
  legal: {
    effectiveDate: 'June 3, 2026',
    companyName:   'WSLATL LLC',
    mailingAddress: 'Missouri, United States',
    discordVanity:  'discord.gg/3eKawhSbAF',
  },
} as const

export type SiteConfig = typeof siteConfig

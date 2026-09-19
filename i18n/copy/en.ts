/**
 * Every word the site's own components render, in English. Other languages
 * copy this shape exactly (i18n/copy/es.ts and friends), and TypeScript fails
 * the build if one of them is missing a key or has one too many.
 *
 * Text that belongs to the data (service descriptions, FAQs, game guidance,
 * legal documents) is not here: it stays in data/ and content/, and its
 * translations live in i18n/content/.
 *
 * The slogan stays in English in every language. It is the brand, the same
 * way the company name is.
 */
export const en = {
  header: {
    skipToContent: 'Skip to main content',
    home: 'WSLATL home',
    discord: 'WSLATL on Discord (opens in a new tab)',
    getStarted: 'Get started',
    openMenu: 'Menu',
    closeMenu: 'Close menu',
    newTab: ' (opens in a new tab)',
    login: 'Login',
    clientPanels: 'Client panels',
    language: 'Language',
    chooseLanguage: 'Choose a language',
    reviewNote: 'New accounts are reviewed by a person, usually the same day.',
  },
  nav: {
    pricing: 'Pricing',
    games: 'Game servers',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    status: 'Status',
  },
  portals: {
    billing: { label: 'Billing portal', description: 'Invoices, orders, and support tickets' },
    gamingPanel: { label: 'Game panel', description: 'Manage game servers' },
    vpsPanel: { label: 'VPS panel', description: 'Manage your VPS' },
    dedicated: { label: 'Dedicated portal', description: 'Manage dedicated servers' },
    cPanel: { label: 'cPanel', description: 'Web hosting and email' },
    register: { label: 'Request access', description: 'New here? Apply for an account' },
  },
  footer: {
    blurb: (location: string) => `Private hosting run by a small team in ${location}. Hosting that actually gives a damn.`,
    columns: {
      hosting: 'Hosting',
      company: 'Company',
      clientArea: 'Client area',
      legal: 'Legal',
    },
    links: {
      vpsPlans: 'VPS plans',
      gamePlans: 'Game server plans',
      supportedGames: 'Supported games',
      dedicated: 'Dedicated servers',
      web: 'Web hosting',
      about: 'About us',
      howItWorks: 'How ordering works',
      contact: 'Contact',
      reviews: 'Reviews on Trustpilot',
      discord: 'Discord',
      status: 'Status page',
    },
    rights: (year: number, company: string) => `© ${year} ${company}. All rights reserved.`,
  },
  email: {
    reveal: 'Show email address',
  },
  home: {
    metaTitle: 'Cheap VPS & Game Server Hosting | WSLATL LLC',
    metaDescription:
      'Affordable VPS hosting, game server hosting (Minecraft, Rust, ARK, FiveM & more), and dedicated servers with DDoS protection and NVMe storage. Missouri-based, and we actually pick up.',
    hero: {
      // Kept in English everywhere: this is the brand line.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'We have worked inside hosting companies. We know what goes wrong. WSLATL exists to fix that: affordable VPS hosting, Minecraft and game server hosting, and dedicated servers, backed by a team that actually picks up.',
      seePlans: 'See plans and pricing',
      products: 'Products',
      entries: {
        vps: 'VPS hosting',
        game: 'Game servers',
        other: 'Dedicated and web hosting',
      },
      from: (price: string) => `from ${price}/mo`,
      quoted: 'Quoted for your build',
    },
    clients: {
      heading: 'Trusted by our clients',
      pause: 'Pause the scrolling client logos',
    },
    services: {
      heading: 'What we host',
      intro:
        'VPS and game servers have published prices. Dedicated servers and web hosting are quoted for what you actually need to run.',
      from: 'from',
      perMonth: '/mo',
      quoted: 'Quoted for your build',
      specSummary: (n: {
        plans: number
        cpuMin: number
        cpuMax: number
        cpuUnit: string
        ramMin: number
        ramMax: number
        storageMin: number
        storageMax: number
      }) =>
        `${n.plans} plans from ${n.cpuMin} to ${n.cpuMax} ${n.cpuUnit}, ${n.ramMin} to ${n.ramMax} GB RAM, and ${n.storageMin} to ${n.storageMax} GB storage.`,
      compareVps: 'Compare VPS plans',
      compareGame: 'Compare game server plans',
      findGame: 'Find your game',
      getQuote: 'Get a quote',
    },
    howItWorks: {
      heading: 'How ordering works',
      intro:
        'We are application-only on purpose. It is how a small team keeps every client properly looked after.',
      step: (n: number) => `Step ${n}: `,
      steps: [
        {
          title: 'Request access',
          description:
            'Fill in a short application in the billing portal. A person reads every one, and most are approved the same day.',
        },
        {
          title: 'Tell us what you need',
          description:
            'Once you are approved, message us on Discord or open a ticket. We talk through your setup with you. No automated flow.',
        },
        {
          title: 'Your server goes live',
          description:
            'We set you up, walk you through your panel, and stay available after. Most clients are up and running the same day.',
        },
      ],
      readyPrefix: 'Ready?',
      requestAccess: 'Request access',
      or: 'or',
      askOnDiscord: 'ask us on Discord',
      readySuffix: 'first.',
    },
    whyUs: {
      heading: 'The difference is personal.',
      intro: 'We have seen how the big hosts operate. We built WSLATL to be the direct opposite.',
      slaNotePrefix: 'Uptime targets for every service, and the credits you get if we miss one, are in our',
      slaLink: 'Service Level Agreement',
      joinDiscord: 'Join our Discord',
      openTicket: 'Open a ticket',
    },
    about: {
      heading: 'We built WSLATL because we got tired of watching hosting companies ignore their clients.',
      paragraphs: [
        'We have worked inside hosting companies. We have seen how tickets pile up, how clients get passed around, how no one actually knows your setup. It is frustrating and it is entirely avoidable.',
        'So we started WSLATL. Based in Missouri, privately run, and small enough that every client actually gets our attention. We are not trying to be the biggest hosting company. We are trying to be the one you would actually recommend to a friend.',
      ],
      closing: 'Every client here is treated like family. That is the only way we know how to do this.',
      quote:
        'In the hosting industry it is tough and you have to stand out. We just want to treat our clients like family and make sure they get the best experience they can.',
      quoteAttribution: 'The WSLATL team',
      teamHeading: 'The people behind WSLATL',
    },
    faq: {
      heading: 'Common questions',
      stillNotSure: 'Still not sure?',
      askOnDiscord: 'Ask us on Discord',
      alwaysAround: '. We are always around.',
    },
    contact: {
      heading: 'A hosting company that treats you like a person. Imagine that.',
      body:
        'Request access and an admin reviews your application. Once you are approved, we get you set up fast. Most clients are live the same day.',
      requestAccess: 'Request access',
      preferToTalk: 'Prefer to talk first?',
      options: {
        discord: {
          title: 'Discord',
          description:
            'Join our server and open a ticket, or DM us directly. This is the fastest way to hear from us.',
          cta: 'Join our Discord',
        },
        billing: {
          title: 'Billing portal ticket',
          description:
            'Already a client? Open a ticket in the billing portal. Best for account and billing questions.',
          cta: 'Open a ticket',
        },
        email: {
          title: 'Email',
          description: 'Prefer email? A person reads every message.',
        },
      },
    },
  },
  pricing: {
    metaTitle: 'Cheap VPS & Game Server Hosting Pricing',
    metaDescription: (vps: string, game: string) =>
      `Published monthly pricing for VPS hosting from ${vps} and game server hosting from ${game}, on SATA SSD or NVMe. No teaser rates, and at least 30 days' notice before any price increase.`,
    heading: 'Pricing',
    intro:
      'Every plan is billed monthly in US dollars. No renewal price traps: these are the regular monthly prices, and any increase comes with at least 30 days of written notice.',
    orderingPrefix: 'Ordering starts with a short application, and most are approved the same day.',
    orderingLink: 'How ordering works',
    lines: {
      vps: 'VPS hosting',
      game: 'Game server hosting',
    },
    from: 'from',
    perMonth: '/mo',
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string }) =>
      `${n.plans} plans. ${n.ramMin} to ${n.ramMax} GB RAM, ${n.cpuMin} to ${n.cpuMax} ${n.cpuUnit}, SATA SSD or NVMe.`,
    seePlans: (line: string) => `See ${line} plans`,
    planTypes: 'Plan types',
    included: 'Included with every plan',
    uptimeIncluded: (target: string) => `${target} monthly uptime target (see our SLA)`,
    storageSuffix: 'storage',
    table: {
      plan: 'Plan',
      ram: 'RAM',
      storage: 'Storage',
      traffic: 'Traffic',
      price: 'Price',
      order: 'Order',
      orderPlan: (plan: string) => ` ${plan} (opens in a new tab)`,
      caption: (group: string) => `${group} plans, monthly prices in US dollars`,
    },
    custom: {
      heading: 'Dedicated servers and web hosting',
      body:
        'These are quoted per build rather than sold off a price list, because the right hardware or setup depends on what you are running. Tell us what you need and we will come back with a price.',
      cta: 'Get a quote',
    },
  },
  games: {
    metaTitle: (more: number) => `Game Server Hosting: Minecraft, Rust, ARK, FiveM & ${more}+ More`,
    metaDescription: (price: string) =>
      `DDoS-protected game server hosting from ${price}/mo on NVMe and SATA SSD hardware. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld and dozens more, all on the same Pterodactyl panel.`,
    heading: 'Game server hosting',
    crumb: 'Games',
    introPrefix:
      'Every game runs on the same Pterodactyl-powered plans: you pick the RAM, not a game-locked package. Find your game for realistic RAM guidance, then compare',
    introLink: 'game server plans',
    introSuffix: '. Do not see yours? If it has a dedicated server, we can almost always run it.',
    searchLabel: 'Search games',
    searchPlaceholder: (count: number) => `Search ${count} games`,
    categories: 'Game categories',
    // Filled in by the browser (components/games/game-directory.tsx), so
    // these are templates rather than functions: a Client Component can only
    // be handed plain values.
    matchCount: '{shown} of {total} games match',
    showing: '{shown} of {total} games',
    noMatch: 'No game matches "{query}".',
    noMatchHelp: 'If it has a dedicated server, we can almost always run it on the same plans.',
    askOnDiscord: 'Ask us on Discord',
    featured: 'Featured games',
    fromPrice: 'from {price}/mo',
    toStart: '{ram} to start',
    detail: {
      metaTitle: (game: string) => `${game} Server Hosting`,
      heading: (game: string) => `${game} server hosting`,
      order: (game: string) => `Order your ${game} server`,
      comparePlans: 'Compare plans',
      listedUnderPrefix: 'Listed under',
      listedUnderSuffix: '. Plans are not locked to one game, so you can switch titles any time.',
      ramHeading: (game: string) => `How much RAM does ${game} need?`,
      ramCaption: (game: string) => `Recommended RAM for ${game} and the smallest plans that cover it`,
      setup: 'Setup',
      recommendedRam: 'Recommended RAM',
      smallestPlans: 'Smallest plans that fit',
      fits: 'Fits:',
      perMap: 'Per map: ',
      or: ' or ',
      tooBig: 'Bigger than our game plans: ask us',
      ramNote: 'These are starting points, not hard limits. Every plan can be changed later as your server grows.',
      popular: (game: string) => `Popular ${game} setups`,
      included: 'Included with every game plan',
      questions: (game: string) => `${game} hosting questions`,
      moreIn: (category: string) => `More ${category} games`,
      allGames: 'All games',
    },
  },
  legal: {
    metaTitle: 'Legal',
    metaDescription:
      'Every WSLATL LLC policy in one place: privacy, terms of service, acceptable use, refunds, SLA, DMCA, abuse, account credit, subprocessors, and backups.',
    heading: 'Legal',
    intro:
      'Our policies, written to be read. Each one shows the date it took effect, and each one can change on its own, so check the date on the document you are relying on.',
    effective: 'Effective',
    jurisdiction: 'Jurisdiction',
    questions: 'Questions',
    onThisPage: 'On this page',
    documents: 'Legal documents',
    questionsHeading: 'Questions about this document?',
    questionsBody: 'We are a small team. You can actually talk to us.',
    askOnDiscord: 'Ask on Discord',
    translationNotice:
      'This translation is provided so it can be read in your own language. The English version of this document is the one that applies.',
    readInEnglish: 'Read the English version',
  },
  notFound: {
    metaTitle: 'Page not found',
    heading: 'This page does not exist.',
    body: 'The link may be old, or the address may have a typo. Here is where most people are headed:',
    destinations: {
      pricing: 'Plans and pricing',
      games: 'Game server hosting',
      services: 'What we host',
      legal: 'Legal documents',
    },
    home: 'Back to the home page',
    askOnDiscord: 'Ask us on Discord',
  },
  breadcrumbs: {
    home: 'Home',
  },
}

export type Copy = typeof en

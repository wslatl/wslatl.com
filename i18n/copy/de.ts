import type { Copy } from '@/i18n/copy/en'

/** German copy for the site's own components. */
export const de: Copy = {
  header: {
    skipToContent: 'Zum Hauptinhalt springen',
    home: 'WSLATL Startseite',
    discord: 'WSLATL auf Discord (öffnet in einem neuen Tab)',
    getStarted: 'Loslegen',
    openMenu: 'Menü',
    closeMenu: 'Menü schließen',
    newTab: ' (öffnet in einem neuen Tab)',
    login: 'Login',
    clientPanels: 'Kundenpanels',
    language: 'Sprache',
    chooseLanguage: 'Sprache auswählen',
    reviewNote: 'Neue Konten prüft ein Mensch, meistens noch am selben Tag.',
  },
  nav: {
    pricing: 'Preise',
    games: 'Gameserver',
    services: 'Leistungen',
    about: 'Über uns',
    contact: 'Kontakt',
    status: 'Status',
  },
  portals: {
    billing: { label: 'Abrechnungsportal', description: 'Rechnungen, Bestellungen und Support-Tickets' },
    gamingPanel: { label: 'Gameserver-Panel', description: 'Gameserver verwalten' },
    vpsPanel: { label: 'VPS-Panel', description: 'Deinen VPS verwalten' },
    dedicated: { label: 'Dedicated-Portal', description: 'Dedicated Server verwalten' },
    cPanel: { label: 'cPanel', description: 'Webhosting und E-Mail' },
    register: { label: 'Zugang anfragen', description: 'Neu hier? Konto beantragen' },
  },
  footer: {
    blurb: (location: string) => `Privat geführtes Hosting von einem kleinen Team in ${location}. Hosting that actually gives a damn.`,
    columns: {
      hosting: 'Hosting',
      company: 'Unternehmen',
      clientArea: 'Kundenbereich',
      legal: 'Rechtliches',
    },
    links: {
      vpsPlans: 'VPS-Tarife',
      gamePlans: 'Gameserver-Tarife',
      supportedGames: 'Unterstützte Spiele',
      dedicated: 'Dedicated Server',
      web: 'Webhosting',
      about: 'Über uns',
      howItWorks: 'So läuft eine Bestellung',
      contact: 'Kontakt',
      reviews: 'Bewertungen auf Trustpilot',
      discord: 'Discord',
      status: 'Statusseite',
    },
    rights: (year: number, company: string) => `© ${year} ${company}. Alle Rechte vorbehalten.`,
  },
  email: {
    reveal: 'E-Mail-Adresse anzeigen',
  },
  home: {
    metaTitle: 'Günstiges VPS- & Gameserver-Hosting | WSLATL LLC',
    metaDescription:
      'Bezahlbares VPS-Hosting, Gameserver-Hosting (Minecraft, Rust, ARK, FiveM und mehr) und Dedicated Server mit DDoS-Schutz und NVMe-Speicher. Aus Missouri, und wir melden uns wirklich.',
    hero: {
      // Bleibt in jeder Sprache Englisch: das ist die Markenzeile.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'Wir haben in Hosting-Unternehmen gearbeitet. Wir wissen, was dort schiefläuft. WSLATL gibt es, um genau das zu beheben: bezahlbares VPS-Hosting, Minecraft- und Gameserver-Hosting und Dedicated Server, dahinter ein Team, das sich wirklich meldet.',
      seePlans: 'Tarife und Preise ansehen',
      products: 'Produkte',
      entries: {
        vps: 'VPS-Hosting',
        game: 'Gameserver',
        other: 'Dedicated Server und Webhosting',
      },
      from: (price: string) => `ab ${price}/Monat`,
      quoted: 'Angebot für dein Setup',
    },
    clients: {
      heading: 'Unsere Kunden vertrauen uns',
      pause: 'Die laufenden Kundenlogos anhalten',
    },
    services: {
      heading: 'Was wir hosten',
      intro:
        'Für VPS und Gameserver sind die Preise veröffentlicht. Dedicated Server und Webhosting bekommen ein Angebot, das zu dem passt, was du wirklich betreiben musst.',
      from: 'ab',
      perMonth: '/Monat',
      quoted: 'Angebot für dein Setup',
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
        `${n.plans} Tarife von ${n.cpuMin} bis ${n.cpuMax} ${n.cpuUnit}, ${n.ramMin} bis ${n.ramMax} GB RAM und ${n.storageMin} bis ${n.storageMax} GB Speicher.`,
      compareVps: 'VPS-Tarife vergleichen',
      compareGame: 'Gameserver-Tarife vergleichen',
      findGame: 'Finde dein Spiel',
      getQuote: 'Angebot anfordern',
    },
    howItWorks: {
      heading: 'So läuft eine Bestellung',
      intro:
        'Wir nehmen bewusst nur auf Bewerbung auf. So schafft es ein kleines Team, sich um jeden Kunden richtig zu kümmern.',
      step: (n: number) => `Schritt ${n}: `,
      steps: [
        {
          title: 'Zugang anfragen',
          description:
            'Füll im Abrechnungsportal eine kurze Bewerbung aus. Ein Mensch liest jede einzelne, und die meisten werden noch am selben Tag freigegeben.',
        },
        {
          title: 'Sag uns, was du brauchst',
          description:
            'Sobald du freigegeben bist, schreib uns auf Discord oder öffne ein Ticket. Wir gehen dein Setup gemeinsam mit dir durch. Kein automatisierter Ablauf.',
        },
        {
          title: 'Dein Server geht online',
          description:
            'Wir richten dich ein, zeigen dir dein Panel und bleiben danach erreichbar. Die meisten Kunden laufen noch am selben Tag.',
        },
      ],
      readyPrefix: 'Bereit?',
      requestAccess: 'Zugang anfragen',
      or: 'oder',
      askOnDiscord: 'frag uns auf Discord,',
      readySuffix: 'wenn du vorher reden willst.',
    },
    whyUs: {
      heading: 'Der Unterschied ist persönlich.',
      intro: 'Wir haben gesehen, wie die großen Hoster arbeiten. WSLATL haben wir als genaues Gegenteil gebaut.',
      slaNotePrefix: 'Die Uptime-Ziele für jeden Service und die Gutschriften, die du bekommst, wenn wir eins verfehlen, stehen in unserem',
      slaLink: 'Service Level Agreement',
      joinDiscord: 'Komm auf unseren Discord',
      openTicket: 'Ticket öffnen',
    },
    about: {
      heading: 'Wir haben WSLATL gegründet, weil wir es leid waren zuzusehen, wie Hosting-Unternehmen ihre Kunden ignorieren.',
      paragraphs: [
        'Wir haben in Hosting-Unternehmen gearbeitet. Wir haben gesehen, wie sich Tickets stapeln, wie Kunden herumgereicht werden, wie niemand dein Setup wirklich kennt. Das ist frustrierend und völlig vermeidbar.',
        'Also haben wir WSLATL gestartet. Ansässig in Missouri, privat geführt und klein genug, dass jeder Kunde wirklich unsere Aufmerksamkeit bekommt. Wir wollen nicht das größte Hosting-Unternehmen sein. Wir wollen das sein, das du einem Freund wirklich empfehlen würdest.',
      ],
      closing: 'Jeder Kunde wird hier wie Familie behandelt. Anders können wir das gar nicht.',
      quote:
        'Die Hosting-Branche ist hart und man muss herausstechen. Wir wollen unsere Kunden einfach wie Familie behandeln und dafür sorgen, dass sie die bestmögliche Erfahrung haben.',
      quoteAttribution: 'Das WSLATL Team',
      teamHeading: 'Die Menschen hinter WSLATL',
    },
    faq: {
      heading: 'Häufige Fragen',
      stillNotSure: 'Noch unsicher?',
      askOnDiscord: 'Frag uns auf Discord',
      alwaysAround: '. Wir sind immer da.',
    },
    contact: {
      heading: 'Ein Hosting-Unternehmen, das dich wie einen Menschen behandelt. Stell dir das vor.',
      body:
        'Frag Zugang an, und ein Admin sieht sich deine Bewerbung an. Sobald du freigegeben bist, richten wir dich schnell ein. Die meisten Kunden sind noch am selben Tag online.',
      requestAccess: 'Zugang anfragen',
      preferToTalk: 'Lieber erst reden?',
      options: {
        discord: {
          title: 'Discord',
          description:
            'Komm auf unseren Server und öffne ein Ticket oder schreib uns direkt per DM. So hörst du am schnellsten von uns.',
          cta: 'Komm auf unseren Discord',
        },
        billing: {
          title: 'Ticket im Abrechnungsportal',
          description:
            'Schon Kunde? Öffne ein Ticket im Abrechnungsportal. Am besten für Fragen zu Konto und Rechnungen.',
          cta: 'Ticket öffnen',
        },
        email: {
          title: 'E-Mail',
          description: 'Lieber per E-Mail? Ein Mensch liest jede Nachricht.',
        },
      },
    },
  },
  pricing: {
    metaTitle: 'Preise für günstiges VPS- & Gameserver-Hosting',
    metaDescription: (vps: string, game: string) =>
      `Veröffentlichte Monatspreise für VPS-Hosting ab ${vps} und Gameserver-Hosting ab ${game}, auf SATA SSD oder NVMe. Keine Lockpreise, und mindestens 30 Tage Ankündigung vor jeder Preiserhöhung.`,
    heading: 'Preise',
    intro:
      'Jeder Tarif wird monatlich in US-Dollar abgerechnet. Keine Preisfallen bei der Verlängerung: Das sind die regulären Monatspreise, und jede Erhöhung kommt mit mindestens 30 Tagen schriftlicher Ankündigung.',
    orderingPrefix: 'Eine Bestellung beginnt mit einer kurzen Bewerbung, und die meisten werden noch am selben Tag freigegeben.',
    orderingLink: 'So läuft eine Bestellung',
    lines: {
      vps: 'VPS-Hosting',
      game: 'Gameserver-Hosting',
    },
    from: 'ab',
    perMonth: '/Monat',
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string }) =>
      `${n.plans} Tarife. ${n.ramMin} bis ${n.ramMax} GB RAM, ${n.cpuMin} bis ${n.cpuMax} ${n.cpuUnit}, SATA SSD oder NVMe.`,
    seePlans: (line: string) => `${line}-Tarife ansehen`,
    planTypes: 'Tarifarten',
    included: 'In jedem Tarif enthalten',
    uptimeIncluded: (target: string) => `${target} Uptime-Ziel pro Monat (siehe unser SLA)`,
    storageSuffix: 'Speicher',
    table: {
      plan: 'Tarif',
      ram: 'RAM',
      storage: 'Speicher',
      traffic: 'Traffic',
      price: 'Preis',
      order: 'Bestellen',
      orderPlan: (plan: string) => ` ${plan} (öffnet in einem neuen Tab)`,
      caption: (group: string) => `${group}: Tarife mit Monatspreisen in US-Dollar`,
    },
    custom: {
      heading: 'Dedicated Server und Webhosting',
      body:
        'Die gibt es als Angebot pro Aufbau statt von der Preisliste, weil die richtige Hardware oder Einrichtung davon abhängt, was du betreibst. Sag uns, was du brauchst, und wir melden uns mit einem Preis.',
      cta: 'Angebot anfordern',
    },
  },
  games: {
    metaTitle: (more: number) => `Gameserver-Hosting: Minecraft, Rust, ARK, FiveM und ${more}+ weitere`,
    metaDescription: (price: string) =>
      `DDoS-geschütztes Gameserver-Hosting ab ${price}/Monat auf NVMe- und SATA-SSD-Hardware. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld und dutzende mehr, alle auf demselben Pterodactyl-Panel.`,
    heading: 'Gameserver-Hosting',
    crumb: 'Spiele',
    introPrefix:
      'Jedes Spiel läuft auf denselben Tarifen mit Pterodactyl: Du wählst den RAM, kein an ein Spiel gebundenes Paket. Such dein Spiel für realistische RAM-Empfehlungen und vergleiche dann die',
    introLink: 'Gameserver-Tarife',
    introSuffix: '. Deins ist nicht dabei? Wenn es dafür einen Dedicated Server gibt, können wir es fast immer betreiben.',
    searchLabel: 'Spiele durchsuchen',
    searchPlaceholder: (count: number) => `${count} Spiele durchsuchen`,
    categories: 'Spielkategorien',
    // Vom Browser gefüllt (components/games/game-directory.tsx), deshalb
    // Vorlagen statt Funktionen: einer Client Component lassen sich nur
    // einfache Werte übergeben.
    matchCount: '{shown} von {total} Spielen passen',
    showing: '{shown} von {total} Spielen',
    noMatch: 'Kein Spiel passt zu "{query}".',
    noMatchHelp: 'Wenn es dafür einen Dedicated Server gibt, können wir es fast immer auf denselben Tarifen betreiben.',
    askOnDiscord: 'Frag uns auf Discord',
    featured: 'Ausgewählte Spiele',
    fromPrice: 'ab {price}/Monat',
    toStart: '{ram} für den Anfang',
    detail: {
      metaTitle: (game: string) => `${game} Server-Hosting`,
      heading: (game: string) => `${game} Server-Hosting`,
      order: (game: string) => `Deinen ${game} Server bestellen`,
      comparePlans: 'Tarife vergleichen',
      listedUnderPrefix: 'Gelistet unter',
      listedUnderSuffix: '. Tarife sind nicht an ein Spiel gebunden, du kannst also jederzeit den Titel wechseln.',
      ramHeading: (game: string) => `Wie viel RAM braucht ${game}?`,
      ramCaption: (game: string) => `Empfohlener RAM für ${game} und die kleinsten Tarife, die dafür reichen`,
      setup: 'Setup',
      recommendedRam: 'Empfohlener RAM',
      smallestPlans: 'Kleinste passende Tarife',
      fits: 'Passt:',
      perMap: 'Pro Map: ',
      or: ' oder ',
      tooBig: 'Größer als unsere Gameserver-Tarife: frag uns',
      ramNote: 'Das sind Ausgangspunkte, keine harten Grenzen. Jeder Tarif lässt sich später ändern, wenn dein Server wächst.',
      popular: (game: string) => `Beliebte ${game} Setups`,
      included: 'In jedem Gameserver-Tarif enthalten',
      questions: (game: string) => `Fragen zu ${game} Hosting`,
      moreIn: (category: string) => `Mehr Spiele aus ${category}`,
      allGames: 'Alle Spiele',
    },
  },
  legal: {
    metaTitle: 'Rechtliches',
    metaDescription:
      'Alle Richtlinien von WSLATL LLC an einem Ort: Datenschutz, Nutzungsbedingungen, zulässige Nutzung, Erstattungen, SLA, DMCA, Missbrauch, Guthaben, Unterauftragsverarbeiter und Backups.',
    heading: 'Rechtliches',
    intro:
      'Unsere Richtlinien, geschrieben zum Lesen. Jede zeigt das Datum, ab dem sie gilt, und jede kann sich einzeln ändern. Schau also auf das Datum des Dokuments, auf das du dich verlässt.',
    effective: 'Gültig ab',
    jurisdiction: 'Gerichtsstand',
    questions: 'Fragen',
    onThisPage: 'Auf dieser Seite',
    documents: 'Rechtliche Dokumente',
    questionsHeading: 'Fragen zu diesem Dokument?',
    questionsBody: 'Wir sind ein kleines Team. Du kannst wirklich mit uns reden.',
    askOnDiscord: 'Auf Discord fragen',
    translationNotice:
      'Diese Übersetzung gibt es, damit du das Dokument in deiner eigenen Sprache lesen kannst. Maßgeblich ist die englische Fassung dieses Dokuments.',
    readInEnglish: 'Englische Fassung lesen',
  },
  notFound: {
    metaTitle: 'Seite nicht gefunden',
    heading: 'Diese Seite gibt es nicht.',
    body: 'Der Link ist vielleicht alt, oder in der Adresse steckt ein Tippfehler. Hier ist, wo die meisten hinwollen:',
    destinations: {
      pricing: 'Tarife und Preise',
      games: 'Gameserver-Hosting',
      services: 'Was wir hosten',
      legal: 'Rechtliche Dokumente',
    },
    home: 'Zurück zur Startseite',
    askOnDiscord: 'Frag uns auf Discord',
  },
  breadcrumbs: {
    home: 'Startseite',
  },
}

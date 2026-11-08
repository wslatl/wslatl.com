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
    mainNav: 'Hauptmenü',
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
    partners: 'Partner',
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
    blurb: (location: string) => `Privat geführtes Hosting von einem kleinen Team in ${location}.`,
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
      guides: 'Anleitungen',
      dedicated: 'Dedicated Server',
      web: 'Webhosting',
      about: 'Über uns',
      partners: 'Partner',
      brandKit: 'Marken-Kit',
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
    metaTitle: 'WSLATL: Gameserver, VPS und Dedicated Server aus Missouri',
    metaDescription: (game: string, vps: string) =>
      `WSLATL ist ein kleiner Hoster aus Missouri, Aufnahme nur auf Bewerbung. Gameserver ab ${game}, VPS ab ${vps}, Dedicated Server, und wir melden uns wirklich.`,
    hero: {
      // Bleibt in jeder Sprache Englisch: das ist die Markenzeile.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'Wir haben in Hosting-Unternehmen gearbeitet. Wir wissen, was dort schiefläuft. WSLATL gibt es, um genau das zu beheben: VPS-Hosting mit offen veröffentlichten Preisen, Minecraft- und Gameserver-Hosting und Dedicated Server, dahinter ein Team, das sich wirklich meldet.',
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
          title: 'Wähl einen Tarif oder sag uns, was du brauchst',
          description:
            'Sobald du freigegeben bist, bestellst du einen Gameserver oder VPS im Abrechnungsportal und bezahlst online. Für einen Dedicated Server oder Webhosting schreib uns auf Discord oder öffne ein Ticket, und wir richten alles gemeinsam mit dir ein.',
        },
        {
          title: 'Dein Server geht online',
          description:
            'Gameserver und VPS laufen meist noch am selben Tag. Dedicated Server brauchen länger, meist ein paar Werktage. Wir zeigen dir dein Panel und bleiben danach erreichbar.',
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
      alwaysAround: '. In aktiven Zeiten antworten wir meist innerhalb einer Stunde.',
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
    metaTitle: 'Preise für VPS und Gameserver, alle Pakete offen',
    metaDescription: (vps: string, game: string) =>
      `VPS ab ${vps} und Gameserver ab ${game} im Monat, mit allen technischen Daten. Keine Lockpreise, und mindestens 30 Tage Ankündigung vor jeder Preiserhöhung.`,
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
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string; storage: string[] }) =>
      `${n.plans} Tarife. ${n.ramMin} bis ${n.ramMax} GB RAM, ${n.cpuMin} bis ${n.cpuMax} ${n.cpuUnit}, ${n.storage.join(' oder ')}.`,
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
      popular: 'Beliebt',
      notAvailable: 'k. A.',
      price: 'Preis',
      order: 'Bestellen',
      orderPlan: (plan: string) => ` ${plan} (öffnet in einem neuen Tab)`,
      caption: (group: string) => `${group}: Tarife mit Monatspreisen in US-Dollar`,
    },
    custom: {
      heading: 'Dedicated Server und Webhosting',
      body:
        'Die gibt es als Angebot pro Aufbau statt von der Preisliste, weil die richtige Hardware oder Einrichtung davon abhängt, was du betreibst. Sag uns, was du brauchst, und wir melden uns mit einem Preis. Schon Kunde? Öffne im Abrechnungsportal „Browse plans“, wähl auf dem Tab „Dedicated servers“ einen Server und klick auf „Request this server“. Die Einrichtung eines Dedicated Servers dauert länger als bei Gameservern und VPS, meist ein paar Werktage.',
      cta: 'Angebot anfordern',
    },
  },
  games: {
    metaTitle: (more: number) => `Gameserver mieten: Minecraft, Rust, ARK und ${more}+ weitere`,
    metaDescription: (price: string) =>
      `Gameserver ab ${price}/Monat, bezahlt nach RAM statt nach Spiel. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld und mehr auf einem Pterodactyl-Panel.`,
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
      metaTitle: (game: string, price: string) => `${game} Server mieten ab ${price}/Monat`,
      metaDescription: (game: string, price: string, tagline: string) =>
        `Miete deinen eigenen ${game} Server bei WSLATL ab ${price} im Monat. ${tagline}`,
      metaDescriptionNoPrice: (game: string, tagline: string) =>
        `Miete deinen eigenen ${game} Server bei WSLATL. Frag uns nach einem passenden Tarif. ${tagline}`,
      heading: (game: string) => `${game} Server-Hosting`,
      order: (game: string) => `Deinen ${game} Server bestellen`,
      comparePlans: 'Tarife vergleichen',
      listedUnderPrefix: 'Gelistet unter',
      listedUnderSuffix: '. Tarife sind nicht an ein Spiel gebunden, du kannst also jederzeit den Titel wechseln.',
      guidesIntro: 'Du richtest deinen Server selbst ein?',
      guidesLink: (game: string) => `Zu den Server-Anleitungen für ${game}`,
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
      plansHeading: 'Gameserver-Tarife',
      plansIntro:
        'Dieselben Tarife laufen für jedes Spiel, das wir hosten. Premium läuft auf einem AMD Ryzen 9 3900X mit NVMe-Speicher, Budget auf einem älteren Intel Core i7-6700K mit SATA SSD.',
      atAGlance: (game: string) => `${game} Hosting auf einen Blick`,
      hosting: (game: string) => `${game} Hosting`,
      budgetNote: 'Budget-Tarife laufen auf einer älteren, stärker ausgelasteten CPU, deshalb können sie zu Stoßzeiten langsamer sein.',
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
    notTranslated: "Dieses Dokument ist noch nicht übersetzt und wird deshalb auf Englisch angezeigt. Maßgeblich ist ohnehin die englische Fassung.",
    emailsJoin: "oder",
    emailLabel: "E-Mail",
    uptimeTable: {
      service: "Dienst",
      target: "Monatliches Uptime-Ziel",
      label: "Monatliche Uptime-Ziele",
    },
  },
  partners: {
    metaTitle: 'Offizielle Partner',
    metaDescription: (percent: string) =>
      `Creator und Communities, mit denen wir arbeiten. Mit dem Code eines Partners ${percent} Rabatt auf deine erste Rechnung fürs Hosting, außer bei Dedicated Servern.`,
    metaDescriptionNoCodes:
      'Creator und Communities, mit denen wir zusammenarbeiten, von unserem Team freigegeben. Sieh, wer sie sind und wo du sie online findest.',
    emptyMetaDescription:
      'Wir wählen gerade unsere ersten offiziellen Partner aus. Du machst Videos, streamst oder leitest eine Community? Erfahre, wie unser Partnerprogramm funktioniert und wie du mitmachst.',
    heading: 'Offizielle Partner',
    crumb: 'Partner',
    intro: (percent: string) =>
      `Creator und Communities, die unser Team freigegeben hat. Melde dich mit einem ihrer Empfehlungscodes an und du erhältst ${percent} Rabatt auf die erste Rechnung für dein Hosting, außer bei Dedicated Servern.`,
    introNoCodes: 'Creator und Communities, die unser Team freigegeben hat.',
    emptyIntro:
      'Wir wählen gerade unsere ersten offiziellen Partner aus. Du machst Videos, streamst oder leitest eine Community? Diese Seite könnte mit dir beginnen.',
    featured: 'Hervorgehoben',
    officialPartner: 'Offizieller Partner',
    since: (month: string) => `Partner seit ${month}`,
    referralCode: 'Empfehlungscode',
    copy: 'Kopieren',
    copied: 'Kopiert',
    copyFailed: 'Der Code ist markiert. Kopiere ihn über die Tastatur oder das Menü.',
    viewProfile: 'Profil ansehen',
    onPlatform: (name: string, platform: string) => `${name} auf ${platform}`,
    website: 'Webseite',
    ghost: {
      title: 'Das könntest du sein',
      body:
        'Du machst Videos, streamst oder leitest eine Community? Werde offizieller Partner und bekomme hier ein eigenes Profil.',
      cta: 'Partner werden',
    },
    program: {
      heading: 'Partner werden',
      intro: 'Unsere Partner sind Creator und Communities, die unser Team einzeln freigibt. So funktioniert es.',
      approved: {
        title: 'Von unserem Team freigegeben',
        body: 'Erzähl uns, wer du bist und wo deine Community zu Hause ist. Unser Team prüft jede Anfrage.',
      },
      code: {
        title: 'Dein eigener Empfehlungscode',
        body:
          'Neue Kunden geben deinen Code bei der Anmeldung im Abrechnungsportal ein oder folgen deinem Link, der ihn für sie einträgt. Vergessen, ihn einzugeben? Dann können sie ihn vor ihrer ersten Zahlung auf der Seite „Referrals“ im Abrechnungsportal nachtragen. Sobald du freigegeben bist, kannst du uns in einem Ticket um einen eigenen Code bitten: nur Buchstaben und Ziffern, höchstens 32 Zeichen, und noch nicht vergeben.',
      },
      discount: {
        title: (percent: string) => `${percent} Rabatt auf ihre erste Rechnung`,
        body: (percent: string) =>
          `Wer sich mit deinem Code anmeldet, erhält ${percent} Rabatt auf die erste Rechnung für sein Hosting, außer bei Dedicated Servern. Der Rabatt gilt nur einmal, für diese erste Rechnung. Er wird nicht mit einem Gutscheincode kombiniert: Es gilt der höhere Rabatt.`,
      },
      credit: {
        title: 'Guthaben für dich',
        body:
          'Sobald eine geworbene Person ihre erste Rechnung bezahlt hat, erhältst du einmalig einen Anteil davon als Guthaben auf deinem Konto. Dedicated Server zählen nicht, und wird diese Zahlung erstattet, wird das Guthaben wieder abgezogen.',
      },
      profile: {
        title: 'Ein Profil auf dieser Seite',
        body: 'Mit deinem Einverständnis zeigen wir dich hier mit Banner, Bild und Links, auf Wunsch auch mit deinem Code.',
      },
      discordCta: 'Frag uns auf Discord',
      ticketCta: 'Ticket öffnen',
      ticketNote:
        'Schon Kunde? Öffne ein Ticket im Abrechnungsportal und erzähl uns von deinem Kanal oder deiner Community.',
      creditLink: 'So funktioniert Guthaben',
    },
    profile: {
      metaTitle: (name: string) => `${name}, offizieller Partner`,
      metaDescription: (code: string, percent: string) =>
        `Melde dich mit dem Code ${code} an und erhalte ${percent} Rabatt auf die erste Rechnung für dein Hosting, außer bei Dedicated Servern.`,
      metaDescriptionNoCode: (name: string) => `${name} ist offizieller Partner von WSLATL LLC.`,
      about: (name: string) => `Über ${name}`,
      links: (name: string) => `${name} im Netz`,
      games: 'Gespielte Spiele',
      referral: (name: string) => `Empfehlungscode von ${name}`,
      signUp: 'Mit diesem Code anmelden',
      discount: (percent: string) =>
        `Mit diesem Code erhältst du ${percent} Rabatt auf die erste Rechnung für dein Hosting, außer bei Dedicated Servern. Der Rabatt gilt nur einmal, für diese erste Rechnung. Er wird nicht mit einem Gutscheincode kombiniert: Es gilt der höhere Rabatt.`,
      avatarAlt: (name: string) => `Profilbild von ${name}`,
      bannerAlt: (name: string) => `Banner von ${name}`,
      allPartners: 'Alle Partner',
    },
  },
  brand: {
    metaTitle: 'Marken-Kit: Logo, Farben, Schriften und Tonalität',
    metaDescription:
      'Lade das WSLATL-Logo als PNG herunter, kopiere die Markenfarben und sieh dir Schriften, Tonalität und Regeln an. Das komplette Kit liegt auf Google Drive.',
    heading: 'Marken-Kit',
    crumb: 'Marken-Kit',
    intro:
      'Alles, was du brauchst, um WSLATL den Leuten zu zeigen: das Logo, die Farben, die Schrift und die Tonalität. Lies es einmal, und was du baust, sieht richtig aus.',
    audience:
      'Es ist für alle, die Grafiken oder Texte von WSLATL jemandem zeigen: unser eigenes Team, ein Partner, ein Designer oder eine Agentur.',
    getFullKit: 'Das ganze Kit holen',
    getLogo: 'Logo herunterladen',
    shortVersion: {
      heading: 'Die Kurzfassung',
      items: [
        'Nutze das Logo so, wie es geliefert wird.',
        'Nutze diese Farben und keine anderen.',
        'Geist für alles, Instrument Serif für Akzente, Geist Mono für Code.',
        'Schreib wie ein Mensch, der Server betreibt, nicht wie eine Marketingabteilung.',
      ],
    },
    onThisPage: 'Auf dieser Seite',
    nav: {
      logo: 'Logo',
      colors: 'Farben',
      type: 'Schrift',
      voice: 'Tonalität',
      rules: 'Richtig und falsch',
      fullKit: 'Ganzes Kit',
    },
    logo: {
      heading: 'Das Logo',
      intro: 'Nutze die Dateien genau so, wie sie geliefert werden. Skalieren ist in Ordnung. Alles andere nicht.',
      partsHeading: 'Die Bildmarke und das komplette Logo',
      parts:
        'Die Bildmarke besteht aus drei schrägen Flächen, von Cyan bis Violett. Das komplette Logo ist die Bildmarke mit dem Namen „WSLATL“ und der Zeile „{0}“. Nimm die Bildmarke, wenn der Platz knapp ist, und das komplette Logo, wenn Platz da ist.',
      specimens: {
        markWhite: 'Die Bildmarke auf Weiß',
        markInk: 'Die Bildmarke auf Ink',
        lockupWhite: 'Das komplette Logo auf Weiß',
        lockupInk: 'Das komplette Logo auf Ink',
      },
      surfaces:
        'Weiß, Hellgrau und Ink (#0F090B) funktionieren alle. Unruhige Fotos nicht. Wenn du den Namen nicht auf einen Blick lesen kannst, ist der Hintergrund zu unruhig: Setz das Logo auf eine einfarbige Fläche.',
      violetLead: 'Vorsicht bei der violetten Fläche.',
      violet:
        'Die rechte Fläche der Bildmarke ist violett, #5000F8, und verschwindet auf einem violetten oder blauvioletten Verlauf. Ein Verlauf passt als Akzentbalken, Rahmen oder Linie unter dem Logo, aber das Logo selbst gehört auf eine einfarbige Fläche.',
      clearSpace: {
        heading: 'Schutzraum',
        body: 'X ist die Versalhöhe des Namens „WSLATL“, ungefähr 18 % der Höhe der Bildmarke. Lass auf allen vier Seiten mindestens X frei. In die blaue Zone kommt nichts: kein Text, kein Icon, kein Rahmen, kein Seitenrand.',
        lockup:
          'Das komplette Logo hat auf allen vier Seiten dasselbe X, und X wächst mit dem Logo. Lass Bildmarke, Name und Zeile zusammen.',
        markCaption: 'Um die Bildmarke',
        lockupCaption: 'Um das komplette Logo',
      },
      minimum: {
        heading: 'Mindestgrößen',
        body: 'Unter der Untergrenze ist das Logo nicht mehr lesbar. Unter 190 px Breite ist die Zeile „{0}“ nicht mehr zu erkennen, nimm dann nur die Bildmarke.',
        artwork: 'Logo',
        columnScreen: 'Bildschirm',
        columnPrint: 'Druck',
        mark: 'Bildmarke',
        lockup: 'Komplettes Logo',
        markScreen: '16 px',
        markPrint: '5 mm',
        lockupScreen: '190 px breit',
        lockupPrint: '45 mm breit',
        shipped: (sizes: string) =>
          `Wir liefern die Bildmarke in ${sizes} px. Nimm die Größe, die direkt über deiner Zielgröße liegt.`,
      },
      downloads: {
        heading: 'Downloads',
        intro: 'PNG mit transparentem Hintergrund, genau so, wie das Kit sie liefert.',
        download: 'Herunterladen',
        markHeading: 'Die Bildmarke',
        markBody:
          'Nimm die Größe, die direkt über der gewünschten liegt. Für das Icon eines Discord-Servers nimm die 512 oder die 1024.',
        lockupHeading: 'Das komplette Logo',
        uses: {
          social: 'Header für Social Media',
          preview: 'Linkvorschauen und Social-Media-Beiträge',
          discord: 'Discord-Server-Banner',
        },
        morePrefix: 'Du brauchst eine andere Größe oder die SVG-Dateien? Die liegen im',
        moreLink: 'kompletten Kit',
        moreSuffix: '.',
      },
      which: {
        heading: 'Welche Datei brauche ich?',
        rows: [
          { space: 'Ein kleiner, quadratischer Platz', examples: 'Favicon, Avatar, App-Icon', pick: 'Die Bildmarke' },
          {
            space: 'Ein breiter Platz',
            examples: 'Header, E-Mail-Signatur, Social-Media-Banner',
            pick: 'Das komplette Logo',
          },
          {
            space: 'Etwas Großes oder Gedrucktes',
            examples: 'Druck und Merch',
            pick: 'Die SVG-Dateien aus dem kompletten Kit',
          },
        ],
      },
      alt: {
        markWhite: 'Die WSLATL-Bildmarke auf Weiß: drei schräge Flächen, von Cyan links bis Violett rechts.',
        markInk: 'Die WSLATL-Bildmarke auf Ink: drei schräge Flächen, von Cyan links bis Violett rechts.',
        lockupWhite:
          'Das komplette WSLATL-Logo auf Weiß: die Bildmarke, der Name WSLATL und darunter die Zeile Private Hosting.',
        lockupInk:
          'Das komplette WSLATL-Logo auf Ink: die Bildmarke, der Name WSLATL und darunter die Zeile Private Hosting.',
        clearSpaceMark:
          'Schema des Schutzraums um die Bildmarke: Ein Streifen freier Fläche in der Breite X läuft um alle vier Seiten, und nichts darf hinein.',
        clearSpaceLockup:
          'Schema des Schutzraums um das komplette Logo: auf allen vier Seiten dasselbe X an freier Fläche.',
        minimumSizes: 'Die Bildmarke mit 256, 192, 160, 128, 96, 64, 48 und 32 Pixeln, jede kleiner als die davor.',
      },
    },
    colors: {
      heading: 'Farben',
      intro:
        'Nutze diese und keine anderen. Die Logofarben stammen aus den Dateien, wie sie geliefert werden, und die Oberflächenfarben nutzen unsere Seiten schon.',
      copy: 'Kopieren',
      copied: 'Kopiert',
      copyFailed: 'Der Hex-Code ist markiert. Kopiere ihn über die Tastatur oder das Menü.',
      logoHeading: 'Logofarben',
      logoIntro: 'Die einzigen Farben im Logo selbst.',
      gradientsHeading: 'Verläufe',
      gradientsIntro:
        'Ein Markenmittel, keine Dekoration. Nutze sie für große Flächen oder dünne Linien und leg nie Fließtext darauf.',
      from: 'Von',
      to: 'Bis',
      interfaceHeading: 'Oberflächenfarben',
      interfaceIntro: 'Übernommen von wslatl.com, der Wissensdatenbank und dem Abrechnungsportal.',
      rulesHeading: 'Regeln für Farben',
      rules: [
        'Färbe das Logo nie um. Nicht schwarz, nicht weiß, nicht in einer Markenfarbe, die dir besser gefällt. Der Verlauf gehört zum Logo.',
        'Ein Akzent pro Bildschirm. Primärblau für Aktionen, semantische Farben für Status, Verläufe für große Flächen. Nicht alle drei auf einmal.',
        'Verlass dich nie auf Farbe allein. Ein Status muss auch in Worten „Online“ oder „Eingeschränkt“ sagen oder ein Icon tragen. Viele Menschen können Gelb-Orange und Rot nicht unterscheiden.',
        'Fließtext ist Ink oder Paper. Nie ein Verlauf, nie ein mittleres Panelblau.',
        'Links sind auf hellem Grund #0079CE und auf dunklem Grund #48C5FF und im Fließtext immer unterstrichen. In Buttons und Menüs nicht unterstrichen.',
      ],
      uses: {
        violet: 'Rechte Fläche der Bildmarke, fernes Ende des Namensverlaufs',
        cyan: 'Nahes Ende des Namensverlaufs',
        brandCyan: 'Linke Fläche der Bildmarke',
        brandBlue: 'Mittlere Fläche der Bildmarke',
        primary: 'Buttons, Links, aktive Zustände, Fokusringe',
        primarySite: 'Die Themenfarbe von wslatl.com, größere Oberflächen',
        lightAccent: 'Hover-Zustände, Glühen, Datenhervorhebungen',
        paleAccent: 'Infopanels, sanfte Füllungen',
        secondaryBlue: 'Sekundäre Aktionen',
        ink: 'Primärer dunkler Hintergrund',
        inkAlt: 'Hintergrund des Abrechnungsportals',
        surface: 'Karten, erhöhte Panels',
        surfaceAlt: 'Rahmen, Trennlinien, Eingabefelder',
        paper: 'Haupttext auf dunklem Grund',
        muted: 'Sekundärtext, Metadaten',
        success: 'Online, aktiv, gesund',
        successAlt: 'Bestätigungen',
        warning: 'Eingeschränkt, ausstehend, Wartung',
        danger: 'Fehler, Ausfälle, zerstörerische Aktionen',
        info: 'Hinweis-Badges',
      },
      gradientUses: {
        wordmark: 'Hero-Flächen, Abschnittsköpfe, Link-Unterstreichungen, Fortschritts- und Statusbalken',
        subline: 'Sekundäre Akzente, Hintergründe von Tags, Panelränder',
      },
    },
    type: {
      heading: 'Schrift',
      intro: 'Drei Schriften, jede mit einer Aufgabe.',
      sans: {
        role: 'Serifenlos',
        use: 'Alles, was Struktur gibt: Überschriften, Fließtext, Oberfläche, Buttons und Tabellen.',
        size: 'Fließtext hat 16 bis 18 px bei Stärke 400 und einen Zeilenabstand von 1,5 bis 1,7. Überschriften haben Stärke 600.',
      },
      serif: {
        role: 'Serif',
        use: 'Nur für Akzente: die Zeile „{0}“, hervorgehobene Zitate und Betonung in Headlines. Sparsam einsetzen.',
        size: '28 bis 56 px bei Stärke 400.',
      },
      mono: {
        role: 'Monospace',
        use: 'Code, Befehle, IPs, Ports, Werte im Panel, Dateinamen und Changelogs.',
        size: '14 bis 16 px bei Stärke 400.',
        noSample: 'Hier ohne Beispiel: Diese Seite lädt Geist Mono nicht.',
      },
      rules: [
        'Überschriften wie einen normalen Satz schreiben, nicht jedes Wort groß.',
        'Zahlen groß, Beschriftungen klein.',
        'Versalien nur für kurze Labels mit höchstens drei Wörtern.',
      ],
    },
    voice: {
      heading: 'Tonalität',
      intro:
        'Unsere Tonalität ist das Produkt. Bei einem kleinen Hoster bleibt man, weil jemand antwortet, also soll das Geschriebene wie diese Person klingen.',
      scope:
        'Das sind die Regeln, nach denen unsere englischen Texte geschrieben sind. Die Beispiele sind echte Zeilen daraus und bleiben auf Englisch.',
      areHeading: 'Wir sind',
      are: ['direkt', 'konkret', 'herzlich', 'ein bisschen witzig', 'selbstbewusst'],
      notHeading: 'Wir sind nicht',
      not: ['steif', 'überdreht', 'vage', 'gemein'],
      rulesHeading: 'Die Regeln',
      rules: [
        {
          title: 'Sprich wie ein Mensch.',
          body: 'Nutze Kontraktionen und kurze Sätze. Ein bisschen harmloses Fluchen passt zur Marke (es steckt wörtlich in unserem Slogan), aber nie bei Abrechnung oder Rechtlichem.',
        },
        { title: 'Sei konkret.', body: '„{0}“ schlägt „{1}“. „{2}“ schlägt „{3}“. Nenn die Zahl.' },
        {
          title: 'Steh dazu.',
          body: 'Wir haben WSLATL gegründet, weil die großen Hoster schlecht waren. Sag das, ohne sie beim Namen zu nennen.',
        },
        { title: 'Kein Füllmaterial.', body: 'Streich „{0}“, „{1}“, „{2}“, „{3}“ und „{4}“.' },
        { title: 'Schrei nie in Großbuchstaben.', body: 'Ein Wort in Großbuchstaben zur Betonung ist in Ordnung.' },
        { title: 'Respektiere die Zeit der Leser.', body: 'Beantworte die Frage im ersten Satz.' },
      ],
      examplesHeading: 'Echte Beispiele',
      insteadOf: 'Statt',
      write: 'Schreib',
    },
    dos: {
      heading: 'Richtig und falsch',
      intro: 'Das sind die Fehler, die wir am häufigsten sehen.',
      doHeading: 'Richtig',
      dontHeading: 'Falsch',
      doItems: [
        'Das Logo genau so nutzen, wie es geliefert wird.',
        'Bildmarke, Name und Zeile zusammenlassen, im Abstand, wie wir ihn liefern.',
        'Ihm Platz lassen (siehe Schutzraum).',
      ],
      dontItems: [
        'Es strecken, stauchen oder drehen.',
        'Es umfärben, einfärben oder mit Schatten oder Umriss versehen.',
        'Es auf Fotos, Rauschen oder einen unruhigen Verlauf setzen.',
        'Es aus den Einzelteilen nachbauen.',
      ],
      rebuild:
        'Bau das komplette Logo nie aus Einzelteilen nach, ändere den Abstand des Namens nicht von Hand und setz den Namen nicht in eine Schrift, die nur ähnlich aussieht. Der Name ist Grafik, keine Schrift.',
      tiles: {
        original: 'Original, unverändert',
        dark: 'Auf dunklem Grund',
        lockup: 'Komplettes Logo, unberührt',
        stretch: 'Strecken oder stauchen',
        recolor: 'Umfärben',
        shadow: 'Schatten oder Umriss',
      },
      alt: {
        original: 'Die Bildmarke auf Weiß, genau wie geliefert.',
        dark: 'Die Bildmarke auf einer dunklen Ink-Fläche.',
        lockup: 'Das komplette Logo auf Weiß, unverändert.',
        stretch: 'Die Bildmarke flachgedrückt, breiter als hoch.',
        recolor: 'Die Bildmarke einfarbig rot umgefärbt.',
        shadow: 'Die Bildmarke mit einem weichen Schlagschatten.',
      },
    },
    fullKit: {
      heading: 'Das komplette Kit',
      body: 'Alle Logo- und Bannergrößen, die SVG-Dateien und die Anleitung als PDF, in einem Google-Drive-Ordner.',
      items: (n: { smallest: number; largest: number; sizes: number; banners: number; pages: number }) => [
        `Die Bildmarke als PNG in ${n.sizes} Größen, von ${n.smallest} bis ${n.largest} px`,
        `Das komplette Logo als PNG in ${n.banners} Bannergrößen`,
        'Die beiden SVG-Dateien',
        `Die Anleitung als PDF, ${n.pages} Seiten`,
      ],
      cta: 'Das komplette Kit auf Google Drive öffnen',
      questionPrefix: 'Fehlt dir eine Größe, oder bist du nicht sicher, ob eine Regel zu dem passt, was du baust?',
      questionLink: 'Frag uns auf Discord',
      questionSuffix: '. Wir antworten meistens schnell.',
    },
  },
  share: {
    copyAd: 'Discord-Anzeige kopieren',
    copied: 'Kopiert',
    copyFailed: 'Kopieren hat nicht geklappt. Markiere den Text in der Vorschau und kopiere ihn selbst.',
    preview: 'Vorschau',
    previewTitle: 'Deine Discord-Anzeige',
    previewHint: 'Genau dieser Text wird kopiert. Füge ihn in einen Discord-Kanal ein, dann zeigt der Link unser Vorschaubild.',
    nativeShare: 'Teilen',
    close: 'Schließen',
    shareOurAd: 'Unsere Anzeige teilen',
    shareOurAdHint: 'Kopiere eine fertige Discord-Anzeige über WSLATL',
    ad: {
      homeIntro: (location: string) => `Privates Hosting von einem kleinen Team in ${location}. Gameserver, VPS und Dedicated Server.`,
      brandLine: 'Hosting that actually gives a damn.',
      partnerIntro: (name: string) => `${name} ist offizieller Partner von WSLATL, einem privaten Hosting-Anbieter für Gameserver und VPS.`,
      partnerCode: (code: string) => `Empfehlungscode: \`${code}\``,
      partnerDiscount: (percent: string) => `Melde dich damit an und erhalte ${percent} Rabatt auf die erste Rechnung für dein Hosting, außer bei Dedicated Servern.`,
      partnerGames: (games: string) => `Spiele: ${games}`,
      findOnline: (name: string) => `${name} online finden:`,
      offerHeading: 'Was wir bieten',
      whyHeading: 'Warum WSLATL',
      startHeading: 'Jetzt starten',
      andMore: (n: number) => `und ${n} weitere`,
      hostingFrom: (price: string) => `Hosting ab ${price}/Monat`,
      gamesIntro: 'Jedes Spiel läuft auf denselben Tarifen: Du wählst den RAM, kein an ein Spiel gebundenes Paket.',
      gamesMore: (count: number) => `${count} Spiele werden unterstützt, und wenn es einen Dedicated Server dafür gibt, können wir es fast immer betreiben.`,
      pricingIntro: 'Veröffentlichte Monatspreise in US-Dollar. Keine Preisfallen bei der Verlängerung.',
    },
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
    label: 'Brotkrümelnavigation',
  },
}

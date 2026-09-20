import type { Copy } from '@/i18n/copy/en'

/** French copy for the site's own components. */
export const fr: Copy = {
  header: {
    skipToContent: "Aller au contenu principal",
    home: "Accueil WSLATL",
    discord: "WSLATL sur Discord (ouvre un nouvel onglet)",
    getStarted: "Commencer",
    openMenu: "Menu",
    closeMenu: "Fermer le menu",
    newTab: " (ouvre un nouvel onglet)",
    login: "Connexion",
    clientPanels: "Espaces client",
    language: "Langue",
    chooseLanguage: "Choisir une langue",
    reviewNote: "Chaque nouveau compte est examiné par une personne, en général le jour même.",
  },
  nav: {
    pricing: "Tarifs",
    games: "Serveurs de jeu",
    services: "Services",
    about: "À propos",
    contact: "Contact",
    status: "État des services",
  },
  portals: {
    billing: { label: "Portail de facturation", description: "Factures, commandes et tickets de support" },
    gamingPanel: { label: "Panneau de jeu", description: "Gérer vos serveurs de jeu" },
    vpsPanel: { label: "Panneau VPS", description: "Gérer votre VPS" },
    dedicated: { label: "Portail serveurs dédiés", description: "Gérer vos serveurs dédiés" },
    cPanel: { label: "cPanel", description: "Hébergement web et e-mail" },
    register: { label: "Demander un accès", description: "Nouveau ici ? Faites une demande de compte" },
  },
  footer: {
    blurb: (location: string) => `Hébergement privé géré par une petite équipe basée au ${location}. Hosting that actually gives a damn.`,
    columns: {
      hosting: "Hébergement",
      company: "Entreprise",
      clientArea: "Espace client",
      legal: "Mentions légales",
    },
    links: {
      vpsPlans: "Offres VPS",
      gamePlans: "Offres serveurs de jeu",
      supportedGames: "Jeux pris en charge",
      dedicated: "Serveurs dédiés",
      web: "Hébergement web",
      about: "À propos de nous",
      howItWorks: "Comment se passe une commande",
      contact: "Contact",
      reviews: "Avis sur Trustpilot",
      discord: "Discord",
      status: "Page d'état",
    },
    rights: (year: number, company: string) => `© ${year} ${company}. Tous droits réservés.`,
  },
  email: {
    reveal: "Afficher l'adresse e-mail",
  },
  home: {
    metaTitle: "Hébergement VPS et serveurs de jeu pas chers | WSLATL LLC",
    metaDescription:
      "Hébergement VPS abordable, hébergement de serveurs de jeu (Minecraft, Rust, ARK, FiveM et bien d'autres) et serveurs dédiés, avec protection DDoS et stockage NVMe. Basés au Missouri, et nous répondons vraiment.",
    hero: {
      // Kept in English everywhere: this is the brand line.
      lineOne: "Hosting that",
      emphasis: "actually",
      lineTwo: "gives a damn.",
      intro:
        "Nous avons travaillé au sein d'entreprises d'hébergement. Nous savons ce qui cloche. WSLATL existe pour y remédier : hébergement VPS abordable, hébergement Minecraft et serveurs de jeu, et serveurs dédiés, portés par une équipe qui répond vraiment.",
      seePlans: "Voir les offres et les tarifs",
      products: "Produits",
      entries: {
        vps: "Hébergement VPS",
        game: "Serveurs de jeu",
        other: "Serveurs dédiés et hébergement web",
      },
      from: (price: string) => `à partir de ${price}/mois`,
      quoted: "Sur devis, selon votre configuration",
    },
    clients: {
      heading: "Ils nous font confiance",
      pause: "Mettre en pause le défilement des logos clients",
    },
    services: {
      heading: "Ce que nous hébergeons",
      intro:
        "Les VPS et les serveurs de jeu ont des tarifs publics. Les serveurs dédiés et l'hébergement web sont chiffrés en fonction de ce que vous avez réellement besoin de faire tourner.",
      from: "à partir de",
      perMonth: "/mois",
      quoted: "Sur devis, selon votre configuration",
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
        `${n.plans} offres, de ${n.cpuMin} à ${n.cpuMax} ${n.cpuUnit}, de ${n.ramMin} à ${n.ramMax} GB de RAM et de ${n.storageMin} à ${n.storageMax} GB de stockage.`,
      compareVps: "Comparer les offres VPS",
      compareGame: "Comparer les offres serveurs de jeu",
      findGame: "Trouver votre jeu",
      getQuote: "Demander un devis",
    },
    howItWorks: {
      heading: "Comment se passe une commande",
      intro:
        "Nous fonctionnons uniquement sur candidature, et c'est voulu. C'est ainsi qu'une petite équipe peut s'occuper correctement de chaque client.",
      step: (n: number) => `Étape ${n}\u00A0: `,
      steps: [
        {
          title: "Demandez un accès",
          description:
            "Remplissez une courte demande dans le portail de facturation. Une personne les lit toutes, et la plupart sont acceptées le jour même.",
        },
        {
          title: "Dites-nous ce qu'il vous faut",
          description:
            "Une fois votre demande acceptée, écrivez-nous sur Discord ou ouvrez un ticket. Nous passons votre configuration en revue avec vous. Aucun parcours automatisé.",
        },
        {
          title: "Votre serveur passe en ligne",
          description:
            "Nous mettons tout en place, nous vous faisons le tour de votre panneau, et nous restons disponibles ensuite. La plupart des clients sont opérationnels le jour même.",
        },
      ],
      readyPrefix: "Prêt ?",
      requestAccess: "Demandez un accès",
      or: "ou",
      askOnDiscord: "posez-nous vos questions sur Discord",
      readySuffix: "au préalable.",
    },
    whyUs: {
      heading: "La différence, c'est l'humain.",
      intro: "Nous avons vu comment travaillent les gros hébergeurs. Nous avons bâti WSLATL pour être exactement l'inverse.",
      slaNotePrefix: "Les objectifs de disponibilité de chaque service, et les avoirs auxquels vous avez droit si nous en manquons un, figurent dans notre",
      slaLink: "Accord de niveau de service",
      joinDiscord: "Rejoindre notre Discord",
      openTicket: "Ouvrir un ticket",
    },
    about: {
      heading: "Nous avons créé WSLATL parce que nous en avions assez de voir des hébergeurs ignorer leurs clients.",
      paragraphs: [
        "Nous avons travaillé au sein d'entreprises d'hébergement. Nous avons vu les tickets s'accumuler, les clients passer d'un interlocuteur à l'autre, personne ne connaître vraiment votre configuration. C'est frustrant, et c'est parfaitement évitable.",
        "Alors nous avons lancé WSLATL. Basés au Missouri, en société privée, et assez petits pour que chaque client ait vraiment notre attention. Nous ne cherchons pas à être le plus gros hébergeur. Nous cherchons à être celui que vous recommanderiez vraiment à un ami.",
      ],
      closing: "Ici, chaque client est traité comme un proche. C'est la seule façon dont nous savons faire ce métier.",
      quote:
        "Le secteur de l'hébergement est dur et il faut sortir du lot. Nous voulons simplement traiter nos clients comme des proches et nous assurer qu'ils vivent la meilleure expérience possible.",
      quoteAttribution: "L'équipe WSLATL",
      teamHeading: "Les personnes derrière WSLATL",
    },
    faq: {
      heading: "Questions fréquentes",
      stillNotSure: "Toujours un doute ?",
      askOnDiscord: "Posez-nous vos questions sur Discord",
      alwaysAround: ". Nous sommes toujours là.",
    },
    contact: {
      heading: "Un hébergeur qui vous traite comme une personne. Imaginez un peu.",
      body:
        "Demandez un accès et un administrateur examine votre candidature. Une fois accepté, nous vous installons rapidement. La plupart des clients sont en ligne le jour même.",
      requestAccess: "Demander un accès",
      preferToTalk: "Vous préférez en parler d'abord ?",
      options: {
        discord: {
          title: "Discord",
          description:
            "Rejoignez notre serveur et ouvrez un ticket, ou écrivez-nous en message privé. C'est le moyen le plus rapide d'avoir une réponse.",
          cta: "Rejoindre notre Discord",
        },
        billing: {
          title: "Ticket dans le portail de facturation",
          description:
            "Déjà client ? Ouvrez un ticket dans le portail de facturation. Idéal pour les questions de compte et de facturation.",
          cta: "Ouvrir un ticket",
        },
        email: {
          title: "E-mail",
          description: "Vous préférez l'e-mail ? Une personne lit chaque message.",
        },
      },
    },
  },
  pricing: {
    metaTitle: "Tarifs hébergement VPS et serveurs de jeu pas chers",
    metaDescription: (vps: string, game: string) =>
      `Tarifs mensuels publics pour l'hébergement VPS à partir de ${vps} et les serveurs de jeu à partir de ${game}, sur SATA SSD ou NVMe. Pas de prix d'appel, et au moins 30 jours de préavis avant toute augmentation.`,
    heading: "Tarifs",
    intro:
      "Chaque offre est facturée au mois, en dollars américains. Pas de piège au renouvellement : ce sont les tarifs mensuels habituels, et toute augmentation est annoncée par écrit au moins 30 jours à l'avance.",
    orderingPrefix: "Une commande commence par une courte demande, et la plupart sont acceptées le jour même.",
    orderingLink: "Comment se passe une commande",
    lines: {
      vps: "Hébergement VPS",
      game: "Hébergement de serveurs de jeu",
    },
    from: "à partir de",
    perMonth: "/mois",
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string }) =>
      `${n.plans} offres. De ${n.ramMin} à ${n.ramMax} GB de RAM, de ${n.cpuMin} à ${n.cpuMax} ${n.cpuUnit}, SATA SSD ou NVMe.`,
    seePlans: (line: string) => `Voir les offres ${line}`,
    planTypes: "Types d'offres",
    included: "Inclus avec chaque offre",
    uptimeIncluded: (target: string) => `Objectif de disponibilité mensuelle de ${target} (voir notre SLA)`,
    storageSuffix: "pour le stockage",
    table: {
      plan: "Offre",
      ram: "RAM",
      storage: "Stockage",
      traffic: "Trafic",
      price: "Prix",
      order: "Commander",
      orderPlan: (plan: string) => ` ${plan} (ouvre un nouvel onglet)`,
      caption: (group: string) => `Offres ${group}, tarifs mensuels en dollars américains`,
    },
    custom: {
      heading: "Serveurs dédiés et hébergement web",
      body:
        "Ces services sont chiffrés au cas par cas plutôt que vendus sur catalogue, parce que le matériel ou la configuration qui conviennent dépendent de ce que vous faites tourner. Dites-nous ce qu'il vous faut et nous revenons vers vous avec un prix.",
      cta: "Demander un devis",
    },
  },
  games: {
    metaTitle: (more: number) => `Hébergement de serveurs de jeu\u00A0: Minecraft, Rust, ARK, FiveM et ${more}+ autres`,
    metaDescription: (price: string) =>
      `Hébergement de serveurs de jeu protégés contre les DDoS à partir de ${price}/mois, sur matériel NVMe et SATA SSD. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld et des dizaines d'autres, tous sur le même panneau Pterodactyl.`,
    heading: "Hébergement de serveurs de jeu",
    crumb: "Jeux",
    introPrefix:
      "Tous les jeux tournent sur les mêmes offres propulsées par Pterodactyl : vous choisissez la RAM, pas un forfait verrouillé sur un jeu. Trouvez votre jeu pour des conseils de RAM réalistes, puis comparez nos",
    introLink: "offres serveurs de jeu",
    introSuffix: ". Vous ne voyez pas le vôtre ? S'il propose un serveur dédié, nous pouvons presque toujours le faire tourner.",
    searchLabel: "Rechercher un jeu",
    searchPlaceholder: (count: number) => `Rechercher parmi ${count} jeux`,
    categories: "Catégories de jeux",
    // Filled in by the browser (components/games/game-directory.tsx), so
    // these are templates rather than functions: a Client Component can only
    // be handed plain values.
    matchCount: "{shown} jeux sur {total} correspondent",
    showing: "{shown} jeux sur {total}",
    noMatch: "Aucun jeu ne correspond à « {query} ».",
    noMatchHelp: "S'il propose un serveur dédié, nous pouvons presque toujours le faire tourner sur les mêmes offres.",
    askOnDiscord: "Posez-nous vos questions sur Discord",
    featured: "Jeux en vedette",
    fromPrice: "à partir de {price}/mois",
    toStart: "{ram} pour démarrer",
    detail: {
      metaTitle: (game: string) => `Hébergement de serveur ${game}`,
      heading: (game: string) => `Hébergement de serveur ${game}`,
      order: (game: string) => `Commandez votre serveur ${game}`,
      comparePlans: "Comparer les offres",
      listedUnderPrefix: "Classé dans",
      listedUnderSuffix: ". Les offres ne sont pas verrouillées sur un seul jeu : vous pouvez changer de titre quand vous voulez.",
      ramHeading: (game: string) => `Combien de RAM faut-il pour ${game}\u00A0?`,
      ramCaption: (game: string) => `RAM recommandée pour ${game} et les plus petites offres qui la couvrent`,
      setup: "Configuration",
      recommendedRam: "RAM recommandée",
      smallestPlans: "Plus petites offres adaptées",
      fits: "Convient :",
      perMap: "Par carte : ",
      or: " ou ",
      tooBig: "Au-delà de nos offres de jeu : demandez-nous",
      ramNote: "Ce sont des points de départ, pas des limites strictes. Chaque offre peut être modifiée ensuite, à mesure que votre serveur grandit.",
      popular: (game: string) => `Configurations ${game} populaires`,
      included: "Inclus avec chaque offre de jeu",
      questions: (game: string) => `Questions sur l'hébergement ${game}`,
      moreIn: (category: string) => `Plus de jeux dans ${category}`,
      allGames: "Tous les jeux",
    },
  },
  legal: {
    metaTitle: "Mentions légales",
    metaDescription:
      "Toutes les politiques de WSLATL LLC au même endroit : confidentialité, conditions de service, usage acceptable, remboursements, SLA, DMCA, abus, avoir de compte, sous-traitants et sauvegardes.",
    heading: "Mentions légales",
    intro:
      "Nos politiques, écrites pour être lues. Chacune indique sa date d'entrée en vigueur, et chacune peut évoluer de son côté : vérifiez donc la date du document sur lequel vous vous appuyez.",
    effective: "Date d'effet",
    jurisdiction: "Juridiction",
    questions: "Questions",
    onThisPage: "Sur cette page",
    documents: "Documents légaux",
    questionsHeading: "Des questions sur ce document ?",
    questionsBody: "Nous sommes une petite équipe. Vous pouvez vraiment nous parler.",
    askOnDiscord: "Demander sur Discord",
    translationNotice:
      "Cette traduction est fournie pour que vous puissiez lire ce document dans votre langue. C'est la version anglaise de ce document qui fait foi.",
    readInEnglish: "Lire la version anglaise",
    emailsJoin: "ou",
    emailLabel: "E-mail",
    uptimeTable: {
      service: "Service",
      target: "Objectif de disponibilité mensuelle",
      label: "Objectifs de disponibilité mensuelle",
    },
  },
  notFound: {
    metaTitle: "Page introuvable",
    heading: "Cette page n'existe pas.",
    body: "Le lien est peut-être ancien, ou l'adresse comporte une faute de frappe. Voici où va la plupart des visiteurs :",
    destinations: {
      pricing: "Offres et tarifs",
      games: "Hébergement de serveurs de jeu",
      services: "Ce que nous hébergeons",
      legal: "Documents légaux",
    },
    home: "Retour à la page d'accueil",
    askOnDiscord: "Posez-nous vos questions sur Discord",
  },
  breadcrumbs: {
    home: "Accueil",
  },
}

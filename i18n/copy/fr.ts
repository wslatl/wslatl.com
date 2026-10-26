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
    partners: 'Partenaires',
    contact: "Contact",
    status: "Statut",
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
      partners: 'Partenaires',
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
    metaTitle: 'WSLATL\u00A0: hébergement de serveurs de jeu, VPS et dédiés',
    metaDescription: (game: string, vps: string) =>
      `WSLATL est un petit hébergeur du Missouri, sur candidature uniquement. Serveurs de jeu dès ${game}, VPS dès ${vps}, serveurs dédiés, et nous répondons vraiment.`,
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
          title: "Choisissez une offre ou dites-nous ce qu'il vous faut",
          description:
            "Une fois votre demande acceptée, commandez un serveur de jeu ou un VPS dans le portail de facturation et payez en ligne. Pour un serveur dédié ou un hébergement web, écrivez-nous sur Discord ou ouvrez un ticket, et nous le mettons en place avec vous.",
        },
        {
          title: "Votre serveur passe en ligne",
          description:
            "Les serveurs de jeu et les VPS sont en général en ligne le jour même. Les serveurs dédiés demandent plus de temps, en général quelques jours ouvrés. Nous vous faisons le tour de votre panneau et restons disponibles ensuite.",
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
    metaTitle: 'Tarifs VPS et serveurs de jeu, tous les plans affichés',
    metaDescription: (vps: string, game: string) =>
      `VPS dès ${vps} et serveurs de jeu dès ${game} par mois, chaque caractéristique publiée. Pas de prix d'appel, et 30 jours de préavis avant toute hausse.`,
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
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string; storage: string[] }) =>
      `${n.plans} offres. De ${n.ramMin} à ${n.ramMax} GB de RAM, de ${n.cpuMin} à ${n.cpuMax} ${n.cpuUnit}, ${n.storage.join(' ou ')}.`,
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
        "Ces services sont chiffrés au cas par cas plutôt que vendus sur catalogue, parce que le matériel ou la configuration qui conviennent dépendent de ce que vous faites tourner. Dites-nous ce qu'il vous faut et nous revenons vers vous avec un prix. Déjà client ? Dans le portail de facturation, ouvrez « Browse plans », choisissez un serveur dans l'onglet « Dedicated servers » et appuyez sur « Request this server ». La mise en place d'un serveur dédié prend plus de temps que celle d'un serveur de jeu ou d'un VPS, en général quelques jours ouvrés.",
      cta: "Demander un devis",
    },
  },
  games: {
    metaTitle: (more: number) => `Hébergement de serveurs de jeu\u00A0: Minecraft, Rust, ARK et ${more}+ autres`,
    metaDescription: (price: string) =>
      `Serveurs de jeu dès ${price}/mois, facturés à la RAM et non au jeu. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld et d'autres sur un panneau Pterodactyl.`,
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
      metaTitle: (game: string, price: string) => `Hébergement de serveur ${game} dès ${price}/mois`,
      metaDescription: (game: string, price: string, tagline: string) =>
        `Louez votre propre serveur ${game} chez WSLATL dès ${price} par mois. ${tagline}`,
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
      plansHeading: "Offres de serveurs de jeu",
      plansIntro:
        "Les mêmes offres font tourner tous les jeux que nous hébergeons. Premium tourne sur un AMD Ryzen 9 3900X avec stockage NVMe, et Budget sur un Intel Core i7-6700K plus ancien avec SATA SSD.",
      atAGlance: (game: string) => `Hébergement ${game} en bref`,
      hosting: (game: string) => `Hébergement ${game}`,
      budgetNote: "Les offres Budget tournent sur un CPU plus ancien et plus chargé, donc elles peuvent être plus lentes aux heures de pointe.",
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
    notTranslated: "Ce document n'est pas encore traduit, il est donc affiché en anglais. C'est de toute façon la version anglaise qui fait foi.",
    emailsJoin: "ou",
    emailLabel: "E-mail",
    uptimeTable: {
      service: "Service",
      target: "Objectif de disponibilité mensuelle",
      label: "Objectifs de disponibilité mensuelle",
    },
  },
  partners: {
    metaTitle: 'Partenaires officiels',
    metaDescription: (percent: string) =>
      `Les créateurs et les communautés avec qui nous travaillons, chacun avec son propre code de parrainage. Inscrivez-vous avec l'un d'eux et obtenez ${percent} de réduction sur la première facture de votre hébergement, sauf sur les serveurs dédiés.`,
    metaDescriptionNoCodes:
      'Les créateurs et les communautés avec qui nous travaillons, approuvés par notre équipe. Découvrez qui ils sont et où les retrouver en ligne.',
    emptyMetaDescription:
      'Nous choisissons nos premiers partenaires officiels. Vous faites des vidéos, du streaming ou vous animez une communauté ? Découvrez comment fonctionne notre programme partenaire et comment le rejoindre.',
    heading: 'Partenaires officiels',
    crumb: 'Partenaires',
    intro: (percent: string) =>
      `Des créateurs et des communautés approuvés par notre équipe. Inscrivez-vous avec l'un de leurs codes de parrainage et obtenez ${percent} de réduction sur la première facture de votre hébergement, sauf sur les serveurs dédiés.`,
    introNoCodes: 'Des créateurs et des communautés approuvés par notre équipe.',
    emptyIntro:
      'Nous choisissons nos premiers partenaires officiels. Vous faites des vidéos, du streaming ou vous animez une communauté ? Cette page pourrait commencer avec vous.',
    featured: 'À la une',
    officialPartner: 'Partenaire officiel',
    since: (month: string) => `Partenaire depuis ${month}`,
    referralCode: 'Code de parrainage',
    copy: 'Copier',
    copied: 'Copié',
    copyFailed: 'Le code est sélectionné. Copiez-le avec le clavier ou le menu.',
    viewProfile: 'Voir le profil',
    onPlatform: (name: string, platform: string) => `${name} sur ${platform}`,
    website: 'Site web',
    ghost: {
      title: 'Ça pourrait être vous',
      body:
        'Vous faites des vidéos, du streaming ou vous animez une communauté ? Devenez partenaire officiel et ayez votre profil ici.',
      cta: 'Devenir partenaire',
    },
    program: {
      heading: 'Devenir partenaire',
      intro:
        'Nos partenaires sont des créateurs et des communautés que notre équipe approuve un par un. Voici comment ça marche.',
      approved: {
        title: 'Approuvé par notre équipe',
        body: 'Dites-nous qui vous êtes et où se trouve votre communauté. Notre équipe examine chaque demande.',
      },
      code: {
        title: 'Votre propre code de parrainage',
        body:
          "Les gens saisissent votre code en s'inscrivant sur le portail de facturation, ou suivent votre lien, qui le remplit pour eux. Ils ont oublié de le saisir ? Ils peuvent l'ajouter sur la page « Referrals » du portail de facturation avant leur premier paiement. Une fois votre candidature acceptée, vous pouvez nous demander dans un ticket un code personnalisé : uniquement des lettres et des chiffres, 32 caractères au maximum, et pas déjà utilisé.",
      },
      discount: {
        title: (percent: string) => `${percent} de réduction sur leur première facture`,
        body: (percent: string) =>
          `Toute personne qui s'inscrit avec votre code obtient ${percent} de réduction sur la première facture de son hébergement, sauf sur les serveurs dédiés. La réduction s'applique une seule fois, à cette première facture uniquement. Elle ne se cumule pas avec un code promo : la réduction la plus élevée s'applique.`,
      },
      credit: {
        title: 'Un avoir pour vous',
        body:
          "Dès qu'un filleul a payé sa première facture, vous recevez une seule fois une part de ce paiement, sous forme d'avoir sur votre compte. Les serveurs dédiés ne comptent pas, et si ce paiement est remboursé, l'avoir est repris.",
      },
      profile: {
        title: 'Un profil sur cette page',
        body: 'Avec votre accord, nous vous présentons ici avec votre bannière, votre photo et vos liens, et avec votre code si vous le souhaitez.',
      },
      discordCta: 'Écrivez-nous sur Discord',
      ticketCta: 'Ouvrir un ticket',
      ticketNote:
        'Déjà client ? Ouvrez un ticket dans le portail de facturation et parlez-nous de votre chaîne ou de votre communauté.',
      creditLink: "Comment fonctionne l'avoir de compte",
    },
    profile: {
      metaTitle: (name: string) => `${name}, partenaire officiel`,
      metaDescription: (code: string, percent: string) =>
        `Inscrivez-vous avec le code ${code} pour obtenir ${percent} de réduction sur la première facture de votre hébergement, sauf sur les serveurs dédiés.`,
      metaDescriptionNoCode: (name: string) => `${name} est partenaire officiel de WSLATL LLC.`,
      about: (name: string) => `À propos de ${name}`,
      links: (name: string) => `Retrouver ${name} en ligne`,
      games: 'Ses jeux',
      referral: (name: string) => `Code de parrainage de ${name}`,
      signUp: "S'inscrire avec ce code",
      discount: (percent: string) =>
        `En vous inscrivant avec ce code, vous obtenez ${percent} de réduction sur la première facture de votre hébergement, sauf sur les serveurs dédiés. La réduction s'applique une seule fois, à cette première facture uniquement. Elle ne se cumule pas avec un code promo : la réduction la plus élevée s'applique.`,
      avatarAlt: (name: string) => `Photo de profil de ${name}`,
      bannerAlt: (name: string) => `Bannière de ${name}`,
      allPartners: 'Tous les partenaires',
    },
  },
  share: {
    copyAd: "Copier l'annonce Discord",
    copied: 'Copié',
    copyFailed: "La copie a échoué. Sélectionnez le texte de l'aperçu et copiez-le vous-même.",
    preview: 'Aperçu',
    previewTitle: 'Votre annonce Discord',
    previewHint: "C'est exactement le texte qui sera copié. Collez-le dans un salon Discord et le lien affichera notre image d'aperçu.",
    nativeShare: 'Partager',
    close: 'Fermer',
    shareOurAd: 'Partagez notre annonce',
    shareOurAdHint: 'Copiez une annonce Discord toute prête sur WSLATL',
    ad: {
      homeIntro: (location: string) => `Hébergement privé géré par une petite équipe, ${location}. Serveurs de jeux, VPS et serveurs dédiés.`,
      brandLine: 'Hosting that actually gives a damn.',
      partnerIntro: (name: string) => `${name} est partenaire officiel de WSLATL, un hébergeur privé de serveurs de jeux et de VPS.`,
      partnerCode: (code: string) => `Code de parrainage : \`${code}\``,
      partnerDiscount: (percent: string) => `Inscrivez-vous avec ce code et obtenez ${percent} de réduction sur la première facture de votre hébergement, sauf serveurs dédiés.`,
      partnerGames: (games: string) => `Jeux : ${games}`,
      findOnline: (name: string) => `Retrouvez ${name} en ligne :`,
      offerHeading: 'Ce que nous proposons',
      whyHeading: 'Pourquoi WSLATL',
      startHeading: 'Pour commencer',
      andMore: (n: number) => `et ${n} autres`,
      hostingFrom: (price: string) => `Hébergement à partir de ${price}/mois`,
      gamesIntro: 'Chaque jeu tourne sur les mêmes offres : vous choisissez la RAM, pas un forfait lié à un jeu.',
      gamesMore: (count: number) => `${count} jeux pris en charge, et s'il existe un serveur dédié, nous pouvons presque toujours le faire tourner.`,
      pricingIntro: 'Tarifs mensuels publiés en dollars américains. Aucun piège de prix au renouvellement.',
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

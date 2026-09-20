import type { ContentTranslation } from '@/i18n/content/types'

/** French translations of the text in data/. */
export const fr: ContentTranslation = {
  services: {
    vps: {
      title: "Hébergement VPS",
      description:
        "Des ressources isolées, un accès root complet et la liberté de faire tourner ce que vous voulez. Un bon compromis entre le mutualisé et le dédié.",
      features: ["Accès root et sudo complet", "L'OS de votre choix", "Offres sur SATA SSD ou NVMe"],
    },
    game: {
      title: "Hébergement de serveurs de jeu",
      description:
        "Des serveurs de jeu avec un panneau de contrôle clair et zéro prise de tête. Nous les gardons rapides, nous les gardons en ligne, et si quelque chose casse, nous le réparons.",
      features: ["Panneau Pterodactyl inclus", "Protection DDoS intégrée", "Prise en charge des mods et des plugins"],
    },
    dedicated: {
      title: "Serveurs dédiés",
      description:
        "Votre propre matériel et vos propres ressources. Personne ne partage votre CPU ni votre RAM. Accès root complet, infogéré ou non, et nous sommes là si quelque chose survient.",
      features: ["Aucune ressource partagée", "Stockage NVMe SSD", "Accès à distance IPMI et KVM", "Options de trafic non mesuré"],
    },
    web: {
      title: "Hébergement web",
      description:
        "Un hébergement fiable pour vos sites et applications web, infogéré par nos soins, avec une vraie personne à contacter si ça part de travers.",
      features: ["Certificats SSL gratuits", "cPanel avec installation d'applications en un clic", "Hébergement e-mail inclus", "Sauvegardes mensuelles incluses"],
    },
  },
  commitments: {
    uptime: { label: "Objectif de disponibilité sur les VPS et l'hébergement web" },
    reply: { label: "Première réponse habituelle sur Discord aux heures actives", value: "Moins d'1 h" },
    live: { label: "La plupart des serveurs sont en ligne le jour de votre acceptation", value: "Le jour même" },
    notice: { label: "Préavis écrit avant toute augmentation de prix", value: "30 jours" },
  },
  leadFeature: {
    title: "Vous parlez à une vraie personne. À chaque fois.",
    description:
      "Pas de mur de bots, pas de réponses toutes faites. Ouvrez un ticket dans votre portail de facturation, faites-nous signe sur Discord ou écrivez-nous en message privé : vous tombez sur quelqu'un qui sait ce qu'il fait et qui se soucie de votre serveur.",
  },
  features: {
    hardware: {
      title: "Du matériel qui tient la route",
      description:
        "SSD NVMe, CPU à haute fréquence, chemins réseau redondants et routage à faible latence. Conçu pour encaisser sans faire de compromis.",
    },
    uptime: {
      title: "En ligne quand ça compte",
      description:
        "Une mitigation DDoS intégrée dès le départ. Si quelque chose tente de vous mettre hors ligne, nous nous en occupons.",
    },
    'application-only': {
      title: "Exigeants, et pour de bonnes raisons",
      description:
        "Nous acceptons les clients sur candidature. Ce n'est pas une barrière à l'entrée. C'est notre façon de nous assurer que nous pouvons vraiment nous occuper de tous ceux que nous prenons.",
    },
  },
  faqs: {
    'getting-started': {
      question: "Comment démarrer ?",
      answer:
        "Rendez-vous sur billing.wslatl.com/register et demandez un accès. Un administrateur examine chaque candidature et la valide avant que vous puissiez accéder au moindre service. Une fois accepté, écrivez-nous sur Discord ou ouvrez un ticket de facturation et nous vous installons.",
    },
    'what-makes-you-different': {
      question: "Qu'est-ce qui vous différencie des gros hébergeurs ?",
      answer:
        "Nous sommes petits, volontairement. Nous sommes une entreprise privée, accessible uniquement sur candidature, basée au Missouri. Nous avons travaillé au sein d'entreprises d'hébergement et nous avons vu comment les clients se font ignorer. Chez WSLATL, chaque client a un accès direct à notre équipe, à chaque fois. Pas de files d'attente qui traînent pendant des jours, pas de réponses copiées-collées.",
    },
    'supported-games': {
      question: "Quels jeux prenez-vous en charge pour les serveurs de jeu ?",
      answer:
        "Nous utilisons Pterodactyl et prenons en charge un large éventail de jeux : Minecraft (Java et Bedrock), Rust, CS2, ARK, Valheim, Terraria, FiveM et bien d'autres. Si votre jeu n'est pas dans la liste, demandez-nous. Nous pouvons presque toujours le prendre en charge.",
    },
    'game-server-cost': {
      question: "Combien coûte l'hébergement d'un serveur de jeu ?",
      answer:
        "Les serveurs de jeu Budget démarrent à {gamePrice} par mois pour {gameRam} GB de RAM sur SATA SSD, et les offres premium en NVMe démarrent à {gamePremiumPrice} par mois. Les offres VPS démarrent à {vpsPrice}. La page des tarifs contient le détail complet.",
    },
    'response-time': {
      question: "En combien de temps répondez-vous vraiment ?",
      answer:
        "En moins d'une heure sur Discord aux heures actives, et souvent plus vite. Nous n'avons pas une immense équipe de support. Nous en avons une dédiée. Vous parlerez toujours à quelqu'un qui connaît votre serveur et votre configuration, pas à quelqu'un qui lit un script.",
    },
    'managed-hosting': {
      question: "Proposez-vous de l'hébergement infogéré ?",
      answer:
        "Oui. Nous proposons des formules entièrement infogérées où nous prenons en charge les mises à jour, la surveillance et la maintenance. Nous proposons aussi des formules non infogérées pour les clients qui veulent tout contrôler. Nous déterminons ce qui vous convient le mieux lors de notre première conversation.",
    },
    'changes-later': {
      question: "Puis-je monter, descendre ou changer d'offre plus tard ?",
      answer:
        "Bien sûr. Chaque relation client est gérée personnellement, donc les montées en gamme, les changements d'offre et les migrations tiennent en un message sur Discord. Nous réglons ça en général le jour même.",
    },
    'vps-vs-shared': {
      question: "L'hébergement VPS est-il meilleur que l'hébergement mutualisé ?",
      answer:
        "Pour la plupart des gens qui font tourner un vrai projet, oui. Un VPS vous donne du CPU et de la RAM dédiés auxquels personne d'autre ne touche, un accès root complet, et aucun risque qu'un compte voisin plombe vos performances. Le mutualisé coûte moins cher, mais vous partagez les ressources avec des inconnus.",
    },
    'ddos-protection': {
      question: "Proposez-vous une protection DDoS ?",
      answer:
        "Oui. La protection DDoS est incluse sans supplément sur chaque offre de serveur de jeu. Elle est toujours active, ce n'est pas quelque chose à activer ou à payer en plus par la suite.",
    },
  },
  team: {
    'Liam Henry': {
      role: "Fondateur et PDG",
      bio: "Des années dans le secteur de l'hébergement. A créé WSLATL pour donner aux clients l'attention directe qu'ils méritent.",
    },
    'Tyler Woollis': {
      role: "Cofondateur et copropriétaire",
      bio: "Garde l'infrastructure solide. Si quelque chose casse, il est déjà au courant.",
    },
  },
  reviews: {
    title: "Lisez ce que disent nos clients",
    body:
      "Chaque avis sur notre profil public Trustpilot est authentique. Nous ne les payons pas, nous ne filtrons pas les mauvais, et nous ne cachons pas ceux qui piquent.",
    ask: "Vous avez fait appel à nous ? Un avis honnête aide la personne suivante à décider si nous lui conviendrons.",
    cta: "Voir nos avis sur Trustpilot",
    learnMore: "Comment fonctionne Trustpilot",
  },
  sla: {
    vps: { label: "Hébergement VPS" },
    web: { label: "Hébergement web" },
    game: { label: "Hébergement de serveurs de jeu" },
    dedicated: {
      label: "Serveurs dédiés",
      target: "Au mieux (best-effort) ; sous réserve de la disponibilité du matériel et du datacenter",
    },
  },
  pricing: {
    lines: {
      vps: {
        label: "VPS",
        intro:
          "Des ressources isolées et un accès root complet, avec l'OS de votre choix. Les offres Budget tournent sur SATA SSD, les offres Premium sur NVMe avec des cœurs Ryzen 9 à haute fréquence.",
        included: [
          "Accès root et sudo complet",
          "L'OS de votre choix",
          "Montées en gamme et changements d'offre gérés par une personne",
          "Une vraie personne à qui parler si quelque chose casse",
        ],
      },
      game: {
        label: "Serveurs de jeu",
        intro:
          "Ces offres ne sont pas verrouillées sur un seul jeu. Choisissez la RAM qu'il vous faut et faites tourner ce que vous voulez. Nous gérons la plupart des titres qui proposent un serveur dédié, dont Minecraft, Rust, CS2, ARK, Valheim, FiveM et Palworld. Vous ne voyez pas le vôtre ? Demandez-nous. Nous pouvons presque toujours le faire tourner.",
        included: [
          "Panneau de contrôle Pterodactyl",
          "Protection DDoS intégrée",
          "Prise en charge complète des mods et des plugins",
          "Mise en ligne le jour même, la plupart du temps",
          "Une vraie personne à qui parler si quelque chose casse",
        ],
      },
    },
    groups: {
      'budget-vps': {
        label: "VPS Budget",
        description: "Du stockage SATA SSD solide à des prix honnêtes.",
        comparison: "10 % moins cher que Hosturly",
      },
      'premium-vps': {
        label: "VPS Premium",
        description:
          "Des disques NVMe sur des cœurs Ryzen 9 à haute fréquence. De la performance réelle, pas juste des chiffres plus gros.",
        comparison: "10 % moins cher que DigitalOcean",
      },
      'budget-game': {
        label: "Serveurs de jeu Budget",
        description: "Des serveurs de jeu sur SATA SSD. En général, vous êtes en ligne le jour même.",
        comparison: "10 % moins cher que Sparked",
      },
      'premium-game': {
        label: "Serveurs de jeu Premium",
        description: "Des disques NVMe et des cœurs Ryzen 9 pour quand la gamme Budget ne suffit plus.",
        comparison: "25 % moins cher que Sparked",
      },
    },
  },
  games: {
    minecraft: {
      tagline: "Java, Bedrock, Paper, Spigot, Forge, Fabric : tout y est.",
      description:
        "Celui par lequel tout le monde commence, et celui qui dépasse le plus vite un hébergement mutualisé. Vanilla, Paper pour les performances, Forge ou Fabric pour les modpacks lourds, ou une configuration compatible Bedrock pour les joueurs console et mobile. C'est l'egg qui décide, pas l'offre.",
      popularFor: ["survie Paper + plugins", "modpacks ATM9 et RLCraft", "serveurs cross-play Bedrock", "serveurs de construction créative"],
      setups: ["1-5 en vanilla", "5-15 en Paper/Spigot avec plugins", "10-20 en légèrement moddé", "Modpacks lourds (RLCraft, ATM9)"],
      faqs: [
        {
          q: "Puis-je faire tourner un serveur moddé comme RLCraft ou ATM9 ?",
          a: "Oui. Minecraft moddé est gourmand en mémoire et profite du stockage NVMe et des cœurs Ryzen 9 de la gamme Premium, mais la gamme Budget fait très bien tourner les modpacks légers.",
        },
        {
          q: "Prenez-vous en charge les joueurs Bedrock sur un serveur Java ?",
          a: "Oui, via un egg compatible Geyser/Floodgate : les joueurs Java et Bedrock/console partagent alors un même monde.",
        },
      ],
    },
    rust: {
      tagline: "Construction de bases et PvP sur un serveur qui encaisse un cycle de wipe complet.",
      description:
        "Rust est impitoyable pour le matériel lors d'un wipe, quand toute la population se connecte d'un coup. Le stockage NVMe garde la génération de carte et le chargement des entités rapides, et nous prenons en charge Oxide/uMod pour les outils d'administration, les kits et les plugins d'économie.",
      popularFor: ["serveurs à plugins Oxide/uMod", "wipes moddés 2x/5x/10x", "personnalisation des monuments et des cartes"],
      setups: ["25 joueurs max, moddé", "50 joueurs max, vanilla ou légèrement moddé", "100+ joueurs max, plugins Oxide"],
      faqs: [
        {
          q: "Mon serveur tiendra-t-il un wipe à pleine population ?",
          a: "La gamme Premium NVMe est faite pour ça. La génération de carte et le pic de connexions du jour de wipe dépendent du stockage et du CPU, et le NVMe associé aux cœurs Ryzen 9 absorbe les deux mieux que les offres SATA.",
        },
        {
          q: "Oxide/uMod est-il pris en charge ?",
          a: "Oui, installez-le comme sur n'importe quel serveur Rust ; la machine sous-jacente est à vous, à configurer comme vous voulez.",
        },
      ],
    },
    'ark-survival-ascended': {
      tagline: "ARK sous Unreal Engine 5, avec la marge de RAM qu'il lui faut vraiment.",
      description:
        "ASA est nettement plus lourd que l'ARK d'origine, surtout avec des mods ou plusieurs cartes réunies en cluster. Nous conseillons de démarrer à 8GB pour une seule carte, puis de monter avant d'ajouter des mods.",
      popularFor: ["configurations multi-cartes en cluster", "serveurs moddés à taux boostés", "serveurs de tribu PvE"],
      setups: ["Une seule carte, petite tribu", "Une seule carte, serveur plein", "Cartes en cluster ou moddées"],
      faqs: [
        {
          q: "Puis-je regrouper plusieurs cartes en cluster ?",
          a: "Oui, chaque carte tourne comme son propre service et vous les reliez en cluster exactement comme en auto-hébergement ; prévoyez simplement la RAM par carte, pas par cluster.",
        },
      ],
    },
    'ark-survival-evolved': {
      tagline: "L'original, toujours celui que visent la plupart des packs de mods.",
      description:
        "C'est toujours la version pour laquelle la plupart des grandes collections de mods (S+, Automated Ark, Classic Flyers) sont conçues. Plus léger en RAM qu'Ascended, donc l'option la plus souple pour un cluster moddé à petit budget.",
      popularFor: ["serveurs moddés S+ et Automated Ark", "clusters classiques Island/Ragnarok"],
      setups: ["Une seule carte, petite tribu", "Une seule carte, moddée", "Cartes en cluster"],
      faqs: [
        {
          q: "Prenez-vous en charge les mods du Steam Workshop ?",
          a: "Oui, les mods s'installent via leur ID Steam Workshop, exactement comme sur un serveur auto-hébergé.",
        },
      ],
    },
    valheim: {
      tagline: "Survie viking en coopération, légère à faire tourner même à pleine capacité.",
      description:
        "L'un des jeux de survie les plus simples à héberger. Un petit groupe tourne tranquillement sur l'offre d'entrée, et même une session de raid de boss avec tout le monde chargé dans le même biome dépasse rarement une offre de milieu de gamme.",
      popularFor: ["mondes moddés BepInEx", "coopération entre amis en petit groupe"],
      setups: ["2-5 joueurs", "5-10 joueurs, moddé (BepInEx)"],
      faqs: [
        {
          q: "BepInEx/Valheim Plus est-il pris en charge ?",
          a: "Oui, installez BepInEx et n'importe quel plugin comme sur un serveur dédié auto-hébergé.",
        },
      ],
    },
    palworld: {
      tagline: "Survie et collection de créatures, l'un des titres récents les plus lourds par joueur.",
      description:
        "Le serveur dédié de Palworld est gourmand en mémoire par joueur comparé aux jeux de survie plus anciens, et la taille des sauvegardes grimpe vite avec une base bien remplie. Mieux vaut viser le haut d'une gamme si vous prévoyez de beaucoup construire.",
      popularFor: ["serveurs de construction en coopération", "serveurs de guilde PvP"],
      setups: ["1-8 joueurs", "16-32 joueurs"],
      faqs: [
        {
          q: "À quelle fréquence Palworld est-il mis à jour, et cela casse-t-il mon serveur ?",
          a: "Les mises à jour sont fréquentes ; nous gardons l'egg du serveur à jour, donc un redémarrage récupère la dernière version sans que vous ayez à gérer les fichiers à la main.",
        },
      ],
    },
    '7-days-to-die': {
      tagline: "Survie zombie avec construction de base et nuits de horde.",
      description:
        "Un jeu de survie en voxels où la vraie menace est la nuit de horde programmée, pas les zombies errants. La génération du monde sollicite fortement le CPU et le stockage au premier démarrage, et le NVMe réduit nettement cette attente.",
      popularFor: ["serveurs PvE nuits de horde", "packs de refonte moddés"],
      setups: ["4-8 joueurs", "8-16 joueurs, moddé"],
      faqs: [
        {
          q: "La génération du monde prend-elle longtemps ?",
          a: "La génération au premier démarrage est le moment le plus lourd pour ce jeu ; la gamme NVMe la raccourcit nettement par rapport au stockage SATA.",
        },
      ],
    },
    'project-zomboid': {
      tagline: "Survie zombie isométrique, brutale par conception.",
      description:
        "Un jeu de survie lent et impitoyable où la mort est définitive et la carte immense. Les mods (et il y en a des milliers) ajoutent une vraie charge : prévoyez de la RAM en plus si votre groupe utilise une longue liste de mods.",
      popularFor: ["serveurs de survie très moddés", "communautés roleplay"],
      setups: ["1-4 joueurs, vanilla", "8-16 joueurs, moddé"],
      faqs: [
        {
          q: "Puis-je utiliser une grosse liste de mods Workshop ?",
          a: "Oui. Les mods du Workshop sont pris en charge ; dimensionnez simplement la RAM selon votre liste de mods plutôt que selon la recommandation vanilla.",
        },
      ],
    },
    'conan-exiles': {
      tagline: "Survie brutale en monde ouvert à l'Âge hyborien.",
      description:
        "Construction de bases, clans et une grande carte ouverte qui demande de vraies ressources pour bien tourner une fois le serveur rempli de constructions de joueurs.",
      popularFor: ["serveurs PvP de clans", "PvE axé construction"],
      setups: ["10-20 joueurs", "30-40 joueurs"],
      faqs: [],
    },
    'the-forest': {
      tagline: "Survie horrifique en coopération sur une île infestée de cannibales.",
      description:
        "Un jeu d'horreur et de survie coopératif sous tension. Un serveur dédié garde le monde persistant que l'hôte soit connecté ou non, ce qui est tout l'intérêt pour un groupe qui joue à des horaires différents.",
      popularFor: ["petits groupes de survie en coopération"],
      setups: ["2-4 joueurs"],
      faqs: [],
    },
    'sons-of-the-forest': {
      tagline: "La suite de The Forest, plus grande et plus belle.",
      description:
        "Le serveur dédié est arrivé après le lancement en accès anticipé et a mûri depuis ; un monde persistant est la principale raison pour laquelle les groupes quittent l'hébergement entre joueurs.",
      popularFor: ["mondes de survie coopératifs persistants"],
      setups: ["2-6 joueurs"],
      faqs: [],
    },
    enshrouded: {
      tagline: "Survie-action en voxels avec une vraie construction de base.",
      description:
        "Un jeu de survie en voxels récent qui mêle combat nerveux et construction poussée. Les données de terrain voxel côté serveur grimpent vite dès qu'un bâtisseur actif rejoint le groupe.",
      popularFor: ["construction de base en coopération", "groupes axés sur les boss"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    'v-rising': {
      tagline: "Survie vampirique avec construction de château et PvP.",
      description:
        "Survie vampirique gothique avec PvP en temps réel et sièges de châteaux. Les performances restent fluides sur des specs modestes, jusqu'à ce que le serveur se remplisse de châteaux élaborés.",
      popularFor: ["serveurs PvP de sièges de châteaux", "serveurs PvE de clans"],
      setups: ["10-20 joueurs", "40 joueurs"],
      faqs: [],
    },
    terraria: {
      tagline: "Aventure bac à sable en 2D, ridiculement légère à héberger.",
      description:
        "L'un des jeux les plus légers de toute cette liste. TShock et les autres frameworks de mods ajoutent des outils d'administration sans vraiment alourdir la charge.",
      popularFor: ["serveurs communautaires gérés avec TShock"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    starbound: {
      tagline: "Le cousin spirituel de Terraria, dans l'espace.",
      description:
        "Un bac à sable de science-fiction de la même famille que Terraria. Léger à faire tourner, même avec un groupe modeste et une poignée de mods.",
      popularFor: ["serveurs d'exploration moddés"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    craftopia: {
      tagline: "Survie et artisanat en monde ouvert, par l'équipe de Palworld.",
      description:
        "De l'artisanat et de la construction nerveux en monde ouvert, avec une longue liste de fonctionnalités. Tourne tranquillement sur une offre de milieu de gamme pour un petit groupe.",
      popularFor: ["petits groupes d'artisanat en coopération"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    'core-keeper': {
      tagline: "Minage et exploration souterrains en bac à sable.",
      description:
        "Un bac à sable minier souterrain tout en douceur, qui reste léger même quand un groupe complet explore différents coins du monde en même temps.",
      popularFor: ["serveurs d'exploration en coopération"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    necesse: {
      tagline: "Survie bac à sable en vue de dessus, avec une vraie défense de base.",
      description:
        "Un jeu de survie bac à sable de plus petite échelle, avec construction de colonies et vagues façon tower defense. Besoins matériels modestes.",
      popularFor: ["coopération autour de la construction de colonies"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    icarus: {
      tagline: "Survie par sessions sur un monde extraterrestre hostile.",
      description:
        "Une survie par sessions où chaque largage est sa propre instance. Un hébergement dédié garde une session en vie pour tout le groupe sans que le PC d'une seule personne ait à la porter.",
      popularFor: ["groupes coopératifs par sessions"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    grounded: {
      tagline: "Survie dans le jardin, à l'échelle des insectes.",
      description:
        "Le jeu de survie miniature d'Obsidian, au fond du jardin. Un serveur dédié garde le monde en vie pour une famille ou un groupe d'amis d'une session à l'autre.",
      popularFor: ["coopération en famille et en petit groupe"],
      setups: ["2-4 joueurs"],
      faqs: [],
    },
    scum: {
      tagline: "Survie hardcore en monde ouvert, avec une simulation de personnage poussée.",
      description:
        "L'un des jeux de survie les plus exigeants de cette liste : la simulation détaillée du métabolisme et des véhicules ajoute une vraie charge côté serveur quand le nombre de joueurs monte.",
      popularFor: ["grands serveurs PvP en monde ouvert"],
      setups: ["10-20 joueurs", "40-64 joueurs"],
      faqs: [],
    },
    astroneer: {
      tagline: "Exploration spatiale et construction de base en coopération, tout en douceur.",
      description:
        "Un jeu d'exploration et de construction coopératif sans stress, sur plusieurs planètes. Tourne tranquillement pour un petit groupe avec des ressources modestes.",
      popularFor: ["construction coopérative détendue"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    stationeers: {
      tagline: "Survie à systèmes complexes, autour de la construction d'une station spatiale.",
      description:
        "Un jeu de construction très porté sur la simulation, où il faut maintenir l'atmosphère, l'énergie et la logistique d'une station spatiale. Le CPU compte plus que pour la plupart des titres de cette liste.",
      popularFor: ["coopération axée sur l'ingénierie"],
      setups: ["2-6 joueurs"],
      faqs: [],
    },
    empyrion: {
      tagline: "Survie, construction et exploration spatiales.",
      description:
        "Un jeu de survie et de construction spatiale avec des vaisseaux et des bases bâtis par les joueurs sur plusieurs planètes. La taille du monde grandit avec le temps de jeu : prévoyez le stockage en conséquence.",
      popularFor: ["serveurs multijoueurs de construction de vaisseaux"],
      setups: ["2-8 joueurs"],
      faqs: [],
    },
    'vintage-story': {
      tagline: "Survie réaliste et profonde, avec vraie métallurgie et vraie agriculture.",
      description:
        "Un bac à sable de survie plus lent et plus porté sur la simulation, dans le genre des Minecraft-like, pensé pour les joueurs qui veulent une vraie profondeur d'artisanat. Léger à héberger.",
      popularFor: ["communautés de survie réaliste"],
      setups: ["2-10 joueurs"],
      faqs: [],
    },
    barotrauma: {
      tagline: "Survie en équipage de sous-marin, moitié simulation, moitié horreur.",
      description:
        "Une simulation d'équipage de sous-marin en 2D avec une vraie gestion des systèmes (réacteurs, brèches dans la coque, créatures hostiles). Un hébergement dédié fait durer les parties sans que la connexion de l'hôte soit un point de défaillance unique.",
      popularFor: ["sessions coopératives en équipage"],
      setups: ["4-8 joueurs"],
      faqs: [],
    },
    eco: {
      tagline: "Survie collaborative construite autour d'une économie commune.",
      description:
        "Un jeu de survie et de construction de civilisation dont tout l'intérêt est une économie et un écosystème partagés. Il tourne mieux avec plus de RAM à mesure que votre monde et le nombre de joueurs grandissent.",
      popularFor: ["serveurs de civilisation et d'économie"],
      setups: ["10-20 joueurs"],
      faqs: [],
    },
    'don-t-starve-together': {
      tagline: "Survie coopérative dans le style graphique gothique de Klei.",
      description:
        "La version multijoueur de Don't Starve. Très léger à héberger, même avec un salon complet, et les mods n'alourdissent presque rien.",
      popularFor: ["mondes coopératifs moddés"],
      setups: ["2-6 joueurs"],
      faqs: [],
    },
    factorio: {
      tagline: "Automatisation et construction d'usines, célèbre pour sa dépendance au CPU.",
      description:
        "Un jeu d'automatisation d'usine dont les bases de fin de partie sont réputées très gourmandes en CPU à mesure que les convoyeurs et les machines se multiplient : celui-ci profite plus que les autres des cœurs Ryzen 9 rapides de notre gamme Premium.",
      popularFor: ["serveurs d'automatisation au long cours"],
      setups: ["2-8 joueurs, début de partie", "grandes usines de fin de partie"],
      faqs: [
        {
          q: "Pourquoi Factorio a-t-il plus besoin de cœurs rapides que de RAM ?",
          a: "La simulation de Factorio est mono-thread et limitée par le CPU à mesure que votre usine grandit : une offre avec de bonnes fréquences par cœur (notre gamme Premium Ryzen 9) maintient les UPS stables plus longtemps que le simple ajout de RAM.",
        },
      ],
    },
    muck: {
      tagline: "Survie roguelike coopérative, rapide et chaotique.",
      description:
        "Un roguelike de survie en sessions courtes, pensé pour des parties coopératives brèves et chaotiques. Besoins d'hébergement minimes.",
      popularFor: ["groupes coopératifs en sessions courtes"],
      setups: ["2-4 joueurs"],
      faqs: [],
    },
    unturned: {
      tagline: "Survie zombie cubique free-to-play, avec une énorme scène de modding.",
      description:
        "Un bac à sable de survie zombie cubique et gratuit, avec une scène de modding Workshop active via les frameworks de plugins Rocket et Unturned 3.x.",
      popularFor: ["serveurs roleplay moddés avec Rocket"],
      setups: ["10-24 joueurs", "32+ joueurs, moddé"],
      faqs: [],
    },
    cs2: {
      tagline: "CS2 compétitif et détente, avec de la place pour les plugins communautaires.",
      description:
        "Peu de ressources par joueur : la vraie question est la stabilité des ticks sous charge. Notre gamme NVMe garde un tick rate stable sur un serveur complet de 10 à 32 joueurs, et les piles de plugins CounterStrikeSharp / MetaMod sont entièrement prises en charge.",
      popularFor: ["serveurs d'entraînement compétitif 5v5", "deathmatch/surf/retake communautaires", "piles de plugins CounterStrikeSharp"],
      setups: ["10-16 joueurs, compétitif classique", "24-32 joueurs, communautaire + plugins"],
      faqs: [
        {
          q: "Puis-je utiliser des plugins CounterStrikeSharp / MetaMod ?",
          a: "Oui, installez-les comme sur n'importe quel serveur dédié CS2 ; rien dans le panneau ne l'empêche.",
        },
      ],
    },
    'team-fortress-2': {
      tagline: "Toujours en forme, surtout avec les plugins SourceMod de la communauté.",
      description:
        "Un shooter Source de longue date, avec un écosystème de plugins SourceMod/MetaMod très fourni, des cartes de jump aux modes de jeu entièrement personnalisés.",
      popularFor: ["serveurs communautaires SourceMod", "cartes de jump et de surf"],
      setups: ["24 joueurs", "32 joueurs, beaucoup de plugins"],
      faqs: [],
    },
    'left-4-dead-2': {
      tagline: "Tir coopératif contre les zombies, avec une énorme bibliothèque de campagnes personnalisées.",
      description:
        "Survie zombie coopérative sur moteur Source, avec des milliers de campagnes et de mods communautaires disponibles via le Workshop.",
      popularFor: ["serveurs de campagnes personnalisées", "serveurs communautaires en mode versus"],
      setups: ["4-8 joueurs"],
      faqs: [],
    },
    'garrys-mod': {
      tagline: "DarkRP, TTT, bac à sable : ce que votre communauté joue vraiment.",
      description:
        "Moins un jeu qu'une plateforme. DarkRP et TTT sont les deux modes les plus lourds et les plus dépendants des add-ons que nous voyons, et tous deux profitent de RAM supplémentaire dès que la collection Workshop d'un serveur dépasse quelques centaines d'éléments.",
      popularFor: ["serveurs roleplay DarkRP", "TTT et Murder", "serveurs de construction en bac à sable"],
      setups: ["Bac à sable, petit groupe", "DarkRP/TTT, 20-40 joueurs"],
      faqs: [
        {
          q: "Puis-je utiliser une grosse collection Workshop DarkRP ?",
          a: "Oui. Les collections Workshop sont prises en charge, et ce sont précisément elles qui font que les serveurs DarkRP profitent de plus de RAM que le jeu de base n'en demande.",
        },
      ],
    },
    squad: {
      tagline: "Guerre tactique interarmes à grande échelle.",
      description:
        "Squad est l'un des shooters tactiques les plus lourds à héberger à pleine capacité de 100 joueurs : la simulation des véhicules et des grandes cartes ajoute une vraie charge CPU.",
      popularFor: ["serveurs interarmes à grande échelle"],
      setups: ["Serveurs de 50 joueurs", "Serveurs de 100 joueurs"],
      faqs: [],
    },
    'insurgency-sandstorm': {
      tagline: "Combat tactique en escouade, nerveux et impitoyable.",
      description:
        "Un shooter tactique basé sur des points de contrôle, avec une empreinte serveur plus réduite et plus facile à gérer que la plupart des shooters militaires à grande échelle.",
      popularFor: ["serveurs coopératifs checkpoint", "versus compétitif"],
      setups: ["8-16 joueurs"],
      faqs: [],
    },
    'killing-floor-2': {
      tagline: "Carnage coopératif contre des hordes.",
      description:
        "Du tir coopératif par vagues contre les zombies (Zeds). Des besoins en ressources modestes, même avec un salon complet de 6 joueurs et des mutateurs activés.",
      popularFor: ["serveurs de mode horde moddés"],
      setups: ["6 joueurs"],
      faqs: [],
    },
    'arma-3': {
      tagline: "Simulation militaire en monde ouvert, avec un scripting de mission poussé.",
      description:
        "Une simulation militaire très moddable dont le vrai coût tient à la complexité des missions et au nombre de mods plutôt qu'au nombre brut de joueurs : une mission Zeus scriptée à 40 joueurs peut peser plus lourd qu'un simple TvT à 80 joueurs.",
      popularFor: ["communautés milsim", "missions Zeus et King of the Hill"],
      setups: ["20-40 joueurs, mods légers", "Missions très moddées ou scriptées"],
      faqs: [],
    },
    'arma-reforger': {
      tagline: "Simulation militaire sur moteur Enfusion, le banc d'essai moderne d'Arma.",
      description:
        "L'entrée la plus récente et la plus épurée de la gamme Arma, bâtie sur le moteur Enfusion qui propulsera à terme Arma 4. Développée activement, avec une prise en charge des mods qui s'étoffe.",
      popularFor: ["serveurs Conflict et Combat Ops"],
      setups: ["32-64 joueurs"],
      faqs: [],
    },
    'no-more-room-in-hell': {
      tagline: "Horreur et survie coopératives gratuites, sur moteur Source.",
      description:
        "Un shooter d'horreur et de survie zombie coopératif, gratuit et sous tension, bâti sur Source. Léger en ressources serveur.",
      popularFor: ["scénarios d'horreur en coopération"],
      setups: ["8 joueurs"],
      faqs: [],
    },
    mordhau: {
      tagline: "Combat médiéval au corps à corps, à grande échelle.",
      description:
        "Du combat au corps à corps à grande échelle, avec une escrime pilotée par la physique. La charge serveur dépend surtout du nombre de joueurs et de la taille de la carte.",
      popularFor: ["serveurs de grandes batailles au corps à corps"],
      setups: ["32-64 joueurs"],
      faqs: [],
    },
    fivem: {
      tagline: "Serveurs roleplay GTA V, du petit groupe à la ville entière.",
      description:
        "Les communautés roleplay vivent et meurent au rythme du nombre de ressources et des performances de la base de données, pas seulement du nombre de places. Une ville ESX/QBCore complète, avec une vraie économie, des métiers personnalisés et une persistance sur MySQL, demande nettement plus que le strict minimum annoncé par le framework.",
      popularFor: ["villes roleplay ESX et QBCore", "scripts de métiers et d'économie personnalisés", "communautés en liste blanche"],
      setups: ["Petit groupe, framework de base", "Ville ESX/QBCore, 32-64 places", "Grande ville, 100+ places, scripts lourds"],
      faqs: [
        {
          q: "Prenez-vous en charge ESX ou QBCore d'office ?",
          a: "Le framework de base s'installe comme sur n'importe quelle machine FiveM ; nous ne vous enfermons ni dans l'un ni dans l'autre.",
        },
        {
          q: "Puis-je connecter une base de données MySQL externe pour l'économie ?",
          a: "Oui, une ville roleplay fait généralement tourner sa propre instance MySQL/MariaDB pour la persistance, et la connexion se fait normalement.",
        },
      ],
    },
    beammp: {
      tagline: "Des sessions multijoueurs sur BeamNG.drive.",
      description:
        "BeamMP apporte un multijoueur persistant à la simulation de véhicules à corps souple de BeamNG.drive. Léger côté serveur, puisque la physique tourne côté client.",
      popularFor: ["serveurs communautaires de conduite et de crash"],
      setups: ["4-16 joueurs"],
      faqs: [],
    },
    satisfactory: {
      tagline: "De la construction d'usine à une échelle qui finit par exiger un vrai serveur.",
      description:
        "Le mode serveur dédié sort entièrement la simulation du PC d'un joueur, ce qui compte dès qu'une usine s'étale sur toute la carte, précisément le moment où un hôte local commence à saccader. Ici, la marge CPU compte autant que la RAM.",
      popularFor: ["méga-usines coopératives persistantes"],
      setups: ["1-4 joueurs, début de partie", "Grandes usines de fin de partie"],
      faqs: [
        {
          q: "Le monde continue-t-il de tourner quand tout le monde se déconnecte ?",
          a: "Oui, c'est tout l'intérêt du mode serveur dédié : l'usine continue d'être simulée et le PC d'aucun joueur n'a à porter la session.",
        },
      ],
    },
    'space-engineers': {
      tagline: "Construction de vaisseaux et de stations spatiales pilotée par la physique.",
      description:
        "Une simulation de construction spatiale en voxels où le vrai coût serveur est la simulation physique des grands vaisseaux, pas seulement le nombre de joueurs. Le CPU compte plus que pour la plupart des bacs à sable.",
      popularFor: ["serveurs de construction en survie et en créatif"],
      setups: ["4-8 joueurs", "grands mondes multijoueurs"],
      faqs: [],
    },
    dayz: {
      tagline: "Survie PvP hardcore en monde ouvert sur la carte Chernarus (et avec des mods).",
      description:
        "Un shooter de survie en monde ouvert impitoyable, avec une énorme scène de modding (CF, Namalsk et des dizaines de mods de refonte) qui ajoutent chacun une vraie charge mémoire par-dessus le jeu de base.",
      popularFor: ["serveurs communautaires moddés", "serveurs hardcore vanilla-plus"],
      setups: ["Vanilla, 40-60 joueurs", "Très moddé (CF, cartes personnalisées)"],
      faqs: [
        {
          q: "Puis-je utiliser des cartes personnalisées comme Namalsk ou Deer Isle ?",
          a: "Oui, les mods de cartes personnalisées fonctionnent comme sur un serveur DayZ auto-hébergé. Dimensionnez simplement la RAM selon la liste de mods, pas selon la base vanilla.",
        },
      ],
    },
    atlas: {
      tagline: "Survie MMO pirate à très grande échelle.",
      description:
        "Un vaste MMO de survie sur thème pirate bâti sur le moteur d'ARK, qui s'étend sur une immense grille océanique. L'un des titres les plus exigeants d'ici à pleine échelle de grille.",
      popularFor: ["serveurs pirates gérés par une compagnie"],
      setups: ["Une seule cellule de grille", "Grille complète multi-cellules"],
      faqs: [],
    },
  },
  gameCategories: {
    'Survival & Sandbox': "Survie et bac à sable",
    'Shooters & Tactical': "Jeux de tir et tactique",
    'Roleplay & Platforms': "Roleplay et plateformes",
    'Building & Simulation': "Construction et simulation",
    'Zombie & PvP': "Zombies et PvP",
  },
  ramLabels: {
    '16GB+ per map': "16GB+ par carte",
    '8GB+ per map': "8GB+ par carte",
    '4-8GB, CPU speed matters more': "4-8GB, la vitesse du CPU compte davantage",
    '16GB+ total': "16GB+ au total",
  },
  legal: {
    privacy: {
      label: "Politique de confidentialité",
      title: "Politique de confidentialité",
      metaDescription: "Comment WSLATL LLC collecte, utilise et protège vos informations personnelles.",
      intro:
        "Nous ne collectons que ce dont nous avons besoin pour faire tourner vos services. Nous ne vendons jamais vos données. Voici exactement ce que nous faisons des informations que vous nous confiez.",
    },
    terms: {
      label: "Conditions de service",
      title: "Conditions de service",
      metaDescription: "Les conditions générales qui régissent votre utilisation des services d'hébergement de WSLATL LLC.",
      intro:
        "Ces conditions régissent votre utilisation de tous les services fournis par WSLATL LLC. Merci de les lire attentivement avant d'utiliser nos services. En utilisant un service WSLATL, vous les acceptez.",
    },
    acceptableUse: {
      label: "Usage acceptable",
      title: "Politique d'usage acceptable",
      metaDescription: "Ce qui est autorisé et ce qui ne l'est pas sur l'infrastructure d'hébergement de WSLATL LLC.",
      intro:
        "Notre infrastructure est partagée entre les clients. Un seul abus touche tout le monde. Cette politique définit ce qui est acceptable et ce qui ne l'est pas sur les serveurs WSLATL. Lisez-la. Respectez-la. Nous la faisons appliquer.",
    },
    refund: {
      label: "Politique de remboursement",
      title: "Politique de remboursement",
      metaDescription:
        "Comment WSLATL LLC traite les demandes de remboursement : les délais de 48 heures et de 14 jours, les motifs éligibles et les éléments non remboursables.",
      intro:
        "Nous gardons notre politique de remboursement simple. Un délai de 48 heures pour n'importe quelle raison. Un délai de 14 jours en cas de vrai problème. Voici exactement ce qui est éligible et ce qui ne l'est pas.",
    },
    sla: {
      label: "Accord de niveau de service",
      title: "Accord de niveau de service",
      metaDescription:
        "Les objectifs de disponibilité de WSLATL LLC par type de service, le préavis de maintenance planifiée et la marche à suivre pour demander un avoir de service.",
      intro:
        "Nos objectifs de disponibilité par type de service, notre façon de gérer la maintenance, et l'avoir de service que vous pouvez demander quand nous manquons un objectif. Ce document reprend la section 5 de nos Conditions de service.",
    },
    dmca: {
      label: "Politique DMCA",
      title: "Politique DMCA",
      metaDescription:
        "Comment déposer une notification de retrait pour atteinte au droit d'auteur, ou une contre-notification, auprès de WSLATL LLC, et notre politique envers les contrevenants récidivistes au titre du 17 U.S.C. 512.",
      intro:
        "Comment signaler une atteinte au droit d'auteur sur l'infrastructure WSLATL, comment un client conteste un retrait, et ce qui arrive aux comptes qui contreviennent de façon répétée.",
    },
    abuse: {
      label: "Politique en matière d'abus",
      title: "Politique en matière d'abus",
      metaDescription:
        "Comment signaler un abus de l'infrastructure de WSLATL LLC (spam, attaques réseau, phishing, malwares, contenus illégaux) et comment nous traitons les signalements.",
      intro:
        "Comment signaler un abus de l'infrastructure WSLATL, ce que nous faisons d'un signalement une fois reçu, et comment nous traitons les services qui sont à l'origine d'un abus.",
    },
    accountCredit: {
      label: "Avoir de compte",
      title: "Conditions de l'avoir de compte",
      metaDescription:
        "Comment fonctionne l'avoir de compte chez WSLATL LLC : acheter de l'avoir, l'appliquer à vos factures, l'offrir à un autre compte, et ce à quoi il peut ou ne peut pas servir.",
      intro:
        "L'avoir de compte est une valeur prépayée que vous dépensez sur les services WSLATL. Il n'expire pas et n'est pas échangeable contre des espèces. Voici exactement comment il fonctionne.",
    },
    subprocessors: {
      label: "Sous-traitants",
      title: "Sous-traitants ultérieurs",
      metaDescription:
        "Les tiers qui traitent des données personnelles pour le compte de WSLATL LLC, ce que chacun reçoit, et comment sont gérés les transferts internationaux.",
      intro:
        "Chaque tiers qui touche à des données personnelles pour notre compte, ce qu'il reçoit et pourquoi. Nommé, pas seulement rangé dans une catégorie.",
    },
    backups: {
      label: "Sauvegardes",
      title: "Politique de sauvegarde",
      metaDescription:
        "Ce que WSLATL LLC sauvegarde, pourquoi les sauvegardes sont assurées au mieux (best-effort), pourquoi vous devriez garder vos propres copies, et comment demander une restauration.",
      intro:
        "Ce que nous sauvegardons, ce qu'une sauvegarde est et n'est pas, et pourquoi vous devriez malgré tout garder vos propres copies. Et comment demander une restauration.",
    },
  },
}

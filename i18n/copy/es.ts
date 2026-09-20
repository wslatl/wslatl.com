import type { Copy } from '@/i18n/copy/en'

/** Spanish copy for the site's own components. */
export const es: Copy = {
  header: {
    skipToContent: 'Saltar al contenido principal',
    home: 'Inicio de WSLATL',
    discord: 'WSLATL en Discord (se abre en una pestaña nueva)',
    getStarted: 'Empezar',
    openMenu: 'Menú',
    closeMenu: 'Cerrar el menú',
    newTab: ' (se abre en una pestaña nueva)',
    login: 'Iniciar sesión',
    clientPanels: 'Paneles de cliente',
    language: 'Idioma',
    chooseLanguage: 'Elige un idioma',
    reviewNote: 'Una persona revisa cada cuenta nueva, normalmente el mismo día.',
  },
  nav: {
    pricing: 'Precios',
    games: 'Servidores de juego',
    services: 'Servicios',
    about: 'Nosotros',
    contact: 'Contacto',
    status: 'Estado',
  },
  portals: {
    billing: { label: 'Portal de facturación', description: 'Facturas, pedidos y tickets de soporte' },
    gamingPanel: { label: 'Panel de juego', description: 'Gestiona tus servidores de juego' },
    vpsPanel: { label: 'Panel VPS', description: 'Gestiona tu VPS' },
    dedicated: { label: 'Portal de dedicados', description: 'Gestiona tus servidores dedicados' },
    cPanel: { label: 'cPanel', description: 'Hosting web y correo' },
    register: { label: 'Solicitar acceso', description: '¿Eres nuevo por aquí? Solicita una cuenta' },
  },
  footer: {
    blurb: (location: string) => `Hosting privado llevado por un equipo pequeño en ${location}. Hosting that actually gives a damn.`,
    columns: {
      hosting: 'Hosting',
      company: 'Empresa',
      clientArea: 'Área de cliente',
      legal: 'Legal',
    },
    links: {
      vpsPlans: 'Planes VPS',
      gamePlans: 'Planes de servidor de juego',
      supportedGames: 'Juegos compatibles',
      dedicated: 'Servidores dedicados',
      web: 'Hosting web',
      about: 'Sobre nosotros',
      howItWorks: 'Cómo funciona el pedido',
      contact: 'Contacto',
      reviews: 'Opiniones en Trustpilot',
      discord: 'Discord',
      status: 'Página de estado',
    },
    rights: (year: number, company: string) => `© ${year} ${company}. Todos los derechos reservados.`,
  },
  email: {
    reveal: 'Mostrar la dirección de correo',
  },
  home: {
    metaTitle: 'Hosting VPS y de servidores de juego barato | WSLATL LLC',
    metaDescription:
      'Hosting VPS asequible, hosting de servidores de juego (Minecraft, Rust, ARK, FiveM y más) y servidores dedicados con protección DDoS y almacenamiento NVMe. Con base en Missouri, y de verdad cogemos el teléfono.',
    hero: {
      // Kept in English everywhere: this is the brand line.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'Hemos trabajado dentro de empresas de hosting. Sabemos lo que sale mal. WSLATL existe para arreglarlo: hosting VPS asequible, hosting de Minecraft y de servidores de juego, y servidores dedicados, con un equipo detrás que de verdad contesta.',
      seePlans: 'Ver planes y precios',
      products: 'Productos',
      entries: {
        vps: 'Hosting VPS',
        game: 'Servidores de juego',
        other: 'Dedicados y hosting web',
      },
      from: (price: string) => `desde ${price}/mes`,
      quoted: 'Presupuesto según tu configuración',
    },
    clients: {
      heading: 'Nuestros clientes confían en nosotros',
      pause: 'Pausar los logos de clientes en movimiento',
    },
    services: {
      heading: 'Qué alojamos',
      intro:
        'Los VPS y los servidores de juego tienen precios publicados. Los servidores dedicados y el hosting web se presupuestan según lo que necesites ejecutar de verdad.',
      from: 'desde',
      perMonth: '/mes',
      quoted: 'Presupuesto según tu configuración',
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
        `${n.plans} planes de ${n.cpuMin} a ${n.cpuMax} ${n.cpuUnit}, de ${n.ramMin} a ${n.ramMax} GB de RAM y de ${n.storageMin} a ${n.storageMax} GB de almacenamiento.`,
      compareVps: 'Comparar planes VPS',
      compareGame: 'Comparar planes de servidor de juego',
      findGame: 'Encuentra tu juego',
      getQuote: 'Pedir presupuesto',
    },
    howItWorks: {
      heading: 'Cómo funciona el pedido',
      intro:
        'Solo aceptamos clientes por solicitud, y es a propósito. Es la forma que tiene un equipo pequeño de cuidar bien de cada cliente.',
      step: (n: number) => `Paso ${n}: `,
      steps: [
        {
          title: 'Solicita acceso',
          description:
            'Rellena una solicitud breve en el portal de facturación. Una persona las lee todas, y la mayoría se aprueban el mismo día.',
        },
        {
          title: 'Cuéntanos qué necesitas',
          description:
            'Una vez aprobada, escríbenos por Discord o abre un ticket. Repasamos tu configuración contigo. Nada de procesos automáticos.',
        },
        {
          title: 'Tu servidor se pone en marcha',
          description:
            'Te lo dejamos montado, te guiamos por tu panel y seguimos disponibles después. La mayoría de clientes están funcionando el mismo día.',
        },
      ],
      readyPrefix: '¿Listo?',
      requestAccess: 'Solicita acceso',
      or: 'o',
      askOnDiscord: 'pregúntanos en Discord',
      readySuffix: 'primero.',
    },
    whyUs: {
      heading: 'La diferencia está en el trato.',
      intro: 'Hemos visto cómo funcionan los grandes proveedores. Creamos WSLATL para ser justo lo contrario.',
      slaNotePrefix: 'Los objetivos de disponibilidad de cada servicio, y los créditos que recibes si no los cumplimos, están en nuestro',
      slaLink: 'Acuerdo de Nivel de Servicio',
      joinDiscord: 'Únete a nuestro Discord',
      openTicket: 'Abrir un ticket',
    },
    about: {
      heading: 'Creamos WSLATL porque nos cansamos de ver a las empresas de hosting ignorar a sus clientes.',
      paragraphs: [
        'Hemos trabajado dentro de empresas de hosting. Hemos visto cómo se acumulan los tickets, cómo se pasa a los clientes de una persona a otra, cómo nadie conoce de verdad tu configuración. Es frustrante y es del todo evitable.',
        'Así que montamos WSLATL. Con base en Missouri, de gestión privada y lo bastante pequeña como para que cada cliente reciba de verdad nuestra atención. No pretendemos ser la empresa de hosting más grande. Queremos ser la que de verdad le recomendarías a un amigo.',
      ],
      closing: 'Aquí tratamos a cada cliente como de la familia. Es la única forma que sabemos de hacer esto.',
      quote:
        'El sector del hosting es duro y tienes que destacar. Nosotros solo queremos tratar a nuestros clientes como a la familia y asegurarnos de que tengan la mejor experiencia posible.',
      quoteAttribution: 'El equipo de WSLATL',
      teamHeading: 'Las personas detrás de WSLATL',
    },
    faq: {
      heading: 'Preguntas frecuentes',
      stillNotSure: '¿Sigues con dudas?',
      askOnDiscord: 'Pregúntanos en Discord',
      alwaysAround: '. Siempre andamos por aquí.',
    },
    contact: {
      heading: 'Una empresa de hosting que te trata como a una persona. Imagínate.',
      body:
        'Solicita acceso y un administrador revisa tu solicitud. Una vez aprobada, te dejamos montado rápido. La mayoría de clientes están en marcha el mismo día.',
      requestAccess: 'Solicitar acceso',
      preferToTalk: '¿Prefieres hablar antes?',
      options: {
        discord: {
          title: 'Discord',
          description:
            'Únete a nuestro servidor y abre un ticket, o escríbenos por mensaje directo. Es la forma más rápida de que te respondamos.',
          cta: 'Únete a nuestro Discord',
        },
        billing: {
          title: 'Ticket en el portal de facturación',
          description:
            '¿Ya eres cliente? Abre un ticket en el portal de facturación. Es lo mejor para dudas de cuenta y de facturación.',
          cta: 'Abrir un ticket',
        },
        email: {
          title: 'Correo electrónico',
          description: '¿Prefieres el correo? Una persona lee todos los mensajes.',
        },
      },
    },
  },
  pricing: {
    metaTitle: 'Precios de hosting VPS y de servidores de juego barato',
    metaDescription: (vps: string, game: string) =>
      `Precios mensuales publicados de hosting VPS desde ${vps} y de hosting de servidores de juego desde ${game}, en SATA SSD o NVMe. Sin precios gancho, y con al menos 30 días de aviso antes de cualquier subida de precio.`,
    heading: 'Precios',
    intro:
      'Todos los planes se facturan cada mes en dólares estadounidenses. Sin trampas al renovar: estos son los precios mensuales de siempre, y cualquier subida llega con al menos 30 días de aviso por escrito.',
    orderingPrefix: 'El pedido empieza con una solicitud breve, y la mayoría se aprueban el mismo día.',
    orderingLink: 'Cómo funciona el pedido',
    lines: {
      vps: 'Hosting VPS',
      game: 'Hosting de servidores de juego',
    },
    from: 'desde',
    perMonth: '/mes',
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string }) =>
      `${n.plans} planes. De ${n.ramMin} a ${n.ramMax} GB de RAM, de ${n.cpuMin} a ${n.cpuMax} ${n.cpuUnit}, SATA SSD o NVMe.`,
    seePlans: (line: string) => `Ver planes de ${line}`,
    planTypes: 'Tipos de plan',
    included: 'Incluido en todos los planes',
    uptimeIncluded: (target: string) => `Objetivo de disponibilidad mensual del ${target} (consulta nuestro SLA)`,
    storageSuffix: 'de almacenamiento',
    table: {
      plan: 'Plan',
      ram: 'RAM',
      storage: 'Almacenamiento',
      traffic: 'Tráfico',
      price: 'Precio',
      order: 'Pedir',
      orderPlan: (plan: string) => ` ${plan} (se abre en una pestaña nueva)`,
      caption: (group: string) => `Planes ${group}, precios mensuales en dólares estadounidenses`,
    },
    custom: {
      heading: 'Servidores dedicados y hosting web',
      body:
        'Estos se presupuestan por configuración en lugar de venderse desde una lista de precios, porque el hardware o el montaje adecuados dependen de lo que vayas a ejecutar. Cuéntanos qué necesitas y te damos un precio.',
      cta: 'Pedir presupuesto',
    },
  },
  games: {
    metaTitle: (more: number) => `Hosting de servidores de juego: Minecraft, Rust, ARK, FiveM y ${more}+ juegos más`,
    metaDescription: (price: string) =>
      `Hosting de servidores de juego con protección DDoS desde ${price}/mes en hardware NVMe y SATA SSD. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld y decenas más, todos en el mismo panel Pterodactyl.`,
    heading: 'Hosting de servidores de juego',
    crumb: 'Juegos',
    introPrefix:
      'Todos los juegos funcionan con los mismos planes con Pterodactyl: eliges la RAM, no un paquete atado a un juego. Busca tu juego para ver una recomendación realista de RAM y luego compara los',
    introLink: 'planes de servidor de juego',
    introSuffix: '. ¿No ves el tuyo? Si tiene servidor dedicado, casi siempre podemos ejecutarlo.',
    searchLabel: 'Buscar juegos',
    searchPlaceholder: (count: number) => `Busca entre ${count} juegos`,
    categories: 'Categorías de juegos',
    // Filled in by the browser (components/games/game-directory.tsx), so
    // these are templates rather than functions: a Client Component can only
    // be handed plain values.
    matchCount: '{shown} de {total} juegos coinciden',
    showing: '{shown} de {total} juegos',
    noMatch: 'Ningún juego coincide con "{query}".',
    noMatchHelp: 'Si tiene servidor dedicado, casi siempre podemos ejecutarlo con los mismos planes.',
    askOnDiscord: 'Pregúntanos en Discord',
    featured: 'Juegos destacados',
    fromPrice: 'desde {price}/mes',
    toStart: '{ram} para empezar',
    detail: {
      metaTitle: (game: string) => `Hosting de servidores de ${game}`,
      heading: (game: string) => `Hosting de servidores de ${game}`,
      order: (game: string) => `Pide tu servidor de ${game}`,
      comparePlans: 'Comparar planes',
      listedUnderPrefix: 'Aparece en',
      listedUnderSuffix: '. Los planes no están atados a un solo juego, así que puedes cambiar de título cuando quieras.',
      ramHeading: (game: string) => `¿Cuánta RAM necesita ${game}?`,
      ramCaption: (game: string) => `RAM recomendada para ${game} y los planes más pequeños que la cubren`,
      setup: 'Configuración',
      recommendedRam: 'RAM recomendada',
      smallestPlans: 'Planes más pequeños que encajan',
      fits: 'Encaja:',
      perMap: 'Por mapa: ',
      or: ' o ',
      tooBig: 'Más grande que nuestros planes de juego: pregúntanos',
      ramNote: 'Son puntos de partida, no límites estrictos. Cualquier plan se puede cambiar más adelante, según crezca tu servidor.',
      popular: (game: string) => `Configuraciones populares de ${game}`,
      included: 'Incluido en todos los planes de juego',
      questions: (game: string) => `Preguntas sobre el hosting de ${game}`,
      moreIn: (category: string) => `Más juegos de ${category}`,
      allGames: 'Todos los juegos',
    },
  },
  legal: {
    metaTitle: 'Legal',
    metaDescription:
      'Todas las políticas de WSLATL LLC en un mismo sitio: privacidad, condiciones del servicio, uso aceptable, reembolsos, SLA, DMCA, abuso, crédito de cuenta, subencargados y copias de seguridad.',
    heading: 'Legal',
    intro:
      'Nuestras políticas, escritas para que se lean. Cada una indica la fecha en que entró en vigor, y cada una puede cambiar por su cuenta, así que comprueba la fecha del documento en el que te apoyes.',
    effective: 'En vigor desde',
    jurisdiction: 'Jurisdicción',
    questions: 'Preguntas',
    onThisPage: 'En esta página',
    documents: 'Documentos legales',
    questionsHeading: '¿Tienes preguntas sobre este documento?',
    questionsBody: 'Somos un equipo pequeño. De verdad puedes hablar con nosotros.',
    askOnDiscord: 'Pregunta en Discord',
    translationNotice:
      'Esta traducción se ofrece para que puedas leerlo en tu propio idioma. La versión en inglés de este documento es la que se aplica.',
    readInEnglish: 'Leer la versión en inglés',
    emailsJoin: "o",
    emailLabel: "Correo",
    uptimeTable: {
      service: "Servicio",
      target: "Objetivo de uptime mensual",
      label: "Objetivos de uptime mensual",
    },
  },
  notFound: {
    metaTitle: 'Página no encontrada',
    heading: 'Esta página no existe.',
    body: 'Puede que el enlace sea antiguo o que la dirección tenga una errata. Aquí es adonde va casi todo el mundo:',
    destinations: {
      pricing: 'Planes y precios',
      games: 'Hosting de servidores de juego',
      services: 'Qué alojamos',
      legal: 'Documentos legales',
    },
    home: 'Volver a la página de inicio',
    askOnDiscord: 'Pregúntanos en Discord',
  },
  breadcrumbs: {
    home: 'Inicio',
  },
}

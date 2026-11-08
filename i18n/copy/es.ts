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
    mainNav: 'Principal',
    newTab: ' (se abre en una pestaña nueva)',
    login: "Acceder",
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
    partners: 'Socios',
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
    blurb: (location: string) => `Hosting privado llevado por un equipo pequeño en ${location}.`,
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
      guides: 'Guías de configuración',
      dedicated: 'Servidores dedicados',
      web: 'Hosting web',
      about: 'Sobre nosotros',
      partners: 'Socios',
      brandKit: 'Kit de marca',
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
    metaTitle: 'WSLATL: hosting de servidores de juego, VPS y dedicados',
    metaDescription: (game: string, vps: string) =>
      `WSLATL es una empresa de hosting pequeña de Missouri que acepta clientes por solicitud. Servidores de juego desde ${game}, VPS desde ${vps} y dedicados.`,
    hero: {
      // Kept in English everywhere: this is the brand line.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'Hemos trabajado dentro de empresas de hosting. Sabemos lo que sale mal. WSLATL existe para arreglarlo: hosting VPS con todos los precios publicados, hosting de Minecraft y de servidores de juego, y servidores dedicados, con un equipo detrás que de verdad contesta.',
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
          title: 'Elige un plan o cuéntanos qué necesitas',
          description:
            'Una vez aprobada tu solicitud, pide un servidor de juego o un VPS en el portal de facturación y paga en línea. Para un servidor dedicado o hosting web, escríbenos por Discord o abre un ticket y lo configuramos contigo.',
        },
        {
          title: 'Tu servidor se pone en marcha',
          description:
            'Los servidores de juego y los VPS suelen estar en marcha el mismo día. Los servidores dedicados tardan más, normalmente unos días laborables. Te guiamos por tu panel y seguimos disponibles después.',
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
      alwaysAround: '. Solemos responder en menos de una hora en horario activo.',
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
    metaTitle: 'Precios de VPS y servidores de juego, todos los planes',
    metaDescription: (vps: string, game: string) =>
      `VPS desde ${vps} y servidores de juego desde ${game} al mes, con cada especificación publicada. Sin precios gancho, y 30 días de aviso antes de cualquier subida.`,
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
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string; storage: string[] }) =>
      `${n.plans} planes. De ${n.ramMin} a ${n.ramMax} GB de RAM, de ${n.cpuMin} a ${n.cpuMax} ${n.cpuUnit}, ${n.storage.join(' o ')}.`,
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
      popular: 'Popular',
      notAvailable: 'n/d',
      price: 'Precio',
      order: 'Pedir',
      orderPlan: (plan: string) => ` ${plan} (se abre en una pestaña nueva)`,
      caption: (group: string) => `Planes ${group}, precios mensuales en dólares estadounidenses`,
    },
    custom: {
      heading: 'Servidores dedicados y hosting web',
      body:
        'Estos se presupuestan por configuración en lugar de venderse desde una lista de precios, porque el hardware o el montaje adecuados dependen de lo que vayas a ejecutar. Cuéntanos qué necesitas y te damos un precio. ¿Ya eres cliente? En el portal de facturación, abre “Browse plans”, elige un servidor en la pestaña “Dedicated servers” y pulsa “Request this server”. Los servidores dedicados tardan más en configurarse que los servidores de juego y los VPS, normalmente unos días laborables.',
      cta: 'Pedir presupuesto',
    },
  },
  games: {
    metaTitle: (more: number) => `Hosting de servidores de juego: Minecraft, Rust, ARK y ${more}+ más`,
    metaDescription: (price: string) =>
      `Servidores de juego desde ${price}/mes, con precio por RAM y no por juego. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld y más en un panel Pterodactyl.`,
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
      metaTitle: (game: string, price: string) => `Servidor de ${game} desde ${price}/mes`,
      metaDescription: (game: string, price: string, tagline: string) =>
        `Alquila tu propio servidor de ${game} con WSLATL desde ${price} al mes. ${tagline}`,
      metaDescriptionNoPrice: (game: string, tagline: string) =>
        `Alquila tu propio servidor de ${game} con WSLATL. Pídenos un plan a su medida. ${tagline}`,
      heading: (game: string) => `Hosting de servidores de ${game}`,
      order: (game: string) => `Pide tu servidor de ${game}`,
      comparePlans: 'Comparar planes',
      listedUnderPrefix: 'Aparece en',
      listedUnderSuffix: '. Los planes no están atados a un solo juego, así que puedes cambiar de título cuando quieras.',
      guidesIntro: '¿Vas a configurar tu servidor tú mismo?',
      guidesLink: (game: string) => `Lee las guías de servidor de ${game}`,
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
      moreIn: (category: string) => `Más juegos de ${category.charAt(0).toLowerCase()}${category.slice(1)}`,
      allGames: 'Todos los juegos',
      plansHeading: 'Planes de servidores de juego',
      plansIntro:
        'Los mismos planes sirven para todos los juegos que alojamos. Premium funciona con un AMD Ryzen 9 3900X con almacenamiento NVMe, y los Budget con un Intel Core i7-6700K más antiguo con SATA SSD.',
      atAGlance: (game: string) => `Hosting de ${game} de un vistazo`,
      hosting: (game: string) => `Hosting de ${game}`,
      budgetNote: 'Los planes Budget funcionan con una CPU más antigua y más cargada, así que pueden ir más lentos en las horas de más uso.',
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
    notTranslated: "Este documento todavía no está traducido, así que se muestra en inglés. En cualquier caso, la versión en inglés es la que se aplica.",
    emailsJoin: "o",
    emailLabel: "Correo",
    uptimeTable: {
      service: "Servicio",
      target: "Objetivo de disponibilidad mensual",
      label: "Objetivos de disponibilidad mensual",
    },
  },
  partners: {
    metaTitle: 'Socios oficiales',
    metaDescription: (percent: string) =>
      `Creadores y comunidades con los que trabajamos. Con el código de un socio tienes un ${percent} de descuento en tu primera factura de hosting, salvo servidores dedicados.`,
    metaDescriptionNoCodes:
      'Creadores y comunidades con los que trabajamos, aprobados por nuestro equipo. Descubre quiénes son y dónde encontrarlos en internet.',
    emptyMetaDescription:
      'Estamos eligiendo a nuestros primeros socios oficiales. ¿Haces vídeos, directos o llevas una comunidad? Descubre cómo funciona nuestro programa de socios y cómo unirte.',
    heading: 'Socios oficiales',
    crumb: 'Socios',
    intro: (percent: string) =>
      `Creadores y comunidades que nuestro equipo ha aprobado. Regístrate con uno de sus códigos de referido y tendrás un ${percent} de descuento en la primera factura de tu hosting, salvo en servidores dedicados.`,
    introNoCodes: 'Creadores y comunidades que nuestro equipo ha aprobado.',
    emptyIntro:
      'Estamos eligiendo a nuestros primeros socios oficiales. ¿Haces vídeos, directos o llevas una comunidad? Esta página podría empezar contigo.',
    featured: 'Destacado',
    officialPartner: 'Socio oficial',
    since: (month: string) => `Socio desde ${month}`,
    referralCode: 'Código de referido',
    copy: 'Copiar',
    copied: 'Copiado',
    copyFailed: 'El código está seleccionado. Cópialo con el teclado o el menú.',
    viewProfile: 'Ver perfil',
    onPlatform: (name: string, platform: string) => `${name} en ${platform}`,
    website: 'Sitio web',
    ghost: {
      title: 'Este podrías ser tú',
      body: '¿Haces vídeos, directos o llevas una comunidad? Hazte socio oficial y ten tu propio perfil aquí.',
      cta: 'Hazte socio',
    },
    program: {
      heading: 'Hazte socio',
      intro: 'Nuestros socios son creadores y comunidades que nuestro equipo aprueba uno a uno. Así funciona.',
      approved: {
        title: 'Aprobado por nuestro equipo',
        body: 'Cuéntanos quién eres y dónde está tu comunidad. Nuestro equipo revisa cada solicitud.',
      },
      code: {
        title: 'Tu propio código de referido',
        body:
          'La gente introduce tu código al registrarse en el portal de facturación, o sigue tu enlace, que lo rellena por ella. ¿Se les olvidó introducirlo? Pueden añadirlo en la página “Referrals” del portal de facturación antes de su primer pago. Una vez aprobado, puedes pedirnos en un ticket un código personalizado: solo letras y números, hasta 32 caracteres, y que no esté ya en uso.',
      },
      discount: {
        title: (percent: string) => `Un ${percent} de descuento en su primera factura`,
        body: (percent: string) =>
          `Quien se registre con tu código obtiene un ${percent} de descuento en la primera factura de su hosting, salvo en servidores dedicados. Se aplica una sola vez, solo a esa primera factura. No se suma a un código promocional: se aplica el descuento mayor.`,
      },
      credit: {
        title: 'Crédito de cuenta para ti',
        body: 'Cuando una persona referida paga su primera factura, recibes una sola vez una parte de ese pago, como crédito de cuenta. Los servidores dedicados no cuentan y, si ese pago se reembolsa, el crédito se retira.',
      },
      profile: {
        title: 'Un perfil en esta página',
        body: 'Con tu permiso, te mostramos aquí con tu banner, tu foto y tus enlaces, y con tu código si quieres que se muestre.',
      },
      discordCta: 'Pregúntanos en Discord',
      ticketCta: 'Abrir un ticket',
      ticketNote:
        '¿Ya eres cliente? Abre un ticket en el portal de facturación y cuéntanos sobre tu canal o tu comunidad.',
      creditLink: 'Cómo funciona el crédito de cuenta',
    },
    profile: {
      metaTitle: (name: string) => `${name}, socio oficial`,
      metaDescription: (code: string, percent: string) =>
        `Regístrate con el código ${code} y obtén un ${percent} de descuento en la primera factura de tu hosting, salvo en servidores dedicados.`,
      metaDescriptionNoCode: (name: string) => `${name} es socio oficial de WSLATL LLC.`,
      about: (name: string) => `Sobre ${name}`,
      links: (name: string) => `Encuentra a ${name} en internet`,
      games: 'Juegos a los que juega',
      referral: (name: string) => `Código de referido de ${name}`,
      signUp: 'Regístrate con este código',
      discount: (percent: string) =>
        `Al registrarte con este código obtienes un ${percent} de descuento en la primera factura de tu hosting, salvo en servidores dedicados. Se aplica una sola vez, solo a esa primera factura. No se suma a un código promocional: se aplica el descuento mayor.`,
      avatarAlt: (name: string) => `Foto de perfil de ${name}`,
      bannerAlt: (name: string) => `Banner de ${name}`,
      allPartners: 'Todos los socios',
    },
  },
  brand: {
    metaTitle: 'Kit de marca: logo, colores, tipografías y voz',
    metaDescription:
      'Descarga el logo de WSLATL en PNG, copia los colores de marca y consulta tipografías, voz y reglas de uso. El kit completo está en Google Drive.',
    heading: 'Kit de marca',
    crumb: 'Kit de marca',
    intro:
      'Todo lo que necesitas para presentar WSLATL ante la gente: el logo, los colores, la tipografía y la voz. Léelo una vez y lo que hagas se verá como debe.',
    audience:
      'Es para cualquiera que ponga material gráfico o textos de WSLATL delante de una persona: nuestro propio equipo, un socio, un diseñador o una agencia.',
    getFullKit: 'Consigue el kit completo',
    getLogo: 'Descarga el logo',
    shortVersion: {
      heading: 'La versión corta',
      items: [
        'Usa el logo tal como se entrega.',
        'Usa estos colores y ningún otro.',
        'Geist para todo, Instrument Serif para los acentos y Geist Mono para el código.',
        'Escribe como una persona que lleva servidores, no como un departamento de marketing.',
      ],
    },
    onThisPage: 'En esta página',
    nav: {
      logo: 'Logo',
      colors: 'Colores',
      type: 'Tipografía',
      voice: 'Voz',
      rules: 'Qué sí y qué no',
      fullKit: 'Kit completo',
    },
    logo: {
      heading: 'El logo',
      intro: 'Usa el material exactamente como se entrega. Cambiar el tamaño está bien. Todo lo demás, no.',
      partsHeading: 'El símbolo y el logo completo',
      parts:
        'El símbolo son tres paneles inclinados, del cian al violeta. El logo completo es el símbolo con el nombre "WSLATL" y la línea "{0}". Usa el símbolo cuando falta espacio y el logo completo cuando hay sitio.',
      specimens: {
        markWhite: 'El símbolo sobre blanco',
        markInk: 'El símbolo sobre Ink',
        lockupWhite: 'El logo completo sobre blanco',
        lockupInk: 'El logo completo sobre Ink',
      },
      surfaces:
        'Blanco, gris claro e Ink (#0F090B) funcionan bien. Las fotos recargadas, no. Si no puedes leer el nombre de un vistazo, el fondo está demasiado cargado: pon el logo sobre un panel liso.',
      violetLead: 'Ojo con el panel violeta.',
      violet:
        'El panel derecho del símbolo es violeta, #5000F8, y desaparece sobre un degradado violeta o azul violáceo. Un degradado sirve como barra de acento, borde o línea bajo el logo, pero el logo en sí va sobre una superficie lisa.',
      clearSpace: {
        heading: 'Espacio libre',
        body: 'X es la altura de las mayúsculas del nombre "WSLATL", más o menos el 18 % de la altura del símbolo. Deja al menos X de espacio vacío por los cuatro lados. Nada entra en la zona azul: ni texto, ni icono, ni borde, ni el extremo de la página.',
        lockup:
          'El logo completo usa el mismo X por los cuatro lados, y X crece o se reduce con el logo. Mantén juntos el símbolo, el nombre y la línea.',
        markCaption: 'Alrededor del símbolo',
        lockupCaption: 'Alrededor del logo completo',
      },
      minimum: {
        heading: 'Tamaños mínimos',
        body: 'Por debajo del mínimo, el logo deja de leerse. Con menos de 190 px de ancho, la línea "{0}" ya no se lee bien: usa solo el símbolo.',
        artwork: 'Versión',
        columnScreen: 'Pantalla',
        columnPrint: 'Impresión',
        mark: 'Símbolo',
        lockup: 'Logo completo',
        markScreen: '16 px',
        markPrint: '5 mm',
        lockupScreen: '190 px de ancho',
        lockupPrint: '45 mm de ancho',
        shipped: (sizes: string) =>
          `Entregamos el símbolo en ${sizes} px. Usa el tamaño más cercano por encima del que necesitas.`,
      },
      downloads: {
        heading: 'Descargas',
        intro: 'PNG con fondo transparente, tal como los entrega el kit.',
        download: 'Descargar',
        markHeading: 'El símbolo',
        markBody:
          'Usa el tamaño más cercano por encima del que necesitas. Para el icono de un servidor de Discord, usa el de 512 o el de 1024.',
        lockupHeading: 'El logo completo',
        uses: {
          social: 'Cabecera para redes sociales',
          preview: 'Vistas previas de enlaces y publicaciones',
          discord: 'Banner de servidor de Discord',
        },
        morePrefix: '¿Necesitas otro tamaño o los archivos SVG? Están en',
        moreLink: 'el kit completo',
        moreSuffix: '.',
      },
      which: {
        heading: '¿Qué archivo necesito?',
        rows: [
          { space: 'Un espacio pequeño y cuadrado', examples: 'Favicon, avatar, icono de app', pick: 'El símbolo' },
          {
            space: 'Un espacio ancho',
            examples: 'Cabecera, firma de correo, banner para redes',
            pick: 'El logo completo',
          },
          {
            space: 'Algo grande o impreso',
            examples: 'Impresión y merchandising',
            pick: 'Los archivos SVG del kit completo',
          },
        ],
      },
      alt: {
        markWhite:
          'El símbolo de WSLATL sobre blanco: tres paneles inclinados, del cian a la izquierda al violeta a la derecha.',
        markInk:
          'El símbolo de WSLATL sobre Ink: tres paneles inclinados, del cian a la izquierda al violeta a la derecha.',
        lockupWhite:
          'El logo completo de WSLATL sobre blanco: el símbolo, el nombre WSLATL y debajo la línea Private Hosting.',
        lockupInk:
          'El logo completo de WSLATL sobre Ink: el símbolo, el nombre WSLATL y debajo la línea Private Hosting.',
        clearSpaceMark:
          'Diagrama del espacio libre alrededor del símbolo: una banda de espacio vacío, de ancho X, rodea los cuatro lados y nada puede entrar en ella.',
        clearSpaceLockup:
          'Diagrama del espacio libre alrededor del logo completo: el mismo X de espacio vacío por los cuatro lados.',
        minimumSizes: 'El símbolo a 256, 192, 160, 128, 96, 64, 48 y 32 píxeles, cada uno más pequeño que el anterior.',
      },
    },
    colors: {
      heading: 'Colores',
      intro:
        'Usa estos y ninguno más. Los colores del logo se tomaron del material tal como se entrega, y los de interfaz son los que ya usan nuestras webs.',
      copy: 'Copiar',
      copied: 'Copiado',
      copyFailed: 'El código hexadecimal está seleccionado. Cópialo con el teclado o el menú.',
      logoHeading: 'Colores del logo',
      logoIntro: 'Los únicos colores del propio logo.',
      gradientsHeading: 'Degradados',
      gradientsIntro:
        'Un recurso de marca, no decoración. Úsalos en superficies grandes o en líneas finas, y nunca pongas texto de cuerpo encima.',
      from: 'Desde',
      to: 'Hasta',
      interfaceHeading: 'Colores de interfaz',
      interfaceIntro: 'Sacados de wslatl.com, la base de conocimiento y el portal de facturación.',
      rulesHeading: 'Reglas de color',
      rules: [
        'Nunca cambies el color del logo. Ni a negro, ni a blanco, ni a un color de marca que te guste más. El degradado forma parte del arte.',
        'Un solo acento por pantalla. Azul primario para acciones, colores semánticos para estados, degradados para superficies grandes. No los tres a la vez.',
        `Nunca dependas solo del color. Un estado también tiene que decir "En línea" o "Degradado" con palabras, o llevar un icono. Mucha gente no distingue el ámbar del rojo.`,
        'El texto de cuerpo es Ink o Paper. Nunca un degradado, nunca un azul de panel intermedio.',
        'Los enlaces son #0079CE sobre claro y #48C5FF sobre oscuro, y siempre van subrayados en el texto de cuerpo. En botones y menús, sin subrayado.',
      ],
      uses: {
        violet: 'Panel derecho del símbolo, extremo del degradado del nombre',
        cyan: 'Extremo cercano del degradado del nombre',
        brandCyan: 'Panel izquierdo del símbolo',
        brandBlue: 'Panel central del símbolo',
        primary: 'Botones, enlaces, estados activos, anillos de foco',
        primarySite: 'El color del tema de wslatl.com, interfaces grandes',
        lightAccent: 'Estados al pasar el cursor, brillo, datos destacados',
        paleAccent: 'Paneles informativos, rellenos suaves',
        secondaryBlue: 'Acciones secundarias',
        ink: 'Fondo oscuro principal',
        inkAlt: 'Fondo del portal de facturación',
        surface: 'Tarjetas, paneles elevados',
        surfaceAlt: 'Bordes, separadores, campos',
        paper: 'Texto principal sobre oscuro',
        muted: 'Texto secundario, metadatos',
        success: 'En línea, activo, sano',
        successAlt: 'Confirmaciones',
        warning: 'Degradado, pendiente, mantenimiento',
        danger: 'Errores, caídas, acciones destructivas',
        info: 'Insignias informativas',
      },
      gradientUses: {
        wordmark: 'Paneles de portada, cabeceras de sección, subrayados de enlaces, barras de progreso y de estado',
        subline: 'Acentos secundarios, fondos de etiquetas, bordes de paneles',
      },
    },
    type: {
      heading: 'Tipografía',
      intro: 'Tres tipografías, cada una con su trabajo.',
      sans: {
        role: 'Sin serifa',
        use: 'Todo lo estructural: títulos, texto de cuerpo, interfaz, botones y tablas.',
        size: 'El cuerpo va de 16 a 18 px con peso 400 y un interlineado de 1,5 a 1,7. Los títulos, con peso 600.',
      },
      serif: {
        role: 'Con serifa',
        use: 'Solo para momentos de acento: la línea "{0}", las citas destacadas y el énfasis en portadas. Con moderación.',
        size: 'De 28 a 56 px con peso 400.',
      },
      mono: {
        role: 'Monoespaciada',
        use: 'Código, comandos, IP, puertos, valores del panel, nombres de archivo y registros de cambios.',
        size: 'De 14 a 16 px con peso 400.',
        noSample: 'Sin muestra aquí: esta web no carga Geist Mono.',
      },
      rules: [
        'En los títulos, mayúscula solo al principio.',
        'Cifras grandes, etiquetas pequeñas.',
        'Mayúsculas solo en etiquetas cortas, de tres palabras o menos.',
      ],
    },
    voice: {
      heading: 'Voz',
      intro:
        'Nuestra voz es el producto. La gente se queda con un hosting pequeño porque alguien contesta, así que lo que escribimos debe sonar como esa persona.',
      scope:
        'Estas son las reglas que siguen nuestros textos en inglés. Los ejemplos son frases reales de ellos, así que se quedan en inglés.',
      areHeading: 'Somos',
      are: ['directos', 'concretos', 'cercanos', 'con un punto de humor', 'sin complejos'],
      notHeading: 'No somos',
      not: ['corporativos', 'exagerados', 'vagos', 'desagradables'],
      rulesHeading: 'Las reglas',
      rules: [
        {
          title: 'Habla como una persona.',
          body: 'Usa contracciones y frases cortas. Una palabrota suave de vez en cuando va con la marca (está literalmente en nuestro lema), pero nunca al hablar de facturación o de temas legales.',
        },
        { title: 'Sé concreto.', body: `"{0}" gana a "{1}". "{2}" gana a "{3}". Da la cifra.` },
        {
          title: 'Asúmelo.',
          body: 'Creamos WSLATL porque los grandes hostings eran malos. Dilo sin nombrarlos.',
        },
        { title: 'Nada de relleno.', body: `Fuera "{0}", "{1}", "{2}", "{3}" y "{4}".` },
        { title: 'No grites en mayúsculas.', body: 'Una palabra en mayúsculas para enfatizar está bien.' },
        { title: 'Respeta el tiempo de quien lee.', body: 'Responde la pregunta en la primera frase.' },
      ],
      examplesHeading: 'Ejemplos reales',
      insteadOf: 'En vez de',
      write: 'Escribe',
    },
    dos: {
      heading: 'Qué sí y qué no',
      intro: 'Estos son los errores que más vemos.',
      doHeading: 'Sí',
      dontHeading: 'No',
      doItems: [
        'Usar el material exactamente como se entrega.',
        'Mantener juntos el símbolo, el nombre y la línea, con el espaciado con el que se entregan.',
        'Dejarle espacio (ver espacio libre).',
      ],
      dontItems: [
        'Estirarlo, aplastarlo o girarlo.',
        'Cambiarle el color, teñirlo o ponerle sombra o contorno.',
        'Ponerlo sobre fotos, ruido o un degradado recargado.',
        'Reconstruirlo a partir de las piezas.',
      ],
      rebuild:
        'Nunca reconstruyas el logo completo con piezas, no vuelvas a espaciar el nombre a mano ni lo escribas con una tipografía que solo se le parezca. El nombre es un gráfico, no texto.',
      tiles: {
        original: 'Material original',
        dark: 'Sobre una superficie oscura',
        lockup: 'Logo completo, sin tocar',
        stretch: 'Estirar o aplastar',
        recolor: 'Cambiar el color',
        shadow: 'Sombra o contorno',
      },
      alt: {
        original: 'El símbolo sobre blanco, tal como se entrega.',
        dark: 'El símbolo sobre un panel oscuro Ink.',
        lockup: 'El logo completo sobre blanco, sin tocar.',
        stretch: 'El símbolo aplastado, más ancho que alto.',
        recolor: 'El símbolo pintado de rojo liso.',
        shadow: 'El símbolo con una sombra difusa alrededor.',
      },
    },
    fullKit: {
      heading: 'El kit completo',
      body: 'Todos los tamaños de logo y de banner, los archivos SVG y la guía en PDF, en una sola carpeta de Google Drive.',
      items: (n: { smallest: number; largest: number; sizes: number; banners: number; pages: number }) => [
        `El símbolo en PNG en ${n.sizes} tamaños, de ${n.smallest} a ${n.largest} px`,
        `El logo completo en PNG en ${n.banners} tamaños de banner`,
        'Los dos archivos SVG',
        `La guía en PDF, de ${n.pages} páginas`,
      ],
      cta: 'Abre el kit completo en Google Drive',
      questionPrefix: '¿Te falta un tamaño o no sabes si una regla cubre lo que estás haciendo?',
      questionLink: 'Pregúntanos en Discord',
      questionSuffix: '. Solemos contestar rápido.',
    },
  },
  share: {
    copyAd: 'Copiar anuncio de Discord',
    copied: 'Copiado',
    copyFailed: 'No se pudo copiar. Selecciona el texto de la vista previa y cópialo tú.',
    preview: 'Vista previa',
    previewTitle: 'Tu anuncio de Discord',
    previewHint: 'Este es el texto exacto que se copia. Pégalo en un canal de Discord y el enlace mostrará nuestra imagen de vista previa.',
    nativeShare: 'Compartir',
    close: 'Cerrar',
    shareOurAd: 'Comparte nuestro anuncio',
    shareOurAdHint: 'Copia un anuncio de Discord ya preparado sobre WSLATL',
    ad: {
      homeIntro: (location: string) => `Hosting privado de un equipo pequeño en ${location}. Servidores de juegos, VPS y servidores dedicados.`,
      brandLine: 'Hosting that actually gives a damn.',
      partnerIntro: (name: string) => `${name} es socio oficial de WSLATL, una empresa de hosting privado para servidores de juegos y VPS.`,
      partnerCode: (code: string) => `Código de referido: \`${code}\``,
      partnerDiscount: (percent: string) => `Regístrate con él y obtén ${percent} de descuento en la primera factura de tu hosting, excepto servidores dedicados.`,
      partnerGames: (games: string) => `Juegos: ${games}`,
      findOnline: (name: string) => `Encuentra a ${name} en línea:`,
      offerHeading: 'Qué ofrecemos',
      whyHeading: 'Por qué WSLATL',
      startHeading: 'Empieza aquí',
      andMore: (n: number) => `y ${n} más`,
      hostingFrom: (price: string) => `Hosting desde ${price}/mes`,
      gamesIntro: 'Todos los juegos funcionan con los mismos planes: eliges la RAM, no un paquete atado a un juego.',
      gamesMore: (count: number) => `${count} juegos compatibles, y si tiene servidor dedicado casi siempre podemos ejecutarlo.`,
      pricingIntro: 'Precios mensuales publicados en dólares estadounidenses. Sin trampas de precio en la renovación.',
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
    label: 'Ruta de navegación',
  },
}

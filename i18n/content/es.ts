import type { ContentTranslation } from '@/i18n/content/types'

/** Spanish translations of the text in data/. */
export const es: ContentTranslation = {
  services: {
    vps: {
      title: 'Hosting VPS',
      description:
        'Recursos aislados, acceso root completo y libertad para ejecutar lo que necesites. Un buen punto medio entre el compartido y el dedicado.',
      features: ['Acceso root y sudo completo', 'El sistema operativo que elijas', 'Planes en SATA SSD o NVMe'],
    },
    game: {
      title: 'Hosting de servidores de juego',
      description:
        'Servidores de juego con un panel de control limpio y cero quebraderos de cabeza. Los mantenemos rápidos, los mantenemos en línea y, si algo se rompe, lo arreglamos.',
      features: ['Panel Pterodactyl incluido', 'Protección DDoS integrada', 'Compatible con mods y plugins'],
    },
    dedicated: {
      title: 'Servidores dedicados',
      description:
        'Tu propio hardware y tus propios recursos. Nadie comparte tu CPU ni tu RAM. Acceso root completo, gestionado o sin gestionar, y estamos disponibles si surge algo.',
      features: ['Sin recursos compartidos', 'Almacenamiento NVMe SSD', 'Acceso remoto por IPMI y KVM', 'Opciones de ancho de banda sin medir'],
    },
    web: {
      title: 'Hosting web',
      description:
        'Hosting fiable para sitios y aplicaciones web, gestionado por nosotros, con una persona de verdad a quien escribir si algo se tuerce.',
      features: ['Certificados SSL gratuitos', 'cPanel con instalación de aplicaciones en un clic', 'Hosting de correo incluido', 'Copias de seguridad mensuales incluidas'],
    },
  },
  commitments: {
    uptime: { label: 'Objetivo de disponibilidad en VPS y hosting web' },
    reply: { label: 'Primera respuesta habitual en Discord en horas activas', value: 'Menos de 1 h' },
    live: { label: 'La mayoría de servidores se activan el mismo día en que te aprueban', value: 'El mismo día' },
    notice: { label: 'Aviso por escrito antes de cualquier subida de precio', value: '30 días' },
  },
  leadFeature: {
    title: 'Hablas con una persona de verdad. Siempre.',
    description:
      'Sin muros de bots ni respuestas de guion. Abre un ticket en tu portal de facturación, escríbenos por Discord o mándanos un mensaje directo, y te atiende alguien que sabe lo que hace y a quien le importa tu servidor.',
  },
  features: {
    hardware: {
      title: 'Hardware que aguanta',
      description:
        'SSD NVMe, CPU de alta frecuencia, rutas de red redundantes y enrutado de baja latencia. Hecho para trabajar duro sin recortar por el camino.',
    },
    uptime: {
      title: 'En línea cuando importa',
      description:
        'Mitigación de DDoS integrada desde el primer momento. Si algo intenta tumbarte, nos encargamos.',
    },
    'application-only': {
      title: 'Exigentes, y por un buen motivo',
      description:
        'Aceptamos clientes por solicitud. No es para hacernos los exclusivos. Es como nos aseguramos de poder atender de verdad a cada cliente que aceptamos.',
    },
  },
  faqs: {
    'getting-started': {
      question: '¿Cómo empiezo?',
      answer:
        'Entra en billing.wslatl.com/register y solicita acceso. Un administrador revisa todas las solicitudes y las aprueba antes de que puedas acceder a ningún servicio. Una vez aprobada, escríbenos por Discord o abre un ticket de facturación y te dejamos montado.',
    },
    'what-makes-you-different': {
      question: '¿Qué diferencia a WSLATL de las grandes empresas de hosting?',
      answer:
        'Somos pequeños a propósito. Somos una empresa privada, solo por solicitud, con base en Missouri. Hemos trabajado dentro de empresas de hosting y hemos visto cómo se ignora a los clientes. En WSLATL, cada cliente tiene acceso directo a nuestro equipo siempre, sin excepción. Nada de colas paradas durante días ni de respuestas copiadas y pegadas.',
    },
    'supported-games': {
      question: '¿Qué juegos admiten los servidores de juego?',
      answer:
        'Usamos Pterodactyl y admitimos una gran variedad de juegos: Minecraft (Java y Bedrock), Rust, CS2, ARK, Valheim, Terraria, FiveM y muchos más. Si tu juego no está en la lista, solo tienes que preguntar. Casi siempre podemos admitirlo.',
    },
    'game-server-cost': {
      question: '¿Cuánto cuesta el hosting de servidores de juego?',
      answer:
        'Los servidores de juego económicos empiezan en {gamePrice} al mes por {gameRam} GB de RAM en SATA SSD, y los planes premium en NVMe empiezan en {gamePremiumPrice} al mes. Los planes VPS empiezan en {vpsPrice}. La página de precios tiene el desglose completo.',
    },
    'response-time': {
      question: '¿Cuánto se tarda de verdad en recibir respuesta?',
      answer:
        'Menos de una hora en Discord durante las horas activas, y a menudo antes. No tenemos un equipo de soporte enorme. Tenemos uno dedicado. Siempre hablarás con alguien que conoce tu servidor y tu configuración concretos, no con alguien leyendo un guion.',
    },
    'managed-hosting': {
      question: '¿Hay opción de hosting gestionado?',
      answer:
        'Sí. Ofrecemos opciones totalmente gestionadas en las que nos encargamos de las actualizaciones, la monitorización y el mantenimiento. También ofrecemos opciones sin gestionar para quien quiera el control total. En nuestra primera conversación vemos qué te funciona mejor.',
    },
    'changes-later': {
      question: '¿Puedo subir, bajar o cambiar cosas más adelante?',
      answer:
        'Por supuesto. Cada relación con un cliente se lleva de forma personal, así que las mejoras, los cambios de plan y las migraciones están a un mensaje de Discord de distancia. Normalmente lo resolvemos el mismo día.',
    },
    'vps-vs-shared': {
      question: '¿Es mejor el hosting VPS que el compartido?',
      answer:
        'Para casi cualquiera que tenga un proyecto serio, sí. Un VPS te da CPU y RAM dedicadas que nadie más toca, acceso root completo y ningún riesgo de que una cuenta vecina hunda tu rendimiento. El hosting compartido es más barato, pero compartes recursos con desconocidos.',
    },
    'ddos-protection': {
      question: '¿Se incluye protección DDoS?',
      answer:
        'Sí. La protección DDoS viene incluida en todos los planes de servidor de juego sin coste extra. Está siempre activa, no es algo que tengas que habilitar ni pagar aparte más adelante.',
    },
  },
  team: {
    'Liam Henry': {
      role: 'Fundador y CEO',
      bio: 'Años en el sector del hosting. Creó WSLATL para dar a los clientes la atención directa que merecen.',
    },
    'Tyler Woollis': {
      role: 'Cofundador y copropietario',
      bio: 'Mantiene la infraestructura firme. Si algo se rompe, él ya lo sabe.',
    },
  },
  reviews: {
    title: 'Lee lo que dicen nuestros clientes',
    body:
      'Todas las opiniones de nuestro perfil público de Trustpilot son reales. No pagamos por ellas, no filtramos las malas y no escondemos las que escuecen.',
    ask: '¿Nos has contratado? Una opinión sincera ayuda a la siguiente persona a decidir si encajamos con ella.',
    cta: 'Ver nuestras opiniones en Trustpilot',
    learnMore: 'Cómo funciona Trustpilot',
  },
  sla: {
    vps: { label: 'Hosting VPS' },
    web: { label: 'Hosting web' },
    game: { label: 'Hosting de servidores de juego' },
    dedicated: {
      label: 'Servidores dedicados',
      target: 'En la medida de lo posible; sujeto a la disponibilidad del hardware y del centro de datos',
    },
  },
  pricing: {
    lines: {
      vps: {
        label: 'VPS',
        intro:
          'Recursos aislados y acceso root completo, con el sistema operativo que elijas. Los planes económicos van en SATA SSD y los Premium en NVMe, con núcleos Ryzen 9 de alta frecuencia.',
        included: [
          'Acceso root y sudo completo',
          'El sistema operativo que elijas',
          'Mejoras y cambios de plan gestionados por una persona',
          'Una persona de verdad con quien hablar si algo se rompe',
        ],
      },
      game: {
        label: 'Servidores de juego',
        intro:
          'Estos planes no están atados a un solo juego. Elige la RAM que necesitas y ejecuta lo que quieras. Nos encargamos de la mayoría de títulos que ofrecen servidor dedicado, incluidos Minecraft, Rust, CS2, ARK, Valheim, FiveM y Palworld. ¿No ves el tuyo? Solo pregunta. Casi siempre podemos ejecutarlo.',
        included: [
          'Panel de control Pterodactyl',
          'Protección DDoS integrada',
          'Compatibilidad total con mods y plugins',
          'Puesta en marcha el mismo día, casi siempre',
          'Una persona de verdad con quien hablar si algo se rompe',
        ],
      },
    },
    groups: {
      'budget-vps': {
        label: 'VPS económicos',
        description: 'Almacenamiento SATA SSD sólido a precios honestos.',
        comparison: '10% por debajo de Hosturly',
      },
      'premium-vps': {
        label: 'VPS Premium',
        description: 'Discos NVMe sobre núcleos Ryzen 9 de alta frecuencia. Rendimiento real, no solo números más grandes.',
        comparison: '10% por debajo de DigitalOcean',
      },
      'budget-game': {
        label: 'Servidores de juego económicos',
        description: 'Servidores de juego en SATA SSD. Normalmente te tenemos en marcha el mismo día.',
        comparison: '10% por debajo de Sparked',
      },
      'premium-game': {
        label: 'Servidores de juego Premium',
        description: 'Discos NVMe y núcleos Ryzen 9 para cuando la línea económica no da más de sí.',
        comparison: '25% por debajo de Sparked',
      },
    },
  },
  games: {
    minecraft: {
      tagline: 'Java, Bedrock, Paper, Spigot, Forge, Fabric: todo.',
      description:
        'El juego con el que todo el mundo empieza, y el que antes se le queda grande a un hosting compartido. Vanilla, Paper para rendimiento, Forge o Fabric para modpacks pesados, o una configuración compatible con Bedrock para jugadores de consola y móvil. Lo decide el egg, no el plan.',
      popularFor: ['survival con Paper y plugins', 'modpacks ATM9 y RLCraft', 'servidores con juego cruzado con Bedrock', 'servidores de construcción en creativo'],
      setups: ['1-5 en vanilla', '5-15 con Paper/Spigot y plugins', '10-20 con pocos mods', 'Modpacks pesados (RLCraft, ATM9)'],
      faqs: [
        { q: '¿Puedo montar un servidor con mods como RLCraft o ATM9?', a: 'Sí. Minecraft con mods consume mucha memoria y aprovecha el almacenamiento NVMe y los núcleos Ryzen 9 de la gama Premium, pero la gama económica mueve bien los modpacks ligeros.' },
        { q: '¿Se pueden conectar jugadores de Bedrock a un servidor de Java?', a: 'Sí, con un egg compatible con Geyser/Floodgate, de forma que los jugadores de Java y los de Bedrock o consola comparten un mismo mundo.' },
      ],
    },
    rust: {
      tagline: 'Construcción de bases y PvP en un servidor que aguanta un ciclo de wipe entero.',
      description:
        'Rust no perdona al hardware durante un wipe nuevo, cuando toda la población entra a la vez. El almacenamiento NVMe mantiene rápidas la generación del mapa y la carga de entidades, y admitimos Oxide/uMod para herramientas de administración, kits y plugins de economía.',
      popularFor: ['servidores con plugins Oxide/uMod', 'wipes con mods 2x/5x/10x', 'personalización de monumentos y mapas'],
      setups: ['Límite de 25, con mods', 'Límite de 50, vanilla o con pocos mods', 'Límite de 100+, con plugins de Oxide'],
      faqs: [
        { q: '¿Aguantará mi servidor un wipe a plena población?', a: 'La gama Premium con NVMe está hecha justo para esto. La generación del mapa y el pico de conexiones del día del wipe dependen del almacenamiento y de la CPU, y el NVMe junto con los núcleos Ryzen 9 absorbe ambos mejor que los planes SATA.' },
        { q: '¿Se admite Oxide/uMod?', a: 'Sí, se instala igual que en cualquier servidor de Rust; la máquina es tuya para configurarla.' },
      ],
    },
    'ark-survival-ascended': {
      tagline: 'ARK en Unreal Engine 5, con el margen de RAM que de verdad necesita.',
      description:
        'ASA es bastante más pesado que el ARK original, sobre todo con mods o con varios mapas en clúster. Recomendamos empezar con 8GB para un solo mapa e ir subiendo desde ahí antes de añadir mods.',
      popularFor: ['configuraciones en clúster con varios mapas', 'servidores con mods y ritmos acelerados', 'servidores PvE de tribus'],
      setups: ['Un mapa, tribu pequeña', 'Un mapa, servidor lleno', 'Mapas en clúster o con mods'],
      faqs: [
        { q: '¿Puedo unir varios mapas en un clúster?', a: 'Sí, cada mapa funciona como su propio servicio y los enlazas en un clúster igual que si lo alojaras tú mismo; solo calcula la RAM por mapa, no por clúster.' },
      ],
    },
    'ark-survival-evolved': {
      tagline: 'El original, y todavía al que apuntan la mayoría de packs de mods.',
      description:
        'Sigue siendo la versión para la que están hechas la mayoría de las grandes colecciones de mods (S+, Automated Ark, Classic Flyers). Consume menos RAM que Ascended, así que es la opción más llevadera para un clúster con mods y poco presupuesto.',
      popularFor: ['servidores con mods S+ y Automated Ark', 'clústeres clásicos de Island y Ragnarok'],
      setups: ['Un mapa, tribu pequeña', 'Un mapa, con mods', 'Mapas en clúster'],
      faqs: [
        { q: '¿Se pueden usar mods del Steam Workshop?', a: 'Sí, los mods se instalan con su ID del Steam Workshop igual que en un servidor propio.' },
      ],
    },
    valheim: {
      tagline: 'Supervivencia vikinga en cooperativo que pide poco, incluso con el servidor lleno.',
      description:
        'Uno de los juegos de supervivencia más fáciles de alojar. Un grupo pequeño va cómodo en el plan de entrada, y ni una sesión entera de jefe con todo el mundo cargado en un mismo bioma suele necesitar más que un plan intermedio.',
      popularFor: ['mundos con mods de BepInEx', 'cooperativo con un grupo pequeño de amigos'],
      setups: ['2-5 jugadores', '5-10 jugadores, con mods (BepInEx)'],
      faqs: [
        { q: '¿Se admite BepInEx/Valheim Plus?', a: 'Sí, BepInEx y cualquier plugin se instalan igual que en un servidor dedicado propio.' },
      ],
    },
    palworld: {
      tagline: 'Supervivencia con criaturas coleccionables, uno de los títulos recientes que más pide por jugador.',
      description:
        'El servidor dedicado de Palworld consume más memoria por jugador que los juegos de supervivencia más antiguos, y el tamaño de la partida guardada crece rápido con una base muy activa. Si esperas mucha construcción, recomendamos tirar hacia la parte alta de la gama.',
      popularFor: ['servidores cooperativos de construcción de bases', 'servidores PvP de gremios'],
      setups: ['1-8 jugadores', '16-32 jugadores'],
      faqs: [
        { q: '¿Cada cuánto se actualiza Palworld, y eso rompe mi servidor?', a: 'Las actualizaciones son frecuentes; mantenemos al día el egg del servidor, así que con un reinicio se toma la última versión sin que tengas que tocar archivos a mano.' },
      ],
    },
    '7-days-to-die': {
      tagline: 'Supervivencia zombi con construcción de bases y noches de horda.',
      description: 'Un juego de supervivencia con voxels en el que la amenaza real es la noche de horda programada, no los zombis que deambulan. La generación del mundo exige CPU y almacenamiento en el primer arranque, así que el NVMe recorta bastante esa espera.',
      popularFor: ['servidores PvE de noches de horda', 'packs de mods que rehacen el juego'],
      setups: ['4-8 jugadores', '8-16 jugadores, con mods'],
      faqs: [{ q: '¿Tarda mucho la generación del mundo?', a: 'La generación del primer arranque es el momento más exigente de este juego; la gama NVMe la acorta de forma notable frente al almacenamiento SATA.' }],
    },
    'project-zomboid': {
      tagline: 'Supervivencia zombi isométrica, dura a propósito.',
      description: 'Un juego de supervivencia lento y castigador en el que la muerte es permanente y el mapa es enorme. Los mods (y hay miles) añaden carga real, así que calcula RAM de sobra si tu grupo lleva una lista de mods pesada.',
      popularFor: ['servidores de supervivencia con muchos mods', 'comunidades de rol'],
      setups: ['1-4 jugadores, en vanilla', '8-16 jugadores, con mods'],
      faqs: [{ q: '¿Puedo usar una lista grande de mods del Workshop?', a: 'Sí. Los mods del Workshop son compatibles; solo ajusta la RAM a tu lista de mods en lugar de a la recomendación de vanilla.' }],
    },
    'conan-exiles': {
      tagline: 'Supervivencia brutal en mundo abierto en la Era Hiboria.',
      description: 'Construcción de bases, clanes y un mapa abierto grande que pide recursos de verdad para ir bien en cuanto el servidor se llena de estructuras construidas por los jugadores.',
      popularFor: ['servidores PvP de clanes', 'PvE centrado en la construcción'],
      setups: ['10-20 jugadores', '30-40 jugadores'],
      faqs: [],
    },
    'the-forest': {
      tagline: 'Terror y supervivencia en cooperativo en una isla plagada de caníbales.',
      description: 'Un juego de terror y supervivencia cooperativa muy tenso. Un servidor dedicado mantiene el mundo persistente esté o no conectado el anfitrión, que es justo lo que busca un grupo que juega a horas distintas.',
      popularFor: ['grupos pequeños de supervivencia en cooperativo'],
      setups: ['2-4 jugadores'],
      faqs: [],
    },
    'sons-of-the-forest': {
      tagline: 'La secuela de The Forest, más grande y más vistosa.',
      description: 'El componente de servidor dedicado llegó después del lanzamiento en acceso anticipado y ha madurado desde entonces; un mundo persistente es el motivo principal por el que los grupos dejan de alojar la partida entre ellos.',
      popularFor: ['mundos persistentes de supervivencia en cooperativo'],
      setups: ['2-6 jugadores'],
      faqs: [],
    },
    enshrouded: {
      tagline: 'Acción y supervivencia con voxels y construcción de bases de verdad.',
      description: 'Un juego de supervivencia con voxels más reciente, que mezcla combate de acción con una construcción de bases profunda. Los datos de terreno de voxels del servidor se acumulan rápido si hay un constructor activo en el grupo.',
      popularFor: ['construcción de bases en cooperativo', 'grupos centrados en los jefes'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    'v-rising': {
      tagline: 'Supervivencia vampírica con construcción de castillos y PvP.',
      description: 'Supervivencia vampírica de estilo gótico con PvP en tiempo real y asedios a castillos. El rendimiento se mantiene fluido con especificaciones modestas hasta que el servidor se llena de castillos elaborados.',
      popularFor: ['servidores PvP de asedios a castillos', 'servidores PvE de clanes'],
      setups: ['10-20 jugadores', '40 jugadores'],
      faqs: [],
    },
    terraria: {
      tagline: 'Aventura sandbox en 2D, absurdamente ligera de alojar.',
      description: 'Uno de los juegos más ligeros de toda esta lista. TShock y otros frameworks de mods añaden herramientas de administración sin añadir carga apreciable.',
      popularFor: ['servidores de comunidad gestionados con TShock'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    starbound: {
      tagline: 'El primo espiritual de Terraria, en el espacio.',
      description: 'Un sandbox de ciencia ficción de la misma familia que Terraria. Ligero de ejecutar incluso con un grupo modesto y un puñado de mods.',
      popularFor: ['servidores de exploración con mods'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    craftopia: {
      tagline: 'Supervivencia y creación en mundo abierto, del equipo de Palworld.',
      description: 'Creación y construcción en mundo abierto a buen ritmo y con una larga lista de funciones. Va cómodo en un plan intermedio para un grupo pequeño.',
      popularFor: ['grupos pequeños de creación en cooperativo'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    'core-keeper': {
      tagline: 'Minería y exploración sandbox bajo tierra.',
      description: 'Un sandbox tranquilo de minería subterránea que sigue siendo ligero aunque un grupo entero explore rincones distintos del mundo a la vez.',
      popularFor: ['servidores de exploración en cooperativo'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    necesse: {
      tagline: 'Supervivencia sandbox con vista cenital y defensa de base de verdad.',
      description: 'Un juego de supervivencia sandbox de menor escala, con construcción de asentamientos y oleadas al estilo tower defense. Necesita poco hardware.',
      popularFor: ['cooperativo de construcción de asentamientos'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    icarus: {
      tagline: 'Supervivencia por sesiones en un mundo alienígena hostil.',
      description: 'Supervivencia por sesiones en la que cada descenso es su propia instancia. Un servidor dedicado mantiene la sesión en marcha para el grupo sin que el PC de una sola persona cargue con todo.',
      popularFor: ['grupos cooperativos que juegan por sesiones'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    grounded: {
      tagline: 'Supervivencia en el jardín a escala de insecto.',
      description: 'El juego de supervivencia en miniatura de Obsidian, ambientado en un jardín trasero. Un servidor dedicado mantiene vivo el mundo para una familia o un grupo de amigos entre una sesión y otra.',
      popularFor: ['cooperativo en familia y en grupos pequeños'],
      setups: ['2-4 jugadores'],
      faqs: [],
    },
    scum: {
      tagline: 'Supervivencia hardcore en mundo abierto con una simulación de personaje muy detallada.',
      description: 'Uno de los juegos de supervivencia más exigentes de esta lista: la simulación detallada del metabolismo y de los vehículos añade carga real en el servidor cuando sube el número de jugadores.',
      popularFor: ['servidores grandes de PvP en mundo abierto'],
      setups: ['10-20 jugadores', '40-64 jugadores'],
      faqs: [],
    },
    astroneer: {
      tagline: 'Exploración espacial y construcción de bases en cooperativo, sin estrés.',
      description: 'Un juego de exploración y construcción en cooperativo sin agobios, repartido por varios planetas. Va cómodo para un grupo pequeño con recursos modestos.',
      popularFor: ['construcción en cooperativo sin prisas'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    stationeers: {
      tagline: 'Supervivencia de sistemas profundos construyendo una estación espacial.',
      description: 'Un juego de construcción muy simulado que va de mantener en marcha la atmósfera, la energía y la logística de una estación espacial. Aquí la CPU importa más que en casi todos los títulos de esta lista.',
      popularFor: ['cooperativo centrado en la ingeniería'],
      setups: ['2-6 jugadores'],
      faqs: [],
    },
    empyrion: {
      tagline: 'Supervivencia, construcción y exploración en el espacio.',
      description: 'Un juego de supervivencia y construcción espacial con naves y bases construidas por los jugadores en varios planetas. El tamaño del mundo crece con las horas de juego, así que calcula el almacenamiento con eso en mente.',
      popularFor: ['servidores multijugador de construcción de naves'],
      setups: ['2-8 jugadores'],
      faqs: [],
    },
    'vintage-story': {
      tagline: 'Supervivencia profunda y realista, con metalurgia y agricultura de verdad.',
      description: 'Un sandbox de supervivencia más pausado y más simulado dentro del género tipo Minecraft, pensado para quien quiere profundidad real en la creación de objetos. Ligero de alojar.',
      popularFor: ['comunidades de supervivencia realista'],
      setups: ['2-10 jugadores'],
      faqs: [],
    },
    barotrauma: {
      tagline: 'Supervivencia de una tripulación de submarino, mitad simulador, mitad terror.',
      description: 'Una simulación en 2D de tripulación de submarino con gestión real de sistemas (reactores, vías de agua, criaturas hostiles). Un servidor dedicado mantiene las partidas en marcha sin que la conexión del anfitrión sea un único punto de fallo.',
      popularFor: ['sesiones cooperativas en tripulación'],
      setups: ['4-8 jugadores'],
      faqs: [],
    },
    eco: {
      tagline: 'Supervivencia colaborativa construida alrededor de una economía compartida.',
      description: 'Un juego de supervivencia y construcción de civilizaciones cuyo sentido entero es una economía y un ecosistema compartidos. Va mejor con más RAM a medida que crecen tu mundo y tu número de jugadores.',
      popularFor: ['servidores de civilización y economía'],
      setups: ['10-20 jugadores'],
      faqs: [],
    },
    'don-t-starve-together': {
      tagline: 'Supervivencia en cooperativo con el estilo gótico de Klei.',
      description: "La versión multijugador de Don't Starve. Muy ligero de alojar, incluso con la sala llena, y los mods apenas añaden carga.",
      popularFor: ['mundos cooperativos con mods'],
      setups: ['2-6 jugadores'],
      faqs: [],
    },
    factorio: {
      tagline: 'Automatización y construcción de fábricas, famoso por depender de la CPU.',
      description: 'Un juego de automatización de fábricas cuyas bases avanzadas son conocidas por exigir mucha CPU según se multiplican cintas y máquinas, así que este aprovecha los núcleos Ryzen 9 más rápidos de nuestra gama Premium más que la mayoría.',
      popularFor: ['servidores de automatización de larga duración'],
      setups: ['2-8 jugadores, principio de partida', 'fábricas grandes de partida avanzada'],
      faqs: [{ q: '¿Por qué Factorio necesita núcleos rápidos más que RAM?', a: 'La simulación de Factorio es de un solo hilo y depende de la CPU según crece tu fábrica, así que un plan con buena frecuencia por núcleo (nuestra gama Premium con Ryzen 9) mantiene estables los UPS durante más tiempo que simplemente añadir RAM.' }],
    },
    muck: {
      tagline: 'Supervivencia roguelike en cooperativo, rápida y caótica.',
      description: 'Un juego de supervivencia roguelike de sesiones cortas, pensado para partidas cooperativas breves y caóticas. Requisitos de alojamiento mínimos.',
      popularFor: ['grupos cooperativos de partidas rápidas'],
      setups: ['2-4 jugadores'],
      faqs: [],
    },
    unturned: {
      tagline: 'Supervivencia zombi de bloques y gratuita, con una enorme escena de mods.',
      description: 'Un sandbox gratuito de supervivencia zombi con estética de bloques y una escena de mods activa en el Workshop, a través de los frameworks de plugins Rocket y Unturned 3.x.',
      popularFor: ['servidores de rol con mods de Rocket'],
      setups: ['10-24 jugadores', '32+ jugadores, con mods'],
      faqs: [],
    },
    cs2: {
      tagline: 'CS2 competitivo y casual, con sitio para plugins de la comunidad.',
      description:
        'Consume pocos recursos por jugador, así que la pregunta real es la estabilidad del tick bajo carga. Nuestra gama NVMe mantiene estable la tasa de tick en un servidor lleno de 10-32 jugadores, y los conjuntos de plugins de CounterStrikeSharp / MetaMod son totalmente compatibles.',
      popularFor: ['servidores de práctica competitiva 5v5', 'deathmatch/surf/retake de comunidad', 'conjuntos de plugins de CounterStrikeSharp'],
      setups: ['10-16 jugadores, competitivo sin extras', '24-32 jugadores, comunidad y plugins'],
      faqs: [
        { q: '¿Puedo usar plugins de CounterStrikeSharp o MetaMod?', a: 'Sí, se instalan igual que en cualquier servidor dedicado de CS2; nada del panel lo impide.' },
      ],
    },
    'team-fortress-2': {
      tagline: 'Sigue muy vivo, sobre todo con los plugins de SourceMod de la comunidad.',
      description: 'Un shooter veterano del motor Source con un ecosistema enorme de plugins de SourceMod/MetaMod que va desde mapas de saltos hasta modos de juego personalizados completos.',
      popularFor: ['servidores de comunidad con SourceMod', 'mapas de saltos y de surf'],
      setups: ['24 jugadores', '32 jugadores, con muchos plugins'],
      faqs: [],
    },
    'left-4-dead-2': {
      tagline: 'Disparos a zombis en cooperativo con una enorme biblioteca de campañas personalizadas.',
      description: 'Supervivencia zombi en cooperativo sobre el motor Source, con miles de campañas y mods de la comunidad disponibles en el Workshop.',
      popularFor: ['servidores de campañas personalizadas', 'servidores de comunidad en modo versus'],
      setups: ['4-8 jugadores'],
      faqs: [],
    },
    'garrys-mod': {
      tagline: 'DarkRP, TTT, sandbox: lo que tu comunidad juegue de verdad.',
      description: 'Más que un juego, es una plataforma. DarkRP y TTT son los dos modos más pesados y más dependientes de complementos que vemos, y ambos agradecen RAM extra en cuanto la colección del Workshop de un servidor pasa de unos cientos de elementos.',
      popularFor: ['servidores de rol DarkRP', 'TTT y Murder', 'servidores sandbox de construcción'],
      setups: ['Sandbox, grupo pequeño', 'DarkRP/TTT, 20-40 jugadores'],
      faqs: [{ q: '¿Puedo usar una colección grande del Workshop para DarkRP?', a: 'Sí. Las colecciones del Workshop son compatibles, y son justo el motivo por el que los servidores de DarkRP agradecen más RAM de la que pide el juego base.' }],
    },
    squad: {
      tagline: 'Guerra táctica a gran escala con armas combinadas.',
      description: 'Squad es uno de los shooters tácticos más pesados de alojar a plena capacidad de 100 jugadores: la simulación de vehículos y de mapas grandes añade carga real de CPU.',
      popularFor: ['servidores grandes de armas combinadas'],
      setups: ['Servidores de 50 jugadores', 'Servidores de 100 jugadores'],
      faqs: [],
    },
    'insurgency-sandstorm': {
      tagline: 'Combate táctico por escuadras, medido y castigador.',
      description: 'Un shooter táctico basado en puntos de control, con una huella de servidor más pequeña y manejable que la de la mayoría de shooters militares a gran escala.',
      popularFor: ['servidores cooperativos de checkpoint', 'versus competitivo'],
      setups: ['8-16 jugadores'],
      faqs: [],
    },
    'killing-floor-2': {
      tagline: 'Caos cooperativo de disparos contra hordas.',
      description: 'Disparos en cooperativo por oleadas contra zombis (Zeds). Pide pocos recursos incluso con una sala llena de 6 jugadores y mutadores activados.',
      popularFor: ['servidores de modo horda con mods'],
      setups: ['6 jugadores'],
      faqs: [],
    },
    'arma-3': {
      tagline: 'Simulación militar en mundo abierto con guiones de misión muy profundos.',
      description: 'Un simulador militar muy modificable cuyo coste real está en la complejidad de la misión y el número de mods, no en la cantidad de jugadores: una misión Zeus con guion y 40 jugadores puede pesar más que un TvT sencillo de 80.',
      popularFor: ['comunidades de milsim', 'misiones Zeus y King of the Hill'],
      setups: ['20-40 jugadores, pocos mods', 'Misiones con muchos mods o guiones'],
      faqs: [],
    },
    'arma-reforger': {
      tagline: 'Simulador militar en el motor Enfusion, el banco de pruebas del Arma moderno.',
      description: 'La entrega más reciente y más ligera de la línea Arma, construida sobre el motor Enfusion que con el tiempo moverá Arma 4. En desarrollo activo y con un soporte de mods en crecimiento.',
      popularFor: ['servidores de conflicto y de operaciones de combate'],
      setups: ['32-64 jugadores'],
      faqs: [],
    },
    'no-more-room-in-hell': {
      tagline: 'Terror y supervivencia en cooperativo, gratis y en el motor Source.',
      description: 'Un shooter gratuito de terror y supervivencia zombi en cooperativo, tenso y construido sobre Source. Ligero en recursos de servidor.',
      popularFor: ['escenarios de terror en cooperativo'],
      setups: ['8 jugadores'],
      faqs: [],
    },
    mordhau: {
      tagline: 'Combate medieval cuerpo a cuerpo a gran escala.',
      description: 'Combate cuerpo a cuerpo a gran escala con esgrima basada en físicas. La carga del servidor sube sobre todo con el número de jugadores y el tamaño del mapa.',
      popularFor: ['servidores grandes de batallas cuerpo a cuerpo'],
      setups: ['32-64 jugadores'],
      faqs: [],
    },
    fivem: {
      tagline: 'Servidores de rol de GTA V, desde un grupo pequeño hasta una ciudad entera.',
      description:
        'Las comunidades de rol viven o mueren por el número de recursos y el rendimiento de la base de datos, no solo por las plazas de jugador. Una ciudad completa con ESX/QBCore, economía real, trabajos personalizados y persistencia en MySQL necesita bastante más de lo que sugiere el mínimo del framework.',
      popularFor: ['ciudades de rol con ESX y QBCore', 'scripts personalizados de trabajos y economía', 'comunidades con lista blanca'],
      setups: ['Grupo pequeño, framework base', 'Ciudad ESX/QBCore, 32-64 plazas', 'Ciudad grande, 100+ plazas, scripts pesados'],
      faqs: [
        { q: '¿Se puede usar ESX o QBCore desde el principio?', a: 'El framework base se instala igual que en cualquier máquina de FiveM; no te atamos a uno ni a otro.' },
        { q: '¿Puedo conectar una base de datos MySQL externa para la economía?', a: 'Sí, una ciudad de rol suele llevar su propia instancia de MySQL/MariaDB para la persistencia, y se conecta con normalidad.' },
      ],
    },
    beammp: {
      tagline: 'Sesiones multijugador de BeamNG.drive.',
      description: 'BeamMP lleva el multijugador persistente a la simulación de vehículos de cuerpo blando de BeamNG.drive. Ligero en el lado del servidor, porque las físicas se calculan en el cliente.',
      popularFor: ['servidores de comunidad para conducir y estrellarse'],
      setups: ['4-16 jugadores'],
      faqs: [],
    },
    satisfactory: {
      tagline: 'Construcción de fábricas a una escala que acaba pidiendo un servidor de verdad.',
      description:
        'El modo de servidor dedicado saca la simulación por completo del PC de un jugador, que es lo que cuenta cuando una fábrica se extiende por el mapa, justo el punto en el que un anfitrión local empieza a dar tirones. Aquí el margen de CPU importa tanto como la RAM.',
      popularFor: ['megafábricas cooperativas persistentes'],
      setups: ['1-4 jugadores, principio de partida', 'Fábricas grandes de partida avanzada'],
      faqs: [
        { q: '¿El mundo sigue funcionando cuando todos se desconectan?', a: 'Sí, ese es el sentido del modo de servidor dedicado: la fábrica sigue simulándose y ningún PC concreto tiene que cargar con la sesión.' },
      ],
    },
    'space-engineers': {
      tagline: 'Construcción de naves y estaciones en el espacio, movida por físicas.',
      description: 'Un simulador de construcción espacial con voxels en el que el coste real del servidor es la simulación física de naves grandes, no solo el número de jugadores. La CPU importa más que en casi cualquier otro sandbox.',
      popularFor: ['servidores de construcción en supervivencia y en creativo'],
      setups: ['4-8 jugadores', 'mundos multijugador grandes'],
      faqs: [],
    },
    dayz: {
      tagline: 'Supervivencia y PvP hardcore en mundo abierto en el mapa de Chernarus (y en mods).',
      description: 'Un shooter de supervivencia en mundo abierto que no perdona, con una escena de mods enorme (CF, Namalsk y decenas de mods que rehacen el juego) en la que cada uno añade memoria de verdad sobre el juego base.',
      popularFor: ['servidores de comunidad con mods', 'servidores hardcore casi vanilla'],
      setups: ['Vanilla, 40-60 jugadores', 'Con muchos mods (CF, mapas personalizados)'],
      faqs: [{ q: '¿Puedo usar mapas personalizados como Namalsk o Deer Isle?', a: 'Sí, los mods de mapas personalizados funcionan igual que en un servidor de DayZ propio. Solo calcula la RAM para tu lista de mods, no para la base de vanilla.' }],
    },
    atlas: {
      tagline: 'Supervivencia MMO pirata a escala descomunal.',
      description: 'Un MMO de supervivencia pirata inmenso, construido sobre el motor de ARK y repartido por una enorme cuadrícula oceánica. Uno de los títulos más exigentes de aquí cuando se usa la cuadrícula completa.',
      popularFor: ['servidores piratas gestionados por compañías'],
      setups: ['Una celda de la cuadrícula', 'Cuadrícula completa de varias celdas'],
      faqs: [],
    },
  },
  gameCategories: {
    'Survival & Sandbox': 'Supervivencia y sandbox',
    'Shooters & Tactical': 'Shooters y tácticos',
    'Roleplay & Platforms': 'Rol y plataformas',
    'Building & Simulation': 'Construcción y simulación',
    'Zombie & PvP': 'Zombis y PvP',
  },
  ramLabels: {
    '16GB+ per map': '16GB+ por mapa',
    '8GB+ per map': '8GB+ por mapa',
    '16GB+ total': '16GB+ en total',
    '4-8GB, CPU speed matters more': '4-8GB, la velocidad de la CPU importa más',
  },
  legal: {
    privacy: {
      label: 'Política de privacidad',
      title: 'Política de privacidad',
      metaDescription: 'Cómo WSLATL LLC recopila, usa y protege tu información personal.',
      intro:
        'Recopilamos solo lo que necesitamos para prestarte tus servicios. No vendemos tus datos, nunca. Esto es exactamente lo que hacemos con la información que compartes con nosotros.',
    },
    terms: {
      label: 'Condiciones del servicio',
      title: 'Condiciones del servicio',
      metaDescription: 'Los términos y condiciones que rigen tu uso de los servicios de hosting de WSLATL LLC.',
      intro:
        'Estas condiciones rigen tu uso de todos los servicios prestados por WSLATL LLC. Léelas con atención antes de usar nuestros servicios. Al usar cualquier servicio de WSLATL, aceptas estas condiciones.',
    },
    acceptableUse: {
      label: 'Uso aceptable',
      title: 'Política de uso aceptable',
      metaDescription: 'Qué está y qué no está permitido en la infraestructura de hosting de WSLATL LLC.',
      intro:
        'Nuestra infraestructura se comparte entre clientes. Uno que actúe mal afecta a todos. Esta política define qué es y qué no es aceptable en los servidores de WSLATL. Léela. Cúmplela. La hacemos cumplir.',
    },
    refund: {
      label: 'Política de reembolsos',
      title: 'Política de reembolsos',
      metaDescription:
        'Cómo gestiona WSLATL LLC las solicitudes de reembolso, incluidos los plazos de 48 horas y de 14 días, los motivos admitidos y lo que no es reembolsable.',
      intro:
        'Mantenemos sencilla nuestra política de reembolsos. Un plazo de 48 horas por cualquier motivo. Un plazo de 14 días para problemas reales. Sigue leyendo para ver exactamente qué entra y qué no.',
    },
    sla: {
      label: 'Acuerdo de Nivel de Servicio',
      title: 'Acuerdo de Nivel de Servicio',
      metaDescription:
        'Objetivos de disponibilidad de WSLATL LLC por tipo de servicio, aviso de mantenimiento programado y cómo reclamar un crédito de servicio.',
      intro:
        'Nuestros objetivos de disponibilidad por tipo de servicio, cómo gestionamos el mantenimiento y el crédito de servicio que puedes reclamar cuando no cumplimos un objetivo. Esto repite la Sección 5 de nuestras Condiciones del servicio.',
    },
    dmca: {
      label: 'Política DMCA',
      title: 'Política DMCA',
      metaDescription:
        'Cómo presentar ante WSLATL LLC una notificación de retirada por derechos de autor o una contranotificación, y nuestra política sobre infractores reincidentes conforme a 17 U.S.C. 512.',
      intro:
        'Cómo denunciar una infracción de derechos de autor en la infraestructura de WSLATL, cómo un cliente impugna una retirada y qué pasa con las cuentas que infringen de forma reiterada.',
    },
    abuse: {
      label: 'Política de abuso',
      title: 'Política de abuso',
      metaDescription:
        'Cómo denunciar un abuso de la infraestructura de WSLATL LLC (spam, ataques de red, phishing, malware, contenido ilegal) y cómo tratamos las denuncias.',
      intro:
        'Cómo denunciar un abuso de la infraestructura de WSLATL, qué hacemos con una denuncia una vez la tenemos y cómo actuamos con los servicios que son el origen del abuso.',
    },
    accountCredit: {
      label: 'Crédito de cuenta',
      title: 'Condiciones del crédito de cuenta',
      metaDescription:
        'Cómo funciona el crédito de cuenta en WSLATL LLC: comprarlo, aplicarlo a facturas, regalarlo a otra cuenta y para qué se puede y no se puede usar.',
      intro:
        'El crédito de cuenta es saldo prepagado que gastas en servicios de WSLATL. No caduca y no se puede canjear por dinero. Esto es exactamente cómo funciona.',
    },
    subprocessors: {
      label: 'Subencargados',
      title: 'Subencargados',
      metaDescription:
        'Los terceros que tratan datos personales por cuenta de WSLATL LLC, qué recibe cada uno y cómo se gestionan las transferencias internacionales.',
      intro:
        'Todos los terceros que tocan datos personales por nuestra cuenta, qué reciben y por qué. Con nombre y apellidos, no solo por categorías.',
    },
    backups: {
      label: 'Copias de seguridad',
      title: 'Política de copias de seguridad',
      metaDescription:
        'De qué hace copia de seguridad WSLATL LLC, por qué las copias se hacen en la medida de lo posible, por qué deberías guardar tus propias copias y cómo pedir una restauración.',
      intro:
        'De qué hacemos copia de seguridad, qué es y qué no es una copia de seguridad, y por qué aun así deberías guardar las tuyas. Además, cómo pedir una restauración.',
    },
  },
}

import type { Copy } from '@/i18n/copy/en'

/** Portuguese copy for the site's own components. */
export const pt: Copy = {
  header: {
    skipToContent: 'Pular para o conteúdo principal',
    home: 'Página inicial da WSLATL',
    discord: 'WSLATL no Discord (abre em uma nova aba)',
    getStarted: 'Começar',
    openMenu: 'Menu',
    closeMenu: 'Fechar menu',
    newTab: ' (abre em uma nova aba)',
    login: 'Entrar',
    clientPanels: 'Painéis do cliente',
    language: 'Idioma',
    chooseLanguage: 'Escolha um idioma',
    reviewNote: 'Contas novas são revisadas por uma pessoa, normalmente no mesmo dia.',
  },
  nav: {
    pricing: 'Preços',
    games: 'Servidores de jogos',
    services: 'Serviços',
    about: 'Sobre',
    contact: 'Contato',
    status: 'Status',
  },
  portals: {
    billing: { label: 'Portal de faturamento', description: 'Faturas, pedidos e tickets de suporte' },
    gamingPanel: { label: 'Painel de jogos', description: 'Gerencie seus servidores de jogos' },
    vpsPanel: { label: 'Painel VPS', description: 'Gerencie seu VPS' },
    dedicated: { label: 'Portal dedicado', description: 'Gerencie servidores dedicados' },
    cPanel: { label: 'cPanel', description: 'Hospedagem de sites e e-mail' },
    register: { label: 'Solicitar acesso', description: 'Novo por aqui? Solicite uma conta' },
  },
  footer: {
    blurb: (location: string) => `Hospedagem privada tocada por uma equipe pequena em ${location}. Hosting that actually gives a damn.`,
    columns: {
      hosting: 'Hospedagem',
      company: 'Empresa',
      clientArea: 'Área do cliente',
      legal: 'Jurídico',
    },
    links: {
      vpsPlans: 'Planos de VPS',
      gamePlans: 'Planos de servidor de jogos',
      supportedGames: 'Jogos suportados',
      dedicated: 'Servidores dedicados',
      web: 'Hospedagem de sites',
      about: 'Sobre nós',
      howItWorks: 'Como funciona o pedido',
      contact: 'Contato',
      reviews: 'Avaliações no Trustpilot',
      discord: 'Discord',
      status: 'Página de status',
    },
    rights: (year: number, company: string) => `© ${year} ${company}. Todos os direitos reservados.`,
  },
  email: {
    reveal: 'Mostrar endereço de e-mail',
  },
  home: {
    metaTitle: 'Hospedagem barata de VPS e servidores de jogos | WSLATL LLC',
    metaDescription:
      'Hospedagem VPS acessível, hospedagem de servidores de jogos (Minecraft, Rust, ARK, FiveM e mais) e servidores dedicados com proteção DDoS e armazenamento NVMe. Ficamos no Missouri, e a gente atende de verdade.',
    hero: {
      // Kept in English everywhere: this is the brand line.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'Já trabalhamos dentro de empresas de hospedagem. Sabemos o que dá errado. A WSLATL existe para consertar isso: hospedagem VPS acessível, hospedagem de Minecraft e de servidores de jogos, e servidores dedicados, com uma equipe que realmente atende.',
      seePlans: 'Ver planos e preços',
      products: 'Produtos',
      entries: {
        vps: 'Hospedagem VPS',
        game: 'Servidores de jogos',
        other: 'Dedicados e hospedagem de sites',
      },
      from: (price: string) => `a partir de ${price}/mês`,
      quoted: 'Orçamento para a sua configuração',
    },
    clients: {
      heading: 'Com a confiança dos nossos clientes',
      pause: 'Pausar a rolagem dos logos de clientes',
    },
    services: {
      heading: 'O que hospedamos',
      intro:
        'VPS e servidores de jogos têm preços publicados. Servidores dedicados e hospedagem de sites são orçados conforme o que você precisa rodar.',
      from: 'a partir de',
      perMonth: '/mês',
      quoted: 'Orçamento para a sua configuração',
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
        `${n.plans} planos de ${n.cpuMin} a ${n.cpuMax} ${n.cpuUnit}, de ${n.ramMin} a ${n.ramMax} GB de RAM e de ${n.storageMin} a ${n.storageMax} GB de armazenamento.`,
      compareVps: 'Comparar planos de VPS',
      compareGame: 'Comparar planos de servidor de jogos',
      findGame: 'Encontre seu jogo',
      getQuote: 'Pedir um orçamento',
    },
    howItWorks: {
      heading: 'Como funciona o pedido',
      intro:
        'Só aceitamos clientes por inscrição, e isso é de propósito. É assim que uma equipe pequena consegue cuidar bem de cada cliente.',
      step: (n: number) => `Passo ${n}: `,
      steps: [
        {
          title: 'Solicite acesso',
          description:
            'Preencha uma inscrição curta no portal de faturamento. Uma pessoa lê todas elas, e a maioria é aprovada no mesmo dia.',
        },
        {
          title: 'Conte o que você precisa',
          description:
            'Depois de aprovado, fale com a gente no Discord ou abra um ticket. Conversamos sobre a sua configuração com você. Nada de fluxo automatizado.',
        },
        {
          title: 'Seu servidor entra no ar',
          description:
            'Configuramos tudo, mostramos o seu painel e continuamos por perto depois. A maioria dos clientes fica no ar no mesmo dia.',
        },
      ],
      readyPrefix: 'Pronto?',
      requestAccess: 'Solicite acesso',
      or: 'ou',
      askOnDiscord: 'fale com a gente no Discord',
      readySuffix: 'antes.',
    },
    whyUs: {
      heading: 'A diferença é pessoal.',
      intro: 'Já vimos como as grandes hospedagens funcionam. Criamos a WSLATL para ser o oposto exato.',
      slaNotePrefix: 'As metas de uptime de cada serviço, e os créditos que você recebe se não cumprirmos alguma, estão no nosso',
      slaLink: 'Acordo de Nível de Serviço',
      joinDiscord: 'Entre no nosso Discord',
      openTicket: 'Abrir um ticket',
    },
    about: {
      heading: 'Criamos a WSLATL porque cansamos de ver empresas de hospedagem ignorarem seus clientes.',
      paragraphs: [
        'Já trabalhamos dentro de empresas de hospedagem. Vimos os tickets se acumularem, os clientes serem jogados de um lado para o outro, ninguém conhecer de verdade a sua configuração. É frustrante e dá para evitar completamente.',
        'Então começamos a WSLATL. Ficamos no Missouri, somos uma empresa privada e pequena o bastante para que cada cliente receba mesmo a nossa atenção. Não queremos ser a maior empresa de hospedagem. Queremos ser aquela que você recomendaria a um amigo.',
      ],
      closing: 'Todo cliente aqui é tratado como família. É a única forma que conhecemos de fazer isso.',
      quote:
        'O setor de hospedagem é duro e você precisa se destacar. A gente só quer tratar nossos clientes como família e garantir que eles tenham a melhor experiência possível.',
      quoteAttribution: 'A equipe da WSLATL',
      teamHeading: 'As pessoas por trás da WSLATL',
    },
    faq: {
      heading: 'Perguntas frequentes',
      stillNotSure: 'Ainda na dúvida?',
      askOnDiscord: 'Fale com a gente no Discord',
      alwaysAround: '. Estamos sempre por aqui.',
    },
    contact: {
      heading: 'Uma empresa de hospedagem que trata você como gente. Imagina só.',
      body:
        'Solicite acesso e um admin analisa a sua inscrição. Depois de aprovado, configuramos tudo rápido. A maioria dos clientes fica no ar no mesmo dia.',
      requestAccess: 'Solicitar acesso',
      preferToTalk: 'Prefere conversar antes?',
      options: {
        discord: {
          title: 'Discord',
          description:
            'Entre no nosso servidor e abra um ticket, ou mande uma DM direto para a gente. É o jeito mais rápido de receber uma resposta.',
          cta: 'Entre no nosso Discord',
        },
        billing: {
          title: 'Ticket no portal de faturamento',
          description:
            'Já é cliente? Abra um ticket no portal de faturamento. Melhor para dúvidas de conta e faturamento.',
          cta: 'Abrir um ticket',
        },
        email: {
          title: 'E-mail',
          description: 'Prefere e-mail? Uma pessoa lê cada mensagem.',
        },
      },
    },
  },
  pricing: {
    metaTitle: 'Preços de hospedagem barata de VPS e servidores de jogos',
    metaDescription: (vps: string, game: string) =>
      `Preços mensais publicados para hospedagem VPS a partir de ${vps} e hospedagem de servidores de jogos a partir de ${game}, em SATA SSD ou NVMe. Sem preço de isca, e com pelo menos 30 dias de aviso antes de qualquer aumento.`,
    heading: 'Preços',
    intro:
      'Todo plano é cobrado por mês em dólares americanos. Sem armadilha no preço de renovação: estes são os preços mensais normais, e qualquer aumento vem com pelo menos 30 dias de aviso por escrito.',
    orderingPrefix: 'O pedido começa com uma inscrição curta, e a maioria é aprovada no mesmo dia.',
    orderingLink: 'Como funciona o pedido',
    lines: {
      vps: 'Hospedagem VPS',
      game: 'Hospedagem de servidores de jogos',
    },
    from: 'a partir de',
    perMonth: '/mês',
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string }) =>
      `${n.plans} planos. De ${n.ramMin} a ${n.ramMax} GB de RAM, de ${n.cpuMin} a ${n.cpuMax} ${n.cpuUnit}, SATA SSD ou NVMe.`,
    seePlans: (line: string) => `Ver planos: ${line}`,
    planTypes: 'Tipos de plano',
    included: 'Incluído em todo plano',
    uptimeIncluded: (target: string) => `Meta de uptime mensal de ${target} (veja o nosso SLA)`,
    storageSuffix: 'para armazenamento',
    table: {
      plan: 'Plano',
      ram: 'RAM',
      storage: 'Armazenamento',
      traffic: 'Tráfego',
      price: 'Preço',
      order: 'Pedir',
      orderPlan: (plan: string) => ` ${plan} (abre em uma nova aba)`,
      caption: (group: string) => `Planos ${group}, preços mensais em dólares americanos`,
    },
    custom: {
      heading: 'Servidores dedicados e hospedagem de sites',
      body:
        'Estes são orçados por projeto em vez de vendidos numa tabela de preços, porque o hardware ou a configuração certa depende do que você vai rodar. Conte o que você precisa e voltamos com um preço.',
      cta: 'Pedir um orçamento',
    },
  },
  games: {
    metaTitle: (more: number) => `Hospedagem de servidores de jogos: Minecraft, Rust, ARK, FiveM e +${more}`,
    metaDescription: (price: string) =>
      `Hospedagem de servidores de jogos com proteção DDoS a partir de ${price}/mês, em hardware NVMe e SATA SSD. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld e dezenas de outros, todos no mesmo painel Pterodactyl.`,
    heading: 'Hospedagem de servidores de jogos',
    crumb: 'Jogos',
    introPrefix:
      'Todo jogo roda nos mesmos planos com Pterodactyl: você escolhe a RAM, não um pacote preso a um jogo. Encontre o seu jogo para uma orientação realista de RAM e depois compare os',
    introLink: 'planos de servidor de jogos',
    introSuffix: '. Não achou o seu? Se ele tem servidor dedicado, quase sempre conseguimos rodar.',
    searchLabel: 'Buscar jogos',
    searchPlaceholder: (count: number) => `Buscar entre ${count} jogos`,
    categories: 'Categorias de jogos',
    // Filled in by the browser (components/games/game-directory.tsx), so
    // these are templates rather than functions: a Client Component can only
    // be handed plain values.
    matchCount: '{shown} de {total} jogos correspondem',
    showing: '{shown} de {total} jogos',
    noMatch: 'Nenhum jogo corresponde a "{query}".',
    noMatchHelp: 'Se ele tem servidor dedicado, quase sempre conseguimos rodar nos mesmos planos.',
    askOnDiscord: 'Fale com a gente no Discord',
    featured: 'Jogos em destaque',
    fromPrice: 'a partir de {price}/mês',
    toStart: '{ram} para começar',
    detail: {
      metaTitle: (game: string) => `Hospedagem de servidor de ${game}`,
      heading: (game: string) => `Hospedagem de servidor de ${game}`,
      order: (game: string) => `Peça o seu servidor de ${game}`,
      comparePlans: 'Comparar planos',
      listedUnderPrefix: 'Listado em',
      listedUnderSuffix: '. Os planos não ficam presos a um jogo, então você pode trocar de título quando quiser.',
      ramHeading: (game: string) => `De quanta RAM o ${game} precisa?`,
      ramCaption: (game: string) => `RAM recomendada para ${game} e os menores planos que atendem`,
      setup: 'Configuração',
      recommendedRam: 'RAM recomendada',
      smallestPlans: 'Menores planos que atendem',
      fits: 'Atende:',
      perMap: 'Por mapa: ',
      or: ' ou ',
      tooBig: 'Maior que os nossos planos de jogos: fale com a gente',
      ramNote: 'Estes são pontos de partida, não limites rígidos. Todo plano pode ser alterado depois, conforme o seu servidor cresce.',
      popular: (game: string) => `Configurações populares de ${game}`,
      included: 'Incluído em todo plano de jogos',
      questions: (game: string) => `Dúvidas sobre hospedagem de ${game}`,
      moreIn: (category: string) => `Mais jogos de ${category}`,
      allGames: 'Todos os jogos',
    },
  },
  legal: {
    metaTitle: 'Jurídico',
    metaDescription:
      'Todas as políticas da WSLATL LLC em um só lugar: privacidade, termos de serviço, uso aceitável, reembolsos, SLA, DMCA, abuso, crédito na conta, subprocessadores e backups.',
    heading: 'Jurídico',
    intro:
      'As nossas políticas, escritas para serem lidas. Cada uma mostra a data em que entrou em vigor, e cada uma pode mudar por conta própria, então confira a data do documento em que você está se baseando.',
    effective: 'Em vigor desde',
    jurisdiction: 'Jurisdição',
    questions: 'Dúvidas',
    onThisPage: 'Nesta página',
    documents: 'Documentos jurídicos',
    questionsHeading: 'Dúvidas sobre este documento?',
    questionsBody: 'Somos uma equipe pequena. Você consegue falar com a gente de verdade.',
    askOnDiscord: 'Pergunte no Discord',
    translationNotice:
      'Esta tradução existe para que você possa ler no seu próprio idioma. A versão em inglês deste documento é a que vale.',
    readInEnglish: 'Ler a versão em inglês',
    notTranslated: "Este documento ainda não foi traduzido, por isso aparece em inglês. De qualquer forma, a versão em inglês é a que vale.",
    emailsJoin: "ou",
    emailLabel: "E-mail",
    uptimeTable: {
      service: "Serviço",
      target: "Meta de uptime mensal",
      label: "Metas de uptime mensal",
    },
  },
  notFound: {
    metaTitle: 'Página não encontrada',
    heading: 'Esta página não existe.',
    body: 'O link pode ser antigo, ou o endereço pode ter um erro de digitação. É para cá que a maioria das pessoas vai:',
    destinations: {
      pricing: 'Planos e preços',
      games: 'Hospedagem de servidores de jogos',
      services: 'O que hospedamos',
      legal: 'Documentos jurídicos',
    },
    home: 'Voltar para a página inicial',
    askOnDiscord: 'Fale com a gente no Discord',
  },
  breadcrumbs: {
    home: 'Início',
  },
}

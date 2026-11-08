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
    mainNav: 'Principal',
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
    partners: 'Parceiros',
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
    blurb: (location: string) => `Hospedagem privada tocada por uma equipe pequena em ${location}.`,
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
      guides: 'Guias de configuração',
      dedicated: 'Servidores dedicados',
      web: 'Hospedagem de sites',
      about: 'Sobre nós',
      partners: 'Parceiros',
      brandKit: 'Kit de marca',
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
    metaTitle: 'WSLATL: hospedagem de jogos, VPS e dedicados no Missouri',
    metaDescription: (game: string, vps: string) =>
      `A WSLATL é uma hospedagem pequena do Missouri que aceita clientes por inscrição. Servidores de jogos a partir de ${game}, VPS a partir de ${vps} e dedicados.`,
    hero: {
      // Kept in English everywhere: this is the brand line.
      lineOne: 'Hosting that',
      emphasis: 'actually',
      lineTwo: 'gives a damn.',
      intro:
        'Já trabalhamos dentro de empresas de hospedagem. Sabemos o que dá errado. A WSLATL existe para consertar isso: hospedagem VPS com todos os preços publicados, hospedagem de Minecraft e de servidores de jogos, e servidores dedicados, com uma equipe que realmente atende.',
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
          title: 'Escolha um plano ou conte o que você precisa',
          description:
            'Depois de aprovado, peça um servidor de jogos ou um VPS no portal de faturamento e pague online. Para um servidor dedicado ou hospedagem de sites, fale com a gente no Discord ou abra um ticket que configuramos tudo com você.',
        },
        {
          title: 'Seu servidor entra no ar',
          description:
            'Servidores de jogos e VPS costumam entrar no ar no mesmo dia. Servidores dedicados levam mais tempo, normalmente alguns dias úteis. Mostramos o seu painel e continuamos por perto depois.',
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
      alwaysAround: '. Costumamos responder em menos de uma hora no horário ativo.',
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
    metaTitle: 'Preços de VPS e servidores de jogos, todos os planos',
    metaDescription: (vps: string, game: string) =>
      `VPS a partir de ${vps} e servidores de jogos a partir de ${game} por mês, cada especificação publicada. Sem preço isca, e 30 dias de aviso antes de qualquer aumento.`,
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
    lineSummary: (n: { plans: number; ramMin: number; ramMax: number; cpuMin: number; cpuMax: number; cpuUnit: string; storage: string[] }) =>
      `${n.plans} planos. De ${n.ramMin} a ${n.ramMax} GB de RAM, de ${n.cpuMin} a ${n.cpuMax} ${n.cpuUnit}, ${n.storage.join(' ou ')}.`,
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
      popular: 'Popular',
      notAvailable: 'n/d',
      price: 'Preço',
      order: 'Pedir',
      orderPlan: (plan: string) => ` ${plan} (abre em uma nova aba)`,
      caption: (group: string) => `Planos ${group}, preços mensais em dólares americanos`,
    },
    custom: {
      heading: 'Servidores dedicados e hospedagem de sites',
      body:
        'Estes são orçados por projeto em vez de vendidos numa tabela de preços, porque o hardware ou a configuração certa depende do que você vai rodar. Conte o que você precisa e voltamos com um preço. Já é cliente? No portal de faturamento, abra “Browse plans”, escolha um servidor na aba “Dedicated servers” e clique em “Request this server”. Servidores dedicados levam mais tempo para ficar prontos do que servidores de jogos e VPS, normalmente alguns dias úteis.',
      cta: 'Pedir um orçamento',
    },
  },
  games: {
    metaTitle: (more: number) => `Servidores de jogos: Minecraft, Rust, ARK e mais ${more}+`,
    metaDescription: (price: string) =>
      `Servidores de jogos a partir de ${price}/mês, cobrados por RAM e não por jogo. Minecraft, Rust, ARK, CS2, FiveM, Valheim, Palworld e mais em um painel Pterodactyl.`,
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
      metaTitle: (game: string, price: string) => `Hospedagem ${game} a partir de ${price}/mês`,
      metaDescription: (game: string, price: string, tagline: string) =>
        `Alugue seu próprio servidor de ${game} na WSLATL a partir de ${price} por mês. ${tagline}`,
      metaDescriptionNoPrice: (game: string, tagline: string) =>
        `Alugue seu próprio servidor de ${game} na WSLATL. Peça um plano sob medida. ${tagline}`,
      heading: (game: string) => `Hospedagem de servidor de ${game}`,
      order: (game: string) => `Peça o seu servidor de ${game}`,
      comparePlans: 'Comparar planos',
      listedUnderPrefix: 'Listado em',
      listedUnderSuffix: '. Os planos não ficam presos a um jogo, então você pode trocar de título quando quiser.',
      guidesIntro: 'Vai configurar o seu servidor você mesmo?',
      guidesLink: (game: string) => `Leia os guias de servidor de ${game}`,
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
      moreIn: (category: string) => `Mais jogos de ${category.charAt(0).toLowerCase()}${category.slice(1)}`,
      allGames: 'Todos os jogos',
      plansHeading: 'Planos de servidores de jogos',
      plansIntro:
        'Os mesmos planos rodam todos os jogos que hospedamos. O Premium roda em um AMD Ryzen 9 3900X com armazenamento NVMe, e o Budget em um Intel Core i7-6700K mais antigo com SATA SSD.',
      atAGlance: (game: string) => `Hospedagem de ${game} em resumo`,
      hosting: (game: string) => `Hospedagem de ${game}`,
      budgetNote: 'Os planos Budget rodam em uma CPU mais antiga e mais ocupada, então podem ficar mais lentos nos horários de pico.',
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
  partners: {
    metaTitle: 'Parceiros oficiais',
    metaDescription: (percent: string) =>
      `Criadores e comunidades com quem trabalhamos. Com o código de um parceiro, ${percent} de desconto na sua primeira fatura de hospedagem, exceto servidores dedicados.`,
    metaDescriptionNoCodes:
      'Criadores e comunidades com quem trabalhamos, aprovados pela nossa equipe. Veja quem são e onde encontrá-los na internet.',
    emptyMetaDescription:
      'Estamos escolhendo nossos primeiros parceiros oficiais. Faz vídeos, lives ou cuida de uma comunidade? Veja como funciona nosso programa de parceiros e como participar.',
    heading: 'Parceiros oficiais',
    crumb: 'Parceiros',
    intro: (percent: string) =>
      `Criadores e comunidades aprovados pela nossa equipe. Cadastre-se com um dos códigos de indicação deles e ganhe ${percent} de desconto na primeira fatura da sua hospedagem, exceto em servidores dedicados.`,
    introNoCodes: 'Criadores e comunidades aprovados pela nossa equipe.',
    emptyIntro:
      'Estamos escolhendo nossos primeiros parceiros oficiais. Faz vídeos, lives ou cuida de uma comunidade? Esta página pode começar com você.',
    featured: 'Destaque',
    officialPartner: 'Parceiro oficial',
    since: (month: string) => `Parceiro desde ${month}`,
    referralCode: 'Código de indicação',
    copy: 'Copiar',
    copied: 'Copiado',
    copyFailed: 'O código está selecionado. Copie pelo teclado ou pelo menu.',
    viewProfile: 'Ver perfil',
    onPlatform: (name: string, platform: string) => `${platform} de ${name}`,
    website: 'Site',
    ghost: {
      title: 'Pode ser você',
      body: 'Faz vídeos, lives ou cuida de uma comunidade? Torne-se parceiro oficial e tenha seu perfil aqui.',
      cta: 'Seja parceiro',
    },
    program: {
      heading: 'Seja parceiro',
      intro: 'Nossos parceiros são criadores e comunidades que nossa equipe aprova um a um. Veja como funciona.',
      approved: {
        title: 'Aprovado pela nossa equipe',
        body: 'Conte quem você é e onde fica a sua comunidade. Nossa equipe analisa cada pedido.',
      },
      code: {
        title: 'Seu próprio código de indicação',
        body:
          'As pessoas digitam seu código ao se cadastrar no portal de faturamento, ou usam seu link, que já preenche o código para elas. Esqueceram de digitar? Dá para adicionar o código na página “Referrals” do portal de faturamento antes do primeiro pagamento. Depois de aprovado, você pode pedir em um ticket um código personalizado: só letras e números, até 32 caracteres, e que ainda não esteja em uso.',
      },
      discount: {
        title: (percent: string) => `${percent} de desconto na primeira fatura de quem você indicar`,
        body: (percent: string) =>
          `Quem se cadastrar com seu código ganha ${percent} de desconto na primeira fatura da hospedagem, exceto em servidores dedicados. O desconto vale uma única vez, só para essa primeira fatura. Não se soma a um código promocional: vale o maior desconto.`,
      },
      credit: {
        title: 'Crédito na conta para você',
        body: 'Quando uma pessoa indicada paga a primeira fatura, você recebe uma única vez uma parte desse pagamento, como crédito na sua conta. Servidores dedicados não contam e, se esse pagamento for reembolsado, o crédito é retirado.',
      },
      profile: {
        title: 'Um perfil nesta página',
        body: 'Com a sua autorização, mostramos você aqui com seu banner, sua foto e seus links, e com seu código se você quiser.',
      },
      discordCta: 'Fale com a gente no Discord',
      ticketCta: 'Abrir um ticket',
      ticketNote:
        'Já é cliente? Abra um ticket no portal de faturamento e conte sobre o seu canal ou a sua comunidade.',
      creditLink: 'Como funciona o crédito na conta',
    },
    profile: {
      metaTitle: (name: string) => `${name}, parceiro oficial`,
      metaDescription: (code: string, percent: string) =>
        `Cadastre-se com o código ${code} e ganhe ${percent} de desconto na primeira fatura da sua hospedagem, exceto em servidores dedicados.`,
      metaDescriptionNoCode: (name: string) => `${name} é parceiro oficial da WSLATL LLC.`,
      about: (name: string) => `Sobre ${name}`,
      links: (name: string) => `Encontre ${name} na internet`,
      games: 'Jogos que joga',
      referral: (name: string) => `Código de indicação de ${name}`,
      signUp: 'Cadastre-se com este código',
      discount: (percent: string) =>
        `Ao se cadastrar com este código, você ganha ${percent} de desconto na primeira fatura da sua hospedagem, exceto em servidores dedicados. O desconto vale uma única vez, só para essa primeira fatura. Não se soma a um código promocional: vale o maior desconto.`,
      avatarAlt: (name: string) => `Foto de perfil de ${name}`,
      bannerAlt: (name: string) => `Banner de ${name}`,
      allPartners: 'Todos os parceiros',
    },
  },
  brand: {
    metaTitle: 'Kit de marca: logo, cores, fontes e voz',
    metaDescription:
      'Baixe o logo da WSLATL em PNG, copie as cores da marca e veja nossas fontes, nossa voz e as regras de uso. O kit completo está no Google Drive.',
    heading: 'Kit de marca',
    crumb: 'Kit de marca',
    intro:
      'Tudo o que você precisa para colocar a WSLATL diante das pessoas: o logo, as cores, a tipografia e a voz. Leia uma vez e o que você criar vai ter a cara certa.',
    audience:
      'É para qualquer pessoa que mostre material gráfico ou textos da WSLATL a alguém: nossa própria equipe, um parceiro, um designer ou uma agência.',
    getFullKit: 'Pegar o kit completo',
    getLogo: 'Baixar o logo',
    shortVersion: {
      heading: 'A versão curta',
      items: [
        'Use o logo como ele é entregue.',
        'Use estas cores e nenhuma outra.',
        'Geist para tudo, Instrument Serif para os destaques e Geist Mono para código.',
        'Escreva como uma pessoa que cuida de servidores, não como um departamento de marketing.',
      ],
    },
    onThisPage: 'Nesta página',
    nav: {
      logo: 'Logo',
      colors: 'Cores',
      type: 'Tipografia',
      voice: 'Voz',
      rules: 'Pode e não pode',
      fullKit: 'Kit completo',
    },
    logo: {
      heading: 'O logo',
      intro: 'Use o material exatamente como ele é entregue. Mudar o tamanho pode. O resto, não.',
      partsHeading: 'O símbolo e o logo completo',
      parts:
        'O símbolo são três painéis inclinados, do ciano ao violeta. O logo completo é o símbolo com o nome "WSLATL" e a linha "{0}". Use o símbolo quando o espaço for pouco e o logo completo quando houver espaço.',
      specimens: {
        markWhite: 'O símbolo sobre branco',
        markInk: 'O símbolo sobre Ink',
        lockupWhite: 'O logo completo sobre branco',
        lockupInk: 'O logo completo sobre Ink',
      },
      surfaces:
        'Branco, cinza claro e Ink (#0F090B) funcionam. Fotos carregadas, não. Se você não consegue ler o nome de relance, o fundo está carregado demais: coloque o logo sobre um painel liso.',
      violetLead: 'Cuidado com o painel violeta.',
      violet:
        'O painel da direita do símbolo é violeta, #5000F8, e some em um degradê violeta ou azul-violeta. Um degradê serve como barra de destaque, borda ou linha sob o logo, mas o logo em si fica sobre uma superfície lisa.',
      clearSpace: {
        heading: 'Área de respiro',
        body: 'X é a altura das maiúsculas do nome "WSLATL", cerca de 18% da altura do símbolo. Deixe pelo menos X de espaço vazio nos quatro lados. Nada entra na zona azul: nem texto, nem ícone, nem borda, nem a margem da página.',
        lockup:
          'O logo completo usa o mesmo X nos quatro lados, e o X acompanha o tamanho do logo. Mantenha o símbolo, o nome e a linha juntos.',
        markCaption: 'Ao redor do símbolo',
        lockupCaption: 'Ao redor do logo completo',
      },
      minimum: {
        heading: 'Tamanhos mínimos',
        body: 'Abaixo do mínimo, o logo deixa de ser legível. Com menos de 190 px de largura, a linha "{0}" fica ilegível: use só o símbolo.',
        artwork: 'Versão',
        columnScreen: 'Tela',
        columnPrint: 'Impressão',
        mark: 'Símbolo',
        lockup: 'Logo completo',
        markScreen: '16 px',
        markPrint: '5 mm',
        lockupScreen: '190 px de largura',
        lockupPrint: '45 mm de largura',
        shipped: (sizes: string) =>
          `Entregamos o símbolo em ${sizes} px. Use o tamanho mais próximo acima do que você precisa.`,
      },
      downloads: {
        heading: 'Downloads',
        intro: 'PNG com fundo transparente, exatamente como o kit entrega.',
        download: 'Baixar',
        markHeading: 'O símbolo',
        markBody:
          'Use o tamanho mais próximo acima do que você precisa. Para o ícone de um servidor do Discord, use o de 512 ou o de 1024.',
        lockupHeading: 'O logo completo',
        uses: {
          social: 'Cabeçalho para redes sociais',
          preview: 'Prévias de links e posts',
          discord: 'Banner de servidor do Discord',
        },
        morePrefix: 'Precisa de outro tamanho ou dos arquivos SVG? Estão no',
        moreLink: 'kit completo',
        moreSuffix: '.',
      },
      which: {
        heading: 'Qual arquivo eu quero?',
        rows: [
          { space: 'Um espaço pequeno e quadrado', examples: 'Favicon, avatar, ícone de app', pick: 'O símbolo' },
          {
            space: 'Um espaço largo',
            examples: 'Cabeçalho, assinatura de e-mail, banner de redes sociais',
            pick: 'O logo completo',
          },
          {
            space: 'Algo grande ou impresso',
            examples: 'Impressão e brindes',
            pick: 'Os arquivos SVG do kit completo',
          },
        ],
      },
      alt: {
        markWhite:
          'O símbolo da WSLATL sobre branco: três painéis inclinados, do ciano à esquerda ao violeta à direita.',
        markInk: 'O símbolo da WSLATL sobre Ink: três painéis inclinados, do ciano à esquerda ao violeta à direita.',
        lockupWhite:
          'O logo completo da WSLATL sobre branco: o símbolo, o nome WSLATL e, embaixo, a linha Private Hosting.',
        lockupInk: 'O logo completo da WSLATL sobre Ink: o símbolo, o nome WSLATL e, embaixo, a linha Private Hosting.',
        clearSpaceMark:
          'Diagrama da área de respiro ao redor do símbolo: uma faixa de espaço vazio, com largura X, contorna os quatro lados, e nada pode entrar nela.',
        clearSpaceLockup:
          'Diagrama da área de respiro ao redor do logo completo: o mesmo X de espaço vazio nos quatro lados.',
        minimumSizes: 'O símbolo em 256, 192, 160, 128, 96, 64, 48 e 32 pixels, cada um menor que o anterior.',
      },
    },
    colors: {
      heading: 'Cores',
      intro:
        'Use estas e nenhuma outra. As cores do logo foram tiradas do material como ele é entregue, e as de interface são as que nossos sites já usam.',
      copy: 'Copiar',
      copied: 'Copiado',
      copyFailed: 'O código hexadecimal está selecionado. Copie pelo teclado ou pelo menu.',
      logoHeading: 'Cores do logo',
      logoIntro: 'As únicas cores do próprio logo.',
      gradientsHeading: 'Degradês',
      gradientsIntro:
        'Um recurso da marca, não decoração. Use em superfícies grandes ou em linhas finas, e nunca coloque texto corrido em cima.',
      from: 'De',
      to: 'Até',
      interfaceHeading: 'Cores de interface',
      interfaceIntro: 'Tiradas do wslatl.com, da base de conhecimento e do portal de faturamento.',
      rulesHeading: 'Regras de cor',
      rules: [
        'Nunca mude a cor do logo. Nem para preto, nem para branco, nem para uma cor da marca de que você goste mais. O degradê faz parte da arte.',
        'Um destaque por tela. Azul primário para ações, cores semânticas para status, degradês para superfícies grandes. Não os três ao mesmo tempo.',
        `Nunca dependa só da cor. Um status também precisa dizer "Online" ou "Degradado" em palavras, ou levar um ícone. Muita gente não distingue âmbar de vermelho.`,
        'O texto corrido é Ink ou Paper. Nunca um degradê, nunca um azul de painel intermediário.',
        'Os links são #0079CE sobre claro e #48C5FF sobre escuro, e sempre sublinhados no texto corrido. Em botões e menus, sem sublinhado.',
      ],
      uses: {
        violet: 'Painel da direita do símbolo, ponta distante do degradê do nome',
        cyan: 'Ponta próxima do degradê do nome',
        brandCyan: 'Painel da esquerda do símbolo',
        brandBlue: 'Painel central do símbolo',
        primary: 'Botões, links, estados ativos, anéis de foco',
        primarySite: 'A cor de tema do wslatl.com, interfaces maiores',
        lightAccent: 'Estados de hover, brilho, destaques de dados',
        paleAccent: 'Painéis de informação, preenchimentos suaves',
        secondaryBlue: 'Ações secundárias',
        ink: 'Fundo escuro principal',
        inkAlt: 'Fundo do portal de faturamento',
        surface: 'Cartões, painéis elevados',
        surfaceAlt: 'Bordas, divisórias, campos',
        paper: 'Texto principal sobre escuro',
        muted: 'Texto secundário, metadados',
        success: 'Online, ativo, saudável',
        successAlt: 'Confirmações',
        warning: 'Degradado, pendente, manutenção',
        danger: 'Erros, quedas, ações destrutivas',
        info: 'Selos informativos',
      },
      gradientUses: {
        wordmark: 'Painéis de abertura, cabeçalhos de seção, sublinhados de links, barras de progresso e de status',
        subline: 'Destaques secundários, fundos de etiquetas, bordas de painéis',
      },
    },
    type: {
      heading: 'Tipografia',
      intro: 'Três tipografias, cada uma com uma função.',
      sans: {
        role: 'Sem serifa',
        use: 'Tudo o que estrutura: títulos, texto corrido, interface, botões e tabelas.',
        size: 'O texto corrido vai de 16 a 18 px no peso 400, com entrelinha de 1,5 a 1,7. Os títulos usam o peso 600.',
      },
      serif: {
        role: 'Com serifa',
        use: 'Só para momentos de destaque: a linha "{0}", citações em destaque e ênfase em banners de abertura. Com moderação.',
        size: 'De 28 a 56 px no peso 400.',
      },
      mono: {
        role: 'Monoespaçada',
        use: 'Código, comandos, IPs, portas, valores do painel, nomes de arquivo e changelogs.',
        size: 'De 14 a 16 px no peso 400.',
        noSample: 'Sem amostra aqui: este site não carrega a Geist Mono.',
      },
      rules: [
        'Títulos em minúsculas, com maiúscula só no começo.',
        'Números grandes, rótulos pequenos.',
        'Maiúsculas só em rótulos curtos, de até três palavras.',
      ],
    },
    voice: {
      heading: 'Voz',
      intro:
        'Nossa voz é o produto. As pessoas ficam com uma hospedagem pequena porque alguém responde, então a escrita precisa soar como essa pessoa.',
      scope:
        'Estas são as regras que nossos textos em inglês seguem. Os exemplos são frases reais deles e ficam em inglês.',
      areHeading: 'Somos',
      are: ['diretos', 'específicos', 'calorosos', 'um pouco engraçados', 'sem pedir desculpas'],
      notHeading: 'Não somos',
      not: ['corporativos', 'exagerados', 'vagos', 'grosseiros'],
      rulesHeading: 'As regras',
      rules: [
        {
          title: 'Fale como uma pessoa.',
          body: 'Use contrações e frases curtas. Um palavrão leve de vez em quando combina com a marca (está literalmente no nosso slogan), mas nunca em contexto de faturamento ou jurídico.',
        },
        { title: 'Seja específico.', body: `"{0}" vence "{1}". "{2}" vence "{3}". Dê o número.` },
        {
          title: 'Assuma.',
          body: 'Criamos a WSLATL porque as grandes hospedagens eram ruins. Diga isso sem citar nomes.',
        },
        { title: 'Sem enrolação.', body: `Corte "{0}", "{1}", "{2}", "{3}" e "{4}".` },
        { title: 'Nunca grite em maiúsculas.', body: 'Uma palavra em maiúsculas para dar ênfase está ok.' },
        { title: 'Respeite o tempo de quem lê.', body: 'Responda à pergunta na primeira frase.' },
      ],
      examplesHeading: 'Exemplos reais',
      insteadOf: 'Em vez de',
      write: 'Escreva',
    },
    dos: {
      heading: 'Pode e não pode',
      intro: 'Estes são os erros que mais vemos.',
      doHeading: 'Pode',
      dontHeading: 'Não pode',
      doItems: [
        'Usar o material exatamente como ele é entregue.',
        'Manter o símbolo, o nome e a linha juntos, com o espaçamento que entregamos.',
        'Dar espaço a ele (veja área de respiro).',
      ],
      dontItems: [
        'Esticar, achatar ou girar.',
        'Mudar a cor, aplicar tom, sombra ou contorno.',
        'Colocar sobre foto, ruído ou um degradê carregado.',
        'Remontar a partir das peças.',
      ],
      rebuild:
        'Nunca remonte o logo completo com peças, não reespace o nome na mão nem escreva o nome em uma fonte que só se parece com ele. O nome é arte, não texto.',
      tiles: {
        original: 'Material original',
        dark: 'Sobre fundo escuro',
        lockup: 'Logo completo, intacto',
        stretch: 'Esticar ou achatar',
        recolor: 'Mudar a cor',
        shadow: 'Sombra ou contorno',
      },
      alt: {
        original: 'O símbolo sobre branco, exatamente como é entregue.',
        dark: 'O símbolo sobre um painel escuro Ink.',
        lockup: 'O logo completo sobre branco, intacto.',
        stretch: 'O símbolo achatado, mais largo que alto.',
        recolor: 'O símbolo repintado de vermelho liso.',
        shadow: 'O símbolo com uma sombra difusa ao redor.',
      },
    },
    fullKit: {
      heading: 'O kit completo',
      body: 'Todos os tamanhos de logo e de banner, os arquivos SVG e o guia em PDF, em uma pasta do Google Drive.',
      items: (n: { smallest: number; largest: number; sizes: number; banners: number; pages: number }) => [
        `O símbolo em PNG em ${n.sizes} tamanhos, de ${n.smallest} a ${n.largest} px`,
        `O logo completo em PNG em ${n.banners} tamanhos de banner`,
        'Os dois arquivos SVG',
        `O guia em PDF, com ${n.pages} páginas`,
      ],
      cta: 'Abrir o kit completo no Google Drive',
      questionPrefix: 'Está faltando um tamanho, ou você não sabe se uma regra cobre o que está criando?',
      questionLink: 'Pergunte no Discord',
      questionSuffix: '. A gente costuma responder rápido.',
    },
  },
  share: {
    copyAd: 'Copiar anúncio do Discord',
    copied: 'Copiado',
    copyFailed: 'Não foi possível copiar. Selecione o texto da pré-visualização e copie você mesmo.',
    preview: 'Pré-visualizar',
    previewTitle: 'Seu anúncio do Discord',
    previewHint: 'Este é o texto exato que será copiado. Cole em um canal do Discord e o link mostrará nossa imagem de pré-visualização.',
    nativeShare: 'Compartilhar',
    close: 'Fechar',
    shareOurAd: 'Compartilhe nosso anúncio',
    shareOurAdHint: 'Copie um anúncio do Discord pronto sobre a WSLATL',
    ad: {
      homeIntro: (location: string) => `Hospedagem privada de uma equipe pequena em ${location}. Servidores de jogos, VPS e servidores dedicados.`,
      brandLine: 'Hosting that actually gives a damn.',
      partnerIntro: (name: string) => `${name} é parceiro oficial da WSLATL, uma empresa de hospedagem privada para servidores de jogos e VPS.`,
      partnerCode: (code: string) => `Código de indicação: \`${code}\``,
      partnerDiscount: (percent: string) => `Cadastre-se com ele e ganhe ${percent} de desconto na primeira fatura da sua hospedagem, exceto servidores dedicados.`,
      partnerGames: (games: string) => `Jogos: ${games}`,
      findOnline: (name: string) => `Encontre ${name} online:`,
      offerHeading: 'O que oferecemos',
      whyHeading: 'Por que a WSLATL',
      startHeading: 'Comece aqui',
      andMore: (n: number) => `e mais ${n}`,
      hostingFrom: (price: string) => `Hospedagem a partir de ${price}/mês`,
      gamesIntro: 'Todo jogo roda nos mesmos planos: você escolhe a RAM, não um pacote preso a um jogo.',
      gamesMore: (count: number) => `${count} jogos compatíveis, e se tiver servidor dedicado quase sempre conseguimos rodar.`,
      pricingIntro: 'Preços mensais publicados em dólares americanos. Sem armadilhas de preço na renovação.',
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
    label: 'Trilha de navegação',
  },
}

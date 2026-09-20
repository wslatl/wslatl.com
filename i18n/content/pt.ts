import type { ContentTranslation } from '@/i18n/content/types'

/** Portuguese translations of the text in data/. */
export const pt: ContentTranslation = {
  services: {
    vps: {
      title: 'Hospedagem VPS',
      description:
        'Recursos isolados, acesso root completo e liberdade para rodar o que você precisar. Um meio-termo sólido entre compartilhado e dedicado.',
      features: ['Acesso root e sudo completos', 'O sistema operacional que você escolher', 'Planos em SATA SSD ou NVMe'],
    },
    game: {
      title: 'Hospedagem de servidores de jogos',
      description:
        'Servidores de jogos com um painel de controle limpo e zero dor de cabeça. Deixamos rápido, deixamos no ar, e se algo quebrar, a gente conserta.',
      features: ['Painel Pterodactyl incluído', 'Proteção DDoS já embutida', 'Suporte a mods e plugins'],
    },
    dedicated: {
      title: 'Servidores dedicados',
      description:
        'O seu próprio hardware e os seus próprios recursos. Ninguém dividindo a sua CPU ou a sua RAM. Acesso root completo, gerenciado ou não gerenciado, e estamos por perto se algo aparecer.',
      features: [
        'Nada de recursos compartilhados',
        'Armazenamento NVMe SSD',
        'Acesso remoto por IPMI e KVM',
        'Opções de banda não medida',
      ],
    },
    web: {
      title: 'Hospedagem de sites',
      description:
        'Hospedagem confiável para sites e aplicações web, gerenciada por nós, com uma pessoa de verdade para procurar se algo sair do rumo.',
      features: [
        'Certificados SSL gratuitos',
        'cPanel com instalação de aplicativos em um clique',
        'Hospedagem de e-mail incluída',
        'Backups mensais incluídos',
      ],
    },
  },
  commitments: {
    uptime: { label: 'Meta de uptime em VPS e hospedagem de sites' },
    reply: { label: 'Primeira resposta típica no Discord em horário ativo', value: "Menos de 1 h" },
    live: { label: 'A maioria dos servidores entra no ar no dia em que você é aprovado', value: "No mesmo dia" },
    notice: { label: 'Aviso por escrito antes de qualquer aumento de preço', value: "30 dias" },
  },
  leadFeature: {
    title: 'Você fala com uma pessoa de verdade. Sempre.',
    description:
      'Sem muro de bots e sem resposta de script. Abra um ticket no seu portal de faturamento, chame a gente no Discord ou mande uma DM direto, e você cai com alguém que sabe o que está fazendo e se importa com o seu servidor.',
  },
  features: {
    hardware: {
      title: 'Hardware que aguenta',
      description:
        'SSDs NVMe, CPUs de alta frequência, caminhos de rede redundantes e roteamento de baixa latência. Feito para rodar pesado sem cortar caminho.',
    },
    uptime: {
      title: 'No ar quando importa',
      description:
        'Mitigação de DDoS embutida desde o começo. Se algo tentar te derrubar, a gente cuida disso.',
    },
    'application-only': {
      title: 'Exigentes por um bom motivo',
      description:
        'Aceitamos clientes por inscrição. Isso não é criar barreira. É como garantimos que conseguimos atender de verdade cada pessoa que entra.',
    },
  },
  faqs: {
    'getting-started': {
      question: 'Como eu começo?',
      answer:
        'Vá até billing.wslatl.com/register e solicite acesso. Um admin analisa cada inscrição e aprova antes de você poder acessar qualquer serviço. Depois de aprovado, fale com a gente no Discord ou abra um ticket de faturamento que deixamos tudo pronto.',
    },
    'what-makes-you-different': {
      question: 'O que diferencia vocês das grandes empresas de hospedagem?',
      answer:
        'Somos pequenos de propósito. Somos uma empresa privada, só por inscrição, sediada no Missouri. Já trabalhamos dentro de empresas de hospedagem e vimos como os clientes acabam ignorados. Na WSLATL, todo cliente tem acesso direto à nossa equipe, todas as vezes. Nada de filas paradas por dias e nada de respostas copiadas e coladas.',
    },
    'supported-games': {
      question: 'Quais jogos vocês suportam para servidores de jogos?',
      answer:
        'Rodamos Pterodactyl e suportamos uma variedade grande de jogos: Minecraft (Java e Bedrock), Rust, CS2, ARK, Valheim, Terraria, FiveM e muitos outros. Se o seu jogo não estiver na lista, é só perguntar. Quase sempre conseguimos suportar.',
    },
    'game-server-cost': {
      question: 'Quanto custa a hospedagem de servidor de jogos?',
      answer:
        'Os servidores de jogos Budget começam em {gamePrice} por mês para {gameRam} GB de RAM em SATA SSD, e os planos Premium em NVMe começam em {gamePremiumPrice} por mês. Os planos de VPS começam em {vpsPrice}. A página de preços tem o detalhamento completo.',
    },
    'response-time': {
      question: 'Em quanto tempo vocês respondem de verdade?',
      answer:
        'Em menos de uma hora no Discord durante o horário ativo, e muitas vezes bem mais rápido. Não temos uma equipe de suporte gigante. Temos uma equipe dedicada. Você vai sempre falar com alguém que conhece o seu servidor e a sua configuração, não com alguém lendo um script.',
    },
    'managed-hosting': {
      question: 'Vocês oferecem hospedagem gerenciada?',
      answer:
        'Sim. Oferecemos opções totalmente gerenciadas, em que cuidamos de atualizações, monitoramento e manutenção. Também oferecemos opções não gerenciadas para quem quer controle total. Descobrimos o que funciona melhor para você na nossa primeira conversa.',
    },
    'changes-later': {
      question: 'Dá para fazer upgrade, downgrade ou mudar as coisas depois?',
      answer:
        'Claro. Cada relação com cliente é tratada pessoalmente, então upgrades, mudanças de plano e migrações estão a uma mensagem de Discord de distância. Normalmente resolvemos no mesmo dia.',
    },
    'vps-vs-shared': {
      question: 'Hospedagem VPS é melhor que hospedagem compartilhada?',
      answer:
        'Para a maioria de quem toca um projeto de verdade, sim. Um VPS te dá CPU e RAM dedicadas que mais ninguém encosta, acesso root completo e nenhum risco de uma conta vizinha derrubar o seu desempenho. A hospedagem compartilhada é mais barata, mas você divide recursos com estranhos.',
    },
    'ddos-protection': {
      question: 'Vocês oferecem proteção DDoS?',
      answer:
        'Sim. A proteção DDoS está incluída em todo plano de servidor de jogos, sem custo extra. Ela fica sempre ligada, não é algo que você precise ativar ou pagar para adicionar depois.',
    },
  },
  team: {
    'Liam Henry': {
      role: 'Fundador e CEO',
      bio: 'Anos de estrada no setor de hospedagem. Criou a WSLATL para dar aos clientes a atenção direta que eles merecem.',
    },
    'Tyler Woollis': {
      role: 'Cofundador e cossócio',
      bio: 'Mantém a infraestrutura firme. Se algo quebra, ele já sabe disso.',
    },
  },
  reviews: {
    title: 'Leia o que os nossos clientes dizem',
    body:
      'Toda avaliação no nosso perfil público do Trustpilot é real. Não pagamos por elas, não filtramos as ruins e não escondemos as que doem.',
    cta: 'Veja as nossas avaliações no Trustpilot',
    ask: 'Já foi nosso cliente? Uma avaliação honesta ajuda a próxima pessoa a decidir se somos a escolha certa.',
    learnMore: 'Como o Trustpilot funciona',
  },
  sla: {
    vps: { label: 'Hospedagem VPS' },
    web: { label: 'Hospedagem de sites' },
    game: { label: 'Hospedagem de servidores de jogos' },
    dedicated: { label: 'Servidores dedicados', target: "Melhor esforço, sujeito à disponibilidade de hardware e do data center" },
  },
  pricing: {
    lines: {
      vps: {
        label: 'VPS',
        intro:
          'Recursos isolados e acesso root completo, com o sistema operacional que você escolher. Os planos Budget rodam em SATA SSD e os Premium em NVMe, com núcleos Ryzen 9 de alta frequência.',
        included: [
          'Acesso root e sudo completos',
          'O sistema operacional que você escolher',
          'Upgrades e mudanças de plano feitos por uma pessoa',
          'Uma pessoa de verdade para conversar se algo quebrar',
        ],
      },
      game: {
        label: 'Servidores de jogos',
        intro:
          'Estes planos não ficam presos a um jogo. Escolha a RAM que você precisa e rode o que quiser. Atendemos a maioria dos títulos que oferecem servidor dedicado, incluindo Minecraft, Rust, CS2, ARK, Valheim, FiveM e Palworld. Não achou o seu? É só perguntar. Quase sempre conseguimos rodar.',
        included: [
          'Painel de controle Pterodactyl',
          'Proteção DDoS já embutida',
          'Suporte completo a mods e plugins',
          'Configuração no mesmo dia, na maior parte das vezes',
          'Uma pessoa de verdade para conversar se algo quebrar',
        ],
      },
    },
    groups: {
      'budget-vps': {
        label: 'VPS Budget',
        description: 'Armazenamento SATA SSD sólido a preços honestos.',
        comparison: '10% abaixo da Hosturly',
      },
      'premium-vps': {
        label: 'VPS Premium',
        description:
          'Discos NVMe em núcleos Ryzen 9 de alta frequência. Desempenho no mundo real, não só números maiores.',
        comparison: '10% abaixo da DigitalOcean',
      },
      'budget-game': {
        label: 'Servidores de jogos Budget',
        description: 'Servidores de jogos em SATA SSD. Normalmente deixamos você no ar no mesmo dia.',
        comparison: '10% abaixo da Sparked',
      },
      'premium-game': {
        label: 'Servidores de jogos Premium',
        description: 'Discos NVMe e núcleos Ryzen 9 para quando a linha Budget não dá conta.',
        comparison: '25% abaixo da Sparked',
      },
    },
  },
  games: {
    minecraft: {
      tagline: 'Java, Bedrock, Paper, Spigot, Forge, Fabric: tudo isso.',
      description:
        'O jogo com que todo mundo começa, e o que mais tende a ficar grande demais para uma hospedagem compartilhada. Vanilla, Paper para desempenho, Forge ou Fabric para modpacks pesados, ou uma configuração compatível com Bedrock para quem joga no console e no celular. Quem decide é o egg, não o plano.',
      popularFor: [
        'survival com Paper e plugins',
        'modpacks ATM9 e RLCraft',
        'servidores Bedrock com cross-play',
        'servidores de construção no criativo',
      ],
      setups: ['1-5 no vanilla', '5-15 no Paper/Spigot com plugins', '10-20 com poucos mods', 'Modpacks pesados (RLCraft, ATM9)'],
      faqs: [
        {
          q: 'Dá para rodar um servidor modado como RLCraft ou ATM9?',
          a: 'Dá. O Minecraft modado consome muita memória e aproveita bem o armazenamento NVMe e os núcleos Ryzen 9 da linha Premium, mas a linha Budget roda modpacks leves numa boa.',
        },
        {
          q: 'Vocês suportam jogadores de Bedrock em um servidor Java?',
          a: 'Sim, por meio de um egg compatível com Geyser/Floodgate, então quem joga no Java e quem joga no Bedrock ou no console divide o mesmo mundo.',
        },
      ],
    },
    rust: {
      tagline: 'Construção de base e PvP em um servidor que sobrevive a um ciclo inteiro de wipe.',
      description:
        'O Rust castiga o hardware em um wipe novo, quando a população inteira entra de uma vez. O armazenamento NVMe mantém rápidas a geração do mapa e o carregamento de entidades, e suportamos Oxide/uMod para ferramentas de admin, kits e plugins de economia.',
      popularFor: ['servidores com plugins Oxide/uMod', 'wipes modados 2x/5x/10x', 'personalização de monumentos e mapas'],
      setups: ['modado com limite de 25', 'vanilla ou pouco modado com limite de 50', 'limite de 100+, com plugins Oxide'],
      faqs: [
        {
          q: 'O meu servidor aguenta um wipe com a população cheia?',
          a: 'A linha Premium NVMe foi feita para isso. A geração do mapa e o pico de login no dia do wipe dependem de armazenamento e CPU, e o NVMe com núcleos Ryzen 9 absorve os dois melhor que os planos SATA.',
        },
        {
          q: 'Oxide/uMod é suportado?',
          a: 'Sim, instale do mesmo jeito que faria em qualquer servidor de Rust; a máquina por baixo é sua para configurar.',
        },
      ],
    },
    'ark-survival-ascended': {
      tagline: 'ARK na Unreal Engine 5, com a folga de RAM que ele realmente precisa.',
      description:
        'O ASA é bem mais pesado que o ARK original, ainda mais com mods ou com vários mapas em cluster. Recomendamos começar com 8GB para um único mapa e crescer a partir daí, antes de adicionar mods.',
      popularFor: ['configurações em cluster com vários mapas', 'servidores modados com taxas aumentadas', 'servidores PvE de tribo'],
      setups: ['Um mapa, tribo pequena', 'Um mapa, servidor cheio', 'Mapas em cluster ou modados'],
      faqs: [
        {
          q: 'Dá para juntar vários mapas em um cluster?',
          a: 'Dá. Cada mapa roda como o seu próprio serviço e você liga todos em cluster do mesmo jeito que faria hospedando por conta própria; só calcule a RAM por mapa, não por cluster.',
        },
      ],
    },
    'ark-survival-evolved': {
      tagline: 'O original, ainda o alvo da maioria dos mod packs.',
      description:
        'Ainda é a versão para a qual a maioria das grandes coleções de mods (S+, Automated Ark, Classic Flyers) foi feita. Mais leve de RAM que o Ascended, então é a opção mais tranquila para um cluster modado com orçamento curto.',
      popularFor: ['servidores modados com S+ e Automated Ark', 'clusters clássicos de Island e Ragnarok'],
      setups: ['Um mapa, tribo pequena', 'Um mapa, modado', 'Mapas em cluster'],
      faqs: [
        {
          q: 'Vocês suportam mods da Steam Workshop?',
          a: 'Sim, os mods são instalados pelo ID da Steam Workshop do mesmo jeito que em um servidor hospedado por conta própria.',
        },
      ],
    },
    valheim: {
      tagline: 'Sobrevivência cooperativa viking que roda leve, mesmo com o servidor cheio.',
      description:
        'Um dos títulos de sobrevivência mais fáceis de hospedar. Um grupo pequeno roda confortavelmente na linha de entrada, e até uma sessão inteira de raid de chefe, com todo mundo carregado no mesmo bioma, raramente precisa de mais que um plano intermediário.',
      popularFor: ['mundos modados com BepInEx', 'cooperativo de grupos pequenos de amigos'],
      setups: ['2-5 jogadores', '5-10 jogadores, modado (BepInEx)'],
      faqs: [
        {
          q: 'BepInEx/Valheim Plus é suportado?',
          a: 'Sim, instale o BepInEx e qualquer plugin do mesmo jeito que em um servidor dedicado hospedado por conta própria.',
        },
      ],
    },
    palworld: {
      tagline: 'Sobrevivência com coleta de criaturas, um dos títulos novos mais pesados por jogador.',
      description:
        'O servidor dedicado de Palworld consome mais memória por jogador que os títulos de sobrevivência mais antigos, e o arquivo de save cresce rápido com uma base movimentada. Recomendamos puxar para o limite mais alto da faixa se você espera muita construção.',
      popularFor: ['servidores cooperativos de construção de base', 'servidores PvP de guilda'],
      setups: ['1-8 jogadores', '16-32 jogadores'],
      faqs: [
        {
          q: 'Com que frequência o Palworld é atualizado, e isso quebra o meu servidor?',
          a: 'As atualizações são frequentes; mantemos o egg do servidor em dia, então um restart já pega a versão mais recente sem você mexer em arquivo na mão.',
        },
      ],
    },
    '7-days-to-die': {
      tagline: 'Sobrevivência zumbi com construção de base e noites de horda.',
      description:
        'Um jogo de sobrevivência em voxel em que a ameaça de verdade é a noite de horda marcada no relógio, não os zumbis perdidos por aí. A geração do mundo pesa na CPU e no armazenamento no primeiro boot, então o NVMe corta bastante essa espera.',
      popularFor: ['servidores PvE de noite de horda', 'pacotes de overhaul modados'],
      setups: ['4-8 jogadores', '8-16 jogadores, modado'],
      faqs: [
        {
          q: 'A geração do mundo demora muito?',
          a: 'A geração no primeiro boot é o momento mais pesado deste jogo; a linha NVMe encurta isso visivelmente em comparação com o armazenamento SATA.',
        },
      ],
    },
    'project-zomboid': {
      tagline: 'Sobrevivência zumbi isométrica, cruel por design.',
      description:
        'Um jogo de sobrevivência mais lento e implacável, em que a morte é permanente e o mapa é enorme. Os mods (e são milhares) pesam de verdade, então reserve RAM extra se o seu grupo usa uma lista pesada.',
      popularFor: ['servidores de sobrevivência com muitos mods', 'comunidades de roleplay'],
      setups: ['1-4 jogadores, vanilla', '8-16 jogadores, modado'],
      faqs: [
        {
          q: 'Dá para rodar uma lista grande de mods da Workshop?',
          a: 'Dá. Os mods da Workshop são suportados; só dimensione a RAM pela sua lista de mods, e não pela recomendação do vanilla.',
        },
      ],
    },
    'conan-exiles': {
      tagline: 'Sobrevivência brutal em mundo aberto na Era Hiboriana.',
      description:
        'Construção de base, clãs e um mapa aberto grande, que exige recursos de verdade para hospedar bem assim que o servidor enche de construções dos jogadores.',
      popularFor: ['servidores de PvP entre clãs', 'PvE focado em construção'],
      setups: ['10-20 jogadores', '30-40 jogadores'],
      faqs: [],
    },
    'the-forest': {
      tagline: 'Survival horror cooperativo em uma ilha infestada de canibais.',
      description:
        'Um survival horror cooperativo e tenso. A hospedagem em servidor dedicado mantém o mundo persistente esteja o anfitrião online ou não, que é justamente o ponto para um grupo que joga em horários diferentes.',
      popularFor: ['grupos pequenos de sobrevivência cooperativa'],
      setups: ['2-4 jogadores'],
      faqs: [],
    },
    'sons-of-the-forest': {
      tagline: 'A sequência maior e mais bonita de The Forest.',
      description:
        'O componente de servidor dedicado veio depois do lançamento em acesso antecipado e amadureceu desde então; um mundo persistente é o principal motivo para os grupos saírem da hospedagem entre pares.',
      popularFor: ['mundos cooperativos de sobrevivência persistentes'],
      setups: ['2-6 jogadores'],
      faqs: [],
    },
    enshrouded: {
      tagline: 'Ação e sobrevivência em voxel com construção de base de verdade.',
      description:
        'Um título de sobrevivência em voxel mais novo, que mistura combate de ação com construção de base profunda. Os dados de terreno em voxel guardados no servidor crescem rápido quando há um construtor ativo no grupo.',
      popularFor: ['construção de base cooperativa', 'grupos focados em chefes'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    'v-rising': {
      tagline: 'Sobrevivência vampírica com construção de castelo e PvP.',
      description:
        'Sobrevivência vampírica gótica com PvP em tempo real e cercos a castelos. O desempenho continua liso em configurações modestas até o servidor encher de castelos elaborados.',
      popularFor: ['servidores de PvP com cerco a castelos', 'servidores PvE de clã'],
      setups: ['10-20 jogadores', '40 jogadores'],
      faqs: [],
    },
    terraria: {
      tagline: 'Aventura sandbox em 2D, absurdamente leve de hospedar.',
      description:
        'Um dos jogos mais leves de rodar desta lista inteira. TShock e outros frameworks de mod acrescentam ferramentas de admin sem peso relevante.',
      popularFor: ['servidores de comunidade gerenciados com TShock'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    starbound: {
      tagline: 'O primo espiritual do Terraria, no espaço.',
      description:
        'Um sandbox de ficção científica da mesma família do Terraria. Leve de rodar mesmo com um grupo modesto e alguns mods.',
      popularFor: ['servidores de exploração modados'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    craftopia: {
      tagline: 'Crafting e sobrevivência em mundo aberto, do time de Palworld.',
      description:
        'Construção e crafting acelerados em mundo aberto, com uma lista enorme de recursos. Roda confortavelmente em um plano intermediário para um grupo pequeno.',
      popularFor: ['grupos pequenos de crafting cooperativo'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    'core-keeper': {
      tagline: 'Mineração e exploração sandbox no subterrâneo.',
      description:
        'Um sandbox aconchegante de mineração subterrânea, que continua leve mesmo com um grupo cheio explorando cantos diferentes do mundo ao mesmo tempo.',
      popularFor: ['servidores de exploração cooperativa'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    necesse: {
      tagline: 'Sobrevivência sandbox em visão de cima, com defesa de base de verdade.',
      description:
        'Um título de sobrevivência sandbox de menor escala, com construção de assentamento e ondas no estilo tower defense. Exigências modestas de hardware.',
      popularFor: ['cooperativo de construção de assentamentos'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    icarus: {
      tagline: 'Sobrevivência por sessões em um mundo alienígena hostil.',
      description:
        'Sobrevivência por sessões, em que cada descida é a sua própria instância. A hospedagem dedicada mantém uma sessão rodando para o grupo sem o PC de uma pessoa carregar tudo.',
      popularFor: ['grupos cooperativos por sessão'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    grounded: {
      tagline: 'Sobrevivência no quintal, em escala de inseto.',
      description:
        'O jogo de sobrevivência da Obsidian no quintal encolhido. Um servidor dedicado mantém o mundo vivo para uma família ou um grupo de amigos entre sessões diferentes.',
      popularFor: ['cooperativo em família e em grupos pequenos'],
      setups: ['2-4 jogadores'],
      faqs: [],
    },
    scum: {
      tagline: 'Sobrevivência hardcore em mundo aberto, com simulação profunda do personagem.',
      description:
        'Um dos títulos de sobrevivência mais exigentes desta lista, com simulação detalhada de metabolismo e de veículos somando carga real no servidor conforme a contagem de jogadores sobe.',
      popularFor: ['servidores grandes de PvP em mundo aberto'],
      setups: ['10-20 jogadores', '40-64 jogadores'],
      faqs: [],
    },
    astroneer: {
      tagline: 'Exploração espacial cooperativa e relaxada, com construção de base.',
      description:
        'Um jogo tranquilo de exploração e construção cooperativa por vários planetas. Roda confortavelmente para um grupo pequeno com recursos modestos.',
      popularFor: ['construção cooperativa relaxada'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    stationeers: {
      tagline: 'Sobrevivência de sistemas profundos, construindo uma estação espacial.',
      description:
        'Um jogo de construção pesado em simulação, sobre manter funcionando a atmosfera, a energia e a logística de uma estação espacial. A CPU importa mais aqui que na maioria dos títulos desta lista.',
      popularFor: ['cooperativo com foco em engenharia'],
      setups: ['2-6 jogadores'],
      faqs: [],
    },
    empyrion: {
      tagline: 'Sobrevivência, construção e exploração no espaço.',
      description:
        'Um jogo de sobrevivência e construção espacial, com naves e bases feitas pelos jogadores em vários planetas. O tamanho do mundo cresce com as horas jogadas, então planeje o armazenamento de acordo.',
      popularFor: ['servidores multijogador de construção de naves'],
      setups: ['2-8 jogadores'],
      faqs: [],
    },
    'vintage-story': {
      tagline: 'Sobrevivência profunda e realista, com metalurgia e agricultura de verdade.',
      description:
        'Um sandbox de sobrevivência mais lento e movido a simulação, no gênero estilo Minecraft, voltado para quem quer profundidade real de crafting. Leve de hospedar.',
      popularFor: ['comunidades de sobrevivência realista'],
      setups: ['2-10 jogadores'],
      faqs: [],
    },
    barotrauma: {
      tagline: 'Sobrevivência de tripulação em submarino, parte simulação, parte terror.',
      description:
        'Uma simulação 2D de tripulação de submarino com gestão de sistemas de verdade (reatores, rombos no casco, criaturas hostis). A hospedagem dedicada mantém as partidas de pé sem depender da conexão de uma só pessoa.',
      popularFor: ['sessões cooperativas em tripulação'],
      setups: ['4-8 jogadores'],
      faqs: [],
    },
    eco: {
      tagline: 'Sobrevivência colaborativa construída em torno de uma economia compartilhada.',
      description:
        'Um jogo de construção de civilização em que o ponto todo é a economia e o ecossistema compartilhados. Roda melhor com mais RAM conforme o seu mundo e a sua contagem de jogadores crescem.',
      popularFor: ['servidores de civilização e economia'],
      setups: ['10-20 jogadores'],
      faqs: [],
    },
    'don-t-starve-together': {
      tagline: 'Sobrevivência cooperativa no estilo gótico da Klei.',
      description:
        "A versão multijogador de Don't Starve. Muito leve de hospedar, mesmo com o lobby cheio, e os mods acrescentam pouco peso.",
      popularFor: ['mundos cooperativos modados'],
      setups: ['2-6 jogadores'],
      faqs: [],
    },
    factorio: {
      tagline: 'Automação e construção de fábricas, famosa por depender da CPU.',
      description:
        'Um jogo de automação de fábricas cujas bases de fim de jogo são notoriamente pesadas para a CPU conforme esteiras e máquinas se multiplicam, então este aqui aproveita os núcleos Ryzen 9 mais rápidos da nossa linha Premium mais que a maioria.',
      popularFor: ['servidores de automação de longa duração'],
      setups: ['2-8 jogadores, começo de jogo', 'fábricas grandes de fim de jogo'],
      faqs: [
        {
          q: 'Por que o Factorio precisa mais de núcleos rápidos que de RAM?',
          a: 'A simulação do Factorio roda em uma única thread e depende da CPU conforme a sua fábrica cresce, então um plano com clocks fortes por núcleo (a nossa linha Premium com Ryzen 9) mantém o UPS estável por mais tempo do que só acrescentar RAM.',
        },
      ],
    },
    muck: {
      tagline: 'Sobrevivência roguelike cooperativa, rápida e caótica.',
      description:
        'Um roguelike de sobrevivência de sessões curtas, feito para partidas cooperativas rápidas e caóticas. Exigências mínimas de hospedagem.',
      popularFor: ['grupos cooperativos de sessão rápida'],
      setups: ['2-4 jogadores'],
      faqs: [],
    },
    unturned: {
      tagline: 'Sobrevivência zumbi em blocos, gratuita e com uma cena de mods enorme.',
      description:
        'Um sandbox gratuito de sobrevivência zumbi em blocos, com uma cena ativa de mods na Workshop pelos frameworks de plugin Rocket e Unturned 3.x.',
      popularFor: ['servidores de roleplay modados com Rocket'],
      setups: ['10-24 jogadores', '32+ jogadores, modado'],
      faqs: [],
    },
    cs2: {
      tagline: 'CS2 competitivo e casual, com espaço para plugins da comunidade.',
      description:
        'Uso baixo de recursos por jogador, então a pergunta de verdade é a estabilidade do tick sob carga. A nossa linha NVMe mantém o tick rate firme em um servidor cheio de 10-32 jogadores, e as stacks de plugins CounterStrikeSharp / MetaMod são totalmente suportadas.',
      popularFor: [
        'servidores de treino competitivo 5v5',
        'deathmatch/surf/retake da comunidade',
        'stacks de plugins CounterStrikeSharp',
      ],
      setups: ['10-16 jogadores, competitivo simples', '24-32 jogadores, comunidade + plugins'],
      faqs: [
        {
          q: 'Dá para rodar plugins CounterStrikeSharp / MetaMod?',
          a: 'Dá, instale do mesmo jeito que em qualquer servidor dedicado de CS2; nada no painel restringe isso.',
        },
      ],
    },
    'team-fortress-2': {
      tagline: 'Ainda firme e forte, ainda mais com os plugins SourceMod da comunidade.',
      description:
        'Um shooter de vida longa na engine Source, com um ecossistema profundo de plugins SourceMod/MetaMod que cobre de mapas de jump a modos de jogo totalmente customizados.',
      popularFor: ['servidores de comunidade com SourceMod', 'mapas de jump e surf'],
      setups: ['24 jogadores', '32 jogadores, com muitos plugins'],
      faqs: [],
    },
    'left-4-dead-2': {
      tagline: 'Tiro cooperativo em zumbis, com uma biblioteca enorme de campanhas customizadas.',
      description:
        'Sobrevivência zumbi cooperativa na engine Source, com milhares de campanhas e mods da comunidade disponíveis pela Workshop.',
      popularFor: ['servidores de campanhas customizadas', 'servidores de comunidade no modo versus'],
      setups: ['4-8 jogadores'],
      faqs: [],
    },
    'garrys-mod': {
      tagline: 'DarkRP, TTT, sandbox: o que a sua comunidade realmente joga.',
      description:
        'Menos um jogo e mais uma plataforma. DarkRP e TTT são os dois gamemodes mais pesados e mais dependentes de addons que vemos, e os dois aproveitam RAM extra assim que a coleção da Workshop de um servidor passa de algumas centenas de itens.',
      popularFor: ['servidores de roleplay DarkRP', 'TTT e Murder', 'servidores sandbox de construção'],
      setups: ['Sandbox, grupo pequeno', 'DarkRP/TTT, 20-40 jogadores'],
      faqs: [
        {
          q: 'Dá para rodar uma coleção grande de DarkRP na Workshop?',
          a: 'Dá. As coleções da Workshop são suportadas, e são exatamente o motivo de os servidores DarkRP precisarem de mais RAM do que o jogo base pede.',
        },
      ],
    },
    squad: {
      tagline: 'Guerra tática de armas combinadas em larga escala.',
      description:
        'O Squad é um dos shooters táticos mais pesados de hospedar na capacidade cheia de 100 jogadores, com a simulação de veículos e de mapas grandes somando carga real na CPU.',
      popularFor: ['servidores de armas combinadas em larga escala'],
      setups: ['Servidores de 50 jogadores', 'Servidores de 100 jogadores'],
      faqs: [],
    },
    'insurgency-sandstorm': {
      tagline: 'Combate tático de esquadrão, seco e implacável.',
      description:
        'Um shooter tático baseado em checkpoints, com uma pegada de servidor menor e mais fácil de administrar que a da maioria dos shooters militares de larga escala.',
      popularFor: ['servidores cooperativos de checkpoint', 'versus competitivo'],
      setups: ['8-16 jogadores'],
      faqs: [],
    },
    'killing-floor-2': {
      tagline: 'Caos cooperativo no modo horda.',
      description:
        'Tiro cooperativo em zumbis (Zeds) por ondas. Exigências modestas de recursos mesmo com um lobby cheio de 6 jogadores e mutators ativados.',
      popularFor: ['servidores modados no modo horda'],
      setups: ['6 jogadores'],
      faqs: [],
    },
    'arma-3': {
      tagline: 'Simulação militar em mundo aberto, com scripting profundo de missões.',
      description:
        'Simulador militar altamente modificável cujo custo real está na complexidade das missões e na quantidade de mods, não na contagem bruta de jogadores: uma missão Zeus com script para 40 jogadores pode pesar mais que um TvT simples de 80.',
      popularFor: ['comunidades de milsim', 'missões Zeus e King of the Hill'],
      setups: ['20-40 jogadores, poucos mods', 'Missões com muitos mods ou scripts'],
      faqs: [],
    },
    'arma-reforger': {
      tagline: 'Simulação militar na engine Enfusion, o campo de testes do Arma moderno.',
      description:
        'A entrada mais nova e mais enxuta da linha Arma, construída sobre a engine Enfusion que um dia vai mover o Arma 4. Em desenvolvimento ativo e com suporte a mods crescendo.',
      popularFor: ['servidores de conflito e de operações de combate'],
      setups: ['32-64 jogadores'],
      faqs: [],
    },
    'no-more-room-in-hell': {
      tagline: 'Survival horror cooperativo e gratuito, na engine Source.',
      description:
        'Um shooter gratuito e tenso de survival horror com zumbis, construído na Source. Leve nos recursos do servidor.',
      popularFor: ['cenários de terror cooperativo'],
      setups: ['8 jogadores'],
      faqs: [],
    },
    mordhau: {
      tagline: 'Combate corpo a corpo medieval em escala.',
      description:
        'Combate corpo a corpo em larga escala, com espadas movidas a física. A carga do servidor cresce principalmente com a contagem de jogadores e o tamanho do mapa.',
      popularFor: ['servidores de grandes batalhas corpo a corpo'],
      setups: ['32-64 jogadores'],
      faqs: [],
    },
    fivem: {
      tagline: 'Servidores de roleplay de GTA V, de um grupo pequeno a uma cidade inteira.',
      description:
        'As comunidades de roleplay vivem ou morrem pela quantidade de resources e pelo desempenho do banco de dados, não só pelos slots de jogador. Uma cidade ESX/QBCore completa, com economia de verdade, empregos customizados e persistência em MySQL, precisa de bem mais do que o mínimo do framework sugere.',
      popularFor: ['cidades de roleplay ESX e QBCore', 'scripts customizados de emprego e economia', 'comunidades com whitelist'],
      setups: ['Grupo pequeno, framework base', 'Cidade ESX/QBCore, 32-64 slots', 'Cidade grande, 100+ slots, scripts pesados'],
      faqs: [
        {
          q: 'Vocês suportam ESX ou QBCore de fábrica?',
          a: 'O framework base instala do mesmo jeito que em qualquer máquina de FiveM; não prendemos você a um framework ou a outro.',
        },
        {
          q: 'Dá para conectar um banco MySQL externo para a economia?',
          a: 'Dá, uma cidade de roleplay normalmente roda a sua própria instância MySQL/MariaDB para persistência, e ela conecta normalmente.',
        },
      ],
    },
    beammp: {
      tagline: 'Sessões multijogador de BeamNG.drive.',
      description:
        'O BeamMP traz multijogador persistente para a simulação de veículos de corpo mole do BeamNG.drive. Leve do lado do servidor, já que a física roda no cliente.',
      popularFor: ['servidores de direção e batidas da comunidade'],
      setups: ['4-16 jogadores'],
      faqs: [],
    },
    satisfactory: {
      tagline: 'Construção de fábricas em uma escala que uma hora pede um servidor de verdade.',
      description:
        'O Modo Servidor Dedicado tira a simulação do PC de um jogador por completo, o que importa quando uma fábrica se espalha pelo mapa, exatamente o ponto em que uma máquina local começa a engasgar. Aqui a folga de CPU importa tanto quanto a RAM.',
      popularFor: ['megafábricas cooperativas persistentes'],
      setups: ['1-4 jogadores, começo de jogo', 'Fábricas grandes de fim de jogo'],
      faqs: [
        {
          q: 'O mundo continua rodando quando todo mundo sai?',
          a: 'Continua, e é justamente esse o ponto do Modo Servidor Dedicado: a fábrica segue simulando e o PC de nenhum jogador precisa carregar a sessão.',
        },
      ],
    },
    'space-engineers': {
      tagline: 'Construção de naves e estações movida a física, no espaço.',
      description:
        'Um simulador de construção espacial em voxel, em que o custo real do servidor é a simulação física das naves grandes, não só a contagem de jogadores. A CPU importa mais que na maioria dos sandboxes.',
      popularFor: ['servidores de construção no sobrevivência e no criativo'],
      setups: ['4-8 jogadores', 'mundos multijogador grandes'],
      faqs: [],
    },
    dayz: {
      tagline: 'Sobrevivência PvP hardcore em mundo aberto, no mapa Chernarus (e em mods).',
      description:
        'Um shooter de sobrevivência implacável em mundo aberto, com uma cena de mods enorme (CF, Namalsk e dezenas de mods de overhaul) que somam peso real de memória em cima do jogo base.',
      popularFor: ['servidores modados da comunidade', 'servidores vanilla-plus hardcore'],
      setups: ['Vanilla, 40-60 jogadores', 'Com muitos mods (CF, mapas customizados)'],
      faqs: [
        {
          q: 'Dá para rodar mapas customizados como Namalsk ou Deer Isle?',
          a: 'Dá, os mods de mapa customizado funcionam do mesmo jeito que em um servidor de DayZ hospedado por conta própria. Só dimensione a RAM pela lista de mods, e não pela base vanilla.',
        },
      ],
    },
    atlas: {
      tagline: 'MMO de sobrevivência pirata em escala gigante.',
      description:
        'Um MMO de sobrevivência com tema pirata construído na engine do ARK, espalhado por uma grade oceânica enorme. Um dos títulos mais exigentes daqui na escala de grade completa.',
      popularFor: ['servidores piratas tocados por companhias'],
      setups: ['Uma célula da grade', 'Grade completa, com várias células'],
      faqs: [],
    },
  },
  ramLabels: {
    "16GB+ per map": "16GB+ por mapa",
    "8GB+ per map": "8GB+ por mapa",
    "4-8GB, CPU speed matters more": "4-8GB, a velocidade da CPU importa mais",
    "16GB+ total": "16GB+ no total",
  },
  gameCategories: {
    'Survival & Sandbox': 'Sobrevivência e sandbox',
    'Shooters & Tactical': 'Shooters e táticos',
    'Roleplay & Platforms': 'Roleplay e plataformas',
    'Building & Simulation': 'Construção e simulação',
    'Zombie & PvP': 'Zumbis e PvP',
  },
  legal: {
    privacy: {
      label: 'Política de Privacidade',
      title: 'Política de Privacidade',
      metaDescription: 'Como a WSLATL LLC coleta, usa e protege as suas informações pessoais.',
      intro:
        'Coletamos só o que precisamos para operar os seus serviços. Nunca vendemos os seus dados. Aqui está exatamente o que fazemos com as informações que você compartilha com a gente.',
    },
    terms: {
      label: 'Termos de Serviço',
      title: 'Termos de Serviço',
      metaDescription: 'Os termos e condições que regem o seu uso dos serviços de hospedagem da WSLATL LLC.',
      intro:
        'Estes termos regem o seu uso de todos os serviços prestados pela WSLATL LLC. Leia com atenção antes de usar os nossos serviços. Ao usar qualquer serviço da WSLATL, você concorda com estes termos.',
    },
    acceptableUse: {
      label: 'Uso Aceitável',
      title: 'Política de Uso Aceitável',
      metaDescription: 'O que é e o que não é permitido na infraestrutura de hospedagem da WSLATL LLC.',
      intro:
        'A nossa infraestrutura é compartilhada entre clientes. Um único mau ator afeta todo mundo. Esta política define o que é e o que não é aceitável nos servidores da WSLATL. Leia. Siga. A gente fiscaliza.',
    },
    refund: {
      label: 'Política de Reembolso',
      title: 'Política de Reembolso',
      metaDescription:
        'Como a WSLATL LLC trata pedidos de reembolso, incluindo os prazos de 48 horas e de 14 dias, os motivos elegíveis e os itens não reembolsáveis.',
      intro:
        'Mantemos a nossa política de reembolso simples. Um prazo de 48 horas por qualquer motivo. Um prazo de 14 dias para problemas reais. Continue lendo para ver exatamente o que é e o que não é elegível.',
    },
    sla: {
      label: 'Acordo de Nível de Serviço',
      title: 'Acordo de Nível de Serviço',
      metaDescription:
        'Metas de uptime da WSLATL LLC por tipo de serviço, aviso de manutenção programada e como solicitar um crédito de serviço.',
      intro:
        'As nossas metas de uptime por tipo de serviço, como lidamos com manutenção e o crédito de serviço que você pode solicitar quando não cumprimos uma meta. Isto reafirma a Seção 5 dos nossos Termos de Serviço.',
    },
    dmca: {
      label: 'Política de DMCA',
      title: 'Política de DMCA',
      metaDescription:
        'Como enviar à WSLATL LLC uma notificação de remoção por direitos autorais ou uma contranotificação, e a nossa política para infratores reincidentes sob o 17 U.S.C. 512.',
      intro:
        'Como denunciar violação de direitos autorais na infraestrutura da WSLATL, como um cliente contesta uma remoção e o que acontece com contas que infringem repetidamente.',
    },
    abuse: {
      label: 'Política de Abuso',
      title: 'Política de Abuso',
      metaDescription:
        'Como denunciar abuso da infraestrutura da WSLATL LLC (spam, ataques de rede, phishing, malware, conteúdo ilegal) e como tratamos as denúncias.',
      intro:
        'Como denunciar abuso da infraestrutura da WSLATL, o que fazemos com uma denúncia depois de recebê-la e como lidamos com serviços que são a origem do abuso.',
    },
    accountCredit: {
      label: 'Crédito na Conta',
      title: 'Termos de Crédito na Conta',
      metaDescription:
        'Como funciona o crédito na conta na WSLATL LLC: comprar crédito, aplicá-lo em faturas, presenteá-lo a outra conta e para que ele pode e não pode ser usado.',
      intro:
        'O crédito na conta é um valor pré-pago que você gasta em serviços da WSLATL. Ele não expira e não é resgatável em dinheiro. Aqui está exatamente como ele funciona.',
    },
    subprocessors: {
      label: 'Subprocessadores',
      title: 'Subprocessadores',
      metaDescription:
        'Os terceiros que processam dados pessoais em nome da WSLATL LLC, o que cada um recebe e como as transferências internacionais são tratadas.',
      intro:
        'Todo terceiro que toca em dados pessoais em nosso nome, o que ele recebe e por quê. Nomeados, não só separados por categoria.',
    },
    backups: {
      label: 'Backups',
      title: 'Política de Backup',
      metaDescription:
        'Do que a WSLATL LLC faz backup, por que os backups são de melhor esforço, por que você deve manter as suas próprias cópias e como pedir uma restauração.',
      intro:
        'Do que fazemos backup, o que um backup é e o que ele não é, e por que você deve manter as suas próprias cópias mesmo assim. Além de como pedir uma restauração.',
    },
  },
}

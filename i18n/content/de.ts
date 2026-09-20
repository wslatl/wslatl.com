import type { ContentTranslation } from '@/i18n/content/types'
/** German translations of the text in data/. */
export const de: ContentTranslation = {
  services: {
    vps: {
      title: 'VPS-Hosting',
      description:
        'Isolierte Ressourcen, voller root-Zugriff und die Freiheit, alles zu betreiben, was du brauchst. Ein solider Mittelweg zwischen Shared und Dedicated.',
      features: ['Voller root- und sudo-Zugriff', 'Betriebssystem deiner Wahl', 'Tarife mit SATA SSD oder NVMe'],
    },
    game: {
      title: 'Gameserver-Hosting',
      description:
        'Gameserver mit einem aufgeräumten Control Panel und null Kopfschmerzen. Wir halten sie schnell, wir halten sie online, und wenn etwas kaputtgeht, reparieren wir es.',
      features: ['Pterodactyl-Panel inklusive', 'DDoS-Schutz von Haus aus', 'Unterstützung für Mods und Plugins'],
    },
    dedicated: {
      title: 'Dedicated Server',
      description:
        'Deine eigene Hardware und deine eigenen Ressourcen. Niemand teilt sich deine CPU oder deinen RAM. Voller root-Zugriff, managed oder unmanaged, und wir sind erreichbar, falls etwas aufkommt.',
      features: ['Keine geteilten Ressourcen', 'NVMe-SSD-Speicher', 'IPMI- und KVM-Fernzugriff', 'Optionen mit unbegrenztem Traffic'],
    },
    web: {
      title: 'Webhosting',
      description:
        'Zuverlässiges Hosting für Websites und Web-Apps, von uns verwaltet, mit einem echten Menschen als Ansprechpartner, wenn etwas schiefgeht.',
      features: ['Kostenlose SSL-Zertifikate', 'cPanel mit App-Installation per Klick', 'E-Mail-Hosting inklusive', 'Monatliche Backups inklusive'],
    },
  },
  commitments: {
    uptime: { label: 'Uptime-Ziel für VPS und Webhosting' },
    reply: { label: 'Typische erste Antwort auf Discord in aktiven Zeiten', value: "Unter 1 Std." },
    live: { label: 'Die meisten Server gehen an deinem Freigabetag online', value: "Am selben Tag" },
    notice: { label: 'Schriftliche Ankündigung vor jeder Preiserhöhung', value: "30 Tage" },
  },
  leadFeature: {
    title: 'Du sprichst mit einem echten Menschen. Jedes Mal.',
    description:
      'Keine Bot-Mauer und keine Textbausteine. Öffne ein Ticket in deinem Abrechnungsportal, schreib uns auf Discord oder direkt per DM, und du bekommst jemanden, der weiß, was er tut, und dem dein Server nicht egal ist.',
  },
  features: {
    hardware: {
      title: 'Hardware, die durchhält',
      description:
        'NVMe-SSDs, hoch getaktete CPUs, redundante Netzwerkwege und Routing mit niedriger Latenz. Gebaut, um hart zu laufen, ohne an der falschen Stelle zu sparen.',
    },
    uptime: {
      title: 'Online, wenn es darauf ankommt',
      description:
        'DDoS-Abwehr von Anfang an eingebaut. Wenn dich jemand offline schießen will, kümmern wir uns darum.',
    },
    'application-only': {
      title: 'Wählerisch, und das aus gutem Grund',
      description:
        'Wir nehmen Kunden auf Bewerbung auf. Das ist keine Abschottung. So stellen wir sicher, dass wir wirklich jeden bedienen können, den wir aufnehmen.',
    },
  },
  faqs: {
    'getting-started': {
      question: 'Wie fange ich an?',
      answer:
        'Geh auf billing.wslatl.com/register und frag Zugang an. Ein Admin prüft jede Bewerbung und gibt sie frei, bevor du auf Services zugreifen kannst. Sobald du freigegeben bist, melde dich bei uns auf Discord oder öffne ein Ticket im Abrechnungsportal, und wir richten dich ein.',
    },
    'what-makes-you-different': {
      question: 'Was unterscheidet euch von den großen Hosting-Unternehmen?',
      answer:
        'Wir sind bewusst klein. Wir sind ein privates Unternehmen aus Missouri, das nur auf Bewerbung aufnimmt. Wir haben in Hosting-Unternehmen gearbeitet und gesehen, wie Kunden ignoriert werden. Bei WSLATL bekommt jeder Kunde jedes Mal direkten Kontakt zu unserem Team. Keine Warteschlangen, die tagelang stehen, und keine Copy-Paste-Antworten.',
    },
    'supported-games': {
      question: 'Welche Spiele unterstützt ihr für Gameserver?',
      answer:
        'Wir setzen auf Pterodactyl und unterstützen eine große Bandbreite an Spielen: Minecraft (Java und Bedrock), Rust, CS2, ARK, Valheim, Terraria, FiveM und viele mehr. Wenn dein Spiel nicht aufgeführt ist, frag einfach. Wir können es fast immer unterstützen.',
    },
    'game-server-cost': {
      question: 'Was kostet Gameserver-Hosting?',
      answer:
        'Budget-Gameserver starten bei {gamePrice} im Monat für {gameRam} GB RAM auf SATA SSD, und Premium-Tarife auf NVMe starten bei {gamePremiumPrice} im Monat. VPS-Tarife starten bei {vpsPrice}. Auf der Preisseite steht die vollständige Aufschlüsselung.',
    },
    'response-time': {
      question: 'Wie schnell antwortet ihr wirklich?',
      answer:
        'Unter einer Stunde auf Discord in aktiven Zeiten, und oft schneller. Wir haben kein riesiges Support-Team. Wir haben ein engagiertes. Du sprichst immer mit jemandem, der deinen konkreten Server und dein Setup kennt, nicht mit jemandem, der ein Skript vorliest.',
    },
    'managed-hosting': {
      question: 'Bietet ihr Managed Hosting an?',
      answer:
        'Ja. Wir bieten vollständig gemanagte Optionen, bei denen wir Updates, Monitoring und Wartung übernehmen. Wir bieten auch unmanaged Optionen für Kunden, die volle Kontrolle wollen. Was für dich am besten passt, klären wir im ersten Gespräch.',
    },
    'changes-later': {
      question: 'Kann ich später upgraden, downgraden oder etwas ändern?',
      answer:
        'Natürlich. Jede Kundenbeziehung wird persönlich betreut, Upgrades, Tarifwechsel und Migrationen sind also nur eine Discord-Nachricht entfernt. Meistens haben wir das noch am selben Tag erledigt.',
    },
    'vps-vs-shared': {
      question: 'Ist VPS-Hosting besser als Shared Hosting?',
      answer:
        'Für die meisten, die ein echtes Projekt betreiben, ja. Ein VPS gibt dir dedizierte CPU und dedizierten RAM, an die sonst niemand rangeht, vollen root-Zugriff und kein Risiko, dass ein Nachbarkonto deine Leistung ruiniert. Shared Hosting ist günstiger, aber du teilst dir die Ressourcen mit Fremden.',
    },
    'ddos-protection': {
      question: 'Bietet ihr DDoS-Schutz?',
      answer:
        'Ja. DDoS-Schutz ist in jedem Gameserver-Tarif ohne Aufpreis enthalten. Er ist immer aktiv, nicht etwas, das du erst einschalten oder später dazubuchen musst.',
    },
  },
  team: {
    'Liam Henry': {
      role: 'Gründer & CEO',
      bio: 'Jahre in der Hosting-Branche. Hat WSLATL gebaut, um Kunden die direkte Aufmerksamkeit zu geben, die sie verdienen.',
    },
    'Tyler Woollis': {
      role: 'Mitgründer & Mitinhaber',
      bio: 'Hält die Infrastruktur stabil. Wenn etwas kaputtgeht, weiß er es schon.',
    },
  },
  reviews: {
    title: 'Lies, was unsere Kunden sagen',
    body:
      'Jede Bewertung auf unserem öffentlichen Trustpilot-Profil ist echt. Wir bezahlen nicht dafür, wir filtern die schlechten nicht heraus, und wir verstecken auch die nicht, die wehtun.',
    ask: 'Schon bei uns gehostet? Eine ehrliche Bewertung hilft dem Nächsten bei der Entscheidung, ob wir passen.',
    cta: 'Unsere Bewertungen auf Trustpilot ansehen',
    learnMore: 'So funktioniert Trustpilot',
  },
  sla: {
    vps: { label: 'VPS-Hosting' },
    web: { label: 'Webhosting' },
    game: { label: 'Gameserver-Hosting' },
    dedicated: { label: 'Dedicated Server', target: "Nach bestem Bemühen, abhängig von Hardware und Verfügbarkeit des Rechenzentrums" },
  },
  pricing: {
    lines: {
      vps: {
        label: 'VPS',
        intro:
          'Isolierte Ressourcen und voller root-Zugriff, mit dem Betriebssystem deiner Wahl. Budget-Tarife laufen auf SATA SSD, Premium-Tarife auf NVMe mit hoch getakteten Ryzen 9 Kernen.',
        included: [
          'Voller root- und sudo-Zugriff',
          'Betriebssystem deiner Wahl',
          'Upgrades und Tarifwechsel erledigt ein Mensch',
          'Ein echter Mensch zum Reden, wenn etwas kaputtgeht',
        ],
      },
      game: {
        label: 'Gameserver',
        intro:
          'Diese Tarife sind nicht an ein Spiel gebunden. Wähl den RAM, den du brauchst, und betreib damit, was du willst. Wir kümmern uns um die meisten Titel, die einen Dedicated Server anbieten, darunter Minecraft, Rust, CS2, ARK, Valheim, FiveM und Palworld. Deins ist nicht dabei? Frag einfach. Wir können es fast immer betreiben.',
        included: [
          'Pterodactyl Control Panel',
          'DDoS-Schutz von Haus aus',
          'Volle Unterstützung für Mods und Plugins',
          'Einrichtung meistens noch am selben Tag',
          'Ein echter Mensch zum Reden, wenn etwas kaputtgeht',
        ],
      },
    },
    groups: {
      'budget-vps': {
        label: 'Budget VPS',
        description: 'Solider SATA-SSD-Speicher zu ehrlichen Preisen.',
        comparison: '10% unter Hosturly',
      },
      'premium-vps': {
        label: 'Premium VPS',
        description: 'NVMe-Laufwerke auf hoch getakteten Ryzen 9 Kernen. Leistung in der Praxis, nicht nur größere Zahlen.',
        comparison: '10% unter DigitalOcean',
      },
      'budget-game': {
        label: 'Budget-Gameserver',
        description: 'Gameserver auf SATA SSD. Meistens bist du noch am selben Tag online.',
        comparison: '10% unter Sparked',
      },
      'premium-game': {
        label: 'Premium-Gameserver',
        description: 'NVMe-Laufwerke und Ryzen 9 Kerne für den Fall, dass die Budget-Reihe nicht reicht.',
        comparison: '25% unter Sparked',
      },
    },
  },
  games: {
    minecraft: {
      tagline: 'Java, Bedrock, Paper, Spigot, Forge, Fabric: alles davon.',
      description:
        'Das Spiel, mit dem alle anfangen, und das, das einem Shared-Host am schnellsten entwächst. Vanilla, Paper für Performance, Forge oder Fabric für schwere Modpacks oder ein Bedrock-kompatibles Setup für Konsolen- und Handy-Spieler. Das entscheidet das Egg, nicht der Tarif.',
      popularFor: ['Survival mit Paper und Plugins', 'ATM9- und RLCraft-Modpacks', 'Bedrock-Crossplay-Server', 'Creative-Bauserver'],
      setups: ['1-5 Vanilla', '5-15 Paper/Spigot mit Plugins', '10-20 leicht gemoddet', 'Schwere Modpacks (RLCraft, ATM9)'],
      faqs: [
        {
          q: 'Kann ich einen gemoddeten Server wie RLCraft oder ATM9 betreiben?',
          a: 'Ja. Gemoddetes Minecraft ist speicherhungrig und profitiert vom NVMe-Speicher und den Ryzen 9 Kernen der Premium-Reihe, aber die Budget-Reihe stemmt leichte Modpacks problemlos.',
        },
        {
          q: 'Unterstützt ihr Bedrock-Spieler auf einem Java-Server?',
          a: 'Ja, über ein Geyser/Floodgate-kompatibles Egg, damit Java- und Bedrock/Konsolen-Spieler sich eine Welt teilen können.',
        },
      ],
    },
    rust: {
      tagline: 'Basenbau und PvP auf einem Server, der einen ganzen Wipe-Zyklus übersteht.',
      description:
        'Rust ist beim frischen Wipe gnadenlos zur Hardware, wenn die ganze Population auf einmal einsteigt. NVMe-Speicher hält Kartengenerierung und das Laden von Entities schnell, und wir unterstützen Oxide/uMod für Admin-Tools, Kits und Economy-Plugins.',
      popularFor: ['Server mit Oxide/uMod-Plugins', '2x/5x/10x gemoddete Wipes', 'Anpassung von Monumenten und Karte'],
      setups: ['25 Slots, gemoddet', '50 Slots, Vanilla oder leicht gemoddet', '100+ Slots, Oxide-Plugins'],
      faqs: [
        {
          q: 'Hält mein Server einen Wipe mit voller Population aus?',
          a: 'Die Premium-NVMe-Reihe ist genau dafür gebaut. Kartengenerierung und der Login-Ansturm am Wipe-Tag hängen an Speicher und CPU, und NVMe plus Ryzen 9 Kerne fangen beides besser ab als SATA-Tarife.',
        },
        {
          q: 'Wird Oxide/uMod unterstützt?',
          a: 'Ja, installier es genauso wie auf jedem anderen Rust-Server; die Maschine darunter gehört dir zum Konfigurieren.',
        },
      ],
    },
    'ark-survival-ascended': {
      tagline: 'ARK auf der Unreal Engine 5, mit dem RAM-Spielraum, den es wirklich braucht.',
      description:
        'ASA ist deutlich schwerer als das originale ARK, besonders mit Mods oder mehreren Karten in einem Cluster. Wir empfehlen, mit 8GB für eine einzelne Karte zu starten und von da aus hochzugehen, bevor du Mods dazunimmst.',
      popularFor: ['Cluster aus mehreren Karten', 'gemoddete Server mit erhöhten Raten', 'PvE-Tribe-Server'],
      setups: ['Eine Karte, kleiner Tribe', 'Eine Karte, voller Server', 'Cluster oder gemoddet'],
      faqs: [
        {
          q: 'Kann ich mehrere Karten zu einem Cluster verbinden?',
          a: 'Ja, jede Karte läuft als eigener Service und du verbindest sie genauso zu einem Cluster wie selbst gehostet; plan den RAM nur pro Karte ein, nicht pro Cluster.',
        },
      ],
    },
    'ark-survival-evolved': {
      tagline: 'Das Original, immer noch die Version, auf die die meisten Modpacks zielen.',
      description:
        'Immer noch die Version, für die die meisten großen Mod-Sammlungen (S+, Automated Ark, Classic Flyers) gebaut sind. Leichter beim RAM als Ascended und damit die verzeihendere Wahl für einen gemoddeten Cluster mit kleinem Budget.',
      popularFor: ['gemoddete Server mit S+ und Automated Ark', 'klassische Island/Ragnarok-Cluster'],
      setups: ['Eine Karte, kleiner Tribe', 'Eine Karte, gemoddet', 'Cluster aus mehreren Karten'],
      faqs: [
        {
          q: 'Unterstützt ihr Mods aus dem Steam Workshop?',
          a: 'Ja, Mods werden über die Steam-Workshop-ID installiert, genau wie auf einem selbst gehosteten Server.',
        },
      ],
    },
    valheim: {
      tagline: 'Wikinger-Koop-Survival, das leicht läuft, selbst bei voller Spielerzahl.',
      description:
        'Einer der einfacheren Survival-Titel zum Hosten. Eine kleine Crew läuft bequem auf der Einstiegsstufe, und selbst eine volle Boss-Session mit allen in einem Biom braucht selten mehr als einen mittleren Tarif.',
      popularFor: ['gemoddete Welten mit BepInEx', 'Koop in kleinen Freundesgruppen'],
      setups: ['2-5 Spieler', '5-10 Spieler, gemoddet (BepInEx)'],
      faqs: [
        {
          q: 'Wird BepInEx/Valheim Plus unterstützt?',
          a: 'Ja, installier BepInEx und jedes Plugin genauso wie auf einem selbst gehosteten Dedicated Server.',
        },
      ],
    },
    palworld: {
      tagline: 'Survival mit Kreaturensammeln, pro Spieler einer der schwereren neueren Titel.',
      description:
        'Der Dedicated Server von Palworld ist pro Spieler speicherhungriger als ältere Survival-Titel, und die Speicherdatei wächst mit einer belebten Basis schnell. Wir empfehlen, eher zum oberen Ende einer Stufe zu greifen, wenn viel gebaut werden soll.',
      popularFor: ['Koop-Server zum Basenbau', 'PvP-Gildenserver'],
      setups: ['1-8 Spieler', '16-32 Spieler'],
      faqs: [
        {
          q: 'Wie oft kommen Palworld-Updates, und geht mein Server davon kaputt?',
          a: 'Updates kommen häufig; wir halten das Server-Egg aktuell, sodass ein Neustart die neueste Version zieht, ohne dass du Dateien von Hand verwaltest.',
        },
      ],
    },
    '7-days-to-die': {
      tagline: 'Zombie-Survival mit Basenbau und Horde-Nächten.',
      description:
        'Ein voxelbasiertes Survival-Spiel, bei dem die echte Bedrohung die getaktete Horde-Nacht ist, nicht die herumlaufenden Zombies. Die Weltgenerierung beim ersten Start fordert CPU und Speicher, NVMe verkürzt diese Wartezeit also deutlich.',
      popularFor: ['PvE-Server für Horde-Nächte', 'gemoddete Overhaul-Packs'],
      setups: ['4-8 Spieler', '8-16 Spieler, gemoddet'],
      faqs: [
        {
          q: 'Dauert die Weltgenerierung lange?',
          a: 'Die Generierung beim ersten Start ist der schwerste Moment für dieses Spiel; die NVMe-Stufe verkürzt sie spürbar gegenüber SATA-Speicher.',
        },
      ],
    },
    'project-zomboid': {
      tagline: 'Isometrisches Zombie-Survival, bewusst brutal.',
      description:
        'Ein langsameres, hartes Survival-Spiel, in dem der Tod endgültig ist und die Karte riesig. Mods (und davon gibt es tausende) kosten echte Leistung, plan also mehr RAM ein, wenn deine Gruppe eine schwere Modliste fährt.',
      popularFor: ['stark gemoddete Survival-Server', 'Roleplay-Communities'],
      setups: ['1-4 Spieler, Vanilla', '8-16 Spieler, gemoddet'],
      faqs: [
        {
          q: 'Kann ich eine große Workshop-Modliste fahren?',
          a: 'Ja. Workshop-Mods werden unterstützt; richte den RAM nur nach deiner Modliste aus, nicht nach der Vanilla-Empfehlung.',
        },
      ],
    },
    'conan-exiles': {
      tagline: 'Brutales Open-World-Survival im Hyborischen Zeitalter.',
      description:
        'Basenbau, Clans und eine große offene Karte, die echte Ressourcen braucht, um gut gehostet zu werden, sobald sich ein Server mit von Spielern gebauten Bauwerken füllt.',
      popularFor: ['PvP-Server für Clans', 'baulastiges PvE'],
      setups: ['10-20 Spieler', '30-40 Spieler'],
      faqs: [],
    },
    'the-forest': {
      tagline: 'Koop-Survival-Horror auf einer von Kannibalen bewohnten Insel.',
      description:
        'Ein angespanntes Koop-Survival-Horrorspiel. Ein Dedicated Server hält die Welt bestehen, egal ob der Host online ist, und genau darum geht es einer Gruppe, die zu unterschiedlichen Zeiten spielt.',
      popularFor: ['kleine Koop-Survival-Gruppen'],
      setups: ['2-4 Spieler'],
      faqs: [],
    },
    'sons-of-the-forest': {
      tagline: 'Der größere, hübschere Nachfolger von The Forest.',
      description:
        'Die Dedicated-Server-Komponente kam erst nach dem Early-Access-Start und ist seitdem gereift; eine dauerhafte Welt ist der Hauptgrund, warum Gruppen vom Peer-Hosting wegziehen.',
      popularFor: ['dauerhafte Koop-Survival-Welten'],
      setups: ['2-6 Spieler'],
      faqs: [],
    },
    enshrouded: {
      tagline: 'Voxel-Survival-Action mit echtem Basenbau.',
      description:
        'Ein neuerer Voxel-Survival-Titel, der Action-Kampf mit tiefem Basenbau verbindet. Die serverseitigen Voxel-Daten des Geländes summieren sich schnell, wenn ein fleißiger Baumeister in der Gruppe ist.',
      popularFor: ['Koop-Basenbau', 'Gruppen mit Fokus auf Bosse'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    'v-rising': {
      tagline: 'Vampir-Survival mit Burgenbau und PvP.',
      description:
        'Gotisches Vampir-Survival mit Echtzeit-PvP und Burgbelagerungen. Die Leistung bleibt auch auf bescheidenen Specs flüssig, bis sich ein Server mit aufwendigen Burgen füllt.',
      popularFor: ['PvP-Server mit Burgbelagerungen', 'PvE-Clanserver'],
      setups: ['10-20 Spieler', '40 Spieler'],
      faqs: [],
    },
    terraria: {
      tagline: '2D-Sandbox-Abenteuer, unverschämt leicht zu hosten.',
      description:
        'Eines der leichtesten Spiele auf dieser ganzen Liste. TShock und andere Mod-Frameworks bringen Admin-Tools mit, ohne nennenswert Last zu erzeugen.',
      popularFor: ['Community-Server mit TShock'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    starbound: {
      tagline: 'Terrarias geistiger Verwandter, im Weltraum.',
      description:
        'Eine Sci-Fi-Sandbox aus derselben Familie wie Terraria. Auch mit einer kleinen Gruppe und ein paar Mods leichtgewichtig im Betrieb.',
      popularFor: ['gemoddete Erkundungsserver'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    craftopia: {
      tagline: 'Open-World-Survival-Crafting vom Palworld-Team.',
      description:
        'Schnelles Crafting und Bauen in einer offenen Welt, mit einer langen Feature-Liste. Läuft für eine kleine Gruppe bequem auf einem mittleren Tarif.',
      popularFor: ['kleine Koop-Crafting-Gruppen'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    'core-keeper': {
      tagline: 'Unterirdische Sandbox mit Bergbau und Erkundung.',
      description:
        'Eine gemütliche unterirdische Bergbau-Sandbox, die selbst dann leicht bleibt, wenn eine volle Gruppe gleichzeitig verschiedene Ecken der Welt erkundet.',
      popularFor: ['Koop-Erkundungsserver'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    necesse: {
      tagline: 'Sandbox-Survival aus der Draufsicht, mit echter Basisverteidigung.',
      description:
        'Ein kleinerer Sandbox-Survival-Titel mit Siedlungsbau und Wellen im Tower-Defense-Stil. Bescheidene Ansprüche an die Hardware.',
      popularFor: ['Koop mit Siedlungsbau'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    icarus: {
      tagline: 'Sessionbasiertes Survival auf einer feindseligen fremden Welt.',
      description:
        'Sessionbasiertes Survival, bei dem jeder Abstieg eine eigene Instanz ist. Dediziertes Hosting hält eine Session für eine Gruppe am Laufen, ohne dass der PC einer Person sie tragen muss.',
      popularFor: ['sessionbasierte Koop-Gruppen'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    grounded: {
      tagline: 'Survival im Hinterhof, auf Insektengröße.',
      description:
        'Obsidians geschrumpftes Survival-Spiel im Hinterhof. Ein Dedicated Server hält die Welt für eine Familie oder Freundesgruppe über verschiedene Spielsessions hinweg am Leben.',
      popularFor: ['Koop für Familien und kleine Gruppen'],
      setups: ['2-4 Spieler'],
      faqs: [],
    },
    scum: {
      tagline: 'Hardcore-Open-World-Survival mit tiefer Charaktersimulation.',
      description:
        'Einer der anspruchsvolleren Survival-Titel auf dieser Liste: die detaillierte Stoffwechsel- und Fahrzeugsimulation erzeugt bei höheren Spielerzahlen echte Last auf dem Server.',
      popularFor: ['große Open-World-PvP-Server'],
      setups: ['10-20 Spieler', '40-64 Spieler'],
      faqs: [],
    },
    astroneer: {
      tagline: 'Entspannte Koop-Weltraumerkundung und Basenbau.',
      description:
        'Ein stressfreies Koop-Spiel zum Erkunden und Bauen auf mehreren Planeten. Läuft für eine kleine Gruppe bequem mit bescheidenen Ressourcen.',
      popularFor: ['entspanntes Koop-Bauen'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    stationeers: {
      tagline: 'Systemtiefes Survival beim Bau einer Raumstation.',
      description:
        'Ein simulationslastiges Bauspiel darum, Atmosphäre, Strom und Logistik einer Raumstation am Laufen zu halten. Die CPU zählt hier mehr als bei den meisten Titeln dieser Liste.',
      popularFor: ['Koop mit Technik-Fokus'],
      setups: ['2-6 Spieler'],
      faqs: [],
    },
    empyrion: {
      tagline: 'Weltraum-Survival, Bauen und Erkunden.',
      description:
        'Ein Survival- und Bauspiel im All mit von Spielern gebauten Schiffen und Basen auf mehreren Planeten. Die Weltgröße wächst mit der Spielzeit, plan den Speicher also entsprechend.',
      popularFor: ['Mehrspieler-Server zum Schiffsbau'],
      setups: ['2-8 Spieler'],
      faqs: [],
    },
    'vintage-story': {
      tagline: 'Tiefes, realistisches Survival mit echter Metallurgie und Landwirtschaft.',
      description:
        'Eine langsamere, stärker von Simulation getriebene Survival-Sandbox im Minecraft-artigen Genre, gemacht für Spieler, die echte Tiefe beim Crafting wollen. Leichtgewichtig im Hosting.',
      popularFor: ['Communities für realistisches Survival'],
      setups: ['2-10 Spieler'],
      faqs: [],
    },
    barotrauma: {
      tagline: 'U-Boot-Crew-Survival, halb Simulation, halb Horror.',
      description:
        'Eine 2D-Simulation einer U-Boot-Crew mit echter Systemverwaltung (Reaktoren, Lecks im Rumpf, feindselige Kreaturen). Dediziertes Hosting hält Runs am Laufen, ohne dass die Verbindung des Hosts zum einzigen Schwachpunkt wird.',
      popularFor: ['Koop-Sessions mit fester Crew'],
      setups: ['4-8 Spieler'],
      faqs: [],
    },
    eco: {
      tagline: 'Gemeinsames Survival rund um eine geteilte Wirtschaft.',
      description:
        'Ein Aufbauspiel um eine Zivilisation, bei dem es ganz um eine gemeinsame Wirtschaft und ein gemeinsames Ökosystem geht. Läuft mit mehr RAM am besten, je größer Welt und Spielerzahl werden.',
      popularFor: ['Server für Zivilisation und Wirtschaft'],
      setups: ['10-20 Spieler'],
      faqs: [],
    },
    'don-t-starve-together': {
      tagline: 'Koop-Survival im gotischen Zeichenstil von Klei.',
      description:
        "Die Mehrspieler-Variante von Don't Starve. Sehr leicht zu hosten, selbst bei voller Lobby, und Mods kosten kaum Leistung.",
      popularFor: ['gemoddete Koop-Welten'],
      setups: ['2-6 Spieler'],
      faqs: [],
    },
    factorio: {
      tagline: 'Automatisierung und Fabrikbau, berüchtigt CPU-lastig.',
      description:
        'Ein Spiel über Fabrikautomatisierung, dessen Basen im späten Spiel bekanntlich die CPU fordern, je mehr Bänder und Maschinen dazukommen. Dieser Titel profitiert also mehr als die meisten von den schnelleren Ryzen 9 Kernen unserer Premium-Reihe.',
      popularFor: ['langlebige Automatisierungsserver'],
      setups: ['2-8 Spieler, frühes Spiel', 'große Fabriken im späten Spiel'],
      faqs: [
        {
          q: 'Warum braucht Factorio schnellere Kerne mehr als RAM?',
          a: 'Die Simulation von Factorio läuft in einem einzigen Thread und ist CPU-gebunden, je größer deine Fabrik wird. Ein Tarif mit starkem Takt pro Kern (unsere Ryzen 9 Premium-Reihe) hält die UPS also länger stabil, als es mehr RAM täte.',
        },
      ],
    },
    muck: {
      tagline: 'Schnelles, chaotisches Roguelike-Survival im Koop.',
      description:
        'Ein Roguelike-Survival-Spiel für kurze Sessions, gemacht für kurze, chaotische Koop-Runs. Minimale Ansprüche ans Hosting.',
      popularFor: ['Koop-Gruppen für kurze Sessions'],
      setups: ['2-4 Spieler'],
      faqs: [],
    },
    unturned: {
      tagline: 'Kostenloses klötzchenhaftes Zombie-Survival mit riesiger Modding-Szene.',
      description:
        'Eine kostenlose, klötzchenhafte Zombie-Survival-Sandbox mit aktiver Workshop-Modding-Szene über die Plugin-Frameworks Rocket und Unturned 3.x.',
      popularFor: ['Roleplay-Server mit Rocket-Mods'],
      setups: ['10-24 Spieler', '32+ Spieler, gemoddet'],
      faqs: [],
    },
    cs2: {
      tagline: 'Kompetitives und lockeres CS2, mit Platz für Community-Plugins.',
      description:
        'Geringer Ressourcenverbrauch pro Spieler, die eigentliche Frage ist also die Tick-Stabilität unter Last. Unsere NVMe-Reihe hält die Tickrate für einen vollen Server mit 10-32 Spielern stabil, und Plugin-Stacks mit CounterStrikeSharp / MetaMod werden voll unterstützt.',
      popularFor: ['5v5-Server zum kompetitiven Üben', 'Community-Deathmatch/Surf/Retake', 'Plugin-Stacks mit CounterStrikeSharp'],
      setups: ['10-16 Spieler, reines Competitive', '24-32 Spieler, Community und Plugins'],
      faqs: [
        {
          q: 'Kann ich CounterStrikeSharp- / MetaMod-Plugins betreiben?',
          a: 'Ja, installier sie genauso wie auf jedem CS2 Dedicated Server; am Panel liegt es nicht.',
        },
      ],
    },
    'team-fortress-2': {
      tagline: 'Läuft immer noch stark, vor allem mit SourceMod-Plugins aus der Community.',
      description:
        'Ein langlebiger Shooter auf der Source-Engine mit einem tiefen SourceMod/MetaMod-Plugin-Ökosystem, das von Jump-Maps bis zu komplett eigenen Spielmodi alles abdeckt.',
      popularFor: ['SourceMod-Community-Server', 'Jump- und Surf-Maps'],
      setups: ['24 Spieler', '32 Spieler, pluginlastig'],
      faqs: [],
    },
    'left-4-dead-2': {
      tagline: 'Koop-Zombieschießen mit riesiger Bibliothek eigener Kampagnen.',
      description:
        'Koop-Zombie-Survival auf der Source-Engine mit tausenden Community-Kampagnen und Mods über den Workshop.',
      popularFor: ['Server für eigene Kampagnen', 'Community-Server im Versus-Modus'],
      setups: ['4-8 Spieler'],
      faqs: [],
    },
    'garrys-mod': {
      tagline: 'DarkRP, TTT, Sandbox: was deine Community eben wirklich spielt.',
      description:
        'Weniger ein einzelnes Spiel als eine Plattform. DarkRP und TTT sind die beiden schwersten, am stärksten von Addons abhängigen Spielmodi, die wir sehen, und beide profitieren von mehr RAM, sobald die Workshop-Sammlung eines Servers über ein paar hundert Einträge hinauswächst.',
      popularFor: ['DarkRP-Roleplay-Server', 'TTT und Murder', 'Sandbox-Bauserver'],
      setups: ['Sandbox, kleine Gruppe', 'DarkRP/TTT, 20-40 Spieler'],
      faqs: [
        {
          q: 'Kann ich eine große DarkRP-Workshop-Sammlung betreiben?',
          a: 'Ja. Workshop-Sammlungen werden unterstützt, und genau deshalb profitieren DarkRP-Server von mehr RAM, als das Grundspiel braucht.',
        },
      ],
    },
    squad: {
      tagline: 'Groß angelegte taktische Gefechte der verbundenen Waffen.',
      description:
        'Squad gehört bei voller Kapazität von 100 Spielern zu den schwereren taktischen Shootern im Hosting, weil Fahrzeug- und Großkartensimulation echte CPU-Last erzeugen.',
      popularFor: ['große Server für verbundene Waffen'],
      setups: ['Server mit 50 Spielern', 'Server mit 100 Spielern'],
      faqs: [],
    },
    'insurgency-sandstorm': {
      tagline: 'Straffer, harter taktischer Squad-Kampf.',
      description:
        'Ein taktischer Shooter mit Checkpoint-Modus, dessen Fußabdruck auf dem Server kleiner und handlicher ist als bei den meisten großen Militärshootern.',
      popularFor: ['Koop-Checkpoint-Server', 'kompetitives Versus'],
      setups: ['8-16 Spieler'],
      faqs: [],
    },
    'killing-floor-2': {
      tagline: 'Koop-Horden-Shooter-Chaos.',
      description:
        'Wellenbasiertes Koop-Ballern auf Zeds. Bescheidene Ansprüche selbst bei voller Lobby mit 6 Spielern und aktivierten Mutatoren.',
      popularFor: ['gemoddete Server im Horden-Modus'],
      setups: ['6 Spieler'],
      faqs: [],
    },
    'arma-3': {
      tagline: 'Open-World-Militärsimulation mit tiefem Missions-Scripting.',
      description:
        'Hochgradig moddbare Militärsimulation, deren eigentliche Kosten von der Komplexität der Mission und der Zahl der Mods kommen, nicht von der reinen Spielerzahl: eine gescriptete Zeus-Mission mit 40 Spielern kann schwerer wiegen als ein schlichtes TvT mit 80.',
      popularFor: ['Milsim-Communities', 'Zeus- und King-of-the-Hill-Missionen'],
      setups: ['20-40 Spieler, leichte Mods', 'Stark gemoddete/gescriptete Missionen'],
      faqs: [],
    },
    'arma-reforger': {
      tagline: 'Militärsimulation auf der Enfusion-Engine, das moderne Arma-Testfeld.',
      description:
        'Der neuere, schlankere Teil der Arma-Reihe, gebaut auf der Enfusion-Engine, die irgendwann Arma 4 antreiben wird. Wird aktiv weiterentwickelt, mit wachsender Unterstützung für Mods.',
      popularFor: ['Server für Conflict und Combat Ops'],
      setups: ['32-64 Spieler'],
      faqs: [],
    },
    'no-more-room-in-hell': {
      tagline: 'Kostenloser Koop-Survival-Horror auf der Source-Engine.',
      description:
        'Ein kostenloser, angespannter Koop-Zombie-Survival-Horror-Shooter auf Basis von Source. Leicht bei den Serverressourcen.',
      popularFor: ['Koop-Horror-Szenarien'],
      setups: ['8 Spieler'],
      faqs: [],
    },
    mordhau: {
      tagline: 'Mittelalterlicher Nahkampf in großem Maßstab.',
      description:
        'Groß angelegter Nahkampf mit physikgetriebenem Schwertkampf. Die Serverlast wächst vor allem mit Spielerzahl und Kartengröße.',
      popularFor: ['große Server für Nahkampfschlachten'],
      setups: ['32-64 Spieler'],
      faqs: [],
    },
    fivem: {
      tagline: 'GTA V Roleplay-Server, von der kleinen Crew bis zur ganzen Stadt.',
      description:
        'Roleplay-Communities stehen und fallen mit der Zahl der Resources und der Datenbankleistung, nicht nur mit den Spielerslots. Eine volle ESX/QBCore-Stadt mit echter Wirtschaft, eigenen Jobs und MySQL-gestützter Persistenz braucht deutlich mehr, als das Minimum des Frameworks vermuten lässt.',
      popularFor: ['ESX- und QBCore-Roleplay-Städte', 'eigene Job- und Economy-Skripte', 'Communities mit Whitelist'],
      setups: ['Kleine Crew, Basis-Framework', 'ESX/QBCore-Stadt, 32-64 Slots', 'Große Stadt, 100+ Slots, schwere Skripte'],
      faqs: [
        {
          q: 'Unterstützt ihr ESX oder QBCore ab Werk?',
          a: 'Das Basis-Framework installiert sich genauso wie auf jeder anderen FiveM-Maschine; wir binden dich an keines von beiden.',
        },
        {
          q: 'Kann ich für die Wirtschaft eine externe MySQL-Datenbank anbinden?',
          a: 'Ja, eine Roleplay-Stadt betreibt für die Persistenz typischerweise ihre eigene MySQL/MariaDB-Instanz, und die lässt sich ganz normal anbinden.',
        },
      ],
    },
    beammp: {
      tagline: 'Mehrspieler-Sessions in BeamNG.drive.',
      description:
        'BeamMP bringt dauerhaften Mehrspieler in die Weichkörper-Fahrzeugsimulation von BeamNG.drive. Serverseitig leichtgewichtig, weil die Physik beim Client läuft.',
      popularFor: ['Community-Server zum Fahren und Crashen'],
      setups: ['4-16 Spieler'],
      faqs: [],
    },
    satisfactory: {
      tagline: 'Fabrikbau in einem Maßstab, der irgendwann einen echten Server braucht.',
      description:
        'Der Dedicated Server Mode verlagert die Simulation komplett weg vom PC eines Spielers, und das zählt, sobald sich eine Fabrik über die Karte zieht, also genau dann, wenn ein lokaler Host anfängt zu stocken. CPU-Spielraum zählt hier genauso viel wie RAM.',
      popularFor: ['dauerhafte Koop-Fabriken mit Megabasen'],
      setups: ['1-4 Spieler, frühes Spiel', 'Große Fabriken im späten Spiel'],
      faqs: [
        {
          q: 'Läuft die Welt weiter, wenn sich alle ausloggen?',
          a: 'Ja, genau darum geht es beim Dedicated Server Mode: Die Fabrik simuliert weiter und der PC eines einzelnen Spielers muss die Session nicht tragen.',
        },
      ],
    },
    'space-engineers': {
      tagline: 'Physikgetriebener Schiffs- und Stationsbau im All.',
      description:
        'Ein voxelbasierter Weltraum-Bau-Simulator, bei dem die Physiksimulation großer Schiffe die eigentliche Serverlast ausmacht, nicht die Spielerzahl. Die CPU zählt mehr als bei den meisten Sandbox-Titeln.',
      popularFor: ['Survival- und Creative-Bauserver'],
      setups: ['4-8 Spieler', 'große Mehrspielerwelten'],
      faqs: [],
    },
    dayz: {
      tagline: 'Hartes Open-World-Survival-PvP auf der Karte Chernarus (und Mods).',
      description:
        'Ein harter Open-World-Survival-Shooter mit riesiger Modding-Szene (CF, Namalsk und dutzende Overhaul-Mods), die jeweils echten zusätzlichen Speicherbedarf über das Grundspiel hinaus mitbringen.',
      popularFor: ['gemoddete Community-Server', 'harte Vanilla-Plus-Server'],
      setups: ['Vanilla, 40-60 Spieler', 'Stark gemoddet (CF, eigene Karten)'],
      faqs: [
        {
          q: 'Kann ich eigene Karten wie Namalsk oder Deer Isle betreiben?',
          a: 'Ja, Mods für eigene Karten funktionieren genauso wie auf einem selbst gehosteten DayZ-Server. Richte den RAM nur nach der Modliste aus, nicht nach der Vanilla-Basis.',
        },
      ],
    },
    atlas: {
      tagline: 'Piraten-MMO-Survival im ganz großen Maßstab.',
      description:
        'Ein weitläufiges Piraten-Survival-MMO auf Basis der ARK-Engine, das ein riesiges Ozean-Raster umspannt. Bei vollem Raster einer der anspruchsvolleren Titel hier.',
      popularFor: ['von Companys betriebene Piratenserver'],
      setups: ['Eine Rasterzelle', 'Volles Raster aus mehreren Zellen'],
      faqs: [],
    },
  },
  ramLabels: {
    "16GB+ per map": "16GB+ pro Map",
    "8GB+ per map": "8GB+ pro Map",
    "4-8GB, CPU speed matters more": "4-8GB, der CPU-Takt zählt mehr",
    "16GB+ total": "16GB+ insgesamt",
  },
  gameCategories: {
    'Survival & Sandbox': 'Survival & Sandbox',
    'Shooters & Tactical': 'Shooter & Taktik',
    'Roleplay & Platforms': 'Roleplay & Plattformen',
    'Building & Simulation': 'Bauen & Simulation',
    'Zombie & PvP': 'Zombie & PvP',
  },
  legal: {
    privacy: {
      label: 'Datenschutzerklärung',
      title: 'Datenschutzerklärung',
      metaDescription: 'Wie WSLATL LLC deine personenbezogenen Daten erhebt, nutzt und schützt.',
      intro:
        'Wir erheben nur, was wir zum Betrieb deiner Services brauchen. Wir verkaufen deine Daten nicht, niemals. Hier steht genau, was wir mit den Informationen machen, die du uns gibst.',
    },
    terms: {
      label: 'Nutzungsbedingungen',
      title: 'Nutzungsbedingungen',
      metaDescription: 'Die Bedingungen, die für deine Nutzung der Hosting-Services von WSLATL LLC gelten.',
      intro:
        'Diese Bedingungen gelten für deine Nutzung aller Services von WSLATL LLC. Bitte lies sie sorgfältig, bevor du unsere Services nutzt. Mit der Nutzung eines WSLATL Service stimmst du diesen Bedingungen zu.',
    },
    acceptableUse: {
      label: 'Zulässige Nutzung',
      title: 'Richtlinie zur zulässigen Nutzung',
      metaDescription: 'Was auf der Hosting-Infrastruktur von WSLATL LLC erlaubt ist und was nicht.',
      intro:
        'Unsere Infrastruktur teilen sich mehrere Kunden. Ein Störenfried trifft alle. Diese Richtlinie legt fest, was auf WSLATL Servern akzeptabel ist und was nicht. Lies sie. Halte dich daran. Wir setzen sie durch.',
    },
    abuse: {
      label: 'Missbrauchsrichtlinie',
      title: 'Missbrauchsrichtlinie',
      metaDescription:
        'Wie du Missbrauch der Infrastruktur von WSLATL LLC meldest (Spam, Netzwerkangriffe, Phishing, Malware, illegale Inhalte) und wie wir mit Meldungen umgehen.',
      intro:
        'Wie du Missbrauch der WSLATL Infrastruktur meldest, was wir mit einer Meldung machen, sobald sie bei uns ist, und wie wir mit Services umgehen, von denen der Missbrauch ausgeht.',
    },
    refund: {
      label: 'Erstattungsrichtlinie',
      title: 'Erstattungsrichtlinie',
      metaDescription:
        'Wie WSLATL LLC mit Erstattungsanfragen umgeht, inklusive der Fristen von 48 Stunden und 14 Tagen, der anerkannten Gründe und der nicht erstattungsfähigen Posten.',
      intro:
        'Wir halten unsere Erstattungsrichtlinie einfach. 48 Stunden ohne Angabe von Gründen. 14 Tage bei echten Problemen. Weiter unten steht genau, was erstattungsfähig ist und was nicht.',
    },
    sla: {
      label: 'Service Level Agreement',
      title: 'Service Level Agreement',
      metaDescription:
        'Uptime-Ziele von WSLATL LLC nach Servicetyp, Ankündigung geplanter Wartungen und wie du eine Servicegutschrift geltend machst.',
      intro:
        'Unsere Uptime-Ziele nach Servicetyp, wie wir mit Wartungen umgehen und die Servicegutschrift, die du verlangen kannst, wenn wir ein Ziel verfehlen. Das gibt Abschnitt 5 unserer Nutzungsbedingungen wieder.',
    },
    dmca: {
      label: 'DMCA-Richtlinie',
      title: 'DMCA-Richtlinie',
      metaDescription:
        'Wie du bei WSLATL LLC eine urheberrechtliche Beschwerde oder eine Gegendarstellung einreichst, und unsere Richtlinie zu wiederholten Verstößen nach 17 U.S.C. 512.',
      intro:
        'Wie du Urheberrechtsverletzungen auf WSLATL Infrastruktur meldest, wie ein Kunde einer Entfernung widerspricht und was mit Konten passiert, die wiederholt Rechte verletzen.',
    },
    accountCredit: {
      label: 'Guthaben',
      title: 'Bedingungen für Guthaben',
      metaDescription:
        'Wie Guthaben bei WSLATL LLC funktioniert: Guthaben kaufen, auf Rechnungen anrechnen, einem anderen Konto schenken und wofür es verwendet werden kann und wofür nicht.',
      intro:
        'Guthaben ist im Voraus bezahlter Wert, den du für WSLATL Services ausgibst. Es verfällt nicht und ist nicht in Bargeld auszahlbar. Hier steht genau, wie es funktioniert.',
    },
    subprocessors: {
      label: 'Unterauftragsverarbeiter',
      title: 'Unterauftragsverarbeiter',
      metaDescription:
        'Die Dritten, die personenbezogene Daten im Auftrag von WSLATL LLC verarbeiten, was jeder von ihnen erhält und wie internationale Übermittlungen gehandhabt werden.',
      intro:
        'Jeder Dritte, der in unserem Auftrag personenbezogene Daten anfasst, was er bekommt und warum. Namentlich genannt, nicht nur nach Kategorie.',
    },
    backups: {
      label: 'Backups',
      title: 'Backup-Richtlinie',
      metaDescription:
        'Was WSLATL LLC sichert, warum Backups nach bestem Bemühen erfolgen, warum du eigene Kopien behalten solltest und wie du eine Wiederherstellung anforderst.',
      intro:
        'Was wir sichern, was ein Backup ist und was nicht, und warum du trotzdem eigene Kopien behalten solltest. Dazu, wie du eine Wiederherstellung anforderst.',
    },
  },
}

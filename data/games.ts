import { siteConfig } from '@/config/site'

export interface RamRow {
  players: string
  ram: string
}

export interface GameFaq {
  q: string
  a: string
}

export interface GameEntry {
  slug: string
  name: string
  category: string
  tagline: string
  description: string
  recommendedRam: RamRow[]
  popularFor: string[]
  faqs: GameFaq[]
}

/**
 * Every game below runs on the same RAM-tier plans described in
 * data/pricing.ts (the "game" tab): you are not buying a Minecraft plan or a
 * Rust plan, you are buying RAM and cores, and you can point Pterodactyl at
 * whichever egg the game needs. That's a real, accurate claim (see the note
 * on the pricing page's game tab), so a dedicated landing page per game is
 * describing a real, working purchase path, not promising something the
 * panel can't deliver. Games rotate faster than this file will realistically
 * be revisited, so keep entries here honest and specific rather than padding
 * the list with titles nobody actually asks us to run.
 */
export const games: GameEntry[] = [
  // ── Survival & sandbox ──────────────────────────────────────────────
  {
    slug: 'minecraft',
    name: 'Minecraft',
    category: 'Survival & Sandbox',
    tagline: 'Java, Bedrock, Paper, Spigot, Forge, Fabric — all of it.',
    description:
      "The one everyone starts with, and the one most likely to outgrow a shared host. Vanilla, Paper for performance, Forge or Fabric for heavy modpacks, or a Bedrock-compatible setup for console and mobile players — the egg decides, not the plan.",
    recommendedRam: [
      { players: '1-5 vanilla', ram: '2-4GB' },
      { players: '5-15 Paper/Spigot with plugins', ram: '4-8GB' },
      { players: '10-20 lightly modded', ram: '8GB' },
      { players: 'Heavy modpacks (RLCraft, ATM9)', ram: '12-16GB' },
    ],
    popularFor: ['Paper + plugin survival', 'ATM9 and RLCraft modpacks', 'Bedrock cross-play servers', 'creative build servers'],
    faqs: [
      { q: 'Can I run a modded server like RLCraft or ATM9?', a: 'Yes. Modded Minecraft is memory-hungry and benefits from the extra vCores on the Premium NVMe tier, but the Budget tier runs light modpacks fine.' },
      { q: 'Do you support Bedrock players on a Java server?', a: 'Yes, via a Geyser/Floodgate-compatible egg, so Java and Bedrock/console players can share one world.' },
    ],
  },
  {
    slug: 'rust',
    name: 'Rust',
    category: 'Survival & Sandbox',
    tagline: 'Base building and PvP on a server that survives a full wipe cycle.',
    description:
      "Rust is unforgiving on hardware during a fresh wipe when the whole population loads in at once. NVMe storage keeps map generation and entity loading fast, and we support Oxide/uMod for admin tools, kits, and economy plugins.",
    recommendedRam: [
      { players: '25-cap modded', ram: '4-6GB' },
      { players: '50-cap vanilla or lightly modded', ram: '6-8GB' },
      { players: '100+ cap, Oxide plugins', ram: '8-16GB' },
    ],
    popularFor: ['Oxide/uMod plugin servers', '2x/5x/10x modded wipes', 'monument and map customization'],
    faqs: [
      { q: 'Will my server handle a full-population wipe?', a: 'The Premium NVMe tier is built for this — map generation and the wipe-day login spike are storage and CPU bound, and NVMe plus Ryzen 9 cores absorb both better than SATA plans.' },
      { q: 'Is Oxide/uMod supported?', a: 'Yes, install it the same way you would on any Rust server; the underlying box is yours to configure.' },
    ],
  },
  {
    slug: 'ark-survival-ascended',
    name: 'ARK: Survival Ascended',
    category: 'Survival & Sandbox',
    tagline: 'Unreal Engine 5 ARK, with the RAM headroom it actually needs.',
    description:
      "ASA is considerably heavier than the original ARK, especially with mods or multiple maps clustered together. We recommend starting at 8GB for a single map and scaling up from there before you add mods.",
    recommendedRam: [
      { players: 'Single map, small tribe', ram: '6-8GB' },
      { players: 'Single map, full server', ram: '8-12GB' },
      { players: 'Clustered maps or modded', ram: '16GB+ per map' },
    ],
    popularFor: ['clustered multi-map setups', 'modded boosted-rate servers', 'PvE tribe servers'],
    faqs: [
      { q: 'Can I cluster multiple maps together?', a: 'Yes, each map runs as its own service and you link them into a cluster the same way you would self-hosted; just budget RAM per map, not per cluster.' },
    ],
  },
  {
    slug: 'ark-survival-evolved',
    name: 'ARK: Survival Evolved',
    category: 'Survival & Sandbox',
    tagline: 'The original, still the one most mod packs target.',
    description:
      "Still the version most of the big mod collections (S+, Automated Ark, Classic Flyers) are built for. Lighter on RAM than Ascended, so it's the more forgiving option for a modded cluster on a budget.",
    recommendedRam: [
      { players: 'Single map, small tribe', ram: '4-6GB' },
      { players: 'Single map, modded', ram: '8GB' },
      { players: 'Clustered maps', ram: '8GB+ per map' },
    ],
    popularFor: ['S+ and Automated Ark modded servers', 'classic Island/Ragnarok clusters'],
    faqs: [
      { q: 'Do you support Steam Workshop mods?', a: 'Yes, mods install through the Steam Workshop ID the same way as a self-hosted server.' },
    ],
  },
  {
    slug: 'valheim',
    name: 'Valheim',
    category: 'Survival & Sandbox',
    tagline: 'Viking co-op survival that runs light, even at full player count.',
    description:
      "One of the easier survival titles to host — a small crew runs comfortably on the entry tier, and even a full boss-raid session with everyone loaded into one biome rarely needs more than a mid-range plan.",
    recommendedRam: [
      { players: '2-5 players', ram: '2-4GB' },
      { players: '5-10 players, modded (BepInEx)', ram: '4-6GB' },
    ],
    popularFor: ['BepInEx modded worlds', 'small friend-group co-op'],
    faqs: [
      { q: 'Is BepInEx/Valheim Plus supported?', a: 'Yes, install BepInEx and any plugin the same way as a self-hosted dedicated server.' },
    ],
  },
  {
    slug: 'palworld',
    name: 'Palworld',
    category: 'Survival & Sandbox',
    tagline: 'Creature-collecting survival, one of the heavier newer titles per player.',
    description:
      "Palworld's dedicated server is memory-hungry per player compared to older survival titles, and save file size grows fast with a busy base. We recommend erring toward the higher end of a tier if you expect a lot of building.",
    recommendedRam: [
      { players: '1-8 players', ram: '6-8GB' },
      { players: '16-32 players', ram: '12-16GB' },
    ],
    popularFor: ['co-op base-building servers', 'PvP guild servers'],
    faqs: [
      { q: 'How often does Palworld update, and does that break my server?', a: 'Updates are frequent; we keep the server egg current so a restart picks up the latest version without you managing files by hand.' },
    ],
  },
  { slug: '7-days-to-die', name: '7 Days to Die', category: 'Survival & Sandbox', tagline: 'Zombie survival with base building and horde nights.', description: 'A voxel-based survival game where the real threat is the timed horde night, not the wandering zombies. World generation is CPU and storage heavy on first boot, so NVMe cuts that wait significantly.', recommendedRam: [{ players: '4-8 players', ram: '4-6GB' }, { players: '8-16 players, modded', ram: '8GB' }], popularFor: ['horde-night PvE servers', 'modded overhaul packs'], faqs: [{ q: 'Does world generation take long?', a: 'First-boot generation is the heaviest moment for this game; the NVMe tier noticeably shortens it compared to SATA storage.' }] },
  { slug: 'project-zomboid', name: 'Project Zomboid', category: 'Survival & Sandbox', tagline: 'Isometric zombie survival, brutal by design.', description: 'A slower-paced, punishing survival game where death is permanent and the map is enormous. Mods (and there are thousands) add real overhead, so budget extra RAM if your group runs a heavy modlist.', recommendedRam: [{ players: '1-4 players, vanilla', ram: '2-4GB' }, { players: '8-16 players, modded', ram: '6-8GB' }], popularFor: ['heavily modded survival servers', 'roleplay communities'], faqs: [{ q: 'Can I run a big Workshop modlist?', a: 'Yes — Workshop mods are supported, just size RAM to your modlist rather than the vanilla recommendation.' }] },
  { slug: 'conan-exiles', name: 'Conan Exiles', category: 'Survival & Sandbox', tagline: 'Brutal open-world survival in the Hyborian Age.', description: 'Base building, clans, and a big open map that takes real resources to host well once a server fills up with player-built structures.', recommendedRam: [{ players: '10-20 players', ram: '6-8GB' }, { players: '30-40 players', ram: '10-12GB' }], popularFor: ['clan PvP servers', 'building-focused PvE'], faqs: [] },
  { slug: 'the-forest', name: 'The Forest', category: 'Survival & Sandbox', tagline: 'Co-op survival horror on a cannibal-infested island.', description: 'A tense co-op survival horror game. Dedicated server hosting keeps the world persistent whether or not the host is online, which is the whole point for a group that plays on different schedules.', recommendedRam: [{ players: '2-4 players', ram: '2-4GB' }], popularFor: ['small co-op survival groups'], faqs: [] },
  { slug: 'sons-of-the-forest', name: 'Sons of the Forest', category: 'Survival & Sandbox', tagline: 'The Forest\'s bigger, better-looking sequel.', description: 'The dedicated server component came after early access launch and has matured since; a persistent world is the main reason groups move off peer hosting.', recommendedRam: [{ players: '2-6 players', ram: '4-6GB' }], popularFor: ['persistent co-op survival worlds'], faqs: [] },
  { slug: 'enshrouded', name: 'Enshrouded', category: 'Survival & Sandbox', tagline: 'Voxel survival-action with real base building.', description: 'A newer voxel survival title blending action combat with deep base building. Server-side voxel terrain data adds up fast with an active builder in the group.', recommendedRam: [{ players: '2-8 players', ram: '6-8GB' }], popularFor: ['co-op base building', 'boss-focused groups'], faqs: [] },
  { slug: 'v-rising', name: 'V Rising', category: 'Survival & Sandbox', tagline: 'Vampire survival with castle building and PvP.', description: 'Gothic vampire survival with real-time PvP and castle sieges. Performance stays smooth on modest specs until a server fills with elaborate castles.', recommendedRam: [{ players: '10-20 players', ram: '4-6GB' }, { players: '40 players', ram: '8GB' }], popularFor: ['PvP castle-siege servers', 'PvE clan servers'], faqs: [] },
  { slug: 'terraria', name: 'Terraria', category: 'Survival & Sandbox', tagline: '2D sandbox adventure, unreasonably light to host.', description: 'One of the lightest games on this whole list to run. TShock and other mod frameworks add admin tools without adding meaningful overhead.', recommendedRam: [{ players: '2-8 players', ram: '1-2GB' }], popularFor: ['TShock-managed community servers'], faqs: [] },
  { slug: 'starbound', name: 'Starbound', category: 'Survival & Sandbox', tagline: 'Terraria\'s spiritual cousin, in space.', description: 'A sci-fi sandbox in the same family as Terraria. Lightweight to run even with a modest group and a handful of mods.', recommendedRam: [{ players: '2-8 players', ram: '2GB' }], popularFor: ['modded exploration servers'], faqs: [] },
  { slug: 'craftopia', name: 'Craftopia', category: 'Survival & Sandbox', tagline: 'Open-world survival crafting from the Palworld team.', description: 'Fast-paced open-world crafting and building with a heavy feature list. Runs comfortably on a mid-range plan for a small group.', recommendedRam: [{ players: '2-8 players', ram: '4-6GB' }], popularFor: ['small co-op crafting groups'], faqs: [] },
  { slug: 'core-keeper', name: 'Core Keeper', category: 'Survival & Sandbox', tagline: 'Underground sandbox mining and exploration.', description: 'A cozy underground mining sandbox that stays light even with a full group exploring different corners of the world at once.', recommendedRam: [{ players: '2-8 players', ram: '2-4GB' }], popularFor: ['co-op exploration servers'], faqs: [] },
  { slug: 'necesse', name: 'Necesse', category: 'Survival & Sandbox', tagline: 'Top-down sandbox survival with real base defense.', description: 'A smaller-scale sandbox survival title with settlement building and tower-defense-style waves. Modest hardware needs.', recommendedRam: [{ players: '2-8 players', ram: '2GB' }], popularFor: ['settlement-building co-op'], faqs: [] },
  { slug: 'icarus', name: 'Icarus', category: 'Survival & Sandbox', tagline: 'Session-based survival on a hostile alien world.', description: 'Session-based survival where each drop is its own instance. Dedicated hosting keeps a session running for a group without one person\'s PC carrying it.', recommendedRam: [{ players: '2-8 players', ram: '4-6GB' }], popularFor: ['session-based co-op groups'], faqs: [] },
  { slug: 'grounded', name: 'Grounded', category: 'Survival & Sandbox', tagline: 'Backyard survival at insect scale.', description: 'Obsidian\'s shrunk-down backyard survival game. A dedicated server keeps the world alive for a family or friend group across different play sessions.', recommendedRam: [{ players: '2-4 players', ram: '3-4GB' }], popularFor: ['family and small-group co-op'], faqs: [] },
  { slug: 'scum', name: 'SCUM', category: 'Survival & Sandbox', tagline: 'Hardcore open-world survival with deep character simulation.', description: 'One of the more demanding survival titles on this list, with detailed metabolism and vehicle simulation adding real server-side load at higher player counts.', recommendedRam: [{ players: '10-20 players', ram: '8-10GB' }, { players: '40-64 players', ram: '12-16GB' }], popularFor: ['large open-world PvP servers'], faqs: [] },
  { slug: 'astroneer', name: 'Astroneer', category: 'Survival & Sandbox', tagline: 'Relaxed co-op space exploration and base building.', description: 'A low-stress co-op exploration and building game across multiple planets. Runs comfortably for a small group on modest resources.', recommendedRam: [{ players: '2-8 players', ram: '2-4GB' }], popularFor: ['relaxed co-op building'], faqs: [] },
  { slug: 'stationeers', name: 'Stationeers', category: 'Survival & Sandbox', tagline: 'Deep-systems survival building a space station.', description: 'A simulation-heavy building game about keeping a space station\'s atmosphere, power, and logistics running. CPU matters more than most titles on this list.', recommendedRam: [{ players: '2-6 players', ram: '4-6GB' }], popularFor: ['engineering-focused co-op'], faqs: [] },
  { slug: 'empyrion', name: 'Empyrion - Galactic Survival', category: 'Survival & Sandbox', tagline: 'Space survival, building, and exploration.', description: 'A space-faring survival and building game with player-built ships and bases across multiple planets. World size grows with playtime, so plan storage accordingly.', recommendedRam: [{ players: '2-8 players', ram: '4-6GB' }], popularFor: ['multiplayer ship-building servers'], faqs: [] },
  { slug: 'vintage-story', name: 'Vintage Story', category: 'Survival & Sandbox', tagline: 'Deep, realistic survival with real metallurgy and farming.', description: 'A slower, more simulation-driven survival sandbox in the Minecraft-like genre, aimed at players who want real crafting depth. Lightweight to host.', recommendedRam: [{ players: '2-10 players', ram: '2-4GB' }], popularFor: ['realistic survival communities'], faqs: [] },
  { slug: 'barotrauma', name: 'Barotrauma', category: 'Survival & Sandbox', tagline: 'Submarine crew survival, part sim, part horror.', description: 'A 2D submarine-crew simulation with real system management (reactors, hull breaches, hostile creatures). Dedicated hosting keeps runs going without a single point of failure on the host\'s connection.', recommendedRam: [{ players: '4-8 players', ram: '2-4GB' }], popularFor: ['crew-based co-op sessions'], faqs: [] },
  { slug: 'eco', name: 'Eco', category: 'Survival & Sandbox', tagline: 'Collaborative survival built around a shared economy.', description: 'A civilization-building survival game where the whole point is a shared economy and ecosystem. Runs best with more RAM as your world and player count grow.', recommendedRam: [{ players: '10-20 players', ram: '6-8GB' }], popularFor: ['civilization and economy servers'], faqs: [] },
  { slug: 'don-t-starve-together', name: "Don't Starve Together", category: 'Survival & Sandbox', tagline: 'Co-op survival in Klei\'s gothic art style.', description: 'The multiplayer take on Don\'t Starve. Very light to host, even for a full lobby, and mods add little overhead.', recommendedRam: [{ players: '2-6 players', ram: '1-2GB' }], popularFor: ['modded co-op worlds'], faqs: [] },
  { slug: 'factorio', name: 'Factorio', category: 'Survival & Sandbox', tagline: 'Automation and factory-building, famously CPU-bound.', description: 'A factory-automation game whose late-game bases are notoriously CPU-intensive as belts and machines multiply — this one benefits from the higher core counts on our Premium tier more than most.', recommendedRam: [{ players: '2-8 players, early game', ram: '2GB' }, { players: 'large late-game factories', ram: '4-8GB, prioritize cores' }], popularFor: ['long-running automation servers'], faqs: [{ q: 'Why does Factorio need more cores instead of RAM?', a: 'Factorio\'s simulation is single-threaded and CPU-bound as your factory grows, so a plan with strong per-core clocks (our Ryzen 9 Premium tier) keeps UPS stable longer than just adding RAM.' }] },
  { slug: 'muck', name: 'Muck', category: 'Survival & Sandbox', tagline: 'Fast, chaotic roguelike survival co-op.', description: 'A quick-session roguelike survival game meant for short, chaotic co-op runs. Minimal hosting requirements.', recommendedRam: [{ players: '2-4 players', ram: '1-2GB' }], popularFor: ['quick-session co-op groups'], faqs: [] },
  { slug: 'unturned', name: 'Unturned', category: 'Survival & Sandbox', tagline: 'Free-to-play blocky zombie survival with a huge modding scene.', description: 'A free, blocky zombie-survival sandbox with an active Workshop modding scene through Rocket and Unturned 3.x plugin frameworks.', recommendedRam: [{ players: '10-24 players', ram: '2-4GB' }, { players: '32+ players, modded', ram: '4-6GB' }], popularFor: ['Rocket-modded roleplay servers'], faqs: [] },

  // ── Shooters & tactical ─────────────────────────────────────────────
  {
    slug: 'cs2',
    name: 'Counter-Strike 2',
    category: 'Shooters & Tactical',
    tagline: 'Competitive and casual CS2, with room for community plugins.',
    description:
      "Low per-player resource use, so the real question is tick stability under load. Our NVMe tier keeps tick rate steady for a full 10-32 player server, and CounterStrikeSharp / MetaMod plugin stacks are fully supported.",
    recommendedRam: [
      { players: '10-16 players, plain competitive', ram: '2-4GB' },
      { players: '24-32 players, community + plugins', ram: '4-6GB' },
    ],
    popularFor: ['5v5 competitive practice servers', 'community deathmatch/surf/retake', 'CounterStrikeSharp plugin stacks'],
    faqs: [
      { q: 'Can I run CounterStrikeSharp / MetaMod plugins?', a: 'Yes, install them the same way as any CS2 dedicated server; nothing about the panel restricts it.' },
    ],
  },
  { slug: 'team-fortress-2', name: 'Team Fortress 2', category: 'Shooters & Tactical', tagline: 'Still going strong, especially with community SourceMod plugins.', description: 'A long-lived Source engine shooter with a deep SourceMod/MetaMod plugin ecosystem covering everything from jump maps to full custom game modes.', recommendedRam: [{ players: '24 players', ram: '2-4GB' }, { players: '32 players, plugin-heavy', ram: '4GB' }], popularFor: ['SourceMod community servers', 'jump and surf maps'], faqs: [] },
  { slug: 'left-4-dead-2', name: 'Left 4 Dead 2', category: 'Shooters & Tactical', tagline: 'Co-op zombie shooting with a huge custom campaign library.', description: 'Source engine co-op zombie survival with thousands of community campaigns and mods available through the Workshop.', recommendedRam: [{ players: '4-8 players', ram: '2GB' }], popularFor: ['custom campaign servers', 'versus mode community servers'], faqs: [] },
  { slug: 'garrys-mod', name: "Garry's Mod", category: 'Shooters & Tactical', tagline: 'DarkRP, TTT, sandbox — whatever your community actually plays.', description: "Less a single game than a platform. DarkRP and TTT are the two heaviest, most add-on-dependent gamemodes we see, and both benefit from extra RAM once a server's Workshop collection grows past a few hundred items.", recommendedRam: [{ players: 'Sandbox, small group', ram: '2-4GB' }, { players: 'DarkRP/TTT, 20-40 players', ram: '6-8GB' }], popularFor: ['DarkRP roleplay servers', 'TTT and Murder', 'sandbox build servers'], faqs: [{ q: 'Can I run a big DarkRP Workshop collection?', a: 'Yes — Workshop collections are supported and are exactly why DarkRP servers benefit from more RAM than the base game needs.' }] },
  { slug: 'squad', name: 'Squad', category: 'Shooters & Tactical', tagline: 'Large-scale tactical combined-arms warfare.', description: 'Squad is one of the heavier tactical shooters to host at full 100-player capacity, with vehicle and large-map simulation adding real CPU load.', recommendedRam: [{ players: '50-player servers', ram: '6-8GB' }, { players: '100-player servers', ram: '10-12GB' }], popularFor: ['large-scale combined-arms servers'], faqs: [] },
  { slug: 'insurgency-sandstorm', name: 'Insurgency: Sandstorm', category: 'Shooters & Tactical', tagline: 'Tight, punishing tactical squad combat.', description: 'A tactical, checkpoint-based shooter with a smaller, more manageable server footprint than most large-scale military shooters.', recommendedRam: [{ players: '8-16 players', ram: '3-4GB' }], popularFor: ['co-op checkpoint servers', 'competitive versus'], faqs: [] },
  { slug: 'killing-floor-2', name: 'Killing Floor 2', category: 'Shooters & Tactical', tagline: 'Co-op horde-shooter mayhem.', description: 'Wave-based co-op zombie (Zed) shooting. Modest resource needs even at a full 6-player lobby with mutators enabled.', recommendedRam: [{ players: '6 players', ram: '2-3GB' }], popularFor: ['modded horde-mode servers'], faqs: [] },
  { slug: 'hell-let-loose', name: 'Hell Let Loose', category: 'Shooters & Tactical', tagline: 'Large-scale WWII combined-arms combat.', description: 'A 100-player WWII shooter with large maps and vehicle combat; comparable in hosting demand to Squad at similar player counts.', recommendedRam: [{ players: '50-100 players', ram: '8-12GB' }], popularFor: ['large-scale WWII servers'], faqs: [] },
  { slug: 'arma-3', name: 'Arma 3', category: 'Shooters & Tactical', tagline: 'Open-world military simulation with deep mission scripting.', description: 'Highly moddable military sim whose real cost is mission complexity and mod count rather than raw player count — a scripted 40-player Zeus mission can outweigh a plain 80-player TvT.', recommendedRam: [{ players: '20-40 players, light mods', ram: '6-8GB' }, { players: 'Heavily modded/scripted missions', ram: '10-16GB' }], popularFor: ['milsim communities', 'Zeus and King of the Hill missions'], faqs: [] },
  { slug: 'arma-reforger', name: 'Arma Reforger', category: 'Shooters & Tactical', tagline: 'Enfusion-engine military sim, the modern Arma testbed.', description: 'The newer, more streamlined entry in the Arma line, built on the Enfusion engine that will eventually power Arma 4. Actively developed with growing mod support.', recommendedRam: [{ players: '32-64 players', ram: '6-8GB' }], popularFor: ['conflict and combat-ops servers'], faqs: [] },
  { slug: 'no-more-room-in-hell', name: 'No More Room in Hell', category: 'Shooters & Tactical', tagline: 'Free co-op survival horror, Source engine.', description: 'A free, tense co-op zombie survival horror shooter built on Source. Light on server resources.', recommendedRam: [{ players: '8 players', ram: '2GB' }], popularFor: ['co-op horror scenarios'], faqs: [] },
  { slug: 'mordhau', name: 'Mordhau', category: 'Shooters & Tactical', tagline: 'Medieval melee combat at scale.', description: 'Large-scale melee combat with physics-driven swordplay. Server load scales mainly with player count and map size.', recommendedRam: [{ players: '32-64 players', ram: '4-6GB' }], popularFor: ['large-scale melee battle servers'], faqs: [] },
  { slug: 'battlefield-2042-portal', name: 'Battlefield 2042 (community servers)', category: 'Shooters & Tactical', tagline: 'Community-hosted Portal experiences.', description: 'Portal-based community server hosting for Battlefield 2042, for communities running custom rulesets and rotations.', recommendedRam: [{ players: '32-64 players', ram: '4-6GB' }], popularFor: ['custom Portal rotations'], faqs: [] },

  // ── Roleplay & multiplayer platforms ────────────────────────────────
  {
    slug: 'fivem',
    name: 'FiveM',
    category: 'Roleplay & Platforms',
    tagline: 'GTA V roleplay servers, from a small crew to a full city.',
    description:
      "Roleplay communities live and die on resource count and database performance, not just player slots. A full ESX/QBCore city with a real economy, custom jobs, and MySQL-backed persistence needs meaningfully more than the framework's bare minimum suggests.",
    recommendedRam: [
      { players: 'Small crew, base framework', ram: '4-6GB' },
      { players: 'ESX/QBCore city, 32-64 slots', ram: '8-12GB' },
      { players: 'Large city, 100+ slots, heavy scripts', ram: '16GB+' },
    ],
    popularFor: ['ESX and QBCore roleplay cities', 'custom job and economy scripts', 'whitelisted communities'],
    faqs: [
      { q: 'Do you support ESX or QBCore out of the box?', a: 'The base framework installs the same way as on any FiveM box; we don\'t lock you into one framework or the other.' },
      { q: 'Can I connect an external MySQL database for the economy?', a: 'Yes, a roleplay city typically runs its own MySQL/MariaDB instance for persistence and that connects normally.' },
    ],
  },
  { slug: 'rust-console', name: 'Beam.MG / BeamMP (BeamNG.drive)', category: 'Roleplay & Platforms', tagline: 'Multiplayer BeamNG.drive sessions.', description: 'BeamMP brings persistent multiplayer to BeamNG.drive\'s soft-body vehicle simulation. Lightweight on the server side since physics run client-side.', recommendedRam: [{ players: '4-16 players', ram: '2-4GB' }], popularFor: ['community driving and crash servers'], faqs: [] },

  // ── Building & simulation ────────────────────────────────────────────
  {
    slug: 'satisfactory',
    name: 'Satisfactory',
    category: 'Building & Simulation',
    tagline: 'Factory-building on a scale that eventually needs a real server.',
    description:
      "Dedicated Server Mode moves the simulation off a player's PC entirely, which matters once a factory sprawls across the map — exactly the point where a local host starts stuttering. CPU headroom matters as much as RAM here.",
    recommendedRam: [
      { players: '1-4 players, early game', ram: '6-8GB' },
      { players: 'Large late-game factories', ram: '12-16GB' },
    ],
    popularFor: ['persistent co-op megabase factories'],
    faqs: [
      { q: 'Does the world keep running when everyone logs off?', a: 'Yes, that\'s the point of Dedicated Server Mode — the factory keeps simulating and no single player\'s PC has to carry the session.' },
    ],
  },
  { slug: 'space-engineers', name: 'Space Engineers', category: 'Building & Simulation', tagline: 'Physics-driven ship and station building in space.', description: 'A voxel-based space-building sim where physics simulation of large ships is the real server cost, not just player count. CPU matters more than most sandbox titles.', recommendedRam: [{ players: '4-8 players', ram: '6-8GB' }, { players: 'large multiplayer worlds', ram: '12GB+' }], popularFor: ['survival and creative build servers'], faqs: [] },

  // ── Zombie & PvP ─────────────────────────────────────────────────────
  { slug: 'dayz', name: 'DayZ', category: 'Zombie & PvP', tagline: 'Hardcore open-world survival PvP on the Chernarus map (and mods).', description: 'A punishing open-world survival shooter with a huge modding scene (CF, Namalsk, and dozens of overhaul mods) that each add real memory overhead on top of the base game.', recommendedRam: [{ players: 'Vanilla, 40-60 players', ram: '4-6GB' }, { players: 'Heavily modded (CF, custom maps)', ram: '8-12GB' }], popularFor: ['modded community servers', 'hardcore vanilla-plus servers'], faqs: [{ q: 'Can I run custom maps like Namalsk or Deer Isle?', a: 'Yes, custom map mods work the same way as on a self-hosted DayZ server — just size RAM for the mod list, not the vanilla baseline.' }] },
  { slug: 'atlas', name: 'ATLAS', category: 'Zombie & PvP', tagline: 'Massive-scale pirate MMO survival.', description: 'A sprawling pirate-themed survival MMO built on the ARK engine, spanning a huge ocean grid. One of the more demanding titles here at full grid scale.', recommendedRam: [{ players: 'Single grid cell', ram: '4-6GB' }, { players: 'Full multi-cell grid', ram: '16GB+ total' }], popularFor: ['company-run pirate servers'], faqs: [] },
] satisfies GameEntry[]

export function gameBySlug(slug: string): GameEntry | undefined {
  return games.find((g) => g.slug === slug)
}

export const gameCategories = Array.from(new Set(games.map((g) => g.category)))

export const gamesCtaHref = siteConfig.links.register

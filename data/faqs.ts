

export interface Faq {
  /** Stable key for translations; see i18n/content/types.ts. */
  id: string
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    id: 'getting-started',
    question: 'How do I get started?',
    answer:
      'Head to wslatl.com/register and request access. An admin reviews every application and approves it before you can access any services. Once approved, you can order a game server or VPS in the billing portal and pay online. For a dedicated server or web hosting, reach out to us on Discord or open a billing ticket and we will set it up with you.',
  },
  {
    id: 'what-makes-you-different',
    question: 'What makes you different from the big hosting companies?',
    answer:
      'We are small on purpose. We are a private, application-only company based in Missouri. We have worked inside hosting companies and we have seen how clients get ignored. At WSLATL, every client gets direct access to our team every single time. No queues that sit for days and no copy-paste replies.',
  },
  {
    id: 'supported-games',
    question: 'What games do you support for game servers?',
    answer:
      'We run Pterodactyl and support a wide range of games: Minecraft (Java and Bedrock), Rust, CS2, ARK, Valheim, Terraria, FiveM, and plenty more. If your game is not listed, just ask. We can almost always support it.',
  },
  {
    id: 'game-server-cost',
    question: 'How much does game server hosting cost?',
    // {tokens} are filled from data/pricing.ts when the answer is rendered
    // (fillPrices in lib/pricing.ts), in every language.
    answer:
      'Budget game servers start at {gamePrice} a month for {gameRam} GB of RAM, and Premium game servers at {gamePremiumPrice}. Budget VPS plans start at {vpsPrice}, and Premium VPS plans at {vpsPremiumPrice}. Premium runs on an AMD Ryzen 9 3900X with NVMe. Budget has the same specs on an older, busier Intel Core i7-6700K with SATA SSD, so it can be slower at busy times. The pricing page has the full breakdown.',
  },
  {
    id: 'response-time',
    question: 'How fast will you actually respond?',
    answer:
      'Under an hour on Discord during active hours, and often faster. We do not have a massive support team. We have a dedicated one. You will always be talking to someone who knows your specific server and setup, not someone reading from a script.',
  },
  {
    id: 'managed-hosting',
    question: 'Do you offer managed hosting?',
    answer:
      'Yes. We offer fully managed options where we handle updates, monitoring, and maintenance. We also offer unmanaged options for clients who want full control. We figure out what works best for you during our initial conversation.',
  },
  {
    id: 'changes-later',
    question: 'Can I upgrade, downgrade, or change things later?',
    answer:
      'Yes. On a game server or VPS, the account holder can switch plan or billing cycle from the service page in the billing portal, either right away with proration or at the next renewal. For more RAM, vCores or disk, they can use Request an upgrade on the same page, which opens a ticket and charges nothing until our team approves it. Dedicated servers, web hosting and migrations are handled by our team: open a ticket or message us on Discord.',
  },
  {
    id: 'vps-vs-shared',
    question: 'Is VPS hosting better than shared hosting?',
    answer:
      'For most people running a real project, yes. A VPS gives you your own share of CPU and RAM, full root access and your choice of OS. Premium plans run on an AMD Ryzen 9 3900X; Budget plans run on an older, busier CPU, so they can be slower at busy times. Shared hosting is cheaper, but every site on the server draws on the same resources.',
  },
  {
    id: 'ddos-protection',
    question: 'Do you offer DDoS protection?',
    answer:
      'Yes. DDoS protection is included on every game server plan at no extra cost. It is always on, not something you have to enable or pay to add later.',
  },
]

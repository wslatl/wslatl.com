export interface Faq {
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    question: 'How do I get started?',
    answer:
      'Head to billing.wslatl.com/register and sign up for an account. After you register, an admin will review your application and approve it before you can access any services. Once approved, reach out to us on Discord or open a billing ticket and we will get you set up.',
  },
  {
    question: 'What makes you different from the big hosting companies?',
    answer:
      "We are small on purpose. We are a private, application only company based in Missouri. We have worked inside hosting companies and we have seen how clients get ignored. At WSLATL, every client gets direct access to our team every single time. No queues that sit for days and no copy paste replies.",
  },
  {
    question: 'What games do you support for game servers?',
    answer:
      'We run Pterodactyl and support a wide range of games. Minecraft (Java and Bedrock), Rust, CS2, ARK Survival Evolved, Valheim, Terraria, FiveM, and plenty more. If your game is not listed here, just ask us. We can almost always support it.',
  },
  {
    question: 'How fast will you actually respond?',
    answer:
      'Under an hour on Discord during active hours and often faster. We do not have a massive support team. We have a dedicated one. You will always be talking to someone who knows your specific server and setup, not someone reading from a script.',
  },
  {
    question: 'Do you offer managed hosting?',
    answer:
      'Yes. We offer fully managed options where we handle updates, monitoring, and maintenance. We also offer unmanaged options for clients who want full control. We figure out what works best for you during our initial conversation.',
  },
  {
    question: 'Can I upgrade, downgrade, or change things later?',
    answer:
      'Of course. Every client relationship is handled personally so upgrades, plan changes, and migrations are just a Discord message away. We usually get it sorted the same day.',
  },
  {
    question: 'How much does game server hosting cost?',
    answer:
      'Our budget game server plans start under $4 a month for 4GB of RAM on SATA SSD, and our premium NVMe plans start around $12 a month. See the full breakdown, including VPS pricing, on our pricing page.',
  },
  {
    question: 'Is VPS hosting better than shared hosting?',
    answer:
      'For most people running a real project, yes. A VPS gives you dedicated CPU and RAM that nobody else touches, full root access, and no risk of a neighboring account tanking your performance. Shared hosting is cheaper but you are sharing resources with strangers.',
  },
  {
    question: 'Do you offer DDoS protection?',
    answer:
      'Yes, DDoS protection is included on every game server plan at no extra cost. It is always on, not something you have to enable or pay to add later.',
  },
]

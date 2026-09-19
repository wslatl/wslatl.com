/**
 * Translations of the text that lives in data/: service descriptions, the
 * FAQ, game guidance, plan copy, and so on. English is not here, because the
 * data files are the English original; each other language provides this
 * shape and i18n/content.ts merges it over the data.
 *
 * Everything is keyed by a stable id rather than by position, so reordering a
 * list in data/ cannot quietly shift translations onto the wrong entry.
 */
export interface ContentTranslation {
  /** Keyed by service id: vps, game, dedicated, web. */
  services?: Record<string, { title: string; description: string; features: string[] }>
  /** Keyed by commitment id. The values (99.9%, 30 days) are not translated. */
  commitments?: Record<string, string>
  leadFeature?: { title: string; description: string }
  /** Keyed by feature id. */
  features?: Record<string, { title: string; description: string }>
  /** Keyed by FAQ id. */
  faqs?: Record<string, { question: string; answer: string }>
  /** Keyed by team member name, which is not translated. */
  team?: Record<string, { role: string; bio: string }>
  reviews?: { title: string; body: string; ask: string; cta: string; learnMore: string }
  /** Service labels in the uptime table, keyed by service id. */
  sla?: Record<string, string>
  pricing?: {
    /** Keyed by product line id: vps, game. */
    /** cpuUnit (vCPU, vCores) is a spec, not a word, so it is not translated. */
    lines: Record<string, { label: string; intro: string; included: string[] }>
    /** Keyed by plan group id. */
    groups: Record<string, { label: string; description: string; comparison?: string }>
  }
  /** Keyed by game slug. Game names are not translated. */
  games?: Record<
    string,
    {
      tagline: string
      description: string
      popularFor: string[]
      /** The "who it is for" half of each RAM row, in the order data/games.ts has them. */
      setups: string[]
      /** The game's own questions and answers, in the order data/games.ts has them. */
      faqs: { q: string; a: string }[]
    }
  >
  /** Keyed by the English category name. */
  gameCategories?: Record<string, string>
  /** Keyed by legal document key. */
  legal?: Record<string, { label: string; title: string; metaDescription: string; intro: string }>
}

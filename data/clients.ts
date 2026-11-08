export interface Client {
  name: string
  logo: string
  /** Intrinsic size of the logo file, for layout without shift. */
  width: number
  height: number
  /** Display height. Logos have different visual weight, so each gets its own. */
  heightClass: string
  /**
   * The partner this client also is, by slug (data/partners.ts). The strip on
   * the home page shows every partner by itself (lib/clients.ts), so a client
   * who is also a partner names them here and shows once, with this logo.
   * tests/clients.test.ts checks the slug.
   */
  partner?: string
}

/**
 * Logos are pre-trimmed and exported as WebP at twice their display height.
 * Partners need no entry here: the strip adds every one of them by itself.
 */
export const clients: Client[] = [
  { name: 'Joes FiveM Scripts', logo: '/clients/joes.webp', width: 279, height: 96, heightClass: 'h-7 sm:h-10' },
  { name: 'West Bay Project', logo: '/clients/west-bay-project.webp', width: 361, height: 96, heightClass: 'h-7 sm:h-10' },
  {
    name: 'VulnRadar',
    logo: '/clients/vulnradar.webp',
    width: 341,
    height: 66,
    heightClass: 'h-5 sm:h-7',
    partner: 'vulnradar',
  },
  {
    name: 'Haskins Designs',
    logo: '/clients/haskins.webp',
    width: 319,
    height: 96,
    heightClass: 'h-7 sm:h-10',
    partner: 'haskins',
  },
  { name: 'Tyler Woollis Shotz', logo: '/clients/tyler-woollis-shotz.webp', width: 369, height: 96, heightClass: 'h-7 sm:h-10' },
]

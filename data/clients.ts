export interface Client {
  name: string
  logo: string
  width: number
  height: number
  /** Tailwind height class, e.g. `h-14`. */
  hClass: string
}

export const clients: Client[] = [
  { name: 'Joes',             logo: '/clients/joes.png',        width: 6250, height: 6250, hClass: 'h-14' },
  { name: 'West Bay Project', logo: '/clients/westbay.png',     width: 955,  height: 261,  hClass: 'h-8'  },
  { name: 'VulnRadar',        logo: '/clients/vulnradar.png',   width: 378,  height: 156,  hClass: 'h-9'  },
  { name: 'HASKINS',          logo: '/clients/haskins.png',     width: 509,  height: 490,  hClass: 'h-14' },
  { name: 'WSLATL',           logo: '/clients/wslatl-main.png', width: 1563, height: 1563, hClass: 'h-12' },
]

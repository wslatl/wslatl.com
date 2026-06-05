export interface Stat {
  prefix?: string
  value: number
  suffix?: string
  label: string
  decimals?: number
}

export const stats: Stat[] = [
  { value: 99.9, suffix: '%', label: 'Uptime SLA', decimals: 1 },
  { value: 1,   prefix: '< ', suffix: ' hr', label: 'Avg. Support Response' },
  { value: 100, suffix: '%', label: 'Private & Application Only' },
  { value: 100, suffix: '%', label: 'USA-based, Missouri' },
]

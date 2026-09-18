/**
 * Monthly uptime targets from the Service Level Agreement. The SLA page and
 * every marketing claim about uptime read from this list, so the two can
 * never disagree.
 */

export type SlaService = 'vps' | 'web' | 'game' | 'dedicated'

export interface UptimeTarget {
  service: SlaService
  label: string
  target: string
}

export const uptimeTargets: UptimeTarget[] = [
  { service: 'vps', label: 'VPS Hosting', target: '99.9%' },
  { service: 'web', label: 'Web Hosting', target: '99.9%' },
  { service: 'game', label: 'Game Server Hosting', target: '99.5%' },
  {
    service: 'dedicated',
    label: 'Dedicated Servers',
    target: 'Best-effort; subject to hardware and datacenter availability',
  },
]

export function uptimeTarget(service: SlaService): string {
  const entry = uptimeTargets.find((t) => t.service === service)
  if (!entry) throw new Error(`No SLA uptime target for "${service}"`)
  return entry.target
}

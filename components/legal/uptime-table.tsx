import { ScrollTable } from '@/components/legal/blocks'
import { uptimeTargets } from '@/data/sla'

/** The SLA uptime table, shared by the Terms of Service and the SLA page. */
export function UptimeTable() {
  return (
    <ScrollTable label="Monthly uptime targets">
      <table className="legal-table">
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">Monthly Uptime Target</th>
          </tr>
        </thead>
        <tbody>
          {uptimeTargets.map((row) => (
            <tr key={row.service}>
              <td>{row.label}</td>
              <td>{row.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  )
}

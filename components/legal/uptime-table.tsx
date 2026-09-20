import { ScrollTable } from '@/components/legal/blocks'
import { copy } from '@/i18n/copy'
import { localizedUptimeTargets } from '@/i18n/content'

/** The SLA uptime table, shared by the Terms of Service and the SLA page. */
export function UptimeTable() {
  const t = copy().legal.uptimeTable

  return (
    <ScrollTable label={t.label}>
      <table className="legal-table">
        <thead>
          <tr>
            <th scope="col">{t.service}</th>
            <th scope="col">{t.target}</th>
          </tr>
        </thead>
        <tbody>
          {localizedUptimeTargets().map((row) => (
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

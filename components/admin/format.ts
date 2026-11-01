// Shared by the dashboard and the update panel, on the server and in the
// browser. The time zone is fixed so both render the same text.
const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Chicago',
})

export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : `${dateTime.format(date)} CT`
}

export const shortSha = (sha: string) => sha.slice(0, 7)

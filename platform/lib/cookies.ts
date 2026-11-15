/**
 * One cookie from a Cookie header, or undefined. The first one of that
 * name wins: the browser sends the one set for the longest path first.
 */
export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const at = part.indexOf('=')
    if (at === -1 || part.slice(0, at).trim() !== name) continue
    let value = part.slice(at + 1).trim()
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return undefined
}

/**
 * Scrambles an email address so that it never exists in the page as written.
 * Harvesters scan HTML and scripts for "name@domain" and "mailto:", and this
 * hex string contains neither. It is obfuscation, not encryption: all it has
 * to do is make the address cost more than a regular expression to find.
 */
const SEED = 0x4f

function key(index: number): number {
  return (SEED + index * 7) & 0xff
}

export function scrambleEmail(address: string): string {
  return Array.from(address, (char, i) => (char.charCodeAt(0) ^ key(i)).toString(16).padStart(2, '0')).join('')
}

export function unscrambleEmail(code: string): string {
  let address = ''
  for (let i = 0; i < code.length / 2; i++) {
    address += String.fromCharCode(Number.parseInt(code.slice(i * 2, i * 2 + 2), 16) ^ key(i))
  }
  return address
}

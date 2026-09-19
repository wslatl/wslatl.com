// Fails if an email address made it into anything the site serves:
// prerendered HTML, React Server Component payloads, or browser scripts.
// Addresses may only reach the browser scrambled (components/ui/email.tsx).
//
//   npm run build && npm run scan:build
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const served = ['.next/server/app', '.next/static']
const address = /[a-z0-9._%+-]+@wslatl\.com/gi

if (!served.every((dir) => existsSync(dir))) {
  console.error('No build output found. Run `npm run build` first.')
  process.exit(1)
}

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

const leaks = []
let scanned = 0
for (const file of served.flatMap(files)) {
  if (file.endsWith('.map')) continue
  scanned++
  const found = readFileSync(file, 'utf8').match(address)
  if (found) leaks.push(`${relative('.', file)}: ${[...new Set(found)].join(', ')}`)
}

if (leaks.length) {
  console.error(`Email addresses in served files (render them with <Email> instead):\n${leaks.join('\n')}`)
  process.exit(1)
}
console.log(`No email addresses in ${scanned} served files.`)

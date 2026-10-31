// Checks the build output for three things, and fails on any of them:
//
//   - an email address in anything the site serves (prerendered HTML, React
//     Server Component payloads, browser scripts). Addresses may only reach
//     the browser scrambled (components/ui/email.tsx).
//   - an admin secret there: the value of any secret in .env (CI writes
//     canary values before building), or anything shaped like a password
//     hash or a GitHub token.
//   - a page in the sitemap that is no longer prerendered, or an admin page
//     that is. Every public page is static; only /admin renders per request.
//
//   npm run build && npm run scan:build
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parseEnv } from 'node:util'

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

// Only the secret ones: GITHUB_REPO, say, may well appear in a page.
const secrets = existsSync('.env')
  ? Object.entries(parseEnv(readFileSync('.env', 'utf8'))).filter(
      ([name, value]) => /SECRET|TOKEN|PASSWORD|KEY/i.test(name) && value.trim().length >= 8,
    )
  : []
const secretShapes = [
  [/scrypt:\d+:\d+:\d+:[\w-]{16,}:[\w-]{16,}/, 'a password hash'],
  [/github_pat_\w{20,}/, 'a GitHub token'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}/, 'a GitHub token'],
]

const leaks = []
const secretLeaks = []
let scanned = 0
for (const file of served.flatMap(files)) {
  if (file.endsWith('.map')) continue
  scanned++
  const text = readFileSync(file, 'utf8')
  const found = text.match(address)
  if (found) leaks.push(`${relative('.', file)}: ${[...new Set(found)].join(', ')}`)
  for (const [name, value] of secrets) {
    if (text.includes(value.trim())) secretLeaks.push(`${relative('.', file)}: the value of ${name}`)
  }
  for (const [shape, what] of secretShapes) if (shape.test(text)) secretLeaks.push(`${relative('.', file)}: ${what}`)
}

// Sitemap paths to the routes they are prerendered as: English pages sit at
// the plain paths and are built under /en (proxy.ts, i18n/routing.ts).
const config = readFileSync('i18n/config.ts', 'utf8')
const locales = [...(config.match(/export const locales = \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([a-z-]+)'/g)].map((m) => m[1])
const defaultLocale = config.match(/export const defaultLocale: Locale = '([a-z-]+)'/)?.[1]
const routes = new Set(Object.keys(JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8')).routes))
const sitemap = readFileSync('.next/server/app/sitemap.xml.body', 'utf8')
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
const routeOf = (path) =>
  locales.includes(path.split('/')[1]) ? path : path === '/' ? `/${defaultLocale}` : `/${defaultLocale}${path}`
const notStatic = pages.filter((path) => !routes.has(routeOf(path)))
const adminStatic = [...routes].filter((route) => route === '/admin' || route.startsWith('/admin/'))

let failed = false
if (leaks.length) {
  console.error(`Email addresses in served files (render them with <Email> instead):\n${leaks.join('\n')}`)
  failed = true
}
if (secretLeaks.length) {
  console.error(`Admin secrets in served files (read them on the server only, see lib/admin):\n${secretLeaks.join('\n')}`)
  failed = true
}
if (!locales.length || !defaultLocale || pages.length === 0) {
  console.error('Could not read the languages from i18n/config.ts or the pages from the sitemap.')
  failed = true
}
if (notStatic.length) {
  console.error(`Pages in the sitemap that are no longer prerendered:\n${notStatic.join('\n')}`)
  failed = true
}
if (adminStatic.length) {
  console.error(`Admin pages were prerendered, so they would show build-time data:\n${adminStatic.join('\n')}`)
  failed = true
}
if (failed) process.exit(1)

console.log(`No email addresses in ${scanned} served files.`)
console.log(`No admin secrets in them${secrets.length ? `, including the ${secrets.length} from .env` : ''}.`)
console.log(`All ${pages.length} pages in the sitemap are prerendered.`)

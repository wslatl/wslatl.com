// Checks a running copy of the site and prints a Markdown report. Exits 1
// when anything fails. Used every six hours against production by
// .github/workflows/site-health.yml; also handy against a local build:
//
//   node scripts/check-site.mjs https://wslatl.com
//   node scripts/check-site.mjs http://localhost:3000
//
// What it checks:
//   - robots.txt and the sitemap load, and every page in the sitemap
//     answers 200 without a redirect
//   - an unknown path is a real 404
//   - the security headers are there
//   - every moved page (permanent redirect in next.config.mjs) still lands
//     on a page that loads
//   - every short link redirects, temporarily, to its destination in
//     config/links.json. A deployment older than the short links has none,
//     so that check waits until at least one answers.
//   - the TLS certificate has two weeks or more left
import tls from 'node:tls'
import nextConfig from '../next.config.mjs'
import shortLinks from '../config/links.json' with { type: 'json' }

const base = new URL(process.argv[2] ?? 'https://wslatl.com')
const results = []

function record(check, ok, detail = '') {
  results.push({ check, ok, detail })
}

async function get(path, redirect = 'manual') {
  const url = new URL(path, base)
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, { redirect, signal: AbortSignal.timeout(20_000) })
    } catch (error) {
      // One retry covers a dropped connection; a second failure is real.
      if (attempt === 2) throw new Error(`${url.pathname}: ${error.cause?.code ?? error.message}`)
    }
  }
}

/** Runs fn over items, a few at a time, so the site sees a gentle trickle. */
async function eachLimited(items, fn, limit = 6) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (queue.length) await fn(queue.shift())
    }),
  )
}

async function checkPages() {
  const robots = await get('/robots.txt')
  const robotsText = await robots.text()
  record('robots.txt', robots.status === 200 && /^sitemap:/im.test(robotsText), `status ${robots.status}`)

  const sitemap = await get('/sitemap.xml')
  const locs = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  record('sitemap.xml', sitemap.status === 200 && locs.length > 0, `${locs.length} pages`)

  const broken = []
  await eachLimited(locs, async (path) => {
    const res = await get(path)
    if (res.status !== 200) broken.push(`${path} (${res.status})`)
    await res.body?.cancel()
  })
  record('Every sitemap page answers 200', broken.length === 0, broken.join(', ') || `${locs.length} pages`)

  const missing = await get(`/this-page-does-not-exist-${Date.now()}`)
  record('Unknown paths are a real 404', missing.status === 404, `status ${missing.status}`)
}

async function checkHeaders() {
  const res = await get('/')
  const h = res.headers
  const csp = h.get('content-security-policy') ?? ''
  const problems = [
    base.protocol === 'https:' && !h.get('strict-transport-security') && 'no Strict-Transport-Security',
    h.get('x-content-type-options') !== 'nosniff' && 'no X-Content-Type-Options: nosniff',
    !csp && 'no Content-Security-Policy',
    !/frame-ancestors 'none'/.test(csp) && h.get('x-frame-options') !== 'DENY' && 'framing is not blocked',
    !h.get('referrer-policy') && 'no Referrer-Policy',
  ].filter(Boolean)
  record('Security headers', problems.length === 0, problems.join(', ') || 'all present')
}

async function checkRedirects() {
  const redirects = await nextConfig.redirects()

  const moved = redirects.filter((r) => r.permanent)
  const lost = []
  await eachLimited(moved, async ({ source }) => {
    const res = await get(source, 'follow')
    if (res.status !== 200) lost.push(`${source} (${res.status})`)
    await res.body?.cancel()
  })
  record('Moved pages still land on a page', lost.length === 0, lost.join(', ') || `${moved.length} old URLs`)

  const links = Object.values(shortLinks)
  const answers = []
  await eachLimited(links, async ({ path, url }) => {
    const res = await get(path)
    answers.push({ path, url, status: res.status, location: res.headers.get('location') })
    await res.body?.cancel()
  })
  if (!answers.some((a) => a.status >= 300 && a.status < 400)) {
    record('Short links', true, 'not deployed here yet, so not checked')
    return
  }
  // Compared as parsed URLs: a bare origin comes back with a trailing slash.
  const same = (a, b) => Boolean(a && b) && new URL(a, base).href === new URL(b).href
  const wrong = answers
    .filter((a) => ![302, 307].includes(a.status) || !same(a.location, a.url))
    .map((a) => `${a.path} (${a.status}${a.location ? ` to ${a.location}` : ''})`)
  record('Short links redirect to their destinations', wrong.length === 0, wrong.join(', ') || `${links.length} links`)
}

function checkCertificate() {
  if (base.protocol !== 'https:') return Promise.resolve()
  return new Promise((resolve) => {
    const socket = tls.connect({ host: base.hostname, port: 443, servername: base.hostname }, () => {
      const cert = socket.getPeerCertificate()
      const days = Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / 86_400_000)
      record('TLS certificate', socket.authorized && days >= 14, `${days} days left, issued by ${cert.issuer?.O ?? 'unknown'}`)
      socket.end()
      resolve()
    })
    socket.setTimeout(15_000, () => socket.destroy(new Error('timed out')))
    socket.on('error', (error) => {
      record('TLS certificate', false, error.message)
      resolve()
    })
  })
}

for (const [name, run] of [
  ['Pages', checkPages],
  ['Headers', checkHeaders],
  ['Redirects', checkRedirects],
  ['Certificate', checkCertificate],
]) {
  try {
    await run()
  } catch (error) {
    record(name, false, error.message)
  }
}

const failed = results.filter((r) => !r.ok)
const cell = (text) => String(text).replaceAll('|', '\\|')
console.log(`## Site health: ${base.origin}\n`)
console.log(failed.length ? `**${failed.length} of ${results.length} checks failed.**\n` : `All ${results.length} checks passed.\n`)
console.log('| Check | Result | Detail |\n| --- | --- | --- |')
for (const r of results) console.log(`| ${r.check} | ${r.ok ? 'Pass' : '**Fail**'} | ${cell(r.detail)} |`)
console.log(`\nChecked ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC.`)
process.exit(failed.length ? 1 : 0)

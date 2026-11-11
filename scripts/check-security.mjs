// What the site says about its own security, checked from the outside, and
// printed as a Markdown report. Exits 1 when anything fails. Passive only: a
// few GET requests and TLS handshakes, the same as any visitor's browser
// makes. No form, no sign-in, no probing. Run every week against production
// by .github/workflows/security.yml, and by hand against any copy:
//
//   node scripts/check-security.mjs https://wslatl.com
//
// What it checks:
//   - every kind of page and file sends the security headers, with HSTS long
//     enough for the browsers' preload list and a Content Security Policy
//     that refuses framing, plugins and eval
//   - the admin's own policy: a nonce, and no inline script or style
//   - every cookie any of them sets is Secure, HttpOnly and SameSite, and
//     the admin's is a __Host- cookie on SameSite=Strict
//   - plain HTTP goes straight to HTTPS
//   - the certificate is valid, for this name, with two weeks or more left,
//     and the connection is TLS 1.2 or newer, with TLS 1.0 and 1.1 refused
//
// The rules themselves (headerProblems, cookieProblems) are exported:
// tests/http checks a build against the same ones in CI.
import tls from 'node:tls'
import { pathToFileURL } from 'node:url'

const yearSeconds = 365 * 24 * 60 * 60

/** What is wrong with a Strict-Transport-Security value, if anything. */
export function hstsProblems(value) {
  if (!value) return ['no Strict-Transport-Security']
  const maxAge = Number(/max-age=(\d+)/i.exec(value)?.[1] ?? 0)
  return [
    maxAge < yearSeconds && `HSTS lasts ${maxAge} seconds, under the year the preload list asks for`,
    !/(^|;)\s*includeSubDomains\s*(;|$)/i.test(value) && 'HSTS leaves out the subdomains',
    !/(^|;)\s*preload\s*(;|$)/i.test(value) && 'HSTS is not marked for the preload list',
  ].filter(Boolean)
}

/**
 * What is wrong with a Content-Security-Policy value. admin: the admin's
 * stricter rules; nonce: a page, which must carry one.
 */
export function cspProblems(value, { admin = false, nonce = false } = {}) {
  if (!value) return ['no Content-Security-Policy']
  // Two policies sent at once come back joined by a comma, and both apply.
  if (value.includes(',')) return ['more than one Content-Security-Policy']
  const directives = new Map(
    value
      .split(';')
      .map((part) => part.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...sources]) => [name.toLowerCase(), sources]),
  )
  const scripts = directives.get('script-src') ?? directives.get('default-src') ?? []
  const styles = directives.get('style-src') ?? directives.get('default-src') ?? []
  return [
    directives.get('default-src')?.join(' ') !== "'self'" && "default-src is not 'self'",
    directives.get('frame-ancestors')?.join(' ') !== "'none'" && "framing is not refused (frame-ancestors 'none')",
    directives.get('object-src')?.join(' ') !== "'none'" && "plugins are not refused (object-src 'none')",
    !directives.has('base-uri') && 'no base-uri',
    directives.get('form-action')?.join(' ') !== "'self'" && "forms may post elsewhere (form-action is not 'self')",
    scripts.includes("'unsafe-eval'") && "scripts may use eval ('unsafe-eval')",
    [...directives.values()].some((sources) => sources.includes('*') || sources.includes('http:') || sources.includes('https:')) &&
      'a directive allows any address',
    admin && scripts.includes("'unsafe-inline'") && "the admin allows inline scripts ('unsafe-inline')",
    admin && styles.includes("'unsafe-inline'") && "the admin allows inline styles ('unsafe-inline')",
    nonce && !scripts.some((source) => /^'nonce-[A-Za-z0-9+/=]{16,}'$/.test(source)) && 'the admin page has no nonce',
  ].filter(Boolean)
}

/**
 * What is wrong with one response's security headers. admin: an /admin
 * address; page: an HTML page there, which needs its own nonce.
 * @param {Headers} headers
 */
export function headerProblems(headers, { admin = false, page = false } = {}) {
  return [
    ...hstsProblems(headers.get('strict-transport-security')),
    ...cspProblems(headers.get('content-security-policy'), { admin, nonce: admin && page }),
    headers.get('x-content-type-options') !== 'nosniff' && 'no X-Content-Type-Options: nosniff',
    headers.get('x-frame-options') !== 'DENY' && 'no X-Frame-Options: DENY',
    !headers.get('referrer-policy') && 'no Referrer-Policy',
    !headers.get('permissions-policy') && 'no Permissions-Policy',
    headers.get('cross-origin-opener-policy') !== 'same-origin' && 'no Cross-Origin-Opener-Policy: same-origin',
    headers.has('x-powered-by') && 'X-Powered-By names the server software',
    admin && !/noindex/.test(headers.get('x-robots-tag') ?? '') && 'the admin is not marked noindex',
  ].filter(Boolean)
}

/** What is wrong with one Set-Cookie header. The admin's session cookie has the strictest rules. */
export function cookieProblems(header) {
  const [pair, ...rest] = header.split(';').map((part) => part.trim())
  const name = pair.slice(0, Math.max(0, pair.indexOf('=')))
  const attributes = new Map(
    rest.map((part) => {
      const at = part.indexOf('=')
      return at < 0 ? [part.toLowerCase(), ''] : [part.slice(0, at).toLowerCase(), part.slice(at + 1)]
    }),
  )
  const sameSite = attributes.get('samesite')?.toLowerCase()
  const admin = /wslatl_admin/.test(name)
  return [
    !attributes.has('secure') && `${name} is not Secure`,
    !attributes.has('httponly') && `${name} can be read by scripts (no HttpOnly)`,
    !sameSite && `${name} has no SameSite`,
    admin && sameSite !== 'strict' && `${name} is not SameSite=Strict`,
    admin && !name.startsWith('__Host-') && `${name} is not a __Host- cookie`,
    admin && attributes.get('path') !== '/' && `${name} is not on Path=/`,
    admin && attributes.has('domain') && `${name} names a Domain`,
    admin && Number(attributes.get('max-age') ?? Infinity) > 2 * 60 * 60 && `${name} lasts longer than two hours`,
  ].filter(Boolean)
}

/** True when a redirect goes to Cloudflare Access's own sign-in, on its own domain. */
function accessHost(location) {
  try {
    const { protocol, hostname } = new URL(location)
    return protocol === 'https:' && hostname.endsWith('.cloudflareaccess.com')
  } catch {
    return false
  }
}

/** Text for one cell of a Markdown table. */
const cell = (text) => String(text).replaceAll('|', '\\|').replaceAll('\n', ' ')

/** One TLS handshake: what was agreed, or why there was none. */
function handshake(host, options = {}) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, ...options }, () => {
      const result = { protocol: socket.getProtocol(), cert: socket.getPeerCertificate(), authorized: socket.authorized, error: socket.authorizationError }
      socket.end()
      resolve(result)
    })
    socket.setTimeout(15_000, () => socket.destroy(new Error('timed out')))
    socket.on('error', (error) => resolve({ error }))
  })
}

async function main() {
  const base = new URL(process.argv[2] ?? 'https://wslatl.com')
  const results = []
  const record = (check, problems, detail = '') =>
    results.push({ check, ok: problems.length === 0, detail: problems.length ? problems.join('; ') : detail })
  const get = (path, init = {}) => fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(20_000), ...init })

  const cookies = []
  const pages = [
    ['The home page', '/', {}],
    ['A page in another language', '/es/pricing', {}],
    ['A legal document', '/legal/privacy', {}],
    ['A page that does not exist', `/no-such-page-${Date.now()}`, {}],
    ['A share card', '/og?path=/pricing&locale=en', {}],
    ['The company profile', '/company.json', {}],
    ['robots.txt', '/robots.txt', {}],
  ]
  for (const [check, path, options] of pages) {
    try {
      const response = await get(path)
      cookies.push(...response.headers.getSetCookie())
      record(check, headerProblems(response.headers, options), `${response.status}, every header in place`)
      // The browser loads the page's scripts and styles from here too.
      if (path === '/') {
        const asset = /\/_next\/static\/[^"']+\.(?:js|css)/.exec(await response.text())?.[0]
        if (asset) {
          const file = await get(asset)
          await file.body?.cancel()
          record('A script or stylesheet of the page', headerProblems(file.headers), `${file.status}, every header in place`)
        }
      } else {
        await response.body?.cancel()
      }
    } catch (error) {
      record(check, [error.message])
    }
  }

  // The admin's sign-in page, the one page with a policy of its own. Behind
  // Cloudflare Access it is Cloudflare's sign-in instead, and an admin that
  // is switched off answers 404, both with no page of ours to check.
  try {
    const response = await get('/admin/login')
    cookies.push(...response.headers.getSetCookie())
    const location = response.headers.get('location') ?? ''
    if (response.status >= 300 && response.status < 400 && accessHost(location)) {
      record('The admin sign-in page', [], 'behind Cloudflare Access')
    } else if (response.status === 200) {
      const html = await response.text()
      const policy = response.headers.get('content-security-policy') ?? ''
      const nonce = /'nonce-([^']+)'/.exec(policy)?.[1]
      const unsigned = [...html.matchAll(/<script\b[^>]*>/gi)].filter(([tag]) => !nonce || !tag.includes(`nonce="${nonce}"`))
      record(
        'The admin sign-in page',
        [...headerProblems(response.headers, { admin: true, page: true }), unsigned.length && `${unsigned.length} scripts without the page's nonce`].filter(Boolean),
        '200, its own policy, every script carrying the nonce',
      )
    } else {
      await response.body?.cancel()
      record('The admin sign-in page', response.status === 404 ? [] : [`answered ${response.status}`], `${response.status}: the admin is off here`)
    }
  } catch (error) {
    record('The admin sign-in page', [error.message])
  }

  const cookieIssues = [...new Set(cookies)].flatMap(cookieProblems)
  record('Cookies', cookieIssues, cookies.length ? `${cookies.length} set, all Secure, HttpOnly and SameSite` : 'none set')

  if (base.protocol === 'https:') {
    try {
      const plain = await fetch(`http://${base.host}/`, { redirect: 'manual', signal: AbortSignal.timeout(20_000) })
      await plain.body?.cancel()
      const location = plain.headers.get('location') ?? ''
      record(
        'Plain HTTP',
        [301, 302, 307, 308].includes(plain.status) && location.startsWith(`https://${base.host}/`) ? [] : [`http://${base.host}/ answered ${plain.status}${location ? ` to ${location}` : ''}`],
        `${plain.status} to ${location}`,
      )
    } catch (error) {
      record('Plain HTTP', [error.message])
    }

    const modern = await handshake(base.hostname)
    if (modern.cert) {
      const days = Math.floor((new Date(modern.cert.valid_to).getTime() - Date.now()) / 86_400_000)
      const bits = modern.cert.bits ?? 0
      const elliptic = Boolean(modern.cert.asn1Curve || modern.cert.nistCurve)
      record(
        'TLS certificate',
        [
          !modern.authorized && `not trusted: ${modern.error}`,
          days < 14 && `${days} days left`,
          !elliptic && bits < 2048 && `a ${bits}-bit key`,
        ].filter(Boolean),
        `${days} days left, issued by ${modern.cert.issuer?.O ?? 'unknown'}, ${elliptic ? `EC ${modern.cert.nistCurve ?? modern.cert.asn1Curve}` : `RSA ${bits}`}`,
      )
      record('TLS version', ['TLSv1.2', 'TLSv1.3'].includes(modern.protocol) ? [] : [`agreed ${modern.protocol}`], modern.protocol)
    } else {
      record('TLS certificate', [modern.error?.message ?? 'no certificate'])
    }

    // Offered only TLS 1.0 and 1.1, the server must refuse. SECLEVEL=0 lets
    // this client offer them at all; whether it could is told apart from a
    // refusal by the error.
    const old = await handshake(base.hostname, { minVersion: 'TLSv1', maxVersion: 'TLSv1.1', ciphers: 'DEFAULT@SECLEVEL=0' })
    const unable = /no protocols available|unsupported protocol/i.test(old.error?.message ?? '') && !/alert/i.test(old.error?.message ?? '')
    if (old.protocol) record('TLS 1.0 and 1.1 refused', [`the server accepted ${old.protocol}: set Minimum TLS Version to 1.2 in Cloudflare (SSL/TLS, Edge Certificates)`])
    else record('TLS 1.0 and 1.1 refused', [], unable ? 'this machine cannot offer them, so not checked' : 'refused')
  }

  const failed = results.filter((result) => !result.ok)
  console.log(`## Security headers and TLS: ${base.origin}\n`)
  console.log(failed.length ? `**${failed.length} of ${results.length} checks failed.**\n` : `All ${results.length} checks passed.\n`)
  console.log('| Check | Result | Detail |\n| --- | --- | --- |')
  for (const result of results) console.log(`| ${result.check} | ${result.ok ? 'Pass' : '**Fail**'} | ${cell(result.detail)} |`)
  console.log(`\nChecked ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC. Passive: GET requests and TLS handshakes only.`)
  process.exit(failed.length ? 1 : 0)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()

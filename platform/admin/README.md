# platform/admin/

The admin every app shares: the sign-in card, the header and page around signed-in pages, the Updates page with its release notes, the notices, sign-out, and the server side behind them. It looks exactly like the main website's admin, and it lives at `/admin` in every app.

An app adds a few short files under `app/admin/` that re-export from here, and the kit does the rest. Where these say `@/platform/`, use the path from the file to the app's `platform/` folder if `@/` is not the app's root (the notification site maps `@/` to `src/`).

## On the shared password

`admin: { auth: 'password' }` in `platform.config.mjs`: the main website, the knowledge base and the notification site. The notification site uses it so the owner can still sign in when mail is down.

| File in the app | What it holds |
| --- | --- |
| `app/admin/layout.tsx` | `import '../globals.css'`<br>`export { default, metadata, viewport } from '@/platform/admin/pages/layout'` |
| `app/admin/(signed-in)/layout.tsx` | `export { default } from '@/platform/admin/pages/signed-in-layout'` |
| `app/admin/(signed-in)/page.tsx` | `export { default, generateMetadata } from '@/platform/admin/pages/updates'` |
| `app/admin/login/page.tsx` | `export { default, generateMetadata } from '@/platform/admin/pages/login'` |
| `app/admin/not-found.tsx` | `export { default, metadata } from '@/platform/admin/pages/not-found'` |
| `app/admin/error.tsx` | `'use client'`<br>`export { default } from '@/platform/admin/pages/error'` |
| `app/admin/[...missing]/page.tsx` | `export { default, generateMetadata } from '@/platform/admin/pages/missing'` |
| `app/admin/api/login/route.ts` | `export { GET, POST } from '@/platform/admin/routes/login'` |
| `app/admin/api/logout/route.ts` | `export { GET, POST } from '@/platform/admin/routes/logout'` |
| `app/admin/api/update/route.ts` | `export { GET, POST } from '@/platform/admin/routes/update'` |
| `app/admin/api/adopt-updater/route.ts` | `export { GET, POST } from '@/platform/admin/routes/adopt-updater'` |

`app/admin/layout.tsx` is a root layout, beside the public site's own, so the app has no `app/layout.tsx` above both. `(signed-in)` is a route group: it adds nothing to the address.

An admin with more pages than Updates, as the knowledge base's has, puts its own overview at `app/admin/(signed-in)/page.tsx`, the Updates page at `app/admin/(signed-in)/updates/page.tsx`, and lists them in `admin.nav`. Its own pages call `admin.signedInPage()` first. Its own routes make one call first, `admin.signedInRoute(request)` for a GET and `admin.signedInPost(request)` for a POST, which checks in this order: a 404 while the admin is off, whatever is sent; then where the request came from and what it holds; then who is signed in. Never call `checkPost()` before it: on its own it answers a malformed request with a 403, 415 or 413 even while the admin is off, which tells a prober the admin is there. `signedInPost` takes `{ maxBytes }` for a route that takes more than 4 KB, and hands back the body. Both hand back `settings`, in which `github` is null while updates are off and `updatesOff` says why, so a route that uses the token itself (the knowledge base's saving to its repository, say) checks it first:

```ts
import { admin } from '@/platform/admin/app'

export async function POST(request: Request) {
  const checked = await admin.signedInPost(request, { maxBytes: 64 * 1024 })
  if ('response' in checked) return checked.response
  const { user, settings, body } = checked
  // ...
}
```

**Moving onto the kit:** the password is normalised to NFC before scrypt, so one hashed by older code that did not do that, with a decomposed accent or a character such as the Angstrom sign, stops matching until it is hashed again with `npm run admin:hash`.

## On the app's own accounts

`admin: { auth: 'custom' }`: the status site, whose staff accounts have 2FA. The app writes its check once, as an `AdminAuth`:

```ts
// lib/admin.ts
import 'server-only'
import config from '@/platform.config.mjs'
import { createAdmin, type AdminAuth } from '@/platform/admin/server'

const staffCheck: AdminAuth = {
  kind: 'custom',
  // Each problem names a setting, never its value. While there is one, every admin address answers 404.
  problems: (env) => (env.SQLITE_PATH ? [] : ['SQLITE_PATH is not set.']),
  // Who sent the request, or null. A bad, forged or expired cookie is null, never an error.
  async user(request) {
    const staff = await staffFromSession(request.cookie('status_session'))
    return staff ? { name: staff.email, mayUpdate: staff.role === 'superadmin' } : null
  },
  signInPath: '/admin/sign-in',
  signOutPath: '/admin/api/sign-out',
}

export const admin = createAdmin({ config, auth: staffCheck })
```

`user()` gets the request's headers and its cookies (`request.cookie(name)`), and `.env` as `env`. `name` goes into the server log and the update request. `mayUpdate: false` lets an account see the Updates page but not install or copy anything. Left out, the sign-in page is `/admin/login` and Sign out posts to `/admin/api/logout`.

| File in the app | What it holds |
| --- | --- |
| `app/admin/layout.tsx`, `not-found.tsx`, `error.tsx`, `[...missing]/page.tsx` | The same as on the shared password |
| `app/admin/(signed-in)/layout.tsx` | `import { admin } from '@/lib/admin'`<br>`export default admin.SignedInLayout` |
| `app/admin/(signed-in)/updates/page.tsx` | `import { admin } from '@/lib/admin'`<br>`export default admin.Updates`<br>`export const generateMetadata = admin.updatesMetadata` |
| `app/admin/api/update/route.ts` | `import { admin } from '@/lib/admin'`<br>`export const { GET, POST } = admin.routes.update` |
| `app/admin/api/adopt-updater/route.ts` | `import { admin } from '@/lib/admin'`<br>`export const { GET, POST } = admin.routes.adoptUpdater` |

The app keeps its own sign-in page and its own sign-in and sign-out routes. Its sign-in page sits on the same card as everyone's: `import { AdminCard } from '@/platform/admin/components/card'`. The kit's own sign-in and sign-out routes answer 404 for it, and so do the ready-made files under `pages/` and `routes/` that need a check, with the reason in the server log.

Its own cookies stay its own: the shared password's session cookie and the ended sessions (below) are the shared password's alone. Everything else here holds for it too, the proxy's HTTPS redirect and the admin's Content Security Policy included, so its own pages under `/admin` may have no inline `style` attribute and no `<script>` or `<style>` that Next did not write. Its `instrumentation.ts` checks its own admin as the server starts:

```ts
import { serverStarting } from '@/platform/admin/instrumentation'

export async function register() {
  if (!serverStarting()) return
  const { admin } = await import('@/lib/admin')
  await admin.settings()
}
```

## Elsewhere in the app

- **`next.config.mjs`**: `import { adminHeaders, buildInfoEnv, outsideAdmin } from './platform/admin/next.mjs'`, then `env: buildInfoEnv()` and `...adminHeaders()` in `headers()`. The first writes the release and commit into the build, and nothing else; the second keeps every admin address out of search. The app's own Content-Security-Policy goes on `{ source: outsideAdmin }`, never on `/:path*`: the admin gets a stricter one from the proxy, and two policies on one page would both apply. Its other security headers can stay on `/:path*`.
- **`proxy.ts`**, first thing, `secureRequest` from `@/platform/admin/proxy`, with the app's own address:

  ```ts
  import { NextResponse, type NextRequest } from 'next/server'
  import platform from './platform.config.mjs'
  import { handOn, secureRequest } from '@/platform/admin/proxy'

  export function proxy(request: NextRequest) {
    const answered = secureRequest(request, { url: platform.url })
    if (answered) return answered
    // The app's own rewrites, if it has any, each with handOn(request).
    return NextResponse.next(handOn(request))
  }

  export const config = { matcher: ['/((?!_next/).*)'] }
  ```

  In order, it sends a visitor who came over plain HTTP to HTTPS, answers 405 to a request naming a Server Action and to any method but GET and HEAD (except a POST to the admin's routes), and lets an admin page or route through with the admin's Content Security Policy and a fresh nonce (below). For a public page it gives null, and the app goes on, passing `handOn(request)` to every `NextResponse.next()` and `NextResponse.rewrite()`: it drops a Content-Security-Policy header the visitor sent, which Next would otherwise take a page's nonce from. The matcher must cover every page and the admin. An app with POST routes of its own passes them all: `secureRequest(request, { url: platform.url, postRoutes: [...adminPostRoutes, '/admin/api/guides/save'] })`. Its rewrites leave the admin alone: `isAdminPath(pathname)`. `redirectToHttps` and `refuseUnsafeRequests` are there on their own too, for a proxy that needs the steps apart.
- **An app that uses Server Actions on purpose**, as the status site does, names the addresses whose pages post them: `secureRequest(request, { url: platform.url, serverActions: ['/admin'] })`, each with everything under it (`['/']` is every page). There, a POST naming a Server Action gets through once it shows it came from a page on the same site (Origin, and Sec-Fetch-Site when the browser sends it), and gets a 403 otherwise. Anywhere else, and by any other method, it is still a 405, and so is a form that posts an action before its page's script has run. Every other rule stays as it was.
- **`instrumentation.ts`** at the app's root, on the shared password: `export { register } from '@/platform/admin/instrumentation'`. It checks the admin's settings once, as the server starts, so a problem is in the log before anyone visits `/admin`. With its own accounts, or a `register()` of its own, the app calls `serverStarting()` and its admin's `settings()` there (above).
- **`package.json`**: `"admin:hash": "node platform/admin/hash-password.mjs"`.
- **`.env`**: `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` (both from `npm run admin:hash`, shared password only; the secret is 32 characters at least), `GITHUB_TOKEN` (fine-grained, on the app's repository alone: Contents read-only for updates, or Contents read and write for an admin that also saves to the repository, as the knowledge base's does), and `GITHUB_REPO` only to read another repository than `platform.config.mjs` names. The first two are what signing in needs; the GitHub ones are for updating alone.
- **The stylesheet** already has `@source '../platform'`, which covers the admin's classes.
- **robots.txt** never names `/admin`, and the sitemap leaves it out.

## `admin` in platform.config.mjs

| Setting | What it does |
| --- | --- |
| `auth` | `"password"` or `"custom"`, as above. |
| `nav` | The admin's own pages, as `[{ href: '/admin/guides', label: 'Guides' }]`. Left out, the header lists none, as on the main website. |
| `wide` | `true` for pages 72rem wide instead of 56rem, for an admin with tables. |
| `signInText` | The line on the sign-in card. "Sign in to update the site." unless set. |

## What it keeps to

- **Off until signing in is set up.** Every admin page and route answers 404, and every page's title with it, until what signing in needs is there and well formed: on the shared password, `ADMIN_PASSWORD_HASH` made by `npm run admin:hash` and an `ADMIN_SESSION_SECRET` of 32 characters at least; on an app's own accounts, whatever its `problems()` names. The settings are checked as the server starts (`instrumentation.ts`) and on every request, and the reasons go to the server log once, each naming the setting and never its value.
- **Updates off, the rest on.** The GitHub settings matter for updating alone: a token, `GITHUB_REPO` as owner/name the way GitHub allows them, and an https `GITHUB_API_URL` with nothing after the host but a path, the same rule as the supervisor's. While one is missing or broken (a token run out, say, during an outage), every other admin page and route works as usual. The Updates page says updates are off and why, shows what is installed, offers nothing and asks GitHub nothing, and the update and adopt-updater routes answer 503 with the same reasons and do nothing, to whoever is signed in; anyone else gets the usual 401. It is logged once, as "updates are off".
- **The sign-in lockout.** 5 attempts per address and 30 from everyone every 15 minutes, in a sliding window. Counted before the password is checked, and keyed on `CF-Connecting-IP` alone: `X-Forwarded-For` is never read. An IPv6 address counts by its /64, and every request without a Cloudflare address shares one count. At most 2 password checks run at once. The owner's own sign-in never uses up the count.
- **A known browser is never locked out by others.** Anyone can fill the 30 by guessing from many addresses, so every sign-in sets a device cookie, `admin_device`, after OWASP's device cookies. A sign-in from a browser carrying one the site signed skips both limits above and has its own instead, 5 every 15 minutes, so a stolen one still cannot guess fast. A cookie that was changed, made up, signed with other settings, or is more than 180 days old counts as none. Its key is derived from `ADMIN_SESSION_SECRET` and the password hash, apart from the session's key, so changing either ends every browser's standing. It is HttpOnly, Secure, SameSite=Strict, only on `/admin`, set fresh at every sign-in for 180 days, kept on sign-out, and opens nothing by itself. Its name, shape and key are the main website's own, so a browser that site knows stays known when it moves onto the kit, as long as both make the id the same way: 4 bytes of the time it was made, in seconds, then 12 random bytes.
- **`CF-Connecting-IP` is only as good as the firewall.** Cloudflare sets it on every request it passes on, but anyone who reaches the server directly can write any address there, and dodge the per-address limit. It can be trusted only while the server takes connections from Cloudflare alone, which is the owner's to set (below).
- **Passwords and sessions.** scrypt, compared in constant time. The session is one signed cookie, `__Host-wslatl_admin`: HttpOnly, Secure, SameSite=Strict, `Path=/`, no Domain and Max-Age 7200, so no other site under the same domain can set or replace it. Its value is `<payload>.<signature>`: base64url JSON `{ iat, exp, sid }`, `sid` being 16 random bytes, and HMAC-SHA256 of the payload, keyed by HMAC-SHA256 of the password hash under `ADMIN_SESSION_SECRET`, compared in constant time. It opens nothing when it is over 512 characters, not exactly two parts of base64url, signed in any spelling but the 43 characters the server writes, issued more than 60 seconds ahead, run out, longer-lived than 7200 seconds, or without a session id. Changing the password or the secret signs everyone out. The name, the shape and the key are the main website's own.
- **Signing out ends the session on the server.** The session's id is recorded until it would have run out anyway, in memory and in `ended-sessions.json` in `UPDATER_DIR` (written whole beside its place, then renamed in), and every session check refuses a recorded id. So a copy of the cookie taken before opens nothing after, across a restart too; started without the supervisor, the list lasts as long as the process. Sign-out clears the session cookie and keeps `admin_device`.
- **HTTPS before anything else.** A visitor who reached Cloudflare over plain HTTP (its `CF-Visitor` header says `"scheme":"http"`) gets a 308 to the same path and query on HTTPS, on the host in the app's own `url`, never the request's Host, so the redirect cannot be bent to another site.
- **Its own Content Security Policy.** Every admin page and route gets the admin's policy from the proxy, with a nonce of 128 random bits that is new for every request: no inline script or style without the nonce, no eval, nothing from another site, no frames (`frame-ancestors 'none'`), `base-uri 'none'` and `object-src 'none'`. Next stamps the nonce on its own scripts. The proxy's own answers on an admin address carry the policy without a nonce. The public pages are built once, the same for everyone, so they cannot carry a nonce, and keep the app's own policy.
- **Every POST** must come from a page on the same site (Origin, and Sec-Fetch-Site when the browser sends it), as JSON, as an object, and 4 KB at most, before any cookie is read, and only once the admin is on: while it is off, every admin address answers 404 to anything at all, an app's own routes included through `signedInRoute` and `signedInPost`. **Every GET that reads something** (the update status, and an app's own routes through `signedInRoute`) is refused with a 403 when another site's page asked for it.
- **Every answer from a route** carries `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`. Every page carries a robots meta tag, and next.mjs adds the header.
- **Nothing public names the admin.** Nothing outside `platform/admin/` imports it, so no public page's script carries any of it.
- **Release notes** are read from their Markdown into React elements, never handed over as HTML, and only https, http and mailto addresses become links.

## The updater's files

The Updates page reads `state.json` in the folder the supervisor names in `UPDATER_DIR`, and asks for an update by writing `request.json` there: `{ "requestedAt": "<ISO time>", "by": "<who asked>" }`. It is written whole beside its place and then linked in under its name, which never happens over a file already there, so the supervisor never reads half a file and many presses at the same moment ask once. Both files keep the format the supervisor has always used. The admin keeps one file of its own there, `ended-sessions.json`: the sessions a sign-out ended, by id, each until it would have run out anyway (the main website's own file and format). "Copy the new updater" copies `scripts/serve.mjs` and everything in `scripts/updater/` from `.updater/releases/<tag>/scripts/` over the uploaded folder's, one copy at a time, keeping the old ones in `.updater/updater-backup/`.

## For the owner

Settings outside the code, for every app's domain and server, as the main website's `SECURITY.md` has them:

- **Cloudflare, Always Use HTTPS: on** (SSL/TLS, Edge Certificates). The proxy sends plain-HTTP visitors to HTTPS as well, but the edge is the right place, and the HSTS preload list needs it.
- **Cloudflare, Minimum TLS Version: TLS 1.2**, on the same page.
- **Cloudflare, SSL/TLS encryption mode: Full (strict).** `npm run serve` answers plain HTTP, so unless something in front of it speaks HTTPS, the password and the session cross the internet unencrypted between Cloudflare and the server. Full (strict) needs a TLS proxy with a Cloudflare Origin CA certificate in front of `npm run serve`, or a Cloudflare Tunnel, which also hides the server's address.
- **Let only Cloudflare reach each server.** At the server's firewall, or the host's, allow connections to the site's port from Cloudflare's address ranges alone (cloudflare.com/ips lists them), and nothing else, or use the Tunnel, which needs no open port. Until then, anyone who finds the server's own address can send any `CF-Connecting-IP` and get around the per-address sign-in limit. The limit everyone shares, and each known browser's own, still hold.
- **Cloudflare Access in front of `/admin`.** Nobody else then reaches the sign-in at all, and nobody can fill the limit everyone shares.
- **A Cloudflare WAF rule** that blocks every method but GET, HEAD and POST (Security, WAF, Custom rules), which turns `TRACE` and the rest away before they reach the server. Next answers `TRACE` itself, with a bare 500, before the proxy sees it.
- **HSTS preload**, once Always Use HTTPS is on and every subdomain answers HTTPS: submit wslatl.com at hstspreload.org. It is slow to undo, so only once every subdomain is ready.
- **The server's disk** encrypted by the host, and `.env` readable by the server's own user only (`chmod 600 .env`).

The GitHub side, which decides what the updater may install, is under "For the owner" in `updater/README.md`, in the kit's repository.

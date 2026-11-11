# Security

## Reporting a problem

If you find a way to break into this site, its admin or its updates, please tell us privately first, before anyone else.

- **On GitHub:** the repository's Security tab, then **Report a vulnerability**. Only the maintainers see it.
- **By email:** write to support at wslatl.com, with "Security" in the subject.

Please do not open a public issue for it. Tell us what you found, how to make it happen, and what it lets someone do. We aim to answer within a few days and to keep you posted while we fix it, and the release that fixes it says so, with your name if you would like that. Please only ever test against a copy you run yourself (`npm run build` and `npm start`, see the README), never against wslatl.com or its visitors.

## What there is to attack, and what stops it

The site is two things. The public pages are built ahead of time, the same for everyone, and take no input. The admin at `/admin` holds a password-protected session and can install a GitHub release on the server, so it is where nearly all the risk is. Each line below says what an attacker could try, what stops it, and the test that tries it.

| Who and where | What they could try | What stops it | Tested by |
| --- | --- | --- | --- |
| Anyone, the public pages | Run a script on the page (XSS), frame it, trick the browser into reading a file as something else | No page shows anything a visitor sent. React escapes all text. Every page, file, error and refusal has a Content Security Policy that refuses framing, plugins, eval and outside scripts, plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy` | `tests/http` (every kind of answer), the ZAP scan |
| Anyone, the network | Read or change traffic, or send a visitor to plain HTTP | HTTPS only. HSTS for two years, every subdomain, ready for preloading. A visitor who arrives over plain HTTP is sent to HTTPS before anything is answered | `tests/http`, `tests/attack/proxy.test.ts`, the weekly live check |
| Anyone, the share cards (`/og`) | Draw text of their own, reach a file through `path`, fill the server's memory | A card is looked up by exact page and language; anything else is a plain 404 that repeats nothing and keeps nothing | `tests/attack/og.test.ts`, `tests/attack/fuzz.test.ts` |
| Anyone, redirects and the language rewrite | Bend an address (`//evil.example`, `%5C`, `/en//...`) into a redirect to another site | The language prefix is a rewrite, never a redirect. Next's own redirects keep the path on this site | `tests/http` (thirty bent addresses), `tests/attack/proxy.test.ts` |
| Anyone, any address | Send a method other than a read, or name a Server Action | `proxy.ts` answers 405 to every method but GET and HEAD, and to every Server Action, apart from the admin's four POST routes | `tests/attack/proxy.test.ts`, `tests/attack/admin-routes.test.ts`, `tests/http` |
| Anyone, the admin sign-in | Guess the password | An scrypt hash checked in constant time. 5 attempts per address and 30 in all every 15 minutes, counted before the password is checked, two checks at a time. The address comes from Cloudflare's `CF-Connecting-IP` alone, so a made-up `X-Forwarded-For` cannot start the count over | `tests/attack/login.test.ts` |
| Anyone with many addresses | Fill the shared limit of 30 so the owner cannot sign in | OWASP's device cookies: a browser that has signed in before carries a cookie the site signed (`admin_device`: HttpOnly, Secure, SameSite=Strict, Path=/admin, 180 days, kept on sign-out), and its attempts are counted on their own, 5 per 15 minutes, instead of against the 30. A cookie the site did not sign, that was changed, or that is more than 180 days old by the time it carries, counts as none, and a new password ends every device's standing | `tests/attack/login.test.ts`, `tests/http` (a flood, then the owner's browser) |
| Anyone, the session | Forge, tamper with, replay or keep a session cookie | A signed `__Host-` cookie: HttpOnly, Secure, SameSite=Strict, the whole site, two hours. HMAC-SHA256 with a key made from the session secret and the password hash, compared in constant time, and only in the one spelling the server writes. Signing out ends the session for good, across a restart too | `tests/attack/session.test.ts`, `tests/http` |
| A page on another site | Make the owner's browser post to the admin (CSRF) | Every admin route refuses a request whose `Origin` or `Sec-Fetch-Site` is not this site, and takes JSON alone, which a form elsewhere cannot send. The cookie is SameSite=Strict besides | `tests/attack/admin-routes.test.ts`, `tests/http` |
| Whoever writes a release's notes | Run a script on the dashboard, which holds the session | The notes are read as Markdown and shown as text; only http, https and mailto links are made. The admin's pages get a fresh nonce on every request and run no other inline script | `tests/admin-release-notes.test.ts`, `tests/http` (hostile notes on the real dashboard) |
| The network between GitHub and the server | Change a release on its way, or slip a file into it (an `.npmrc` pointing npm elsewhere, say) | The tag is resolved as a tag, once, to its commit. Every file of the download is then checked against the git hash GitHub's API lists for it in that commit, and the download is refused if one differs, is missing or was added | `tests/attack/download.test.ts`, `tests/attack/supervisor.test.ts` |
| Whoever can name a tag | Name a folder outside `.updater/releases/` with the tag (`../../`) | Only `vMAJOR.MINOR.PATCH` is ever used, checked before GitHub is asked for anything | `tests/attack/download.test.ts`, `tests/attack/admin-routes.test.ts` |
| The owner, twice at once | Start two updates, or two copies of the updater | One request file, made only if none is there; one copy of the updater at a time | `tests/attack/admin-routes.test.ts`, `tests/http` |
| Anyone, everywhere | Find the GitHub token, the password hash or the session secret | Read on the server only, per request, in `server-only` modules, never baked into the build. Sent to GitHub's API over HTTPS and nowhere else; with any other address the admin and updates stay off. Never in an answer or a log line | `tests/attack/secrets.test.ts`, `tests/http`, `npm run scan:build`, the gitleaks scan |
| A package the site uses | Bring in known-bad code | `npm audit` daily, Dependency review on every pull request, CodeQL, and Dependabot waiting three days before offering a new version. The updater's `npm ci` runs no install scripts and gets none of the settings | `.github/workflows/audit.yml` and the others |

**The one thing no code here can stop:** anyone who can publish a release of `wslatl/wslatl.com` can run code on the server, because the updater builds what the release holds. The GitHub account and the repository's settings are the real front door (see below).

### Risks taken on purpose

- **The public pages allow inline scripts.** Next writes each page's data into it as inline scripts, and a page built once cannot carry a per-request nonce. No public page shows anything a visitor sent, which is what would make that dangerous. The admin, which holds the session, has a nonce and no inline scripts or styles.
- **A browser that never signed in can be locked out.** The overall limit stops the password being guessed however many addresses are used, and someone with a handful of addresses can fill it. A browser with a device cookie is not held up by that, but a new browser, or any browser after the password changes, is, until the flood stops. Cloudflare Access in front of `/admin` closes this too (README, setup step 7).
- **The per-address limit trusts `CF-Connecting-IP`.** Cloudflare sets that header itself on every request it passes on, but anyone who reaches the server's port directly can write any address in it, and so get a fresh count for every guess (the overall limit still holds them to 30). It is only trustworthy when the server accepts connections from Cloudflare's addresses alone: item 4 below.
- **`TRACE` requests get a bare 500.** Next refuses the method before `proxy.ts` sees it. Nothing of the request is sent back, so it cannot be used to read a cookie. A Cloudflare rule can turn such requests away at the edge (below).
- **Next's own redirects carry none of the security headers.** The redirects of moved pages and short links (`next.config.mjs`) are sent without the headers the pages get. They have no content to protect, and the page each one leads to has every header; Cloudflare's own HSTS setting (SSL/TLS, Edge Certificates) can add HSTS to them at the edge.

## Encryption

- **On the way to visitors:** HTTPS only, through Cloudflare. HSTS (`max-age=63072000; includeSubDomains; preload`), and a redirect to HTTPS for anyone who comes over plain HTTP.
- **To GitHub:** HTTPS only. The token goes in the `Authorization` header to the API address in `.env`, which must be HTTPS, and is dropped when GitHub sends a download on to its download servers.
- **The password:** scrypt (N=32768, r=8, p=1) with a 16-byte random salt, and a 32-byte key compared in constant time.
- **The session:** HMAC-SHA256. Its key is made from `ADMIN_SESSION_SECRET` (32 characters at least, checked when the server starts; `npm run admin:hash` makes one of 256 random bits) and the password hash together.
- **Releases:** every file checked against GitHub's record of the commit before it is built.
- **At rest:** `.env` on the server's disk. Encrypting that disk is up to the host (below).

## Left for the owner

These are settings outside this repository. A run of the live check (`npm run check:security https://wslatl.com`) on 2026-11-11 found the first two.

1. **Cloudflare, Always Use HTTPS: on.** `http://wslatl.com/` answers 200 today instead of moving to HTTPS. This release redirects from the site itself, but the edge is the right place, and it is needed for the HSTS preload list. SSL/TLS, Edge Certificates.
2. **Cloudflare, Minimum TLS Version: TLS 1.2.** TLS 1.1 is still accepted today. Same page.
3. **Cloudflare, SSL/TLS encryption mode: Full (strict).** `npm run serve` answers plain HTTP, so unless something in front of it speaks HTTPS, Cloudflare reaches the server in Flexible mode, and everything between the two, the admin's password and session included, crosses the internet unencrypted. Full (strict) needs the server to answer HTTPS with a certificate Cloudflare trusts: a Cloudflare Origin CA certificate on a TLS proxy in front of `npm run serve`, or a Cloudflare Tunnel, which also hides the server's address.
4. **Only Cloudflare reaches the server.** Accept connections to the server's port from [Cloudflare's addresses](https://www.cloudflare.com/ips/) alone, in the host's firewall (or use the Tunnel, which needs no open port at all). Until then `CF-Connecting-IP` is only as honest as whoever connects, and the per-address sign-in limit can be dodged by anyone who finds the server's address.
5. **Cloudflare Access in front of `/admin`** (README, setup step 7). Nobody else then reaches the sign-in at all.
6. **A Cloudflare WAF rule** that blocks any method but GET, HEAD and POST (Security, WAF, Custom rules), which turns `TRACE` and the rest away before they reach the server.
7. **HSTS preload:** once 1 is on and every subdomain answers HTTPS, submit wslatl.com at [hstspreload.org](https://hstspreload.org). It is slow to undo, so only once every subdomain is ready.
8. **The server's disk:** encrypted by the host, and `.env` readable by the server's own user only (`chmod 600 .env`).
9. **GitHub:** two-factor sign-in for everyone with write access; a ruleset on `main` (pull requests, signed commits) and one on tags `v*` so only the owner can create them; immutable releases (Settings, General, Releases); secret scanning with push protection, and private vulnerability reporting (Settings, Code security), which the link at the top of this page needs.
10. **The GitHub token:** fine-grained, Contents read-only on this one repository, with an expiry. Make a new one when it expires, and at once if `.env` may have been seen.

## The checks that run

| Where | What |
| --- | --- |
| `npm test`, CI | The attack tests in `tests/attack/`: the sign-in, the session, every admin route, the share cards, the proxy, the updater's downloads and the supervisor, and fuzzing of every route handler |
| `npm run test:http`, CI | The same attacks against a build run by `next start` (`tests/http/`): every header on every kind of answer, the session through the real server, redirects, methods, and no secret in any answer or in the server's log |
| `npm run scan:build`, CI | No secret anywhere in the build, no email address in what it serves |
| Security workflow | gitleaks over every commit (the findings reviewed and set aside are in `.gitleaksignore`, one by one); the ZAP baseline scan of a build, failing on medium risk or worse (exceptions in `.github/zap/rules.tsv`, each with its reason); every Monday, the live site's headers and TLS (`scripts/check-security.mjs`), opening an issue when one fails |
| Others | Security audit, CodeQL, Dependency review and Dependabot, as the README's Automation section says |

The attack tests talk to the site through `tests/attack/site.ts` alone, by request and response. When the admin moves into the shared kit, that file is what changes, and the tests must pass against the kit as they are.

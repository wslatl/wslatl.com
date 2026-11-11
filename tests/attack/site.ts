import { randomBytes } from 'node:crypto'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { vi } from 'vitest'
import { adminHash } from './admin-hash'
import * as adoptUpdater from '@/app/admin/api/adopt-updater/route'
import * as login from '@/app/admin/api/login/route'
import * as logout from '@/app/admin/api/logout/route'
import * as update from '@/app/admin/api/update/route'
import * as companyProfile from '@/app/company.json/route'
import * as shareCard from '@/app/og/route'
import { proxy } from '@/proxy'

/**
 * The attack tests talk to the site the way anyone on the internet can:
 * a request goes in, a response comes out. This file is the only one that
 * knows how this repository is put together. It runs a request the way Next
 * does, proxy.ts first and then the route handler for the path, and it makes
 * the admin's settings the way the owner does, with npm run admin:hash.
 *
 * When the admin moves into the shared kit, this file is what changes: the
 * routes below, how the settings are made, and what a restart forgets. The
 * tests themselves stay as they are, and must pass against the kit's
 * version.
 *
 * Pages (HTML) are not rendered here. tests/http runs the same kind of
 * attacks against a real build, pages and headers included.
 */
export const origin = 'https://wslatl.com'

export const paths = {
  login: '/admin/api/login',
  logout: '/admin/api/logout',
  update: '/admin/api/update',
  adoptUpdater: '/admin/api/adopt-updater',
  shareCard: '/og',
  companyProfile: '/company.json',
} as const

type Handler = (request: NextRequest) => Response | Promise<Response>

const routes: Record<string, object> = {
  [paths.login]: login,
  [paths.logout]: logout,
  [paths.update]: update,
  [paths.adoptUpdater]: adoptUpdater,
  [paths.shareCard]: shareCard,
  [paths.companyProfile]: companyProfile,
}

/** Every admin route, with the methods it answers. */
export const adminRoutes = [
  { path: paths.login, methods: ['POST'] },
  { path: paths.logout, methods: ['POST'] },
  { path: paths.update, methods: ['GET', 'POST'] },
  { path: paths.adoptUpdater, methods: ['POST'] },
] as const

/** The request as Next hands it on once the proxy changed its headers (x-middleware-override-headers). */
function forwarded(request: NextRequest, answer: Response): NextRequest {
  const names = answer.headers.get('x-middleware-override-headers')
  if (names === null) return request
  const headers = new Headers()
  for (const name of names.split(',').filter(Boolean)) {
    const value = answer.headers.get(`x-middleware-request-${name}`)
    if (value !== null) headers.set(name, value)
  }
  return new NextRequest(request, { headers })
}

/**
 * Sends one request through the site. What the proxy answers itself (a 405)
 * comes straight back; otherwise the route handler answers, with the
 * headers the proxy added, as Next merges them. A method the handler does
 * not export is a 405, as Next answers it.
 */
export async function send(path: string, init: ConstructorParameters<typeof NextRequest>[1] = {}): Promise<Response> {
  // Joined as text, as the request line reaches the server: //evil.example
  // is a path on this site, not another site's address.
  const request = new NextRequest(`${origin}${path}`, init)
  const answer = proxy(request)
  if (answer.headers.get('x-middleware-next') !== '1' && !answer.headers.has('x-middleware-rewrite')) return answer
  const route = routes[request.nextUrl.pathname] as Partial<Record<string, Handler>> | undefined
  if (!route) throw new Error(`${request.nextUrl.pathname} is a page, which tests/http checks against a build`)
  const handler = route[request.method === 'HEAD' ? 'GET' : request.method]
  if (!handler) return new Response(null, { status: 405 })
  const response = await handler(forwarded(request, answer))
  for (const [name, value] of answer.headers) {
    if (!name.startsWith('x-middleware-') && !response.headers.has(name)) response.headers.set(name, value)
  }
  return response
}

/** The headers of a POST sent by a page on this site: JSON, same origin, through Cloudflare. */
export function fromThisSite(ip = '198.51.100.7'): Record<string, string> {
  return {
    host: 'wslatl.com',
    origin,
    'sec-fetch-site': 'same-origin',
    'content-type': 'application/json',
    'cf-connecting-ip': ip,
  }
}

export function post(path: string, body: unknown = {}, headers: Record<string, string> = {}): Promise<Response> {
  return send(path, {
    method: 'POST',
    headers: { ...fromThisSite(), ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

/** A read by a page on this site, which a browser sends with no Origin and no body. */
export function get(path: string, headers: Record<string, string> = {}): Promise<Response> {
  return send(path, {
    method: 'GET',
    headers: { host: 'wslatl.com', 'sec-fetch-site': 'same-origin', 'cf-connecting-ip': '198.51.100.7', ...headers },
  })
}

export type Admin = {
  password: string
  passwordHash: string
  secret: string
  token: string
  /** The uploaded folder, around the updater's. */
  siteDir: string
  /** The updater's folder, <site>/.updater, as `npm run serve` names it. */
  updaterDir: string
  /** Every secret, for checking that none of them ever comes back. */
  secrets: string[]
}

export { adminHash }

/**
 * Settings made for one test file alone: a fresh password with its hash and
 * session secret, a GitHub token, and a folder for the updater. Call it in
 * beforeAll, then setUp() in beforeEach and tearDown() in afterAll.
 */
export function makeAdmin(): Admin {
  const password = `attack-test-password-${randomBytes(9).toString('base64url')}`
  const { passwordHash, secret } = adminHash(password)
  const token = `canary-token-${randomBytes(18).toString('hex')}`
  const siteDir = mkdtempSync(join(tmpdir(), 'attack-site-'))
  return {
    password,
    passwordHash,
    secret,
    token,
    siteDir,
    updaterDir: join(siteDir, '.updater'),
    secrets: [password, passwordHash, secret, token],
  }
}

/** The admin on, with an empty updater folder, and as after a fresh start of the server. */
export function setUp(admin: Admin, env: Record<string, string> = {}) {
  rmSync(admin.updaterDir, { recursive: true, force: true, maxRetries: 3 })
  mkdirSync(admin.updaterDir, { recursive: true })
  // Only these settings: none left over from an earlier setUp.
  vi.unstubAllEnvs()
  vi.stubEnv('ADMIN_PASSWORD_HASH', admin.passwordHash)
  vi.stubEnv('ADMIN_SESSION_SECRET', admin.secret)
  vi.stubEnv('GITHUB_TOKEN', admin.token)
  vi.stubEnv('GITHUB_REPO', 'wslatl/wslatl.com')
  vi.stubEnv('UPDATER_DIR', admin.updaterDir)
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value)
  restart()
}

/**
 * What a restart of the server forgets: everything the admin keeps in
 * memory (login counts, sign-outs, a copy in progress). What it keeps on
 * disk stays.
 */
export function restart() {
  const memory = globalThis as unknown as Record<symbol, unknown>
  for (const key of Object.getOwnPropertySymbols(globalThis)) {
    if (key.description?.startsWith('wslatl.admin.')) delete memory[key]
  }
}

export function tearDown(admin: Admin) {
  vi.unstubAllEnvs()
  restart()
  rmSync(admin.siteDir, { recursive: true, force: true, maxRetries: 3 })
}

/** The names of the admin's two cookies: the session, and the browser's device cookie. */
export const cookieNames = { session: '__Host-wslatl_admin', device: 'admin_device' } as const

/** The whole Set-Cookie header a response gives for a cookie name, or ''. */
export function setCookieFor(response: Response, name: string): string {
  return response.headers.getSetCookie().find((header) => header.startsWith(`${name}=`)) ?? ''
}

/** The session cookie a response sets, as the name=value pair to send back. */
export function cookieFrom(response: Response): string {
  return setCookieFor(response, cookieNames.session).split(';')[0]
}

/** The device cookie a response sets, as the name=value pair to send back. */
export function deviceFrom(response: Response): string {
  return setCookieFor(response, cookieNames.device).split(';')[0]
}

/** Signs in with the password, and gives back the session and device cookies (name=value each). */
export async function signInFully(admin: Admin, headers: Record<string, string> = {}): Promise<{ session: string; device: string }> {
  const response = await post(paths.login, { password: admin.password }, headers)
  if (response.status !== 200) throw new Error(`Signing in answered ${response.status}`)
  return { session: cookieFrom(response), device: deviceFrom(response) }
}

/** Signs in with the password, and gives back the session cookie (name=value). */
export async function signIn(admin: Admin, headers: Record<string, string> = {}): Promise<string> {
  return (await signInFully(admin, headers)).session
}

/** Everything the server logs while fn runs, as text, and fn's result. */
export async function logsOf<T>(fn: () => Promise<T>): Promise<{ result: T; logs: string }> {
  const lines: string[] = []
  const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((level) => {
    const spy = vi.spyOn(console, level)
    // A test may already have quietened the console; it goes back to that after.
    const before = spy.getMockImplementation()
    spy.mockImplementation((...args: unknown[]) => {
      lines.push(args.map((arg) => (arg instanceof Error ? `${arg.message}\n${arg.stack}` : String(arg))).join(' '))
    })
    return { spy, before }
  })
  try {
    return { result: await fn(), logs: lines.join('\n') }
  } finally {
    for (const { spy, before } of spies) {
      if (before) spy.mockImplementation(before)
      else spy.mockRestore()
    }
  }
}

/** A response as text, status, every header and the body, to look for what must never be in one. */
export async function wholeResponse(response: Response): Promise<string> {
  const headers = [...response.headers].map(([name, value]) => `${name}: ${value}`).join('\n')
  const body = Buffer.from(await response.clone().arrayBuffer()).toString('latin1')
  return `${response.status}\n${headers}\n\n${body}`
}

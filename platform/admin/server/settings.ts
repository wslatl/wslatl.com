import 'server-only'
import { repoPattern } from '../../config.mjs'
import type { Locale } from '../../i18n/config'
import { isPasswordHash } from './password'
import type { SessionKeys } from './session'
import { say, type Said } from './text'

/**
 * The admin's settings, all from .env, read on every request and never at
 * build time. While one is missing or malformed, every admin page and route
 * answers 404 and the problems go to the server log, never to a page. Each
 * problem starts with the setting's name and says how to fix it, and none
 * ever holds a value.
 */
export type Env = Record<string, string | undefined>

export type GitHubSettings = { token: string; repo: string; apiUrl: string }

export const defaultApiUrl = 'https://api.github.com'
export const minSecretLength = 32

const read = (env: Env, name: string) => env[name]?.trim() ?? ''

// A stand-in for GitHub in tests runs locally. Anything else must be HTTPS,
// so the token never travels in the clear, with nothing after the host but a
// path. The same rule, and in English the same words, as apiAddressProblem
// in scripts/updater/github.mjs, so the admin and the supervisor agree on
// when updates are off; a test holds the two together.
function apiUrlProblem(value: string): Said | null {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return { key: 'apiHttps' }
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (!(url.protocol === 'https:' || (url.protocol === 'http:' && local))) return { key: 'apiHttps' }
  if (url.username || url.password || url.search || url.hash) return { key: 'apiPlain' }
  return null
}

/**
 * What the Updates page needs: a token that can read the app's releases.
 * The repository is the app's own (platform.config.mjs) unless GITHUB_REPO
 * names another, as owner/name the way GitHub allows them, the same rule as
 * repo in platform.config.mjs: nothing that would walk the API address up a
 * level.
 *
 * The problems are in English, as the server log has them, unless another
 * language is asked for, as the Updates page and its routes ask for the
 * admin's.
 */
export function githubSettings(env: Env, defaultRepo: string, locale: Locale = 'en'): { github: GitHubSettings | null; problems: string[] } {
  const token = read(env, 'GITHUB_TOKEN')
  const repo = read(env, 'GITHUB_REPO') || defaultRepo
  const apiUrl = (read(env, 'GITHUB_API_URL') || defaultApiUrl).replace(/\/+$/, '')
  const found: Said[] = []
  if (!token) found.push({ key: 'tokenMissing' })
  if (!repoPattern.test(repo)) found.push({ key: 'repoForm' })
  const apiProblem = apiUrlProblem(apiUrl)
  if (apiProblem) found.push(apiProblem)
  const problems = found.map((problem) => say(problem, locale))
  return problems.length ? { github: null, problems } : { github: { token, repo, apiUrl }, problems }
}

/** The shared password's two settings, which npm run admin:hash prints together. */
export function signInSettings(env: Env): { keys: SessionKeys | null; problems: string[] } {
  const passwordHash = read(env, 'ADMIN_PASSWORD_HASH')
  const secret = read(env, 'ADMIN_SESSION_SECRET')
  const problems: string[] = []
  if (!passwordHash) {
    problems.push('ADMIN_PASSWORD_HASH is not set. Run npm run admin:hash and put the two lines it prints in .env.')
  } else if (!isPasswordHash(passwordHash)) {
    problems.push('ADMIN_PASSWORD_HASH is not a hash from npm run admin:hash. Make a new one with it.')
  }
  if (!secret) {
    problems.push('ADMIN_SESSION_SECRET is not set. npm run admin:hash prints one with the password hash.')
  } else if (secret.length < minSecretLength) {
    problems.push(`ADMIN_SESSION_SECRET is shorter than ${minSecretLength} characters. Use the one npm run admin:hash prints.`)
  }
  return problems.length ? { keys: null, problems } : { keys: { passwordHash, secret }, problems }
}

import 'server-only'
import { isPasswordHash } from '@/lib/admin/password'

/**
 * The admin's settings, all from .env (README, "Admin and updates"). The
 * admin is on only when every required one is there and well formed;
 * otherwise every /admin page and API answers 404, and the problems are
 * logged, never shown. A problem names the setting, never its value.
 */
export type GitHubSettings = { token: string; repo: string; apiUrl: string }

export type AdminSettings =
  | { enabled: true; passwordHash: string; secret: string; github: GitHubSettings }
  | { enabled: false; problems: string[] }

export const defaultRepo = 'wslatl/wslatl.com'
export const defaultApiUrl = 'https://api.github.com'

type Env = Record<string, string | undefined>

/**
 * owner/name as GitHub allows them: an owner of letters, digits and inner
 * hyphens, and a name that is neither . nor .., which would walk the API
 * address up a level. The same as repoPattern in scripts/updater/github.mjs.
 */
const repoPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/(?!\.{1,2}$)[\w.-]+$/

// The stand-in for GitHub that the updater is tested against runs locally;
// anything else must be HTTPS so the token never travels in the clear.
function apiUrlProblem(value: string): boolean {
  try {
    const url = new URL(value)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    return !(url.protocol === 'https:' || (url.protocol === 'http:' && local))
  } catch {
    return true
  }
}

export function adminSettings(env: Env = process.env): AdminSettings {
  const read = (name: string) => env[name]?.trim() ?? ''
  const passwordHash = read('ADMIN_PASSWORD_HASH')
  const secret = read('ADMIN_SESSION_SECRET')
  const token = read('GITHUB_TOKEN')
  const repo = read('GITHUB_REPO') || defaultRepo
  const apiUrl = (read('GITHUB_API_URL') || defaultApiUrl).replace(/\/+$/, '')

  const problems: string[] = []
  if (!passwordHash) problems.push('ADMIN_PASSWORD_HASH is not set')
  else if (!isPasswordHash(passwordHash)) problems.push('ADMIN_PASSWORD_HASH is not a hash from npm run admin:hash')
  if (!secret) problems.push('ADMIN_SESSION_SECRET is not set')
  else if (secret.length < 32) problems.push('ADMIN_SESSION_SECRET is shorter than 32 characters')
  if (!token) problems.push('GITHUB_TOKEN is not set')
  if (!repoPattern.test(repo)) problems.push('GITHUB_REPO is not in the form owner/name')
  if (apiUrlProblem(apiUrl)) problems.push('GITHUB_API_URL is not an https address')

  if (problems.length) return { enabled: false, problems }
  return { enabled: true, passwordHash, secret, github: { token, repo, apiUrl } }
}

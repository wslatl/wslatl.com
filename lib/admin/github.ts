import 'server-only'
import type { GitHubSettings } from '@/lib/admin/settings'
import { isNewer, parseVersion } from '@/scripts/updater/release.mjs'

/**
 * What the dashboard shows from GitHub: the latest release and the installed
 * one. The updater installs releases only, never a branch, and only one
 * tagged vMAJOR.MINOR.PATCH that is newer than the installed one
 * (scripts/updater/release.mjs). Read-only; the download itself happens in
 * the supervisor (scripts/serve.mjs).
 */
export type Release = { tag: string; name: string; publishedAt: string; url: string; notes: string }

export type Overview = {
  latest: Release | null
  /** GitHub's page for the installed release, when the build names one and GitHub still has it. */
  installed: Release | null
  /**
   * no-releases: nothing published (drafts and pre-releases do not count).
   * bad-tag:     the latest release is not tagged vMAJOR.MINOR.PATCH.
   * update:      the latest release is newer, or the site was uploaded by hand.
   * up-to-date:  the latest release is the installed one.
   * older:       the release marked latest is older than the installed one.
   * withdrawn:   the latest release is the one a crash took back out
   *              (never installed again: the fix comes as a newer release).
   */
  status: 'no-releases' | 'bad-tag' | 'update' | 'up-to-date' | 'older' | 'withdrawn'
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status = 0,
  ) {
    super(message)
  }
}

type Fetch = typeof fetch
type RawRelease = {
  tag_name: string
  name: string | null
  body: string | null
  html_url: string
  published_at: string | null
  draft: boolean
  prerelease: boolean
}

const notesAtMost = 20_000

function problem(status: number, headers: Headers, gh: GitHubSettings): string {
  if (status === 401) return 'GitHub refused the token (401). Check GITHUB_TOKEN in .env and that it has not expired.'
  if ((status === 403 || status === 429) && headers.get('x-ratelimit-remaining') === '0') {
    return 'GitHub rate limit reached. Try again in a few minutes.'
  }
  if (status === 403) return `The token may not read ${gh.repo} (403). It needs Contents: Read-only on that repository.`
  if (status === 404) return `GitHub could not find ${gh.repo} (404). Check GITHUB_REPO, and that the token can read the repository.`
  return `GitHub answered ${status}.`
}

/** The response's JSON, or null for a 404. */
async function api<T>(gh: GitHubSettings, path: string, fetchImpl: Fetch, timeoutMs: number): Promise<T | null> {
  let response: Response
  try {
    response = await fetchImpl(`${gh.apiUrl}/repos/${gh.repo}${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${gh.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'wslatl-admin',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError'
    throw new GitHubError(timedOut ? `GitHub did not answer within ${timeoutMs / 1000} seconds.` : 'Could not reach GitHub.')
  }
  if (response.status === 404) return null
  if (!response.ok) throw new GitHubError(problem(response.status, response.headers, gh), response.status)
  return (await response.json()) as T
}

function toRelease(raw: RawRelease): Release {
  return {
    tag: raw.tag_name,
    name: raw.name || raw.tag_name,
    publishedAt: raw.published_at ?? '',
    url: raw.html_url,
    notes: (raw.body ?? '').slice(0, notesAtMost),
  }
}

/**
 * withdrawn names the release the updater took back out after it kept
 * stopping (the updater state's rolledBackFrom), which is never offered.
 */
export async function releaseOverview(
  gh: GitHubSettings,
  installedTag: string | null,
  fetchImpl: Fetch = fetch,
  timeoutMs = 10_000,
  withdrawn: string | null = null,
): Promise<Overview> {
  const [latestRaw, installedRaw] = await Promise.all([
    api<RawRelease>(gh, '/releases/latest', fetchImpl, timeoutMs),
    installedTag ? api<RawRelease>(gh, `/releases/tags/${encodeURIComponent(installedTag)}`, fetchImpl, timeoutMs) : null,
  ])
  // GitHub's "latest" never is a draft or a pre-release; checked anyway,
  // since either would be installed otherwise.
  const latest = latestRaw && !latestRaw.draft && !latestRaw.prerelease ? toRelease(latestRaw) : null
  const installed = installedRaw ? toRelease(installedRaw) : null

  if (!latest) {
    // No release yet, or no repository at all: only the second is an error.
    if (!latestRaw && !(await api(gh, '', fetchImpl, timeoutMs))) throw new GitHubError(problem(404, new Headers(), gh), 404)
    return { latest: null, installed, status: 'no-releases' }
  }
  if (!parseVersion(latest.tag)) return { latest, installed, status: 'bad-tag' }
  if (latest.tag === withdrawn) return { latest, installed, status: 'withdrawn' }
  if (!installedTag || isNewer(latest.tag, installedTag)) return { latest, installed, status: 'update' }
  return { latest, installed, status: latest.tag === installedTag ? 'up-to-date' : 'older' }
}

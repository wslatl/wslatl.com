import 'server-only'
import { isNewer, parseVersion } from '../version.mjs'
import type { GitHubSettings } from './settings'
import { say, type Said } from './text'

/**
 * What the Updates page shows from GitHub: the latest release and the
 * installed one. The updater installs releases only, never a branch, and
 * only a tag vMAJOR.MINOR.PATCH newer than the installed one. Read-only;
 * the download itself happens in the supervisor.
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
   * withdrawn:   the latest release is one a crash took back out, never
   *              installed again: the fix comes as a newer release.
   */
  status: 'no-releases' | 'bad-tag' | 'update' | 'up-to-date' | 'older' | 'withdrawn'
}

/** What went wrong asking GitHub: its message in English, and `said` to say it in the admin's language. */
export class GitHubError extends Error {
  constructor(
    readonly said: Said,
    readonly status = 0,
  ) {
    super(say(said))
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

function problem(status: number, headers: Headers, gh: GitHubSettings): Said {
  if (status === 401) return { key: 'refused' }
  if ((status === 403 || status === 429) && headers.get('x-ratelimit-remaining') === '0') return { key: 'rateLimit' }
  if (status === 403) return { key: 'forbidden', values: { repo: gh.repo } }
  if (status === 404) return { key: 'missingRepo', values: { repo: gh.repo } }
  return { key: 'answered', values: { status: String(status) } }
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
    throw new GitHubError(timedOut ? { key: 'timeout', values: { seconds: String(timeoutMs / 1000) } } : { key: 'unreachable' })
  }
  if (response.status === 404) return null
  if (!response.ok) throw new GitHubError(problem(response.status, response.headers, gh), response.status)
  return (await response.json()) as T
}

function toRelease(raw: RawRelease): Release {
  return {
    tag: String(raw.tag_name),
    name: raw.name || String(raw.tag_name),
    publishedAt: raw.published_at ?? '',
    url: String(raw.html_url ?? ''),
    notes: (raw.body ?? '').slice(0, notesAtMost),
  }
}

/** withdrawn names the releases the updater took back out after they kept stopping, which are never offered. */
export async function releaseOverview(
  gh: GitHubSettings,
  installedTag: string | null,
  fetchImpl: Fetch = fetch,
  timeoutMs = 10_000,
  withdrawn: readonly string[] = [],
): Promise<Overview> {
  const [latestRaw, installedRaw] = await Promise.all([
    api<RawRelease>(gh, '/releases/latest', fetchImpl, timeoutMs),
    installedTag ? api<RawRelease>(gh, `/releases/tags/${encodeURIComponent(installedTag)}`, fetchImpl, timeoutMs) : null,
  ])
  // GitHub's "latest" is never a draft or a pre-release; checked anyway,
  // since either would be installed otherwise.
  const latest = latestRaw && !latestRaw.draft && !latestRaw.prerelease ? toRelease(latestRaw) : null
  const installed = installedRaw ? toRelease(installedRaw) : null

  if (!latest) {
    // No release yet, or no repository at all: only the second is an error.
    if (!latestRaw && !(await api(gh, '', fetchImpl, timeoutMs))) throw new GitHubError(problem(404, new Headers(), gh), 404)
    return { latest: null, installed, status: 'no-releases' }
  }
  if (!parseVersion(latest.tag)) return { latest, installed, status: 'bad-tag' }
  if (withdrawn.includes(latest.tag)) return { latest, installed, status: 'withdrawn' }
  if (!installedTag || isNewer(latest.tag, installedTag)) return { latest, installed, status: 'update' }
  return { latest, installed, status: latest.tag === installedTag ? 'up-to-date' : 'older' }
}

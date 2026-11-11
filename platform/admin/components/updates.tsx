import { ArrowUpRight } from 'lucide-react'
import { deployedCommit, installedRelease } from '../server/build-info'
import { releaseOverview, type Overview, type Release } from '../server/github'
import type { GitHubSettings } from '../server/settings'
import { updaterStatus } from '../server/updater'
import { cn } from '../../lib/cn'
import { formatWhen, shortSha } from './format'
import { Badge, Notice, type Tone } from './notice'
import { ReleaseNotes, safeHref } from './release-notes'
import { UpdatePanel } from './update-panel'

/** What the latest release is to this site, shown beside it. */
const latestBadge: Record<Overview['status'], { tone: Tone | 'neutral'; label: string } | null> = {
  update: { tone: 'info', label: 'Ready to install' },
  'up-to-date': { tone: 'success', label: 'Installed' },
  older: { tone: 'neutral', label: 'Older than installed' },
  'bad-tag': { tone: 'warning', label: 'Not a version tag' },
  withdrawn: { tone: 'warning', label: 'Withdrawn' },
  'no-releases': null,
}

/** A link off the site: in a new tab, so a running update stays in view, and without the referrer or window.opener. */
function OutLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-link underline decoration-link/50 underline-offset-2 hover:text-foreground hover:decoration-current',
        className,
      )}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

/** One release: its tag big, its name, when it was published, and its page on GitHub. empty stands in when there is none. */
function ReleaseCard({
  id,
  heading,
  release,
  badge,
  details,
  empty,
}: {
  id: string
  heading: string
  release: Release | null
  badge?: { tone: Tone | 'neutral'; label: string } | null
  details?: React.ReactNode
  empty: React.ReactNode
}) {
  const published = release ? formatWhen(release.publishedAt) : ''
  // The address comes from GitHub, so it is linked only when it is an ordinary web address.
  const href = release ? safeHref(release.url) : null
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col rounded-xl border bg-card p-5">
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
        <h2 id={`${id}-heading`} className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {heading}
        </h2>
        {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
      </div>
      {release ? (
        <>
          <p className="mt-3 font-mono text-2xl font-semibold tracking-tight break-all">{release.tag}</p>
          {release.name !== release.tag && <p className="mt-1 text-sm break-words">{release.name}</p>}
          <dl className="mt-3 space-y-1 text-sm">
            {published && <Detail label="Published">{published}</Detail>}
            {details}
          </dl>
          {href && (
            <OutLink href={href} className="mt-auto self-start pt-4 text-sm">
              Release on GitHub
            </OutLink>
          )}
        </>
      ) : (
        empty
      )}
    </section>
  )
}

/** Where the site stands against GitHub's latest release, in one sentence. */
export function summary({ status, latest }: Overview, installed: string | null): string {
  switch (status) {
    case 'no-releases':
      return 'No releases published yet. Publish one on GitHub to install it here.'
    case 'bad-tag':
      return `The latest release is tagged ${latest?.tag}, not vMAJOR.MINOR.PATCH, so it cannot be installed.`
    case 'up-to-date':
      return 'The site runs the latest release.'
    case 'older':
      return `The release marked latest, ${latest?.tag}, is older than the installed ${installed}, so there is nothing to install.`
    case 'withdrawn':
      return `${latest?.tag} was taken back out after it kept stopping, so it is not offered again. Publish the fix as a newer release.`
    default:
      return installed
        ? `${latest?.tag} is ready to install.`
        : `${latest?.tag} is ready to install in place of the folder uploaded by hand.`
  }
}

/**
 * The page while a GitHub setting is missing or broken: why updates are off,
 * and what is installed, from the build itself. GitHub is not asked
 * anything, and nothing is offered to install.
 */
function UpdatesOff({ reasons, installedTag, commit }: { reasons: readonly string[]; installedTag: string | null; commit: string | null }) {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Updates</h1>
      <Notice tone="warning" title="Updates are off">
        {reasons.map((reason) => (
          <span key={reason} className="block">
            {reason}
          </span>
        ))}
        <span className="mt-2 block text-muted-foreground">
          Put {reasons.length === 1 ? 'it' : 'them'} right in <code className="font-mono">.env</code> and restart the server. Every
          other admin page works as usual.
        </span>
      </Notice>
      <ReleaseCard
        id="installed"
        heading="Installed"
        release={installedTag ? { tag: installedTag, name: installedTag, publishedAt: '', url: '', notes: '' } : null}
        details={
          commit && (
            <Detail label="Commit">
              <span className="font-mono">{shortSha(commit)}</span>
            </Detail>
          )
        }
        empty={<p className="mt-3 text-lg font-semibold">Uploaded by hand</p>}
      />
    </>
  )
}

/**
 * The Updates page's content: what is installed, GitHub's latest release,
 * the panel that installs it, and what it brings. The caller has already
 * checked who is signed in. github is null while updates are off, and
 * updatesOff says why.
 */
export async function Updates({
  github: settings,
  updatesOff = [],
  mayUpdate = true,
  fetchImpl = fetch,
}: {
  github: GitHubSettings | null
  updatesOff?: readonly string[]
  mayUpdate?: boolean
  fetchImpl?: typeof fetch
}) {
  const installedTag = installedRelease()
  const commit = deployedCommit()
  if (!settings) return <UpdatesOff reasons={updatesOff} installedTag={installedTag} commit={commit} />
  const { repo } = settings
  const updater = await updaterStatus()
  // A release a crash took back out is never offered again.
  const withdrawn = updater.state?.withdrawn ?? []
  const github = await releaseOverview(settings, installedTag, fetchImpl, 10_000, withdrawn).then(
    (overview) => ({ ok: true as const, overview }),
    (error: unknown) => ({ ok: false as const, error: error instanceof Error ? error.message : 'Could not read GitHub.' }),
  )
  const current = updater.state?.current?.tag === installedTag ? updater.state?.current : null
  // The installed release as GitHub has it, or as the build names it when
  // GitHub cannot say (a deleted release, GitHub out of reach).
  const installed: Release | null = installedTag
    ? (github.ok && github.overview.installed) || {
        tag: installedTag,
        name: installedTag,
        publishedAt: current?.publishedAt ?? '',
        url: `https://github.com/${repo}/releases/tag/${installedTag}`,
        notes: '',
      }
    : null
  const offer = github.ok && github.overview.status === 'update' ? (github.overview.latest?.tag ?? null) : null
  const blocked = github.ok && github.overview.status === 'up-to-date' ? 'Up to date' : 'Nothing to install'
  const latest = github.ok ? github.overview.latest : null
  const notes = github.ok && github.overview.status === 'update' && latest?.notes ? latest : null
  const deployedAt = current?.deployedAt ? formatWhen(current.deployedAt) : ''
  const commitDetail = commit && (
    <Detail label="Commit">
      <span className="font-mono">{shortSha(commit)}</span>
    </Detail>
  )

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Installs the latest release of <OutLink href={`https://github.com/${repo}/releases`}>{repo}</OutLink>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReleaseCard
          id="installed"
          heading="Installed"
          release={installed}
          details={
            <>
              {deployedAt && <Detail label="Installed">{deployedAt}</Detail>}
              {commitDetail}
            </>
          }
          empty={
            <>
              <p className="mt-3 text-lg font-semibold">Uploaded by hand</p>
              {commitDetail && <dl className="mt-2 space-y-1 text-sm">{commitDetail}</dl>}
            </>
          }
        />
        <ReleaseCard
          id="latest"
          heading="Latest release"
          release={latest}
          badge={github.ok ? latestBadge[github.overview.status] : null}
          empty={
            github.ok ? (
              <p className="mt-3 text-lg font-semibold">None published yet</p>
            ) : (
              <Notice tone="danger" title="Could not read GitHub" className="mt-3">
                {github.error}
              </Notice>
            )
          }
        />
      </div>

      <UpdatePanel
        initial={updater}
        offer={offer}
        blocked={blocked}
        summary={github.ok ? summary(github.overview, installedTag) : null}
        mayUpdate={mayUpdate}
      />

      {notes && (
        <section aria-labelledby="notes-heading" className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 id="notes-heading" className="text-base font-semibold">
            What {notes.tag} brings
          </h2>
          {/* At most about 70 characters a line, as the brand kit sets body text. */}
          <ReleaseNotes markdown={notes.notes} repo={repo} headingLevel={3} className="mt-4 max-w-prose" />
        </section>
      )}
    </>
  )
}

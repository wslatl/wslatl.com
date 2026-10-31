import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { connection } from 'next/server'
import { ExternalLink } from 'lucide-react'
import { formatWhen, shortSha } from '@/components/admin/format'
import { SignOut } from '@/components/admin/sign-out'
import { UpdatePanel } from '@/components/admin/update-panel'
import { siteConfig } from '@/config/site'
import { adminEnabled, signedInPage } from '@/lib/admin/auth'
import { deployedCommit, installedRelease } from '@/lib/admin/build-info'
import { releaseOverview, type Overview, type Release } from '@/lib/admin/github'
import { updaterStatus } from '@/lib/admin/updater'

export const metadata: Metadata = { title: 'Updates' }

function ReleaseLine({ release }: { release: Release }) {
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
      <a href={release.url} className="font-mono text-sm text-link hover:underline">
        {release.tag}
      </a>
      {release.name !== release.tag && <span className="min-w-0 truncate text-sm">{release.name}</span>}
      {release.publishedAt && (
        <span className="text-xs text-muted-foreground">published {formatWhen(release.publishedAt)}</span>
      )}
    </span>
  )
}

function summary({ status, latest }: Overview, installed: string | null): string {
  switch (status) {
    case 'no-releases':
      return 'No releases published yet. Publish one on GitHub to install it here (README, "Releasing").'
    case 'bad-tag':
      return `The latest release is tagged ${latest?.tag}, not vMAJOR.MINOR.PATCH, so it cannot be installed.`
    case 'up-to-date':
      return 'The site runs the latest release.'
    case 'older':
      return `The release marked latest, ${latest?.tag}, is older than the installed ${installed}, so there is nothing to install.`
    default:
      return installed
        ? `${latest?.tag} is ready to install.`
        : `${latest?.tag} is ready to install in place of the folder uploaded by hand.`
  }
}

export default async function AdminPage() {
  // Rendered per request, always: .env is read now, never at build time.
  await connection()
  const settings = adminEnabled()
  if (!settings) notFound()
  if (!(await signedInPage(settings))) redirect('/admin/login')

  const { repo } = settings.github
  const installedTag = installedRelease()
  const commit = deployedCommit()
  const [github, updater] = await Promise.all([
    releaseOverview(settings.github, installedTag).then(
      (overview) => ({ ok: true as const, overview }),
      (error: Error) => ({ ok: false as const, error: error.message }),
    ),
    updaterStatus(),
  ])
  const current = updater.state?.current?.tag === installedTag ? updater.state?.current : null
  // The installed release as GitHub has it, or as the build names it when
  // GitHub cannot say (a deleted release, GitHub out of reach).
  const installed: Release | null = installedTag
    ? ((github.ok && github.overview.installed) || {
        tag: installedTag,
        name: installedTag,
        publishedAt: current?.publishedAt ?? '',
        url: `https://github.com/${repo}/releases/tag/${installedTag}`,
        notes: '',
      })
    : null
  const offer = github.ok && github.overview.status === 'update' ? (github.overview.latest?.tag ?? null) : null
  const blocked = github.ok && github.overview.status === 'up-to-date' ? 'Up to date' : 'Nothing to install'
  const latest = github.ok ? github.overview.latest : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between gap-4 border-b pb-4">
        <p className="text-sm font-semibold">
          {siteConfig.brand} <span className="font-normal text-muted-foreground">admin</span>
        </p>
        <nav className="flex items-center gap-1">
          <Link href="/" prefetch={false} className="inline-flex items-center gap-1.5 px-3 text-[13px] text-muted-foreground hover:text-foreground">
            View site
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </Link>
          <SignOut />
        </nav>
      </header>

      <main className="mt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Updates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Installs the latest release of{' '}
            <a href={`https://github.com/${repo}/releases`} className="text-link hover:underline">
              {repo}
            </a>
            .
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section aria-labelledby="installed-heading" className="rounded-xl border bg-card p-5">
            <h2 id="installed-heading" className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Installed
            </h2>
            {installed ? (
              <p className="mt-2">
                <ReleaseLine release={installed} />
              </p>
            ) : (
              <p className="mt-2 text-sm">Uploaded by hand{commit && <span className="text-muted-foreground"> (commit {shortSha(commit)})</span>}</p>
            )}
            {current?.deployedAt && <p className="mt-1 text-xs text-muted-foreground">Installed {formatWhen(current.deployedAt)}</p>}
          </section>

          <section aria-labelledby="latest-heading" className="rounded-xl border bg-card p-5">
            <h2 id="latest-heading" className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Latest release
            </h2>
            {!github.ok ? (
              <p className="mt-2 text-sm text-red-300">{github.error}</p>
            ) : latest ? (
              <p className="mt-2">
                <ReleaseLine release={latest} />
              </p>
            ) : (
              <p className="mt-2 text-sm">No releases published yet</p>
            )}
          </section>
        </div>

        {github.ok && (
          <section aria-labelledby="status-heading" className="rounded-xl border bg-card p-5">
            <h2 id="status-heading" className="text-base font-semibold">
              {summary(github.overview, installedTag)}
            </h2>
            {latest?.notes && github.overview.status === 'update' && (
              <>
                <h3 className="mt-4 text-sm font-medium">What {latest.tag} brings</h3>
                {/* Plain text, as written on GitHub: never rendered as HTML. */}
                <pre className="mt-2 max-h-96 overflow-auto rounded-md border bg-background p-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                  {latest.notes}
                </pre>
              </>
            )}
          </section>
        )}

        <UpdatePanel initial={updater} offer={offer} blocked={blocked} />
      </main>
    </div>
  )
}

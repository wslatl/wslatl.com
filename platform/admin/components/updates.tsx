import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '../../i18n/config'
import { deployedCommit, installedRelease } from '../server/build-info'
import { GitHubError, releaseOverview, type Overview, type Release } from '../server/github'
import type { GitHubSettings } from '../server/settings'
import { adminText, say } from '../server/text'
import { updaterStatus } from '../server/updater'
import type { AdminText } from '../text'
import { cn } from '../../lib/cn'
import type { AdminNavItem } from './admin-nav'
import { formatWhen, shortSha } from './format'
import { Badge, Notice, type Tone } from './notice'
import { ReleaseNotes, safeHref } from './release-notes'
import { UpdatePanel } from './update-panel'
import { code } from './tags'

/** What the latest release is to this site, shown beside it. */
const latestBadge: Record<Overview['status'], { tone: Tone | 'neutral'; key: 'update' | 'upToDate' | 'older' | 'badTag' | 'withdrawn' } | null> = {
  update: { tone: 'info', key: 'update' },
  'up-to-date': { tone: 'success', key: 'upToDate' },
  older: { tone: 'neutral', key: 'older' },
  'bad-tag': { tone: 'warning', key: 'badTag' },
  withdrawn: { tone: 'warning', key: 'withdrawn' },
  'no-releases': null,
}

/** A link off the site: in a new tab, so a running update stays in view, and without the referrer or window.opener. */
function OutLink({ href, newTab, className, children }: { href: string; newTab: string; className?: string; children: React.ReactNode }) {
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
      <span className="sr-only">{newTab}</span>
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
  t,
}: {
  id: string
  heading: string
  release: Release | null
  badge?: { tone: Tone | 'neutral'; label: string } | null
  details?: React.ReactNode
  empty: React.ReactNode
  t: AdminText
}) {
  const published = release ? formatWhen(release.publishedAt, t) : ''
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
            {published && <Detail label={t('updates.published')}>{published}</Detail>}
            {details}
          </dl>
          {href && (
            <OutLink href={href} newTab={t('newTab')} className="mt-auto self-start pt-4 text-sm">
              {t('updates.onGitHub')}
            </OutLink>
          )}
        </>
      ) : (
        empty
      )}
    </section>
  )
}

/** A rich text <link> to an address off the site, made outside the component that uses it. */
const outTo = (href: string, newTab: string) =>
  function outLink(chunks: React.ReactNode) {
    return (
      <OutLink href={href} newTab={newTab}>
        {chunks}
      </OutLink>
    )
  }

const linkClass = 'text-link underline decoration-link/50 underline-offset-2 hover:text-foreground hover:decoration-current'

/** The app's own admin pages that belong next to updates (admin.updateLinks), as a row of links. */
function UpdateLinks({ links, t }: { links: readonly AdminNavItem[]; t: AdminText }) {
  if (links.length === 0) return null
  return (
    <nav aria-label={t('updates.links')} className="mt-3">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Where the site stands against GitHub's latest release, in one sentence.
 * With no release yet, links is the app's own pages for updates: the first
 * is named as a place to publish one, beside GitHub.
 */
export function summary({ status, latest }: Overview, installed: string | null, links: readonly AdminNavItem[] = [], t: AdminText = adminText('en')): React.ReactNode {
  const tag = latest?.tag ?? ''
  switch (status) {
    case 'no-releases':
      if (links.length === 0) return t('updates.summary.noReleases')
      return t.rich('updates.summary.noReleasesFrom', {
        label: links[0].label,
        link: (chunks) => (
          <Link href={links[0].href} className={linkClass}>
            {chunks}
          </Link>
        ),
      })
    case 'bad-tag':
      return t('updates.summary.badTag', { tag })
    case 'up-to-date':
      return t('updates.summary.upToDate')
    case 'older':
      return t('updates.summary.older', { tag, installed: installed ?? '' })
    case 'withdrawn':
      return t('updates.summary.withdrawn', { tag })
    default:
      return installed ? t('updates.summary.update', { tag }) : t('updates.summary.updateByHand', { tag })
  }
}

/**
 * The page while a GitHub setting is missing or broken: why updates are off,
 * and what is installed, from the build itself. GitHub is not asked
 * anything, and nothing is offered to install.
 */
function UpdatesOff({
  reasons,
  installedTag,
  commit,
  links,
  t,
}: {
  reasons: readonly string[]
  installedTag: string | null
  commit: string | null
  links: readonly AdminNavItem[]
  t: AdminText
}) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('updates.title')}</h1>
        <UpdateLinks links={links} t={t} />
      </div>
      <Notice tone="warning" title={t('updates.off.title')}>
        {reasons.map((reason) => (
          <span key={reason} className="block">
            {reason}
          </span>
        ))}
        <span className="mt-2 block text-muted-foreground">
          {t.rich('updates.off.fix', { count: reasons.length, code })}
        </span>
      </Notice>
      <ReleaseCard
        id="installed"
        heading={t('updates.installed')}
        release={installedTag ? { tag: installedTag, name: installedTag, publishedAt: '', url: '', notes: '' } : null}
        details={
          commit && (
            <Detail label={t('updates.commit')}>
              <span className="font-mono">{shortSha(commit)}</span>
            </Detail>
          )
        }
        empty={<p className="mt-3 text-lg font-semibold">{t('updates.byHand')}</p>}
        t={t}
      />
    </>
  )
}

/**
 * The Updates page's content: what is installed, GitHub's latest release,
 * the panel that installs it, and what it brings, in the admin's language.
 * The caller has already checked who is signed in. github is null while
 * updates are off, and updatesOff says why.
 */
export async function Updates({
  github: settings,
  updatesOff = [],
  mayUpdate = true,
  links = [],
  locale = 'en',
  fetchImpl = fetch,
}: {
  github: GitHubSettings | null
  updatesOff?: readonly string[]
  mayUpdate?: boolean
  /** The app's own pages for updates (admin.updateLinks), with their words in the admin's language. */
  links?: readonly AdminNavItem[]
  /** The admin's language. */
  locale?: Locale
  fetchImpl?: typeof fetch
}) {
  const t = adminText(locale)
  const installedTag = installedRelease()
  const commit = deployedCommit()
  if (!settings) return <UpdatesOff reasons={updatesOff} installedTag={installedTag} commit={commit} links={links} t={t} />
  const { repo } = settings
  const updater = await updaterStatus()
  // A release a crash took back out is never offered again.
  const withdrawn = updater.state?.withdrawn ?? []
  const github = await releaseOverview(settings, installedTag, fetchImpl, 10_000, withdrawn).then(
    (overview) => ({ ok: true as const, overview }),
    (error: unknown) => ({ ok: false as const, error: error instanceof GitHubError ? say(error.said, locale) : t('problems.unreadable') }),
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
  const blocked = github.ok && github.overview.status === 'up-to-date' ? t('updates.blocked.upToDate') : t('updates.blocked.nothing')
  const latest = github.ok ? github.overview.latest : null
  const notes = github.ok && github.overview.status === 'update' && latest?.notes ? latest : null
  const deployedAt = current?.deployedAt ? formatWhen(current.deployedAt, t) : ''
  const badge = github.ok ? latestBadge[github.overview.status] : null
  const commitDetail = commit && (
    <Detail label={t('updates.commit')}>
      <span className="font-mono">{shortSha(commit)}</span>
    </Detail>
  )

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('updates.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.rich('updates.intro', { repo, link: outTo(`https://github.com/${repo}/releases`, t('newTab')) })}
        </p>
        <UpdateLinks links={links} t={t} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReleaseCard
          id="installed"
          heading={t('updates.installed')}
          release={installed}
          details={
            <>
              {deployedAt && <Detail label={t('updates.installedAt')}>{deployedAt}</Detail>}
              {commitDetail}
            </>
          }
          empty={
            <>
              <p className="mt-3 text-lg font-semibold">{t('updates.byHand')}</p>
              {commitDetail && <dl className="mt-2 space-y-1 text-sm">{commitDetail}</dl>}
            </>
          }
          t={t}
        />
        <ReleaseCard
          id="latest"
          heading={t('updates.latest')}
          release={latest}
          badge={badge && { tone: badge.tone, label: t(`updates.badge.${badge.key}`) }}
          empty={
            github.ok ? (
              <p className="mt-3 text-lg font-semibold">{t('updates.noneYet')}</p>
            ) : (
              <Notice tone="danger" title={t('updates.cannotRead')} className="mt-3">
                {github.error}
              </Notice>
            )
          }
          t={t}
        />
      </div>

      <UpdatePanel
        initial={updater}
        offer={offer}
        blocked={blocked}
        summary={github.ok ? summary(github.overview, installedTag, links, t) : null}
        mayUpdate={mayUpdate}
      />

      {notes && (
        <section aria-labelledby="notes-heading" className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 id="notes-heading" className="text-base font-semibold">
            {t('updates.brings', { tag: notes.tag })}
          </h2>
          {/* At most about 70 characters a line, as the brand kit sets body text. */}
          <ReleaseNotes markdown={notes.notes} repo={repo} headingLevel={3} className="mt-4 max-w-prose" />
        </section>
      )}
    </>
  )
}

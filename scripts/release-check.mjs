// Checks a published GitHub release before anyone presses Install on the
// admin dashboard (.github/workflows/release-check.yml). It looks at what
// the updater relies on:
//
//   - the tag is a version, vMAJOR.MINOR.PATCH
//   - the tagged commit is on main
//   - package.json at that commit says the same version as the tag
//   - the release has notes
//
// Run it from a full clone with main fetched, with GH_TOKEN and GH_REPO set:
//
//   node scripts/release-check.mjs [tag] [report.md]
//
// Without a tag it checks the latest release. It writes a Markdown report
// and, in GitHub Actions, sets the step output failing to true or false.
// It exits 0 whenever it could run the checks; the workflow decides what a
// failure means.
import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { parseVersion, tagRule } from './updater/release.mjs'

/** Text that came from a release, safe to show inside a Markdown code span. */
function code(text) {
  const clean = String(text).replace(/[`\r\n]/g, ' ').trim().slice(0, 80)
  return `\`${clean}\``
}

const holdBack =
  'A published tag should not be moved, so publish a new release with the next version once this is fixed, and mark this one as a pre-release so the site never offers it.'

/**
 * The problems with a release, each with what it is and how to fix it.
 * commit is the tagged commit (null when the tag points at none) and
 * packageVersion the version in package.json at that commit (null when it
 * cannot be read).
 * @param {{
 *   tag: string,
 *   notes: string | null | undefined,
 *   commit: string | null,
 *   onMain: boolean,
 *   packageVersion: string | null,
 * }} facts
 * @returns {{ id: string, what: string, fix: string }[]}
 */
export function checkRelease({ tag, notes, commit, onMain, packageVersion }) {
  const problems = []
  const version = parseVersion(tag)
  const short = commit ? commit.slice(0, 7) : ''

  if (!version) {
    problems.push({
      id: 'tag',
      what: `The tag ${code(tag)} is not in the form ${tagRule}.`,
      fix: `Name the new tag like v1.5.0, with no spaces, no extra text and no leading zeros. ${holdBack}`,
    })
  }

  if (!commit) {
    problems.push({
      id: 'commit',
      what: `The tag ${code(tag)} does not point at a commit in this repository.`,
      fix: 'Publish the release again with main as the target.',
    })
  } else if (!onMain) {
    problems.push({
      id: 'main',
      what: `The tagged commit ${code(short)} is not on main.`,
      fix: `Merge the work into main first, then publish the new release with main as the target. ${holdBack}`,
    })
  }

  if (commit) {
    if (packageVersion === null) {
      problems.push({
        id: 'package',
        what: `package.json at the tagged commit ${code(short)} could not be read, or has no version.`,
        fix: `Make package.json on main valid JSON with a "version". ${holdBack}`,
      })
    } else if (version && packageVersion !== version.join('.')) {
      problems.push({
        id: 'package',
        what: `package.json at the tagged commit ${code(short)} says version ${code(packageVersion)}, but the tag says ${version.join('.')}.`,
        fix: `Set "version" in package.json to ${version.join('.')} and merge that into main. ${holdBack}`,
      })
    }
  }

  if (!notes || !notes.trim()) {
    problems.push({
      id: 'notes',
      what: 'The release has no notes.',
      fix: 'Edit the release and add notes that list the changes. The Generate release notes button writes them from the merged pull requests. The admin dashboard shows these notes before anyone installs.',
    })
  }

  return problems
}

/**
 * The Markdown report: what was checked, and what to fix.
 * @param {string} tag
 * @param {{ id: string, what: string, fix: string }[]} problems
 */
export function buildReport(tag, problems) {
  if (problems.length === 0) {
    return `Release ${code(tag)} is ready to install. The tag is a version, the commit is on main, package.json agrees with the tag, and the release has notes.\n`
  }
  const count = problems.length === 1 ? '1 problem' : `${problems.length} problems`
  const list = problems.map((p, i) => `${i + 1}. ${p.what}\n   To fix: ${p.fix}`).join('\n')
  return `Release ${code(tag)} has ${count}. The site installs only the latest release, so fix this before pressing Install.\n\n${list}\n`
}

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

/** Reads what the checks need from the release and the local clone. */
function gather(requestedTag) {
  const release = JSON.parse(run('gh', ['release', 'view', ...(requestedTag ? [requestedTag] : []), '--json', 'tagName,body']))
  const tag = release.tagName
  let commit = null
  let onMain = false
  let packageVersion = null
  // The tag is chosen by whoever publishes it, so it is only ever passed as
  // an argument (never through a shell), and only a commit it resolves to is
  // used after that.
  try {
    commit = run('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}^{commit}`]).trim() || null
  } catch {
    commit = null
  }
  if (commit) {
    try {
      run('git', ['merge-base', '--is-ancestor', commit, 'origin/main'])
      onMain = true
    } catch {
      onMain = false
    }
    try {
      const version = JSON.parse(run('git', ['show', `${commit}:package.json`])).version
      packageVersion = typeof version === 'string' ? version : null
    } catch {
      packageVersion = null
    }
  }
  return { tag, notes: release.body, commit, onMain, packageVersion }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [requestedTag, reportPath] = process.argv.slice(2)
  const facts = gather(requestedTag || '')
  const problems = checkRelease(facts)
  const report = buildReport(facts.tag, problems)
  if (reportPath) writeFileSync(reportPath, report)
  console.log(report)
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `failing=${problems.length > 0}\ntag=${facts.tag}\n`)
  }
}

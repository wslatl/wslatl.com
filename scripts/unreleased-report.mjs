// Lists changes on main that are not in the latest release
// (.github/workflows/unreleased.yml). Merging into main ships nothing: the
// site runs published releases only, so a merged fix can wait unnoticed. Run
// it from a full clone with main fetched, with GH_TOKEN and GH_REPO set:
//
//   node scripts/unreleased-report.mjs [report.md]
//
// It only asks for attention once the oldest unreleased change is more than
// a week old. It writes a Markdown report and, in GitHub Actions, sets the
// step output needs-attention to true or false.
import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const waitingDays = 7
const dayMs = 24 * 60 * 60 * 1000

function code(text) {
  return `\`${String(text).replace(/[`\r\n]/g, ' ').trim()}\``
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

/**
 * Turns the output of `git log --format=%h%x09%cI%x09%s` into commits.
 * @param {string} text
 * @returns {{ sha: string, date: string, subject: string }[]}
 */
export function parseLog(text) {
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, date, ...subject] = line.split('\t')
      return { sha, date, subject: subject.join('\t') }
    })
}

/**
 * True when the oldest unreleased change is more than `days` old.
 * @param {{ sha: string, date: string, subject: string }[]} commits
 * @param {Date} now
 * @param {number} [days]
 */
export function isStale(commits, now, days = waitingDays) {
  return commits.some((commit) => now.getTime() - new Date(commit.date).getTime() > days * dayMs)
}

/**
 * The Markdown report. `commits` is newest first; `tag` is the latest
 * release, or '' when there is none.
 * @param {string} tag
 * @param {{ sha: string, date: string, subject: string }[]} commits
 * @param {Date} now
 */
export function buildReport(tag, commits, now) {
  if (commits.length === 0 || !isStale(commits, now)) {
    return `Nothing on main has waited more than ${plural(waitingDays, 'day')} for a release.\n`
  }
  const oldest = Math.min(...commits.map((c) => new Date(c.date).getTime()))
  const age = Math.floor((now.getTime() - oldest) / dayMs)
  const shown = commits.slice(0, 100)
  const lines = shown.map((c) => `- ${code(c.sha)} ${code(c.subject)}, ${c.date.slice(0, 10)}`)
  if (commits.length > shown.length) lines.push(`- and ${commits.length - shown.length} older changes`)
  const since = tag ? `the latest release, ${code(tag)}` : 'any release'
  return [
    `${plural(commits.length, 'change')} on main ${commits.length === 1 ? 'is' : 'are'} not in ${since}. The oldest has waited ${plural(age, 'day')}. The site runs published releases only, so none of this is live yet. Publish a release (see Releasing in the README), or close this issue if it is on hold on purpose.`,
    '',
    ...lines,
    '',
  ].join('\n')
}

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const now = new Date()
  // With no release yet there is no latest one, and every commit is unreleased.
  let tag = ''
  try {
    tag = JSON.parse(run('gh', ['release', 'view', '--json', 'tagName'])).tagName
  } catch {
    tag = ''
  }
  const range = tag ? [`refs/tags/${tag}..origin/main`] : ['origin/main']
  const commits = parseLog(run('git', ['log', '--no-merges', '--format=%h%x09%cI%x09%s', ...range]))
  const report = buildReport(tag, commits, now)
  if (process.argv[2]) writeFileSync(process.argv[2], report)
  console.log(report)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `needs-attention=${isStale(commits, now)}\n`)
}

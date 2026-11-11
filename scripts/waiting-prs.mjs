// Lists pull requests that have been open for more than a week
// (.github/workflows/waiting-prs.yml), so none sits unnoticed. Run it with
// GH_TOKEN and GH_REPO set:
//
//   node scripts/waiting-prs.mjs [report.md]
//
// It writes a Markdown report and, in GitHub Actions, sets the step output
// needs-attention to true or false, which decides whether the tracking issue
// stays open.
import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const waitingDays = 7
const dayMs = 24 * 60 * 60 * 1000

/** A pull request title, safe inside a Markdown code span and never a mention. */
function code(text) {
  return `\`${String(text).replace(/[`\r\n]/g, ' ').trim()}\``
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

/**
 * The pull requests open for longer than `days`, oldest first.
 * @param {{ number: number, title: string, url: string, createdAt: string, isDraft?: boolean, author?: { login?: string } | null }[]} prs
 * @param {Date} now
 * @param {number} [days]
 */
export function findWaiting(prs, now, days = waitingDays) {
  return prs
    .map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.url,
      draft: Boolean(pr.isDraft),
      author: pr.author?.login || 'unknown',
      age: now.getTime() - new Date(pr.createdAt).getTime(),
    }))
    .filter((pr) => pr.age > days * dayMs)
    .toSorted((a, b) => b.age - a.age)
    .map(({ age, ...pr }) => ({ ...pr, ageDays: Math.floor(age / dayMs) }))
}

/**
 * The Markdown report.
 * @param {ReturnType<typeof findWaiting>} waiting
 * @param {number} [days]
 */
export function buildReport(waiting, days = waitingDays) {
  if (waiting.length === 0) return `No pull request has been open for more than ${plural(days, 'day')}.\n`
  const lines = waiting.map(
    (pr) => `- [#${pr.number}](${pr.url}) ${code(pr.title)}, open ${plural(pr.ageDays, 'day')}, by ${pr.author}${pr.draft ? ', a draft' : ''}`,
  )
  return [
    `${plural(waiting.length, 'pull request')} ${waiting.length === 1 ? 'has' : 'have'} been open for more than ${plural(days, 'day')}. Merge, close or answer each one so that none waits unnoticed. Oldest first:`,
    '',
    ...lines,
    '',
  ].join('\n')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const prs = JSON.parse(
    execFileSync('gh', ['pr', 'list', '--state', 'open', '--limit', '500', '--json', 'number,title,url,createdAt,isDraft,author'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    }),
  )
  const waiting = findWaiting(prs, new Date())
  const report = buildReport(waiting)
  if (process.argv[2]) writeFileSync(process.argv[2], report)
  console.log(report)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `needs-attention=${waiting.length > 0}\n`)
}

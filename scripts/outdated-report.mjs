// Builds the weekly outdated-packages report (.github/workflows/outdated.yml)
// as Markdown: updates worth taking, majors held back on purpose, and any
// known vulnerabilities. Run it after `npm ci`:
//
//   node scripts/outdated-report.mjs > report.md
//
// In GitHub Actions it also sets the step output needs-attention to true or
// false, which decides whether the tracking issue stays open.
import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'

/**
 * Major versions skipped on purpose, and why. Keep this in step with the
 * ignore list in .github/dependabot.yml.
 */
const heldMajors = {
  eslint: 'Stays on 9 until eslint-plugin-react supports ESLint 10.',
  '@types/node': 'Follows the Node.js version in .nvmrc.',
}

function npmJson(args) {
  // npm outdated exits 1 when anything is outdated and npm audit exits 1
  // when it finds something. Either way the JSON on stdout is the answer.
  // Windows can only start npm through a shell; the arguments are fixed.
  const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32' }
  try {
    return JSON.parse(execFileSync('npm', args, options) || '{}')
  } catch (error) {
    return JSON.parse(error.stdout || '{}')
  }
}

function updateKind(from, to) {
  const [a, b] = [from, to].map((version) => String(version).split('.').map(Number))
  if (a[0] !== b[0]) return 'major'
  if (a[1] !== b[1]) return 'minor'
  return 'patch'
}

const take = []
const held = []
for (const [name, info] of Object.entries(npmJson(['outdated', '--json', '--long']))) {
  const use = info.type === 'dependencies' ? 'site' : 'tooling'
  if (!info.current) {
    take.push({ name, from: 'not installed', to: info.wanted, kind: 'missing', use })
    continue
  }
  const reason = heldMajors[name]
  if (reason && updateKind(info.current, info.latest) === 'major') {
    held.push({ name, current: info.current, latest: info.latest, reason })
    // A held package can still have patches inside its major.
    if (info.wanted !== info.current) take.push({ name, from: info.current, to: info.wanted, kind: updateKind(info.current, info.wanted), use })
    continue
  }
  take.push({ name, from: info.current, to: info.latest, kind: updateKind(info.current, info.latest), use })
}

const vulnerabilities = npmJson(['audit', '--json']).metadata?.vulnerabilities ?? {}
const severities = ['critical', 'high', 'moderate', 'low'].filter((level) => vulnerabilities[level] > 0)

const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
const byKind = ['major', 'minor', 'patch', 'missing']
  .map((kind) => [kind, take.filter((t) => t.kind === kind).length])
  .filter(([, n]) => n > 0)
  .map(([kind, n]) => `${n} ${kind}`)

const lines = ['## Outdated packages', '']
lines.push(
  [
    take.length ? `**${count(take.length, 'update')} to take** (${byKind.join(', ')})` : 'Everything is up to date',
    held.length ? `${count(held.length, 'major version')} held back on purpose` : null,
    severities.length ? `**${severities.map((s) => `${vulnerabilities[s]} ${s}`).join(', ')} vulnerabilities**` : 'No known vulnerabilities',
  ]
    .filter(Boolean)
    .join('. ') + '.',
  '',
)

if (take.length) {
  lines.push('### Updates to take', '', '| Package | Installed | Update to | Kind | Used by |', '| --- | --- | --- | --- | --- |')
  for (const t of take) lines.push(`| \`${t.name}\` | ${t.from} | ${t.to} | ${t.kind} | ${t.use} |`)
  lines.push(
    '',
    'Dependabot opens pull requests for these every Monday. To take them now, run `npm update` (plus `npm install <name>@latest` for majors), then `npm run check`.',
  )
  if (take.some((t) => t.kind === 'major')) lines.push('Read the release notes before taking a major version: it can change behavior.')
  lines.push('')
}

if (held.length) {
  lines.push('### Held back on purpose', '', '| Package | Installed | Latest | Why |', '| --- | --- | --- | --- |')
  for (const h of held) lines.push(`| \`${h.name}\` | ${h.current} | ${h.latest} | ${h.reason} |`)
  lines.push('')
}

if (severities.length) {
  lines.push('### Known vulnerabilities', '', 'Run `npm audit` for the details and `npm audit fix` for the safe fixes. The Security audit workflow fails until they are gone.', '')
}

console.log(lines.join('\n'))

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `needs-attention=${take.length > 0 || severities.length > 0}\n`)
}

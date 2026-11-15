import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The rules every workflow keeps (README, Automation), checked on every pull
 * request with the other tests. zizmor, in the Workflow lint workflow, looks
 * deeper at the pins, the permissions and the checkouts, and asks GitHub that
 * each pinned commit is the action's own; this holds the rest as well.
 */
const github = join(__dirname, '..', '.github')
const read = (path: string) => readFileSync(path, 'utf8').split(/\r?\n/)
const workflows = readdirSync(join(github, 'workflows'))
  .filter((name) => name.endsWith('.yml'))
  .map((name) => ({ name, lines: read(join(github, 'workflows', name)) }))
const actions = readdirSync(join(github, 'actions')).map((name) => ({
  name: `actions/${name}`,
  lines: read(join(github, 'actions', name, 'action.yml')),
}))
const everything = [...workflows, ...actions]

/** Each job of a workflow, by its id, with the lines under it. */
function jobsOf(lines: string[]) {
  const jobs: { id: string; lines: string[] }[] = []
  for (const line of lines.slice(lines.indexOf('jobs:') + 1)) {
    const id = /^ {2}([\w-]+):\s*$/.exec(line)?.[1]
    if (id) jobs.push({ id, lines: [] })
    else if (/^\S/.test(line)) break
    else jobs.at(-1)?.lines.push(line)
  }
  return jobs
}

/** Every line that names an action, trimmed, with the file it is in. */
const uses = everything.flatMap(({ name, lines }) =>
  lines.flatMap((line, index) => (/^\s*(- )?uses:/.test(line) ? [{ name, index, line: line.trim().replace(/^- /, '') }] : [])),
)

describe('the workflows', () => {
  it('are all here to be checked', () => {
    expect(workflows.length).toBeGreaterThan(10)
    for (const { name, lines } of workflows) expect(jobsOf(lines).length, name).toBeGreaterThan(0)
  })

  it('give no permission at the top, and each job its own list', () => {
    for (const { name, lines } of workflows) {
      expect(lines, name).toContain('permissions: {}')
      for (const job of jobsOf(lines)) expect(job.lines.some((l) => /^ {4}permissions:/.test(l)), `${name}: ${job.id}`).toBe(true)
    }
  })

  it('give every job a time limit, and every workflow a concurrency group', () => {
    for (const { name, lines } of workflows) {
      expect(lines.some((l) => l.startsWith('concurrency:')), name).toBe(true)
      for (const job of jobsOf(lines)) expect(job.lines.some((l) => /^ {4}timeout-minutes: \d+$/.test(l)), `${name}: ${job.id}`).toBe(true)
    }
  })

  it('pin every action to a full commit, with its version beside it', () => {
    const local = /^uses: \.\/\.github\/actions\/[\w-]+$/
    const pinned = /^uses: [\w.-]+\/[\w./-]+@[0-9a-f]{40} # v\d+\.\d+\.\d+$/
    expect(uses.length).toBeGreaterThan(20)
    expect(uses.filter(({ line }) => !local.test(line) && !pinned.test(line)).map(({ name, line }) => `${name}: ${line}`)).toEqual([])
  })

  it('keep no token in any checkout', () => {
    const kept = uses
      .filter(({ line }) => line.startsWith('uses: actions/checkout@'))
      .filter(({ name, index }) => {
        const lines = everything.find((file) => file.name === name)!.lines
        const indent = lines[index].indexOf('- ') >= 0 ? lines[index].indexOf('- ') : lines[index].search(/\S/) - 2
        const block = []
        for (const line of lines.slice(index + 1)) {
          if (line.trim() && line.search(/\S/) <= indent) break
          block.push(line.trim())
        }
        return !block.includes('persist-credentials: false')
      })
      .map(({ name }) => name)
    expect(kept).toEqual([])
  })

  it('run no install scripts in any npm ci, as the updater runs none on the server', () => {
    const installs = everything.flatMap(({ name, lines }) =>
      lines.filter((l) => /\bnpm ci\b/.test(l) && !l.trim().startsWith('#')).map((l) => `${name}: ${l.trim()}`),
    )
    expect(installs.length).toBeGreaterThan(3)
    expect(installs.filter((line) => !line.includes('--ignore-scripts'))).toEqual([])
  })

  it('never run on pull_request_target, which hands a pull request the repository', () => {
    expect(workflows.filter(({ lines }) => lines.some((l) => l.includes('pull_request_target'))).map(({ name }) => name)).toEqual([])
  })
})

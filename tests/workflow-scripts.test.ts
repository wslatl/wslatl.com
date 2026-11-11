import { describe, expect, it } from 'vitest'
import { buildReport as releaseReport, checkRelease } from '../scripts/release-check.mjs'
import { buildReport as unreleasedReport, isStale, parseLog } from '../scripts/unreleased-report.mjs'
import { buildReport as waitingReport, findWaiting } from '../scripts/waiting-prs.mjs'

// Built from character codes so this file holds no such character itself.
const dash = new RegExp(`[${[0x2013, 0x2014, 0xb7].map((code) => String.fromCharCode(code)).join('')}]`)
const good = { tag: 'v1.4.0', notes: 'What changed', commit: 'abcdef1234567', onMain: true, packageVersion: '1.4.0' }
const ids = (facts: object) => checkRelease({ ...good, ...facts }).map((p: { id: string }) => p.id)

describe('release check', () => {
  it('passes a release that is ready', () => {
    expect(checkRelease(good)).toEqual([])
    expect(releaseReport('v1.4.0', [])).toContain('ready to install')
  })

  it('refuses a tag that is not a version', () => {
    for (const tag of ['1.4.0', 'v1.4', 'v1.4.0-rc1', 'v01.4.0', 'release', 'v1.4.0 ']) {
      expect(ids({ tag, packageVersion: '1.4.0' })).toContain('tag')
    }
  })

  it('refuses a commit that is not on main', () => {
    expect(ids({ onMain: false })).toEqual(['main'])
  })

  it('refuses a tag that points at no commit, without also blaming package.json', () => {
    expect(ids({ commit: null, onMain: false, packageVersion: null })).toEqual(['commit'])
  })

  it('refuses a package.json with another version, or none', () => {
    const [problem] = checkRelease({ ...good, packageVersion: '1.3.2' })
    expect(problem.id).toBe('package')
    expect(problem.what).toContain('1.3.2')
    expect(problem.fix).toContain('1.4.0')
    expect(ids({ packageVersion: null })).toEqual(['package'])
  })

  it('refuses empty notes', () => {
    for (const notes of ['', '  \n ', null, undefined]) expect(ids({ notes })).toEqual(['notes'])
  })

  it('lists every problem, numbered, with how to fix each', () => {
    const problems = checkRelease({ tag: 'latest', notes: '', commit: 'abcdef1234567', onMain: false, packageVersion: '1.0.0' })
    expect(problems.map((p: { id: string }) => p.id)).toEqual(['tag', 'main', 'notes'])
    const report = releaseReport('latest', problems)
    expect(report).toContain('3 problems')
    expect(report).toContain('1. ')
    expect(report).toContain('3. ')
    expect(report).toContain('To fix:')
  })

  it('cannot be tricked by a tag with backticks or new lines', () => {
    const report = releaseReport('v1`\n# Heading', checkRelease({ ...good, tag: 'v1`\n# Heading' }))
    expect(report.split('\n')[0]).toContain('`v1  # Heading`')
    expect(report).not.toMatch(/^# Heading/m)
  })

  it('writes plain words', () => {
    const problems = checkRelease({ tag: 'x', notes: '', commit: 'abcdef1234567', onMain: false, packageVersion: '9.9.9' })
    expect(releaseReport('x', problems)).not.toMatch(dash)
  })
})

describe('waiting pull requests', () => {
  const now = new Date('2026-11-10T12:00:00Z')
  const day = 24 * 60 * 60 * 1000
  const pr = (number: number, daysOld: number, extra = {}) => ({
    number,
    title: `Change ${number}`,
    url: `https://github.com/wslatl/wslatl.com/pull/${number}`,
    createdAt: new Date(now.getTime() - daysOld * day).toISOString(),
    author: { login: 'someone' },
    ...extra,
  })

  it('keeps only pull requests open for more than 7 days, oldest first', () => {
    const waiting = findWaiting([pr(1, 3), pr(2, 21), pr(3, 7), pr(4, 8.5)], now)
    expect(waiting.map((p: { number: number }) => p.number)).toEqual([2, 4])
    expect(waiting.map((p: { ageDays: number }) => p.ageDays)).toEqual([21, 8])
  })

  it('lists links and ages', () => {
    const report = waitingReport(findWaiting([pr(2, 21), pr(4, 8, { isDraft: true })], now))
    expect(report).toContain('2 pull requests have been open for more than 7 days')
    expect(report).toContain('[#2](https://github.com/wslatl/wslatl.com/pull/2)')
    expect(report).toContain('open 21 days')
    expect(report).toContain('a draft')
    expect(report).not.toMatch(dash)
  })

  it('says so when nothing waits', () => {
    expect(findWaiting([pr(1, 1)], now)).toEqual([])
    expect(waitingReport([])).toContain('No pull request')
  })

  it('shows a title as code, so it cannot mention anyone or break the list', () => {
    const report = waitingReport(findWaiting([pr(5, 10, { title: 'Fix @owner `x`\n- injected' })], now))
    expect(report).toContain('`Fix @owner  x  - injected`')
    expect(report.split('\n').filter((line) => line.startsWith('- '))).toHaveLength(1)
  })

  it('copes with a missing author', () => {
    expect(findWaiting([pr(6, 10, { author: null })], now)[0].author).toBe('unknown')
  })
})

describe('unreleased changes', () => {
  const now = new Date('2026-11-10T12:00:00Z')
  const log = 'aaa1111\t2026-11-09T10:00:00Z\tFix a thing\nbbb2222\t2026-10-30T10:00:00Z\tAdd a page\twith a tab'

  it('reads the git log', () => {
    expect(parseLog(log)).toEqual([
      { sha: 'aaa1111', date: '2026-11-09T10:00:00Z', subject: 'Fix a thing' },
      { sha: 'bbb2222', date: '2026-10-30T10:00:00Z', subject: 'Add a page\twith a tab' },
    ])
    expect(parseLog('')).toEqual([])
  })

  it('asks for attention only once the oldest change is over 7 days old', () => {
    const commits = parseLog(log)
    expect(isStale(commits, now)).toBe(true)
    expect(isStale(commits.slice(0, 1), now)).toBe(false)
    expect(isStale([], now)).toBe(false)
  })

  it('names the release and lists the changes', () => {
    const report = unreleasedReport('v1.3.2', parseLog(log), now)
    expect(report).toContain('2 changes on main are not in the latest release, `v1.3.2`')
    expect(report).toContain('waited 11 days')
    expect(report).toContain('`bbb2222`')
    expect(report).not.toMatch(dash)
  })

  it('stays quiet when nothing is old enough', () => {
    expect(unreleasedReport('v1.3.2', parseLog(log).slice(0, 1), now)).toContain('Nothing on main')
  })
})

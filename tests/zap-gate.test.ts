import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findings, readRules } from '../.github/zap/gate.mjs'

/**
 * The judge of the ZAP scan in .github/workflows/security.yml: medium risk
 * or worse fails it, and only the reviewed exceptions in rules.tsv are set
 * aside, each only where it says.
 */
const rules = readRules(readFileSync(join(__dirname, '..', '.github', 'zap', 'rules.tsv'), 'utf8'))

const alert = (pluginid: string, riskcode: number, ...uris: string[]) => ({
  pluginid,
  riskcode: String(riskcode),
  name: `rule ${pluginid}`,
  instances: uris.map((uri) => ({ uri })),
})
const report = (...alerts: object[]) => ({ site: [{ '@name': 'http://localhost:3100', alerts }] })

describe('the ZAP gate', () => {
  it('fails on medium and high, and lets low and informational pass', () => {
    const found = findings(report(alert('10020', 2, 'http://localhost:3100/'), alert('10021', 3, 'http://localhost:3100/x'), alert('10096', 1, 'http://localhost:3100/'), alert('10109', 0, 'http://localhost:3100/')), rules)
    expect(found.map((finding) => [finding.id, finding.risk])).toEqual([
      ['10020', 'Medium'],
      ['10021', 'High'],
    ])
  })

  it('sets the policy alert aside on the public pages, and keeps it on for every admin address', () => {
    const csp = alert(
      '10055',
      2,
      'http://localhost:3100/',
      'http://localhost:3100/pricing',
      'http://localhost:3100/es/pricing',
      'http://localhost:3100/administrator',
      'http://localhost:3100/admin',
      'http://localhost:3100/admin/login',
      'http://localhost:3100/admin?x=1',
    )
    const found = findings(report(csp), rules)
    expect(found).toHaveLength(1)
    expect(found[0].uris).toEqual(['http://localhost:3100/admin', 'http://localhost:3100/admin/login', 'http://localhost:3100/admin?x=1'])
  })

  it('sets the missing-token alert aside on the sign-in page alone, where the admin refuses other sites another way', () => {
    const tokens = alert('10202', 2, 'http://localhost:3100/admin/login', 'http://localhost:3100/admin/login?next=x', 'http://localhost:3100/pricing', 'http://localhost:3100/admin/login/extra')
    const found = findings(report(tokens), rules)
    expect(found).toHaveLength(1)
    expect(found[0].uris).toEqual(['http://localhost:3100/pricing', 'http://localhost:3100/admin/login/extra'])
  })

  it('reads each line as ZAP does, and refuses one ZAP itself would choke on', () => {
    const read = readRules('# a note\n\n10010\tIGNORE\t(why)\n10011,10012\tOUTOFSCOPE\thttp://x/a.*\n')
    expect([...read.ignored]).toEqual(['10010'])
    expect(read.outOfScope.map((rule) => rule.id)).toEqual(['10011', '10012'])
    expect(findings(report(alert('10010', 3, 'http://x/'), alert('10012', 2, 'http://x/a1', 'http://x/b')), read).map((f) => f.uris)).toEqual([['http://x/b']])
    expect(() => readRules('10010\tIGNORE\n')).toThrow(/three tab-separated columns/)
  })

  it('has a reason written above every exception in rules.tsv', () => {
    const lines = readFileSync(join(__dirname, '..', '.github', 'zap', 'rules.tsv'), 'utf8').split(/\r?\n/)
    lines.forEach((line, index) => {
      if (line.startsWith('#') || line.length <= 1) return
      expect(lines[index - 1]?.startsWith('#'), `line ${index + 1} has no reason above it`).toBe(true)
    })
  })
})

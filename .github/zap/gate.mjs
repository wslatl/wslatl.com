// Judges the ZAP baseline scan (.github/workflows/security.yml): fails on any
// alert of medium risk or worse that rules.tsv does not set aside. A rule
// marked IGNORE there is left out everywhere, and one marked OUTOFSCOPE only
// on the addresses its pattern matches, the way zap-baseline.py reads the
// same file. Prints a Markdown summary for the job.
//
//   node .github/zap/gate.mjs <report.json> <rules.tsv>
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const risks = ['Informational', 'Low', 'Medium', 'High']
const failsFrom = 2

/**
 * The exceptions in a zap-baseline rules file, read as zap-baseline.py
 * reads it: tab-separated rule id, action and a third column, which for
 * OUTOFSCOPE is a regular expression matched from the start of the address
 * (Python's re.match), and may name several rules, comma-separated. ZAP
 * needs all three columns on every line. Lines starting with # are notes.
 * @param {string} text
 */
export function readRules(text) {
  const ignored = new Set()
  /** @type {{ id: string, pattern: RegExp }[]} */
  const outOfScope = []
  for (const line of text.split(/\r?\n/)) {
    if (line.length <= 1 || line.startsWith('#')) continue
    const [id, action, value] = line.split('\t')
    if (value === undefined) throw new Error(`rules.tsv needs three tab-separated columns on every line: ${line}`)
    if (action === 'IGNORE') ignored.add(id)
    else if (action === 'OUTOFSCOPE') {
      for (const one of id.split(',')) outOfScope.push({ id: one, pattern: new RegExp(`^(?:${value.trimEnd()})`) })
    }
  }
  return { ignored, outOfScope }
}

/**
 * Every alert of medium risk or worse left after the exceptions, with the
 * addresses it was found on.
 * @param {any} report ZAP's JSON report
 * @param {ReturnType<typeof readRules>} rules
 */
export function findings(report, rules) {
  const found = []
  for (const site of report?.site ?? []) {
    for (const alert of site.alerts ?? []) {
      const id = String(alert.pluginid)
      const risk = Number(alert.riskcode)
      if (!(risk >= failsFrom) || rules.ignored.has(id)) continue
      const instances = alert.instances?.length ? alert.instances : [{ uri: site['@name'] ?? '' }]
      const uris = instances
        .map((instance) => String(instance.uri ?? ''))
        .filter((uri) => !rules.outOfScope.some((rule) => (rule.id === id || rule.id === '*') && rule.pattern.test(uri)))
      if (uris.length) found.push({ id, name: String(alert.name ?? alert.alert ?? ''), risk: risks[risk] ?? String(risk), uris: [...new Set(uris)] })
    }
  }
  return found
}

function main() {
  const [reportFile, rulesFile] = process.argv.slice(2)
  const report = JSON.parse(readFileSync(reportFile, 'utf8'))
  const found = findings(report, readRules(readFileSync(rulesFile, 'utf8')))
  const alerts = (report.site ?? []).flatMap((site) => site.alerts ?? [])
  console.log('## ZAP baseline scan\n')
  console.log(`${alerts.length} kinds of alert in all; the scan fails on medium risk or worse.\n`)
  if (found.length === 0) {
    console.log('Nothing of medium risk or worse beyond the reviewed exceptions in .github/zap/rules.tsv.')
    return
  }
  console.log('| Rule | Alert | Risk | Found on |\n| --- | --- | --- | --- |')
  for (const { id, name, risk, uris } of found) {
    const shown = uris.slice(0, 5).join('<br>') + (uris.length > 5 ? `<br>and ${uris.length - 5} more` : '')
    console.log(`| ${id} | ${name.replaceAll('|', '\\|')} | ${risk} | ${shown} |`)
  }
  console.error(`ZAP found ${found.length} kinds of alert of medium risk or worse. The report is kept with this run.`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()

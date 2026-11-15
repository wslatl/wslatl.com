// Downloads a commit the way the admin's updater downloads a release, with
// the updater's own code (scripts/updater/github.mjs): GitHub's record of the
// commit's files first, then GitHub's tarball, unpacked under the updater's
// rules (plain files and folders only, no name it refuses, nothing past its
// size limits), then every file checked against the record. A commit that
// fails here would fail on the server the moment a release of it is
// installed, with the old version left serving and a new release needed.
//
// So it finds, before anything is tagged: a symbolic link, a file name with
// a character the updater refuses (a colon or a question mark, say, as in a
// screenshot's name), a .gitattributes rule that changes files on their way
// into the tarball (export-ignore, export-subst, eol=crlf, a filter), and a
// repository grown past the limits.
//
//   GH_TOKEN=<token> node scripts/check-download.mjs <commit>
//
// CI runs it on every push and pull request (.github/workflows/ci.yml),
// with the run's own read-only token. The commit must be on GitHub; the
// repository is GITHUB_REPOSITORY, which Actions sets.
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { filesIn, gitHub } from './updater/github.mjs'

const sha = (process.argv[2] ?? process.env.GITHUB_SHA ?? '').trim()
const repo = process.env.GITHUB_REPOSITORY || 'wslatl/wslatl.com'
const api = (process.env.GITHUB_API_URL || 'https://api.github.com').replace(/\/+$/, '')
const token = process.env.GH_TOKEN ?? ''

if (!/^[0-9a-f]{40}$/.test(sha) || !token) {
  console.error('Usage: GH_TOKEN=<token> node scripts/check-download.mjs <the full 40-character commit>')
  process.exit(2)
}

const dest = mkdtempSync(join(tmpdir(), 'release-download-'))
try {
  await gitHub({ token, repo, api }).download(sha, dest)
  console.log(
    `The updater would install commit ${sha.slice(0, 7)}: its download unpacks under the updater's rules, and all ${filesIn(dest).length} files are the commit's own.`,
  )
} catch (error) {
  console.error(`The updater would refuse a release of commit ${sha.slice(0, 7)}: ${error instanceof Error ? error.message : error}`)
  process.exitCode = 1
} finally {
  rmSync(dest, { recursive: true, force: true })
}

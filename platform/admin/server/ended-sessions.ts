import 'server-only'
import { randomBytes } from 'node:crypto'
import { readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { adminLog } from './request'
import { updaterDir } from './updater'

/**
 * The shared password's sessions a sign-out ended, by id, each kept until
 * the moment it would have run out anyway (session.ts). A signed cookie is
 * good until it expires, so without this list a copy of one taken before
 * the sign-out would still open the admin.
 *
 * Kept in memory, and under `npm run serve` also in the updater's folder
 * (<UPDATER_DIR>/ended-sessions.json), so a restart of the site, which
 * every update is, does not bring an ended session back. Started some other
 * way, the list lasts as long as the process. Only a live session can be
 * ended, so only someone signed in can add to it, and it holds at most the
 * sessions of the last two hours. The file and its format are the main
 * website's own.
 */
type Ended = Map<string, number>

const fileName = 'ended-sessions.json'

// On globalThis, because Next may load this module more than once in one
// server, and every copy must know every sign-out.
const endedKey = Symbol.for('wslatl.admin.endedSessions')
const store = globalThis as typeof globalThis & { [endedKey]?: Ended }

function load(): Ended {
  const loaded = store[endedKey]
  if (loaded) return loaded
  const ended: Ended = new Map()
  const dir = updaterDir()
  if (dir) {
    try {
      const saved: unknown = JSON.parse(readFileSync(join(dir, fileName), 'utf8'))
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        for (const [sid, exp] of Object.entries(saved)) if (typeof exp === 'number' && Number.isFinite(exp)) ended.set(sid, exp)
      }
    } catch {
      // No sign-out yet, or a file that cannot be read: nothing ended.
    }
  }
  store[endedKey] = ended
  return ended
}

/** True when a sign-out ended this session and it has not run out since. */
export function sessionEnded(sid: string, now = Date.now()): boolean {
  const exp = load().get(sid)
  return exp !== undefined && exp > now / 1000
}

/** Ends a session until exp, in seconds: the time it would have run out anyway. */
export function endSessionId(sid: string, exp: number, now = Date.now()) {
  const ended = load()
  for (const [id, until] of ended) if (until <= now / 1000) ended.delete(id)
  ended.set(sid, exp)

  const dir = updaterDir()
  if (!dir) return
  // Written whole beside its place, then renamed in, so a reader never sees
  // half a file.
  const file = join(dir, fileName)
  const temporary = join(dir, `ended-sessions.${randomBytes(6).toString('hex')}.tmp`)
  try {
    writeFileSync(temporary, JSON.stringify(Object.fromEntries(ended)))
    renameSync(temporary, file)
  } catch (error) {
    try {
      rmSync(temporary, { force: true })
    } catch {
      // Left for the supervisor, which clears .tmp files at its next start.
    }
    // Still ended in memory; only a restart would forget it.
    adminLog(`could not save the sign-out to ${file}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

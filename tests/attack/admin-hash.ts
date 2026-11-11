import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

/**
 * The two .env lines `npm run admin:hash` prints for a password: the way the
 * owner makes the admin's settings, so the tests make them the same way.
 */
export function adminHash(password: string): { passwordHash: string; secret: string } {
  const result = spawnSync(process.execPath, [join(__dirname, '..', '..', 'platform', 'admin', 'hash-password.mjs')], {
    input: `${password}\n`,
    encoding: 'utf8',
  })
  if (result.status !== 0) throw new Error(result.stderr)
  const line = (name: string) =>
    result.stdout
      .split(/\r?\n/)
      .find((text) => text.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? ''
  return { passwordHash: line('ADMIN_PASSWORD_HASH'), secret: line('ADMIN_SESSION_SECRET') }
}

import 'server-only'
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto'

/**
 * The admin password, stored only as a hash in ADMIN_PASSWORD_HASH:
 *
 *   scrypt:<N>:<r>:<p>:<salt, base64url>:<key, base64url>
 *
 * Colons rather than the usual $ separators, because Next expands $ in .env
 * values and would quietly mangle the hash. hash-password.mjs (npm run
 * admin:hash) makes the same format with the same costs, and a test checks
 * the two agree.
 */
const cost = { N: 32768, r: 8, p: 1 }
const saltBytes = 16
const keyBytes = 32
const b64url = /^[A-Za-z0-9_-]+$/

type Parsed = { N: number; r: number; p: number; salt: Buffer; key: Buffer }

function parse(stored: string): Parsed | null {
  const parts = stored.split(':')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return null
  const [N, r, p] = parts.slice(1, 4).map((part) => (/^\d{1,6}$/.test(part) ? Number(part) : Number.NaN))
  const [salt, key] = parts.slice(4)
  // Bounded, so a mistyped .env cannot make every login allocate gigabytes.
  if (!Number.isInteger(Math.log2(N)) || N < 16384 || N > 65536 || !(r >= 8 && r <= 16) || !(p >= 1 && p <= 4)) return null
  if (!b64url.test(salt) || !b64url.test(key)) return null
  const parsed = { N, r, p, salt: Buffer.from(salt, 'base64url'), key: Buffer.from(key, 'base64url') }
  if (parsed.salt.length < saltBytes || parsed.key.length < keyBytes || parsed.key.length > 64) return null
  return parsed
}

function derive(password: string, salt: Buffer, length: number, { N, r, p }: typeof cost): Promise<Buffer> {
  const options: ScryptOptions = { N, r, p, maxmem: 256 * N * r }
  return new Promise((resolve, reject) =>
    // NFC, so the same password typed on two systems that compose accents differently still matches.
    scrypt(password.normalize('NFC'), salt, length, options, (error, key) => (error ? reject(error) : resolve(key))),
  )
}

export function isPasswordHash(stored: string): boolean {
  return parse(stored) !== null
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(saltBytes)
  const key = await derive(password, salt, keyBytes, cost)
  return ['scrypt', cost.N, cost.r, cost.p, salt.toString('base64url'), key.toString('base64url')].join(':')
}

/** True only for the password the hash was made from. The comparison takes the same time whatever it finds. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parse(stored)
  if (!parsed) return false
  const key = await derive(password, parsed.salt, parsed.key.length, parsed)
  return timingSafeEqual(key, parsed.key)
}

#!/usr/bin/env node
// Makes the two admin lines for .env: the password hash and a fresh session
// secret. Run it on your own computer, in a copy of the app's repository:
//
//   npm run admin:hash
//
// (the app's package.json: "admin:hash": "node platform/admin/hash-password.mjs")
//
// It asks for the password twice without showing it, and prints:
//
//   ADMIN_PASSWORD_HASH=scrypt:32768:8:1:<salt>:<key>
//   ADMIN_SESSION_SECRET=<43 random characters>
//
// Paste both into .env on the server and restart it. The format matches
// server/password.ts, and a test checks the two agree. It has no $ in it,
// because Next expands $ in .env values.
//
// Piped input (`echo "..." | npm run admin:hash`) is read as one line, with
// no confirmation, so the tests can drive it.
import { randomBytes, scryptSync } from 'node:crypto'

const minLength = 12

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
function readHidden(prompt) {
  return new Promise((resolve) => {
    process.stderr.write(prompt)
    const stdin = process.stdin
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    let value = ''
    /** @param {string} chars */
    const onData = (chars) => {
      for (const char of chars) {
        if (char === '\u0003') {
          process.stderr.write('\n')
          process.exit(130)
        } else if (char === '\r' || char === '\n') {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.off('data', onData)
          process.stderr.write('\n')
          resolve(value)
          return
        } else if (char === '\u007f' || char === '\b') {
          value = value.slice(0, -1)
        } else {
          value += char
        }
      }
    }
    stdin.on('data', onData)
  })
}

async function readPiped() {
  let text = ''
  for await (const chunk of process.stdin) text += chunk
  return text.split(/\r?\n/)[0]
}

async function readPassword() {
  if (!process.stdin.isTTY) return readPiped()
  const first = await readHidden('Admin password: ')
  const again = await readHidden('Same password again: ')
  if (first !== again) {
    console.error('The two passwords are different. Nothing was made.')
    process.exit(1)
  }
  return first
}

const password = await readPassword()
if ([...password].length < minLength) {
  console.error(`Use at least ${minLength} characters. Nothing was made.`)
  process.exit(1)
}

const N = 32768
const r = 8
const p = 1
const salt = randomBytes(16)
const key = scryptSync(password.normalize('NFC'), salt, 32, { N, r, p, maxmem: 256 * N * r })

console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString('base64url')}:${key.toString('base64url')}`)
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString('base64url')}`)

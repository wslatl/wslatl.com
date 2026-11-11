// Unpacking a release's tarball from GitHub. It happens here, in the
// supervisor, rather than through the system's tar, so what a release may
// hold is decided in one place: plain files and folders inside the release's
// folder, and nothing else. A link, a device, an absolute path or one with a
// way up and out stops the download, and the update with it, before
// anything is installed. GitHub puts every file under one top folder named
// after the commit, which is dropped, as tar's --strip-components=1 does.
// Files go to disk a piece at a time, so a huge one costs no more memory
// than a small one. Kept apart so the tests can feed it archives made by
// git and by tar.
import { mkdir, open, utimes } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'

const megabyte = 1024 * 1024

/**
 * @typedef {{ downloadBytes: number, unpackedBytes: number, fileBytes: number, entries: number, headerBytes: number, trailingBytes: number }} TarLimits
 */

/** @type {Readonly<TarLimits>} */
export const tarLimits = Object.freeze({
  /** The download as it comes from GitHub, still compressed. */
  downloadBytes: 500 * megabyte,
  /** Everything in it once unpacked: a guard against a small file that unpacks into a huge one. */
  unpackedBytes: 4096 * megabyte,
  /** Any one file in it. */
  fileBytes: 512 * megabyte,
  /** Files and folders in it. */
  entries: 200_000,
  /** One header that holds a long name. */
  headerBytes: megabyte,
  /** What may follow the end of the archive: tar pads it out with zeros. */
  trailingBytes: megabyte,
})

const blockSize = 512

/** The most of a file held in memory at once on its way to disk. */
const pieceBytes = 64 * 1024

const windows = process.platform === 'win32'

/** Characters no file name may hold: those Windows refuses, control characters, and both slashes. */
// oxlint-disable-next-line no-control-regex -- it finds control characters on purpose, to take them out or refuse them
const forbidden = /[\u0000-\u001f\u007f<>:"|?*\\/]/

/** Names Windows keeps for devices, where writing writes to the device, and names it would quietly change. */
const windowsOnly = /^(con|prn|aux|nul|com\d|lpt\d|conin\$|conout\$)(\..*)?$|[. ]$/i

/** A name from an archive, short enough and quoted, for a message. @param {string} name */
const shown = (name) => JSON.stringify(name.length > 120 ? `${name.slice(0, 120)}...` : name)

/** What an entry type is, in words. @param {string} type */
function kind(type) {
  if (type === '1') return 'hard link'
  if (type === '2') return 'symbolic link'
  if (type === '3' || type === '4') return 'device'
  if (type === '6') return 'named pipe'
  return `kind of entry tar calls "${type}"`
}

/**
 * Hands out exactly as many bytes as asked for, from a stream that comes in
 * chunks of any size.
 */
class ByteReader {
  /** @param {AsyncIterator<Buffer>} source */
  constructor(source) {
    this.source = source
    /** @type {Buffer[]} */
    this.chunks = []
    this.length = 0
    this.done = false
  }

  /**
   * The next n bytes, or null when the stream ends first.
   * @param {number} n
   * @returns {Promise<Buffer | null>}
   */
  async take(n) {
    while (this.length < n && !this.done) {
      const next = await this.source.next()
      if (next.done) this.done = true
      else if (next.value.length > 0) {
        this.chunks.push(next.value)
        this.length += next.value.length
      }
    }
    if (this.length < n) return null
    const out = Buffer.allocUnsafe(n)
    let filled = 0
    while (filled < n) {
      const head = this.chunks[0]
      const wanted = n - filled
      if (head.length <= wanted) {
        head.copy(out, filled)
        filled += head.length
        this.chunks.shift()
      } else {
        head.copy(out, filled, 0, wanted)
        this.chunks[0] = head.subarray(wanted)
        filled += wanted
      }
    }
    this.length -= n
    return out
  }
}

/**
 * A text field of a header, up to its first NUL.
 * @param {Buffer} header
 * @param {number} start
 * @param {number} length
 */
function field(header, start, length) {
  const bytes = header.subarray(start, start + length)
  const end = bytes.indexOf(0)
  return bytes.toString('utf8', 0, end === -1 ? length : end)
}

/**
 * A number field of a header, written in octal. NaN for anything else,
 * including the binary form tar uses only for sizes far past these limits.
 * @param {Buffer} header
 * @param {number} start
 * @param {number} length
 */
function octal(header, start, length) {
  if (header[start] & 0x80) return Number.NaN
  const digits = field(header, start, length).trim()
  if (!/^[0-7]*$/.test(digits)) return Number.NaN
  return digits === '' ? 0 : Number.parseInt(digits, 8)
}

/**
 * Whether a header's checksum is right: the sum of its bytes, with the
 * checksum's own eight counted as spaces. Old tars summed the bytes as
 * signed, and GNU tar accepts both, so this does too.
 * @param {Buffer} header
 */
function checksumMatches(header) {
  let unsigned = 0
  let signed = 0
  for (let index = 0; index < blockSize; index++) {
    const byte = index >= 148 && index < 156 ? 32 : header[index]
    unsigned += byte
    signed += byte > 127 ? byte - 256 : byte
  }
  const recorded = octal(header, 148, 8)
  return recorded === unsigned || recorded === signed
}

/**
 * The records of a pax header: "<length> <key>=<value>\n", one after another.
 * @param {Buffer} data
 * @returns {Record<string, string>}
 */
function paxRecords(data) {
  /** @type {Record<string, string>} */
  const records = {}
  let at = 0
  while (at < data.length) {
    const space = data.indexOf(0x20, at)
    const length = space === -1 ? Number.NaN : Number(data.toString('ascii', at, space))
    if (!Number.isSafeInteger(length) || length <= space - at + 1 || at + length > data.length || data[at + length - 1] !== 0x0a) {
      throw new Error('The download has a damaged pax header.')
    }
    const record = data.toString('utf8', space + 1, at + length - 1)
    const equals = record.indexOf('=')
    if (equals === -1) throw new Error('The download has a damaged pax header.')
    records[record.slice(0, equals)] = record.slice(equals + 1)
    at += length
  }
  return records
}

/**
 * The name a header gives, from the POSIX prefix and name fields. GNU's own
 * older format keeps other things where POSIX keeps the prefix.
 * @param {Buffer} header
 */
function headerName(header) {
  const name = field(header, 0, 100)
  const prefix = field(header, 257, 6) === 'ustar' ? field(header, 345, 155) : ''
  return prefix ? `${prefix}/${name}` : name
}

/**
 * Where an entry goes in dir, once the top folder is dropped: null for the
 * top folder itself. Throws for any name that is not a plain relative path.
 * @param {string} dir
 * @param {string} name
 * @param {{ top: string | null }} seen the archive's top folder, once known
 * @returns {string | null}
 */
function placeOf(dir, name, seen) {
  const parts = name.split('/')
  // A folder's name ends with a slash.
  if (parts.length > 1 && parts.at(-1) === '') parts.pop()
  for (const part of parts) {
    if (part === '' || part === '.' || part === '..' || forbidden.test(part) || (windows && windowsOnly.test(part))) {
      throw new Error(`The download holds ${shown(name)}, which is not a plain path inside the release, so nothing was installed.`)
    }
  }
  const [top, ...rest] = parts
  seen.top ??= top
  if (top !== seen.top) throw new Error(`The download holds ${shown(name)}, outside the release's one top folder, so nothing was installed.`)
  if (rest.length === 0) return null
  const target = resolve(dir, ...rest)
  const inside = relative(resolve(dir), target)
  if (!inside || inside.startsWith('..') || isAbsolute(inside)) {
    throw new Error(`The download holds ${shown(name)}, which would land outside the release's folder, so nothing was installed.`)
  }
  return target
}

/**
 * Reads tar entries from source into dir until the end of the archive.
 * @param {AsyncIterator<Buffer>} source what gunzip gives
 * @param {string} dir
 * @param {Readonly<TarLimits>} limits
 */
async function unpackEntries(source, dir, limits) {
  const reader = new ByteReader(source)
  const seen = { top: /** @type {string | null} */ (null) }
  let entries = 0
  let unpacked = 0
  /** @type {Record<string, string>} */
  let pax = {}
  /** @type {string | null} */
  let longName = null

  for (;;) {
    const header = await reader.take(blockSize)
    if (!header) throw new Error('The download ended before its archive did.')
    if (header.every((byte) => byte === 0)) break
    if (!checksumMatches(header)) throw new Error('The download is not a tar archive, or it is damaged.')
    if (++entries > limits.entries) throw new Error(`The download holds more than ${limits.entries} files and folders.`)

    const type = header[156] === 0 ? '0' : String.fromCharCode(header[156])
    const size = pax.size === undefined ? octal(header, 124, 12) : /^\d+$/.test(pax.size) ? Number(pax.size) : Number.NaN
    if (!Number.isSafeInteger(size) || size < 0) throw new Error('The download has a damaged header.')
    const padded = Math.ceil(size / blockSize) * blockSize

    // Headers that describe the next entry, or the whole archive. They count
    // toward what the archive unpacks to, though none is written.
    if (type === 'x' || type === 'g' || type === 'L' || type === 'K') {
      if (size > limits.headerBytes) throw new Error('The download has a header that is far too long.')
      unpacked += size
      if (unpacked > limits.unpackedBytes) throw new Error(`The download unpacks to more than ${limits.unpackedBytes / megabyte} MB.`)
      const block = await reader.take(padded)
      if (!block) throw new Error('The download ended before its archive did.')
      const data = block.subarray(0, size)
      if (type === 'x') pax = paxRecords(data)
      else if (type === 'L') {
        const end = data.indexOf(0)
        longName = data.toString('utf8', 0, end === -1 ? data.length : end)
      }
      // A global header ('g') holds the commit's id for git; a long link
      // name ('K') belongs to a link, which is refused below anyway.
      continue
    }

    const name = pax.path ?? longName ?? headerName(header)
    pax = {}
    longName = null
    const folder = type === '5' || ((type === '0' || type === '7') && name.endsWith('/') && size === 0)
    if (!folder && type !== '0' && type !== '7') {
      throw new Error(`The download holds ${shown(name)}, a ${kind(type)}, and a release may hold only files and folders, so nothing was installed.`)
    }
    const target = placeOf(dir, name, seen)
    if (folder) {
      // A folder holds nothing of its own. One that says it does is damaged,
      // and reading what it claims could be any amount.
      if (size !== 0) throw new Error(`The download holds ${shown(name)}, a folder that says it holds data, so it is damaged.`)
      if (target) await mkdir(target, { recursive: true })
      continue
    }
    if (!target) throw new Error(`The download holds ${shown(name)}, a file in place of the release's top folder, so nothing was installed.`)
    if (size > limits.fileBytes) throw new Error(`The download holds ${shown(name)}, which is larger than ${limits.fileBytes / megabyte} MB.`)
    unpacked += size
    if (unpacked > limits.unpackedBytes) throw new Error(`The download unpacks to more than ${limits.unpackedBytes / megabyte} MB.`)
    await mkdir(dirname(target), { recursive: true })
    const mode = octal(header, 100, 8)
    const handle = await open(target, 'w', Number.isNaN(mode) || !(mode & 0o111) ? 0o644 : 0o755)
    try {
      for (let left = size; left > 0; ) {
        const piece = await reader.take(Math.min(left, pieceBytes))
        if (!piece) throw new Error('The download ended before its archive did.')
        for (let written = 0; written < piece.length; ) written += (await handle.write(piece, written)).bytesWritten
        left -= piece.length
      }
    } finally {
      await handle.close()
    }
    if (padded > size && !(await reader.take(padded - size))) throw new Error('The download ended before its archive did.')
    const mtime = octal(header, 136, 12)
    if (Number.isSafeInteger(mtime) && mtime > 0) await utimes(target, mtime, mtime)
  }

  // tar pads the archive out to a whole record with zeros after its end.
  let trailing = 0
  for (;;) {
    const next = await source.next()
    if (next.done) break
    trailing += next.value.length
    if (trailing > limits.trailingBytes) throw new Error('The download goes on long after its archive ends.')
  }
}

/**
 * Unpacks a release's .tar.gz into dir, an empty folder, as tar -xzf with
 * --strip-components=1 would, but taking only plain files and folders.
 * Rejects at the first entry that is anything else, or when the download
 * or what it unpacks to is larger than limits allow.
 * @param {import('node:stream').Readable} source the compressed bytes
 * @param {string} dir
 * @param {Readonly<TarLimits>} [limits]
 */
export async function unpackTarball(source, dir, limits = tarLimits) {
  let received = 0
  const counted = new Transform({
    transform(chunk, _encoding, done) {
      received += chunk.length
      done(received > limits.downloadBytes ? new Error(`The download is larger than ${limits.downloadBytes / megabyte} MB.`) : null, chunk)
    },
  })
  const gunzip = createGunzip()
  const flowing = pipeline(source, counted, gunzip)
  try {
    await unpackEntries(gunzip[Symbol.asyncIterator](), dir, limits)
  } catch (error) {
    gunzip.destroy()
    await flowing.catch(() => {})
    throw error
  }
  await flowing
}

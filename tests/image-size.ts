/**
 * Width and height of a WebP, PNG or JPEG, read from the file's own header,
 * so the partner tests can check a picture's shape without an image library.
 * Returns null for anything else, which the tests report as a bad image.
 */
export function imageSize(file: Buffer): { width: number; height: number } | null {
  if (file.length < 30) return null

  // PNG: the IHDR chunk always comes first, right after the signature.
  if (file.readUInt32BE(0) === 0x89504e47 && file.toString('ascii', 12, 16) === 'IHDR') {
    return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) }
  }

  // WebP: a RIFF file whose first chunk says which of three encodings it is.
  if (file.toString('ascii', 0, 4) === 'RIFF' && file.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = file.toString('ascii', 12, 16)
    if (chunk === 'VP8X') {
      return { width: file.readUIntLE(24, 3) + 1, height: file.readUIntLE(27, 3) + 1 }
    }
    if (chunk === 'VP8 ') {
      return { width: file.readUInt16LE(26) & 0x3fff, height: file.readUInt16LE(28) & 0x3fff }
    }
    if (chunk === 'VP8L') {
      const bits = file.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
    return null
  }

  // JPEG: walk the segments to the first start-of-frame, which holds the size.
  if (file[0] === 0xff && file[1] === 0xd8) {
    let at = 2
    while (at + 9 < file.length) {
      if (file[at] !== 0xff) return null
      const marker = file[at + 1]
      const isFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
      if (isFrame) return { width: file.readUInt16BE(at + 7), height: file.readUInt16BE(at + 5) }
      at += 2 + file.readUInt16BE(at + 2)
    }
  }

  return null
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The fonts and the logo a share card is drawn with, read once per process,
 * the first time a card is drawn.
 *
 * In an app the kit's files are under `platform/`, and in the kit's own
 * repository under `kit/`, so each file is tried at the app's path first.
 * Geist and Instrument Serif are under the SIL Open Font Licence.
 *
 * Static instances, not the variable file: Satori fails to parse the
 * variable Geist and the route answers 500 with a TypeError deep in the font
 * parser. Each path is written out in full inside a plain file read: built
 * from a spread of parts, the build cannot tell which files are read and
 * traces the whole project into the server output.
 */
export interface CardAssets {
  geistRegular: Buffer
  geistBold: Buffer
  serifItalic: Buffer
  /** The full lockup as a data address, trimmed at twice the 224x64 it is drawn at. Never recolour or stretch it. */
  lockup: string
}

function firstThatReads(...reads: (() => Buffer)[]): Buffer {
  let failure: unknown
  for (const read of reads) {
    try {
      return read()
    } catch (error) {
      failure = error
    }
  }
  throw failure
}

let loaded: CardAssets | undefined

export function cardAssets(): CardAssets {
  if (loaded) return loaded
  const cwd = process.cwd()
  const lockup = firstThatReads(
    () => readFileSync(join(cwd, 'platform', 'assets', 'brand', 'wslatl-lockup.png')),
    () => readFileSync(join(cwd, 'kit', 'assets', 'brand', 'wslatl-lockup.png')),
  )
  loaded = {
    geistRegular: firstThatReads(
      () => readFileSync(join(cwd, 'platform', 'assets', 'fonts', 'Geist-400.ttf')),
      () => readFileSync(join(cwd, 'kit', 'assets', 'fonts', 'Geist-400.ttf')),
    ),
    geistBold: firstThatReads(
      () => readFileSync(join(cwd, 'platform', 'assets', 'fonts', 'Geist-700.ttf')),
      () => readFileSync(join(cwd, 'kit', 'assets', 'fonts', 'Geist-700.ttf')),
    ),
    serifItalic: firstThatReads(
      () => readFileSync(join(cwd, 'platform', 'assets', 'fonts', 'InstrumentSerif-Italic.ttf')),
      () => readFileSync(join(cwd, 'kit', 'assets', 'fonts', 'InstrumentSerif-Italic.ttf')),
    ),
    lockup: `data:image/png;base64,${lockup.toString('base64')}`,
  }
  return loaded
}

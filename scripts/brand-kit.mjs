/**
 * Brings the brand kit's pictures into public/brand/ for the /brand page
 * (app/[locale]/brand/page.tsx). Run it when the kit changes, with the path
 * to the kit's folder, the one that holds BRAND-GUIDELINES.md and assets/:
 *
 *   npm run brand:images -- "C:\path\to\Brand Kit"
 *
 * It does two things:
 *
 *   - Copies the PNGs people download into public/brand/downloads/, byte for
 *     byte. The kit says its artwork needs no touching, so nothing is
 *     resized, recompressed or renamed on the way.
 *   - Makes the pictures the page shows, as WebP at twice the size they have
 *     on the page (the site serves public/ as it is, see Images in
 *     README.md). The mark and the lockup are the kit's own PNGs, resized.
 *     The guide's diagrams are cropped to the figure: the guide's English
 *     titles and captions come off, because the page says the same in words,
 *     in every language, and an English picture of a sentence cannot be
 *     translated.
 *
 * tests/brand.test.ts checks every file against data/brand.ts, so a change
 * here that the page does not follow fails the tests.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const root = join(import.meta.dirname, '..')
const logos = 'assets/logo-png'

/** The files people download, as the kit names them, in assets/logo-png/. */
export const downloads = [
  'logo/wslatl-logo-64x64.png',
  'logo/wslatl-logo-128x128.png',
  'logo/wslatl-logo-256x256.png',
  'logo/wslatl-logo-512x512.png',
  'logo/wslatl-logo-1024x1024.png',
  'banner/wslatl-banner-1500x500.png',
  'banner/wslatl-banner-1200x630.png',
  'banner/wslatl-banner-960x540.png',
]

/**
 * Where the guide's do-and-don't diagram keeps its six pictures: the top row
 * holds the three that are right, the bottom row the three that are not.
 * Each is 381px square, and sits above its label.
 */
const tile = (column, row) => ({ left: 60 + column * 400, top: 130 + row * 530, width: 381, height: 381 })

/**
 * The pictures the page shows. `display` is their size on the page; the WebP
 * is twice that. A `crop` is a box in the kit's PNG, in its pixels.
 */
export const pictures = [
  { file: 'kit-mark.webp', from: `${logos}/logo/wslatl-logo-1024x1024.png`, display: [144, 144] },
  { file: 'kit-lockup.webp', from: `${logos}/banner/wslatl-banner-1500x500.png`, display: [330, 110] },
  {
    file: 'kit-clear-space-mark.webp',
    from: 'assets/clearspace-mark.png',
    crop: { left: 294, top: 266, width: 612, height: 640 },
    display: [306, 320],
  },
  {
    file: 'kit-clear-space-lockup.webp',
    from: 'assets/clearspace-lockup.png',
    crop: { left: 232, top: 106, width: 1236, height: 450 },
    // The guide's subtitle runs into the "X" above the figure: keep the X only.
    label: { left: 248, top: 120, width: 32, height: 30 },
    display: [618, 225],
  },
  {
    file: 'kit-minimum-sizes.webp',
    from: 'assets/minsizes.png',
    crop: { left: 41, top: 149, width: 1268, height: 316 },
    display: [634, 158],
  },
  { file: 'kit-do-original.webp', from: 'assets/dos-donts.png', crop: tile(0, 0), display: [190, 190] },
  { file: 'kit-do-dark.webp', from: 'assets/dos-donts.png', crop: tile(1, 0), display: [190, 190] },
  { file: 'kit-do-lockup.webp', from: 'assets/dos-donts.png', crop: tile(2, 0), display: [190, 190] },
  { file: 'kit-dont-stretch.webp', from: 'assets/dos-donts.png', crop: tile(0, 1), display: [190, 190] },
  { file: 'kit-dont-recolor.webp', from: 'assets/dos-donts.png', crop: tile(1, 1), display: [190, 190] },
  { file: 'kit-dont-shadow.webp', from: 'assets/dos-donts.png', crop: tile(2, 1), display: [190, 190] },
]

/**
 * The diagram with its title and caption wiped to white, keeping only the
 * blue "X" that labels the figure, inside `label` (a box in the PNG's own
 * pixels). The guide's text is grey and the X is blue, so the color tells
 * them apart, and the X survives where the caption runs into it.
 */
async function wipeText(input, label) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  // Everything down to the bottom of the label box: the figure starts below it.
  for (let y = 0; y < label.top + label.height; y++) {
    for (let x = 0; x < width; x++) {
      const at = (y * width + x) * channels
      const inLabel = x >= label.left && x < label.left + label.width && y >= label.top
      const blue = data[at + 2] - data[at] > 70
      if (!(inLabel && blue)) data[at] = data[at + 1] = data[at + 2] = 255
    }
  }
  return sharp(data, { raw: { width, height, channels } })
}

async function makePicture(kit, picture) {
  const [width, height] = picture.display.map((size) => size * 2)
  let image = picture.label ? await wipeText(join(kit, picture.from), picture.label) : sharp(join(kit, picture.from))
  if (picture.crop) image = image.extract(picture.crop)
  const info = await image
    .resize(width, height, { kernel: 'lanczos3' })
    .webp({ quality: 90, alphaQuality: 100, smartSubsample: true, effort: 6 })
    .toFile(join(root, 'public', 'brand', picture.file))
  console.log(`public/brand/${picture.file}: ${info.width}x${info.height}, ${info.size} bytes`)
}

async function main() {
  const kit = process.argv[2] && resolve(process.argv[2])
  const needed = [...downloads.map((file) => `${logos}/${file}`), ...pictures.map((picture) => picture.from)]
  if (!kit || needed.some((file) => !existsSync(join(kit, file)))) {
    console.error('Give the path to the brand kit folder, the one with assets/ in it:')
    console.error('  npm run brand:images -- "C:\\path\\to\\Brand Kit"')
    process.exit(1)
  }

  mkdirSync(join(root, 'public', 'brand', 'downloads'), { recursive: true })
  for (const file of downloads) {
    const name = file.split('/').pop()
    copyFileSync(join(kit, logos, file), join(root, 'public', 'brand', 'downloads', name))
    console.log(`public/brand/downloads/${name}: copied as it is`)
  }
  for (const picture of pictures) await makePicture(kit, picture)
}

// Only when run, not when the tests import the lists above.
if (process.argv[1]?.endsWith('brand-kit.mjs')) await main()

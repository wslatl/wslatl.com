/**
 * Makes banner-card.webp, the small copy of every partner banner that the
 * cards on /partners load (partnerCardBanner in lib/partners.ts), beside the
 * banner in public/partners/<slug>/. Run it after adding or changing a
 * banner: `npm run partners:cards`. tests/partners.test.ts fails until every
 * banner has its copy at the right size.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const root = join(import.meta.dirname, '..')
// cardBannerSize in lib/partners.ts; the tests check the two agree.
const width = 720
const height = 240

const data = readFileSync(join(root, 'data', 'partners.ts'), 'utf8')
const banners = [...data.matchAll(/banner: '\/partners\/([a-z0-9-]+)\/([a-z0-9-]+\.(?:webp|png|jpe?g))'/g)]
for (const [, slug, file] of banners) {
  const info = await sharp(join(root, 'public', 'partners', slug, file))
    .resize(width, height, { fit: 'cover' })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(root, 'public', 'partners', slug, 'banner-card.webp'))
  console.log(`public/partners/${slug}/banner-card.webp: ${info.width}x${info.height}, ${info.size} bytes`)
}

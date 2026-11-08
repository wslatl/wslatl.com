/**
 * Makes the small copies of every partner's pictures, beside them in
 * public/partners/<slug>/: banner-card.webp, which the cards on /partners and
 * the home page load (partnerCardBanner in lib/partners.ts), and
 * avatar-strip.webp, which the trusted clients strip on the home page loads
 * (partnerStripAvatar). Run it after adding or changing a banner or an
 * avatar: `npm run partners:cards`. tests/partners.test.ts fails until every
 * picture has its copy at the right size.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const root = join(import.meta.dirname, '..')
// cardBannerSize and stripAvatarSize in lib/partners.ts; the tests check they agree.
const width = 720
const height = 240
const stripSize = 80

const data = readFileSync(join(root, 'data', 'partners.ts'), 'utf8')
const pictures = (field) => [...data.matchAll(new RegExp(`${field}: '/partners/([a-z0-9-]+)/([a-z0-9-]+\\.(?:webp|png|jpe?g))'`, 'g'))]

for (const [, slug, file] of pictures('banner')) {
  const info = await sharp(join(root, 'public', 'partners', slug, file))
    .resize(width, height, { fit: 'cover' })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(root, 'public', 'partners', slug, 'banner-card.webp'))
  console.log(`public/partners/${slug}/banner-card.webp: ${info.width}x${info.height}, ${info.size} bytes`)
}

for (const [, slug, file] of pictures('avatar')) {
  const info = await sharp(join(root, 'public', 'partners', slug, file))
    .resize(stripSize, stripSize, { fit: 'cover' })
    .webp({ quality: 85, effort: 6 })
    .toFile(join(root, 'public', 'partners', slug, 'avatar-strip.webp'))
  console.log(`public/partners/${slug}/avatar-strip.webp: ${info.width}x${info.height}, ${info.size} bytes`)
}

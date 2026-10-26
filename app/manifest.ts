import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

/**
 * /manifest.webmanifest: the name and icons a phone or browser uses when the
 * site is saved to a home screen. The icons are the same white mark on the
 * near-black tile as the favicon, and the maskable one keeps the mark inside
 * the circle Android crops it to.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand,
    short_name: siteConfig.brand,
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

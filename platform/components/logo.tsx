/// <reference types="next/image-types/global" />
import mark32 from '../assets/brand/wslatl-mark-32.png'
import mark64 from '../assets/brand/wslatl-mark-64.png'
import { cn } from '../lib/cn'

/** A bundler gives an image import as an object with `src`; a test runner gives the address itself. */
function urlOf(image: unknown): string {
  return typeof image === 'string' ? image : (image as { src: string }).src
}

/**
 * The WSLATL mark as the brand kit ships it, at 32px: the smallest the kit
 * allows in a header (32 to 40), the same on every site. The 64px file is
 * offered to sharper screens. Decorative: the link around it carries the name.
 */
export function Logo({ className }: { className?: string }) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- the files are exported at the size they show
    <img
      src={urlOf(mark32)}
      srcSet={`${urlOf(mark64)} 2x`}
      alt=""
      width={32}
      height={32}
      className={cn('size-8', className)}
    />
  )
}

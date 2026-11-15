/**
 * /api and everything under it. The site has no API, and the kit's proxy
 * gives these addresses no language, as it never does for /api, so without
 * this they would reach app/[locale] as if "api" were one. A plain 404, with
 * nothing in it, for anything asked for here.
 */
export function GET() {
  return new Response(null, { status: 404 })
}

export const HEAD = GET

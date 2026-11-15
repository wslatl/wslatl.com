/**
 * /.well-known/ and everything under it. The site publishes nothing there
 * yet (a file put in public/.well-known/ is served before this), and the
 * kit's proxy gives these addresses no language, so without this they would
 * reach app/[locale] as if ".well-known" were one. A plain 404, with nothing
 * in it.
 */
export function GET() {
  return new Response(null, { status: 404 })
}

export const HEAD = GET

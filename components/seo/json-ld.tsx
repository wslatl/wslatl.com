/**
 * Structured data for search engines. Only ever fed static, hand-authored
 * objects from this codebase, never user input. The `<` escape still guards
 * against a literal `</script>` inside a string closing the tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

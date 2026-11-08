/**
 * A text from i18n/copy with its `{0}`, `{1}` marks filled in with English the
 * page quotes: a line of our English copy, or the "Private Hosting" in the
 * logo. Each one is marked lang="en", so a screen reader says it in English
 * even in the middle of a Spanish sentence, and translate="no", so a browser
 * that translates the page leaves it alone. The marks stay in every language,
 * placed wherever that language wants them (tests/i18n.test.ts checks they all
 * arrive).
 */
export function WithEnglish({ text, english }: { text: string; english: readonly string[] }) {
  return (
    <>
      {text.split(/\{(\d+)\}/).map((part, index) =>
        // split() puts what each {n} captured at the odd places.
        index % 2 === 0 ? (
          part
        ) : (
          <span key={index} lang="en" translate="no">
            {english[Number(part)]}
          </span>
        ),
      )}
    </>
  )
}

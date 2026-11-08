import { Check, X, type LucideIcon } from 'lucide-react'
import { BrandSection, SubSection } from '@/components/brand/brand-section'
import { WithEnglish } from '@/components/brand/with-english'
import { voiceExamples, voiceRuleExamples } from '@/data/brand'
import { copy } from '@/i18n/copy'

/** A heading and the words under it, as small pills, with an icon beside the heading so the two lists never differ by color alone. */
function Words({ heading, words, icon: Icon }: { heading: string; words: readonly string[]; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border bg-card/30 p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-semibold text-foreground">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-link" />
        {heading}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {words.map((word) => (
          <li key={word} className="rounded-full border px-3.5 py-1.5 text-sm text-foreground">
            {word}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Part 4: the guide's voice rules, and its "instead of / write" examples. The
 * examples, and the English the rules quote, are about English copy, so they
 * stay English in every language and are marked lang="en".
 */
export function VoiceSection() {
  const t = copy().brand.voice
  return (
    <BrandSection id="voice" number="4" title={t.heading} intro={`${t.intro} ${t.scope}`}>
      <div className="grid gap-5 md:grid-cols-2">
        <Words heading={t.areHeading} words={t.are} icon={Check} />
        <Words heading={t.notHeading} words={t.not} icon={X} />
      </div>

      <SubSection title={t.rulesHeading}>
        <ol className="max-w-2xl space-y-5 pt-1">
          {t.rules.map((rule, index) => (
            <li key={rule.title} className="flex gap-4">
              <span aria-hidden="true" className="w-4 shrink-0 font-serif text-2xl leading-tight text-link italic">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">{rule.title}</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  <WithEnglish text={rule.body} english={voiceRuleExamples[index]} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </SubSection>

      <SubSection title={t.examplesHeading}>
        <ul className="grid gap-4 pt-1 md:grid-cols-2">
          {voiceExamples().map((example) => (
            <li key={example.insteadOf} className="rounded-xl border bg-card/30 p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{t.insteadOf}</p>
              <p lang="en" translate="no" className="mt-1 text-muted-foreground">
                {example.insteadOf}
              </p>
              <p className="mt-4 text-xs font-medium tracking-wide text-link uppercase">{t.write}</p>
              <p lang="en" translate="no" className="mt-1 text-lg leading-snug font-medium text-foreground">
                {example.write}
              </p>
            </li>
          ))}
        </ul>
      </SubSection>
    </BrandSection>
  )
}

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { locales, type Locale } from '@/i18n/config'
import { copyFor } from '@/i18n/copy'

/**
 * The referral deal is: the person who signs up with a code gets a discount on
 * their first invoice only, and the person who referred them gets a one-time
 * account credit. The billing panel does nothing more than that, so no page may
 * promise more. These tests read the words, in every language.
 */

const root = join(__dirname, '..')

/** Where page text lives. config/ and tests/ are left out: they explain the rule, so they quote it. */
const textDirectories = ['app', 'components', 'content', 'data', 'i18n', 'lib']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|json)$/.test(name) ? [path] : []
  })
}

/** The text of a file as one lowercase line, so a sentence wrapped over two lines still reads as one. */
function flat(path: string): string {
  return readFileSync(path, 'utf8').replace(/\s+/g, ' ').toLowerCase()
}

/**
 * Wording that promises a discount beyond the first invoice, per language: a
 * discount on every or each invoice (or renewal), or one that lasts while the
 * partner or referrer stays in the program.
 */
const promisesMoreThanOneInvoice: { name: string; pattern: RegExp }[] = [
  // English
  { name: 'en: discount on every invoice', pattern: /\b(?:every|each|all) (?:future |later )?(?:invoice|renewal)s?\b[^.]{0,120}\b(?:discount|off)\b/ },
  { name: 'en: every invoice discount', pattern: /\b(?:discount|off)\b[^.]{0,120}\b(?:every|each|all) (?:future |later )?(?:invoice|renewal)s?\b/ },
  { name: 'en: as long as the partner', pattern: /\bas long as (?:that |this |the |a |your |their )?(?:partner|referrer)\b/ },
  { name: 'en: stays in the program', pattern: /\b(?:stays?|remains?|continues?) in the (?:partner |referral )?program\b/ },
  // Deutsch
  { name: 'de: Rabatt auf jeder Rechnung', pattern: /\b(?:jeder|jede|allen) (?:weiteren )?(?:rechnung|verlängerung)(?:en)?\b[^.]{0,120}\brabatt\b/ },
  { name: 'de: jeder Rechnung Rabatt', pattern: /\brabatt\b[^.]{0,120}\b(?:jeder|jede|allen) (?:weiteren )?(?:rechnung|verlängerung)/ },
  { name: 'de: solange der Partner', pattern: /\bsolange (?:dieser |der |ein |du )?(?:partner|im programm)/ },
  { name: 'de: im Programm bleibt', pattern: /\bim programm bleib/ },
  // Español
  { name: 'es: descuento en cada factura', pattern: /\b(?:cada|todas las) (?:factura|renovación|renovaciones)s?\b[^.]{0,120}\bdescuento\b/ },
  { name: 'es: cada factura descuento', pattern: /\bdescuento\b[^.]{0,120}\b(?:cada|todas las) (?:factura|renovaci)/ },
  { name: 'es: mientras el socio', pattern: /\bmientras (?:ese |este |el |un |tu )?socio\b/ },
  { name: 'es: siga en el programa', pattern: /\bsigas? en el programa\b/ },
  // Français
  { name: 'fr: réduction à chaque facture', pattern: /\b(?:chaque|toutes les) (?:facture|renouvellement)s?\b[^.]{0,120}\br[ée]duction\b/ },
  { name: 'fr: chaque facture réduction', pattern: /\br[ée]duction\b[^.]{0,120}\b(?:chaque|toutes les) (?:facture|renouvellement)/ },
  { name: 'fr: tant que le partenaire', pattern: /\btant que (?:ce |le |un |cette |votre )?partenaire (?:reste|demeure|est)\b/ },
  { name: 'fr: reste dans le programme', pattern: /\b(?:reste|restez|demeure) dans le programme\b/ },
  // Português
  { name: 'pt: desconto em todas as faturas', pattern: /\b(?:cada|todas as) (?:fatura|renovação|renovações)s?\b[^.]{0,120}\bdesconto\b/ },
  { name: 'pt: todas as faturas desconto', pattern: /\bdesconto\b[^.]{0,120}\b(?:cada|todas as) (?:fatura|renova)/ },
  { name: 'pt: enquanto o parceiro', pattern: /\benquanto (?:esse |este |o |um |você )?(?:parceiro|continuar)/ },
  { name: 'pt: continuar no programa', pattern: /\bcontinu(?:ar|e|em) no programa\b/ },
]

describe('the referral discount in the site text', () => {
  const files = textDirectories.flatMap((dir) => sourceFiles(join(root, dir)))

  it('finds the page text it is meant to read', () => {
    expect(files.length).toBeGreaterThan(50)
    expect(files.some((file) => file.endsWith('copy\\en.ts') || file.endsWith('copy/en.ts'))).toBe(true)
  })

  it('never promises a discount on every invoice, or for as long as the partner stays in the program', () => {
    const found: string[] = []
    for (const file of files) {
      const text = flat(file)
      for (const { name, pattern } of promisesMoreThanOneInvoice) {
        if (pattern.test(text)) found.push(`${file.slice(root.length + 1)}: ${name}`)
      }
    }
    expect(found).toEqual([])
  })

  it('catches the old wording, in every language, so the check above can fail', () => {
    const oldWording: Record<Locale, string[]> = {
      en: [
        'you get 10% off your hosting on every invoice, except dedicated servers, for as long as that partner stays in the program.',
        'gets 10% off their hosting on every invoice, for as long as you stay in the program',
      ],
      de: [
        'erhalte auf jeder Rechnung 10% Rabatt auf dein Hosting, außer bei Dedicated Servern, solange dieser Partner im Programm bleibt.',
      ],
      es: [
        'obtén un 10% de descuento en tu hosting en cada factura, salvo en servidores dedicados, mientras ese socio siga en el programa.',
      ],
      fr: [
        'obtenez 10% de réduction sur votre hébergement à chaque facture, sauf sur les serveurs dédiés, tant que ce partenaire reste dans le programme.',
      ],
      pt: [
        'ganhe 10% de desconto na sua hospedagem em todas as faturas, exceto em servidores dedicados, enquanto esse parceiro continuar no programa.',
      ],
    }
    for (const locale of locales) {
      for (const sentence of oldWording[locale]) {
        const text = sentence.replace(/\s+/g, ' ').toLowerCase()
        expect(
          promisesMoreThanOneInvoice.some(({ pattern }) => pattern.test(text)),
          `${locale}: ${sentence}`,
        ).toBe(true)
      }
    }
  })
})

describe('what the partner pages say about the deal', () => {
  /** The words for "first invoice" and for "once", per language. */
  const first: Record<Locale, RegExp> = {
    en: /first invoice/i,
    de: /erste Rechnung/i,
    es: /primera factura/i,
    fr: /première facture/i,
    pt: /primeira fatura/i,
  }
  const once: Record<Locale, RegExp> = {
    en: /one-time/i,
    de: /einmalig/i,
    es: /una sola vez/i,
    fr: /une seule fois/i,
    pt: /uma única vez/i,
  }

  const appliesOnce: Record<Locale, RegExp> = {
    en: /once, to that first invoice only/i,
    de: /nur einmal/i,
    es: /una sola vez/i,
    fr: /une seule fois/i,
    pt: /uma única vez/i,
  }

  it('limits the discount to the first invoice wherever it is offered, in every language', () => {
    for (const locale of locales) {
      const t = copyFor(locale).partners
      const offers = {
        'page description': t.metaDescription('10%'),
        'page intro': t.intro('10%'),
        'program discount': t.program.discount.body('10%'),
        'profile description': t.profile.metaDescription('EXAMPLE10', '10%'),
        'profile discount': t.profile.discount('10%'),
      }
      for (const [where, text] of Object.entries(offers)) {
        expect(text, `${locale} ${where}`).toMatch(first[locale])
      }
      expect(t.program.discount.title('10%'), `${locale} program discount title`).toMatch(first[locale])
    }
  })

  it('says the discount applies once, on the places that explain the program', () => {
    for (const locale of locales) {
      const t = copyFor(locale).partners
      expect(t.program.discount.body('10%'), `${locale} program`).toMatch(appliesOnce[locale])
      expect(t.profile.discount('10%'), `${locale} profile`).toMatch(appliesOnce[locale])
    }
  })

  it('pays the person who referred them one time, once the first invoice is paid, in every language', () => {
    for (const locale of locales) {
      const credit = copyFor(locale).partners.program.credit.body
      expect(credit, locale).toMatch(first[locale])
      expect(credit, locale).toMatch(once[locale])
    }
  })

  it('does not promise a number for the credit, which is set for each referrer in the billing panel', () => {
    for (const locale of locales) {
      expect(copyFor(locale).partners.program.credit.body, locale).not.toMatch(/\d/)
    }
  })

  it('shows the code only if the partner wants it, in the line about the profile', () => {
    const conditional: Record<Locale, RegExp> = {
      en: /if you want/i,
      de: /auf Wunsch/i,
      es: /si quieres/i,
      fr: /si vous le souhaitez/i,
      pt: /se você quiser/i,
    }
    for (const locale of locales) {
      expect(copyFor(locale).partners.program.profile.body, locale).toMatch(conditional[locale])
    }
  })
})

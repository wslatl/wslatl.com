import { describe, expect, it } from 'vitest'
import { foldText, slugify } from '@/lib/utils'

describe('slugify', () => {
  it('turns headings into stable anchors', () => {
    expect(slugify('Who We Are')).toBe('who-we-are')
    expect(slugify('Overview & Scope')).toBe('overview-and-scope')
    expect(slugify('Survival & Sandbox')).toBe('survival-and-sandbox')
    expect(slugify('  7. Changes to This SLA  ')).toBe('7-changes-to-this-sla')
  })

  it('strips accents rather than dropping the letter', () => {
    expect(slugify('Caf' + String.fromCharCode(0xe9))).toBe('cafe')
  })

  it('spells out letters that are not an accented a to z', () => {
    // A German heading used to slug as "kontoschlie-ung", because NFKD
    // leaves these whole and everything outside a to z becomes a hyphen.
    expect(slugify('Kontoschlie' + String.fromCharCode(0xdf) + 'ung')).toBe('kontoschliessung')
    expect(slugify('Verst' + String.fromCharCode(0xf6) + String.fromCharCode(0xdf) + 'e')).toBe('verstosse')
  })
})

describe('foldText', () => {
  it('takes the accents off, so a search typed without them still matches', () => {
    const o = String.fromCharCode(0xf3)
    expect(foldText(`Construcci${o}n y simulaci${o}n`)).toBe('construccion y simulacion')
    expect(foldText(String.fromCharCode(0xdc) + 'berleben')).toBe('uberleben')
    expect(foldText('Counter-Strike 2')).toBe('counter-strike 2')
  })
})

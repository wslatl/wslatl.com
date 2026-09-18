import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/utils'

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
})

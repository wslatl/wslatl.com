import { describe, expect, it } from 'vitest'
import { formatWait } from '@/components/admin/format'

// The login form says how long to wait after too many attempts, from the
// Retry-After header that /admin/api/login sends with its 429.
describe('the wait after too many attempts', () => {
  it('reads Retry-After as the time left, rounded up', () => {
    expect(formatWait('900')).toBe('15 minutes')
    expect(formatWait('899')).toBe('15 minutes')
    expect(formatWait('61')).toBe('2 minutes')
    expect(formatWait('60')).toBe('1 minute')
    expect(formatWait('59')).toBe('59 seconds')
    expect(formatWait('2')).toBe('2 seconds')
    expect(formatWait('1')).toBe('1 second')
  })

  it('says nothing when the header holds no number of seconds', () => {
    for (const value of [null, '', '0', '-5', 'soon', 'Wed, 21 Oct 2026 07:28:00 GMT']) {
      expect(formatWait(value), String(value)).toBeNull()
    }
  })
})

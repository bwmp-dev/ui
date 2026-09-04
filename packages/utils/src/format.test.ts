import { describe, expect, it } from 'vitest'
import { formatBytes, formatDuration, formatRelativeTime, truncateMiddle } from './format'
import { isExternalUrl, joinPath, toQueryString } from './url'
import { safeJsonParse } from './json'

describe('formatBytes', () => {
  it('keeps small values whole and scales larger ones', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(999)).toBe('999 B')
    expect(formatBytes(1000)).toBe('1 kB')
    expect(formatBytes(1_500_000)).toBe('1.5 MB')
  })

  it('handles negatives and non-finite input', () => {
    expect(formatBytes(-2000)).toBe('-2 kB')
    expect(formatBytes(Number.NaN)).toBe('—')
  })
})

describe('formatDuration', () => {
  it('switches unit with magnitude', () => {
    expect(formatDuration(340)).toBe('340ms')
    expect(formatDuration(1000)).toBe('1s')
    expect(formatDuration(90_000)).toBe('1m 30s')
    expect(formatDuration(4_320_000)).toBe('1h 12m')
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-01-01T12:00:00Z')

  it('describes past and future against a fixed reference', () => {
    expect(formatRelativeTime(new Date('2026-01-01T11:00:00Z'), now, 'en-GB')).toBe('1 hour ago')
    expect(formatRelativeTime(new Date('2026-01-03T12:00:00Z'), now, 'en-GB')).toBe('in 2 days')
  })

  it('collapses sub-second differences', () => {
    expect(formatRelativeTime(new Date('2026-01-01T11:59:59.700Z'), now, 'en-GB')).toBe('just now')
  })
})

describe('truncateMiddle', () => {
  it('keeps both ends legible', () => {
    expect(truncateMiddle('short', 24)).toBe('short')
    expect(truncateMiddle('dev_01HQZX9K4M7NBP3RTVWY', 12)).toBe('dev_01…RTVWY')
  })
})

describe('toQueryString', () => {
  it('drops null and undefined instead of stringifying them', () => {
    expect(toQueryString({ a: 1, b: null, c: undefined, d: false })).toBe('a=1&d=false')
  })

  it('repeats the key for array values', () => {
    expect(toQueryString({ tag: ['a', 'b'] })).toBe('tag=a&tag=b')
  })
})

describe('joinPath', () => {
  it('collapses duplicate slashes without touching the scheme', () => {
    expect(joinPath('https://api.test/', '/v1/', 'devices')).toBe('https://api.test/v1/devices')
    expect(joinPath('/v1', 42)).toBe('/v1/42')
  })
})

describe('isExternalUrl', () => {
  it('treats other origins and non-http schemes as external', () => {
    expect(isExternalUrl('https://example.com/a', 'https://app.test')).toBe(true)
    expect(isExternalUrl('https://app.test/a', 'https://app.test')).toBe(false)
    expect(isExternalUrl('/settings', 'https://app.test')).toBe(false)
    expect(isExternalUrl('mailto:a@b.test')).toBe(true)
  })
})

describe('safeJsonParse', () => {
  it('returns the error rather than swallowing it', () => {
    const parsed = safeJsonParse<{ a: number }>('{"a":1}')
    expect(parsed).toEqual({ ok: true, value: { a: 1 } })

    const failed = safeJsonParse('{oops')
    expect(failed.ok).toBe(false)
    if (!failed.ok) expect(failed.error).toBeInstanceOf(Error)
  })
})
